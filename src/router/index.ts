import { BingoService } from '@/services/bingo.service'
import { SpotifyService } from '@/services/spotify.service'
import { createRouter, createWebHistory } from 'vue-router'
import BingoView from '../views/BingoView.vue'

const spotify = SpotifyService
const bingo = BingoService
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../components/LoginForm.vue')
    },
    {
      path: '/config',
      name: 'config',
      component: () => import('../components/BingoConfig.vue')
    },
    {
      path: '/bingo',
      name: 'bingo',
      component: BingoView
    }
  ]
})

router.beforeEach(async (to, from) => {
  if (to.name === 'config' && !spotify.isLoggedIn) {
    return { name: 'login' }
  } else if (to.name === 'bingo' && !bingo.isPopulated) {
    return { name: 'login' }
  }
})
export default router
