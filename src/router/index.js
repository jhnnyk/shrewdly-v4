import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ShowSkatepark from '@/views/skateparks/ShowSkatepark.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/profile',
      name: 'profile',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/ProfileView.vue'),
    },

    // Skateparks
    {
      path: '/skateparks/add',
      name: 'add skatepark',
      component: () => import('@/views/skateparks/AddSkatepark.vue'),
    },
    {
      path: '/skateparks/:stateSlug/:slug/:id',
      name: 'show skatepark',
      component: ShowSkatepark,
      meta: { title: (route) => `${route.params.slug.replace(/-/g, ' ')} skatepark | Shredly` },
    },
    {
      path: '/skateparks/:stateSlug/:slug/edit',
      name: 'edit skatepark',
      component: () => import('@/views/skateparks/EditSkatepark.vue'),
      // beforeEnter: (to, from) => {
      //   const userStore = useUserStore()
      //   if (!userStore.user) {
      //     return { name: 'login' }
      //   }
      //   return true
      // },
      meta: {
        title: (route) => `edit ${route.params.slug.replace(/-/g, ' ')} skatepark | Shredly`,
      },
    },

    // Sessions
    {
      path: '/skateparks/:stateSlug/:slug/sessions/add',
      name: 'add session',
      component: () => import('@/views/sessions/AddSession.vue'),
      meta: {
        title: (route) => `add  ${route.params.slug.replace(/-/g, ' ')} session | Shredly`,
      },
    },

    // Map
    {
      path: '/map',
      name: 'map',
      component: () => import('@/views/MapView.vue'),
      meta: { title: 'skatepark map | Shredly' },
    },
  ],
})

router.afterEach((to) => {
  document.title =
    typeof to.meta.title === 'function' ? to.meta.title(to) : to.meta.title || 'Shredly'
})

export default router
