import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'lib-flexible'
import './assets/main.css'
import './assets/css/index.less';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {createPinia} from 'pinia'
const pinia = createPinia()
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 设置 Element Plus 为中文语言包
app.use(ElementPlus, { locale: zhCn })

// 设置网页标题（确保环境变量存在）
if (import.meta.env.VITE_APP_TITLE) {
    document.title = import.meta.env.VITE_APP_TITLE
}

app.use(router)

app.use(pinia).mount('#app')
