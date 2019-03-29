import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import { resolve } from 'url';

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: (resolve) => require(['@/views/Home.vue'],resolve)
    },
    {
      path: '/payment',
      name: 'payment',
      component: (resolve) => require(['@/views/payment.vue'],resolve)
    },
     {
       path: '/wait',
       name: 'wait',
       component: (resolve) => require(['@/views/wait.vue'],resolve)
     },
     {
       path: '/success',
       name: 'success',
       component: (resolve) => require(['@/views/success.vue'],resolve)
   }
  ]
})
