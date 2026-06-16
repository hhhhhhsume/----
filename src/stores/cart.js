import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  const totalCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  })

  const selectedItems = computed(() => {
    return items.value.filter(item => item.selected)
  })

  const selectedCount = computed(() => {
    return selectedItems.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const selectedPrice = computed(() => {
    return selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  })

  const addItem = (product) => {
    const existingItem = items.value.find(item => item.id === product.id)
    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({
        ...product,
        quantity: 1,
        selected: true
      })
    }
    saveToLocal()
  }

  const removeItem = (id) => {
    const index = items.value.findIndex(item => item.id === id)
    if (index !== -1) {
      items.value.splice(index, 1)
    }
    saveToLocal()
  }

  const updateQuantity = (id, quantity) => {
    const item = items.value.find(item => item.id === id)
    if (item) {
      item.quantity = quantity
      if (item.quantity <= 0) {
        removeItem(id)
      }
    }
    saveToLocal()
  }

  const toggleSelect = (id) => {
    const item = items.value.find(item => item.id === id)
    if (item) {
      item.selected = !item.selected
    }
    saveToLocal()
  }

  const selectAll = () => {
    items.value.forEach(item => {
      item.selected = true
    })
    saveToLocal()
  }

  const deselectAll = () => {
    items.value.forEach(item => {
      item.selected = false
    })
    saveToLocal()
  }

  const clearCart = () => {
    items.value = []
    saveToLocal()
  }

  const saveToLocal = () => {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  const loadFromLocal = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      items.value = JSON.parse(savedCart)
    }
  }

  const mergeCart = (serverCart) => {
    serverCart.forEach(serverItem => {
      const existingItem = items.value.find(item => item.id === serverItem.id)
      if (existingItem) {
        existingItem.quantity += serverItem.quantity
      } else {
        items.value.push({
          ...serverItem,
          selected: true
        })
      }
    })
    saveToLocal()
  }

  return {
    items,
    totalCount,
    totalPrice,
    selectedItems,
    selectedCount,
    selectedPrice,
    addItem,
    removeItem,
    updateQuantity,
    toggleSelect,
    selectAll,
    deselectAll,
    clearCart,
    loadFromLocal,
    mergeCart
  }
})
