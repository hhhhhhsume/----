<template>
  <div class="cart-page">
    <div class="container">
      <h1>购物车</h1>
      
      <div v-if="cartItems.length > 0" class="cart-content">
        <table class="cart-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" :checked="allChecked" @change="toggleAll" />
                <span>全选</span>
              </th>
              <th>商品</th>
              <th>单价</th>
              <th>数量</th>
              <th>小计</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cartItems" :key="item.id">
              <td>
                <input 
                  type="checkbox" 
                  :checked="item.checked" 
                  @change="toggleItem(item.id)"
                />
              </td>
              <td class="product-info">
                <div class="product-icon">
                  <el-icon :size="50" :color="getIconColor(item.categoryId)">
                    <component :is="item.icon || 'Food'" />
                  </el-icon>
                </div>
                <span>{{ item.name }}</span>
              </td>
              <td>¥{{ item.price.toFixed(2) }}</td>
              <td>
                <button class="qty-btn" @click="updateQuantity(item.id, item.quantity - 1)">-</button>
                <input type="number" :value="item.quantity" class="qty-input" />
                <button class="qty-btn" @click="updateQuantity(item.id, item.quantity + 1)">+</button>
              </td>
              <td>¥{{ (item.price * item.quantity).toFixed(2) }}</td>
              <td>
                <button class="delete-btn" @click="removeItem(item.id)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div class="cart-footer">
          <div class="select-all">
            <input type="checkbox" :checked="allChecked" @change="toggleAll" />
            <span>全选</span>
          </div>
          <div class="total-info">
            <span>已选 {{ selectedCount }} 件商品</span>
            <span class="total-price">合计: ¥{{ totalPrice.toFixed(2) }}</span>
          </div>
          <button class="checkout-btn" @click="goToCheckout">去结算</button>
        </div>
      </div>
      
      <div v-else class="empty-cart">
        <div class="empty-icon">🛒</div>
        <p>购物车是空的</p>
        <button class="go-shopping" @click="$router.push('/')">去购物</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const cartItems = ref([])

const allChecked = computed(() => {
  return cartItems.value.length > 0 && cartItems.value.every(item => item.checked)
})

const selectedCount = computed(() => {
  return cartItems.value.filter(item => item.checked).reduce((sum, item) => sum + item.quantity, 0)
})

const totalPrice = computed(() => {
  return cartItems.value.filter(item => item.checked).reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const getIconColor = (categoryId) => {
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
  return colors[categoryId] || '#666'
}

const loadCart = () => {
  const cart = localStorage.getItem('cart')
  cartItems.value = cart ? JSON.parse(cart).map(item => ({ ...item, checked: true })) : []
}

const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(cartItems.value))
}

const toggleAll = (e) => {
  cartItems.value.forEach(item => {
    item.checked = e.target.checked
  })
  saveCart()
}

const toggleItem = (id) => {
  const item = cartItems.value.find(i => i.id === id)
  if (item) {
    item.checked = !item.checked
    saveCart()
  }
}

const updateQuantity = (id, quantity) => {
  const item = cartItems.value.find(i => i.id === id)
  if (item && quantity > 0) {
    item.quantity = quantity
    saveCart()
  }
}

const removeItem = (id) => {
  if (confirm('确定删除该商品吗？')) {
    cartItems.value = cartItems.value.filter(i => i.id !== id)
    saveCart()
  }
}

const goToCheckout = () => {
  if (selectedCount.value === 0) {
    alert('请选择要结算的商品')
    return
  }
  localStorage.setItem('checkoutItems', JSON.stringify(cartItems.value.filter(item => item.checked)))
  window.location.href = '/checkout'
}

onMounted(() => {
  loadCart()
})

watch(cartItems, () => {
  saveCart()
}, { deep: true })
</script>

<style scoped>
.cart-page {
  padding: 20px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

h1 {
  font-size: 24px;
  margin: 0 0 20px 0;
}

.cart-content {
  background: white;
  border-radius: 10px;
  padding: 20px;
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.cart-table th,
.cart-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.cart-table th {
  background: #f8f8f8;
  font-weight: normal;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.product-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  border-radius: 6px;
}

.qty-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
}

.qty-input {
  width: 50px;
  height: 30px;
  text-align: center;
  border: 1px solid #ddd;
  border-left: none;
  border-right: none;
}

.delete-btn {
  color: #ff6b6b;
  background: none;
  border: none;
  cursor: pointer;
}

.delete-btn:hover {
  text-decoration: underline;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.select-all {
  display: flex;
  align-items: center;
  gap: 10px;
}

.total-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.total-price {
  font-size: 24px;
  font-weight: bold;
  color: #ff6b6b;
}

.checkout-btn {
  padding: 12px 40px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.empty-cart {
  background: white;
  border-radius: 10px;
  padding: 60px;
  text-align: center;
}

.empty-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.empty-cart p {
  color: #999;
  margin: 0 0 20px 0;
}

.go-shopping {
  padding: 12px 30px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}
</style>