const rateLimit = require('express-rate-limit');

exports.generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Demasiadas solicitudes. Por favor espera unos minutos.', retryAfter: 15 },
  standardHeaders: true,
  legacyHeaders: false
});

exports.authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Demasiados intentos de inicio de sesión. Intenta en 1 hora.', retryAfter: 60 },
  skipSuccessfulRequests: true
});

exports.createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: { success: false, message: 'Has creado demasiados recursos. Espera un momento.', retryAfter: 60 }
});

exports.exportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Has realizado demasiadas exportaciones. Espera un momento.', retryAfter: 60 }
});

exports.publicApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { success: false, message: 'Rate limit excedido.', retryAfter: 1 }
});
