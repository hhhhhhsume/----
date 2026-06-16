export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Storage set error:', e)
  }
}

export const getItem = (key) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : null
  } catch (e) {
    console.error('Storage get error:', e)
    return null
  }
}

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (e) {
    console.error('Storage remove error:', e)
  }
}

export const clear = () => {
  try {
    localStorage.clear()
  } catch (e) {
    console.error('Storage clear error:', e)
  }
}
