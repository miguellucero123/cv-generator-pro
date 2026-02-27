<template>
  <section class="layout">
    <ControlPanel
      :cv-data="editor.cvData"
      :is-editing="editor.isEditing.value"
      :current-template="currentTemplate"
      :is-generating-pdf="pdf.isGenerating.value"
      :t="i18n.t"
    :cv-id="currentCvId"
    :is-saving-cloud="isSavingCloud"
    :show-save-cloud="auth.isLoggedIn.value"
      @toggle-editor="editor.toggleEditor"
      @export-pdf="handleExportPdf"
      @change-template="currentTemplate = $event"
      @start-presentation="presentation.startPresentation"
      @save-cloud="handleSaveCloud"
    />
    <div ref="cvPreviewRef" class="cv-preview-wrapper">
      <CVPreview :cv-data="editor.cvData" :template="currentTemplate" />
    </div>
  </section>

  <PresentationMode
    :is-active="presentation.isActive.value"
    :current-slide="presentation.currentSlide.value"
    :total-slides="presentation.totalSlides.value"
    :progress="presentation.progress.value"
    :is-paused="presentation.isPaused.value"
    :has-next="presentation.hasNext.value"
    :has-prev="presentation.hasPrev.value"
    :current-slide-data="presentation.currentSlideData.value"
    :cv-data="editor.cvData"
    :brand="brandConfig"
    :slides="presentationSlides"
    @next="presentation.nextSlide"
    @prev="presentation.prevSlide"
    @go-to="presentation.goToSlide"
    @toggle-autoplay="presentation.toggleAutoPlay"
    @end="presentation.endPresentation"
  />

  <CVEditor
    :is-open="editor.isEditing.value"
    :cv-data="editor.cvData"
    :tabs="editor.tabs"
    :active-tab="editor.activeTab.value"
    :has-changes="editor.hasChanges.value"
    :is-saving="editor.isSaving.value"
    :last-saved="editor.lastSaved.value"
    :can-undo="editor.canUndo.value"
    :can-redo="editor.canRedo.value"
    :completion-percentage="editor.completionPercentage.value"
    @close="editor.toggleEditor"
    @save="editor.saveChanges"
    @update="editor.updateField"
    @update-array="editor.updateArrayItem"
    @add="editor.addArrayItem"
    @remove="editor.removeArrayItem"
    @move="editor.moveArrayItem"
    @undo="editor.undo"
    @redo="editor.redo"
    @reset="editor.resetToDefault"
    @export="editor.exportData"
    @import="editor.importData"
    @set-tab="editor.setActiveTab"
  />
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useEditor } from '@composables/useEditor'
import { usePdfGenerator } from '@composables/usePdfGenerator'
import { useI18n } from '@composables/useI18n'
import { usePresentation } from '@composables/usePresentation'
import { useScrollAnimations } from '@composables/useScrollAnimations'
import { useCVAPI } from '@composables/useCVAPI'
import { useAuthAPI } from '@composables/useAuthAPI'
import { buildSlidesFromCv } from '@utils/presentationSlides'
import { brandConfig } from '@data/cvData'
import ControlPanel from '@components/layout/ControlPanel.vue'
import CVPreview from '@components/cv/CVPreview.vue'
import CVEditor from '@components/editor/CVEditor.vue'
import PresentationMode from '@components/presentation/PresentationMode.vue'

const route = useRoute()
const editor = useEditor()
const pdf = usePdfGenerator()
const i18n = useI18n()
const cvApi = useCVAPI()
const auth = useAuthAPI()

const presentationSlides = computed(() => buildSlidesFromCv(editor.cvData))
const presentation = usePresentation(presentationSlides)

const scrollAnim = useScrollAnimations()
const cvPreviewRef = ref(null)
const currentTemplate = ref('modern')
const currentCvId = ref(null)
const isSavingCloud = ref(false)

const handleExportPdf = async () => {
  const el = cvPreviewRef.value
  if (el) await pdf.generatePDF(el)
}

const handleSaveCloud = async () => {
  if (isSavingCloud.value) return
  isSavingCloud.value = true
  try {
    if (currentCvId.value) {
      await cvApi.updateCV(currentCvId.value, editor.cvData, true)
      editor.saveChanges()
    } else {
      const res = await cvApi.createCV(editor.cvData, true)
      if (res?.data?.cv?._id) {
        currentCvId.value = res.data.cv._id
        editor.saveChanges()
      }
    }
  } catch (err) {
    console.error('Error guardando en la nube:', err)
  } finally {
    isSavingCloud.value = false
  }
}

watch(
  () => route.params.id,
  async (id) => {
    if (id) {
      currentCvId.value = id
      try {
        const res = await cvApi.getCV(id, true)
        if (res?.data?.cv) {
          editor.loadCvData(res.data.cv)
        }
      } catch (err) {
        console.error('Error cargando CV:', err)
      }
    } else {
      currentCvId.value = null
    }
  },
  { immediate: true }
)

onMounted(() => {
  nextTick(() => scrollAnim.observeAll('.scroll-animate'))
})
</script>
