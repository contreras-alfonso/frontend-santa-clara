import { boot } from 'quasar/wrappers';
import { useAuthStore } from 'src/stores/auth-store';

export default boot(({ router }) => {
  const authStore = useAuthStore();

  router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.meta?.requiresAuth || false;
    const allowedRoles = (to.meta?.rol as string[]) ?? [];

    try {
      await authStore.verify();
    } catch {
      return next('/login');
    }

    if (to.path === '/') {
      if (authStore.isAuthenticated) {
        return next('/administracion/peliculas');
      }
      return next('/login');
    }

    if (requiresAuth) {
      if (!authStore.isAuthenticated || !allowedRoles.includes(authStore.user?.role ?? '')) {
        return next('/login');
      }
    }

    next();
  });
});
