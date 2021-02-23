<template>
<div>
  <div>我是首页</div>
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
        initData: 'hello 你好'
      }
    },
    components:{
      Main
    }
}
</script>

<style>

</style>