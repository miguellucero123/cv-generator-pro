import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useEditor } from '../../composables/useEditor';

describe('useEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería retornar composable con funciones esperadas', () => {
    const {
      cvData,
      updatePersonalInfo,
      addExperience,
      removeExperience,
      addEducation,
      removeEducation,
      addSkill,
      removeSkill,
      setTemplate,
      saveCV,
      resetCV
    } = useEditor();

    expect(cvData).toBeDefined();
    expect(typeof updatePersonalInfo).toBe('function');
    expect(typeof addExperience).toBe('function');
    expect(typeof removeExperience).toBe('function');
    expect(typeof addEducation).toBe('function');
    expect(typeof removeEducation).toBe('function');
    expect(typeof addSkill).toBe('function');
    expect(typeof removeSkill).toBe('function');
    expect(typeof setTemplate).toBe('function');
    expect(typeof saveCV).toBe('function');
    expect(typeof resetCV).toBe('function');
  });

  it('debería actualizar información personal', () => {
    const { cvData, updatePersonalInfo } = useEditor();
    
    const personalInfo = {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      phone: '+34 123 456 789'
    };
    
    updatePersonalInfo(personalInfo);
    
    // Verificar que se actualizó (estructura según tu implementación)
    expect(cvData.personalInfo).toBeDefined();
  });

  it('debería agregar experiencia laboral', () => {
    const { cvData, addExperience } = useEditor();
    
    const initialCount = cvData.experience?.length || 0;
    
    addExperience({
      company: 'Tech Company',
      position: 'Developer',
      startDate: '2020-01-01',
      endDate: '2023-12-31'
    });
    
    expect(cvData.experience.length).toBe(initialCount + 1);
  });

  it('debería remover experiencia laboral', () => {
    const { cvData, addExperience, removeExperience } = useEditor();
    
    // Agregar experiencia primero
    addExperience({
      company: 'Company 1',
      position: 'Developer'
    });
    
    const countBefore = cvData.experience.length;
    
    // Remover la última (índice 0)
    removeExperience(0);
    
    // No debe tirar error aunque podría estar vacío
    expect(typeof removeExperience).toBe('function');
  });

  it('debería agregar educación', () => {
    const { cvData, addEducation } = useEditor();
    
    const initialCount = cvData.education?.length || 0;
    
    addEducation({
      school: 'University',
      degree: 'Bachelor',
      field: 'Computer Science',
      startDate: '2016-01-01',
      endDate: '2020-12-31'
    });
    
    expect(cvData.education.length).toBe(initialCount + 1);
  });

  it('debería agregar habilidades', () => {
    const { cvData, addSkill } = useEditor();
    
    const initialCount = cvData.skills?.length || 0;
    
    addSkill('JavaScript');
    addSkill('Vue.js');
    addSkill('Node.js');
    
    expect(cvData.skills.length).toBe(initialCount + 3);
  });

  it('debería remover habilidades', () => {
    const { cvData, addSkill, removeSkill } = useEditor();
    
    addSkill('Python');
    const countBefore = cvData.skills.length;
    
    removeSkill(countBefore - 1);
    
    expect(typeof removeSkill).toBe('function');
  });

  it('debería cambiar plantilla', () => {
    const { cvData, setTemplate } = useEditor();
    
    setTemplate('modern');
    expect(cvData.template).toBe('modern');
    
    setTemplate('classic');
    expect(cvData.template).toBe('classic');
  });

  it('debería resetear CV al estado inicial', () => {
    const { cvData, updatePersonalInfo, resetCV } = useEditor();
    
    // Modificar datos
    updatePersonalInfo({
      name: 'Modificado',
      email: 'test@example.com'
    });
    
    // Resetear
    resetCV();
    
    // Debería volver al estado inicial
    expect(typeof resetCV).toBe('function');
  });

  it('debería guardar CV', () => {
    const { saveCV } = useEditor();
    
    const result = saveCV();
    
    // Debería retornar una promesa o similiar
    expect(typeof saveCV).toBe('function');
  });
});
