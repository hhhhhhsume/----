export const categories = [
  { id: 1, name: '新鲜蔬菜', icon: '🥬' },
  { id: 2, name: '时令水果', icon: '🍎' },
  { id: 3, name: '海鲜水产', icon: '🦐' },
  { id: 4, name: '肉禽蛋品', icon: '🥩' },
  { id: 5, name: '乳品烘焙', icon: '🥛' },
  { id: 6, name: '粮油调味', icon: '🍚' },
  { id: 7, name: '酒水饮料', icon: '🍺' },
  { id: 8, name: '休闲零食', icon: '🍪' }
]

export const banners = [
  { id: 1, image: '/images/banner1.svg', title: '夏日清凉特惠', link: '/' },
  { id: 2, image: '/images/banner2.svg', title: '新品上市', link: '/category/1' },
  { id: 3, image: '/images/banner3.svg', title: '限时折扣', link: '/category/2' },
  { id: 4, image: '/images/banner4.svg', title: '会员专享', link: '/profile' }
]

export const hotProducts = [
  { id: 1, name: '有机西红柿', price: 12.9, originalPrice: 18.9, sales: 2341, icon: 'Food', categoryId: 1 },
  { id: 2, name: '新鲜苹果', price: 8.8, originalPrice: 12.8, sales: 1892, icon: 'Apple', categoryId: 2 },
  { id: 3, name: '鲜活大虾', price: 45.9, originalPrice: 59.9, sales: 987, icon: 'Food', categoryId: 3 },
  { id: 4, name: '土鸡蛋', price: 19.9, originalPrice: 25.9, sales: 3421, icon: 'Food', categoryId: 4 },
  { id: 5, name: '牛奶', price: 59.9, originalPrice: 69.9, sales: 1567, icon: 'CoffeeCup', categoryId: 5 },
  { id: 6, name: '大米', price: 39.9, originalPrice: 49.9, sales: 2134, icon: 'Bowl', categoryId: 6 }
]

export const products = [
  { id: 1, name: '有机西红柿', price: 12.9, originalPrice: 18.9, sales: 2341, icon: 'Food', categoryId: 1, stock: 100 },
  { id: 2, name: '新鲜黄瓜', price: 6.9, originalPrice: 9.9, sales: 1567, icon: 'Food', categoryId: 1, stock: 200 },
  { id: 3, name: '紫甘蓝', price: 8.5, originalPrice: 12.0, sales: 892, icon: 'Food', categoryId: 1, stock: 150 },
  { id: 4, name: '新鲜苹果', price: 8.8, originalPrice: 12.8, sales: 1892, icon: 'Apple', categoryId: 2, stock: 300 },
  { id: 5, name: '香蕉', price: 5.9, originalPrice: 7.9, sales: 3421, icon: 'Food', categoryId: 2, stock: 400 },
  { id: 6, name: '橙子', price: 9.9, originalPrice: 13.9, sales: 1234, icon: 'Food', categoryId: 2, stock: 250 },
  { id: 7, name: '鲜活大虾', price: 45.9, originalPrice: 59.9, sales: 987, icon: 'Food', categoryId: 3, stock: 80 },
  { id: 8, name: '三文鱼', price: 89.9, originalPrice: 109.9, sales: 456, icon: 'Food', categoryId: 3, stock: 50 },
  { id: 9, name: '土鸡蛋', price: 19.9, originalPrice: 25.9, sales: 3421, icon: 'Food', categoryId: 4, stock: 500 },
  { id: 10, name: '猪肉', price: 29.9, originalPrice: 35.9, sales: 1890, icon: 'Food', categoryId: 4, stock: 120 },
  { id: 11, name: '牛奶', price: 59.9, originalPrice: 69.9, sales: 1567, icon: 'CoffeeCup', categoryId: 5, stock: 200 },
  { id: 12, name: '面包', price: 15.9, originalPrice: 19.9, sales: 876, icon: 'Food', categoryId: 5, stock: 180 },
  { id: 13, name: '大米', price: 39.9, originalPrice: 49.9, sales: 2134, icon: 'Bowl', categoryId: 6, stock: 300 },
  { id: 14, name: '食用油', price: 68.9, originalPrice: 79.9, sales: 1567, icon: 'Goblet', categoryId: 6, stock: 100 },
  { id: 15, name: '啤酒', price: 59.9, originalPrice: 69.9, sales: 2345, icon: 'GobletFull', categoryId: 7, stock: 400 },
  { id: 16, name: '可乐', price: 8.9, originalPrice: 10.9, sales: 5678, icon: 'ColdDrink', categoryId: 7, stock: 800 },
  { id: 17, name: '薯片', price: 9.9, originalPrice: 12.9, sales: 3456, icon: 'Fries', categoryId: 8, stock: 600 },
  { id: 18, name: '巧克力', price: 25.9, originalPrice: 32.9, sales: 1890, icon: 'Lollipop', categoryId: 8, stock: 300 }
]

export const getProductById = (id) => {
  return products.find(p => p.id === parseInt(id)) || null
}

export const getProductsByCategory = (categoryId) => {
  return products.filter(p => p.categoryId === parseInt(categoryId))
}

export const addresses = [
  { id: 1, name: '张三', phone: '138****1234', province: '北京市', city: '朝阳区', detail: '建国路88号SOHO现代城A座1001室', isDefault: true },
  { id: 2, name: '李四', phone: '139****5678', province: '上海市', city: '浦东新区', detail: '陆家嘴环路1000号恒生银行大厦15层', isDefault: false }
]

export const orders = [
  { id: 'DD20240101001', status: '待付款', createTime: '2024-01-01 10:30:00', totalPrice: 128.6, items: [
    { id: 1, name: '有机西红柿', price: 12.9, quantity: 2, icon: 'Food' },
    { id: 4, name: '新鲜苹果', price: 8.8, quantity: 5, icon: 'Apple' }
  ]},
  { id: 'DD20240102002', status: '待发货', createTime: '2024-01-02 14:20:00', totalPrice: 89.9, items: [
    { id: 7, name: '鲜活大虾', price: 45.9, quantity: 1, icon: 'Food' },
    { id: 9, name: '土鸡蛋', price: 19.9, quantity: 2, icon: 'Food' }
  ]},
  { id: 'DD20240103003', status: '待收货', createTime: '2024-01-03 09:15:00', totalPrice: 59.9, items: [
    { id: 11, name: '牛奶', price: 59.9, quantity: 1, icon: 'CoffeeCup' }
  ]},
  { id: 'DD20240104004', status: '已完成', createTime: '2024-01-04 16:45:00', totalPrice: 39.9, items: [
    { id: 13, name: '大米', price: 39.9, quantity: 1, icon: 'Bowl' }
  ]}
]