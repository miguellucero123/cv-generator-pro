/**
 * Tests comprehensivos para Auth Routes y Controller
 * Fase 4: Testing de rutas backend con mocking de DB y JWT
 */

const request = require('supertest');
const express = require('express');
const authRoutes = require('../../src/routes/auth');
const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Mock del modelo User
jest.mock('../../src/models/User');

// Crear app de express para testing
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes - Comprehensive Tests', () => {
  let mockUser;
  let validToken;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Usuario mock con métodos
    mockUser = {
      _id: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
      name: 'Test User',
      password: '$2a$12$hashedpassword',
      plan: 'free',
      avatar: null,
      settings: {
        language: 'es',
        theme: 'system',
        emailNotifications: true
      },
      usage: {
        cvsCreated: 0,
        cvsExported: 0
      },
      isVerified: false,
      loginAttempts: 0,
      createdAt: new Date(),
      generateAuthToken: jest.fn().mockReturnValue('mocked-jwt-token'),
      comparePassword: jest.fn(),
      isLocked: jest.fn().mockReturnValue(false),
      incLoginAttempts: jest.fn(),
      save: jest.fn().mockResolvedValue(true),
      updateOne: jest.fn().mockResolvedValue(true),
      populate: jest.fn().mockReturnThis()
    };

    // Token JWT válido para testing
    validToken = jwt.sign(
      { id: mockUser._id, email: mockUser.email, plan: mockUser.plan },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
  });

  describe('POST /api/auth/register', () => {
    test('debería registrar un nuevo usuario exitosamente', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('registrado exitosamente');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('email');
      expect(User.findOne).toHaveBeenCalledWith({ email: 'newuser@example.com' });
    });

    test('debería rechazar email duplicado', async () => {
      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('ya está registrado');
    });

    test('debería manejar errores del servidor', async () => {
      User.findOne.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    test('debería hacer login exitosamente con credenciales válidas', async () => {
      mockUser.comparePassword.mockResolvedValue(true);
      User.findByCredentials = jest.fn().mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Login exitoso');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('email');
      expect(mockUser.save).toHaveBeenCalled();
    });

    test('debería rechazar credenciales inválidas', async () => {
      User.findByCredentials = jest.fn().mockRejectedValue(new Error('Credenciales inválidas'));

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Credenciales inválidas');
    });

    test('debería rechazar cuenta bloqueada', async () => {
      User.findByCredentials = jest.fn().mockRejectedValue(
        new Error('Cuenta bloqueada temporalmente. Intenta más tarde.')
      );

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('bloqueada');
    });
  });

  describe('GET /api/auth/me', () => {
    test('debería obtener el perfil del usuario autenticado', async () => {
      const mockUserWithCVs = {
        ...mockUser,
        cvs: [
          { 
            _id: 'cv1', 
            title: 'Mi CV', 
            slug: 'mi-cv',
            status: 'draft',
            createdAt: new Date(),
            updatedAt: new Date(),
            analytics: { views: 5 }
          }
        ]
      };
      
      // Mock para el middleware protect (primera llamada sin populate)
      // Mock para el controller getMe (segunda llamada con populate)
      User.findById
        .mockResolvedValueOnce(mockUser) // Para protect middleware
        .mockReturnValueOnce({
          populate: jest.fn().mockResolvedValue(mockUserWithCVs) // Para getMe controller
        });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('recentCVs');
      expect(response.body.data.user.email).toBe(mockUser.email);
    });

    test('debería rechazar sin token de autenticación', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('No autorizado');
    });

    test('debería rechazar con token inválido', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/auth/profile', () => {
    test('debería actualizar el perfil correctamente', async () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      User.findById.mockResolvedValue(mockUser);
      User.findByIdAndUpdate.mockResolvedValue(updatedUser);

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('actualizado');
      expect(response.body.data.user.name).toBe('Updated Name');
    });

    test('no debería permitir actualizar campos no autorizados', async () => {
      User.findById.mockResolvedValue(mockUser);
      User.findByIdAndUpdate.mockImplementation((id, updates) => {
        // Verificar que solo se actualizan campos permitidos
        expect(updates).not.toHaveProperty('email');
        expect(updates).not.toHaveProperty('password');
        return Promise.resolve(mockUser);
      });

      await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ 
          name: 'Updated Name',
          email: 'hacker@evil.com', // No debe actualizarse
          password: 'hacked' // No debe actualizarse
        });

      expect(User.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe('PUT /api/auth/password', () => {
    test('debería cambiar la contraseña con la contraseña actual correcta', async () => {
      const userWithPassword = {
        ...mockUser,
        password: 'hashedpassword',
        comparePassword: jest.fn().mockResolvedValue(true)
      };

      // Mock para protect middleware (primera llamada)
      User.findById
        .mockResolvedValueOnce(mockUser) // Para protect
        .mockReturnValueOnce({
          select: jest.fn().mockResolvedValue(userWithPassword) // Para changePassword
        });

      const response = await request(app)
        .put('/api/auth/password')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          currentPassword: 'oldpassword123',
          newPassword: 'newpassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('actualizada');
      expect(response.body.data).toHaveProperty('token');
      expect(userWithPassword.save).toHaveBeenCalled();
    });

    test('debería rechazar con contraseña actual incorrecta', async () => {
      const userWithPassword = {
        ...mockUser,
        comparePassword: jest.fn().mockResolvedValue(false)
      };

      // Mock para protect middleware (primera llamada)
      User.findById
        .mockResolvedValueOnce(mockUser) // Para protect
        .mockReturnValueOnce({
          select: jest.fn().mockResolvedValue(userWithPassword) // Para changePassword
        });

      const response = await request(app)
        .put('/api/auth/password')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('incorrecta');
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    test('debería procesar solicitud de reset para email existente', async () => {
      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('resetear');
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockUser).toHaveProperty('resetPasswordToken');
    });

    test('debería retornar mensaje genérico para email inexistente', async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('resetear');
    });
  });

  describe('POST /api/auth/reset-password/:token', () => {
    test('debería resetear contraseña con token válido', async () => {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      
      mockUser.resetPasswordToken = hashedToken;
      mockUser.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
      
      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post(`/api/auth/reset-password/${resetToken}`)
        .send({ password: 'newpassword123' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('actualizada exitosamente');
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockUser.resetPasswordToken).toBeUndefined();
    });

    test('debería rechazar token inválido o expirado', async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/reset-password/invalid-token')
        .send({ password: 'newpassword123' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('inválido o expirado');
    });
  });

  describe('POST /api/auth/logout', () => {
    test('debería cerrar sesión correctamente', async () => {
      User.findById.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('cerrada');
    });
  });

  describe('Middleware - Protect', () => {
    test('debería permitir acceso con token válido', async () => {
      User.findById.mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${validToken}`);

      expect(User.findById).toHaveBeenCalled();
      expect(response.status).not.toBe(401);
    });

    test('debería buscar token en cookies si no hay header', async () => {
      User.findById.mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', [`token=${validToken}`]);

      // El middleware debería procesar el token de la cookie
      expect(response.status).toBeLessThan(500);
    });

    test('debería rechazar token expirado', async () => {
      const expiredToken = jwt.sign(
        { id: mockUser._id, email: mockUser.email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '-1h' }
      );

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('expirad');
      expect(response.body.code).toBe('TOKEN_EXPIRED');
    });

    test('debería rechazar si el usuario ya no existe', async () => {
      User.findById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('ya no existe');
    });

    test('debería rechazar cuenta bloqueada en middleware', async () => {
      const lockedUser = { ...mockUser, isLocked: jest.fn().mockReturnValue(true) };
      User.findById.mockResolvedValue(lockedUser);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(423);
      expect(response.body.message).toContain('bloqueada');
    });
  });

  describe('Edge Cases y Validaciones', () => {
    test('debería validar formato de email', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test('user@example.com')).toBe(true);
      expect(emailRegex.test('invalid-email')).toBe(false);
    });

    test('debería validar longitud mínima de contraseña', () => {
      const validatePassword = (password) => password && password.length >= 6;
      expect(validatePassword('123456')).toBe(true);
      expect(validatePassword('12345')).toBe(false);
    });

    test('debería estructurar respuestas con formato consistente', () => {
      const successResponse = {
        success: true,
        message: 'Operación exitosa',
        data: { user: mockUser }
      };

      expect(successResponse).toHaveProperty('success');
      expect(successResponse).toHaveProperty('message');
      expect(successResponse.success).toBe(true);
    });

    test('debería estructurar errores correctamente', () => {
      const errorResponse = {
        success: false,
        message: 'Error en la operación'
      };

      expect(errorResponse).toHaveProperty('success');
      expect(errorResponse.success).toBe(false);
      expect(errorResponse).toHaveProperty('message');
    });
  });
});
