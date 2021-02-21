import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home      from '../views/Home.vue'
import Config    from '../views/Config.vue'
import Metronome from '../views/Metronome.vue'
import Drone     from '../views/Drone.vue'
import Music     from '../views/Music.vue'
import Library   from '../views/Library.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/config',
    name: 'Config',
    component: Config
  },
  {
    path: '/metronome',
    name: 'Metronome',
    component: Metronome
  },
  {
    path: '/drone',
    name: 'Drone',
    component: Drone
  },
  {
    path: '/music',
    name: 'Music',
    component: Music
  },
  {
    path: '/library',
    name: 'Library',
    component: Library
  },
  /*{
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" * / '../views/About.vue')
  }*/
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
