/**
 * Tests para Config/Env
 * ValidaciÃ³n de variables de entorno
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

    test('deberÃ­a pasar si todas las variables requeridas estÃ¡n presentes', () => {
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

    test('deberÃ­a fallar si falta MONGODB_URI', () => {
      process.env.NODE_ENV = 'test';
      process.env.PORT = '5000';
      process.env.FRONTEND_URL = 'http://localhost:3000';
      process.env.JWT_SECRET = 'test-secret';
      delete process.env.MONGODB_URI;

      expect(() => validateEnv()).toThrow('MONGODB_URI');
    });

    test('deberÃ­a fallar si falta JWT_SECRET', () => {
      process.env.NODE_ENV = 'test';
      process.env.PORT = '5000';
      process.env.FRONTEND_URL = 'http://localhost:3000';
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      delete process.env.JWT_SECRET;

      expect(() => validateEnv()).toThrow('JWT_SECRET');
    });

    test('deberia validar que PORT es un numero valido', () => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.JWT_SECRET = 'test-secret-very-long-32-characters-plus-12345';
      process.env.FRONTEND_URL = 'http://localhost:3000';
      process.env.NODE_ENV = 'test';
      process.env.PORT = 'invalid';

      expect(() => validateEnv()).toThrow(/PORT debe ser un n/);
    });

    test('deberÃ­a validar que JWT_SECRET es lo suficientemente largo', () => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      process.env.FRONTEND_URL = 'http://localhost:3000';
      process.env.NODE_ENV = 'test';
      process.env.PORT = '5000';
      process.env.JWT_SECRET = 'short'; // Menos de 32 caracteres

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      validateEnv();

      // Si JWT_SECRET es corto, deberÃ­a advertir (no fallar)
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('getConfig', () => {
    const { getConfig } = require('../../src/config/env');

    test('deberÃ­a retornar objeto de configuraciÃ³n con valores por defecto', () => {
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

    test('deberÃ­a detectar Google OAuth cuando estÃ¡ configurado', () => {
      process.env.GOOGLE_CLIENT_ID = 'test-id';
      process.env.GOOGLE_CLIENT_SECRET = 'test-secret';

      const { getConfig } = require('../../src/config/env');
      const config = getConfig();

      expect(config.google.enabled).toBe(true);
    });

    test('deberÃ­a detectar cuando Google OAuth no estÃ¡ configurado', () => {
      delete process.env.GOOGLE_CLIENT_ID;
      delete process.env.GOOGLE_CLIENT_SECRET;

      const { getConfig: getConfigFresh } = jest.requireActual('../../src/config/env').getConfig;
      const { getConfig: getConfigMock } = require('../../src/config/env');
      const config = getConfigMock();

      expect(config.google.enabled).toBe(false);
    });
  });
});


