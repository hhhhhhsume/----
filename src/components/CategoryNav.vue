<template>
  <div class="category-nav">
    <ul class="category-list">
      <li 
        v-for="cat in categories" 
        :key="cat.id"
        :class="['category-item', { active: currentId === cat.id }]"
        @click="$emit('select', cat.id)"
      >
        <span class="category-icon">{{ cat.icon }}</span>
        <span class="category-name">{{ cat.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { categories } from '@/data/mock.js'

defineProps({
  currentId: {
    type: Number,
    default: null
  }
})

defineEmits(['select'])
</script>

<style scoped>
.category-nav {
  background: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 5px;
}

.category-item:last-child {
  margin-bottom: 0;
}

.category-item:hover {
  background: #f5f5f5;
}

.category-item.active {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: white;
}

.category-icon {
  font-size: 20px;
  margin-right: 12px;
}

.category-name {
  font-size: 14px;
}
</style>
