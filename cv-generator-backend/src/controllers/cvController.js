const CV = require('../models/CV');
const Analytics = require('../models/Analytics');
const User = require('../models/User');

exports.getCVs = async (req, res) => {
  try {
    const { status, sort = '-updatedAt', page = 1, limit = 10 } = req.query;
    const query = { user: req.user._id };
    if (status) query.status = status;
    const cvs = await CV.find(query)
      .select('title slug status design.template personalInfo.firstName personalInfo.lastName analytics sharing.publicUrl sharing.isPublic createdAt updatedAt')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await CV.countDocuments(query);
    res.json({
      success: true,
      data: {
        cvs,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
      }
    });
  } catch (error) {
    console.error('Get CVs error:', error);
    res.status(500).json({ success: false, message: 'Error al obtener CVs' });
  }
};

exports.getCV = async (req, res) => {
  try {
    const cv = await CV.findOne({ _id: req.params.id, user: req.user._id });
    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV no encontrado' });
    }
    res.json({ success: true, data: { cv } });
  } catch (error) {
    console.error('Get CV error:', error);
    res.status(500).json({ success: false, message: 'Error al obtener CV' });
  }
};

exports.createCV = async (req, res) => {
  try {
    if (!req.user.canCreateCV()) {
      return res.status(403).json({
        success: false,
        message: 'Has alcanzado el límite de CVs para tu plan',
        code: 'CV_LIMIT_REACHED'
      });
    }
    const cv = await CV.create({ ...req.body, user: req.user._id });
    await User.findByIdAndUpdate(req.user._id, { $inc: { 'usage.cvsCreated': 1 } });
    await Analytics.create({ cv: cv._id, user: req.user._id, event: 'create' });
    res.status(201).json({ success: true, message: 'CV creado exitosamente', data: { cv } });
  } catch (error) {
    console.error('Create CV error:', error);
    res.status(500).json({ success: false, message: 'Error al crear CV' });
  }
};

exports.updateCV = async (req, res) => {
  try {
    const cv = await CV.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body, lastModifiedBy: req.user._id },
      { new: true, runValidators: true }
    );
    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV no encontrado' });
    }
    await Analytics.create({ cv: cv._id, user: req.user._id, event: 'edit' });
    res.json({ success: true, message: 'CV actualizado', data: { cv } });
  } catch (error) {
    console.error('Update CV error:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar CV' });
  }
};

exports.deleteCV = async (req, res) => {
  try {
    const cv = await CV.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV no encontrado' });
    }
    await User.findByIdAndUpdate(req.user._id, { $inc: { 'usage.cvsCreated': -1 } });
    await Analytics.deleteMany({ cv: cv._id });
    res.json({ success: true, message: 'CV eliminado' });
  } catch (error) {
    console.error('Delete CV error:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar CV' });
  }
};

exports.cloneCV = async (req, res) => {
  try {
    if (!req.user.canCreateCV()) {
      return res.status(403).json({
        success: false,
        message: 'Has alcanzado el límite de CVs para tu plan',
        code: 'CV_LIMIT_REACHED'
      });
    }
    const originalCV = await CV.findOne({ _id: req.params.id, user: req.user._id });
    if (!originalCV) {
      return res.status(404).json({ success: false, message: 'CV no encontrado' });
    }
    const clonedCV = await originalCV.clone();
    await User.findByIdAndUpdate(req.user._id, { $inc: { 'usage.cvsCreated': 1 } });
    await Analytics.create({ cv: clonedCV._id, user: req.user._id, event: 'clone', metadata: { originalCVId: originalCV._id } });
    res.status(201).json({ success: true, message: 'CV clonado exitosamente', data: { cv: clonedCV } });
  } catch (error) {
    console.error('Clone CV error:', error);
    res.status(500).json({ success: false, message: 'Error al clonar CV' });
  }
};

