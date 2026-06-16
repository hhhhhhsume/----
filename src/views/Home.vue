<template>
  <div class="home-page">
    <div class="container">
      <banner></banner>
      
      <div class="home-content">
        <div class="side-nav">
          <category-nav @select="handleCategorySelect"></category-nav>
        </div>
        <div class="main-content">
          <product-list 
            title="热门商品" 
            :products="hotProducts"
            @product-click="goToProduct"
          />
          <product-list 
            title="全部商品" 
            :products="allProducts"
            @product-click="goToProduct"
            @load-more="loadMoreProducts"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Banner from '@/components/Banner.vue'
import CategoryNav from '@/components/CategoryNav.vue'
import ProductList from '@/components/ProductList.vue'
import { hotProducts, products } from '@/data/mock.js'

const allProducts = ref([...products])

const handleCategorySelect = (id) => {
  window.location.href = `/category/${id}`
}

const goToProduct = (product) => {
  window.location.href = `/product/${product.id}`
}

const loadMoreProducts = () => {
  allProducts.value = [...allProducts.value, ...products.slice(0, 6)]
}
</script>

<style scoped>
.home-page {
  padding: 20px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.home-content {
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

@media (max-width: 768px) {
  .home-content {
    flex-direction: column;
  }
  
  .side-nav {
    width: 100%;
  }
}
</style>
