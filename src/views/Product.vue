<template>
  <div class="product-page">
    <div class="container">
      <div class="breadcrumb">
        <a href="/">首页</a>
        <span>›</span>
        <a :href="`/category/${product?.categoryId}`">{{ currentCategory?.name }}</a>
        <span>›</span>
        <span>{{ product?.name }}</span>
      </div>
      
      <div v-if="product" class="product-main">
        <div class="product-detail">
          <div class="product-images">
            <div class="small-images">
              <div 
                v-for="(img, index) in productImages" 
                :key="index"
                :class="['small-img-wrapper', { active: currentImageIndex === index }]"
                @click="currentImageIndex = index"
              >
                <el-icon :size="50" :color="iconColor">
                  <component :is="img" />
                </el-icon>
              </div>
            </div>
            <div class="large-image-wrapper" @mousemove="handleMouseMove" @mouseleave="hideSlider">
              <div class="large-image-display">
                <el-icon :size="280" :color="iconColor">
                  <component :is="productImages[currentImageIndex]" />
                </el-icon>
              </div>
              <div v-if="showSlider" class="slider" :style="sliderStyle"></div>
              <div v-if="showSlider" class="preview-box">
                <div class="preview-content" :style="previewStyle">
                  <el-icon :size="560" :color="iconColor">
                    <component :is="productImages[currentImageIndex]" />
                  </el-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="product-info">
            <h1 class="product-name">{{ product.name }}</h1>
            <div class="price-section">
              <span class="current-price">¥{{ product.price.toFixed(2) }}</span>
              <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice.toFixed(2) }}</span>
              <span class="sales">销量: {{ product.sales }}</span>
            </div>
            <SkuSelector 
              :specs="skuSpecs" 
              v-model="selectedSku" 
              v-model:quantity="quantity"
              :max-quantity="product.stock"
              @change="handleSkuChange"
            />
            <div class="action-buttons">
              <button class="add-cart" @click="addToCart">加入购物车</button>
              <button class="buy-now" @click="buyNow">立即购买</button>
            </div>
          </div>
        </div>
        
        <div class="hot-sidebar">
          <HotRank :products="hotProducts" @click="goToProduct" />
        </div>
      </div>
      
      <div v-if="product" class="product-desc">
        <h2>商品详情</h2>
        <div class="desc-content">
          <p>这是一款优质的{{ product.name }}，产自优质产区，品质保证。</p>
          <p>规格：精选一级品</p>
          <p>保质期：新鲜配送</p>
          <p>储存方式：冷藏保存</p>
        </div>
      </div>
      
      <div class="hot-products">
        <h2>热门推荐</h2>
        <div class="hot-grid">
          <product-card 
            v-for="p in hotProducts" 
            :key="p.id" 
            :product="p"
            @click="goToProduct"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import HotRank from '@/components/HotRank.vue'
import { getProductById, categories, hotProducts } from '@/data/mock.js'

const product = ref(null)
const currentImageIndex = ref(0)
const quantity = ref(1)
const selectedSku = ref('标准装')
const showSlider = ref(false)
const sliderStyle = ref({ left: '0px', top: '0px' })
const previewStyle = ref({})

const skuSpecs = [
  {
    label: '规格',
    options: ['标准装', '家庭装', '礼盒装']
  }
]

const handleSkuChange = (data) => {
  console.log('SKU变更:', data)
}

const productImages = computed(() => {
  if (!product.value) return []
  const icon = product.value.icon || 'Food'
  return [icon, icon, icon]
})

const iconColor = computed(() => {
  if (!product.value) return '#666'
  const colors = {
    1: '#4CAF50',
    2: '#FF5722',
    3: '#00BCD4',
    4: '#795548',
    5: '#3F51B5',
    6: '#9E9E9E',
    7: '#FFD700',
    8: '#E91E63'
  }
  return colors[product.value.categoryId] || '#666'
})

const currentCategory = computed(() => {
  if (!product.value) return null
  return categories.find(c => c.id === product.value.categoryId)
})

