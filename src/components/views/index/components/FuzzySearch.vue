<template>
    <el-autocomplete :fetch-suggestions="fetchSuggestions" :value-key="getShowValueKey" v-bind="$attrs" v-on="$listeners" v-if="type==='input'"/>
    <el-select
    v-else
    filterable
    remote
    reserve-keyword
    :remote-method="fetchSuggestions"
    v-bind="$attrs"
    @change="changeEvent"
    v-on="$listeners"
    @clear="clear"
    :value-key="$attrs['value-key'] || config.valueKey"
    :loading="loading">
    <el-option
      v-for="(item, index) in optionList"
      v-if="$attrs['multiple-limit'] !== 1 || $attrs['value'] && $attrs['value'].length === 0"
      :key="index"
      :label="optionTextFunc ? optionTextFunc(item) : showLabelText(item)"
      :value="item">
    </el-option>
  </el-select>
</template>

<script>
// import { seasonSuggestAllUrl, filmOccupationUrl } from '@/config/ajaxUrl/seasonUrl';
export default {
    name: 'FuzzySearch',
    props: {
        type: {
            type: String,
            default: 'input'
        },
        url: {
            type: String
        },
        keywordKey: {
            type: String,
            default: 'keyword'
        },
        params: {
            type: Object,
            default: () => {}
        },
        searchType: {
            type: String
        },
        // 列表文本展示函数
        optionTextFunc: {
            type: Function | Boolean,
            default: false
        },
        loadFirst: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            kw: null,
            optionList: [],
            loading: false
        };
    },
    computed: {
        // 输入选项展示的文字对应的变量名
        getShowValueKey() {
            // 优先传入的
            if (this.$attrs['value-key']) return this.$attrs['value-key'];
            return this.config.valueKey || 'value';
        },
        config() {
            const configMap = {
                // season搜索
                node: {
                    url: "http://uat-bangumi-mng.bilibili.co/api/node/searchNode",
                    // 合并params
                    params: this.mergeParams({
                        nodeName: this.kw || '',
                        type: 0
                    }
                    ),
                    valueKey: 'node_name', // 显示的选项内容对应的变量名
                    callback: (res, cb) => { // 拿到接口返回值回调函数，cb用于返回选项列表
                        cb(res.data || []);
                    }
                },
            };
            return configMap[this.searchType] || {};
        }
    },
    methods: {
        changeEvent() {
            this.$children[0].query = '';
        },
        mergeParams(config = {}) {
            return Object.assign(config, this.params);
        },
        clear() {
            if (this.type === 'select') {
                this.optionList = [];
            }
        },
        fetchSuggestions(kw, cb) {
            const { value } = this.$attrs;
            this.kw = kw || '';
            if (this.type === 'select') { // 如果用户选择的是select模式，则重写cb函数
                this.loading = true;
                cb = (data) => {
                    this.loading = false;
                    this.optionList = data;
                };
            }
            const emptyResult = [];
            const req = this.url ? this.getDefaultConfig() : this.config; // 如果传了url就采用url模式
            return req && this.$axios(req)
                .then((res) => {
                    if (res.code === 0) {
                        // 如果监听了这个事件
                        if (this.$listeners['fetchCallBack']) {
                            // 如果需要获取接口返回的值做特殊处理
                            this.$emit('fetchCallBack', res, cb);
                        } else {
                            this.config.callback(res, cb);
                        }
                    } else {
                        cb(emptyResult);
                    }
                })
                .catch(() => {
                    cb(emptyResult);
                });
        },
        getDefaultConfig() {
            let url = this.url || '';
            let params = this.params || {};
            const targetStr = url.split('?')[1] || '';
            const urlToParams = this.kvpToParams(targetStr);
            params = Object.assign(params, urlToParams);
            params[this.keywordKey] = this.kw || ''; // 添加关键字参数
            return {
                url,
                params
            };
        },
        showLabelText(dataItem) {
            if (typeof dataItem === 'string') return dataItem;
            const valueKey = this.$attrs['value-key'] || this.config.valueKey || 'label';
            return dataItem[valueKey];
        },
        kvpToParams(str) {
            let temp = {};
            if (str && typeof str === 'string') {
                let arr = str.split('&');
                arr.forEach(item => {
                    if (item) {
                        let itemSplit = item.split('=');
                        let value = decodeURIComponent(itemSplit[1]);
                        if (value.indexOf('{') > -1) value = JSON.parse(value);
                        temp[itemSplit[0]] = value;
                    }
                });
            }
            return temp;
        }
    },
    mounted() {
        if (this.$attrs.defaultOptions) {
            this.optionList = this.$attrs.defaultOptions;
        }
        // 对于下拉选项模糊搜索方式有时候需要预先加载一次选项
        if (this.type === 'select' && (this.loadFirst || this.config.loadFirst)) {
            this.fetchSuggestions();
        }
    }
};
</script>
