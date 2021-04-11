<template>
<div>
  <Main/>
  <!-- <practice></practice> -->
  <!-- <ogvdesign :constructure="dataConfig[0]"></ogvdesign> -->
</div>
</template>
<script>
import Main from './components/views/index/Edit'
// import Main from './components/Main'
export default {
    data() {
      return {
        dataConfig: [{}]
      }
    },
    components:{
      Main,
    },
    mounted() {
      console.log(this.$root.$options.components)
    }
}
</script>

<style>

</style>