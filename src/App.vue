<template>
<div>
  <Main/>
  <!-- <practice></practice> -->
  <ogvdesign :configComponents="dataConfig[0]"></ogvdesign>
</div>
</template>
<script>
import Main from './components/views/index/Home'
// import Main from './components/Main'
export default {
    data() {
      return {
        dataConfig: [{"name":"oContainer","props":{"form":{},"attrs":{"size":"small"},"on":{},"nativeOn":{},"children":[{"name":"oRow","props":{"on":{},"attrs":{},"children":[],"styles":{},"rawId":"oRow702315"},"__config__":{"label":"行","layout":"oFormItem","formId":119,"renderKey":"1191614222142546"}}],"styles":{"min-height":"700px","padding":"10px 0 40px"},"rawId":"oContainer162122","computed":{},"env":"prod","methods":{}},"__config__":{"label":"容器","layout":"oFormItem"}}]
      }
    },
    components:{
      Main
    }
}
</script>

<style>

</style>