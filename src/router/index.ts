import { SpotifyService } from '@/spotify.service'
import { createRouter, createWebHistory } from 'vue-router'
import BingoView from '../views/BingoView.vue'
import GetPlaylistView from '../views/GetPlaylistView.vue'
import LoginView from '../views/LoginView.vue'

const spotify = SpotifyService
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/playlist',
      name: 'playlist',
      component: GetPlaylistView
    },
    {
      path: '/bingo',
      name: 'bingo',
      component: BingoView
    }
  ]
})

router.beforeEach(async (to, from) => {
  if (to.name !== 'login' && !spotify.isLoggedIn) {
    return { name: 'login' }
  }
})
export default router
