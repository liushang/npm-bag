<template>
<el-dialog
  class="panel-dialog"
  :visible.sync="dialogVisible"
  width="80%"
  top="8vh"
  @close="close">
  <el-tabs v-model="currentTab" class="center-tabs">
    <el-tab-pane label="组件属性" name="field" />
  </el-tabs>
  <div class="field-box">
    <el-scrollbar class="right-scrollbar">
      <!-- 组件属性 -->
      <el-form v-if="activeData" size="small">
        <vue-json-editor
          v-model="modeJson"
          :show-btns="false"
          mode="code"
          @json-change="onJsonChange"
          @json-save="onJsonSave"
          @has-error="onError"
        ></vue-json-editor>
      </el-form>
    </el-scrollbar>
  </div>
</el-dialog>
</template>

<script>
import { saveFormConf } from '../../../utils/db';
import vueJsonEditor from 'vue-json-editor';

export default {
    components: {
        vueJsonEditor
    },
    props: ['showField', 'activeData', 'formConf'],
    mounted() {},
    data() {
        return {
            dialogVisible: true,
            currentTab: 'field',
            currentNode: null,
            iconsVisible: false,
            currentIconModel: null,
            // 修改item
            modifyItem: {},
            modeJson: {}
        };
    },
    computed: {
        propsList() {
            let list = [];
            for (const i in this.activeData.props) {
                list.push(i);
            }
            return list;
        },
        activeTag() {
            return this.activeData.__config__.tag;
        }
    },
    watch: {
        formConf: {
            handler(val) {
                saveFormConf(val);
            },
            deep: true
        },
        activeData: {
            handler(val) {
              if (val) {
                this.iterateThroughAllKeysAndValues(val)
                this.modeJson = val
              }
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        iterateThroughAllKeysAndValues (obj) {
          for(let key in obj) {
            if(!obj.hasOwnProperty(key)) return;
            if (typeof obj[key] == 'function') {
              obj[key] = obj[key].toString()
            }
            if(typeof obj[key] == 'object' || typeof obj[key] == 'function') {
              this.iterateThroughAllKeysAndValues(obj[key]);//递归遍历属性值的子属性
            }
          }
        },
        dealLcData (obj) {
            // 还要增加对子inData的处理
            if (obj && obj.props && obj.props.insData) {
                const data = obj.props.insData
                const dealChild = (data) => {
                    for(let i in data) {
                        if (typeof data[i] === 'object' && data[i] !== null) {
                            dealChild(data[i])
                        } else if (typeof data[i] === 'string' && data[i].startsWith('function')) {
                            data[i] = stringToFunc(data[i])
                        }
                    }
                }
                dealChild(data)
            }
            const child = obj && obj.props && (obj.props.rawId &&  obj.props.children || obj.props.subRawId && obj.children ) || []
            if (child.length) {
                for (let i of child) {
                    dealLcData(i)
                }
            }
            return obj
        },
        onJsonChange(e) {
            this.modeJson = e;
        },
        onJsonSave(e) {
            this.modeJson = e;
            return this.modeJson;
        },
        onError(e) {
            console.log('err', e);
        },
        close() {
            this.$emit('close', this.modeJson);
        },
        // 向上传递改变组件面板内容
        changeComponentPanel(e) {
            this.$emit('panelContent', e);
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
        addProperty(key, data = this.activeData) {
            this.$set(this.modifyItem, key, {
                key: '',
                type: '1',
                value: ''
            });
        },
        addChildren(data = this.activeData) {
            data.push({});
        },
        saveProperty(key, data = this.activeData) {
            if (!(key in data)) this.$set(data, key, {});
            this.$set(this.activeData[key], this.modifyItem[key].key, this.modifyItem[key].value || '');
            this.modifyItem = {};
        },
        delModifyItem(key, data = this.activeData) {
            this.$delete(this.modifyItem, key, '');
            // delete this.modifyItem[key]
        }
    }
};
</script>
<style lang="less">
.panel-dialog{
  .el-dialog__body{
    padding-top: 10px;
  }
  .ace-jsoneditor{
      min-height: 500px;
  }
  .jsoneditor-text{
      min-height: 500px;
  }
}
</style>
<style lang="less" scoped>
.right-board {
  // width: 550px;
  // position: absolute;
  // right: 0;
  // top: 0;
  // padding-top: 3px;
  .field-box {
    position: relative;
    height: calc(100vh - 400px);
    box-sizing: border-box;
    overflow: hidden;
  }
  .el-scrollbar {
    height: 100%;
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
