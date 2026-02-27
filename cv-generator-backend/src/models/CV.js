const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const contactSchema = new mongoose.Schema({
  email: { type: String, trim: true },
  phone: { type: String, trim: true },
  location: { type: String, trim: true },
  linkedin: { type: String, trim: true },
  github: { type: String, trim: true },
  portfolio: { type: String, trim: true },
  website: { type: String, trim: true }
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  id: { type: String, default: () => uuidv4() },
  company: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  location: { type: String, trim: true },
  startDate: { type: String, required: true },
  endDate: { type: String },
  current: { type: Boolean, default: false },
  description: { type: String, trim: true },
  achievements: [{ type: String, trim: true }]
}, { _id: false });

const educationSchema = new mongoose.Schema({
  id: { type: String, default: () => uuidv4() },
  institution: { type: String, required: true, trim: true },
  degree: { type: String, required: true, trim: true },
  field: { type: String, trim: true },
  location: { type: String, trim: true },
  startDate: { type: String, required: true },
  endDate: { type: String },
  current: { type: Boolean, default: false },
  gpa: { type: String, trim: true },
  achievements: [{ type: String, trim: true }]
}, { _id: false });

const skillSchema = new mongoose.Schema({
  id: { type: String, default: () => uuidv4() },
  name: { type: String, required: true, trim: true },
  level: { type: Number, min: 1, max: 5, default: 3 },
  category: { type: String, enum: ['technical', 'soft', 'language', 'tool', 'other'], default: 'technical' }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  id: { type: String, default: () => uuidv4() },
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  technologies: [{ type: String, trim: true }],
  url: { type: String, trim: true },
  github: { type: String, trim: true },
  image: { type: String },
  startDate: { type: String },
  endDate: { type: String }
}, { _id: false });

const certificationSchema = new mongoose.Schema({
  id: { type: String, default: () => uuidv4() },
  name: { type: String, required: true, trim: true },
  issuer: { type: String, required: true, trim: true },
  date: { type: String },
  expires: { type: String },
  credentialId: { type: String, trim: true },
  url: { type: String, trim: true }
}, { _id: false });

const languageSchema = new mongoose.Schema({
  id: { type: String, default: () => uuidv4() },
  name: { type: String, required: true, trim: true },
  level: { type: String, enum: ['native', 'fluent', 'advanced', 'intermediate', 'basic'], default: 'intermediate' }
}, { _id: false });

const cvSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 100, default: 'Mi CV' },
  slug: { type: String, unique: true, sparse: true },
  personalInfo: {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    title: { type: String, trim: true },
    photo: { type: String },
    summary: { type: String, trim: true, maxlength: 2000 },
    contact: contactSchema
  },
  experience: [experienceSchema],
  education: [educationSchema],
  skills: [skillSchema],
  projects: [projectSchema],
  certifications: [certificationSchema],
  languages: [languageSchema],
  customSections: [{
    id: { type: String, default: () => uuidv4() },
    title: { type: String, required: true, trim: true },
    content: { type: String, trim: true },
    items: [{
      id: { type: String, default: () => uuidv4() },
      title: { type: String, trim: true },
      subtitle: { type: String, trim: true },
      date: { type: String },
      description: { type: String, trim: true }
    }]
  }],
  design: {
    template: { type: String, enum: ['modern', 'classic', 'creative', 'minimal', 'executive', 'tech'], default: 'modern' },
    primaryColor: { type: String, default: '#3B82F6' },
    secondaryColor: { type: String, default: '#1E40AF' },
    fontFamily: { type: String, enum: ['inter', 'roboto', 'poppins', 'playfair', 'montserrat'], default: 'inter' },
    fontSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
    spacing: { type: String, enum: ['compact', 'normal', 'relaxed'], default: 'normal' },
    showPhoto: { type: Boolean, default: true },
    showSkillLevels: { type: Boolean, default: true }
  },
  sectionOrder: { type: [String], default: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages'] },
  visibleSections: {
    summary: { type: Boolean, default: true },
    experience: { type: Boolean, default: true },
    education: { type: Boolean, default: true },
    skills: { type: Boolean, default: true },
    projects: { type: Boolean, default: true },
    certifications: { type: Boolean, default: true },
    languages: { type: Boolean, default: true }
  },
  sharing: {
    isPublic: { type: Boolean, default: false },
    publicUrl: { type: String, unique: true, sparse: true },
    password: { type: String, select: false },
    expiresAt: Date,
    allowDownload: { type: Boolean, default: true }
  },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  analytics: {
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    lastViewed: Date,
    lastDownloaded: Date
  },
  version: { type: Number, default: 1 },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  importedFrom: { source: { type: String, enum: ['linkedin', 'json', 'pdf', null] }, importedAt: Date }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

cvSchema.index({ user: 1, createdAt: -1 });
cvSchema.index({ 'sharing.publicUrl': 1 });
cvSchema.index({ slug: 1 });
cvSchema.index({ status: 1 });

cvSchema.virtual('publicFullUrl').get(function() {
  if (this.sharing?.publicUrl) {
    return `${process.env.FRONTEND_URL || 'http://localhost:5173'}/cv/${this.sharing.publicUrl}`;
  }
  return null;
});

cvSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('title')) {
    const baseSlug = (this.title || 'cv')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (await mongoose.model('CV').findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }
  if (this.sharing?.isPublic && !this.sharing.publicUrl) {
    this.sharing.publicUrl = uuidv4().substring(0, 8);
  }
  if (!this.isNew && this.isModified()) this.version += 1;
  next();
});

cvSchema.methods.clone = async function(newUserId) {
  const clonedData = this.toObject();
  delete clonedData._id; delete clonedData.id; delete clonedData.slug;
  delete clonedData.createdAt; delete clonedData.updatedAt;
  delete clonedData.sharing; delete clonedData.analytics;
  clonedData.user = newUserId || this.user;
  clonedData.title = `${this.title} (copia)`;
  clonedData.status = 'draft';
  clonedData.version = 1;
  return mongoose.model('CV').create(clonedData);
};

cvSchema.methods.incrementViews = async function() {
  this.analytics.views += 1;
  this.analytics.lastViewed = new Date();
  return this.save();
};

cvSchema.methods.incrementDownloads = async function() {
  this.analytics.downloads += 1;
  this.analytics.lastDownloaded = new Date();
  return this.save();
};

cvSchema.methods.toExportJSON = function() {
  const obj = this.toObject();
  delete obj._id; delete obj.id; delete obj.user; delete obj.__v;
  delete obj.createdAt; delete obj.updatedAt;
  delete obj.sharing; delete obj.analytics; delete obj.slug;
  return obj;
};

cvSchema.statics.findPublic = function(publicUrl) {
  return this.findOne({
    'sharing.publicUrl': publicUrl,
    'sharing.isPublic': true,
    $or: [{ 'sharing.expiresAt': null }, { 'sharing.expiresAt': { $gt: new Date() } }]
  });
};

module.exports = mongoose.model('CV', cvSchema);
