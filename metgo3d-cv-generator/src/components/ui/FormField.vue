<template>
  <div class="form-field">
    <label v-if="label" class="form-field__label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <input
      v-if="type !== 'select' && type !== 'textarea'"
      :type="type"
      :value="value"
      :placeholder="placeholder"
      class="form-field__input"
      @input="$emit('input', ($event.target).value)"
    />
    <textarea
      v-else-if="type === 'textarea'"
      :value="value"
      :placeholder="placeholder"
      class="form-field__input form-field__textarea"
      rows="3"
      @input="$emit('input', ($event.target).value)"
    />
    <select
      v-else
      :value="value"
      class="form-field__input"
      @change="$emit('input', ($event.target).value)"
    >
      <option v-for="opt in options" :key="opt.value || opt" :value="opt.value ?? opt">
        {{ opt.label ?? opt }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  type: { type: String, default: 'text' },
  value: { type: [String, Number], default: '' },
  placeholder: String,
  required: Boolean,
  options: { type: Array, default: () => [] }
})

defineEmits(['input'])
</script>

<style scoped>
.form-field {
  margin-bottom: 0.75rem;
}
.form-field__label {
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  color: #9ca3af;
  margin-bottom: 0.35rem;
}
.form-field__label .required { color: #ef4444; }
.form-field__input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  color: #e5e7eb;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 0.375rem;
}
.form-field__input:focus {
  outline: none;
  border-color: #00d4aa;
}
.form-field__textarea {
  resize: vertical;
  min-height: 4rem;
}
</style>
