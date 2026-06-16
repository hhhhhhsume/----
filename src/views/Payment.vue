<template>
  <div class="payment-page">
    <div class="container">
      <div v-if="order" class="payment-content">
        <div class="order-info">
          <h2>订单信息</h2>
          <div class="order-row">
            <span>订单编号</span>
            <span>{{ order.id }}</span>
          </div>
          <div class="order-row">
            <span>下单时间</span>
            <span>{{ order.createTime }}</span>
          </div>
          <div class="order-row">
            <span>支付方式</span>
            <span>{{ order.paymentMethod === 'alipay' ? '支付宝' : '微信支付' }}</span>
          </div>
        </div>
        
        <div class="items-info">
          <h3>商品清单</h3>
          <div v-for="item in order.items" :key="item.id" class="item-row">
            <img v-lazy="item.image" :alt="item.name" />
            <div class="item-info">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-qty">x{{ item.quantity }}</span>
            </div>
            <span class="item-total">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>
        
        <div class="total-section">
          <span>支付金额</span>
          <span class="total-amount">¥{{ order.totalPrice.toFixed(2) }}</span>
        </div>
        
        <div class="pay-method">
          <h3>选择支付方式</h3>
          <div class="method-options">
            <label 
              :class="['method-option', { active: paymentMethod === 'alipay' }]"
              @click="paymentMethod = 'alipay'"
            >
              <input type="radio" name="payment" value="alipay" v-model="paymentMethod" />
              <span class="method-icon">🐜</span>
              <span>支付宝</span>
            </label>
            <label 
              :class="['method-option', { active: paymentMethod === 'wechat' }]"
              @click="paymentMethod = 'wechat'"
            >
              <input type="radio" name="payment" value="wechat" v-model="paymentMethod" />
              <span class="method-icon">💬</span>
              <span>微信支付</span>
            </label>
          </div>
        </div>
        
        <div class="qr-section" v-if="!paid">
          <div class="qr-code">
            <img :src="qrCodeUrl" alt="支付二维码" />
            <div v-if="showAlipayModal" class="alipay-modal">
              <div class="alipay-window">
                <div class="alipay-header">
                  <span>支付宝</span>
                  <span class="close-btn" @click="showAlipayModal = false">×</span>
                </div>
                <div class="alipay-content">
                  <div class="alipay-icon">🐜</div>
                  <p>正在打开支付宝...</p>
                  <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div class="alipay-footer">
                  <p>支付金额: ¥{{ order.totalPrice.toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>
          <p>请使用{{ paymentMethod === 'alipay' ? '支付宝' : '微信' }}扫码支付</p>
          <button class="pay-btn" @click="simulatePayment">立即支付</button>
        </div>
        
        <div v-else class="success-section">
          <div class="success-icon">✓</div>
          <h2>支付成功</h2>
          <p>订单已提交成功</p>
          <div class="success-info">
            <p>订单号: {{ order.id }}</p>
            <p>支付时间: {{ new Date().toLocaleString() }}</p>
            <p>支付金额: ¥{{ order.totalPrice.toFixed(2) }}</p>
          </div>
          <button class="view-order" @click="goToOrder">查看订单</button>
          <button class="continue-shopping" @click="$router.push('/')">继续购物</button>
        </div>
      </div>
      
      <div v-else class="no-order">
        <p>未找到订单信息</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const order = ref(null)
const paid = ref(false)
const paymentMethod = ref('alipay')
const showAlipayModal = ref(false)

const qrCodeUrl = computed(() => {
  if (paymentMethod.value === 'alipay') {
    return `https://picsum.photos/200/200?random=alipay`
  } else {
    return `https://picsum.photos/200/200?random=wechat`
  }
})

const simulatePayment = async () => {
  showAlipayModal.value = true
  
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  showAlipayModal.value = false
  
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  paid.value = true
  
  const orders = localStorage.getItem('orders')
  const ordersList = orders ? JSON.parse(orders) : []
  ordersList.push({ ...order.value, status: '待发货', paymentMethod: paymentMethod.value })
  localStorage.setItem('orders', JSON.stringify(ordersList))
  
  localStorage.removeItem('checkoutItems')
  localStorage.removeItem('currentOrder')
  
  const cart = localStorage.getItem('cart')
  if (cart) {
    const cartItems = JSON.parse(cart)
    const newCart = cartItems.filter(item => !order.value.items.some(i => i.id === item.id))
    localStorage.setItem('cart', JSON.stringify(newCart))
  }
}

const goToOrder = () => {
  window.location.href = '/order'
}

onMounted(() => {
  const path = window.location.pathname
  const match = path.match(/\/payment\/(.+)/)
  if (match) {
    const currentOrder = localStorage.getItem('currentOrder')
    if (currentOrder) {
      order.value = JSON.parse(currentOrder)
    }
  }
})
</script>

<style scoped>
.payment-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  padding: 20px;
}

.container {
  width: 100%;
  max-width: 400px;
}

.payment-content {
  background: white;
  border-radius: 10px;
  padding: 30px;
  position: relative;
}

.no-order {
  background: white;
  border-radius: 10px;
  padding: 40px;
  text-align: center;
}

.order-info {
  margin-bottom: 25px;
}

.order-info h2 {
  font-size: 18px;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.order-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px dashed #eee;
}

.items-info {
  margin-bottom: 25px;
}

.items-info h3 {
  font-size: 16px;
  margin: 0 0 15px 0;
}

.item-row {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.item-row img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 15px;
}

.item-info {
  flex: 1;
}

.item-name {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.item-qty {
  font-size: 12px;
  color: #999;
}

.item-total {
  font-weight: bold;
  color: #ff6b6b;
}

.total-section {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background: #fff5f5;
  border-radius: 8px;
  margin-bottom: 25px;
}

.total-amount {
  font-size: 28px;
  font-weight: bold;
  color: #ff6b6b;
}

.pay-method {
  margin-bottom: 25px;
}

.pay-method h3 {
  font-size: 16px;
  margin: 0 0 15px 0;
}

.method-options {
  display: flex;
  gap: 15px;
}

.method-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 15px;
  border: 2px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.method-option.active {
  border-color: #ff6b6b;
  background: #fff5f5;
}

.method-option input {
  display: none;
}

.method-icon {
  font-size: 24px;
}

.qr-section {
  text-align: center;
  position: relative;
}

.qr-code {
  margin-bottom: 15px;
  position: relative;
}

.qr-code img {
  width: 200px;
  height: 200px;
  border-radius: 10px;
}

.alipay-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.alipay-window {
  background: white;
  width: 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.alipay-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #1677ff 0%, #40a9ff 100%);
  color: white;
  font-weight: bold;
}

.close-btn {
  font-size: 24px;
  cursor: pointer;
}

.alipay-content {
  padding: 30px;
  text-align: center;
}

.alipay-icon {
  font-size: 60px;
  margin-bottom: 15px;
}

.alipay-content p {
  color: #666;
  margin: 0;
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 20px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background: #1677ff;
  border-radius: 50%;
  animation: dotPulse 1.4s infinite ease-in-out;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dotPulse {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.alipay-footer {
  padding: 15px 20px;
  background: #f8f9fa;
  border-top: 1px solid #eee;
}

.alipay-footer p {
  margin: 0;
  text-align: center;
  font-weight: bold;
  color: #333;
}

.qr-section p {
  color: #666;
  margin: 0 0 20px 0;
}

.pay-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.success-section {
  text-align: center;
  padding: 30px 0;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: #28a745;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 40px;
  margin: 0 auto 20px;
}

.success-section h2 {
  margin: 0 0 10px 0;
  color: #333;
}

.success-section p {
  color: #666;
  margin: 0 0 30px 0;
}

.success-info {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 30px;
}

.success-info p {
  margin: 8px 0;
  font-size: 14px;
}

.view-order,
.continue-shopping {
  display: block;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 10px;
}

.view-order {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: white;
}

.continue-shopping {
  background: #eee;
}
</style>
