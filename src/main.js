import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// axios
import axios from 'axios'
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
Vue.prototype.$axios = axios;

// mixinAjax
import mixinAjax from '@/mixin/mixinAjax.js'
Vue.mixin(mixinAjax);

// ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// new
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
