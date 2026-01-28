import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: { title: 'Películas', requiresAuth: true, rol: ['ADMIN'] },
      },
      {
        path: 'login',
        component: () => import('pages/auth/Login.vue'),
        meta: { title: 'Iniciar Sesión', requiresAuth: false },
      },

      {
        path: 'logout',
        component: () => import('pages/auth/Logout.vue'),
        meta: { title: 'Iniciar Sesión', requiresAuth: false },
      },
    ],
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
