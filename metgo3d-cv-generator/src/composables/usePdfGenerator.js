/**
 * METGO_3D VIRTUALIZE - PDF Generator Composable
 */

import { ref } from 'vue'

export function usePdfGenerator() {
  const isGenerating = ref(false)
  const error = ref(null)

  const generatePDF = async (element, options = {}) => {
    if (!element) return false

    isGenerating.value = true
    error.value = null

    const defaultOptions = {
      filename: 'CV_METGO3D.pdf',
      margin: [10, 10, 10, 10],
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
        backgroundColor: '#ffffff'
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true
      }
    }

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      html2canvas: { ...defaultOptions.html2canvas, ...options.html2canvas },
      jsPDF: { ...defaultOptions.jsPDF, ...options.jsPDF }
    }

    try {
      const html2pdf = (await import('html2pdf.js')).default

      await html2pdf()
        .set(mergedOptions)
        .from(element)
        .save()

      return true
    } catch (err) {
      console.error('Error generating PDF:', err)
      error.value = err.message || 'Error al generar el PDF'
      alert(`Error al generar el PDF: ${error.value}\n\nPrueba usar Ctrl+P para imprimir.`)
      return false
    } finally {
      isGenerating.value = false
    }
  }

  return {
    isGenerating,
    error,
    generatePDF
  }
}
