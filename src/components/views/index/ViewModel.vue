<template>
<el-dialog
  class="panel-dialog"
  :visible.sync="dialogVisible"
  width="90%"
  center
  top="5vh"
  @close="close">
  <draggable-item
      :drawing-list="viewData"
      :current-item="viewData[0]"
      :index="0"
      showType="view"
      :containerInject="containerInject"
    />
</el-dialog>
</template>

<script>
import DraggableItem from './DraggableItem';
export default {
    components: { DraggableItem },
    props: [ 'drawingList' ],
    mounted() {
      console.log('ddddd ddddd ddddd ddddd ddddd ddd')
      this.viewData = this.drawingList
      console.log(this.drawingList)
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
</style>
<style lang="less" scoped>
</style>
