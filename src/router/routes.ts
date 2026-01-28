import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },

  {
    path: '/administracion',
    component: () => import('layouts/AdministrationLayout.vue'),
    redirect: '/administracion/peliculas',
    children: [
      {
        path: 'peliculas',
        component: () => import('pages/movies/Index.vue'),
        meta: { title: 'Películas', requiresAuth: true, rol: ['ADMIN'] },
      },

      {
        path: 'turnos',
        component: () => import('pages/shifts/Index.vue'),
        meta: { title: 'Turnos', requiresAuth: true, rol: ['ADMIN'] },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
