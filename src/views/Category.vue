<template>
  <div class="category-page">
    <div class="container">
      <div class="breadcrumb">
        <a href="/">首页</a>
        <span>›</span>
        <span>{{ currentCategory?.name || '商品分类' }}</span>
      </div>
      
      <div class="category-content">
        <div class="side-nav">
          <category-nav :current-id="categoryId" @select="handleCategorySelect"></category-nav>
        </div>
        <div class="main-content">
          <div class="filter-bar">
            <select v-model="sortBy" class="sort-select">
              <option value="default">默认排序</option>
              <option value="price-asc">价格从低到高</option>
              <option value="price-desc">价格从高到低</option>
              <option value="sales">销量排序</option>
            </select>
          </div>
          <div class="product-grid">
            <product-card 
              v-for="product in filteredProducts" 
              :key="product.id" 
              :product="product"
              @click="goToProduct"
            />
          </div>
          <div v-if="filteredProducts.length === 0" class="empty">
            暂无商品
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CategoryNav from '@/components/CategoryNav.vue'
import ProductCard from '@/components/ProductCard.vue'
import { categories, products } from '@/data/mock.js'

const categoryId = ref(1)
const sortBy = ref('default')

const currentCategory = computed(() => {
  return categories.find(c => c.id === categoryId.value)
})

const filteredProducts = computed(() => {
  let result = products.filter(p => p.categoryId === categoryId.value)
  
  switch (sortBy.value) {
    case 'price-asc':
      result = [...result].sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result = [...result].sort((a, b) => b.price - a.price)
      break
    case 'sales':
      result = [...result].sort((a, b) => b.sales - a.sales)
      break
  }
  
  return result
})

const handleCategorySelect = (id) => {
  categoryId.value = id
  window.location.href = `/category/${id}`
}

const goToProduct = (product) => {
  window.location.href = `/product/${product.id}`
}

const updateCategoryId = () => {
  const path = window.location.pathname
  const match = path.match(/\/category\/(\d+)/)
  if (match) {
    categoryId.value = parseInt(match[1])
  }
}

onMounted(() => {
  updateCategoryId()
  window.addEventListener('popstate', updateCategoryId)
})

onUnmounted(() => {
  window.removeEventListener('popstate', updateCategoryId)
})
</script>

<style scoped>
.category-page {
  padding: 20px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.breadcrumb a {
  color: #ff6b6b;
  text-decoration: none;
}

.category-content {
  display: flex;
  gap: 20px;
}

.side-nav {
  width: 200px;
  flex-shrink: 0;
}

.main-content {
  flex: 1;
}

.filter-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.sort-select {
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: white;
  cursor: pointer;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.empty {
  text-align: center;
  padding: 50px;
  color: #999;
}

@media (max-width: 768px) {
  .category-content {
    flex-direction: column;
  }
  
  .side-nav {
    width: 100%;
  }
}
</style>
