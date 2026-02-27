/**
 * METGO_3D - Mapeo entre formato frontend (Vue) y backend (API)
 */

export function mapBackendToFrontend(backendCv) {
  if (!backendCv) return null
  const pi = backendCv.personalInfo || {}
  const contact = pi.contact || {}

  const skills = backendCv.skills || []
  const byCategory = {}
  skills.forEach((s) => {
    const cat = s.category || 'technical'
    if (!byCategory[cat]) byCategory[cat] = { titulo: cat, icon: 'fa-star', skills: [] }
    byCategory[cat].skills.push({
      nombre: s.name,
      nivel: Math.min(100, ((s.level || 3) - 1) * 25),
      certificado: false
    })
  })
  const defaultCats = {
    programacion: { titulo: 'Programación & Desarrollo', icon: 'fa-code', skills: [] },
    datascience: { titulo: 'Ciencia de Datos', icon: 'fa-chart-line', skills: [] },
    herramientas: { titulo: 'Herramientas', icon: 'fa-tools', skills: [] },
    soft: { titulo: 'Competencias Blandas', icon: 'fa-users', skills: [] }
  }
  const competencias = { ...defaultCats, ...byCategory }

  return {
    personal: {
      nombre: [pi.firstName, pi.lastName].filter(Boolean).join(' ').trim() || 'Nombre',
      titulo: pi.title || '',
      subtitulo: '',
      ubicacion: contact.location || '',
      telefono: contact.phone || '',
      email: contact.email || '',
      linkedin: contact.linkedin || '',
      linkedinUrl: contact.linkedin || '',
      github: contact.github || '',
      githubUrl: contact.github || '',
      website: contact.website || '',
      websiteUrl: contact.website || '',
      portfolio: contact.portfolio || '',
      portfolioUrl: contact.portfolio || '',
      disponibilidad: '',
      modalidad: ''
    },
    perfil: {
      resumen: pi.summary || '',
      destacados: [],
      propuestaValor: ''
    },
    competencias,
    educacion: (backendCv.education || []).map((e) => ({
      titulo: e.degree,
      institucion: e.institution,
      periodo: e.endDate || e.startDate || '',
      estado: e.current ? 'En curso' : 'Completado',
      tipo: 'formacion',
      destacado: false,
      descripcion: ''
    })),
    certificaciones: (backendCv.certifications || []).map((c) => ({
      nombre: c.name,
      institucion: c.issuer,
      fecha: c.date || '',
      credencial: c.credentialId,
      url: c.url,
      verificable: !!c.url,
      destacado: false
    })),
    experiencia: (backendCv.experience || []).map((e) => ({
      cargo: e.position,
      empresa: e.company,
      proyecto: null,
      ubicacion: e.location || '',
      periodo: [e.startDate, e.endDate].filter(Boolean).join(' - '),
      duracion: '',
      tipo: '',
      industria: '',
      logros: (e.achievements || []).map((a) => ({
        descripcion: typeof a === 'string' ? a : a.descripcion || a,
        impacto: '',
        metrica: null
      })),
      tecnologias: [],
      destacado: false
    })),
    proyectos: (backendCv.projects || []).map((p) => ({
      nombre: p.name,
      descripcion: p.description || '',
      tecnologias: p.technologies || [],
      url: p.url,
      github: p.github
    }))
  }
}

export function mapFrontendToBackend(cvData) {
  if (!cvData) return {}
  const personal = cvData.personal || {}
  const perfil = cvData.perfil || {}
  const competencias = cvData.competencias || {}

  const skills = []
  Object.values(competencias).forEach((cat) => {
    if (cat?.skills) {
      cat.skills.forEach((s) => {
        const name = s.nombre ?? s.name
        if (!name) return
        const nivel = s.nivel ?? 3
        const level = typeof nivel === 'number' ? Math.min(5, Math.max(1, Math.round(nivel / 20) + 1)) : 3
        skills.push({
          name,
          level,
          category: 'technical'
        })
      })
    }
  })

  return {
    title: cvData.title || `${personal.nombre || 'CV'} - METGO_3D`,
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
    experience: (cvData.experiencia || []).map((e) => ({
      company: e.empresa,
      position: e.cargo,
      location: e.ubicacion,
      startDate: e.periodo?.split(' - ')[0] || '',
      endDate: e.periodo?.split(' - ')[1],
      current: false,
      description: '',
      achievements: (e.logros || []).map((l) => (typeof l === 'string' ? l : l.descripcion))
    })),
    education: (cvData.educacion || []).map((e) => ({
      institution: e.institucion,
      degree: e.titulo,
      field: '',
      location: '',
      startDate: e.periodo || '',
      endDate: '',
      current: e.estado === 'En curso'
    })),
    skills,
    projects: (cvData.proyectos || []).map((p) => ({
      name: p.nombre,
      description: p.descripcion,
      technologies: p.tecnologias || [],
      url: p.url,
      github: p.github
    })),
    certifications: (cvData.certificaciones || []).map((c) => ({
      name: c.nombre,
      issuer: c.institucion || 'N/A',
      date: c.fecha,
      credentialId: c.credencial,
      url: c.url
    }))
  }
}
