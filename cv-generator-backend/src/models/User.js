const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  password: {
    type: String,
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false
  },
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [100, 'Nombre muy largo']
  },
  avatar: { type: String, default: null },
  provider: {
    type: String,
    enum: ['local', 'google', 'linkedin'],
    default: 'local'
  },
  providerId: String,
  settings: {
    language: { type: String, enum: ['es', 'en', 'pt'], default: 'es' },
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    emailNotifications: { type: Boolean, default: true }
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  planExpires: Date,
  usage: {
    cvsCreated: { type: Number, default: 0 },
    cvsExported: { type: Number, default: 0 },
    lastExport: Date
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.virtual('cvs', {
  ref: 'CV',
  localField: '_id',
  foreignField: 'user'
});

userSchema.index({ email: 1 });
userSchema.index({ provider: 1, providerId: 1 });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, email: this.email, plan: this.plan },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

userSchema.methods.isLocked = function() {
  return this.lockUntil && this.lockUntil > Date.now();
};

userSchema.methods.incLoginAttempts = async function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({ $set: { loginAttempts: 1 }, $unset: { lockUntil: 1 } });
  }
  const updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= 5) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 };
  }
  return this.updateOne(updates);
};

userSchema.methods.getPlanLimits = function() {
  const limits = {
    free: { cvs: 3, exports: 10, templates: ['modern', 'classic'] },
    pro: { cvs: 20, exports: 100, templates: 'all' },
    enterprise: { cvs: Infinity, exports: Infinity, templates: 'all' }
  };
  return limits[this.plan] || limits.free;
};

userSchema.methods.canCreateCV = function() {
  const limits = this.getPlanLimits();
  return this.usage.cvsCreated < limits.cvs;
};

userSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) throw new Error('Credenciales inválidas');
  if (user.isLocked()) throw new Error('Cuenta bloqueada temporalmente. Intenta más tarde.');
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    await user.incLoginAttempts();
    throw new Error('Credenciales inválidas');
  }
  if (user.loginAttempts > 0) {
    await user.updateOne({ $set: { loginAttempts: 0, lastLogin: new Date() }, $unset: { lockUntil: 1 } });
  }
  return user;
};

module.exports = mongoose.model('User', userSchema);
