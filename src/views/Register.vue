<template>
  <div class="register-page">
    <div class="container">
      <div class="register-box">
        <h1>注册</h1>
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label>用户名</label>
            <input 
              type="text" 
              v-model="form.username" 
              class="form-input"
              placeholder="请输入用户名"
              @blur="checkUsername"
            />
            <span v-if="errors.username" class="error">{{ errors.username }}</span>
            <span v-if="usernameValid" class="success">✓ 用户名可用</span>
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
            <label>确认密码</label>
            <input 
              type="password" 
              v-model="form.confirmPassword" 
              class="form-input"
              placeholder="请再次输入密码"
            />
            <span v-if="errors.confirmPassword" class="error">{{ errors.confirmPassword }}</span>
          </div>
          <div class="form-group">
            <label>手机号</label>
            <input 
              type="tel" 
              v-model="form.phone" 
              class="form-input"
              placeholder="请输入手机号"
            />
            <span v-if="errors.phone" class="error">{{ errors.phone }}</span>
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
              <button type="button" class="send-captcha" :disabled="countdown > 0" @click="sendCaptcha">
                {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
              </button>
            </div>
            <span v-if="errors.captcha" class="error">{{ errors.captcha }}</span>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.agreed" />
              <span>我已阅读并同意<a href="#">《用户协议》</a>和<a href="#">《隐私政策》</a></span>
            </label>
            <span v-if="errors.agreed" class="error">{{ errors.agreed }}</span>
          </div>
          <button type="submit" class="register-btn" :disabled="loading">
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </form>
        <div class="links">
          <a href="/login">已有账号？去登录</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  phone: '',
  captcha: '',
  agreed: false
})

const errors = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  phone: '',
  captcha: '',
  agreed: ''
})

const loading = ref(false)
const countdown = ref(0)
const usernameValid = ref(false)

const validate = () => {
  let isValid = true
  errors.username = ''
  errors.password = ''
  errors.confirmPassword = ''
  errors.phone = ''
  errors.captcha = ''
  errors.agreed = ''
  
  if (!form.username.trim()) {
    errors.username = '请输入用户名'
    isValid = false
  } else if (!/^[a-zA-Z0-9_]{4,20}$/.test(form.username)) {
    errors.username = '用户名只能包含字母、数字和下划线，长度4-20位'
    isValid = false
  }
  
  if (!form.password) {
    errors.password = '请输入密码'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = '密码长度不能少于6位'
    isValid = false
  }
  
  if (!form.confirmPassword) {
    errors.confirmPassword = '请确认密码'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = '两次输入的密码不一致'
    isValid = false
  }
  
  if (!form.phone) {
    errors.phone = '请输入手机号'
    isValid = false
  } else if (!/^1[3-9]\d{9}$/.test(form.phone)) {
    errors.phone = '请输入正确的手机号'
    isValid = false
  }
  
  if (!form.captcha) {
    errors.captcha = '请输入验证码'
    isValid = false
  }
  
  if (!form.agreed) {
    errors.agreed = '请同意用户协议和隐私政策'
    isValid = false
  }
  
  return isValid
}

const checkUsername = async () => {
  if (!form.username.trim()) return
  
  await new Promise(resolve => setTimeout(resolve, 500))
  
  usernameValid.value = true
  errors.username = ''
}

const sendCaptcha = async () => {
  if (!form.phone || !/^1[3-9]\d{9}$/.test(form.phone)) {
    errors.phone = '请输入正确的手机号'
    return
  }
  
  countdown.value = 60
  
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  alert('验证码已发送，验证码为：1234')
  
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const handleRegister = async () => {
  if (!validate()) return
  
  loading.value = true
  
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  loading.value = false
  
  alert('注册成功，请登录')
  window.location.href = '/login'
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container {
  width: 100%;
  max-width: 450px;
  padding: 0 20px;
}

.register-box {
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
  border-color: #667eea;
}

.captcha-row {
  display: flex;
  gap: 10px;
}

.captcha-input {
  flex: 1;
}

.send-captcha {
  padding: 12px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.send-captcha:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error {
  display: block;
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 5px;
}

.success {
  display: block;
  color: #28a745;
  font-size: 12px;
  margin-top: 5px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.checkbox-label input {
  margin-right: 8px;
  margin-top: 2px;
}

.checkbox-label a {
  color: #667eea;
  text-decoration: none;
}

.register-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

.register-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.links {
  text-align: center;
  margin-top: 20px;
}

.links a {
  color: #666;
  text-decoration: none;
  font-size: 14px;
}

.links a:hover {
  color: #667eea;
}
</style>
