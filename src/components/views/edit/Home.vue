<template>
  <div class="container">
    <div class="left-board">
      <div class="logo-wrapper">
        <div class="logo">
          Form
        </div>
      </div>
      <el-scrollbar class="left-scrollbar">
        <div class="components-list">
          <div style="margin: 4px 0">
            <FuzzySearch value-key="node_name" style="width: 80px" v-model="searchNode" size="mini" type='select' searchType='node'></FuzzySearch>
            <el-button @click="injectNode" size="mini">确定</el-button>
          </div>
          <div v-for="(item, listIndex) in leftComponents" :key="listIndex">
            <el-collapse>
              <el-collapse-item :title="item.title">
                <div
                  v-for="(element, index) in item.list"
                  :key="index"
                  class="components-item"
                >
                  <div class="components-body" v-if="element.name" @click="addComponent(element, listIndex)">
                    {{ element.name }}
                  </div>
                  <el-collapse v-else>
                    <el-collapse-item :title="element.title">
                      <div
                        v-for="(e, endex) in element.list"
                        :key="endex"
                        class="components-item"
                        @click="addComponent(e, listIndex)"
                      >
                        <div class="components-body">
                          {{ e.name }}
                        </div>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="center-board" @click="e => e.preventDefault()">
      <el-scrollbar class="center-scrollbar">
        <el-row class="center-board-row" :gutter="formConf.gutter">
          <el-form
            :size="formConf.size"
            :label-position="formConf.labelPosition"
            :disabled="formConf.disabled"
            :label-width="formConf.labelWidth + 'px'"
          >
            <draggable class="drawing-board" :list="drawingList" :animation="340" group="componentsGroup">
                <div
                v-for="(item, index) in drawingList"
                :key="index"
                >
              <draggable-item
                v-if="showNew"
                ref="drag-item"
                  :key="item.renderKey"
                  :drawing-list="drawingList"
                  :current-item="item"
                  :index="index"
                  :containerInject="containerInject"
                  :form-conf="formConf"
                  :configData="lcConfigData"
                  @activeItem="activeFormItem"
                  @copyItem="drawingItemCopy"
                  @basicItem="drawingItemBasic"
                  @pageItem="drawingItemPage"
                  @viewItem="viewItem"
                  @deleteItem="drawingItemDelete"
                />
                  </div>
            </draggable>
            <div v-show="!drawingList.length" class="empty-info">
              从左侧拖入或点选组件进行表单设计
            </div>
          </el-form>
        </el-row>
      </el-scrollbar>
    </div>
    <right-panel
      :active-data="activeData"
      :form-conf="formConf"
      :containerInject="containerInject"
      :show-field="!!drawingList.length"
      ref="rightPanel"
      :basicDataChange="basicDataChange"
      :configData="lcConfigData"
      :changingNodeList="changingNodeList"
      @configValChange="configValChange"
      @clearBorderBlue="clearSubBorder(drawingList)"
      @panelContent="panelContent"
      @codeValueChange="codeValueChange"
      @saveModuleCode="saveModuleCode"
    />
    <panel-model
      :active-data="convertConstrutor(dialogComponentDetail)"
      :form-conf="formConf"
      v-if="showPanel"
      @close="closePanelDialog"
    />
    <input id="copyNode" type="hidden">
    <view-model v-if="showViewModel" @closeViewModel="showViewModel=false" :drawingList="viewItemData">
    </view-model>
    <NodeModal v-if="showNodeModal" @close="showNodeModal= false" @confirm="saveNode"></NodeModal>
    <TreeModel :basicData="activeData" @changeNode="changeNode"></TreeModel>
  </div>
</template>

<script type="module">
import draggable from 'vuedraggable';
import { debounce } from 'throttle-debounce';
import RightPanel from './modules/RightPanel';
import PanelModel from './model/PanelModel';
import ViewModel from './model/ViewModel';
import TreeModel from './model/TreeModel'
import {
    inputComponents, formConf, oComponents, getElementList, getHtmlLabel, getAntDesignList, getOtherComList
} from './default/rightPanel';
import {
    deepClone
} from '../../utils/index';
import logo from '../../../assets/logo.png';
import DraggableItem from './modules/DraggableItem';
import NodeModal from './model/NodeModal';
import FuzzySearch from './components/FuzzySearch';
import {
    getDrawingList, saveDrawingList, getFormConf, getContainer, saveContainer
} from '../../utils/db';
import { getDefaultProps, getRawId } from '../../schema/util';
import { defaultNode } from './default/structure';
import { allHtmlNode } from './default/index';

