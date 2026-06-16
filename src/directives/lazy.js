export const lazyLoad = {
  mounted(el, binding) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target
            const src = binding.value
            img.src = src
            observer.unobserve(img)
          }
        })
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    )
    observer.observe(el)
  }
}
