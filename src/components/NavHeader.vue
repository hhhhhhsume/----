<template>
  <header :class="['nav-header', { 'sticky': isSticky }]">
    <div class="header-top">
      <div class="container">
        <div class="logo" @click="$router.push('/')">
          <span class="logo-icon">🐰</span>
          <span class="logo-text">小兔鲜</span>
        </div>
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchText" 
            placeholder="搜索商品" 
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">搜索</button>
        </div>
        <div class="header-right">
          <div v-if="!isLoggedIn" class="auth-links">
            <a @click="$router.push('/login')" class="link">登录</a>
            <a @click="$router.push('/register')" class="link">注册</a>
          </div>
          <div v-else class="user-info">
            <span class="username">{{ userInfo?.username || '用户' }}</span>
            <a @click="handleLogout" class="link logout">退出</a>
          </div>
          <div class="cart-icon" @click="$router.push('/cart')">
            <span class="icon">🛒</span>
            <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </div>
        </div>
      </div>
    </div>
    <nav class="header-nav">
      <div class="container">
        <ul class="nav-list">
          <li 
            v-for="cat in categories" 
            :key="cat.id"
            @click="goToCategory(cat.id)"
            :class="['nav-item', { active: currentCategory === cat.id }]"
          >
            <span>{{ cat.icon }}</span>
            <span>{{ cat.name }}</span>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { categories } from '@/data/mock.js'

const searchText = ref('')
const isSticky = ref(false)
const isLoggedIn = ref(false)
const userInfo = ref(null)

const currentCategory = computed(() => {
  const path = window.location.pathname
  const match = path.match(/\/category\/(\d+)/)
  return match ? parseInt(match[1]) : null
})

const cartCount = computed(() => {
  const cart = localStorage.getItem('cart')
  if (!cart) return 0
  const cartItems = JSON.parse(cart)
  return cartItems.reduce((sum, item) => sum + item.quantity, 0)
})

const goToCategory = (id) => {
  window.location.href = `/category/${id}`
}

const handleSearch = () => {
  if (searchText.value.trim()) {
    alert(`搜索: ${searchText.value}`)
  }
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  isLoggedIn.value = false
  userInfo.value = null
  $router.push('/')
}

const handleScroll = () => {
  isSticky.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  const token = localStorage.getItem('token')
  if (token) {
    isLoggedIn.value = true
    const user = localStorage.getItem('user')
    userInfo.value = user ? JSON.parse(user) : null
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.nav-header {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: white;
  position: relative;
  z-index: 100;
}

.nav-header.sticky {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 24px;
  font-weight: bold;
}

.logo-icon {
  margin-right: 8px;
  font-size: 28px;
}

.search-box {
  flex: 1;
  max-width: 400px;
  display: flex;
  margin: 0 30px;
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  border: none;
  border-radius: 5px 0 0 5px;
  font-size: 14px;
}

.search-btn {
  padding: 10px 20px;
  background: #ffd93d;
  color: #333;
  border: none;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
}

.auth-links {
  display: flex;
  gap: 20px;
  margin-right: 20px;
}

.link {
  color: white;
  text-decoration: none;
  cursor: pointer;
}

.link:hover {
  text-decoration: underline;
}

.logout {
  color: #ffe066;
}

.user-info {
  margin-right: 20px;
}

.username {
  margin-right: 15px;
}

.cart-icon {
  position: relative;
  font-size: 24px;
  cursor: pointer;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -12px;
  background: #ffd93d;
  color: #333;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.header-nav {
  background: rgba(0,0,0,0.1);
  padding: 10px 0;
}

.nav-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-x: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 8px 20px;
  cursor: pointer;
  border-radius: 20px;
  transition: all 0.3s;
  white-space: nowrap;
}

.nav-item:hover,
.nav-item.active {
  background: rgba(255,255,255,0.2);
}

.nav-item span:first-child {
  margin-right: 5px;
}
</style>
