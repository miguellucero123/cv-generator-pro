const Analytics = require('../models/Analytics');
const CV = require('../models/CV');
const mongoose = require('mongoose');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const cvs = await CV.find({ user: userId }).select('_id title analytics');
    const cvIds = cvs.map(cv => cv._id);
    const totalStats = await Analytics.aggregate([
      { $match: { cv: { $in: cvIds } } },
      { $group: { _id: '$event', count: { $sum: 1 } } }
    ]);
    const stats = { totalViews: 0, totalDownloads: 0, totalShares: 0, totalCVs: cvs.length };
    totalStats.forEach(stat => {
      if (stat._id === 'view') stats.totalViews = stat.count;
      if (stat._id === 'download') stats.totalDownloads = stat.count;
      if (stat._id === 'share') stats.totalShares = stat.count;
    });
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentActivity = await Analytics.aggregate([
      { $match: { cv: { $in: cvIds }, date: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } } },
          views: { $sum: { $cond: [{ $eq: ['$event', 'view'] }, 1, 0] } },
          downloads: { $sum: { $cond: [{ $eq: ['$event', 'download'] }, 1, 0] } }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);
    const topCVs = cvs
      .map(cv => ({ id: cv._id, title: cv.title, views: cv.analytics?.views || 0, downloads: cv.analytics?.downloads || 0 }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
    res.json({
      success: true,
      data: {
        stats,
        recentActivity: recentActivity.map(item => ({ date: item._id.date, views: item.views, downloads: item.downloads })),
        topCVs
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ success: false, message: 'Error al obtener dashboard' });
  }
};

exports.getCVAnalytics = async (req, res) => {
  try {
    const cv = await CV.findOne({ _id: req.params.id, user: req.user._id });
    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV no encontrado' });
    }
    const stats = await Analytics.getCVStats(cv._id, 30);
    const dailyStats = await Analytics.getDailyStats(cv._id, 30);
    res.json({
      success: true,
      data: {
        cv: { id: cv._id, title: cv.title },
        stats: {
          views: stats.views,
          downloads: stats.downloads,
          shares: stats.shares,
          lastViewed: cv.analytics?.lastViewed,
          lastDownloaded: cv.analytics?.lastDownloaded
        },
        dailyStats: dailyStats.map(day => ({
          date: day._id,
          ...day.events.reduce((acc, e) => {
            acc[e.event + 's'] = e.count;
            return acc;
          }, { views: 0, downloads: 0 })
        }))
      }
    });
  } catch (error) {
    console.error('Get CV analytics error:', error);
    res.status(500).json({ success: false, message: 'Error al obtener analytics' });
  }
};

exports.getDetailedAnalytics = async (req, res) => {
  try {
    const cv = await CV.findOne({ _id: req.params.id, user: req.user._id });
    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV no encontrado' });
    }
    const devices = await Analytics.getDeviceStats(cv._id);
    const sources = await Analytics.aggregate([
      { $match: { cv: new mongoose.Types.ObjectId(cv._id), event: 'view' } },
      { $group: { _id: '$visitor.referer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    const hourlyActivity = await Analytics.aggregate([
      { $match: { cv: new mongoose.Types.ObjectId(cv._id), event: 'view' } },
      { $group: { _id: '$hour', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    const countries = await Analytics.aggregate([
      { $match: { cv: new mongoose.Types.ObjectId(cv._id), event: 'view', 'visitor.country': { $exists: true, $ne: null } } },
      { $group: { _id: '$visitor.country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json({
      success: true,
      data: {
        devices: devices.map(d => ({ device: d._id || 'unknown', count: d.count })),
        sources: sources.map(s => ({ source: s._id || 'direct', count: s.count })),
        hourlyActivity: hourlyActivity.map(h => ({ hour: h._id, count: h.count })),
        countries: countries.map(c => ({ country: c._id, count: c.count }))
      }
    });
  } catch (error) {
    console.error('Get detailed analytics error:', error);
    res.status(500).json({ success: false, message: 'Error al obtener analytics detallados' });
  }
};

exports.exportAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query;
    const cvs = await CV.find({ user: req.user._id }).select('_id');
    const cvIds = cvs.map(cv => cv._id);
    const query = { cv: { $in: cvIds } };
    if (startDate) query.date = { ...query.date, $gte: new Date(startDate) };
    if (endDate) query.date = { ...query.date, $lte: new Date(endDate) };
    const analytics = await Analytics.find(query)
      .populate('cv', 'title')
      .sort({ date: -1 })
      .limit(1000);
    if (format === 'csv') {
      const headers = ['Fecha', 'CV', 'Evento', 'Dispositivo', 'País'];
      const rows = analytics.map(a => [
        a.date.toISOString(),
        a.cv?.title || 'N/A',
        a.event,
        a.visitor?.device || 'unknown',
        a.visitor?.country || 'N/A'
      ]);
      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=analytics.csv');
      return res.send(csv);
    }
    res.json({
      success: true,
      data: {
        analytics: analytics.map(a => ({
          date: a.date,
          cvTitle: a.cv?.title,
          event: a.event,
          device: a.visitor?.device,
          country: a.visitor?.country
        }))
      }
    });
  } catch (error) {
    console.error('Export analytics error:', error);
    res.status(500).json({ success: false, message: 'Error al exportar analytics' });
  }
};
