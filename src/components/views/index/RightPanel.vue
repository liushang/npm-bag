<template>
  <div class="right-board" id="right-board">
    <el-tabs v-model="currentTab" class="center-tabs">
      <el-tab-pane label="组件属性" name="field" />
      <el-tab-pane label="表单属性" name="form" />
    </el-tabs>
    <div class="field-box">
      <el-scrollbar class="right-scrollbar" v-if="elementList && elementList.length">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(i, index) in elementList" :key="index">
            <span  @click="changeTab(index)">
              <div>{{i.name}}</div>
              <span style="color:rgb(64, 158, 255);font-size:10px;text-align:center" v-if="i.props.rawId">({{i.props.rawId.slice(i.name.length)}})</span>
              <span style="color:rgb(64, 158, 255);font-size:10px;text-align:center" v-if="i.props.subRawId">({{i.props.subRawId.slice(i.name.length)}})</span>
            </span>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 组件属性 -->
        <el-form v-show="currentTab==='field' && showField" v-if="editItem" size="small" label-width="90px">
          <div v-if="editItem.name" style="margin: 8px 0 0 0px">
            <el-collapse v-model="activeItems" @change="handleChange">
              <div v-for="(i, index) in propertiesList.filter(x => !['rawId', 'renderFunStr', 'subRawId'].includes(x))" :key="index">
              <el-collapse-item  :name="valueNameMap[i]" v-if="!['rawId', 'renderFunStr', 'subRawId'].includes(i)">
                <template slot="title">
                  {{valueNameMap[i] || i}}({{getValueLength(editItemProperty[i])}})
                  <span>
                <div style="margin-left: 30px" v-if="!['string', 'number', 'boolean', 'function'].includes(typeof editItem[i])">
                    <span class='' v-if="!modifyItem[i] && haveFixedAttrs(editItemProperty[i], i)" style="color:#409eff;font-size:14px;margin-right:10px" @click.stop="$refs['infiniteObj'][index].addProperty(modifyItem, i, null, 'rootWord', 1)">添加</span>
                    <!-- <i class='el-icon-plus' v-if="!modifyItem[i]" style="color:#409eff;font-size:16px;margin-right:10px" @click.stop="$refs['infiniteObj'][index].addProperty(modifyItem, i, null, 'rootWord')"></i> -->
                    <span v-if="!modifyItem[i]" style="color:#409eff;font-size:14px;margin-right:10px" @click.stop="$refs['infiniteObj'][index].addProperty(modifyItem, i, null, 'rootWord')">自定义</span>
                    <span class='' v-else style="color:#409eff;font-size:14px;margin-right:10px;margin-left:30px" @click.stop="$refs['infiniteObj'][index].saveProperty(i)">确定</span>
                    <span v-if="Object.keys(modifyItem).length > 0" style="color:#409eff;font-size:14px" @click.stop="$refs['infiniteObj'][index].delModifyItem(modifyItem, i)">X</span>
                    <!-- <span v-if="getValueLength(editItemProperty[i]) > 0">...</span> -->
                </div>
                  </span>
                </template>
                <InfiniteObject
                  ref="infiniteObj"
                  :modifyItem="modifyItem"
                  :activeData="editItemProperty"
                  :containerInject="containerInject"
                  :name="editItem.name"
                  :rootWord="i"
                  :initialType="i === 'children' ? 'array' : 'string'"
                  @changeComponentPanel="changeComponentPanel"
                  :initialTypeShow="['renderFun', 'rawId', 'on', 'nativeOn', 'methods'].includes(i) ? 'text' : 'input'"
                  ></InfiniteObject>
              </el-collapse-item>
              </div>
            </el-collapse>
          </div>
          <!-- <codemirror v-model="activeData.props.renderFun" :options="cmOptions" ref="cmEditor"/> -->
        </el-form>
        <!-- 表单属性 -->
        <el-form v-if="currentTab === 'form'" size="small" label-width="90px">
          <!-- <el-form-item label="表单名" v-for="(i, index) in formConf" :key="index">
            {{i}}
          </el-form-item> -->
          <!-- <codeEditor :dataStr="renderCode" v-if="activeData && activeData.props && activeData.props.renderFun && showFunctionDialog" :options="cmOptions" @close="changeFuncCode" ref="cmEditor"/> -->
          <codemirror :value="valueCode" v-if="containerInject"  @input="onCmCodeChange" :options="cmOptions" ref="cmEditor"/>
        </el-form>
      </el-scrollbar>
    </div>
    <codeEditor :dataStr="renderCode" v-if="activeData && activeData.props && activeData.props.renderFun && showFunctionDialog" :options="cmOptions" @close="changeFuncCode" ref="cmEditor"/>
  </div>
