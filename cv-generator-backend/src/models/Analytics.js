const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  cv: { type: mongoose.Schema.Types.ObjectId, ref: 'CV', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  event: { type: String, enum: ['view', 'download', 'share', 'edit', 'create', 'delete', 'clone'], required: true },
  visitor: {
    ip: String,
    userAgent: String,
    referer: String,
    country: String,
    city: String,
    device: { type: String, enum: ['desktop', 'mobile', 'tablet', 'unknown'], default: 'unknown' },
    browser: String,
    os: String
  },
  metadata: {
    format: String,
    template: String,
    duration: Number,
    source: String,
    originalCVId: mongoose.Schema.Types.ObjectId
  },
  date: { type: Date, default: Date.now, index: true },
  hour: Number,
  dayOfWeek: Number,
  month: Number,
  year: Number
}, { timestamps: true });

analyticsSchema.index({ cv: 1, event: 1, date: -1 });
analyticsSchema.index({ user: 1, date: -1 });
analyticsSchema.index({ date: -1, event: 1 });

analyticsSchema.pre('save', function(next) {
  const now = this.date || new Date();
  this.hour = now.getHours();
  this.dayOfWeek = now.getDay();
  this.month = now.getMonth() + 1;
  this.year = now.getFullYear();
  next();
});

analyticsSchema.statics.getCVStats = async function(cvId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const stats = await this.aggregate([
    { $match: { cv: new mongoose.Types.ObjectId(cvId), date: { $gte: startDate } } },
    { $group: { _id: '$event', count: { $sum: 1 } } }
  ]);
  const result = { views: 0, downloads: 0, shares: 0 };
  stats.forEach(stat => { result[stat._id + 's'] = stat.count; });
  return result;
};

analyticsSchema.statics.getDailyStats = async function(cvId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  return this.aggregate([
    { $match: { cv: new mongoose.Types.ObjectId(cvId), date: { $gte: startDate } } },
    { $group: { _id: { date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, event: '$event' }, count: { $sum: 1 } } },
    { $group: { _id: '$_id.date', events: { $push: { event: '$_id.event', count: '$count' } } } },
    { $sort: { _id: 1 } }
  ]);
};

analyticsSchema.statics.getUserStats = async function(userId) {
  return this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: '$event', count: { $sum: 1 }, lastOccurrence: { $max: '$date' } } }
  ]);
};

analyticsSchema.statics.getDeviceStats = async function(cvId) {
  return this.aggregate([
    { $match: { cv: new mongoose.Types.ObjectId(cvId), event: 'view' } },
    { $group: { _id: '$visitor.device', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
};

module.exports = mongoose.model('Analytics', analyticsSchema);
