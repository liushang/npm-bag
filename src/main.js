import Vue from 'vue'
import App from './App.vue'
import axios from './components/utils/axios-v3';
import iicarus from 'iicarus'
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Antd from 'ant-design-vue';
// import App from './App';
import 'ant-design-vue/dist/antd.css';
Vue.config.productionTip = false;

Vue.use(Antd);
// import oButton from './components/views/OGV-form-design/components/o-buttonRender'
// import oSwitch from './components/views/OGV-form-design/components/o-switchRender'
// import oInput from './components/views/OGV-form-design/components/o-inputRender'
// import oHtml from './components/views/OGV-form-design/components/o-htmlRender'
// import oHtmlRender from './components/views/OGV-form-design/components/o-htmlRender'
// import oFormRender from './components/views/OGV-form-design/components/o-formRender'
// import oForm from './components/views/OGV-form-design/components/o-formRender'
// import oFormItem from './components/views/OGV-form-design/components/o-formItemRender'
import oRowRender from './components/views/OGV-form-design/components/o-rowRender'
// import oColRender from './components/views/OGV-form-design/components/o-colRender'
// import oTimePickerRender from './components/views/OGV-form-design/components/o-timePickerRender'
// import oDatePickerRender from './components/views/OGV-form-design/components/o-datePickerRender'
// import oSelectRender from './components/views/OGV-form-design/components/o-selectRender'
// import oOptionRender from './components/views/OGV-form-design/components/o-optionRender'
// import oCheckboxRender from './components/views/OGV-form-design/components/o-checkboxRender'
// import oRadioGroupRender from './components/views/OGV-form-design/components/o-radioGroupRender'
// import oRadioRender from './components/views/OGV-form-design/components/o-radioRender'
import oContainerRender from './components/views/OGV-form-design/components/o-containerRender'
// import oTableRender from './components/views/OGV-form-design/components/o-tableRender'
// import oTableColumnRender from './components/views/OGV-form-design/components/o-tableColumnRender'
// import oPaginationRender from './components/views/OGV-form-design/components/o-paginationRender'
// Vue.component('oButton', oButton)
// Vue.component('oInput', oInput)
// Vue.component('oHtml', oHtml)
// Vue.component('oFormRender', oFormRender)
// Vue.component('oHtmlRender', oHtmlRender)
// Vue.component('oForm', oForm)
// Vue.component('oFormItem', oFormItem)
Vue.component('oRow', oRowRender)
// Vue.component('oCol', oColRender)
// Vue.component('oSwitch', oSwitch)
// Vue.component('oTimePicker', oTimePickerRender)
// Vue.component('oDatePicker', oDatePickerRender)
// Vue.component('oSelect', oSelectRender)
// Vue.component('oOption', oOptionRender)
// Vue.component('oCheckbox', oCheckboxRender)
// Vue.component('oRadioGroup', oRadioGroupRender)
// Vue.component('oRadio', oRadioRender)
Vue.component('oContainer', oContainerRender)
// Vue.component('oTable', oTableRender)
// Vue.component('oTableColumn', oTableColumnRender)
// Vue.component('oPagination', oPaginationRender)
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
