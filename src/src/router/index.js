import { createRouter, createWebHashHistory } from 'vue-router';
import Index from '@/pages/network/index';
import Env from '@/pages/env/index';

const routes = [
  {
    path: '/',
    component: Index
  },
  {
    path: '/env',
    component: Env
  },
  {
    path: '/:pathMatch(.*)*',
    component: Index
  }
];

const router = createRouter({
  routes, // short for `routes: routes`
  history: createWebHashHistory()
});

export default router;
