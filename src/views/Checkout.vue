<template>
  <div class="checkout-page">
    <div class="container">
      <h1>确认订单</h1>
      
      <div class="checkout-content">
        <div class="address-section">
          <h3>收货地址</h3>
          <div class="address-list">
            <div 
              v-for="addr in addresses" 
              :key="addr.id"
              :class="['address-item', { active: selectedAddress?.id === addr.id }]"
              @click="selectedAddress = addr"
            >
              <div class="address-header">
                <span class="name">{{ addr.name }}</span>
                <span class="phone">{{ addr.phone }}</span>
                <span v-if="addr.isDefault" class="default-tag">默认</span>
              </div>
              <p class="address-detail">{{ addr.province }}{{ addr.city }}{{ addr.detail }}</p>
            </div>
          </div>
          <button class="add-address" @click="showAddressModal = true">添加新地址</button>
        </div>
        
        <div class="items-section">
          <h3>商品清单</h3>
          <div class="items-list">
            <div v-for="item in checkoutItems" :key="item.id" class="item-row">
              <img :src="item.image" :alt="item.name" />
              <div class="item-info">
                <span class="item-name">{{ item.name }}</span>
                <span v-if="item.sku" class="item-sku">{{ item.sku }}</span>
              </div>
              <span class="item-price">¥{{ item.price.toFixed(2) }}</span>
              <span class="item-qty">x{{ item.quantity }}</span>
              <span class="item-total">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>
        </div>
        
        <div class="payment-section">
          <h3>支付方式</h3>
          <div class="payment-options">
            <label :class="['payment-option', { active: paymentMethod === 'alipay' }]">
              <input type="radio" name="payment" v-model="paymentMethod" value="alipay" />
              <span class="payment-icon">💳</span>
              <span>支付宝</span>
            </label>
            <label :class="['payment-option', { active: paymentMethod === 'wechat' }]">
              <input type="radio" name="payment" v-model="paymentMethod" value="wechat" />
              <span class="payment-icon">💚</span>
              <span>微信支付</span>
            </label>
          </div>
        </div>
        
        <div class="summary-section">
          <div class="summary-row">
            <span>商品金额</span>
            <span>¥{{ subtotal.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>运费</span>
            <span>¥{{ shipping.toFixed(2) }}</span>
          </div>
          <div class="summary-row total">
            <span>实付金额</span>
            <span>¥{{ total.toFixed(2) }}</span>
          </div>
        </div>
        
        <button class="submit-order" @click="submitOrder">提交订单</button>
      </div>
      
      <div v-if="showAddressModal" class="modal-overlay" @click.self="showAddressModal = false">
        <div class="modal-content">
          <h3>添加收货地址</h3>
          <form @submit.prevent="addAddress">
            <div class="form-row">
              <input v-model="newAddress.name" placeholder="收货人" class="form-input" />
              <input v-model="newAddress.phone" placeholder="手机号" class="form-input" />
            </div>
            <div class="form-row">
              <input v-model="newAddress.province" placeholder="省" class="form-input" />
              <input v-model="newAddress.city" placeholder="市" class="form-input" />
            </div>
            <textarea v-model="newAddress.detail" placeholder="详细地址" class="form-textarea"></textarea>
            <div class="modal-buttons">
              <button type="button" class="btn-cancel" @click="showAddressModal = false">取消</button>
              <button type="submit" class="btn-confirm">确定</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { addresses as mockAddresses } from '@/data/mock.js'

const addresses = ref([...mockAddresses])
const selectedAddress = ref(mockAddresses[0])
const paymentMethod = ref('alipay')
const showAddressModal = ref(false)

const newAddress = reactive({
  name: '',
  phone: '',
  province: '',
  city: '',
  detail: ''
})

const checkoutItems = ref([])

const subtotal = computed(() => {
  return checkoutItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const shipping = computed(() => {
  return subtotal.value >= 99 ? 0 : 10
})

const total = computed(() => {
  return subtotal.value + shipping.value
})

const addAddress = () => {
  if (!newAddress.name || !newAddress.phone || !newAddress.detail) {
    alert('请填写完整地址信息')
    return
  }
  
  const addr = {
    id: Date.now(),
    ...newAddress,
    isDefault: false
  }
  
  addresses.value.push(addr)
  selectedAddress.value = addr
  showAddressModal.value = false
  
  newAddress.name = ''
  newAddress.phone = ''
  newAddress.province = ''
  newAddress.city = ''
  newAddress.detail = ''
}

const submitOrder = () => {
  if (!selectedAddress.value) {
    alert('请选择收货地址')
    return
  }
  
  const order = {
    id: 'DD' + Date.now(),
    createTime: new Date().toLocaleString(),
    status: '待付款',
    totalPrice: total.value,
    items: checkoutItems.value,
    address: selectedAddress.value,
    paymentMethod: paymentMethod.value
  }
  
  localStorage.setItem('currentOrder', JSON.stringify(order))
  
  window.location.href = `/payment/${order.id}`
}

onMounted(() => {
  const items = localStorage.getItem('checkoutItems')
  if (items) {
    checkoutItems.value = JSON.parse(items)
  }
})
</script>

<style scoped>
.checkout-page {
  padding: 20px 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

h1 {
  font-size: 24px;
  margin: 0 0 20px 0;
}

.checkout-content {
  background: white;
  border-radius: 10px;
  padding: 20px;
}

.address-section,
.items-section,
.payment-section,
.summary-section {
  margin-bottom: 25px;
}

h3 {
  font-size: 16px;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.address-list {
  margin-bottom: 15px;
}

.address-item {
  padding: 15px;
  border: 2px solid #eee;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.address-item.active {
  border-color: #ff6b6b;
}

.address-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.name {
  font-weight: bold;
  margin-right: 15px;
}

.phone {
  margin-right: 10px;
}

.default-tag {
  background: #ff6b6b;
  color: white;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 12px;
}

.address-detail {
  color: #666;
  margin: 0;
}

.add-address {
  width: 100%;
  padding: 12px;
  border: 2px dashed #ddd;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  color: #666;
}

.items-list {
  border: 1px solid #eee;
  border-radius: 8px;
}

.item-row {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.item-row:last-child {
  border-bottom: none;
}

.item-row img {
  width: 60px;
  height: 60px;
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

.item-sku {
  font-size: 12px;
  color: #999;
}

.item-price,
.item-qty,
.item-total {
  margin-left: 20px;
}

.item-total {
  font-weight: bold;
  color: #ff6b6b;
}

.payment-options {
  display: flex;
  gap: 20px;
}

.payment-option {
  display: flex;
  align-items: center;
  padding: 12px 25px;
  border: 2px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-option.active {
  border-color: #ff6b6b;
  background: #fff5f5;
}

.payment-option input {
  display: none;
}

.payment-icon {
  font-size: 24px;
  margin-right: 10px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.summary-row.total {
  font-weight: bold;
  font-size: 18px;
  color: #ff6b6b;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.submit-order {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.modal-overlay {
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

.modal-content {
  background: white;
  border-radius: 10px;
  padding: 30px;
  width: 90%;
  max-width: 400px;
}

.modal-content h3 {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.form-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  height: 80px;
  resize: none;
  margin-bottom: 20px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cancel,
.btn-confirm {
  padding: 10px 25px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-cancel {
  background: #eee;
}

.btn-confirm {
  background: #ff6b6b;
  color: white;
}
</style>
