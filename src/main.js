// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueJsonp from 'vue-jsonp'
Vue.use(VueJsonp,5000)

Vue.use(iView);
Vue.use(ElementUI);

import VueDraggableResizable from 'vue-draggable-resizable'
 
// optionally import default styles
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
 
Vue.component('vue-draggable-resizable', VueDraggableResizable)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
