import { createRouter, createWebHistory } from 'vue-router'
import BingoView from '../views/BingoView.vue'
import ConfigView from '../views/ConfigView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'config',
      component: ConfigView
    },
    {
      path: '/:id',
      name: 'bingo',
      component: BingoView
    }
  ]
})

export default router
