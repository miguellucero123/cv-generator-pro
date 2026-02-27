const { body, param, validationResult } = require('express-validator');

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
    });
  }
  next();
};

exports.validateRegister = [
  body('email').trim().isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/\d/)
    .withMessage('La contraseña debe contener al menos un número'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .escape()
];

exports.validateLogin = [
  body('email').trim().isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es requerida')
];

exports.validateCV = [
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('El título debe tener entre 1 y 100 caracteres'),
  body('personalInfo.firstName').optional().trim().isLength({ max: 50 }).withMessage('Nombre muy largo'),
  body('personalInfo.lastName').optional().trim().isLength({ max: 50 }).withMessage('Apellido muy largo'),
  body('personalInfo.contact.email').optional().trim().isEmail().withMessage('Email de contacto inválido'),
  body('design.primaryColor').optional().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).withMessage('Color primario inválido'),
  body('design.template').optional().isIn(['modern', 'classic', 'creative', 'minimal', 'executive', 'tech']).withMessage('Plantilla inválida')
];

exports.validateObjectId = (paramName = 'id') => [
  param(paramName).isMongoId().withMessage('ID inválido')
];

exports.validateShare = [
  body('isPublic').optional().isBoolean().withMessage('isPublic debe ser booleano'),
  body('password').optional().isLength({ min: 4 }).withMessage('La contraseña debe tener al menos 4 caracteres'),
  body('expiresAt').optional().isISO8601().withMessage('Fecha de expiración inválida')
];
