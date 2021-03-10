import Main from './src/components/views/index/Home'
import _Vue from 'vue'
import axios from 'axios';
import iicarus from 'iicarus'
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import oButton from './src/components/views/OGV-form-design/components/o-buttonRender'
import oSwitch from './src/components/views/OGV-form-design/components/o-switchRender'
import oInput from './src/components/views/OGV-form-design/components/o-inputRender'
import oHtml from './src/components/views/OGV-form-design/components/o-htmlRender'
import oHtmlRender from './src/components/views/OGV-form-design/components/o-htmlRender'
import oFormRender from './src/components/views/OGV-form-design/components/o-formRender'
import oForm from './src/components/views/OGV-form-design/components/o-formRender'
import oFormItem from './src/components/views/OGV-form-design/components/o-formItemRender'
import oRowRender from './src/components/views/OGV-form-design/components/o-rowRender'
import oColRender from './src/components/views/OGV-form-design/components/o-colRender'
import oTimePickerRender from './src/components/views/OGV-form-design/components/o-timePickerRender'
import oDatePickerRender from './src/components/views/OGV-form-design/components/o-datePickerRender'
import oSelectRender from './src/components/views/OGV-form-design/components/o-selectRender'
import oOptionRender from './src/components/views/OGV-form-design/components/o-optionRender'
import oCheckboxRender from './src/components/views/OGV-form-design/components/o-checkboxRender'
import oRadioGroupRender from './src/components/views/OGV-form-design/components/o-radioGroupRender'
import oRadioRender from './src/components/views/OGV-form-design/components/o-radioRender'
import oContainerRender from './src/components/views/OGV-form-design/components/o-containerRender'
import oTableRender from './src/components/views/OGV-form-design/components/o-tableRender'
import oTableColumnRender from './src/components/views/OGV-form-design/components/o-tableColumnRender'
import oPaginationRender from './src/components/views/OGV-form-design/components/o-paginationRender'
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
_Vue.component('oButton', oButton)
_Vue.component('oInput', oInput)
_Vue.component('oHtml', oHtml)
_Vue.component('oFormRender', oFormRender)
_Vue.component('oHtmlRender', oHtmlRender)
_Vue.component('oForm', oForm)
_Vue.component('oFormItem', oFormItem)
_Vue.component('oRow', oRowRender)
_Vue.component('oCol', oColRender)
_Vue.component('oSwitch', oSwitch)
_Vue.component('oTimePicker', oTimePickerRender)
_Vue.component('oDatePicker', oDatePickerRender)
_Vue.component('oSelect', oSelectRender)
_Vue.component('oOption', oOptionRender)
_Vue.component('oCheckbox', oCheckboxRender)
_Vue.component('oRadioGroup', oRadioGroupRender)
_Vue.component('oRadio', oRadioRender)
_Vue.component('oContainer', oContainerRender)
_Vue.component('oTable', oTableRender)
_Vue.component('oTableColumn', oTableColumnRender)
_Vue.component('oPagination', oPaginationRender)
console.log(Main.name)
_Vue.component(Main.name, Main)
}
export default Main;