</template>
 
<script>
import InfiniteObject from './components/infiniteObject.js';
import CodeEditor from '../OGV-form-design/components/code-editor';
import { saveFormConf,
    stringToFunc
} from '../../utils/db';
import 'codemirror/mode/javascript/javascript.js';
import { htmlNode, defaultKV } from './components/default';
// import theme style
import 'codemirror/theme/base16-dark.css';

export default {
    components: {
        InfiniteObject,
        CodeEditor
    // ComponentConfigDetail
    // IconsDialog
    },
    props: ['showField', 'activeData', 'formConf', 'containerInject'],
    mounted() {
        console.log(this.activeData);
    },
    data() {
        return {
            valueNameMap: {
                attrs: '组件属性',
                on: '响应事件',
                nativeOn: '原生事件',
                children: '子元素',
                renderFun: '渲染函数',
                styles: '样式属性',
                style: '样式属性',
                computed: '计算属性',
                methods: '方法'
            },
            // 展示弹窗
            showFunctionDialog: false,
            currentTab: 'field',
            currentNode: null,
            dialogVisible: false,
            iconsVisible: false,
            currentIconModel: null,
            // 修改item
            modifyItem: {},
            options: [{
                value: '1',
                label: '字符串'
            }, {
                value: '2',
                label: '数字'
            }, {
                value: '3',
                label: '布尔值'
            }, {
                value: '4',
                label: '对象'
            }, {
                value: '5',
                label: '数组'
            }],
            cmOptions: {
                tabSize: 4,
                mode: 'text/javascript',
                theme: 'base16-dark',
                lineNumbers: true,
                line: true
                // more CodeMirror options...
            },
            tempCodeArr: [],
            activeItems: [],
            subActivityData: {},
            elementList: []
        };
    },
    computed: {
        editItem() {
            return this.elementList.length > 0 ? this.elementList[this.elementList.length - 1] : null;
        },
        editItemProperty() {
            return !this.editItem.props.subRawId ? this.editItem.props : this.editItem;
        },
        valueCode() {
            let aa = JSON.stringify(this.containerInject, function(key, value) {
                if (typeof value === 'function' && key !== 'renderFun') {
                    return value.toString();
                } else {
                    return value;
                }
            }, 4);
            return aa;
        },
        renderCode() {
            const [ data, property, subProperty ] = this.tempCodeArr;
            if (data[property][subProperty]) {
                return data[property][subProperty].toString().replace(/[\r\n]/, '');
            } else {
                return data[property].toString().replace(/[\r\n]/g, '').replace(/[\r\n]/, '');
            }
        },
        propertiesList() {
            return Object.keys(this.editItem.props).sort((a, b) => {
                return this.getValueLength(this.editItem.props[b]) - this.getValueLength(this.editItem.props[a]);
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
        formConf: {
            handler(val) {
                saveFormConf(val);
            },
            deep: true
        }
    },
    methods: {
        haveFixedAttrs(item, name) {
            // 判断是否还可以添加固有属性
            // console.log('判断是否还可以添加固有属性');
            // console.log(this.editItem);
            let attrs = Object.keys((defaultKV[this.editItem.name] || {})[name] || {});
            if (name !== 'children') attrs = attrs.filter(y => !item[y]);
            return attrs.length;
        },
        changeTab(index) {
            this.elementList = this.elementList.slice(0, index + 1);
            console.log(this.elementList);
        },
        handleChange(val) {
            console.log(val);
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
        changeFuncCode(code) {
            this.showFunctionDialog = false;
            this.$emit('renderAgain');
            console.log('changeFuncCodechangeFuncCodechangeFuncCode')
            const [ data, property, subProperty ] = this.tempCodeArr;
            const funcArr = ['on', 'nativeOn', 'methods']
            if (data[property][subProperty] && !funcArr.includes(property)) {
                data[property][subProperty] = code;
            } else {
              if (funcArr.includes(property)) {
                data[property][subProperty] = stringToFunc(code);
              } else {
                data[property] = stringToFunc(code);
              }
            }
            // this.activeData.props.renderFunStr = code
            // this.activeData.props.renderFun = stringToFunc(code)
        },
        // 向上传递改变组件面板内容
        changeComponentPanel(type, data, property, subProperty) {
            console.log(property, subProperty);
            if (property === 'renderFun' || property === 'on' || property === 'nativeOn' || property === 'methods') {
                // 函数编辑窗
                this.tempCodeArr = [data, property, subProperty];
                this.showFunctionDialog = true;
            } else {
                console.log(data);
                // if (htmlNode.includes(data[property][subProperty].name) || type === 'turn') {
                if (type === 'turn') {
                    // 展开子元素项 border变蓝色
                    // data[property][subProperty].styles.border = '1px solid red';
                    if (!data[property][subProperty].style) data[property][subProperty].style = {};
                    console.log(data[property][subProperty].style.border);
                    console.log('重新设置颜色');
                    this.$emit('clearBorderBlue');
                    if (htmlNode.includes(data[property][subProperty].name)) {
                        this.$set(data[property][subProperty].style, 'border', '1px solid rgb(64, 158, 255)');
                    } else {
                        // todu 颜色边框
                        // this.$set(data[property][subProperty].props.styles, 'border', '1px solid rgb(64, 158, 255)');
                    }
                    // this.$set(data[property][subProperty].style, 'display', 'inline-block');
                    this.subActivityData = data[property][subProperty];
                    console.log(this.subActivityData);
                    this.elementList.push(this.subActivityData);
                } else {
                    // json编辑窗
                    this.$emit('panelContent', data, property, subProperty);
                }
            }
        },
        getList(key, data = this.activeData) {
            let list = [];
            if (data) {
                console.log('dataactive存在');
                for (const i in data[key]) {
                    list.push(i);
                }
            }
            return list;
        },
        propertyAdd(modifyItem, i, index) {
            console.log(index);
            console.log(this.propertiesList[index]);
            this.$nextTick(() => {
                this.$refs['infiniteObj'][index].addProperty(modifyItem, i, null, 'rootWord');
            });

        },
        // saveProperty(key, data = this.activeData) {
        //     if (!(key in data)) this.$set(data, key, {});
        //     this.$set(this.activeData[key], this.modifyItem[key].key, this.modifyItem[key].value);
        //     console.log('新增属性');
        //     console.log(this.activeData);
        //     this.modifyItem = {};
        // },
        delModifyItem(key, data = this.activeData) {
            this.$delete(this.modifyItem, key, '');
            // delete this.modifyItem[key]
        }
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
  width: 400px;
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
.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;
  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }
  & .el-input + .el-input {
    margin-left: 4px;
  }
}
.select-item + .select-item {
  margin-top: 4px;
}
.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}
.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}
.option-drag {
  cursor: move;
}
.time-range {
  .el-date-editor {
    width: 227px;
  }
  ::v-deep .el-icon-time {
    display: none;
  }
}
.document-link {
  position: absolute;
  display: block;
  width: 26px;
  height: 26px;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #409eff;
  z-index: 1;
  border-radius: 0 0 6px 0;
  text-align: center;
  line-height: 26px;
  color: #fff;
  font-size: 18px;
}
.node-label{
  font-size: 14px;
}
.node-icon{
  color: #bebfc3;
}
</style>
