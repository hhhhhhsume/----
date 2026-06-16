<template>
  <div class="sku-selector">
    <div v-for="(spec, index) in specs" :key="index" class="sku-group">
      <span class="sku-label">{{ spec.label }}:</span>
      <div class="sku-options">
        <span 
          v-for="(option, optIndex) in spec.options" 
          :key="optIndex"
          :class="['sku-option', { active: selectedSpecs[spec.label] === option, disabled: option.disabled }]"
          :disabled="option.disabled"
          @click="selectOption(spec.label, option)"
        >{{ option.label || option }}</span>
      </div>
    </div>
    <div v-if="showQuantity" class="quantity-group">
      <span class="sku-label">数量:</span>
      <div class="quantity-control">
        <button class="qty-btn" @click="localQuantity > 1 && localQuantity--" :disabled="localQuantity <= 1">-</button>
        <input type="number" v-model.number="localQuantity" class="qty-input" min="1" :max="maxQuantity" />
        <button class="qty-btn" @click="localQuantity < maxQuantity && localQuantity++" :disabled="localQuantity >= maxQuantity">+</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  specs: {
    type: Array,
    required: true
  },
  modelValue: {
    type: Object,
    default: () => ({})
  },
  quantity: {
    type: Number,
    default: 1
  },
  maxQuantity: {
    type: Number,
    default: 99
  },
  showQuantity: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'update:quantity', 'change'])

const selectedSpecs = reactive({})
const localQuantity = ref(props.quantity)

props.specs.forEach(spec => {
  const defaultOption = spec.options.find(opt => !opt.disabled) || spec.options[0]
  selectedSpecs[spec.label] = defaultOption?.label || defaultOption
})

Object.assign(selectedSpecs, props.modelValue)

const selectOption = (label, option) => {
  if (option.disabled) return
  selectedSpecs[label] = option.label || option
  emit('update:modelValue', { ...selectedSpecs })
  emit('change', { specs: { ...selectedSpecs }, quantity: localQuantity.value })
}

watch(() => props.quantity, (val) => {
  localQuantity.value = val
})

watch(localQuantity, (val) => {
  emit('update:quantity', val)
  emit('change', { specs: { ...selectedSpecs }, quantity: val })
})
</script>

<style scoped>
.sku-selector {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.sku-group {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.sku-label {
  display: inline-block;
  width: 60px;
  font-size: 14px;
  color: #666;
  flex-shrink: 0;
}

.sku-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.sku-option {
  padding: 10px 25px;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.sku-option:hover:not(.disabled) {
  border-color: #ff6b6b;
}

.sku-option.active {
  border-color: #ff6b6b;
  background: #fff5f5;
  color: #ff6b6b;
}

.sku-option.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: white;
  cursor: pointer;
  font-size: 18px;
  color: #333;
  transition: background-color 0.3s;
}

.qty-btn:hover:not(:disabled) {
  background: #f5f5f5;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qty-input {
  width: 60px;
  height: 36px;
  text-align: center;
  border: none;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  font-size: 14px;
}
</style>
