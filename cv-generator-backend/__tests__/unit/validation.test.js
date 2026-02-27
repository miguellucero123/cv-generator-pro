/**
 * Tests para validation middleware
 * Cubre: Register validation, login, CV data, share settings, ID validation
 */

const validation = require('../../src/middleware/validation');

describe('validation middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      body: {},
      params: {},
      query: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('handleValidationErrors', () => {
    it('deberia existir handleValidationErrors', () => {
      expect(validation.handleValidationErrors).toBeDefined();
      expect(typeof validation.handleValidationErrors).toBe('function');
    });
  });

  describe('validateRegister', () => {
    it('deberia existir validateRegister', () => {
      expect(validation.validateRegister).toBeDefined();
      expect(Array.isArray(validation.validateRegister)).toBe(true);
    });

    it('deberia tener validadores en validateRegister', () => {
      expect(validation.validateRegister.length).toBeGreaterThan(0);
    });
  });

  describe('validateLogin', () => {
    it('deberia existir validateLogin', () => {
      expect(validation.validateLogin).toBeDefined();
      expect(Array.isArray(validation.validateLogin)).toBe(true);
    });

    it('deberia tener validadores en validateLogin', () => {
      expect(validation.validateLogin.length).toBeGreaterThan(0);
    });
  });

  describe('validateCV', () => {
    it('deberia existir validateCV', () => {
      expect(validation.validateCV).toBeDefined();
      expect(Array.isArray(validation.validateCV)).toBe(true);
    });
  });

  describe('validateShare', () => {
    it('deberia existir validateShare', () => {
      expect(validation.validateShare).toBeDefined();
      expect(Array.isArray(validation.validateShare)).toBe(true);
    });
  });

  describe('validateObjectId', () => {
    it('deberia existir validateObjectId', () => {
      expect(validation.validateObjectId).toBeDefined();
      expect(typeof validation.validateObjectId).toBe('function');
    });
  });
});
