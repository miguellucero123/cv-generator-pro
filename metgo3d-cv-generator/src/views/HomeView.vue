<template>
  <div class="home-view">
    <!-- Landing page si no está logueado -->
    <section v-if="!auth.isLoggedIn.value" class="landing">
      <div class="landing-content">
        <h2 class="landing-title">{{ i18n.t('auth.welcomeTitle') }}</h2>
        <p class="landing-subtitle">{{ i18n.t('auth.welcomeSubtitle') }}</p>
        
        <div class="landing-features">
          <div class="feature-card">
            <i class="fas fa-edit"></i>
            <span>{{ i18n.t('auth.features.editor') }}</span>
          </div>
          <div class="feature-card">
            <i class="fas fa-palette"></i>
            <span>{{ i18n.t('auth.features.templates') }}</span>
          </div>
          <div class="feature-card">
            <i class="fas fa-file-pdf"></i>
            <span>{{ i18n.t('auth.features.pdf') }}</span>
          </div>
          <div class="feature-card">
            <i class="fas fa-qrcode"></i>
            <span>{{ i18n.t('auth.features.share') }}</span>
          </div>
        </div>

        <p class="landing-prompt">{{ i18n.t('auth.loginPrompt') }}</p>
        
        <div class="landing-actions">
          <router-link to="/auth/login" class="btn-landing btn-primary">
            <i class="fas fa-sign-in-alt"></i>
            {{ i18n.t('auth.login') }}
          </router-link>
          <router-link to="/auth/register" class="btn-landing btn-secondary">
            <i class="fas fa-user-plus"></i>
            {{ i18n.t('auth.register') }}
          </router-link>
        </div>
      </div>
    </section>

    <!-- CV Editor cuando está logueado -->
    <template v-else>
      <section class="layout" :class="{ 'panel-collapsed': isPanelCollapsed }">
        <ControlPanel
          :cv-data="editor.cvData"
          :is-editing="editor.isEditing.value"
          :current-template="currentTemplate"
          :is-generating-pdf="pdf.isGenerating.value"
          :t="i18n.t"
          :cv-id="currentCvId"
          :is-saving-cloud="isSavingCloud"
          :show-save-cloud="auth.isLoggedIn.value"
          :is-collapsed="isPanelCollapsed"
          @toggle-editor="editor.toggleEditor"
          @export-pdf="handleExportPdf"
          @change-template="currentTemplate = $event"
          @start-presentation="presentation.startPresentation"
          @save-cloud="handleSaveCloud"
          @toggle-panel="isPanelCollapsed = !isPanelCollapsed"
        />
        <div ref="cvPreviewRef" class="cv-preview-wrapper">
          <CVPreview :cv-data="editor.cvData" :template="currentTemplate" :t="i18n.t" />
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
        :t="i18n.t"
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
  </div>
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
const isPanelCollapsed = ref(false)

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

<style scoped>
/* Landing Page Styles */
.home-view {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.landing {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 2rem 1rem;
}

.landing-content {
  text-align: center;
  max-width: 550px;
  width: 100%;
}

.landing-title {
  font-size: 2.25rem;
  color: #00d4aa;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.landing-subtitle {
  font-size: 1.1rem;
  color: #94a3b8;
  margin-bottom: 2rem;
}

.landing-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

.feature-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 0.75rem;
  transition: all 0.2s;
}

.feature-card:hover {
  border-color: #00d4aa;
  transform: translateY(-2px);
}

.feature-card i {
  font-size: 1.75rem;
  color: #00d4aa;
}

.feature-card span {
  color: #ffffff;
  font-weight: 500;
  font-size: 0.95rem;
}

.landing-prompt {
  color: #94a3b8;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.landing-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-landing {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #00d4aa;
  color: #0f172a;
}

.btn-primary:hover {
  background: #00e8bb;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #334155;
  color: #ffffff;
  border: 1px solid #475569;
}

.btn-secondary:hover {
  background: #475569;
  border-color: #00d4aa;
  color: #00d4aa;
}

/* Layout with collapsible panel */
.layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  transition: grid-template-columns 0.3s ease;
}

.layout.panel-collapsed {
  grid-template-columns: 60px 1fr;
}

@media (max-width: 768px) {
  .landing-features {
    grid-template-columns: 1fr;
  }
  
  .layout {
    grid-template-columns: 1fr;
  }
  
  .layout.panel-collapsed {
    grid-template-columns: 1fr;
  }
}
</style>
