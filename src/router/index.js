import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ShowSkatepark from '@/views/skatepark/ShowSkatepark.vue'

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
    {
      path: '/skatepark/new',
      name: 'add skatepark',
      component: () => import('@/views/skatepark/AddSkatepark.vue'),
    },
    {
      path: '/skateparks/:stateSlug/:slug',
      name: 'show skatepark',
      component: ShowSkatepark,
      meta: { title: (route) => `${route.params.slug.replace(/-/g, ' ')} skatepark | Shredly` },
    },
    {
      path: '/skateparks/:stateSlug/:slug/edit',
      name: 'edit skatepark',
      component: () => import('@/views/skatepark/EditSkatepark.vue'),
      // beforeEnter: (to, from) => {
      //   const userStore = useUserStore()
      //   if (!userStore.user) {
      //     return { name: 'login' }
      //   }
      //   return true
      // },
      meta: {
        title: (route) => `edit ${route.params.slug.replace(/-/g, ' ')} skatepark | sk8prks.com`,
      },
    },
  ],
})

router.afterEach((to) => {
  document.title =
    typeof to.meta.title === 'function' ? to.meta.title(to) : to.meta.title || 'sk8prks.com'
})

export default router
