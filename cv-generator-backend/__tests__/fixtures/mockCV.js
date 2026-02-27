/**
 * Mock data for CV tests
 */

const mockCVId = '507f1f77bcf86cd799439012';
const mockUserId = '507f1f77bcf86cd799439011';

const mockCVData = {
  title: 'Mi CV Profesional 2024',
  personalInfo: {
    name: 'Juan Pérez García',
    email: 'juan@example.com',
    phone: '+34 123 456 789',
    location: 'Madrid, España',
    summary: 'Desarrollador Full Stack con 5+ años de experiencia',
  },
  experience: [
    {
      company: 'Tech Company S.L.',
      position: 'Senior Developer',
      startDate: new Date('2022-01-01'),
      endDate: new Date('2024-01-31'),
      description: 'Desarrollo de aplicaciones web con Vue.js y Node.js',
      currentJob: false,
    },
    {
      company: 'Startup Innovadora',
      position: 'Full Stack Developer',
      startDate: new Date('2020-06-01'),
      endDate: new Date('2021-12-31'),
      description: 'Desarrollo full stack, DevOps',
      currentJob: false,
    },
  ],
  education: [
    {
      school: 'Universidad Complutense de Madrid',
      degree: 'Grado',
      field: 'Ingeniería Informática',
      startDate: new Date('2016-09-01'),
      endDate: new Date('2020-06-30'),
    },
    {
      school: 'Bootcamp Tecnológico',
      degree: 'Certificado',
      field: 'Full Stack Development',
      startDate: new Date('2020-01-01'),
      endDate: new Date('2020-05-31'),
    },
  ],
  skills: ['JavaScript', 'Vue.js', 'Node.js', 'MongoDB', 'Express', 'REST API', 'Git'],
  projects: [
    {
      name: 'CV Generator Pro',
      description: 'Aplicación para generar CVs profesionales en PDF',
      link: 'https://github.com/miguellucero123/cv-generator-pro',
    },
    {
      name: 'E-commerce Frontend',
      description: 'Tienda online con Vue.js y Vuex',
      link: 'https://github.com/miguellucero123/ecommerce-front',
    },
  ],
  template: 'modern',
};

const mockCV = {
  _id: mockCVId,
  userId: mockUserId,
  ...mockCVData,
  isPublic: false,
  viewCount: 0,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15'),
  toJSON: jest.fn().mockReturnValue({
    _id: mockCVId,
    title: mockCVData.title,
    personalInfo: mockCVData.personalInfo,
    template: mockCVData.template,
  }),
};

const mockCVUpdate = {
  title: 'Mi CV Actualizado',
  personalInfo: {
    name: 'Juan Pérez Actualizado',
    email: 'juan.new@example.com',
  },
  template: 'classic',
};

const mockCVList = [
  mockCV,
  {
    ...mockCV,
    _id: '507f1f77bcf86cd799439013',
    title: 'CV 2 - Técnico',
    template: 'classic',
    viewCount: 15,
  },
  {
    ...mockCV,
    _id: '507f1f77bcf86cd799439014',
    title: 'CV 3 - Creativo',
    template: 'creative',
    viewCount: 8,
  },
];

const mockCVInvalid = {
  // Falta title
  personalInfo: {
    name: 'Sin título',
    email: 'test@example.com',
  },
};

const mockCVMinimal = {
  title: 'CV Mínimo',
  personalInfo: {
    name: 'Nombre Completo',
    email: 'usuario@example.com',
  },
};

module.exports = {
  mockCVId,
  mockUserId,
  mockCVData,
  mockCV,
  mockCVUpdate,
  mockCVList,
  mockCVInvalid,
  mockCVMinimal,
};
