const User = require('../models/User');
const crypto = require('crypto');

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Este email ya está registrado' });
    }
    const user = await User.create({ email, password, name, provider: 'local' });
    const token = user.generateAuthToken();
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: { id: user._id, email: user.email, name: user.name, plan: user.plan },
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Error al registrar usuario' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    user.lastLogin = new Date();
    await user.save();
    const token = user.generateAuthToken();
    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          plan: user.plan,
          settings: user.settings
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ success: false, message: error.message || 'Error al iniciar sesión' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'cvs',
      select: 'title slug status createdAt updatedAt analytics.views',
      options: { sort: { updatedAt: -1 }, limit: 10 }
    });
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          plan: user.plan,
          settings: user.settings,
          usage: user.usage,
          isVerified: user.isVerified,
          createdAt: user.createdAt
        },
        recentCVs: user.cvs
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ success: false, message: 'Error al obtener datos del usuario' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ['name', 'settings'];
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) updates[key] = req.body[key];
    });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({
      success: true,
      message: 'Perfil actualizado',
      data: { user: { id: user._id, email: user.email, name: user.name, settings: user.settings } }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar perfil' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Contraseña actual incorrecta' });
    }
    user.password = newPassword;
    await user.save();
    const token = user.generateAuthToken();
    res.json({ success: true, message: 'Contraseña actualizada', data: { token } });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Error al cambiar contraseña' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
      await user.save();
    }
    res.json({
      success: true,
      message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Error al procesar solicitud' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Token inválido o expirado' });
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
    res.json({ success: true, message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Error al resetear contraseña' });
  }
};

exports.logout = async (req, res) => {
  res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
  res.json({ success: true, message: 'Sesión cerrada' });
};
