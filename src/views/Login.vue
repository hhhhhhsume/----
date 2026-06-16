<template>
  <div class="login-page">
    <div class="container">
      <div class="login-box">
        <h1>登录</h1>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>用户名</label>
            <input 
              type="text" 
              v-model="form.username" 
              class="form-input"
              placeholder="请输入用户名"
            />
            <span v-if="errors.username" class="error">{{ errors.username }}</span>
          </div>
          <div class="form-group">
            <label>密码</label>
            <input 
              type="password" 
              v-model="form.password" 
              class="form-input"
              placeholder="请输入密码"
            />
            <span v-if="errors.password" class="error">{{ errors.password }}</span>
          </div>
          <div class="form-group">
            <label>验证码</label>
            <div class="captcha-row">
              <input 
                type="text" 
                v-model="form.captcha" 
                class="form-input captcha-input"
                placeholder="请输入验证码"
              />
              <img :src="captchaImage" class="captcha-img" @click="refreshCaptcha" />
            </div>
            <span v-if="errors.captcha" class="error">{{ errors.captcha }}</span>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.remember" />
              <span>记住我</span>
            </label>
          </div>
          <button type="submit" class="login-btn" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>
        <div class="links">
          <a href="/register">注册</a>
          <a href="#">忘记密码</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'

const form = reactive({
  username: '',
  password: '',
  captcha: '',
  remember: false
})

const errors = reactive({
  username: '',
  password: '',
  captcha: ''
})

const loading = ref(false)
const captchaImage = ref('https://picsum.photos/100/40?random=1')

const userStore = useUserStore()
const cartStore = useCartStore()

const validate = () => {
  let isValid = true
  errors.username = ''
  errors.password = ''
  errors.captcha = ''
  
  if (!form.username.trim()) {
    errors.username = '请输入用户名'
    isValid = false
  }
  
  if (!form.password) {
    errors.password = '请输入密码'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = '密码长度不能少于6位'
    isValid = false
  }
  
  if (!form.captcha) {
    errors.captcha = '请输入验证码'
    isValid = false
  }
  
  return isValid
}

const handleLogin = async () => {
  if (!validate()) return
  
  loading.value = true
  
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const mockUser = {
    id: 1,
    username: form.username,
    nickname: '用户',
    phone: '138****1234'
  }
  
  userStore.login(mockUser, 'mock_token_' + Date.now())
  
  const serverCart = JSON.parse(localStorage.getItem('serverCart') || '[]')
  cartStore.mergeCart(serverCart)
  
  localStorage.removeItem('serverCart')
  
  loading.value = false
  
  if (form.remember) {
    localStorage.setItem('rememberUser', form.username)
  }
  
  alert('登录成功，购物车已合并')
  window.location.href = '/'
}

const refreshCaptcha = () => {
  captchaImage.value = `https://picsum.photos/100/40?random=${Date.now()}`
}

onMounted(() => {
  cartStore.loadFromLocal()
  
  const rememberUser = localStorage.getItem('rememberUser')
  if (rememberUser) {
    form.username = rememberUser
    form.remember = true
  }
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
}

.container {
  width: 100%;
  max-width: 400px;
  padding: 0 20px;
}

.login-box {
  background: white;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

h1 {
  text-align: center;
  margin: 0 0 30px 0;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.form-input:focus {
  outline: none;
  border-color: #ff6b6b;
}

.captcha-row {
  display: flex;
  gap: 10px;
}

.captcha-input {
  flex: 1;
}

.captcha-img {
  width: 100px;
  height: 44px;
  border-radius: 5px;
  cursor: pointer;
}

.error {
  display: block;
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 5px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-label input {
  margin-right: 8px;
}

.login-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.links {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.links a {
  color: #666;
  text-decoration: none;
  font-size: 14px;
}

.links a:hover {
  color: #ff6b6b;
}
</style>
