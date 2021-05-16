import { getDefaultProps, getRawId } from '../../../schema/util';
import {
    stringToFunc
} from '../../../schema/util';
import { deepClone } from '../../../utils/index';
import {
    getDrawingList,
} from '../../../utils/db';
import { defaultKV } from '../default/config';
import { allHtmlNode } from '../default/index';
import { defaultNode } from '../default/structure';

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
        }, {
            value: '6',
            label: '数据字符串'
        }, {
            value: '7',
            label: 'function'
        }];
        return {
            // 编辑对象
            options,
            optionsContain: {
                methods: [ '1', '7' ],
                on: [ '1','7' ],
                nativeOn: [ '1','7' ],
                methods: [ '1','7' ],
                // scopedSlots: [ '7' ],
                watch: [ '1','7' ]
            },
            valueTypeInitial: {
                '1': '',
                '2': 0,
                '3': false,
                '4': {},
                '5': [],
                '6': '',
                '7': function(x) { return x }
            },
            valueTypeMap: {
                '1': e => <el-input size="small" v-model={e.value} style="width: 100px" />,
                '2': e => <el-input-number size="small" v-model={e.value} style="width: 100px" />,
                '3': e => <el-radio-group v-model={e.value}  size="mini">
                              <el-radio label={true}>true</el-radio>
                              <el-radio label={false}>false</el-radio>
                          </el-radio-group>,
                '4': e => '',
                '5': e => '',
                '6': e => <el-input size="small" v-model={e.value} style="width: 100px" />,
                '7': e => ''
            },
            // 默认是自定义属性
            addType: false,
            // 展示对象编辑panel
            showObjectPanel: false,
            tempAttrName: '',
            tempAttrValue: ''
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
        }
    },
    watch: {},
    render() {
        const modifyItem = this.modifyItem;
        // 获取渲染属性列表
        const propertyList = this.getList(this.rootWord);
        // 根属性
        const rootWord = this.rootWord;
        // 函数字符串、组件（值）渲染
        const funStrComSpan = (a, b, c) => {
            const val = a[b][c]
            if (val.name) {
                // 为组件
                return (<span class="value-string">
                    <span onClick={() => this.analysisProperty('turn', a, b, c)}>{val.name}</span>
                    <span onClick={() => this.analysisProperty('code', a, b, c)} style="border-radius: 2px;margin-left: 8px;border:1px solid #409eff;display:inline-block;line-height:14px;font-size:12px;color:rgb(113 177 243)">查看</span>
                    <span onClick={() => this.saveModuleCode(a, b, c)} style="border-radius: 2px;margin-left: 8px;border:1px solid #409eff;display:inline-block;line-height:14px;font-size:12px;color:rgb(113 177 243)">存储</span>
                    <span onClick={() => this.copyModuleCode(a, b, c)} style="border-radius: 2px;margin-left: 8px;border:1px solid #409eff;display:inline-block;line-height:14px;font-size:12px;color:rgb(113 177 243)">copy</span>
                    {+c ? <span onClick={() => this.upModuleCode(a, b, c)} style="border-radius: 2px;margin-left: 8px;border:1px solid #409eff;display:inline-block;line-height:14px;font-size:12px;color:rgb(113 177 243)">up</span>: ''}
                    {+c !== a[b].length - 1 ? <span onClick={() => this.downModuleCode(a, b, c)} style="border-radius: 2px;margin-left: 8px;border:1px solid #409eff;display:inline-block;line-height:14px;font-size:12px;color:rgb(113 177 243)">down</span>: '' }
                </span>)
            } else {
                console.log(JSON.stringify(val))
                // 函数字符串渲染，点击查看函数
                return (<span onClick={() => this.analysisProperty('code', a, b, c)} class="value-string">
                {JSON.stringify(val)}
                {/* <el-tag>function</el-tag> */}
            </span>)
            }
        }
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
                    return (<el-input  size="small" v-model={a[b][c]} placeholder="请输入字段名（v-model）s" style="width: 165px"/>)
                }
            } else if (typeof val === 'number') {
                // 数字类型的数值填写
                return (<el-input-number size="small" v-model={a[b][c]} placeholder="请输入字段名（v-model）s" style="width: 165px"/>)
            } else {
                // 布尔值的数值填写
                return (
                    <el-radio-group v-model={a[b][c]}  size="mini">
                        <el-radio label={true}>true</el-radio>
                        <el-radio label={false}>false</el-radio>
                    </el-radio-group>
                )
            }
        }
        // 其他渲染
        const otherSpan = (a, b, c) => {
            const val = a[b][c]
            let childVal
            if (val) {
                if (typeof val === 'function') {
                    childVal = <el-tag size="small">function</el-tag>
                    // childVal = val.toString()
                } else {
                    childVal = val.toString()
                }
            } else {
                childVal = a[b].toString()
            }
            return <span onClick={() => this.analysisProperty('code', a, b, c)} class="value-string">{childVal}</span>
        }
        return (<div>
            {propertyList.map(x => {
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
                        {['string', 'number', 'boolean'].includes(typeof this.activeData[rootWord]) && this.initialTypeShow === 'input' ? <el-input  size="small" v-model={this.activeData[rootWord]} placeholder="请输入字段名（v-model）" style="width: 165px"/>
                            : ['array', 'object'].includes(typeof this.activeData[rootWord][x])
                            // 值为函数字符串/组件
                                ? funStrComSpan(this.activeData, rootWord, x)
                                // 值为字符串/数字/bool选项
                                : this.initialTypeShow === 'input'
                                    ? strNumBoolSpan(this.activeData, rootWord, x)
                                    // 值为其他'renderFun', 'rawId', 'on', 'nativeOn', 'methods', 'computed'
                                    : otherSpan(this.activeData, rootWord, x)
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
                {/* 获取新增的key */}
                {this.getKey(data, keyword)}
                {/* 获取新增的值 */}
                &nbsp;: {this.getDefaultValue(data, keyword)}
            </el-form-item>
            </div>) : '';
        },
        getDefaultValue(data, keyword) {
            // 如果是添加预置属性
            if (this.addType) {
                if (data[keyword].key) {
                    let defaultValue = []
                    if (this.rootWord === 'children' || this.rootWord === 'directives') {
                        // 如果像数组一样可以添加重复属性 则取第一个下拉选项
                        defaultValue = this.defaultKeyValue[this.rootWord][0].value
                    } else {
                        defaultValue = this.defaultKeyValue[this.rootWord][data[keyword].key].value
                    }
                    let valueType = 'select'
                    const options = defaultValue.map((x, i, arr) => {
                        if (typeof x === 'string') {
                            return <el-option key={i} label={x} value={x}></el-option>
                        } else if (typeof x === 'boolean') {
                            valueType = 'radio'
                            return <el-radio label={x}>{x}</el-radio>
                        } else if (typeof x === 'number') {
                            // todu 数字
                            valueType = 'number'
                        }
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
                    } else if(valueType === 'radio') {
                        // 下拉模式为单选
                        return <el-radio-group v-model={data[keyword].value}  size="mini">
                        {options}
                    </el-radio-group>
                    } else if(valueType === 'number') {
                        // todo 为数字
                        return <el-input-number size="mini" v-model={data[keyword].value} placeholder="请输入字段名（v-model）s" style="width: 165px"/>
                    }
                } else {
                    return '';
                }
            }
            // 如果是添加自定义属性
            return !['4', '5', '7'].includes(data[keyword].type) ? this.valueTypeMap[data[keyword].type](data[keyword]) : '';
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
                if (this.rootWord !== 'children' && this.rootWord !== 'directives') {
                    // 数组类不包含key 的设置
                    return <el-select size="mini" v-model={data[keyword].key} style="width: 120px" onChange={e => this.changeDefaultOptions(e, keyword, data)}>
                    {options}
                </el-select>;
                } else {
                    // 数组类的key为默认索引
                    return <el-input size="small" v-model={data[keyword].key} style="width: 60px" />
                }
            } else {
                // 添加自定义属性
                console.log('add custom')
                const optionLimit = this.optionsContain[this.rootWord]
                // if (optionLimit) data[keyword].type = optionLimit[0]
                const options = this.options.filter(x => !optionLimit || optionLimit.includes(x.value)).map((x, i) => <el-option key={i} label={x.label} value={x.value}></el-option>);
                return <span>
                    {/* 自定义属性的key默认为输入框 */}
                    <el-input size="small" v-model={data[keyword].key} style="width: 60px" />&nbsp;
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
            console.log(e)
            data[key].value = this.valueTypeInitial[e];
            if (['4', '5', '7'].includes(e)) {
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
            if (!['4', '5', '6', '7'].includes(this.modifyItem[key].type)) {
                // 如果输入的是容器组件名字。则增加容器组件的相关配置
                if (this.$root.$options.components[this.modifyItem[key].value] && this.modifyItem[key].value.startsWith('o')) {
                    const comOptions = this.$root.$options.components[this.modifyItem[key].value].options;
                    // 填充初始props属性
                    const config = {
                        name: this.modifyItem[key].value,
                        props: getDefaultProps(comOptions)
                    };
                    // 生成rawId
                    config.props.rawId = getRawId(config.name);
                    
                    this.$set(this.activeData[key], this.modifyItem[key].key, config);
                } else if (allHtmlNode.includes(this.modifyItem[key].value) || this.$root.$options.components[this.modifyItem[key].value]) {
                    // 如果输入的是节点html/全局注册组件
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
                    if (!allHtmlNode.includes(this.modifyItem[key].value)) commonConfig.nativeOn = {}
                    let config = {
                        name: this.modifyItem[key].value,
                        ...(deepClone(defaultNode[this.modifyItem[key].value]) || commonConfig),
                        props: {}
                    };
                    // 对函数字符串做处理
                    config.renderFun = stringToFunc(config.renderFun.toString().replace('_this', 'this'))
                    for(let i in config.on) {
                        config.on[i] = stringToFunc(config.on[i].toString().replace('_this', 'this'))
                    }
                    for(let i in config.nativeOn) {
                        config.nativeOn[i] = stringToFunc(config.nativeOn[i].toString().replace('_this', 'this'))
                    }
                    for(let i in config.scopedSlots) {
                        config.scopedSlots[i] = stringToFunc(config.scopedSlots[i].toString().replace('_this', 'this'))
                    }
                    config.props.subRawId = getRawId(config.name);
                    console.log(this.modifyItem[key].key)
                    this.$set(this.activeData[key], this.modifyItem[key].key, config);
                    config = null
                } else {
                // 简单属性直接保存
                    let value = this.modifyItem[key].value;
                    if (['on', 'nativeOn', 'methods', 'computed', 'scopedSlots', 'watch'].includes(key)) {
                        if (!value.startsWith('function')) value = 'function () {' + value + '}'
                        value = stringToFunc(value);
                    }
                    // todo 属性改变需要关联的输入框类型一起改变
                    if (this.modifyItem[key].type === '2') value = +value;
                    if (this.modifyItem[key].type === '3') value = !!value;
                    this.$set(this.activeData[key], this.modifyItem[key].key, value);
                }
            } else if(['4', '5', '7'].includes(this.modifyItem[key].type)) {
                console.log( this.tempAttrName, ' this.tempAttrName')
                this.$set(this.activeData[key], this.tempAttrName, this.tempAttrValue);
            } else if (['6'].includes(this.modifyItem[key].type)) {
                const obg = getDrawingList('[' + this.modifyItem[key].value + ']')
                if (this.activeData.children.length <= this.modifyItem[key].key ) {
                    this.activeData.children.push(obg[0])
                } else {
                    this.activeData.children.splice(this.modifyItem[key].key, 0, obg[0] )
                }
                
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
            console.log(data[property][subProperty])
            this.$emit('saveModuleCode', data[property][subProperty])
        },
        upModuleCode(data, property, subProperty) {
            // console.log(data)
            // console.log(property)
            // console.log(subProperty)
            const fieldData = data[property]
            if(subProperty != 0){
                fieldData[subProperty] = fieldData.splice(subProperty-1, 1, fieldData[subProperty])[0];
            } else {
                fieldData.push(fieldData.shift());
            }
        },
        downModuleCode(data, property, subProperty) {
            const fieldData = data[property]
            if(subProperty != fieldData.length-1){
                fieldData[subProperty] = fieldData.splice(+subProperty + 1, 1, fieldData[subProperty])[0];
                console.log(fieldData[subProperty])
            }else{
                this.$message.error('已经达到最底')
                // fieldData.unshift(fieldData.splice(subProperty, 1 )[0]);
            }
        },

        copyModuleCode(data, property, subProperty) {
            const value = JSON.stringify(data[property][subProperty], function(key, value) {
                if (typeof value === 'function') {
                    return value.toString();
                } else {
                    return value;
                }
            });
            let transfer = document.createElement('input');
            document.getElementsByClassName('drawing-board')[0].appendChild(transfer);
            transfer.value = value;
            transfer.focus();
            transfer.select();
            document.execCommand('copy');
            transfer.blur();
            document.getElementsByClassName('drawing-board')[0].removeChild(transfer);
            this.$message.success('复制成功');
            this.$emit('getCopyVal', value)
        }
    }
};