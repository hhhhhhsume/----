<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <div class="error-icon">404</div>
      <h1>页面不存在</h1>
      <p>您访问的页面不存在或已被删除</p>
      <button class="back-home" @click="$router.push('/')">返回首页</button>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.not-found-content {
  text-align: center;
  color: white;
}

.error-icon {
  font-size: 120px;
  font-weight: bold;
  margin-bottom: 20px;
  opacity: 0.9;
}

h1 {
  font-size: 36px;
  margin: 0 0 15px 0;
}

p {
  font-size: 16px;
  margin: 0 0 30px 0;
  opacity: 0.8;
}

.back-home {
  padding: 15px 40px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}
</style>
