<template>
  <footer class="nav-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>关于我们</h3>
          <ul>
            <li><a href="#">公司简介</a></li>
            <li><a href="#">联系我们</a></li>
            <li><a href="#">加入我们</a></li>
            <li><a href="#">新闻中心</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>帮助中心</h3>
          <ul>
            <li><a href="#">购物指南</a></li>
            <li><a href="#">配送说明</a></li>
            <li><a href="#">退换货政策</a></li>
            <li><a href="#">常见问题</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>服务保障</h3>
          <ul>
            <li><a href="#">正品保障</a></li>
            <li><a href="#">7天无理由退换</a></li>
            <li><a href="#">货到付款</a></li>
            <li><a href="#">全国配送</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>客服热线</h3>
          <p class="phone">400-888-8888</p>
          <p class="time">周一至周日 9:00-21:00</p>
          <div class="social">
            <span class="social-icon">微信</span>
            <span class="social-icon">微博</span>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2024 小兔鲜电商平台 版权所有</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.nav-footer {
  background: #333;
  color: #999;
  padding: 40px 0 20px;
  margin-top: 40px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.footer-section {
  width: 25%;
  min-width: 200px;
  margin-bottom: 20px;
}

.footer-section h3 {
  color: #fff;
  margin-bottom: 15px;
  font-size: 16px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 10px;
}

.footer-section a {
  color: #999;
  text-decoration: none;
}

.footer-section a:hover {
  color: #ff6b6b;
}

.phone {
  color: #ff6b6b;
  font-size: 20px;
  font-weight: bold;
  margin: 10px 0;
}

.time {
  font-size: 14px;
  margin-bottom: 15px;
}

.social {
  display: flex;
  gap: 15px;
}

.social-icon {
  background: #444;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.social-icon:hover {
  background: #ff6b6b;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #444;
  margin-top: 20px;
}
</style>
