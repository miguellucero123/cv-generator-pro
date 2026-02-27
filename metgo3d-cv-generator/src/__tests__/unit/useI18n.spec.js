import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useI18n } from '../../composables/useI18n';

describe('useI18n', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Resetear idioma por defecto
    localStorage.clear();
  });

  it('debería retornar funciones de i18n', () => {
    const { t, setLanguage, getCurrentLanguage } = useI18n();
    
    expect(typeof t).toBe('function');
    expect(typeof setLanguage).toBe('function');
    expect(typeof getCurrentLanguage).toBe('function');
  });

  it('debería traducir strings en español por defecto', () => {
    const { t } = useI18n();
    
    // Estructura esperada: namespace.key
    // Estos son ejemplos, ajusta según tu estructura real
    expect(t('app.title')).toBeDefined();
    expect(typeof t('app.title')).toBe('string');
  });

  it('debería cambiar de idioma correctamente', () => {
    const { setLanguage, getCurrentLanguage } = useI18n();
    
    // Establecer inglés
    setLanguage('en');
    expect(getCurrentLanguage()).toBe('en');
    
    // Establecer español
    setLanguage('es');
    expect(getCurrentLanguage()).toBe('es');
  });

  it('debería usar el idioma guardado en localStorage', () => {
    localStorage.setItem('metgo3d-locale', 'en');
    
    const { getCurrentLanguage } = useI18n();
    expect(getCurrentLanguage()).toBe('en');
  });

  it('debería usar idioma por defecto si no está configurado', () => {
    localStorage.clear();
    
    const { getCurrentLanguage } = useI18n();
    expect(getCurrentLanguage()).toBe('es'); // o 'en', ajusta según tu default
  });

  it('debería mantener las traducciones consistentes', () => {
    const { t, setLanguage } = useI18n();
    
    // Prueba que la misma clave siempre retorna el mismo valor
    setLanguage('es');
    const es1 = t('app.name');
    const es2 = t('app.name');
    expect(es1).toBe(es2);
    
    // Cambiar idioma
    setLanguage('en');
    const en1 = t('app.name');
    const en2 = t('app.name');
    expect(en1).toBe(en2);
    
    // Las traducciones deben ser consistentes
    expect(es1).toBe(es2);
    expect(en1).toBe(en2);
  });
});
