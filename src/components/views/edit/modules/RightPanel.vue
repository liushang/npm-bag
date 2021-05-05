<template>
  <div class="right-board" id="right-board">
    <el-tabs v-model="currentTab" class="center-tabs">
      <el-tab-pane label="组件属性" name="field" />
      <el-tab-pane label="属性配置" name="attrSet" />
    </el-tabs>
    <div class="field-box">
      <el-scrollbar class="right-scrollbar" v-if="elementList && elementList.length">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(i, index) in elementList" :key="index">
            <span  @click="changeTab(index)">
              <div>{{i.name}}</div>
              <span style="color:rgb(64, 158, 255);font-size:10px;text-align:center" v-if="i.props.rawId">({{i.props.rawId !== 'oContainer' ? i.props.rawId.slice(i.name.length + 1) : 'oContainer'}})</span>
              <span style="color:rgb(64, 158, 255);font-size:10px;text-align:center" v-if="i.props.subRawId">({{i.props.subRawId.slice(i.name.length + 1)}})</span>
            </span>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 组件属性 -->
        <el-form v-show="currentTab==='field' && showField" v-if="editItem" size="small" label-width="90px">
          <div v-if="editItem.name && upDateRight" style="margin: 8px 0 0 0px">
            <span>{{editItem.props.rawId ? '模块' : '元素'}}别名</span>
            <a-input v-model="editItem.props.rawId" style="width: 140px;margin-bottom: 10px" size="small" v-if="editItem.props.rawId" ></a-input>
            <elInput v-model="editItem.props.subRawId" style="width: 140px;margin-bottom: 10px" size="mini" v-if="editItem.props.subRawId" />
            <el-input placeholder="回车转换元素" v-if="!['oContainer', 'oRow'].includes(editItem.name)" v-model="changeNode" @keyup.enter.native="changeCurNode(editItem)" size="mini" style="width: 120px"></el-input>
            <el-collapse v-model="activeItems" @change="handleChange">
              <div v-for="(i, index) in propertiesList.filter(x => !['rawId', 'renderFunStr', 'subRawId', 'renderRawFun'].includes(x))" :key="index">
              <el-collapse-item  :name="valueNameMap[i]" v-if="!['rawId', 'renderFunStr', 'subRawId', 'renderRawFun'].includes(i)">
                <template slot="title">
                  {{valueNameMap[i] || i}}({{getValueLength(editItemProperty[i])}})
                  <span>
                <div style="margin-left: 30px" v-if="!['string', 'number', 'boolean', 'function'].includes(typeof editItem[i]) && i !== 'props'">
                    <span v-if="!modifyItem[i] && haveFixedAttrs(editItemProperty[i], i)" style="color:#409eff;font-size:14px;margin-right:10px" @click.stop="$refs['infiniteObj'][index].addProperty(modifyItem, i, null, 'rootWord', 1)">添加</span>
                    <span v-if="!modifyItem[i]" style="color:#409eff;font-size:12px;margin-right:10px" @click.stop="$refs['infiniteObj'][index].addProperty(modifyItem, i, null, 'rootWord')">自定义</span>
                    <span v-else style="color:#409eff;font-size:14px;margin-right:10px;margin-left:30px" @click.stop="$refs['infiniteObj'][index].saveProperty(i)">确定</span>
                    <span v-if="i === 'children'" style="color:#409eff;font-size:14px;margin-right:10px;margin-left:30px" @click.stop="pasteChild()">paste</span>
                    <span v-if="Object.keys(modifyItem).length > 0 && modifyItem[i]" style="color:#409eff;font-size:14px" @click.stop="$refs['infiniteObj'][index].delModifyItem(modifyItem, i)">x</span>
                </div>
                  </span>
                </template>
                <component
                  :is="compMap[i] ? compMap[i] : 'InfiniteObject'"
                  ref="infiniteObj"
                  :modifyItem="modifyItem"
                  :activeData="editItemProperty"
                  :containerInject="containerInject"
                  :name="editItem.name"
                  :rootWord="i"
                  :initialType="i === 'children' || i === 'directives' ? 'array' : 'string'"
                  @saveModuleCode="saveModuleCode"
                  @changeComponentPanel="changeComponentPanel"
                  @getCopyVal="getCopyVal"
                  :initialTypeShow="['renderFun', 'rawId', 'on', 'nativeOn', 'methods', 'computed', 'scopedSlots', 'watch'].includes(i) ? 'text' : 'input'"
                  ></component>
              </el-collapse-item>
              </div>
            </el-collapse>
          </div>
          <!-- <codemirror v-model="activeData.props.renderFun" :options="cmOptions" ref="cmEditor"/> -->
        </el-form>
        <div v-if="currentTab === 'attrSet'">
          <ConfigPage :propData="configData" :metaData="elementList"></ConfigPage>
        </div>
        <!-- 表单属性 -->
        <el-form v-if="currentTab === 'form'" size="small" label-width="90px">
          <codemirror :value="valueCode" v-if="containerInject"  @input="onCmCodeChange" :options="cmOptions" ref="cmEditor"/>
        </el-form>
        <el-form v-if="currentTab === 'inject'" size="small" label-width="90px">
          <el-button @click="confirm" size="small" style="margin-bottom: 10px">注入</el-button>
          <codemirror :value="configCode" v-if="configData"  @input="configValChange" :options="cmOptions" ref="cmEditor"/>
        </el-form>
      </el-scrollbar>
    </div>
    <panel-dialog
      :active-data="attrDetail"
      :form-conf="formConf"
      v-if="showPanel"
      @close="closePanelDialog"
    />
    <codeEditor :dataStr="renderCode"
      v-if="activeData && activeData.props && activeData.props.renderFun && showFunctionDialog"
      :options="cmOptions" @close="changeFuncCode" ref="cmEditor"/>
  </div>
