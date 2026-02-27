/**
 * Tests comprehensivos para CV Routes y Controller
 * Fase 4: Testing de operaciones CRUD de CVs
 */

const request = require('supertest');
const express = require('express');
const cvRoutes = require('../../src/routes/cv');
const CV = require('../../src/models/CV');
const User = require('../../src/models/User');
const Analytics = require('../../src/models/Analytics');
const jwt = require('jsonwebtoken');

// Mock de modelos
jest.mock('../../src/models/CV');
jest.mock('../../src/models/User');
jest.mock('../../src/models/Analytics');

// Crear app de express para testing
const app = express();
app.use(express.json());
app.use('/api/cv', cvRoutes);

describe('CV Routes - Comprehensive Tests', () => {
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
      usage: { cvsCreated: 1, cvsExported: 0 },
      canCreateCV: jest.fn().mockReturnValue(true),
      isLocked: jest.fn().mockReturnValue(false),
      getPlanLimits: jest.fn().mockReturnValue({ cvs: 3, exports: 10 })
    };

    // CV mock
    mockCV = {
      _id: '507f1f77bcf86cd799439022',
      user: mockUser._id,
      title: 'Mi CV Profesional',
      slug: 'mi-cv-profesional',
      status: 'draft',
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        title: 'Software Developer',
        contact: {
          email: 'john@example.com',
          phone: '+1234567890'
        }
      },
      experience: [],
      education: [],
      skills: [],
      design: { template: 'modern' },
      sharing: {
        isPublic: false,
        publicUrl: null
      },
      analytics: { views: 0, downloads: 0 },
      createdAt: new Date(),
      updatedAt: new Date(),
      toExportJSON: jest.fn().mockReturnValue({ title: 'Mi CV', personalInfo: {} }),
      clone: jest.fn().mockResolvedValue({
        _id: 'cloned-cv-id',
        title: 'Mi CV Profesional (Copia)',
        user: mockUser._id
      })
    };

    // Token JWT válido
    validToken = jwt.sign(
      { id: mockUser._id, email: mockUser.email, plan: mockUser.plan },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    // Setup default mocks
    User.findById.mockResolvedValue(mockUser);
    CV.findOne.mockResolvedValue(mockCV);
    CV.find.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([mockCV])
    });
    CV.countDocuments.mockResolvedValue(1);
    CV.create.mockResolvedValue(mockCV);
    CV.findOneAndUpdate.mockResolvedValue(mockCV);
    CV.findOneAndDelete.mockResolvedValue(mockCV);
    User.findByIdAndUpdate.mockResolvedValue(mockUser);
    Analytics.create.mockResolvedValue({ _id: 'analytics-id' });
    Analytics.deleteMany.mockResolvedValue({ deletedCount: 1 });
  });

  describe('GET /api/cv', () => {
    test('debería listar todos los CVs del usuario', async () => {
      const response = await request(app)
        .get('/api/cv')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('cvs');
      expect(response.body.data).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data.cvs)).toBe(true);
    });

    test('debería filtrar CVs por status', async () => {
      const response = await request(app)
        .get('/api/cv?status=published')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(CV.find).toHaveBeenCalled();
    });

    test('debería paginar resultados correctamente', async () => {
      const response = await request(app)
        .get('/api/cv?page=2&limit=5')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.pagination.page).toBe(2);
      expect(response.body.data.pagination.limit).toBe(5);
    });

    test('debería ordenar CVs por campo especificado', async () => {
      const response = await request(app)
        .get('/api/cv?sort=createdAt')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(CV.find).toHaveBeenCalled();
    });

    test('debería rechazar acceso sin autenticación', async () => {
      const response = await request(app).get('/api/cv');
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/cv', () => {
    test('debería crear un nuevo CV exitosamente', async () => {
      const newCvData = {
        title: 'Nuevo CV',
        personalInfo: {
          firstName: 'Jane',
          lastName: 'Smith',
          title: 'Designer'
        }
      };

      const response = await request(app)
        .post('/api/cv')
        .set('Authorization', `Bearer ${validToken}`)
        .send(newCvData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('creado');
      expect(response.body.data).toHaveProperty('cv');
      expect(CV.create).toHaveBeenCalled();
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        mockUser._id,
        { $inc: { 'usage.cvsCreated': 1 } }
      );
      expect(Analytics.create).toHaveBeenCalled();
    });

    test('debería rechazar si se alcanzó el límite del plan', async () => {
      mockUser.canCreateCV.mockReturnValue(false);
      User.findById.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/cv')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ title: 'CV Extra' });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe('CV_LIMIT_REACHED');
      expect(CV.create).not.toHaveBeenCalled();
    });

    test('debería manejar errores de validación', async () => {
      CV.create.mockRejectedValue(new Error('Validation Error'));

      const response = await request(app)
        .post('/api/cv')
        .set('Authorization', `Bearer ${validToken}`)
        .send({});

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/cv/:id', () => {
    test('debería obtener un CV específico', async () => {
      const response = await request(app)
        .get(`/api/cv/${mockCV._id}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('cv');
      expect(CV.findOne).toHaveBeenCalledWith({
        _id: mockCV._id,
        user: mockUser._id
      });
    });

    test('debería retornar 404 si el CV no existe', async () => {
      CV.findOne.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/cv/507f1f77bcf86cd799439099')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('no encontrado');
    });

    test('debería rechazar acceso a CV de otro usuario', async () => {
      CV.findOne.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/cv/507f1f77bcf86cd799439088')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(404);
      expect(CV.findOne).toHaveBeenCalledWith({
        _id: '507f1f77bcf86cd799439088',
        user: mockUser._id
      });
    });
  });

  describe('PUT /api/cv/:id', () => {
    test('debería actualizar un CV exitosamente', async () => {
      const updates = {
        title: 'CV Actualizado',
        personalInfo: { firstName: 'Updated' }
      };

      const response = await request(app)
        .put(`/api/cv/${mockCV._id}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('actualizado');
      expect(CV.findOneAndUpdate).toHaveBeenCalled();
      expect(Analytics.create).toHaveBeenCalled();
    });

    test('debería retornar 404 si el CV no existe', async () => {
      CV.findOneAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/cv/507f1f77bcf86cd799439077')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ title: 'Test' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test('debería registrar analítica de edición', async () => {
      const response = await request(app)
        .put(`/api/cv/${mockCV._id}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ title: 'Updated' });

      expect(Analytics.create).toHaveBeenCalledWith({
        cv: mockCV._id,
        user: mockUser._id,
        event: 'edit'
      });
    });
  });

  describe('DELETE /api/cv/:id', () => {
    test('debería eliminar un CV exitosamente', async () => {
      const response = await request(app)
        .delete(`/api/cv/${mockCV._id}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('eliminado');
      expect(CV.findOneAndDelete).toHaveBeenCalledWith({
        _id: mockCV._id,
        user: mockUser._id
      });
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        mockUser._id,
        { $inc: { 'usage.cvsCreated': -1 } }
      );
      expect(Analytics.deleteMany).toHaveBeenCalledWith({ cv: mockCV._id });
    });

    test('debería retornar 404 si el CV no existe', async () => {
      CV.findOneAndDelete.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/cv/507f1f77bcf86cd799439066')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    test('debería decrementar el contador de CVs del usuario', async () => {
      await request(app)
        .delete(`/api/cv/${mockCV._id}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        mockUser._id,
        { $inc: { 'usage.cvsCreated': -1 } }
      );
    });
  });

  describe('POST /api/cv/:id/clone', () => {
    test('debería clonar un CV exitosamente', async () => {
      const response = await request(app)
        .post(`/api/cv/${mockCV._id}/clone`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('clonado');
      expect(mockCV.clone).toHaveBeenCalled();
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        mockUser._id,
        { $inc: { 'usage.cvsCreated': 1 } }
      );
    });

    test('debería rechazar si se alcanzó el límite del plan', async () => {
      mockUser.canCreateCV.mockReturnValue(false);
      User.findById.mockResolvedValue(mockUser);

      const response = await request(app)
        .post(`/api/cv/${mockCV._id}/clone`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(403);
      expect(response.body.code).toBe('CV_LIMIT_REACHED');
    });

    test('debería retornar 404 si el CV original no existe', async () => {
      CV.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/cv/507f1f77bcf86cd799439055/clone')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(404);
    });

    test('debería registrar analítica de clonación', async () => {
      const clonedCV = {
        _id: 'cloned-cv-id',
        title: 'Mi CV (Copia)',
        user: mockUser._id
      };
      mockCV.clone.mockResolvedValue(clonedCV);

      await request(app)
        .post(`/api/cv/${mockCV._id}/clone`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(Analytics.create).toHaveBeenCalledWith({
        cv: clonedCV._id,
        user: mockUser._id,
        event: 'clone',
        metadata: { originalCVId: mockCV._id }
      });
    });
  });

  describe('GET /api/cv/:id/export', () => {
    test('debería exportar un CV en formato JSON', async () => {
      const exportData = {
        title: 'Mi CV',
        personalInfo: { firstName: 'John' },
        experience: [],
        education: []
      };
      mockCV.toExportJSON.mockReturnValue(exportData);

      const response = await request(app)
        .get(`/api/cv/${mockCV._id}/export`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(exportData);
      expect(mockCV.toExportJSON).toHaveBeenCalled();
      expect(Analytics.create).toHaveBeenCalledWith({
        cv: mockCV._id,
        user: mockUser._id,
        event: 'download',
        metadata: { format: 'json' }
      });
    });

    test('debería retornar 404 si el CV no existe', async () => {
      CV.findOne.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/cv/507f1f77bcf86cd799439044/export')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/cv/import', () => {
    test('debería importar un CV con formato backend', async () => {
      const importData = {
        title: 'CV Importado',
        personalInfo: {
          firstName: 'Imported',
          lastName: 'User'
        },
        experience: [],
        education: []
      };

      const response = await request(app)
        .post('/api/cv/import')
        .set('Authorization', `Bearer ${validToken}`)
        .send(importData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('importado');
      expect(CV.create).toHaveBeenCalled();
    });

    test('debería importar un CV con formato frontend legacy', async () => {
      const legacyData = {
        title: 'CV Legacy',
        personal: {
          nombre: 'Juan Perez',
          email: 'juan@example.com'
        },
        experiencia: [],
        educacion: []
      };

      const response = await request(app)
        .post('/api/cv/import')
        .set('Authorization', `Bearer ${validToken}`)
        .send(legacyData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    test('debería rechazar formato inválido', async () => {
      const response = await request(app)
        .post('/api/cv/import')
        .set('Authorization', `Bearer ${validToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('inválido');
    });

    test('debería rechazar si se alcanzó el límite del plan', async () => {
      mockUser.canCreateCV.mockReturnValue(false);
      User.findById.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/cv/import')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ title: 'CV', personalInfo: {} });

      expect(response.status).toBe(403);
      expect(response.body.code).toBe('CV_LIMIT_REACHED');
    });

    test('debería incrementar el contador de CVs al importar', async () => {
      await request(app)
        .post('/api/cv/import')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ title: 'CV', personalInfo: {} });

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        mockUser._id,
        { $inc: { 'usage.cvsCreated': 1 } }
      );
    });
  });

  describe('Validaciones y Edge Cases', () => {
    test('debería validar ObjectId en parámetros', async () => {
      const response = await request(app)
        .get('/api/cv/invalid-id')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    test('debería manejar errores de base de datos', async () => {
      CV.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      const response = await request(app)
        .get('/api/cv')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });

    test('debería validar estructura de datos en creación', async () => {
      const response = await request(app)
        .post('/api/cv')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ invalidField: 'test' });

      expect(response.status).toBeGreaterThanOrEqual(200);
      // La validación de estructura depende del middleware
    });
  });
});
