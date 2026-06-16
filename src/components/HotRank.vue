<template>
  <div class="hot-rank">
    <div class="rank-header">
      <span class="rank-title">🔥 热销榜单</span>
      <span class="rank-subtitle">今日TOP10</span>
    </div>
    <div class="rank-list">
      <div 
        v-for="(item, index) in products" 
        :key="item.id" 
        class="rank-item"
        @click="$emit('click', item)"
      >
        <span :class="['rank-num', `rank-${index + 1}`]">{{ index + 1 }}</span>
        <div class="rank-icon">
          <el-icon :size="40" :color="getIconColor(item.categoryId)">
            <component :is="item.icon || 'Food'" />
          </el-icon>
        </div>
        <div class="rank-info">
          <p class="rank-name">{{ item.name }}</p>
          <p class="rank-price">¥{{ item.price.toFixed(2) }}</p>
        </div>
        <span class="rank-sales">{{ item.sales }}人购买</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  products: {
    type: Array,
    required: true
  }
})

defineEmits(['click'])

const getIconColor = (categoryId) => {
  const colors = {
    1: '#4CAF50',
    2: '#FF5722',
    3: '#00BCD4',
    4: '#795548',
    5: '#3F51B5',
    6: '#9E9E9E',
    7: '#FFD700',
    8: '#E91E63'
  }
  return colors[categoryId] || '#666'
}
</script>

<style scoped>
.hot-rank {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.rank-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.rank-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.rank-subtitle {
  font-size: 12px;
  color: #999;
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.rank-item:hover {
  background-color: #f9f9f9;
}

.rank-num {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
  background: #f0f0f0;
  color: #666;
}

.rank-num.rank-1 {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: white;
}

.rank-num.rank-2 {
  background: linear-gradient(135deg, #ffd93d 0%, #ff9500 100%);
  color: white;
}

.rank-num.rank-3 {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: white;
}

.rank-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  border-radius: 6px;
}

.rank-info {
  flex: 1;
  min-width: 0;
}

.rank-name {
  font-size: 13px;
  margin: 0 0 4px 0;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank-price {
  font-size: 14px;
  margin: 0;
  color: #ff6b6b;
  font-weight: bold;
}

.rank-sales {
  font-size: 12px;
  color: #999;
}
</style>