</template>
 
<script>
import InfiniteObject from '../components/InfiniteObject';
import CodeEditor from '../components/CodeEditor';
import { saveFormConf,
    stringToFunc
} from '../../../schema/util';
import 'codemirror/mode/javascript/javascript.js';
import { defaultKV } from '../default/config';
import 'codemirror/theme/base16-dark.css';
import BASEMAP from '../base/map';
import PanelDialog from '../model/PanelModel';
import Alias from '../attrConfig/alias'
import Children from '../attrConfig/Children'
import ConfigPage from '../components/ConfigPage';
import {
    getDrawingList
} from '../../../utils/db';
export default {
    components: {
        InfiniteObject,
        CodeEditor,
        PanelDialog,
        Alias,
        Children,
        ConfigPage
    },
    props: ['showField', 'activeData', 'formConf', 'containerInject', 'basicDataChange', 'configData', 'changingNodeList' ],
    data() {
        return {
            valueNameMap: BASEMAP.valueName,
            // 展示弹窗
            showFunctionDialog: false,
            currentTab: 'field',
            currentNode: null,
            dialogVisible: false,
            iconsVisible: false,
            currentIconModel: null,
            // 修改item
            modifyItem: {},
            cmOptions: {
                tabSize: 2,
                mode: 'text/javascript',
                theme: 'base16-dark',
                lineNumbers: true,
                line: true,
            },
            tempCodeArr: [],
            activeItems: [],
            elementList: [],
            attrDetail: {},
            showPanel: false,
            attrName: '',
            lcConVal: '',
            moduledId: 57,
            upDateRight: true,
            changeNode: '',
            compMap: {
              attrMap: 'Alias',
            },
            copyVal: null
        };
    },
    computed: {
        editItem() {
            return this.elementList.length > 0 ? this.elementList[this.elementList.length - 1] : null;
        },
        editItemProperty() {
            return !this.editItem.props.subRawId ? this.editItem.props : this.editItem;
        },
        configCode() {
            return JSON.stringify(this.configData, function(key, value) {
                if (typeof value === 'function' && key !== 'renderFun') {
                    return value.toString();
                } else {
                    return value;
                }
            }, 4);
        },
        valueCode() {
            return JSON.stringify(this.containerInject, function(key, value) {
                if (typeof value === 'function' && key !== 'renderFun') {
                    return value.toString();
                } else {
                    return value;
                }
            }, 4);
        },
        renderCode() {
            const [ data, property, subProperty ] = this.tempCodeArr;
            if (data[property][subProperty]) {
                return data[property][subProperty].toString();
            } else {
                return data[property].toString();
            }
        },
        propertiesList() {
            return Object.keys(this.editItemProperty).sort((a, b) => {
                return this.getValueLength(this.editItemProperty[b]) - this.getValueLength(this.editItemProperty[a]);
            });
        },
        codemirror() {
            return this.$refs.cmEditor.codemirror;
        }
    },
    watch: {
        'activeData.props.rawId'(val) {
            this.activeItems = [];
            Object.keys(this.activeData.props).forEach(i => {
                if (this.getValueLength(this.activeData.props[i]) && this.valueNameMap[i]) this.activeItems.push(this.valueNameMap[i]);
            });
            if (val) {
                this.elementList = [];
                this.elementList.push(this.activeData);
            }
        },
        'editItem.props' (val, old) {
          if (val && old && (val.rawId && val.rawId !== old.rawId || val.subRawId && val.subRawId !== old.subRawId)) {
            this.upDateRight = false;
            // 解决refs多种不同情况下 缓存排序不一致问题
            this.$nextTick(() => {
              this.upDateRight = true;
            })
          }
        },
        changingNodeList(val) {
          if (val.length > 0) {
            this.elementList = val
          }
        },
        basicDataChange() {
            this.elementList = [];
            this.elementList.push(this.activeData);
        },
        formConf: {
            handler(val) {
                saveFormConf(val);
            },
            deep: true
        }
    },
    methods: {
        changeCurNode(item) {
          const oldName = item.name;
          item.name = this.changeNode;
          item.props.subRawId = item.props.subRawId.replace(oldName, this.changeNode)
        },
        closePanelDialog(e) {
          let component = this.$refs.infiniteObj.filter(x => x.tempAttrName)[0]
          component.tempAttrValue = JSON.parse(JSON.stringify(e))
          this.attrDetail = []
          this.attrName = ''
          this.showPanel = false
        },
        convertConstrutor() {
          return this.attrDetail
        },
        haveFixedAttrs(item, name) {
            // 判断是否还可以添加固有属性
            let attrs = Object.keys((defaultKV[this.editItem.name] || {})[name] || {});
            if (name !== 'children' && name !== 'directives') attrs = attrs.filter(y => !item[y]);
            return attrs.length;
        },
        changeTab(index) {
            this.elementList = this.elementList.slice(0, index + 1);
        },
        handleChange(val) {
        },
        getValueLength(a) {
            if (typeof a === 'string' || typeof a === 'number' || typeof a === 'function') return 1;
            if (Array.isArray(a)) return a.length;
            if (typeof a === 'object') return Object.keys(a).length;
            if (typeof a === 'function') return 1;
            return 0;
        },
        onCmCodeChange(code) {
            this.$emit('codeValueChange', code);
        },
        confirm() {
          this.$emit('configValChange', this.lcConVal);
        },
        configValChange(code) {
          this.lcConVal = code
        },
        changeFuncCode(code) {
            this.showFunctionDialog = false;
            this.$emit('renderAgain');
            const [ data, property, subProperty ] = this.tempCodeArr;
            const funcArr = ['on', 'nativeOn', 'methods', 'computed', 'scopedSlots', 'watch']
            if (data[property][subProperty] && !funcArr.includes(property)) {
                data[property][subProperty] = code;
            } else {
              if (funcArr.includes(property)) {
                data[property][subProperty] = stringToFunc(code);
              } else {
                data[property] = stringToFunc(code);
              }
            }
        },
        // 向上传递改变组件面板内容
        changeComponentPanel(type, data, property, subProperty) {
            if (['renderFun', 'on', 'nativeOn', 'methods', 'computed', 'scopedSlots', 'watch'].includes(property)) {
                // 函数编辑窗
                this.tempCodeArr = [data, property, subProperty];
                this.showFunctionDialog = true;
            } else if (type === 'turn') {
                this.$emit('clearBorderBlue');
                if (['oContainer', 'oRow'].includes(data[property][subProperty].name)) {
                  this.$root.$emit('DEAL_CHOOSE', data[property][subProperty].props.rawId);
                } else {
                    this.$set(data[property][subProperty].style, 'border', '1px solid rgb(64, 158, 255)');
                }
                this.elementList.push(data[property][subProperty]);
            } else if (type === 'att') {
              // 属性-对象编辑窗
              this.showPanel = true;
              this.attrName = property;
              this.attrDetail = subProperty === '5' ? [] : {}
            } else {
                // json编辑窗
                this.$emit('panelContent', data, property, subProperty);
            }
        },
        getList(key, data = this.activeData) {
            let list = [];
            if (data) {
                for (const i in data[key]) {
                    list.push(i);
                }
            }
            return list;
        },
        propertyAdd(modifyItem, i, index) {
            this.$nextTick(() => {
                this.$refs['infiniteObj'][index].addProperty(modifyItem, i, null, 'rootWord');
            });

        },
        delModifyItem(key) {
            this.$delete(this.modifyItem, key, '');
        },
        saveModuleCode(code) {
          this.$emit('saveModuleCode', code)
        },
        getCopyVal(val) {
          this.copyVal = val
        },
        pasteChild() {
          if (!this.copyVal) {
            this.$message.error("没有复制的内容")
          } else {
            let str = '[' + this.copyVal + ']'
            let item = getDrawingList(str)[0]
            this.iterateThroughAllKeysAndValues(item)
            if (this.editItem.props.subRawId) {
              this.editItem.children.push(item)
            } else {
              this.editItem.props.children.push(item)
            }
          }
        },
        iterateThroughAllKeysAndValues (obj) {
          for(let key in obj) {
            if(!obj.hasOwnProperty(key)) return;
            if ((key === 'rawId' || key === 'subRawId') && obj[key].indexOf('_') > -1) {
              obj[key] = obj[key].split('_')[0] + '_' + parseInt(Math.random() * 1000000);
            }
            if(typeof obj[key] == 'object' || typeof obj[key] == 'function') {
              this.iterateThroughAllKeysAndValues(obj[key]);
            }
          }
        },
    }
};
</script>
<style lang="less">
#right-board{
  .el-form-item{
    margin-bottom: 4px;
  }
  .el-tabs__header{
      margin-bottom: 5px;
  }
}
.CodeMirror{
  height: 600px;
}
.el-collapse-item__content{
    padding-bottom: 6px;
}
.value-string{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
<style lang="less" scoped>
.right-board {
  width: 340px;
  position: absolute;
  right: 0;
  top: 0;
  padding-top: 3px;
  .field-box {
    position: relative;
    height: calc(100vh - 42px);
    box-sizing: border-box;
    overflow: hidden;
    margin-left: 10px;
  }
  .el-scrollbar {
    height: 100%;
  }
  .el-breadcrumb{
      margin-bottom: 0;
  }
}
</style>
