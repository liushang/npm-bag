<template>
  <div class="container">
    <div class="left-board">
      <div class="logo-wrapper">
        <div class="logo">
          OGVForm
        </div>
      </div>
      <el-scrollbar class="left-scrollbar">
        <div class="components-list">
          <div v-for="(item, listIndex) in leftComponents" :key="listIndex">
            <!-- <div class="components-title">
              {{ item.title }}
            </div> -->
            <!-- <draggable
              class="components-draggable"
              :list="item.list"
              :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
              :clone="cloneComponent"
              draggable=".components-item"
              :sort="false"
              @end="onEnd"
            >
              <div
                v-for="(element, index) in item.list"
                :key="index"
                class="components-item"
                @click="addComponent(element, listIndex)"
              >
                <div class="components-body">
                  {{ element.__config__.label }}
                </div>
              </div>
            </draggable> -->
            <el-collapse>
              <el-collapse-item :title="item.title">
                <div
                  v-for="(element, index) in item.list"
                  :key="index"
                  class="components-item"
                >
                  <div class="components-body" v-if="element.__config__" @click="addComponent(element, listIndex)">
                    {{ element.__config__.label }}
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
                          {{ e.__config__.label }}
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

    <div class="center-board">
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
                  :key="item.renderKey"
                  :drawing-list="drawingList"
                  :current-item="item"
                  :index="index"
                  :active-id="activeId"
                  :containerInject="containerInject"
                  :form-conf="formConf"
                  :configData="configData"
                  @activeItem="activeFormItem"
                  @copyItem="drawingItemCopy"
                  @viewItem="drawingItemView"
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
      @renderAgain="renderAgain"
      @tag-change="tagChange"
      @clearBorderBlue="clearSubBorder(drawingList)"
      @panelContent="panelContent"
      @codeValueChange="codeValueChange"
    />
    <panel-dialog
      :active-data="convertConstrutor(dialogComponentDetail)"
      :form-conf="formConf"
      v-if="showPanel"
      @close="closePanelDialog"
      @tag-change="tagChange"
    />
    <input id="copyNode" type="hidden">
    <view-model v-if="showViewModel" @closeViewModel="showViewModel=false" :drawingList="drawingList">
    </view-model>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { debounce } from 'throttle-debounce';
import render from '../../components/render/render';
// import FormDrawer from './FormDrawer'
// import JsonDrawer from './JsonDrawer'
import RightPanel from './RightPanel';
import PanelDialog from './PanelDialog';
import ViewModel from './ViewModel';

import {
    inputComponents, selectComponents, layoutComponents, formConf, oComponents, getElementList, getHtmlLabel
} from '../../components/generator/config';
import {
    deepClone
} from '../../utils/index';
import drawingDefalut from '../../components/generator/drawingDefalut';
import logo from '../../assets/logo.png';
import CodeTypeDialog from './CodeTypeDialog';
import DraggableItem from './DraggableItem';
import {
    getDrawingList, saveDrawingList, getIdGlobal, saveIdGlobal, getFormConf, getContainer, saveContainer
} from '../../utils/db';
import { getDefaultProps, getRawId } from '../../schema/util';
import { defaultNode } from './components/default';