let drawingListInDB = getDrawingList();
const formConfInDB = getFormConf();
const containerInject = getContainer();
const drawingDefalut = [
    {
        name: 'oContainer',
        props: {},
    }
]
export default {
    components: {
        draggable,
        RightPanel,
        PanelModel,
        DraggableItem,
        ViewModel,
        NodeModal,
        FuzzySearch,
        TreeModel,
    },
    name: 'practice',
    props: {
      // 手动注入数据
      configData: {
        type: Object,
        default: () => {
          return {}
        }
      },
      moduleChangeDetail: {
        type: String,
        default: ''
      }
    },
    data() {
        return {
            // 重新展示
            showNew: true,
            logo,
            formConf,
            // o型组件
            oComponents,
            // 输入型组件
            inputComponents,
            // 选择型组件
            labelWidth: 100,
            drawingList: drawingDefalut,
            drawingData: {},
            drawerVisible: false,
            formData: {},
            dialogVisible: false,
            generateConf: null,
            showFileName: false,
            activeData: drawingDefalut[1],
            containerInject: containerInject || {},
            saveDrawingListDebounce: debounce(340, saveDrawingList),
            saveContainerDebounce: debounce(340, saveContainer),
            leftComponents: [
              {
                title: '容器组件',
                list: oComponents
              }, {
                title: 'html标签',
                list: getHtmlLabel() || []
              }, {
                title: 'element',
                list: getElementList(this.$root.$options.components)
              }, {
                title: 'antDesign',
                list: getAntDesignList(this.$root.$options.components)
              }, {
                title: '全局组件',
                list: getOtherComList(this.$root.$options.components)
              }
            ],
            // 点击的组件结构数据
            dialogComponentDetail: {},
            showPanel: false,
            previewItem: null,
            // 展示预览弹窗
            showViewModel: false,
            viewItemData: [],
            basicDataChange: false,
            showNodeModal: false,
            waitNode: {},
            searchNode: '',
            lcConfigData: {
              oContainer: {
                insData: {
                }
              }
            },
            treeVisible: false,
            changingNodeList: []
            // showRightPanel: true
          };
    },
    watch: {
        configData: {
            handler(val) {
                this.lcConfigData = val
            },
            deep: true
        },
        drawingList: {
            handler(val) {
                this.saveDrawingListDebounce(val);
            },
            deep: true
        },
        containerInject: {
            deep: true,
            handler(val) {
                this.saveContainerDebounce(val);
            }
        },
        moduleChangeDetail: {
            handler(val) {
              if (val) {
                drawingListInDB = getDrawingList(val)
                this.showNew = false
                setTimeout(() => {
                  this.activeData = drawingListInDB[0]
                  this.init()
                  this.basicDataChange = !this.basicDataChange
                  this.showNew = true
                  // this.showRightPanel = true
                }, 100)
              }
            },
            deep: true
        },
    },
    mounted() {
      this.init()
    },
    methods: {
        changeNode(e) {
          this.changingNodeList = e
        },
        init() {
          if (Array.isArray(drawingListInDB) && drawingListInDB.length > 0) {
              this.drawingList = drawingListInDB;
          } else {
              this.drawingList = drawingDefalut;
          }
          this.activeFormItem(this.drawingList[0]);
          if (formConfInDB) {
              this.formConf = formConfInDB;
          }
          this.$root.$off('DEAL_CHOOSE');
          this.$root.$on('DEAL_CHOOSE', (item) => {
              if (typeof item !== 'object') {
                let findComponent = (child) => {
                  for (let i of child.$children) {
                    if (i.rawId && i.rawId === item) {
                      return i
                    } else if (i.$children && i.$children.length) {
                      let ii = findComponent(i)
                      if (ii) return ii
                    }
                  }
                }
                item = findComponent(this.$refs['drag-item'][0])
              }
              if (this.previewItem) {
                  this.previewItem.style.border = '1px solid #e4e7ed';
                  if (this.previewItem.rawId !== item.rawId) this.clearSubBorder(this.drawingList);
              } 
                this.$set(item.style, 'border', '1px solid red');
              if(item) {
                let rawId = item.rawId;
                setTimeout(() => {
                    let activeSubItem = this.getRawIdItem(this.drawingList, rawId);
                    if (activeSubItem) this.activeFormItem(activeSubItem);
                }, 0);
                this.previewItem = item;
              }
          });
        },
        codeValueChange(val) {
            this.containerInject = JSON.parse(val);
        },
        configValChange(val) {
            this.lcConfigData = JSON.parse(val);
        },
        panelContent(data, property, subProperty) {
            this.dialogComponentDetail = {
                data, property, subProperty
            };
            this.showPanel = true;
        },
        closePanelDialog(e) {
            const { property, subProperty } = this.dialogComponentDetail;
            if (property === 'children' || property === 'directives') {
              this.$refs.rightPanel.editItem.props[property][subProperty] = e;
              this.$refs.rightPanel.editItem[property] && (this.$refs.rightPanel.editItem[property][subProperty] = e)
            }else {
              this.$set(this.$refs.rightPanel.editItem.props[property], subProperty, e)
            }
            this.showPanel = false;
        },
        convertConstrutor(e) {
          let json;
          if (e.data[e.property][e.subProperty].props && e.data[e.property][e.subProperty].props.subRawId) {
            json = e.data[e.property][e.subProperty]
          } else if (e.property === 'directives') {
            json = e.data[e.property][e.subProperty]
          } else {
            json = this.activeData.props[e.property][e.subProperty];
          }
          return json;
        },
        // 根据rawId获取对应的对象
        getRawIdItem(list, id) {
            if (!Array.isArray(list)) return;
            for (const i of list) {
                if (i.props && i.props.rawId === id) {
                    return i;
                } else {
                    if (i.props && i.props.children || i.children) {
                        let item = this.getRawIdItem(i.props.children || i.children, id);
                        if (item) return item;
                    }
                }
            }
        },
        clearSubBorder(list) {
            if (!Array.isArray(list)) return;
            for (const item of list) {
                if (item.style && item.style.border === '1px solid rgb(64, 158, 255)') {
                    // 清除html标签蓝色框
                    this.$delete(item.style, 'border');
                }
                if (item.props && item.props.styles && item.props.styles.border === '1px solid rgb(64, 158, 255)') {
                    // todo清除组件蓝色框
                    // item.props.styles.border = '1px solid rgb(228, 231, 237)';
                    // item.props.styles.border = '1px solid rgb(228, 231, 237)';
                    // this.$delete(item.props.styles, 'border');
                }
                if (item.children || (item.props && item.props.children)) {
                    this.clearSubBorder(item.children || item.props.children);
                }
            }
        },
        activeFormItem(currentItem, type) {
            if (type) {
              // 非容器组件
                const commonConfig = {
                    style: {},
                    attrs: {},
                    attrMap: {},
                    children: [],
                    class: {},
                    on: {},
                    nativeOn: {},
                    scopedSlots: {},
                    slot: '',
                    props: {},
                    renderFun: function(x) { return x }
                }
                const cofg = defaultNode[currentItem.name] && deepClone(defaultNode[currentItem.name]) || commonConfig
                if (allHtmlNode.includes(currentItem.name)) delete commonConfig.nativeOn
                if (!currentItem.props) this.$set(currentItem, 'props', {})
                for (let i in cofg) {
                    if (!currentItem[i]) this.$set(currentItem, i, cofg[i]);
                }
                if (!currentItem.props.subRawId) {
                    currentItem.props.subRawId = getRawId(currentItem.name);
                }
            } else {
              // 容器组件
              if (this.$root.$options.components[currentItem.name] && ['oRow', 'oContainer'].includes(currentItem.name)) {
                  const comOptions = getDefaultProps(this.$root.$options.components[currentItem.name].options);
                  for (let i in comOptions) {
                      if (!currentItem.props[i]) this.$set(currentItem.props, i, comOptions[i]);
                  }
                  if (!currentItem.props.rawId) currentItem.props.rawId = getRawId(currentItem.name);
                  this.activeData = currentItem;
              }
            }
        },
        // 添加组件 点击复制
        addComponent(item, index, whole) {
            let clone
            if (whole) {
              clone = item
            } else {
              clone = this.cloneComponent(item);
            }
            // 容器组件
            if (this.$refs.rightPanel.editItem.props.rawId) {
              this.$refs.rightPanel.editItem.props.children.push(clone)
            } else {
              this.$refs.rightPanel.editItem.children.push(clone)
            }
            this.activeFormItem(clone, index);
        },
        cloneComponent(origin) {
            return deepClone(origin);
        },
        drawingItemCopy(item, list) {
            let clone = deepClone(item);
            list.push(clone);
            this.activeFormItem(clone);
        },
        drawingItemBasic(item) {
          console.log(item)
        },
        drawingItemPage(item) {
          this.$emit('exportPageConfig', item)
        },
        drawingItemDelete() {
          this.$nextTick(() => {
            this.drawingList = [
              {
                name: 'oContainer',
                props: {
                  rawId: 'oContainer'
                },
              }
            ]
            this.activeFormItem(this.drawingList[0])
            this.$refs.rightPanel.elementList = [this.activeData]
          })
        },
        viewItem(viewItem) {
          this.viewItemData = [viewItem];
          this.showViewModel = true;
        },
        saveModuleCode(code) {
          this.waitNode = code
          this.showNodeModal = true;
        },
        saveNode({ name, type }) {
          this.$emit('saveModuleCode', this.waitNode, name, type)
        },
        injectNode(e) {
          let str = '[' + decodeURIComponent(this.searchNode.node_config) + ']'
          this.addComponent(getDrawingList(str)[0], 1, 1)
        }
    }
};
</script>
<style lang='less'>
@selectedColor: #f6f7ff;
@lighterBlue: #409EFF;
.drawing-board .border-red{
  border: 1px solid red;
}
.drawing-board .border-blue{
  border: 1px solid rgb(64, 158, 255);
}
.container {
  position: relative;
  width: 100%;
  height: 100%;
}

