import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import xlsx2json from '@/views/xlsx2json'
import axios from '@/views/axios-cross-domain'
import iview_select from '@/views/iview-select'
import animations from '@/views/animations'
import vueCount from '@/views/vueCount'
import vant from '@/views/vant-test'
import better_scroll from '@/views/better-scroll'
import scroll from '@/views/scroll'
import word from '@/views/word'
// import tree from '@/views/tree.vue'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/xlsx2json',
      name: 'xlsx2json',
      component: xlsx2json
    },
    {
      path: '/axios-cross-domain',
      name: 'axios-cross-domain',
      component: axios
    },
    {
      path: '/iview_select',
      name: 'iview_select',
      component: iview_select
    },
    {
      path: '/animations',
      name: 'animations',
      component: animations
    },
    {
      path: '/vueCount',
      name: 'vueCount',
      component: vueCount
    },
    {
      path: '/home',
      name: 'vant',
      component: vant
    },
    {
      path: '/better_scroll',
      name: 'better_scroll',
      component: better_scroll
    },
    {
      path: '/scroll',
      name: 'scroll',
      component: scroll
    },
    {
      path: '/word',
      name: 'word',
      component: word
    },
    {
      path: '/authineLogs',
      name: 'authineLogs',
      component: () => import('@/views/authine-logs.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/jwt-login.vue')
    },
    {
      path: '/tree',
      name: 'tree',
      component: () => import('@/views/tree.vue')
    },
    {
      path: '/pie',
      name: 'pie',
      component: () => import('@/views/vue-pie.vue')
    },
    {
      path: '/solar-system',
      name: 'solar-system',
      component: () => import('@/views/solar-system.vue')
    },
    {
      path: '/rxjs-sandbox',
      name: 'rxjs-sandbox',
      component: () => import('@/views/rxjs-sandbox.vue')
    },
    {
      path: '/vue-draggable-resizable',
      name: 'vue-draggable-resizable',
      component: () => import('@/views/vue-draggable-resizable.vue')
    }
  ]
})
