<template>
  <div class="product-card" @click="$emit('click', product)">
    <div class="product-image">
      <div class="icon-wrapper">
        <el-icon :size="80" :color="iconColor">
          <component :is="product.icon || 'Food'" />
        </el-icon>
      </div>
      <div v-if="product.originalPrice > product.price" class="discount-tag">
        {{ Math.round((1 - product.price / product.originalPrice) * 100) }}% OFF
      </div>
    </div>
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-sales">销量: {{ product.sales }}</p>
      <div class="product-price">
        <span class="current-price">¥{{ product.price.toFixed(2) }}</span>
        <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice.toFixed(2) }}</span>
      </div>
      <button class="add-cart-btn" @click.stop="addToCart">加入购物车</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])
const cartStore = useCartStore()

// 根据分类设置不同颜色
const iconColor = computed(() => {
  const colors = {
    1: '#4CAF50', // 蔬菜 - 绿色
    2: '#FF5722', // 水果 - 橙红色
    3: '#00BCD4', // 海鲜 - 蓝色
    4: '#795548', // 肉蛋 - 棕色
    5: '#3F51B5', // 乳品 - 蓝紫色
    6: '#9E9E9E', // 粮油 - 灰色
    7: '#FFD700', // 饮料 - 金色
    8: '#E91E63'  // 零食 - 粉色
  }
  return colors[props.product.categoryId] || '#666'
})

const addToCart = () => {
  cartStore.addItem(props.product)
  alert('已加入购物车')
}
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.product-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.discount-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #ff6b6b;
  color: white;
  padding: 4px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
}

.product-info {
  padding: 15px;
}

.product-name {
  font-size: 14px;
  margin: 0 0 8px 0;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-sales {
  font-size: 12px;
  color: #999;
  margin: 0 0 10px 0;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 12px;
}

.current-price {
  font-size: 20px;
  font-weight: bold;
  color: #ff6b6b;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.add-cart-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.3s;
}

.add-cart-btn:hover {
  opacity: 0.9;
}
</style>