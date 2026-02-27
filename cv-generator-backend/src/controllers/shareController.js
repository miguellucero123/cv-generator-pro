const CV = require('../models/CV');
const Analytics = require('../models/Analytics');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

exports.getShareSettings = async (req, res) => {
  try {
    const cv = await CV.findOne({ _id: req.params.id, user: req.user._id }).select('sharing title');
    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV no encontrado' });
    }
    res.json({
      success: true,
      data: {
        title: cv.title,
        sharing: {
          isPublic: cv.sharing?.isPublic || false,
          publicUrl: cv.sharing?.publicUrl,
          fullUrl: cv.publicFullUrl,
          hasPassword: !!cv.sharing?.password,
          expiresAt: cv.sharing?.expiresAt,
          allowDownload: cv.sharing?.allowDownload ?? true
        }
      }
    });
  } catch (error) {
    console.error('Get share settings error:', error);
    res.status(500).json({ success: false, message: 'Error al obtener configuración' });
  }
};

exports.updateShareSettings = async (req, res) => {
  try {
    const { isPublic, password, expiresAt, allowDownload } = req.body;
    const cv = await CV.findOne({ _id: req.params.id, user: req.user._id });
    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV no encontrado' });
    }
    if (!cv.sharing) cv.sharing = {};
    if (typeof isPublic === 'boolean') {
      cv.sharing.isPublic = isPublic;
      if (isPublic && !cv.sharing.publicUrl) {
        cv.sharing.publicUrl = uuidv4().substring(0, 8);
      }
    }
    if (password !== undefined) {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        cv.sharing.password = await bcrypt.hash(password, salt);
      } else {
        cv.sharing.password = undefined;
      }
    }
    if (expiresAt !== undefined) {
      cv.sharing.expiresAt = expiresAt ? new Date(expiresAt) : undefined;
    }
    if (typeof allowDownload === 'boolean') {
      cv.sharing.allowDownload = allowDownload;
    }
    await cv.save();
    await Analytics.create({ cv: cv._id, user: req.user._id, event: 'share', metadata: { isPublic: cv.sharing.isPublic } });
    res.json({
      success: true,
      message: 'Configuración actualizada',
      data: {
        sharing: {
          isPublic: cv.sharing.isPublic,
          publicUrl: cv.sharing.publicUrl,
          fullUrl: cv.publicFullUrl,
          hasPassword: !!cv.sharing.password,
          expiresAt: cv.sharing.expiresAt,
          allowDownload: cv.sharing.allowDownload
        }
      }
    });
  } catch (error) {
    console.error('Update share settings error:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar configuración' });
  }
};

exports.regeneratePublicUrl = async (req, res) => {
  try {
    const cv = await CV.findOne({ _id: req.params.id, user: req.user._id });
    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV no encontrado' });
    }
    cv.sharing = cv.sharing || {};
    cv.sharing.publicUrl = uuidv4().substring(0, 8);
    await cv.save();
    res.json({
      success: true,
      message: 'URL regenerada',
      data: { publicUrl: cv.sharing.publicUrl, fullUrl: cv.publicFullUrl }
    });
  } catch (error) {
    console.error('Regenerate URL error:', error);
    res.status(500).json({ success: false, message: 'Error al regenerar URL' });
  }
};

exports.getPublicCV = async (req, res) => {
  try {
    const { publicUrl } = req.params;
    const cv = await CV.findPublic(publicUrl);
    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV no encontrado o no disponible' });
    }
    if (cv.sharing.password) {
      const authToken = req.headers['x-cv-auth'];
      if (!authToken) {
        return res.status(401).json({ success: false, message: 'Este CV requiere contraseña', code: 'PASSWORD_REQUIRED' });
      }
      const expectedToken = Buffer.from(`${publicUrl}:${cv.sharing.password}`).toString('base64');
      if (authToken !== expectedToken) {
        return res.status(401).json({ success: false, message: 'Contraseña incorrecta', code: 'INVALID_PASSWORD' });
      }
    }
    await cv.incrementViews();
    await Analytics.create({
      cv: cv._id,
      user: cv.user,
      event: 'view',
      visitor: { ip: req.ip, userAgent: req.get('user-agent'), referer: req.get('referer') }
    });
    const publicData = {
      title: cv.title,
      personalInfo: cv.personalInfo,
      experience: cv.experience,
      education: cv.education,
      skills: cv.skills,
      projects: cv.projects,
      certifications: cv.certifications,
      languages: cv.languages,
      customSections: cv.customSections,
      design: cv.design,
      sectionOrder: cv.sectionOrder,
      visibleSections: cv.visibleSections,
      allowDownload: cv.sharing.allowDownload
    };
    res.json({ success: true, data: { cv: publicData } });
  } catch (error) {
    console.error('Get public CV error:', error);
    res.status(500).json({ success: false, message: 'Error al obtener CV' });
  }
};

exports.verifyPassword = async (req, res) => {
  try {
    const { publicUrl } = req.params;
    const { password } = req.body;
    const cv = await CV.findOne({ 'sharing.publicUrl': publicUrl, 'sharing.isPublic': true }).select('+sharing.password');
    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV no encontrado' });
    }
    if (!cv.sharing.password) {
      return res.json({ success: true, message: 'Este CV no requiere contraseña', data: { token: null } });
    }
    const isMatch = await bcrypt.compare(password, cv.sharing.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }
    const token = Buffer.from(`${publicUrl}:${cv.sharing.password}`).toString('base64');
    res.json({ success: true, message: 'Contraseña correcta', data: { token } });
  } catch (error) {
    console.error('Verify password error:', error);
    res.status(500).json({ success: false, message: 'Error al verificar contraseña' });
  }
};

exports.downloadPublicCV = async (req, res) => {
  try {
    const { publicUrl } = req.params;
    const cv = await CV.findPublic(publicUrl);
    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV no encontrado' });
    }
    if (!cv.sharing.allowDownload) {
      return res.status(403).json({ success: false, message: 'Este CV no permite descargas' });
    }
    if (cv.sharing.password) {
      const authToken = req.headers['x-cv-auth'];
      const expectedToken = Buffer.from(`${publicUrl}:${cv.sharing.password}`).toString('base64');
      if (authToken !== expectedToken) {
        return res.status(401).json({ success: false, message: 'Autenticación requerida' });
      }
    }
    await cv.incrementDownloads();
    await Analytics.create({
      cv: cv._id,
      user: cv.user,
      event: 'download',
      visitor: { ip: req.ip, userAgent: req.get('user-agent') },
      metadata: { format: req.query.format || 'json' }
    });
    const exportData = cv.toExportJSON();
    res.json({ success: true, data: exportData });
  } catch (error) {
    console.error('Download public CV error:', error);
    res.status(500).json({ success: false, message: 'Error al descargar CV' });
  }
};
