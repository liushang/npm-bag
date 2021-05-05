<template>
<el-dialog
  class="view-model-dialog"
  :visible.sync="dialogVisible"
  width="90%"
  center
  top="5vh"
  @close="close">
  <!-- <div style="min-height:600px"> -->
  <draggable-item
      :drawing-list="viewData"
      :current-item="viewData[0]"
      :index="0"
      showType="view"
      :containerInject="containerInject"
    />
  <!-- </div> -->
</el-dialog>
</template>

<script>
import DraggableItem from '../modules/DraggableItem';
export default {
    components: { DraggableItem },
    props: [ 'drawingList' ],
    mounted() {
      this.viewData = this.drawingList
    },
    data() {
        return {
          dialogVisible: true,
          viewData: [],
          containerInject: {}
        };
    },
    computed: {},
    watch: {},
    methods: {
      close() {
        this.$emit('closeViewModel')
      }
    }
};
</script>
<style lang="less">
.view-model-dialog{
  .el-dialog__body{
    display: inline-block;
    height: 100%;
    width: 80%;
  }
}
</style>
<style lang="less" scoped>
</style>
