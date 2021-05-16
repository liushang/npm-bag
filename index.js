import Main from './src/components/views/edit/Home'
import _Vue from 'vue'
import axios from 'axios';
import iicarus from 'iicarus'
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import oRowRender from './src/components/schema/components/o-rowRender'
import oContainerRender from './src/components/schema/components/o-containerRender'
_Vue.use(VueCodemirror, {
  options: { theme: 'base16-dark'},
  events: ['scroll']
})
_Vue.prototype.$axios = axios;
window.$axios = axios;
_Vue.use(ElementUI);
_Vue.use(iicarus)
Main.install = Vue => {
if (!Vue) {
window.Vue = Vue = _Vue
}

_Vue.component('oRow', oRowRender)
_Vue.component('oContainer', oContainerRender)
_Vue.component(Main.name, Main)
}
export default Main;