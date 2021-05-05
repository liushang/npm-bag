<template>
<div>
<div style="padding: 5px 0 5px 10px" v-for="(x) in propertyList" :key="x">
    <span>
        <span v-if="!['string', 'number', 'boolean', 'function'].includes(typeof activeData[rootWord])">
          {{getAlias(activeData, rootWord, x)}}
        </span>
    </span>
    <span>
        <span v-if="!['string', 'number', 'boolean'].includes(typeof activeData[rootWord])">
          <span className="el-icon-anti-tag-fill" @click="delKey(x, rootWord)" style="margin-left: 5px;color: rgb(241 23 23);font-size: 15px">x&nbsp;&nbsp;</span>
        </span>
        <el-select size="mini" disabled v-model="activeData[rootWord][x]" style="width: 80px" v-if="(defaultKeyValue[rootWord] || {})[x]">
            <el-option :label="i" :value="i" v-for="i in (defaultKeyValue[rootWord] || {})[x].value" :key="i"></el-option>
        </el-select>
        <el-input v-else size="mini" disabled v-model="activeData[rootWord][x]" placeholder="请输入字段名（v-model）s" style="width: 105px"/>
        <el-button size="mini" @click="showEditModal = x">编辑</el-button>
    </span>
</div>
<el-form>
  <el-form-item>
    <div v-if="modifyItem.hasOwnProperty(rootWord) && modifyItem[rootWord].type">
      <el-form-item label-width="0px">
        <el-select v-if="addType" v-model="modifyItem[rootWord][key]">
          <el-option :key="o" :label="(defaultKeyValue[rootWord] || {})[o].label" :value="o" v-for="o in Object.keys(defaultKeyValue[rootWord] || {}).filter(y => !activeData[rootWord][y])"></el-option>;
        </el-select>
        <span v-else>
            <el-input size="mini" v-model="modifyItem[rootWord].key" style="width: 60px" />&nbsp;
            <el-select size="mini" v-model="modifyItem[rootWord].type" style="width: 80px">
                <el-option :key="ondex" :label="o.label" :value="o.value" v-for="(o, ondex) in options"></el-option>
            </el-select>
        </span>
        <span v-if="addType">
          <el-select v-if="defaultKeyValue[rootWord][modifyItem[rootWord].key].value" size="mini" v-model="modifyItem[rootWord].value" style="width: 120px">
            <el-option :key="ondex" :label="o" :value="o" v-for="(o, ondex) in defaultKeyValue[rootWord][modifyItem[rootWord].key].value"></el-option>
          </el-select>
          <el-input v-else v-model="modifyItem[rootWord].value" style="width: 100px"></el-input>
        </span>
        <el-input v-else size="mini" v-model="modifyItem[rootWord].value" style="width: 100px" />
      </el-form-item>
    </div>
  </el-form-item>
</el-form>
<el-dialog :visible="true" v-if="showEditModal" width="500px" title="添加别名映射" append-to-body @close="closeEdit">
    <span>
      输入映射值：<el-input v-model="editValue"></el-input>
    </span>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="closeEdit">取 消</el-button>
      <el-button size="small" type="primary" @click="activeData[rootWord][showEditModal]=editValue;closeEdit()">提 交</el-button>
    </div>
