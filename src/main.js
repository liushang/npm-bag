import Vue from 'vue'
import App from './App.vue'
import axios from 'axios';
import iicarus from 'iicarus'
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(VueCodemirror, {
  options: { theme: 'base16-dark'},
  events: ['scroll']
})
Vue.prototype.$axios = axios;
window.$axios = axios;
Vue.use(ElementUI);
Vue.use(iicarus)
new Vue({
  el: '#app',
  render: h => h(App)
})