.components-list {
  box-sizing: border-box;
  height: 100%;
  .components-item {
    display: inline-block;
    width: 100%;
    margin: 1%;
    transition: transform 0ms !important;
  }
}
.components-draggable{
  padding-bottom: 20px;
}
.components-title{
  font-size: 14px;
  color: #222;
  margin: 6px 2px;
  .svg-icon{
    color: #666;
    font-size: 18px;
  }
}

.components-body {
  padding: 4px 4px;
  background: @selectedColor;
  font-size: 12px;
  cursor: move;
  border: 1px dashed @selectedColor;
  border-radius: 3px;
  .svg-icon{
    color: #777;
    font-size: 15px;
  }
  &:hover {
    border: 1px dashed #787be8;
    color: #787be8;
    .svg-icon {
      color: #787be8;
    }
  }
}

.left-board {
  width: 150px;
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
}
.left-scrollbar{
  height: calc(100vh - 42px);
  overflow: hidden;
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
.empty-info{
  position: absolute;
  top: 46%;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 18px;
  color: #ccb1ea;
  letter-spacing: 4px;
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
  .components-body {
    padding: 0;
    margin: 0;
    font-size: 0;
  }
  .sortable-ghost {
    position: relative;
    display: block;
    overflow: hidden;
    &::before {
      content: " ";
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 3px;
      background: rgb(89, 89, 223);
      z-index: 2;
    }
  }
  .components-item.sortable-ghost {
    width: 100%;
    height: 60px;
    background-color: @selectedColor;
  }
  .active-from-item {
    & > .el-form-item{
      background: @selectedColor;
      border-radius: 6px;
    }
    & > .drawing-item-copy, & > .drawing-item-delete{
      display: initial;
    }
    & > .component-name{
      color: @lighterBlue;
    }
  }
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

</style>
