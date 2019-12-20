import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
// import xlsx2json from '@/views/xlsx2json'
// import axios from '@/views/axios-cross-domain'
// import iview_select from '@/views/iview-select'
// import animations from '@/views/animations'
// import vueCount from '@/views/vueCount'
// import vant from '@/views/vant-test'
// import better_scroll from '@/views/better-scroll'
// import scroll from '@/views/scroll'
import word from '@/views/word'
import wordv2 from '@/views/wordv2'
import china from '@/views/china-map'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    // {
    //   path: '/xlsx2json',
    //   name: 'xlsx2json',
    //   component: xlsx2json
    // },
    // {
    //   path: '/axios-cross-domain',
    //   name: 'axios-cross-domain',
    //   component: axios
    // },
    // {
    //   path: '/iview_select',
    //   name: 'iview_select',
    //   component: iview_select
    // },
    // {
    //   path: '/animations',
    //   name: 'animations',
    //   component: animations
    // },
    // {
    //   path: '/vueCount',
    //   name: 'vueCount',
    //   component: vueCount
    // },
    // {
    //   path: '/home',
    //   name: 'vant',
    //   component: vant
    // },
    // {
    //   path: '/better_scroll',
    //   name: 'better_scroll',
    //   component: better_scroll
    // },
    // {
    //   path: '/scroll',
    //   name: 'scroll',
    //   component: scroll
    // },
    {
      path: '/word_old',
      name: 'word_old',
      component: word
    },
    {
      path: '/word',
      name: 'word',
      component: wordv2
    },
    {
      path: '/china-map',
      name: 'china-map',
      component: china
    },
    {
      path: '/signature',
      name: 'signature',
      component: () => import('../views/signature.vue')
    }
  ]
})