</el-dialog>
</div> 
</template>
<script>
import {
    stringToFunc
} from '../../../schema/util';
import { defaultKV } from '../default/config';
export default {
    data() {
        let options = [{
            value: '1',
            label: 'string'
        }, {
            value: '2',
            label: '数字'
        }, {
            value: '3',
            label: 'bool'
        }, {
            value: '4',
            label: '对象'
        }, {
            value: '5',
            label: '数组'
        }];
        return {
            // 编辑对象
            options,
            valueTypeInitial: {
                '1': '',
                '2': 0,
                '3': false,
                '4': {},
                '5': []
            },
            valueTypeMap: {
                '1': e => <el-input size="mini" v-model={e.value} style="width: 100px" />,
                '2': e => <el-input-number size="mini" v-model={e.value} style="width: 100px" />,
                '3': e => <el-radio-group v-model={e.value}  size="mini">
                              <el-radio label={true}>true</el-radio>
                              <el-radio label={false}>false</el-radio>
                          </el-radio-group>,
                '4': e => '',
                '5': e => ''
            },
            // 默认是自定义属性
            addType: false,
            // 展示对象编辑panel
            showObjectPanel: false,
            tempAttrName: '',
            tempAttrValue: '',
            editValue: '',
            showEditModal: ''
        };
    },
    props: {
        activeData: {
            type: Object,
            default: () => {}
        },
        modifyItem: {
            type: Object,
            default: () => {}
        },
        containerInject: {
            type: Object,
            default: () => {}
        },
        rootWord: {
            type: String,
            default: 'props'
        },
        initialTypeShow: {
            type: String,
            default: 'input'
        },
        initialType: {
            type: String,
            default: 'object'
        },
        name: {
            type: String,
            default: 'oContainer'
        },
    },
    computed: {
        defaultKeyValue() {
            return defaultKV[this.name] || {};
        },
        propertyList() {
          return this.getList(this.rootWord);
        },
    },
    watch: {},
    render() {
        const modifyItem = this.modifyItem;
        // 根属性
        const rootWord = this.rootWord;
        // 字符串、数字、布尔值（值）渲染
        const strNumBoolSpan = (a, b, c) => {
            const val = a[b][c]
            if (typeof val === 'string') {
                // 获取预设值
                const insertAttrs = (this.defaultKeyValue[this.rootWord] || {})[c]
                if (insertAttrs && insertAttrs.value.length) {
                    // 属性为内置属性
                    const defaultValue = insertAttrs.value
                    // 设置预设值下拉菜单
                    const options = defaultValue.map((x, i) => {
                            return <el-option key={i} label={x} value={x}></el-option>
                    });
                    return <el-select size="mini" v-model={a[b][c]} style="width: 120px">
                    {options}
                </el-select>;
                } else {
                    // 没有预设值则展示输入框
                    return (<el-input  size="mini" v-model={a[b][c]} placeholder="请输入字段名（v-model）s" style="width: 165px"/>)
                }
            }
        }
        return (<div>
            {this.propertyList.map(x => {
                return (<div style="padding: 5px 0 5px 10px">
                    <span>
                        {/* key为数字、字符串、布尔值、函数 不展示key，其他获取是否有别名后再展示 */}
                        {['string', 'number', 'boolean', 'function'].includes(typeof this.activeData[rootWord]) ? '' : this.getAlias(this.activeData, rootWord, x)}
                    </span>
                    <span>
                        {
                            // 判断key是否展示x号 'string', 'number', 'boolean'不展示
                            ['string', 'number', 'boolean'].includes(typeof this.activeData[rootWord]) ? ''
                                :
                                <span className="el-icon-anti-tag-fill" onClick={() => this.delKey(x, rootWord)} style="margin-left: 5px;color: rgb(241 23 23);font-size: 15px">x&nbsp;&nbsp;</span>
                        }
                        {/* 值的展示：值为'string', 'number', 'boolean'且初始值类型为input，则展示input输入框 */}
                        {['string', 'number', 'boolean'].includes(typeof this.activeData[rootWord]) && this.initialTypeShow === 'input' ? <el-input  size="mini" v-model={this.activeData[rootWord]} placeholder="请输入字段名（v-model）" style="width: 165px"/>
                                // 值为字符串/数字/bool选项
                              : strNumBoolSpan(this.activeData, rootWord, x)
                        }
                    </span>
                </div>)
            })}
            {/* 新增kw的展示 */}
            <el-form-item label-width="26px">
                {this.getValue(modifyItem, rootWord)}
            </el-form-item>
        </div>);
    },
    methods: {
        closeEdit() {
          this.editValue = '';
          this.showEditModal = '';
        },
        getAlias(a, b, c) {
            const insertAttrs = (this.defaultKeyValue[b] || {})[c];
            if (insertAttrs) {
                return insertAttrs.label || c;
            } else {
                return c;
            }
        },
        // 展示键值对
        getValue(data, keyword) {
            return data.hasOwnProperty(keyword) && data[keyword].type ? (<div><el-form-item label-width="0px">
                {this.getKey(data, keyword)}
                &nbsp;: {this.getDefaultValue(data, keyword)}
            </el-form-item>
            </div>) : '';
        },
        getDefaultValue(data, keyword) {
            // 如果是添加预置属性
            if (this.addType) {
                if (data[keyword].key) {
                    let defaultValue = []
                    defaultValue = this.defaultKeyValue[this.rootWord][data[keyword].key].value
                    let valueType = 'select'
                    const options = defaultValue.map((x, i, arr) => {
                            return <el-option key={i} label={x} value={x}></el-option>
                    });
                    // 设置初始值
                    if (data[keyword].value === '') data[keyword].value = defaultValue[0] || ''
                    if (!defaultValue.length) {
                        // 无默认选择值则使用input输入框
                        return <el-input v-model={data[keyword].value} style="width: 100px"></el-input>
                    } else if (valueType === 'select') {
                        // 下拉模式为下拉菜单
                        return <el-select size="mini" v-model={data[keyword].value} style="width: 120px">
                            {options}
                        </el-select>;
                    }
                } else {
                    return '';
                }
            }
            // 如果是添加自定义属性
            return data[keyword].type !== '4' && data[keyword].type !== '5' ? this.valueTypeMap[data[keyword].type](data[keyword]) : '';
        },
        getKey(data, keyword) {
            if (this.addType) {
                // 添加自带属性
                let keys = []
                // 获取自带的key并且过滤已经得到的设置的属性
                keys = Object.keys(this.defaultKeyValue[this.rootWord] || {}).filter(y => !this.activeData[this.rootWord][y])
                // 取第一个作为默认值
                if (!data[keyword].key) data[keyword].key = keys[0]
                // 将默认值改成下拉菜单设置
                const options = keys.map((x, i) => <el-option key={i} label={(this.defaultKeyValue[this.rootWord] || {})[x].label} value={x}></el-option>);
                // 数组类不包含key 的设置
                return <el-select size="mini" v-model={data[keyword].key} style="width: 120px" onChange={e => this.changeDefaultOptions(e, keyword, data)}>
                    {options}
                </el-select>;
            } else {
                // 添加自定义属性
                const options = this.options.map((x, i) => <el-option key={i} label={x.label} value={x.value}></el-option>);
                return <span>
                    {/* 自定义属性的key默认为输入框 */}
                    <el-input size="mini" v-model={data[keyword].key} style="width: 60px" />&nbsp;
                    {/* 类型改变时调用 */}
                    <el-select size="mini" v-model={data[keyword].type} style="width: 80px" onChange={e => this.changeOptions(e, keyword, data)}>
                        {options}
                    </el-select>
                </span>;
            }
        },
        getList(key, data = this.activeData) {
            let list = [];
            if (data) {
                // 获取属性列表，如果是对象类型则转换成对象数组 类似children对象直接导入
                if (typeof data[key] === 'object') {
                    for (const i in data[key]) {
                        list.push(i);
                    }
                } else {
                    list.push(data[key]);
                }
            }
            return list;
        },
        changeOptions(e, key, data) {
            data[key].value = this.valueTypeInitial[e];
            if (['4', '5'].includes(e)) {
                // 数组对象类属性 直接调出编辑器
                this.showObjectPanel = true;
                // 临时保存储存的key
                this.tempAttrName = data[key].key
                this.analysisProperty('att', this.activeData, this.rootWord, e)
            }
        },
        getType(e) {
            if (typeof e === 'string') return 1;
            if (typeof e === 'number') return 2;
            if (typeof e === 'boolean') return 3;
            if (Array.isArray(e)) return 5;
            return 4;
        },
        changeDefaultOptions(e, key, data) {
            data[key].key = e;
            data[key].type = this.getType(e);
            data[key].value = this.valueTypeInitial[data[key].type];
        },
        addProperty(data, key, type, rootName, addType) {
            // addType 1 添加默认属性 无为自定义属性
            this.addType = !!addType;
            // type 不存在 查看原属性类型，object则为object 否则为数组/字符串
            if (!type) type = typeof this.activeData[key] === 'object' ? '4' : Array.isArray(this.activeData[key]) ? '5' : '1';
            if (type === '4') {
                // 对象
                this.$set(data, key, {
                // children做特殊处理
                    key: rootName && this.initialType === 'array' ? this.activeData[this.rootWord].length || 0 : '',
                    type: '1',
                    value: ''
                });
            } else if (type === '5') {
                let arr = data[key];
                if (!arr) {
                    arr = [];
                } else {
                    arr.push({
                        key: '',
                        type: '1',
                        value: ''
                    });
                }
                this.$set(data, key, arr);
            } else {
                this.$set(data, key, '');
            }
        },
        saveProperty(key, data = this.activeData) {
            if (!(key in data)) this.$set(data, key, {});
            // 修改对象非数组、对象的情况
            if (this.modifyItem[key].type !== '4' && this.modifyItem[key].type !== '5') {
                // 简单属性直接保存
                let value = this.modifyItem[key].value;
                if (['on', 'nativeOn', 'methods', 'computed', 'scopedSlots', 'watch'].includes(key)) {
                    value = stringToFunc(this.modifyItem[key].value);
                }
                // todo 属性改变需要关联的输入框类型一起改变
                if (this.modifyItem[key].type === '2') value = +value;
                if (this.modifyItem[key].type === '3') value = !!value;
                this.$set(this.activeData[key], this.modifyItem[key].key, value);
            } else if(['4', '5'].includes(this.modifyItem[key].type)) {
                this.$set(this.activeData[key], this.tempAttrName, this.tempAttrValue);
            }
            this.$delete(this.modifyItem, key);
        },
        delModifyItem(data, key) {
            if (data.type) {
                if (data.type === '4') {
                    data.value = {};
                } else if (data.type === '5') {
                    data.value = [];
                } else {
                    this.$delete(data, key);
                }
            } else {
                this.$delete(data, key);
            }
        },
        delKey(key, property) {
            if (this.activeData[property][key].props && this.activeData[property][key].props.rawId) {
                const id = this.activeData[property][key].props.rawId
                if (this.containerInject[id]) {
                    this.$delete(this.containerInject, id)
                }
            }
            this.$delete(this.activeData[property], key);
        },
        analysisProperty(type, data, property, subProperty) {
            this.$emit('changeComponentPanel', type, data, property, subProperty);
        },
        saveModuleCode(data, property, subProperty) {
            this.$emit('saveModuleCode', data[property][subProperty])
        }
    }
};
</script>