import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
      {
          path: '/',
          name: 'QrCodeGenerate',
          component: () => import('@/views/QrCodeGenerate.vue')
      },
      {
          path: '/report',
          name: 'QrCodeDecoder',
          component: () => import('@/views/QrCodeDecoder.vue')
      }
  ]
})

export default router
