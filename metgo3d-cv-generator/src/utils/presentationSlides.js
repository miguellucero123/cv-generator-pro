/**
 * Build presentation slides from cvData
 */
export function buildSlidesFromCv(cvData) {
  const p = cvData.personal || {}
  const pr = cvData.perfil || {}
  const comp = cvData.competencias || {}
  const edu = cvData.educacion || []
  const exp = cvData.experiencia || []
  const proj = cvData.proyectos || []

  const slides = []

  slides.push({
    type: 'title',
    title: p.nombre || 'CV',
    subtitle: p.titulo || '',
    content: p.subtitulo || ''
  })

  if (pr.resumen) {
    slides.push({
      type: 'profile',
      title: 'Perfil Profesional',
      content: pr.resumen
    })
  }

  const allSkills = []
  if (comp.programacion?.skills) allSkills.push(...comp.programacion.skills.map(s => s.nombre || s))
  if (comp.datascience?.skills) allSkills.push(...comp.datascience.skills.map(s => s.nombre || s))
  if (comp.herramientas?.skills) allSkills.push(...comp.herramientas.skills.map(s => s.nombre || s))
  if (allSkills.length) {
    slides.push({ type: 'skills', title: 'Competencias', items: allSkills })
  }

  if (edu.length) {
    slides.push({
      type: 'list',
      title: 'Formación',
      items: edu.slice(0, 5).map(e => `${e.titulo} — ${e.institucion} (${e.periodo})`)
    })
  }

  if (exp.length) {
    slides.push({
      type: 'list',
      title: 'Experiencia',
      items: exp.slice(0, 4).map(e => `${e.cargo} — ${e.empresa} (${e.periodo})`)
    })
  }

  if (proj.length) {
    slides.push({
      type: 'list',
      title: 'Proyectos',
      items: proj.slice(0, 4).map(p => p.nombre || p)
    })
  }

  slides.push({
    type: 'contact',
    title: 'Contacto',
    email: p.email,
    phone: p.telefono,
    location: p.ubicacion
  })

  return slides
}
