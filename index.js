import Main from './src/components/views/index/Home'
import _Vue from 'vue'
import axios from 'axios';
import iicarus from 'iicarus'
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import oRowRender from './src/components/views/OGV-form-design/components/o-rowRender'
import oContainerRender from './src/components/views/OGV-form-design/components/o-containerRender'
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
// _Vue.component('oButton', oButton)
// _Vue.component('oInput', oInput)
// _Vue.component('oHtml', oHtml)
// _Vue.component('oFormRender', oFormRender)
// _Vue.component('oHtmlRender', oHtmlRender)
// _Vue.component('oForm', oForm)
// _Vue.component('oFormItem', oFormItem)
_Vue.component('oRow', oRowRender)
// _Vue.component('oCol', oColRender)
// _Vue.component('oSwitch', oSwitch)
// _Vue.component('oTimePicker', oTimePickerRender)
// _Vue.component('oDatePicker', oDatePickerRender)
// _Vue.component('oSelect', oSelectRender)
// _Vue.component('oOption', oOptionRender)
// _Vue.component('oCheckbox', oCheckboxRender)
// _Vue.component('oRadioGroup', oRadioGroupRender)
// _Vue.component('oRadio', oRadioRender)
_Vue.component('oContainer', oContainerRender)
// _Vue.component('oTable', oTableRender)
// _Vue.component('oTableColumn', oTableColumnRender)
// _Vue.component('oPagination', oPaginationRender)
console.log(Main.name)
_Vue.component(Main.name, Main)
}
export default Main;