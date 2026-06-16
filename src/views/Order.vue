<template>
  <div class="order-page">
    <div class="container">
      <h1>我的订单</h1>
      
      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.value"
          :class="['tab', { active: activeTab === tab.value }]"
          @click="handleTabChange(tab.value)"
        >
          <span>{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
        </button>
      </div>
      
      <div v-if="pagedOrders.length > 0" class="orders-list">
        <div v-for="order in pagedOrders" :key="order.id" class="order-card">
          <div class="order-header">
            <span class="order-id">订单号: {{ order.id }}</span>
            <span :class="['order-status', order.status]">{{ order.status }}</span>
          </div>
          <div class="order-items">
            <div v-for="item in order.items" :key="item.id" class="order-item">
              <div class="item-icon">
                <el-icon :size="40" color="#666">
                  <component :is="item.icon || 'Food'" />
                </el-icon>
              </div>
              <div class="item-info">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-qty">x{{ item.quantity }}</span>
              </div>
              <span class="item-price">¥{{ item.price.toFixed(2) }}</span>
            </div>
          </div>
          <div class="order-footer">
            <span class="total">共{{ getTotalQty(order) }}件商品 实付: <span class="amount">¥{{ order.totalPrice.toFixed(2) }}</span></span>
            <div class="order-actions">
              <button v-if="order.status === '待付款'" class="action-btn primary" @click="payOrder(order)">去付款</button>
              <button v-if="order.status === '待发货'" class="action-btn">催发货</button>
              <button v-if="order.status === '待收货'" class="action-btn primary" @click="confirmReceive(order)">确认收货</button>
              <button v-if="order.status === '已完成'" class="action-btn">再次购买</button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="empty-orders">
        <div class="empty-icon">📦</div>
        <p>暂无{{ tabs.find(t => t.value === activeTab)?.label }}订单</p>
      </div>
      
      <div v-if="totalPages > 1" class="pagination">
        <button 
          class="page-btn" 
          :disabled="currentPage === 1" 
          @click="currentPage--"
        >上一页</button>
        <span class="page-info">第 {{ currentPage }} / {{ totalPages }} 页</span>
        <button 
          class="page-btn" 
          :disabled="currentPage === totalPages" 
          @click="currentPage++"
        >下一页</button>
        <div class="page-size-selector">
          <span>每页:</span>
          <select v-model="pageSize" @change="handlePageSizeChange">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { orders as mockOrders } from '@/data/mock.js'

const activeTab = ref('all')
const orders = ref([])
const currentPage = ref(1)
const pageSize = ref(5)

const tabs = [
  { value: 'all', label: '全部', icon: '📋' },
  { value: 'pending', label: '待付款', icon: '💳' },
  { value: 'shipping', label: '待发货', icon: '📦' },
  { value: 'receiving', label: '待收货', icon: '🚚' },
  { value: 'completed', label: '已完成', icon: '✅' }
]

const statusMap = {
  'all': ['待付款', '待发货', '待收货', '已完成'],
  'pending': ['待付款'],
  'shipping': ['待发货'],
  'receiving': ['待收货'],
  'completed': ['已完成']
}

const filteredOrders = computed(() => {
  const statuses = statusMap[activeTab.value]
  return orders.value.filter(order => statuses.includes(order.status))
})

const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / pageSize.value)
})

const pagedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredOrders.value.slice(start, end)
})

const getTotalQty = (order) => {
  return order.items.reduce((sum, item) => sum + item.quantity, 0)
}

const payOrder = (order) => {
  localStorage.setItem('currentOrder', JSON.stringify(order))
  window.location.href = `/payment/${order.id}`
}

const confirmReceive = (order) => {
  if (confirm('确认已收到商品吗？')) {
    order.status = '已完成'
    localStorage.setItem('orders', JSON.stringify(orders.value))
    alert('确认收货成功')
  }
}

const handleTabChange = (tab) => {
  activeTab.value = tab
  currentPage.value = 1
}

const handlePageSizeChange = () => {
  currentPage.value = 1
}

watch(activeTab, () => {
  currentPage.value = 1
})

onMounted(() => {
  const storedOrders = localStorage.getItem('orders')
  if (storedOrders) {
    orders.value = JSON.parse(storedOrders)
  } else {
    orders.value = [...mockOrders]
    localStorage.setItem('orders', JSON.stringify(orders.value))
  }
})
</script>

<style scoped>
.order-page {
  padding: 20px 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

h1 {
  font-size: 24px;
  margin: 0 0 20px 0;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.tab {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.tab.active {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: white;
}

.tab span:first-child {
  margin-right: 5px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.order-header {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  background: #f8f8f8;
  border-bottom: 1px solid #eee;
}

.order-id {
  font-size: 14px;
  color: #666;
}

.order-status {
  font-size: 14px;
  font-weight: bold;
}

.order-status.待付款 { color: #ff6b6b; }
.order-status.待发货 { color: #ff9500; }
.order-status.待收货 { color: #34c759; }
.order-status.已完成 { color: #999; }

.order-items {
  padding: 15px 20px;
}

.order-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px dashed #eee;
}

.order-item:last-child {
  border-bottom: none;
}

.item-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
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

.item-price {
  font-weight: bold;
  color: #333;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-top: 1px solid #eee;
}

.total {
  font-size: 14px;
}

.amount {
  font-weight: bold;
  color: #ff6b6b;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 8px 20px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  border: none;
  color: white;
}

.empty-orders {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 10px;
}

.empty-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.empty-orders p {
  color: #999;
  margin: 0;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  padding: 20px;
  background: white;
  border-radius: 10px;
}

.page-btn {
  padding: 8px 20px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-size-selector select {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>