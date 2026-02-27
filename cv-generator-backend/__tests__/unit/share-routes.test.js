/**
 * Tests comprehensivos para Share Routes y Controller
 * Fase 4: Testing de compartir CVs públicamente
 */

const request = require('supertest');
const express = require('express');
const cvRoutes = require('../../src/routes/cv');
const shareRoutes = require('../../src/routes/share');
const CV = require('../../src/models/CV');
const User = require('../../src/models/User');
const Analytics = require('../../src/models/Analytics');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock de modelos
jest.mock('../../src/models/CV');
jest.mock('../../src/models/User');
jest.mock('../../src/models/Analytics');
jest.mock('bcryptjs');

// Crear app de express para testing
const app = express();
app.use(express.json());
app.use('/api/cv', cvRoutes);
app.use('/api/share', shareRoutes);

describe('Share Routes - Comprehensive Tests', () => {
  let mockUser;
  let mockCV;
  let validToken;

  beforeEach(() => {
    jest.clearAllMocks();

    // Usuario mock
    mockUser = {
      _id: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
      name: 'Test User',
      plan: 'free',
      isLocked: jest.fn().mockReturnValue(false)
    };

    // CV mock
    mockCV = {
      _id: '507f1f77bcf86cd799439022',
      user: mockUser._id,
      title: 'Mi CV Público',
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        title: 'Developer'
      },
      experience: [],
      education: [],
      skills: [],
      design: { template: 'modern' },
      sharing: {
        isPublic: false,
        publicUrl: 'abc123xy',
        password: null,
        expiresAt: null,
        allowDownload: true
      },
      analytics: { views: 10, downloads: 3 },
      publicFullUrl: 'https://metgo3d-cv.vercel.app/cv/abc123xy',
      save: jest.fn().mockResolvedValue(true),
      incrementViews: jest.fn().mockResolvedValue(true),
      incrementDownloads: jest.fn().mockResolvedValue(true),
      toExportJSON: jest.fn().mockReturnValue({
        title: 'Mi CV',
        personalInfo: { firstName: 'John' }
      })
    };

    // Token JWT válido
    validToken = jwt.sign(
      { id: mockUser._id, email: mockUser.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    // Setup default mocks
    User.findById.mockResolvedValue(mockUser);
    CV.findOne.mockResolvedValue(mockCV);
    CV.findPublic = jest.fn().mockResolvedValue(mockCV);
    Analytics.create.mockResolvedValue({ _id: 'analytics-id' });
    bcrypt.genSalt.mockResolvedValue('salt');
    bcrypt.hash.mockResolvedValue('hashedPassword');
    bcrypt.compare.mockResolvedValue(true);
  });

  describe('GET /api/cv/:id/share - Obtener configuración', () => {
    test('debería obtener configuración de compartir del CV', async () => {
      CV.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockCV)
      });

      const response = await request(app)
        .get(`/api/cv/${mockCV._id}/share`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('sharing');
      expect(response.body.data.sharing).toHaveProperty('isPublic');
      expect(response.body.data.sharing).toHaveProperty('publicUrl');
      expect(response.body.data.sharing).toHaveProperty('hasPassword');
    });

    test('debería indicar si el CV tiene contraseña sin revelarla', async () => {
      const cvWithPassword = {
        ...mockCV,
        sharing: {
          ...mockCV.sharing,
          password: 'hashedPassword123'
        }
      };
      
      CV.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(cvWithPassword)
      });

      const response = await request(app)
        .get(`/api/cv/${mockCV._id}/share`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.body.data.sharing.hasPassword).toBe(true);
      expect(response.body.data.sharing).not.toHaveProperty('password');
    });

    test('debería retornar 404 si el CV no existe', async () => {
      CV.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      const response = await request(app)
        .get('/api/cv/507f1f77bcf86cd799439099/share')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/cv/:id/share - Actualizar configuración', () => {
    test('debería hacer el CV público', async () => {
      const response = await request(app)
        .put(`/api/cv/${mockCV._id}/share`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ isPublic: true });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('actualizada');
      expect(mockCV.save).toHaveBeenCalled();
      expect(Analytics.create).toHaveBeenCalled();
    });

    test('debería generar URL pública si no existe', async () => {
      const cvWithoutUrl = {
        ...mockCV,
        sharing: { isPublic: false, publicUrl: null }
      };
      CV.findOne.mockResolvedValue(cvWithoutUrl);

      const response = await request(app)
        .put(`/api/cv/${mockCV._id}/share`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ isPublic: true });

      expect(response.status).toBe(200);
      expect(cvWithoutUrl.sharing.publicUrl).toBeTruthy();
    });

    test('debería establecer contraseña para CV público', async () => {
      const response = await request(app)
        .put(`/api/cv/${mockCV._id}/share`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ password: 'secretPassword123' });

      expect(response.status).toBe(200);
      expect(bcrypt.hash).toHaveBeenCalledWith('secretPassword123', 'salt');
      expect(response.body.data.sharing.hasPassword).toBe(true);
    });

    test('debería actualizar configuración sin cambiar password si no se proporciona', async () => {
      mockCV.sharing.password = 'previousHashedPassword';

      const response = await request(app)
        .put(`/api/cv/${mockCV._id}/share`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ isPublic: true });

      expect(response.status).toBe(200);
      expect(mockCV.save).toHaveBeenCalled();
    });

    test('debería establecer fecha de expiración', async () => {
      const expiryDate = new Date('2025-12-31');
      
      const response = await request(app)
        .put(`/api/cv/${mockCV._id}/share`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ expiresAt: expiryDate.toISOString() });

      expect(response.status).toBe(200);
      expect(mockCV.sharing.expiresAt).toBeTruthy();
    });

    test('debería deshabilitar descargas públicas', async () => {
      const response = await request(app)
        .put(`/api/cv/${mockCV._id}/share`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ allowDownload: false });

      expect(response.status).toBe(200);
      expect(mockCV.sharing.allowDownload).toBe(false);
    });

    test('debería retornar 404 si el CV no existe', async () => {
      CV.findOne.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/cv/507f1f77bcf86cd799439088/share')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ isPublic: true });

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/cv/:id/share/regenerate-url - Regenerar URL', () => {
    test('debería regenerar la URL pública del CV', async () => {
      const oldUrl = mockCV.sharing.publicUrl;

      const response = await request(app)
        .post(`/api/cv/${mockCV._id}/share/regenerate-url`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('regenerada');
      expect(response.body.data).toHaveProperty('publicUrl');
      expect(response.body.data).toHaveProperty('fullUrl');
      expect(mockCV.save).toHaveBeenCalled();
    });

    test('debería retornar 404 si el CV no existe', async () => {
      CV.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/cv/507f1f77bcf86cd799439077/share/regenerate-url')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/share/:publicUrl - Obtener CV público', () => {
    test('debería obtener un CV público sin contraseña', async () => {
      const response = await request(app)
        .get('/api/share/abc123xy');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('cv');
      expect(response.body.data.cv).toHaveProperty('title');
      expect(response.body.data.cv).toHaveProperty('personalInfo');
      expect(mockCV.incrementViews).toHaveBeenCalled();
      expect(Analytics.create).toHaveBeenCalledWith(
        expect.objectContaining({ event: 'view' })
      );
    });

    test('debería retornar 404 si el CV no existe o no es público', async () => {
      CV.findPublic.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/share/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('no encontrado');
    });

    test('debería requerir autenticación para CV con contraseña', async () => {
      const cvWithPassword = {
        ...mockCV,
        sharing: {
          ...mockCV.sharing,
          password: 'hashedPassword123'
        }
      };
      CV.findPublic.mockResolvedValue(cvWithPassword);

      const response = await request(app)
        .get('/api/share/abc123xy');

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('PASSWORD_REQUIRED');
    });

    test('debería permitir acceso con token de autenticación válido', async () => {
      const cvWithPassword = {
        ...mockCV,
        sharing: {
          ...mockCV.sharing,
          password: 'hashedPassword123'
        },
        incrementViews: jest.fn().mockResolvedValue(true)
      };
      CV.findPublic.mockResolvedValue(cvWithPassword);

      const authToken = Buffer.from('abc123xy:hashedPassword123').toString('base64');

      const response = await request(app)
        .get('/api/share/abc123xy')
        .set('X-CV-Auth', authToken);

      expect(response.status).toBe(200);
      expect(cvWithPassword.incrementViews).toHaveBeenCalled();
    });

    test('debería rechazar token de autenticación inválido', async () => {
      const cvWithPassword = {
        ...mockCV,
        sharing: {
          ...mockCV.sharing,
          password: 'hashedPassword123'
        }
      };
      CV.findPublic.mockResolvedValue(cvWithPassword);

      const response = await request(app)
        .get('/api/share/abc123xy')
        .set('X-CV-Auth', 'invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.code).toBe('INVALID_PASSWORD');
    });
  });

  describe('POST /api/share/:publicUrl/verify - Verificar contraseña', () => {
    test('debería verificar contraseña correcta y retornar token', async () => {
      const cvWithPassword = {
        ...mockCV,
        sharing: {
          ...mockCV.sharing,
          password: 'hashedPassword123'
        }
      };
      
      CV.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(cvWithPassword)
      });

      const response = await request(app)
        .post('/api/share/abc123xy/verify')
        .send({ password: 'correctPassword' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(bcrypt.compare).toHaveBeenCalledWith('correctPassword', 'hashedPassword123');
    });

    test('debería rechazar contraseña incorrecta', async () => {
      bcrypt.compare.mockResolvedValue(false);
      
      const cvWithPassword = {
        ...mockCV,
        sharing: {
          ...mockCV.sharing,
          password: 'hashedPassword123'
        }
      };
      
      CV.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(cvWithPassword)
      });

      const response = await request(app)
        .post('/api/share/abc123xy/verify')
        .send({ password: 'wrongPassword' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('incorrecta');
    });

    test('debería indicar si el CV no requiere contraseña', async () => {
      CV.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockCV)
      });

      const response = await request(app)
        .post('/api/share/abc123xy/verify')
        .send({ password: 'anyPassword' });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('no requiere');
      expect(response.body.data.token).toBeNull();
    });

    test('debería retornar 404 si el CV no existe', async () => {
      CV.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      const response = await request(app)
        .post('/api/share/nonexistent/verify')
        .send({ password: 'test' });

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/share/:publicUrl/download - Descargar CV público', () => {
    test('debería descargar CV público sin contraseña', async () => {
      const response = await request(app)
        .get('/api/share/abc123xy/download');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeTruthy();
      expect(mockCV.toExportJSON).toHaveBeenCalled();
      expect(mockCV.incrementDownloads).toHaveBeenCalled();
      expect(Analytics.create).toHaveBeenCalledWith(
        expect.objectContaining({ event: 'download' })
      );
    });

    test('debería retornar 403 si las descargas están deshabilitadas', async () => {
      const cvNoDownload = {
        ...mockCV,
        sharing: {
          ...mockCV.sharing,
          allowDownload: false
        }
      };
      CV.findPublic.mockResolvedValue(cvNoDownload);

      const response = await request(app)
        .get('/api/share/abc123xy/download');

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('no permite descargas');
    });

    test('debería requerir autenticación para descargar CV con contraseña', async () => {
      const cvWithPassword = {
        ...mockCV,
        sharing: {
          ...mockCV.sharing,
          password: 'hashedPassword123'
        }
      };
      CV.findPublic.mockResolvedValue(cvWithPassword);

      const response = await request(app)
        .get('/api/share/abc123xy/download');

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('requerida');
    });

    test('debería permitir descarga con token válido', async () => {
      const cvWithPassword = {
        ...mockCV,
        sharing: {
          ...mockCV.sharing,
          password: 'hashedPassword123'
        },
        incrementDownloads: jest.fn().mockResolvedValue(true),
        toExportJSON: jest.fn().mockReturnValue({ title: 'CV' })
      };
      CV.findPublic.mockResolvedValue(cvWithPassword);

      const authToken = Buffer.from('abc123xy:hashedPassword123').toString('base64');

      const response = await request(app)
        .get('/api/share/abc123xy/download')
        .set('X-CV-Auth', authToken);

      expect(response.status).toBe(200);
      expect(cvWithPassword.incrementDownloads).toHaveBeenCalled();
    });

    test('debería retornar 404 si el CV no existe', async () => {
      CV.findPublic.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/share/nonexistent/download');

      expect(response.status).toBe(404);
    });

    test('debería registrar formato de descarga en analytics', async () => {
      await request(app)
        .get('/api/share/abc123xy/download?format=pdf');

      expect(Analytics.create).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'download',
          metadata: expect.objectContaining({ format: 'pdf' })
        })
      );
    });
  });

  describe('Edge Cases y Validaciones', () => {
    test('debería manejar CV sin configuración de sharing', async () => {
      const cvWithoutSharing = {
        ...mockCV,
        sharing: undefined
      };
      CV.findOne.mockResolvedValue(cvWithoutSharing);

      const response = await request(app)
        .put(`/api/cv/${mockCV._id}/share`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ isPublic: true });

      expect(response.status).toBe(200);
      expect(cvWithoutSharing.sharing).toBeTruthy();
    });

    test('debería manejar errores de base de datos', async () => {
      CV.findPublic.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/share/abc123xy');

      expect(response.status).toBe(500);
    });

    test('debería validar formato de fecha de expiración', async () => {
      const response = await request(app)
        .put(`/api/cv/${mockCV._id}/share`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ expiresAt: '2025-12-31T23:59:59Z' });

      expect(response.status).toBe(200);
    });
  });
});
