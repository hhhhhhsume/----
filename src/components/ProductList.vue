<template>
  <div class="product-list">
    <div class="list-header">
      <h2>{{ title }}</h2>
      <a v-if="showMore" href="#" class="more-link">查看更多 →</a>
    </div>
    <div class="grid-container">
      <product-card 
        v-for="product in products" 
        :key="product.id" 
        :product="product"
        @click="handleProductClick"
      />
    </div>
    <div v-if="loading" class="loading">加载中...</div>
    <button v-if="hasMore" class="load-more" @click="loadMore">加载更多</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ProductCard from './ProductCard.vue'

defineProps({
  title: {
    type: String,
    default: '热门商品'
  },
  products: {
    type: Array,
    default: () => []
  },
  showMore: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['loadMore', 'productClick'])

const loading = ref(false)
const hasMore = ref(true)

const handleProductClick = (product) => {
  emit('productClick', product)
}

const loadMore = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    hasMore.value = false
    emit('loadMore')
  }, 1000)
}
</script>

<style scoped>
.product-list {
  margin-bottom: 30px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.list-header h2 {
  font-size: 20px;
  color: #333;
  margin: 0;
}

.more-link {
  color: #ff6b6b;
  text-decoration: none;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #999;
}

.load-more {
  display: block;
  margin: 20px auto;
  padding: 12px 30px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
}
</style>
