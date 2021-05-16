<template>
<div class="showTree">
  <a-button class="tree-structure" type="primary" @click="visible = true">结构</a-button>
    <a-drawer
      title="Basic Drawer"
      placement="left"
      :mask="false"
      :visible="visible"
      @close="onClose"
    >
      <TreeStr :data="basicData" @changeNode="changeNode"></TreeStr>
    </a-drawer>
</div>
</template>

<script>
import TreeStr from '../components/TreeStr'
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
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
  },
};
</script>

<style lang="less">
.showTree{
  .tree-structure{
    position: absolute;
    left: 80px;
    top: 5px;
    z-index: 1;
  }
}
</style>