import PlaylistViewerVue from 'src/components/dashboard/PlaylistViewer.vue';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('layouts/LoginLayout.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: ':id',
        name: 'dashboard_playlists',
        component: PlaylistViewerVue,
      },
    ],
  },
  {
    path: '/bingo',
    name: 'bingo',
    component: () => import('layouts/BingoLayout.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
