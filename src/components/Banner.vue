<template>
  <div class="banner-container">
    <div class="banner-wrapper" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div 
        v-for="banner in banners" 
        :key="banner.id" 
        class="banner-item"
        @click="$router.push(banner.link)"
      >
        <img :src="banner.image" :alt="banner.title" />
        <div class="banner-overlay">
          <h2>{{ banner.title }}</h2>
        </div>
      </div>
    </div>
    <div class="banner-indicators">
      <span 
        v-for="(banner, index) in banners" 
        :key="banner.id"
        :class="['indicator', { active: currentIndex === index }]"
        @click="goTo(index)"
      ></span>
    </div>
    <button class="banner-prev" @click="prev">‹</button>
    <button class="banner-next" @click="next">›</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { banners } from '@/data/mock.js'

const currentIndex = ref(0)
let timer = null

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % banners.length
}

const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + banners.length) % banners.length
}

const goTo = (index) => {
  currentIndex.value = index
}

const startAutoPlay = () => {
  timer = setInterval(next, 3000)
}

const stopAutoPlay = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.banner-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 20px;
}

.banner-wrapper {
  display: flex;
  transition: transform 0.5s ease;
}

.banner-item {
  position: relative;
  width: 100%;
  flex-shrink: 0;
  cursor: pointer;
}

.banner-item img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.6));
  padding: 30px;
  color: white;
}

.banner-overlay h2 {
  margin: 0;
  font-size: 24px;
}

.banner-indicators {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: all 0.3s;
}

.indicator.active {
  background: #ff6b6b;
  transform: scale(1.2);
}

.banner-prev,
.banner-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  transition: background 0.3s;
}

.banner-prev:hover,
.banner-next:hover {
  background: rgba(0,0,0,0.7);
}

.banner-prev {
  left: 10px;
}

.banner-next {
  right: 10px;
}
</style>
