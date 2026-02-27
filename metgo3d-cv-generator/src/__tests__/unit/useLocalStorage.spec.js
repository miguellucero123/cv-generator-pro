import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useLocalStorage } from '../../composables/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debería guardar un valor en localStorage', () => {
    const { setItem } = useLocalStorage();
    
    const testData = { name: 'prueba', value: 123 };
    setItem('test-key', testData);
    
    const stored = localStorage.getItem('test-key');
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored)).toEqual(testData);
  });

  it('debería obtener un valor de localStorage', () => {
    const { setItem, getItem } = useLocalStorage();
    
    const testData = { id: 1, title: 'Test CV' };
    setItem('cv-data', testData);
    
    const retrieved = getItem('cv-data');
    expect(retrieved).toEqual(testData);
  });

  it('debería retornar null para claves que no existen', () => {
    const { getItem } = useLocalStorage();
    
    const retrieved = getItem('non-existent-key');
    expect(retrieved).toBeNull();
  });

  it('debería eliminar un valor de localStorage', () => {
    const { setItem, removeItem, getItem } = useLocalStorage();
    
    setItem('to-delete', { data: 'value' });
    expect(getItem('to-delete')).not.toBeNull();
    
    removeItem('to-delete');
    expect(getItem('to-delete')).toBeNull();
  });

  it('debería limpiar todo localStorage', () => {
    const { setItem, clear, getItem } = useLocalStorage();
    
    setItem('key1', 'value1');
    setItem('key2', 'value2');
    
    expect(localStorage.length).toBe(2);
    
    clear();
    expect(localStorage.length).toBe(0);
  });

  it('debería manejar valores complejos correctamente', () => {
    const { setItem, getItem } = useLocalStorage();
    
    const complexData = {
      user: {
        name: 'Juan',
        email: 'juan@example.com'
      },
      cvs: [
        { id: 1, title: 'CV 1' },
        { id: 2, title: 'CV 2' }
      ]
    };
    
    setItem('complex-data', complexData);
    const retrieved = getItem('complex-data');
    
    expect(retrieved).toEqual(complexData);
    expect(retrieved.user.name).toBe('Juan');
    expect(retrieved.cvs.length).toBe(2);
  });
});
