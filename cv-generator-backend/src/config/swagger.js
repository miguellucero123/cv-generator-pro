/**
 * Swagger/OpenAPI Configuration
 * Define la documentación completa de la API
 */

// Importar documentaciones de endpoints
require('../docs/authDocs');
require('../docs/cvDocs');
require('../docs/shareDocs');
require('../docs/analyticsDocs');

const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'CV Generator Pro - API',
    version: '2.0.0',
    description: 'API para generador de CVs profesionales con exportación a PDF',
    contact: {
      name: 'CV Generator Pro',
      email: 'support@cvgenerator.pro'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Development server'
    },
    {
      url: 'https://api.cvgenerator.pro/api',
      description: 'Production server'
    }
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Operaciones de autenticación y gestión de usuarios'
    },
    {
      name: 'CV',
      description: 'Operaciones CRUD para CVs'
    },
    {
      name: 'Share',
      description: 'Crear y gestionar enlaces compartibles'
    },
    {
      name: 'Analytics',
      description: 'Ver estadísticas y analíticas'
    }
  ],
  components: {
    schemas: {
      User: {
        type: 'object',
        required: ['_id', 'name', 'email'],
        properties: {
          _id: {
            type: 'string',
            description: 'ID único del usuario'
          },
          name: {
            type: 'string',
            example: 'Juan Pérez'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'juan@example.com'
          },
          phone: {
            type: 'string',
            example: '+34 123 456 789'
          },
          profilePicture: {
            type: 'string',
            format: 'url'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      CV: {
        type: 'object',
        required: ['title', 'personalInfo'],
        properties: {
          _id: {
            type: 'string',
            description: 'ID único del CV'
          },
          userId: {
            type: 'string',
            description: 'ID del propietario'
          },
          title: {
            type: 'string',
            example: 'Mi Currículum'
          },
          personalInfo: {
            type: 'object',
            properties: {
              name: {
                type: 'string'
              },
              email: {
                type: 'string',
                format: 'email'
              },
              phone: {
                type: 'string'
              },
              location: {
                type: 'string'
              },
              summary: {
                type: 'string'
              }
            }
          },
          experience: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                company: {
                  type: 'string'
                },
                position: {
                  type: 'string'
                },
                startDate: {
                  type: 'string',
                  format: 'date'
                },
                endDate: {
                  type: 'string',
                  format: 'date'
                },
                description: {
                  type: 'string'
                }
              }
            }
          },
          education: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                school: {
                  type: 'string'
                },
                degree: {
                  type: 'string'
                },
                field: {
                  type: 'string'
                },
                startDate: {
                  type: 'string',
                  format: 'date'
                },
                endDate: {
                  type: 'string',
                  format: 'date'
                }
              }
            }
          },
          skills: {
            type: 'array',
            items: {
              type: 'string'
            },
            example: ['JavaScript', 'React', 'Node.js']
          },
          projects: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                link: {
                  type: 'string',
                  format: 'url'
                }
              }
            }
          },
          template: {
            type: 'string',
            enum: ['modern', 'classic', 'minimal', 'creative'],
            default: 'modern'
          },
          isPublic: {
            type: 'boolean',
            default: false
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      Error: {
        type: 'object',
        required: ['success', 'message'],
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string',
            example: 'Error message'
          },
          errors: {
            type: 'array',
            items: {
              type: 'object'
            }
          }
        }
      }
    },
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token obtenido del login'
      },
      CookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'token',
        description: 'JWT token en cookie'
      }
    }
  },
  security: [
    {
      BearerAuth: []
    }
  ]
};

module.exports = swaggerConfig;
