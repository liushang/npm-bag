import Vue from 'vue'
import App from './App.vue'
import axios from './components/utils/axios';
import iicarus from 'iicarus'
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.config.productionTip = false;
Vue.use(Antd);
import oRowRender from './components/schema/components/o-rowRender'
import oContainerRender from './components/schema/components/o-containerRender'
Vue.component('oRow', oRowRender)
Vue.component('oContainer', oContainerRender)
Vue.use(VueCodemirror, {
  options: { theme: 'base16-dark'},
  events: ['scroll']
})
Vue.prototype.$axios = axios;
window.$axios = axios;
Vue.use(ElementUI);
Vue.use(iicarus)

// import somelibrarysss from 'somelibrarysss'
// Vue.use(somelibrarysss)

new Vue({
  el: '#app',
  render: h => h(App)
})
