import { createApp } from 'vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { lazyLoad } from './directives/lazy'
import SkuSelector from './components/SkuSelector.vue'
import './styles/index.scss'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

// 注册所有ElementPlus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.directive('lazy', lazyLoad)
app.component('SkuSelector', SkuSelector)
app.mount('#app')