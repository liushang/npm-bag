<template>
  <div class="container">
    <div>{{msg}}</div>
    <div>{{propData}}</div>
    <el-button type="primary">12</el-button>
    <el-input v-model="tt"></el-input>
  </div>
</template>

<script>
export default {
  name: 'yyl-npm-practice',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      tt: '123'
    }
  },
  props: {
      propData: {
          type: String,
          default: '我是默认值'
      }
  }
}
</script>

<style>
.container{
    text-align: center;
}
</style>