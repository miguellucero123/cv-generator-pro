/**
 * Basic smoke tests for controllers
 * Verifies that all controller functions are defined and exportable
 */

describe('Controllers Smoke Tests', () => {
  describe('authController', () => {
    let authController;

    beforeAll(() => {
      authController = require('../../src/controllers/authController');
    });

    it('should export register function', () => {
      expect(authController.register).toBeDefined();
      expect(typeof authController.register).toBe('function');
    });

    it('should export login function', () => {
      expect(authController.login).toBeDefined();
      expect(typeof authController.login).toBe('function');
    });

    it('should export getMe function', () => {
      expect(authController.getMe).toBeDefined();
      expect(typeof authController.getMe).toBe('function');
    });
  });

  describe('cvController', () => {
    let cvController;

    beforeAll(() => {
      cvController = require('../../src/controllers/cvController');
    });

    it('should export createCV function', () => {
      expect(cvController.createCV).toBeDefined();
      expect(typeof cvController.createCV).toBe('function');
    });

    it('should export getCVs function', () => {
      expect(cvController.getCVs).toBeDefined();
      expect(typeof cvController.getCVs).toBe('function');
    });

    it('should export getCV function', () => {
      expect(cvController.getCV).toBeDefined();
      expect(typeof cvController.getCV).toBe('function');
    });

    it('should export updateCV function', () => {
      expect(cvController.updateCV).toBeDefined();
      expect(typeof cvController.updateCV).toBe('function');
    });

    it('should export deleteCV function', () => {
      expect(cvController.deleteCV).toBeDefined();
      expect(typeof cvController.deleteCV).toBe('function');
    });

    it('should export cloneCV function', () => {
      expect(cvController.cloneCV).toBeDefined();
      expect(typeof cvController.cloneCV).toBe('function');
    });
  });

  describe('shareController', () => {
    let shareController;

    beforeAll(() => {
      shareController = require('../../src/controllers/shareController');
    });

    it('should export getShareSettings function', () => {
      expect(shareController.getShareSettings).toBeDefined();
      expect(typeof shareController.getShareSettings).toBe('function');
    });

    it('should export updateShareSettings function', () => {
      expect(shareController.updateShareSettings).toBeDefined();
      expect(typeof shareController.updateShareSettings).toBe('function');
    });

    it('should export getPublicCV function', () => {
      expect(shareController.getPublicCV).toBeDefined();
      expect(typeof shareController.getPublicCV).toBe('function');
    });
  });

  describe('analyticsController', () => {
    let analyticsController;

    beforeAll(() => {
      analyticsController = require('../../src/controllers/analyticsController');
    });

    it('should export getDashboard function', () => {
      expect(analyticsController.getDashboard).toBeDefined();
      expect(typeof analyticsController.getDashboard).toBe('function');
    });

    it('should export getCVAnalytics function', () => {
      expect(analyticsController.getCVAnalytics).toBeDefined();
      expect(typeof analyticsController.getCVAnalytics).toBe('function');
    });

    it('should export exportAnalytics function', () => {
      expect(analyticsController.exportAnalytics).toBeDefined();
      expect(typeof analyticsController.exportAnalytics).toBe('function');
    });
  });
});
