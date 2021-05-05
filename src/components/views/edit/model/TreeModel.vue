<template>
<div>
  <a-button class="tree-structure" type="primary" @click="visible = true">结构</a-button>
    <a-drawer
      title="Basic Drawer"
      placement="left"
      :mask="false"
      :visible="visible"
      :after-visible-change="afterVisibleChange"
      @close="onClose"
    >
      <TreeStr :data="basicData" @changeNode="changeNode"></TreeStr>
    </a-drawer>
</div>
</template>

<script>
import TreeStr from '../components/treeStr'
export default {
  props: {
    basicData: {
      type: Object
    }
  },
  data() {
    return {
      visible: false,
    };
  },
  components: {
    TreeStr
  },
  mounted() {
  },
  methods: {
    changeNode(e) {
      this.$emit('changeNode', e)
    },
    afterVisibleChange(val) {
      console.log('visible', val);
    },
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      console.log(this.basicData)
      this.visible = false;
    },
  },
};
</script>

<style>
  .tree-structure{
    position: absolute;
    left: 80px;
    top: 5px;
    z-index: 1;
  }
</style>