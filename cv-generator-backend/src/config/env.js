/**
 * Environment Configuration Validator
 * Valida variables de entorno requeridas y opcionales
 * Se ejecuta al iniciar la aplicación
 */

const requiredVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'FRONTEND_URL',
  'NODE_ENV',
  'PORT'
];

const optionalVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'LINKEDIN_CLIENT_ID',
  'LINKEDIN_CLIENT_SECRET',
  'CLOUDINARY_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_FROM',
  'ANALYTICS_ENABLED',
  'DEBUG'
];

/**
 * Valida que todas las variables requeridas estén configuradas
 * @throws {Error} Si falta alguna variable requerida
 */
function validateEnv() {
  const missing = [];
  const warnings = [];

  // Validar variables requeridas
  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  // Avisar sobre variables opcionales no configuradas
  optionalVars.forEach((varName) => {
    if (!process.env[varName]) {
      warnings.push(varName);
    }
  });

  // Si faltan variables requeridas, lanzar error
  if (missing.length > 0) {
    const errorMsg = `
╔════════════════════════════════════════╗
║  ❌ ERROR: Variables Requeridas       ║
║     Faltantes en archivo .env          ║
╚════════════════════════════════════════╝

Variables que DEBEN estar configuradas:
${missing.map((v) => `  • ${v}`).join('\n')}

Solución:
  1. Copia .env.example a .env
  2. Configura todas las variables requeridas
  3. Ejecuta: npm run dev

Documentación:
  Ver cv-generator-backend/README.md
    `;
    throw new Error(errorMsg);
  }

  // Avisos sobre variables opcionales
  if (warnings.length > 0 && process.env.NODE_ENV === 'production') {
    console.warn('\n⚠️  Variables opcionales no configuradas:');
    warnings.forEach((v) => console.warn(`   • ${v}`));
    console.warn('');
  }

  // Validaciones adicionales
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn(`
⚠️  ADVERTENCIA DE SEGURIDAD:
    JWT_SECRET es muy corto (${process.env.JWT_SECRET.length} caracteres)
    Recomendado: 32+ caracteres aleatorios
    
Generar secreto:
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    `);
  }

  // Validar puerto
  const port = parseInt(process.env.PORT, 10);
  if (isNaN(port) || port < 1024 || port > 65535) {
    throw new Error(`PORT debe ser un número entre 1024 y 65535. Actual: ${process.env.PORT}`);
  }

  // Validar NODE_ENV
  const validEnvs = ['development', 'production', 'test'];
  if (!validEnvs.includes(process.env.NODE_ENV)) {
    console.warn(`
⚠️  NODE_ENV debe ser uno de: ${validEnvs.join(', ')}
    Actual: ${process.env.NODE_ENV}
    `);
  }

  return true;
}

/**
 * Obtiene objeto con todas las variables de configuración
 * @returns {Object} Configuración validada
 */
function getConfig() {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 5000,
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    frontendUrl: process.env.FRONTEND_URL,

    // OAuth
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
    },

    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      enabled: !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET)
    },

    // Cloudinary
    cloudinary: {
      name: process.env.CLOUDINARY_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
      enabled: !!(
        process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
      )
    },

    // SMTP
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      from: process.env.SMTP_FROM,
      enabled: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
    },

    // Features
    analytics: process.env.ANALYTICS_ENABLED === 'true',
    debug: process.env.DEBUG === 'true'
  };
}

/**
 * Imprime status de configuración
 */
function printConfigStatus() {
  const config = getConfig();

  console.log(`
╔════════════════════════════════════════╗
║  ⚙️  CONFIGURACIÓN                     ║
╚════════════════════════════════════════╝

Ambiente:        ${config.nodeEnv.toUpperCase()}
Puerto:          ${config.port}
Base de datos:   ${config.mongodbUri.includes('localhost') ? '🔴 Local' : '🔵 Cloud'}

Integraciones:
  • Google OAuth:  ${config.google.enabled ? '✅ Activado' : '⚠️  Desactivado'}
  • LinkedIn:      ${config.linkedin.enabled ? '✅ Activado' : '⚠️  Desactivado'}
  • Cloudinary:    ${config.cloudinary.enabled ? '✅ Activado' : '⚠️  Desactivado'}
  • Email (SMTP):  ${config.smtp.enabled ? '✅ Activado' : '⚠️  Desactivado'}
  • Analytics:     ${config.analytics ? '✅ Activado' : '⚠️  Desactivado'}
  • Debug:         ${config.debug ? '✅ Activado' : '⚠️  Desactivado'}
`);
}

module.exports = {
  validateEnv,
  getConfig,
  printConfigStatus,
  requiredVars,
  optionalVars
};