exports.exportCV = async (req, res) => {
  try {
    const cv = await CV.findOne({ _id: req.params.id, user: req.user._id });
    if (!cv) {
      return res.status(404).json({ success: false, message: 'CV no encontrado' });
    }
    const exportData = cv.toExportJSON();
    await Analytics.create({ cv: cv._id, user: req.user._id, event: 'download', metadata: { format: 'json' } });
    res.json({ success: true, data: exportData });
  } catch (error) {
    console.error('Export CV error:', error);
    res.status(500).json({ success: false, message: 'Error al exportar CV' });
  }
};

exports.importCV = async (req, res) => {
  try {
    if (!req.user.canCreateCV()) {
      return res.status(403).json({
        success: false,
        message: 'Has alcanzado el límite de CVs para tu plan',
        code: 'CV_LIMIT_REACHED'
      });
    }
    const importData = req.body;
    if (!importData.personalInfo && !importData.title && !importData.personal) {
      return res.status(400).json({ success: false, message: 'Formato de CV inválido' });
    }
    const mapped = mapFrontendToBackend(importData);
    const cv = await CV.create({
      ...mapped,
      user: req.user._id,
      importedFrom: { source: 'json', importedAt: new Date() }
    });
    await User.findByIdAndUpdate(req.user._id, { $inc: { 'usage.cvsCreated': 1 } });
    res.status(201).json({ success: true, message: 'CV importado exitosamente', data: { cv } });
  } catch (error) {
    console.error('Import CV error:', error);
    res.status(500).json({ success: false, message: 'Error al importar CV' });
  }
};

function mapFrontendToBackend(data) {
  if (data.personalInfo) return data;
  const personal = data.personal || {};
  const perfil = data.perfil || {};
  const competencias = data.competencias || {};
  const educacion = data.educacion || [];
  const experiencia = data.experiencia || [];
  const proyectos = data.proyectos || [];
  const certificaciones = data.certificaciones || [];

  const skills = [];
  Object.values(competencias).forEach(cat => {
    if (cat?.skills) {
      cat.skills.forEach(s => {
        skills.push({
          name: s.nombre || s.name,
          level: s.nivel ? Math.round((s.nivel || 3) / 20) + 1 : 3,
          category: 'technical'
        });
      });
    }
  });

  return {
    title: data.title || `${personal.nombre || 'CV'} - METGO_3D`,
    personalInfo: {
      firstName: (personal.nombre || '').split(' ')[0] || '',
      lastName: (personal.nombre || '').split(' ').slice(1).join(' ') || '',
      title: personal.titulo,
      summary: perfil.resumen || perfil.propuestaValor,
      contact: {
        email: personal.email,
        phone: personal.telefono,
        location: personal.ubicacion,
        linkedin: personal.linkedinUrl || personal.linkedin,
        github: personal.githubUrl || personal.github,
        portfolio: personal.portfolioUrl || personal.portfolio,
        website: personal.websiteUrl || personal.website
      }
    },
    experience: experiencia.map(e => ({
      company: e.empresa,
      position: e.cargo,
      location: e.ubicacion,
      startDate: e.fechaInicio,
      endDate: e.fechaFin,
      current: !!e.actual,
      description: e.descripcion,
      achievements: e.logros || []
    })),
    education: educacion.map(e => ({
      institution: e.institucion,
      degree: e.titulo,
      field: e.carrera,
      location: e.ubicacion,
      startDate: e.fechaInicio,
      endDate: e.fechaFin,
      current: !!e.actual
    })),
    skills,
    projects: proyectos.map(p => ({
      name: p.nombre,
      description: p.descripcion,
      technologies: p.tecnologias || [],
      url: p.url,
      github: p.github
    })),
    certifications: certificaciones.map(c => ({
      name: c.nombre,
      issuer: c.emisor || 'N/A',
      date: c.fecha
    })),
    design: { template: data.design?.template || 'modern' }
  };
}