const handleMouseMove = (e) => {
  const wrapper = e.currentTarget
  const rect = wrapper.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  const sliderSize = 100
  const maxX = rect.width - sliderSize
  const maxY = rect.height - sliderSize
  
  let sliderX = Math.max(0, Math.min(x - sliderSize / 2, maxX))
  let sliderY = Math.max(0, Math.min(y - sliderSize / 2, maxY))
  
  showSlider.value = true
  sliderStyle.value = {
    left: `${sliderX}px`,
    top: `${sliderY}px`
  }
  
  // 预览框显示放大的图标
  // 主图400x400，图标280x280居中，左上角(60,60)
  // 滑块100x100，位置(sliderX, sliderY)
  // 滑块选中区域对应图标内位置(sliderX-60, sliderY-60)到(sliderX+40, sliderY+40)
  // 预览框200x200，预览内容560x560（与放大后的图标同大），图标左上角(0,0)
  // 放大2倍后，滑块选中区域在预览内容中位置(2*(sliderX-60), 2*(sliderY-60))到(2*(sliderX+40), 2*(sliderY+40))
  // 要让滑块选中区域居中显示在预览框中心(100,100)
  // 滑块中心在预览内容中位置(2*(sliderX-60)+100, 2*(sliderY-60)+100)
  // 偏移量 = 预览框中心 - 滑块中心 = (100 - (2*(sliderX-60)+100), 100 - (2*(sliderY-60)+100))
  //        = (-2*(sliderX-60), -2*(sliderY-60)) = (120 - 2*sliderX, 120 - 2*sliderY)
  const offsetX = 120 - 2 * sliderX
  const offsetY = 120 - 2 * sliderY
  previewStyle.value = {
    marginLeft: `${offsetX}px`,
    marginTop: `${offsetY}px`
  }
}

const hideSlider = () => {
  showSlider.value = false
}

const addToCart = () => {
  let cart = localStorage.getItem('cart')
  cart = cart ? JSON.parse(cart) : []
  
  const existingItem = cart.find(item => item.id === product.value.id)
  if (existingItem) {
    existingItem.quantity += quantity.value
  } else {
    cart.push({ ...product.value, quantity: quantity.value, sku: selectedSku.value })
  }
  
  localStorage.setItem('cart', JSON.stringify(cart))
  alert('已加入购物车')
}

const buyNow = () => {
  addToCart()
  window.location.href = '/checkout'
}

const goToProduct = (p) => {
  window.location.href = `/product/${p.id}`
}

onMounted(() => {
  const path = window.location.pathname
  const match = path.match(/\/product\/(\d+)/)
  if (match) {
    product.value = getProductById(match[1])
  }
})
</script>

<style scoped>
.product-page {
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

.product-main {
  display: flex;
  gap: 30px;
}

.product-detail {
  flex: 1;
  display: flex;
  gap: 40px;
  background: white;
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 30px;
}

.product-images {
  display: flex;
  gap: 15px;
  position: relative;
  z-index: 10;
}

.small-images {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.small-img-wrapper {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  border: 2px solid transparent;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  opacity: 0.6;
}

.small-img-wrapper:hover {
  opacity: 0.8;
}

.small-img-wrapper.active {
  border-color: #ff6b6b;
  opacity: 1;
}

.large-image-wrapper {
  position: relative;
  width: 400px;
  height: 400px;
}

.large-image-display {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  border-radius: 10px;
}

.slider {
  position: absolute;
  width: 100px;
  height: 100px;
  background: rgba(255, 107, 107, 0.3);
  border: 2px solid #ff6b6b;
  border-radius: 4px;
  cursor: move;
  pointer-events: none;
}

.preview-box {
  position: absolute;
  left: calc(100% + 20px);
  top: 0;
  width: 200px;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  z-index: 100;
}

.preview-content {
  width: 560px;
  height: 560px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 24px;
  margin: 0 0 30px 0;
  color: #333;
}

.price-section {
  margin-bottom: 30px;
}

.current-price {
  font-size: 32px;
  font-weight: bold;
  color: #ff6b6b;
  margin-right: 15px;
}

.original-price {
  font-size: 18px;
  color: #999;
  text-decoration: line-through;
  margin-right: 20px;
}

.sales {
  color: #999;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}

.add-cart,
.buy-now {
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.3s;
}

.add-cart {
  background: linear-gradient(135deg, #ffd93d 0%, #ff9500 100%);
  color: #333;
}

.buy-now {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: white;
}

.add-cart:hover,
.buy-now:hover {
  opacity: 0.9;
}

.hot-sidebar {
  width: 300px;
}

.product-desc {
  background: white;
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 30px;
}

.product-desc h2 {
  font-size: 18px;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.desc-content {
  color: #666;
  line-height: 2;
}

.hot-products {
  margin-top: 30px;
}

.hot-products h2 {
  font-size: 20px;
  margin: 0 0 20px 0;
}

.hot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

@media (max-width: 1024px) {
  .product-main {
    flex-direction: column;
  }
  
  .hot-sidebar {
    width: 100%;
  }
  
  .preview-box {
    display: none;
  }
}

@media (max-width: 768px) {
  .product-detail {
    flex-direction: column;
  }
  
  .product-images {
    flex-direction: column;
  }
  
  .small-images {
    flex-direction: row;
    overflow-x: auto;
  }
  
  .large-image-wrapper {
    width: 100%;
    height: auto;
    min-height: 300px;
  }
}
</style>