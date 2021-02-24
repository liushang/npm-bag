<template>
<div>
  <div>
    <Main/>
  </div>
</div>
</template>

<script>
import Main from './components/views/index/Home'
// import Main from './components/Main'

export default {
    data(){
      return {
        dataConfig: [{"name":"oContainer","props":{"form":{},"attrs":{"size":"small"},"on":{"onClick":"function anonymous(\n) {\nconsole.log('我要开始了');console.log(this)\n}"},"nativeOn":{},"children":[{"name":"oRow","props":{"on":{},"attrs":{},"children":[{"name":"oCol","props":{"on":{},"nativeOn":{},"attrs":{"span":10,"offset":0},"children":[],"styles":{"min-height":"40px"},"rawId":"oCol557212"},"__config__":{"label":"栏","layout":"oFormItem","formId":105,"renderKey":"1051614180144636"}}],"styles":{},"rawId":"oRow294285"},"__config__":{"label":"行","layout":"oFormItem","formId":104,"renderKey":"1041614180139461"}},{"name":"oSwitch","props":{"form":{"a":12},"keyword":"a","value":"","styles":{},"attrs":{},"rawId":"oSwitch957148"},"__config__":{"label":"开关","layout":"oFormItem","formId":106,"renderKey":"1061614180324856"}},{"name":"oButton","props":{"on":{"onClick":"function anonymous(\n) {\nconsole.log('我是按钮');console.log(this)\n}"},"attrs":{"type":"primary","size":"small"},"children":["确定"],"styles":{},"rawId":"oButton332829"},"__config__":{"label":"按钮","layout":"oFormItem","configShowMap":{"attrs":{"type":{"label":"类型","value":["primary","success","info","warning","danger"]},"size":{"label":"尺寸","value":["small","medium","mini"]},"plain":{"label":"平铺","value":false},"round":{"label":"圆角按钮","value":false},"circle":{"label":"圆形按钮","value":false},"loading":{"label":"展示加载状态","value":false},"disabled":{"label":"禁用","value":false},"autofocus":{"label":"自动聚焦","value":false},"native-type":{"label":"原生属性","value":["button","submit","reset"]},"icon":""}},"formId":108,"renderKey":"1081614180332794"}}],"styles":{"min-height":"700px","padding":"10px 0 40px"},"rawId":"oContainer50857","computed":{},"env":"dev","methods":{}},"__config__":{"label":"容器","layout":"oFormItem"}}]
      }
    },
    components:{
      Main
    }
}
</script>

<style>

</style>