<template>
<div>
  <Main/>
  <!-- <practice></practice> -->
  <ogvdesign :constructure="configComponents1[0]"></ogvdesign>
</div>
</template>
<script>
import Main from './components/views/index/Home'
// import Main from './components/Main'
export default {
    data() {
      return {
        configComponents1: [{"name":"oContainer","props":{"form":{},"attrs":{"size":"small"},"on":{},"nativeOn":{},"children":[{"name":"oRow","props":{"on":{},"attrs":{},"children":[{"name":"oForm","props":{"form":{},"attrs":{"size":"small","label-width":"74px"},"nativeOn":{},"children":[{"name":"oInput","props":{"value":"323","styles":{"width":"200px"},"attrs":{},"rawId":"oInput893727"},"__config__":{"label":"输入框","layout":"oFormItem","formId":118,"renderKey":"1181614165964261"}}],"styles":{"min-height":"200px"},"rawId":"oForm186338"},"__config__":{"label":"表单","layout":"oFormItem","formId":120,"renderKey":"1201614165442189"}}],"styles":{},"rawId":"oRow797394"},"__config__":{"label":"行","layout":"oFormItem","formId":118,"renderKey":"1181614165193192"},"style":{}}],"styles":{"min-height":"700px","padding":"10px 0 40px"},"rawId":"oContainer139571","computed":{},"env":"prod","methods":{}},"__config__":{"label":"容器","layout":"oFormItem"}}]
      }
    },
    components:{
      Main
    }
}
</script>

<style>

</style>