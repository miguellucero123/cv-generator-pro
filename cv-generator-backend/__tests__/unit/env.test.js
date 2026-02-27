/**
 * Tests para Config/Env
 * Validación de variables de entorno
 */

describe('Environment Configuration', () => {
  beforeEach(() => {
    // Guardar env actual
    this.originalEnv = { ...process.env };
  });

  afterEach(() => {
    // Restaurar env original
    process.env = this.originalEnv;
  });

  describe('validateEnv', () => {
    const { validateEnv, requiredVars } = require('../../src/config/env');

    test('debería pasar si todas las variables requeridas están presentes', () => {
      // Setup - asegurar que existen variables requeridas
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.JWT_SECRET = 'test-secret-very-long-32-characters-plus-12345';
      process.env.FRONTEND_URL = 'http://localhost:3000';
      process.env.NODE_ENV = 'test';
      process.env.PORT = '5000';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.JWT_SECRET = 'test-secret-very-long-32-characters-plus';

      expect(() => validateEnv()).not.toThrow();
    });

    test('debería fallar si falta MONGODB_URI', () => {
      process.env.NODE_ENV = 'test';
      process.env.PORT = '5000';
      process.env.FRONTEND_URL = 'http://localhost:3000';
      process.env.JWT_SECRET = 'test-secret';
      delete process.env.MONGODB_URI;

      expect(() => validateEnv()).toThrow('MONGODB_URI');
    });

    test('debería fallar si falta JWT_SECRET', () => {
      process.env.NODE_ENV = 'test';
      process.env.PORT = '5000';
      process.env.FRONTEND_URL = 'http://localhost:3000';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      delete process.env.JWT_SECRET;

      expect(() => validateEnv()).toThrow('JWT_SECRET');
    });

    test('debería validar que PORT es un número válido', () => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.JWT_SECRET = 'test-secret-very-long-32-characters-plus-12345';
      process.env.FRONTEND_URL = 'http://localhost:3000';
      process.env.NODE_ENV = 'test';
      process.env.PORT = 'invalid';

      expect(() => validateEnv()).toThrow('PORT debe ser un número');
    });

    test('debería validar que JWT_SECRET es lo suficientemente largo', () => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.FRONTEND_URL = 'http://localhost:3000';
      process.env.NODE_ENV = 'test';
      process.env.PORT = '5000';
      process.env.JWT_SECRET = 'short'; // Menos de 32 caracteres

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      validateEnv();

      // Si JWT_SECRET es corto, debería advertir (no fallar)
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('getConfig', () => {
    const { getConfig } = require('../../src/config/env');

    test('debería retornar objeto de configuración con valores por defecto', () => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.JWT_SECRET = 'test-secret-32-characters-or-more-here';
      process.env.FRONTEND_URL = 'http://localhost:3000';
      process.env.NODE_ENV = 'test';
      process.env.PORT = '5000';

      const config = getConfig();

      expect(config).toHaveProperty('mongodbUri');
      expect(config).toHaveProperty('jwtSecret');
      expect(config).toHaveProperty('port', 5000);
      expect(config).toHaveProperty('nodeEnv', 'test');
    });

    test('debería detectar Google OAuth cuando está configurado', () => {
      process.env.GOOGLE_CLIENT_ID = 'test-id';
      process.env.GOOGLE_CLIENT_SECRET = 'test-secret';

      const { getConfig } = require('../../src/config/env');
      const config = getConfig();

      expect(config.google.enabled).toBe(true);
    });

    test('debería detectar cuando Google OAuth no está configurado', () => {
      delete process.env.GOOGLE_CLIENT_ID;
      delete process.env.GOOGLE_CLIENT_SECRET;

      const { getConfig: getConfigFresh } = jest.requireActual('../../src/config/env').getConfig;
      const { getConfig: getConfigMock } = require('../../src/config/env');
      const config = getConfigMock();

      expect(config.google.enabled).toBe(false);
    });
  });
});
