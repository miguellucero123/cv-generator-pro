/**
 * Jest Setup
 * Configuración inicial para tests
 */

// Mock de dotenv
jest.mock('dotenv', () => ({
  config: jest.fn()
}));

// Timeout global
jest.setTimeout(10000);

// Limpiar después de cada test
afterEach(() => {
  jest.clearAllMocks();
});