let oldActiveId;
let tempActiveData;
const drawingListInDB = getDrawingList();
const formConfInDB = getFormConf();
const containerInject = getContainer();
export default {
    components: {
        draggable,
        render,
        // FormDrawer,
        // JsonDrawer,
        RightPanel,
        PanelDialog,
        CodeTypeDialog,
        DraggableItem,
        ViewModel
    },
    name: 'practice',
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
            selectComponents,
            layoutComponents,
            labelWidth: 100,
            drawingList: drawingDefalut,
            drawingData: {},
            activeId: drawingDefalut[0].formId,
            drawerVisible: false,
            formData: {},
            dialogVisible: false,
            jsonDrawerVisible: false,
            generateConf: null,
            showFileName: false,
            activeData: drawingDefalut[1],
            containerInject: containerInject || {},
            saveDrawingListDebounce: debounce(340, saveDrawingList),
            saveIdGlobalDebounce: debounce(340, saveIdGlobal),
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
                title: '全局组件',
                list: []
              }
            ],
            // 点击的组件结构数据
            dialogComponentDetail: {},
            showPanel: false,
            previewItem: null,
            // 展示预览弹窗
            showViewModel: false,
            configData: {
              'oContainer': {
                renderFun: function(oooo) {
                  console.log(this.tt)
                  return oooo
                },
                attrMap: {
                  tt: 'insData'
                },
                insData: {
                  form: {
                    input: '我11112',
                    select: 1
                  },
                  rules: {
                    input: [
                      { required: true, message: '请输入活动名称', trigger: 'blur' },
                      { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                  }
                }
              },
              'oRow_712129': {
                renderFun: function(oooo) {
                  console.log(this.tt)
                  return oooo
                },
              }
            },

          };
    },
    watch: {
    // eslint-disable-next-line func-names
        'activeData.__config__.label': function (val, oldVal) {
            if (
                this.activeData.placeholder === undefined ||
        !this.activeData.__config__.tag ||
        oldActiveId !== this.activeId
            ) {
                return;
            }
            this.activeData.placeholder = this.activeData.placeholder.replace(oldVal, '') + val;
        },
        activeId: {
            handler(val) {
                oldActiveId = val;
            },
            immediate: true
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
                console.log('保存结构')
                this.saveContainerDebounce(val);
            }
        },
    },
    mounted() {
        if (Array.isArray(drawingListInDB) && drawingListInDB.length > 0) {
            this.drawingList = drawingListInDB;
        } else {
            this.drawingList = drawingDefalut;
        }
        // this.drawingList[0].style = {
        //     border: '1px solid red'
        // };
        this.activeFormItem(this.drawingList[0]);
        if (formConfInDB) {
            this.formConf = formConfInDB;
        }
        // this.previewItem = this.drawingList[0]
        // loadBeautifier(btf => {
        //     beautifier = btf;
        // });
        this.$root.$off('DEAL_CHOOSE');
        this.$root.$on('DEAL_CHOOSE', (item) => {
            if (this.previewItem) {
                this.previewItem.style.border = '1px solid #e4e7ed';
                if (this.previewItem.rawId !== item.rawId) this.clearSubBorder(this.drawingList);
            }
            this.$set(item.style, 'border', '1px solid red');
            let rawId = item.rawId;
            setTimeout(() => {
                let activeSubItem = this.getRawIdItem(this.drawingList, rawId);
                if (activeSubItem) this.activeFormItem(activeSubItem);
            }, 0);
            this.previewItem = item;
        });
    },

    methods: {
        codeValueChange(val) {
            this.containerInject = JSON.parse(val);
        },
        renderAgain() {
        },
        panelContent(data, property, subProperty) {
            this.dialogComponentDetail = {
                data, property, subProperty
            };
            this.showPanel = true;
        },
        closePanelDialog(e) {
            const { property, subProperty } = this.dialogComponentDetail;
            this.$set(this.activeData.props[property], subProperty, e);
            this.showPanel = false;
        },
        convertConstrutor(e) {
            let json = this.activeData.props[e.property][e.subProperty];
            !json.props && json.name && (json.props = {
                attrs: {},
                children: []
            });
            return json;
        },
        setObjectValueByStringKeys(obj, strKeys, val) {
            const arr = strKeys.split('.');
            arr.reduce((pre, item, i) => {
                if (arr.length === i + 1) {
                    pre[item] = val;
                } else if (Object.prototype.toString.call(pre[item]) !== '[Object Object]') {
                    pre[item] = {};
                }
                return pre[item];
            }, obj);
        },
        setRespData(component, respData) {
            const { dataPath, renderKey, dataConsumer } = component.__config__;
            if (!dataPath || !dataConsumer) return;
            const data = dataPath.split('.').reduce((pre, item) => pre[item], respData);
            this.setObjectValueByStringKeys(component, dataConsumer, data);
            const i = this.drawingList.findIndex(item => item.__config__.renderKey === renderKey);
            if (i > -1) this.$set(this.drawingList, i, component);
        },
        fetchData(component) {
            const { dataType, method, url } = component.__config__;
            if (dataType === 'dynamic' && method && url) {
                this.$axios({
                    method,
                    url
                }).then(resp => {
                    this.setRespData(component, resp.data);
                });
            }
        },
        getRawIdItem(list, id) {
            if (!Array.isArray(list)) return;
            for (const i of list) {
                if (i.props && i.props.rawId === id) {
                    return i;
                } else {
                    if (i.props && i.props.children) {
                        let oo = this.getRawIdItem(i.props.children, id);
                        if (oo) return oo;
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
                const commonConfig = {
                    style: {},
                    attrs: {},
                    attrMap: {},
                    children: [],
                    on: {},
                    nativeOn: {},
                    props: {},
                    renderFun: x => x
                }
                const cofg = defaultNode[currentItem.name] || commonConfig
                if (!currentItem.props) this.$set(currentItem, 'props', {})
                for (let i in cofg) {
                    if (!currentItem.props[i]) this.$set(currentItem.props, i, cofg[i]);
                    if (!currentItem[i]) this.$set(currentItem, i, cofg[i]);
                }
                // if (cofg.props) {
                //   for (let i in cofg.props) {
                //     this.$set(currentItem.props, i, cofg.props[i])
                //   }
                // }
                // if (!currentItem.props) this.$set(currentItem.props, i, cofg[i]);
              if (!currentItem.props.subRawId) {
                  currentItem.props.subRawId = getRawId(currentItem.name);
              }
              
            } else {
              if (this.$root.$options.components[currentItem.name]) {
                  const comOptions = getDefaultProps(this.$root.$options.components[currentItem.name].options);
                  for (let i in comOptions) {
                      if (!currentItem.props[i]) this.$set(currentItem.props, i, comOptions[i]);
                      // this.$set(currentItem.props.attrs, i, comOptions[i])
                  }
                  if (!currentItem.props.rawId) currentItem.props.rawId = getRawId(currentItem.name);
              }
            }
            this.activeData = currentItem;
        },
        onEnd(obj) {
            if (obj.from !== obj.to) {
                this.activeData = tempActiveData;
            }
        },
        // 添加组件 点击复制
        addComponent(item, index) {
            const clone = this.cloneComponent(item);
            this.activeData.props.children.push(clone);
            this.activeFormItem(clone, index);
        },
        cloneComponent(origin) {
            const clone = deepClone(origin);
            const config = clone.__config__;
            config.span = this.formConf.span; // 生成代码时，会根据span做精简判断
            this.createIdAndKey(clone);
            clone.placeholder !== undefined && (clone.placeholder += config.label);
            tempActiveData = clone;
            return tempActiveData;
        },
        createIdAndKey(item) {
            const config = item.__config__;
            if (Array.isArray(config.children)) {
                config.children = config.children.map(childItem => this.createIdAndKey(childItem));
            }
            return item;
        },
        drawingItemCopy(item, list) {
            let clone = deepClone(item);
            clone = this.createIdAndKey(clone);
            list.push(clone);
            this.activeFormItem(clone);
        },
        drawingItemView(item, list) {
            this.showViewModel = true;
        },
        drawingItemDelete(index, list) {
            list.splice(index, 1);
            this.$nextTick(() => {
                const len = this.drawingList.length;
                if (len) {
                    this.activeFormItem(this.drawingList[len - 1]);
                }
            });
            // this.drawingList[0].props.children = [];
        },
        tagChange(newTag) {
            newTag = this.cloneComponent(newTag);
            const config = newTag.__config__;
            // newTag.__vModel__ = this.activeData.__vModel__;
            config.formId = this.activeId;
            config.span = this.activeData.__config__.span;
            this.activeData.__config__.tag = config.tag;
            this.activeData.__config__.tagIcon = config.tagIcon;
            this.activeData.__config__.document = config.document;
            if (typeof this.activeData.__config__.defaultValue === typeof config.defaultValue) {
                config.defaultValue = this.activeData.__config__.defaultValue;
            }
            Object.keys(newTag).forEach(key => {
                if (this.activeData[key] !== undefined) {
                    newTag[key] = this.activeData[key];
                }
            });
            this.activeData = newTag;
            this.updateDrawingList(newTag, this.drawingList);
        },
        updateDrawingList(newTag, list) {
            const index = list.findIndex(item => item.__config__.formId === this.activeId);
            if (index > -1) {
                list.splice(index, 1, newTag);
            } else {
                list.forEach(item => {
                    if (Array.isArray(item.__config__.children)) this.updateDrawingList(newTag, item.__config__.children);
                });
            }
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
  padding: 8px;
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
  width: 120px;
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
  margin: 0 450px 0 120px;
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
.action-bar{
  position: relative;
  height: 42px;
  text-align: right;
  padding: 0 15px;
  box-sizing: border-box;;
  border: 1px solid #f1e8e8;
  border-top: none;
  border-left: none;
  .delete-btn{
    color: #F56C6C;
  }
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
.drawing-row-item{
  position: relative;
  cursor: move;
  box-sizing: border-box;
  border: 1px dashed #ccc;
  border-radius: 3px;
  padding: 0 2px;
  margin-bottom: 15px;
  .drawing-row-item {
    margin-bottom: 2px;
  }
  .el-col{
    margin-top: 22px;
  }
  .el-form-item{
    margin-bottom: 0;
  }
  .drag-wrapper{
    min-height: 80px;
  }
  &.active-from-item{
    border: 1px dashed @lighterBlue;
  }
  .component-name{
    position: absolute;
    top: 0;
    left: 0;
    font-size: 12px;
    color: #bbb;
    display: inline-block;
    padding: 0 6px;
  }
}
.drawing-item, .drawing-row-item{
  &:hover {
    & > .el-form-item{
      background: @selectedColor;
      border-radius: 6px;
    }
    & > .drawing-item-copy, & > .drawing-item-delete{
      display: initial;
    }
  }
  & > .drawing-item-copy, & > .drawing-item-delete{
    display: none;
    position: absolute;
    top: -10px;
    width: 22px;
    height: 22px;
    line-height: 22px;
    text-align: center;
    border-radius: 50%;
    font-size: 12px;
    border: 1px solid;
    cursor: pointer;
    z-index: 1;
  }
  & > .drawing-item-copy{
    right: 56px;
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
