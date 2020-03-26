// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill"
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueJsonp from 'vue-jsonp'
import BaiduMap from 'vue-baidu-map'

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  // ak: 'gXvtKPxT33SqY0lZx9XljD4fKaVcszrA',
  ak: 'WO59CLWIMGW3B1qm7CuEd5AKVlD7Rpzl',
})
Vue.use(VueJsonp,5000)

Vue.use(iView);
Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
if (
  '-ms-scroll-limit' in document.documentElement.style && 
  '-ms-ime-align' in document.documentElement.style
) { // detect it's IE11
  window.addEventListener("hashchange", function(event) {
    var currentPath = window.location.hash.slice(1);
    if (store.state.route.path !== currentPath) {
      router.push(currentPath)
    }
  }, false)
}