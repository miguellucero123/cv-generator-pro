const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }
    if (!token) {
      return res.status(401).json({ success: false, message: 'No autorizado. Por favor inicia sesión.' });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'El usuario ya no existe.' });
      }
      if (user.isLocked()) {
        return res.status(423).json({ success: false, message: 'Cuenta bloqueada temporalmente.' });
      }
      req.user = user;
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Sesión expirada. Por favor inicia sesión nuevamente.',
          code: 'TOKEN_EXPIRED'
        });
      }
      return res.status(401).json({ success: false, message: 'Token inválido.' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ success: false, message: 'Error de autenticación.' });
  }
};

exports.optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = await User.findById(decoded.id);
      } catch (e) {
        req.user = null;
      }
    }
    next();
  } catch (error) {
    next();
  }
};

exports.requirePlan = (...allowedPlans) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'No autorizado.' });
    }
    if (!allowedPlans.includes(req.user.plan)) {
      return res.status(403).json({
        success: false,
        message: `Esta función requiere plan ${allowedPlans.join(' o ')}.`,
        code: 'PLAN_REQUIRED',
        requiredPlan: allowedPlans
      });
    }
    next();
  };
};

exports.requireOwnership = (model, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const Model = require(`../models/${model}`);
      const resource = await Model.findById(req.params[paramName]);
      if (!resource) {
        return res.status(404).json({ success: false, message: 'Recurso no encontrado.' });
      }
      const resourceUserId = resource.user?.toString() || resource.userId?.toString();
      if (resourceUserId !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'No tienes permiso para acceder a este recurso.' });
      }
      req.resource = resource;
      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      res.status(500).json({ success: false, message: 'Error verificando permisos.' });
    }
  };
};

exports.checkUsageLimit = (limitType) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const limits = user.getPlanLimits();
      switch (limitType) {
        case 'cvs':
          if (user.usage.cvsCreated >= limits.cvs) {
            return res.status(403).json({
              success: false,
              message: `Has alcanzado el límite de ${limits.cvs} CVs para tu plan.`,
              code: 'CV_LIMIT_REACHED',
              limit: limits.cvs,
              current: user.usage.cvsCreated
            });
          }
          break;
        case 'exports':
          if (user.usage.cvsExported >= limits.exports) {
            return res.status(403).json({
              success: false,
              message: `Has alcanzado el límite de ${limits.exports} exportaciones para tu plan.`,
              code: 'EXPORT_LIMIT_REACHED',
              limit: limits.exports,
              current: user.usage.cvsExported
            });
          }
          break;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
