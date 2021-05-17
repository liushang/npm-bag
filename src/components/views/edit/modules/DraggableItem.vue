<script>
import draggable from 'vuedraggable';
import { analysisRenderConfig, analysisDataRender, analysisInjectData } from '../../../schema/util';
import {
    deepClone
} from '../../../utils/index';
const components = {
    itemBtns(h, injectDataItem ,currentItem) {
        const { basicItem, pageItem, deleteItem, viewItem } = this.$listeners;
        return [
            <span class="drawing-item-view" onClick={event => {
                viewItem(injectDataItem); event.stopPropagation();
            }}>
                <span>预览</span>
            </span>,
            // <span class="drawing-item-export" onClick={event => {
            //     basicItem(currentItem); event.stopPropagation();
            // }}>
            //     <span>基本配置</span>
            // </span>,
            <span class="drawing-item-copy" title="复制" onClick={event => {
                pageItem(injectDataItem); event.stopPropagation();
            }}>
                <span>导出配置</span>
            </span>,
            <span class="drawing-item-delete" title="删除" onClick={event => {
                deleteItem(currentItem); event.stopPropagation();
            }}>
                <span class="el-icon-delete"></span>
            </span>
        ];
    }
};
const layouts = {
    oFormItem(h, injectDataItem) {
        const { activeItem } = this.$listeners;
        if (this.formConf && this.formConf.unFocusedComponentBorder) className += ' unfocus-bordered';
        if (!injectDataItem || !injectDataItem.props || !injectDataItem.props.rawId) return
        let configData = analysisDataRender([ injectDataItem ]);
        let configArr = analysisRenderConfig(configData, h);
        return (
            <el-col class='drawing-item'
                nativeOnClick={event => { activeItem && activeItem(injectDataItem); event.stopPropagation(); }}>
                {configArr[0]}
                {!this.showType ? components.itemBtns.apply(this, arguments) : ''}
            </el-col>
        );
        // return (
        //     <el-col class='drawing-item'
        //         nativeOnClick={event => { activeItem && activeItem(injectDataItem); event.stopPropagation(); }}>
        //         {injectDataItem && injectDataItem.props && this.updateConfig ? 
        //           <ogvFormComp constructure={injectDataItem.props} on-getClick={this.hahah}></ogvFormComp>: ''}
        //         {!this.showType ? components.itemBtns.apply(this, arguments) : ''}
        //     </el-col>
        // );
    },
};

function layoutIsNotFound() {
    throw new Error(`没有与${this.currentItem.__config__.layout}匹配的layout`);
}

export default {
    components: {
        draggable
    },
    props: [
        'currentItem',
        'index',
        'drawingList',
        'activeId',
        'formConf',
        'containerInject',
        'showType',
        'configData'
    ],
    provide() {
        return {
            containerInject: this.containerInject
        };
    },
    data() {
      return {
        updateConfig: true
      }
    },
    created() {},
    methods: {
      hahah(e) {
        console.log('触发hhhh')
        console.log(e)
      }
    },
    computed: {
      injectDataItem() {
        if (!this.configData) {
          if (this.showType) {
            this.currentItem.props.env = 'prod';
          } else {
            this.currentItem.props.env = 'dev';
          }
          return this.currentItem
        };
        return  this.currentItem.props && this.currentItem.props.rawId ? analysisInjectData(deepClone(this.currentItem), this.configData[this.currentItem.props.rawId], 'oContainer', this.configData) : {__config__: {}}
      }
    },
    watch: {
      injectDataItem: {
        deep: true,
        handler() {
          // this.updateConfig = false;
          // this.$nextTick(x => {
          //   this.updateConfig = true;
          // })
        }
      }
    },
    render(h) {
        const layout = layouts['oFormItem'];
        if (layout && this.injectDataItem) {
            return layout.call(this, h, this.injectDataItem, this.currentItem);
        }
        return layoutIsNotFound.call(this);
    }
};
</script>
<style lang="less">
@selectedColor: #f6f7ff;
@lighterBlue: #409EFF;

.container {
  position: relative;
  width: 100%;
  height: 100%;
}

.center-scrollbar {
  height: calc(100vh - 42px);
  overflow: hidden;
  border-left: 1px solid #f1e8e8;
  border-right: 1px solid #f1e8e8;
  box-sizing: border-box;
}
.center-board {
  height: 100vh;
  width: auto;
  margin: 0 340px 0 150px;
  box-sizing: border-box;
}
.logo-wrapper{
  position: relative;
  height: 42px;
  background: #fff;
  border-bottom: 1px solid #f1e8e8;
  box-sizing: border-box;
}
.logo{
  position: absolute;
  left: 12px;
  top: 6px;
  line-height: 30px;
  color: #00afff;
  font-weight: 600;
  font-size: 17px;
  white-space: nowrap;
  > img{
    width: 30px;
    height: 30px;
    vertical-align: top;
  }
  .github{
    display: inline-block;
    vertical-align: sub;
    margin-left: 15px;
    > img{
      height: 22px;
    }
  }
}

.center-board-row {
  padding: 12px 12px 15px 12px;
  box-sizing: border-box;
  & > .el-form {
    // 69 = 12+15+42
    height: calc(100vh - 69px);
  }
}
.drawing-board {
  height: 100%;
  position: relative;
  .el-form-item{
    margin-bottom: 15px;
  }
}
.drawing-item{
  position: relative;
  cursor: move;
  &.unfocus-bordered:not(.active-from-item) > div:first-child {
    border: 1px dashed #ccc;
  }
  .el-form-item{
    padding: 12px 10px;
  }
}
.drawing-item, .drawing-row-item{
  &:hover {
    & > .el-form-item{
      background: @selectedColor;
      border-radius: 6px;
    }
    & > .drawing-item-copy, & > .drawing-item-delete, & > .drawing-item-export, & > .drawing-item-view{
      display: initial;
    }
  }
  & > .drawing-item-copy, & > .drawing-item-delete, & > .drawing-item-export, & > .drawing-item-view{
    position: absolute;
    top: -10px;
    width: 22px;
    height: 22px;
    line-height: 22px;
    text-align: center;
    font-size: 12px;
    border: 1px solid;
    cursor: pointer;
    z-index: 1;
  }
  & > .drawing-item-copy{
    right: 126px;
    width: 60px;
    border-color: @lighterBlue;
    color: @lighterBlue;
    background: #fff;
    &:hover{
      background: @lighterBlue;
      color: #fff;
    }
  }
  & > .drawing-item-export{
    right: 56px;
    width: 60px;
    border-color: @lighterBlue;
    color: @lighterBlue;
    background: #fff;
    &:hover{
      background: @lighterBlue;
      color: #fff;
    }
  }
  & > .drawing-item-view{
    right: 200px;
    width: 40px;
    border-color: @lighterBlue;
    color: @lighterBlue;
    background: #fff;
    &:hover{
      background: @lighterBlue;
      color: #fff;
    }
  }
  & > .drawing-item-delete{
    right: 24px;
    border-color: #F56C6C;
    color: #F56C6C;
    background: #fff;
    &:hover{
      background: #F56C6C;
      color: #fff;
    }
  }
}
</style>
