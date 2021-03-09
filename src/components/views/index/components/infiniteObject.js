import { getDefaultProps, getRawId } from '../../../schema/util';
import {
    stringToFunc
} from '../../../utils/db';
import { defaultKV, htmlNode, defaultNode } from './default';
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
            // modifyItem: {},
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
                '4': e => (
                    <el-form-item label-width="40px">
                        <el-form-item>
                            {this.getValue(e, 'value')}
                        </el-form-item>
                        {e.value.hasOwnProperty('key') ? <el-button  size="mini" onClick={() => this.delModifyItem(e, 'value')}>取消</el-button> : <el-button onClick={() => this.addProperty(e, 'value', '4')}>新建</el-button>}
                    </el-form-item>
                ),
                '5': e => (
                    <el-form-item label-width="40px">
                        <el-form-item>
                            {e.value.length ? e.value.map((x, i) => this.getValue(e.value, i)) : ''}
                        </el-form-item>
                        {
                            !e.value.length
                                ? <el-button  size="mini" onClick={() => this.addProperty(e, 'value', '5')}>创建</el-button>
                                : e.value.hasOwnProperty('key') ? <el-button size="mini" onClick={() => this.delModifyItem(e, 'value')}>取消</el-button> : <el-button onClick={() => this.addProperty(e, 'value', '5')}>新增</el-button>
                        }
                    </el-form-item>
                )
            },
            detailValueTypeMap: {
                '1': e => <span>{e.value}</span>,
                '2': e => <span>{e.value}</span>,
                '3': e => <span>{e.value}</span>,
                '4': e => (
                    <el-form-item label-width="40px"  size="mini">
                        <el-form-item>
                            {this.getTrueValue(e, 'value')}
                        </el-form-item>
                    </el-form-item>
                ),
                '5': e => (
                    <el-form-item label-width="40px">
                        <el-form-item>
                            {e.value.length ? e.value.map((x, i) => this.getTrueValue(e.value, i)) : ''}
                        </el-form-item>
                    </el-form-item>
                )
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
        // 属性-复杂对象详情
        // attrDetail: {
        //     type: Object | Array,
        //     default: null
        // }
    },
    computed: {
        defaultKeyValue() {
            return defaultKV[this.name] || {};
        }
    },
    watch: {
        // attrDetail: {
        //     handler(val, old) {
        //         console.log(val)
        //         console.log(old)
        //     },
        //     deep: true
        // }
    },
    render() {
        const modifyItem = this.modifyItem;
        const propertyList = this.getList(this.rootWord);
        const rootWord = this.rootWord;
        const funStrComSpan = (a, b, c) => {
            const val = a[b][c]
            if (val.name) {
                // 为组件
                return (<span class="value-string">
                    <span onClick={() => this.analysisProperty('turn', a, b, c)}>{val.name}</span>
                    <span onClick={() => this.analysisProperty('code', a, b, c)} style="border-radius: 2px;margin-left: 8px;border:1px solid #409eff;display:inline-block;line-height:14px;font-size:12px;color:rgb(113 177 243)">查看</span>
                </span>)
            } else {
                // 函数字符串渲染
                return (<span onClick={() => this.analysisProperty('code', a, b, c)} class="value-string">
                {JSON.stringify(val)}
            </span>)
            }
        }
        const strNumBoolSpan = (a, b, c) => {
            const val = a[b][c]
            if (typeof val === 'string') {
                const insertAttrs = (this.defaultKeyValue[this.rootWord] || {})[c]
                if (insertAttrs && insertAttrs.value.length) {
                    // 属性为内置属性
                    const defaultValue = insertAttrs.value
                    const options = defaultValue.map((x, i) => {
                            return <el-option key={i} label={x} value={x}></el-option>
                    });
                    return <el-select size="mini" v-model={a[b][c]} style="width: 120px">
                    {options}
                </el-select>;
                } else {
                    return (<el-input  size="mini" v-model={a[b][c]} placeholder="请输入字段名（v-model）s" style="width: 165px"/>)
                }
            } else if (typeof val === 'number') {
                return (<el-input-number size="mini" v-model={a[b][c]} placeholder="请输入字段名（v-model）s" style="width: 165px"/>)
            } else {
                return (
                    <el-radio-group v-model={a[b][c]}  size="mini">
                        <el-radio label={true}>true</el-radio>
                        <el-radio label={false}>false</el-radio>
                    </el-radio-group>
                )
            }
        }
        const otherSpan = (a, b, c) => {
            const val = a[b][c]
            return <span onClick={() => this.analysisProperty('code', a, b, c)} class="value-string">{val ? val.toString() : a[b].toString()}</span>
        }
        return (<div>
            {propertyList.map(x => {
                return (<div style="padding: 5px 0 5px 40px">
                    <span>
                        {['string', 'number', 'boolean', 'function'].includes(typeof this.activeData[rootWord]) ? '' : this.getAlias(this.activeData, rootWord, x)}
                    </span>
                    <span>
                        {
                            ['string', 'number', 'boolean'].includes(typeof this.activeData[rootWord]) ? ''
                                :
                                <span className="el-icon-anti-tag-fill" onClick={() => this.delKey(x, rootWord)} style="margin-left: 5px;color: rgb(241 23 23);font-size: 15px">x&nbsp;&nbsp;</span>
                        }
                        {['string', 'number', 'boolean'].includes(typeof this.activeData[rootWord]) && this.initialTypeShow === 'input' ? <el-input  size="mini" v-model={this.activeData[rootWord]} placeholder="请输入字段名（v-model）" style="width: 165px"/>
                            : ['array', 'object'].includes(typeof this.activeData[rootWord][x])
                            // 值为函数字符串/组件
                                ? funStrComSpan(this.activeData, rootWord, x)
                                // 值为字符串/数字/bool选项
                                : this.initialTypeShow === 'input'
                                    ? strNumBoolSpan(this.activeData, rootWord, x)
                                    // 值为其他'renderFun', 'rawId', 'on', 'nativeOn', 'methods'
                                    : otherSpan(this.activeData, rootWord, x)
                        }
                    </span>
                </div>)
            })}
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
            /* eslint-disable */
            return data.hasOwnProperty(keyword) && data[keyword].type ? (<div><el-form-item label-width="0px">
                {this.getKey(data, keyword)}
                &nbsp;: {this.getDefaultValue(data, keyword)}
            </el-form-item>
            {data[keyword].type === '4' || data[keyword].type === '5' ? this.valueTypeMap[data[keyword].type](data[keyword]) : ''}
            </div>) : '';
            /* eslint-enable */
        },
        getDefaultValue(data, keyword) {
            // 如果是添加预置属性
            if (this.addType) {
                if (data[keyword].key) {
                    /* eslint-disable */
                    let defaultValue = []
                    if (this.rootWord === 'children') {
                        // 如果像数组一样可以添加重复属性 则取第一个下拉选项
                        defaultValue = this.defaultKeyValue[this.rootWord][0].value
                    } else {
                        defaultValue = this.defaultKeyValue[this.rootWord][data[keyword].key].value
                    }
                    let valueType = 'select'
                    console.log(defaultValue)
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
                    /* eslint-enable */
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
                /* eslint-disable */
                let keys = []
                keys = Object.keys(this.defaultKeyValue[this.rootWord] || {}).filter(y => !this.activeData[this.rootWord][y])
                if (!data[keyword].key) data[keyword].key = keys[0]
                const options = keys.map((x, i) => <el-option key={i} label={(this.defaultKeyValue[this.rootWord] || {})[x].label} value={x}></el-option>);
                if (this.rootWord !== 'children') {
                    return <el-select size="mini" v-model={data[keyword].key} style="width: 120px" onChange={e => this.changeDefaultOptions(e, keyword, data)}>
                    {options}
                </el-select>;
                } else {
                    return <el-input size="mini" v-model={data[keyword].key} style="width: 60px" />
                }
                /* eslint-enable */
            } else {
                // 添加自定义属性
                /* eslint-disable */
                const options = this.options.map((x, i) => <el-option key={i} label={x.label} value={x.value}></el-option>);
                return <span>
                    <el-input size="mini" v-model={data[keyword].key} style="width: 60px" />&nbsp;
                    <el-select size="mini" v-model={data[keyword].type} style="width: 80px" onChange={e => this.changeOptions(e, keyword, data)}>
                        {options}
                    </el-select>
                </span>;
                /* eslint-enable */
            }
        },
        getList(key, data = this.activeData) {
            let list = [];
            if (data) {
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
            // data[key].type = e;
            data[key].value = e === '5' ? [] : this.valueTypeInitial[e];
            if (['4', '5'].includes(e)) {
                this.showObjectPanel = true;
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
            data[key].value = data[key].type === '5' ? [] : this.valueTypeInitial[data[key].type];
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
            if (this.modifyItem[key].type !== '4' && this.modifyItem[key].type !== '5') {
                // 如果输入的是容器组件。则增加此组件的相关配置
                if (this.$root.$options.components[this.modifyItem[key].value] && this.modifyItem[key].value.startsWith('o')) {
                    const comOptions = this.$root.$options.components[this.modifyItem[key].value].options;
                    // 填充初始props属性
                    const config = {
                        name: this.modifyItem[key].value,
                        props: getDefaultProps(comOptions)
                    };
                    if (!config.props.rawId) {
                        config.props.rawId = getRawId(config.name);
                        if (!this.containerInject[config.props.rawId]) this.containerInject[config.props.rawId] = {};
                    }
                    this.$set(this.activeData[key], this.modifyItem[key].key, config);
                } else if (htmlNode.includes(this.modifyItem[key].value) || this.$root.$options.components[this.modifyItem[key].value]) {
                    // 如果输入的是节点html
                    const commonConfig = {
                        style: {},
                        class: {},
                        attrMap: {},
                        attrs: {},
                        children: [],
                        on: {},
                        renderFun: x => x
                    }
                    const config = {
                        name: this.modifyItem[key].value,
                        props: defaultNode[this.modifyItem[key].value] || commonConfig,
                        ...(defaultNode[this.modifyItem[key].value] || commonConfig)
                    };
                    // 将标签元素的其他属性保持和props属性内存地址相同，用来适应组件配置数据
                    // for (let i in config.props) {
                    //     config[i] = config.props[i];
                    // }
                    config.props.renderFun = config.renderFun = stringToFunc(config.props.renderFun.toString().replace('_this', 'this'))
                    for(let i in config.props.on) {
                        config.props.on[i] = stringToFunc(config.props.on[i].toString().replace('_this', 'this'))
                    }
                    for(let i in config.on) {
                        config.on[i] = stringToFunc(config.on[i].toString().replace('_this', 'this'))
                    }
                    for(let i in config.props.nativeOn) {
                        config.props.nativeOn[i] = stringToFunc(config.props.nativeOn[i].toString().replace('_this', 'this'))
                    }
                    for(let i in config.nativeOn) {
                        config.nativeOn[i] = stringToFunc(config.nativeOn[i].toString().replace('_this', 'this'))
                    }
                    config.props.subRawId = getRawId(config.name);
                    this.$set(this.activeData[key], this.modifyItem[key].key, config);
                } else {
                // 简单属性直接保存
                    let value = this.modifyItem[key].value;
                    if (key === 'on' || key === 'nativeOn' || key === 'methods') {
                        value = stringToFunc(this.modifyItem[key].value);
                    }
                    // todo 属性改变需要关联的输入框类型一起改变
                    if (this.modifyItem[key].type === '2') value = +value;
                    if (this.modifyItem[key].type === '3') value = !!value;
                    this.$set(this.activeData[key], this.modifyItem[key].key, value);
                }
            } else if(['4', '5'].includes(this.modifyItem[key].type)) {
                this.$set(this.activeData[key], this.tempAttrName, this.tempAttrValue);
            } else {
                // 复杂属性需要转换key、value变为对象 这段省略也不删
                // const rootValue = this.modifyItem[key].value;
                // const transformValue = this.transformKeyValue(rootValue, this.modifyItem[key].type);
                // this.$set(this.activeData[key], this.modifyItem[key].key, transformValue);
            }
            this.$delete(this.modifyItem, key);
            // this.modifyItem = {};
        },
        // key-value对象转化为正常对象
        transformKeyValue(keyVal, type) {
            if (type === '4') {
                let afterVal = {};
                afterVal[keyVal.key] = this.transformKeyValue(keyVal.value, keyVal.type);
                return afterVal;
            } else if (type === '5') {
                let afterVal = [];
                for (const i of keyVal) {
                    if (i.type !== '5' && i.type !== '4') {
                        afterVal.push(this.transformKeyValue(i.value, i.type));
                    } else if (i.type === '4') {
                        afterVal.push({
                            [i.key]: this.transformKeyValue(i.value, i.type)
                        });
                    }
                }
                return afterVal;
            } else {
                return keyVal;
            }
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
                // if (data[key].type === '4') {
                //     data[key].value = {}
                // } else if (data[key].type === '5') {
                //     data[key].value = []
                // } else {
                this.$delete(data, key);
                // }
            }
        },
        delKey(key, property) {
            if (this.activeData[property][key].props && this.activeData[property][key].props.rawId) {
                const id = this.activeData[property][key].props.rawId
                if (this.containerInject[id]) {
                    this.$delete(this.containerInject, id)
                    console.log(this.containerInject)
                }
            }
            this.$delete(this.activeData[property], key);
        },
        analysisProperty(type, data, property, subProperty) {
            // if (['renderFun', 'on', 'nativeOn'].includes(property) || x && x.name) {
            this.$emit('changeComponentPanel', type, data, property, subProperty);
            // }
        }
    }
};