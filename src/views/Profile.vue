<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="user-info">
        <div class="avatar">👤</div>
        <div class="user-detail">
          <h2>{{ userInfo?.username || '用户' }}</h2>
          <p>{{ userInfo?.phone || '未绑定手机号' }}</p>
        </div>
      </div>
      <div class="edit-btn">编辑资料</div>
    </div>
    
    <div class="container">
      <div class="stats-card">
        <div class="stat-item">
          <span class="stat-value">{{ orderStats.all }}</span>
          <span class="stat-label">全部订单</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ orderStats.pending }}</span>
          <span class="stat-label">待付款</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ orderStats.shipping }}</span>
          <span class="stat-label">待发货</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ orderStats.receiving }}</span>
          <span class="stat-label">待收货</span>
        </div>
      </div>
      
      <div class="menu-card">
        <div class="menu-item" @click="$router.push('/order')">
          <span class="menu-icon">📦</span>
          <span>我的订单</span>
          <span class="menu-arrow">›</span>
        </div>
        <div class="menu-item">
          <span class="menu-icon">❤️</span>
          <span>我的收藏</span>
          <span class="menu-arrow">›</span>
        </div>
        <div class="menu-item">
          <span class="menu-icon">📍</span>
          <span>收货地址</span>
          <span class="menu-arrow">›</span>
        </div>
        <div class="menu-item">
          <span class="menu-icon">🎫</span>
          <span>优惠券</span>
          <span class="menu-arrow">›</span>
        </div>
        <div class="menu-item">
          <span class="menu-icon">👀</span>
          <span>浏览记录</span>
          <span class="menu-arrow">›</span>
        </div>
        <div class="menu-item">
          <span class="menu-icon">⚙️</span>
          <span>设置</span>
          <span class="menu-arrow">›</span>
        </div>
      </div>
      
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { orders as mockOrders } from '@/data/mock.js'

const userInfo = ref(null)
const orders = ref([])

const orderStats = computed(() => {
  const stats = {
    all: orders.value.length,
    pending: 0,
    shipping: 0,
    receiving: 0
  }
  
  orders.value.forEach(order => {
    if (order.status === '待付款') stats.pending++
    else if (order.status === '待发货') stats.shipping++
    else if (order.status === '待收货') stats.receiving++
  })
  
  return stats
})

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    alert('退出成功')
    window.location.href = '/'
  }
}

onMounted(() => {
  const user = localStorage.getItem('user')
  if (user) {
    userInfo.value = JSON.parse(user)
  }
  
  const storedOrders = localStorage.getItem('orders')
  if (storedOrders) {
    orders.value = JSON.parse(storedOrders)
  } else {
    orders.value = [...mockOrders]
  }
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.profile-header {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  padding: 40px 20px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 80px;
  height: 80px;
  background: rgba(255,255,255,0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin-right: 20px;
}

.user-detail h2 {
  margin: 0 0 5px 0;
  font-size: 24px;
}

.user-detail p {
  margin: 0;
  opacity: 0.8;
}

.edit-btn {
  padding: 10px 20px;
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: 20px;
  cursor: pointer;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.stats-card {
  display: flex;
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #ff6b6b;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.menu-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  margin-bottom: 20px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 18px 20px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background 0.3s;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background: #f8f8f8;
}

.menu-icon {
  font-size: 20px;
  margin-right: 15px;
}

.menu-arrow {
  margin-left: auto;
  color: #999;
}

.logout-btn {
  width: 100%;
  padding: 15px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  color: #ff6b6b;
}
</style>
