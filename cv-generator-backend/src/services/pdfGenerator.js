const PDFDocument = require('pdfkit');
const { Readable } = require('stream');

/**
 * Genera PDF de un CV
 * @param {Object} cvData - Datos del CV
 * @returns {Promise<Buffer>} PDF generado
 */
async function generatePDF(cvData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });

      // Título
      doc.fontSize(24).font('Helvetica-Bold').text(cvData.title || 'CV', {
        align: 'center',
      });

      doc.moveDown();

      // Información personal
      if (cvData.personalInfo) {
        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .text('Información Personal');
        doc.fontSize(12).font('Helvetica').text(cvData.personalInfo.fullName || '');
        doc.moveDown();
      }

      // Experiencia
      if (cvData.experience && cvData.experience.length > 0) {
        doc.fontSize(14).font('Helvetica-Bold').text('Experiencia');
        cvData.experience.forEach((exp) => {
          doc.fontSize(12).font('Helvetica-Bold').text(exp.position || '');
          doc.fontSize(11).font('Helvetica').text(exp.company || '');
          doc.moveDown(0.5);
        });
        doc.moveDown();
      }

      // Educación
      if (cvData.education && cvData.education.length > 0) {
        doc.fontSize(14).font('Helvetica-Bold').text('Educación');
        cvData.education.forEach((edu) => {
          doc.fontSize(12).font('Helvetica-Bold').text(edu.degree || '');
          doc.fontSize(11).font('Helvetica').text(edu.institution || '');
          doc.moveDown(0.5);
        });
        doc.moveDown();
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  generatePDF,
};
