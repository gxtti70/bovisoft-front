import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/inventario',
      name: 'inventario',
      component: () => import('../views/InventarioView.vue'),
    },
    {
      path: '/reportes',
      name: 'reportes',
      component: () => import('../views/ReportesView.vue'),
    },
    {
      path: '/ventas',
      name: 'ventas',
      component: () => import('../views/VentasView.vue'),
    },
    {
      path: '/configuracion',
      name: 'configuracion',
      component: () => import('../views/ConfigView.vue'),
    }
  ],
})

// --- EL GUARDIÁN DE SEGURIDAD (Middleware) ---
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('bovisoft_token');
  
  // Si intenta ir a cualquier página que NO sea el login y no tiene token...
  if (to.name !== 'login' && !token) {
    next({ name: 'login' }); // Pa' fuera, al login
  } else {
    next(); // Adelante, pase usted
  }
});

export default router