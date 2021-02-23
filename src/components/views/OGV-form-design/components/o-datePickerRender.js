// import { analysisRenderConfig, analysisDataRender } from '../../../schema/util';
import { render, computed } from '../../../schema/api';
/* eslint-disable */
Date.prototype.Format = function (fmt) {
    var o = {
        'M+': this.getMonth() + 1, // 月份
        'd+': this.getDate(), // 日
        'H+': this.getHours(), // 小时
        'm+': this.getMinutes(), // 分
        's+': this.getSeconds(), // 秒
        'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
        'S': this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))); }
    return fmt;
};
/* eslint-enable */
let base = {
    data() {
        return {
            val: '',
            style: {
                border: '1px solid #e4e7ed'
            }
        };
    },
    props: {
        form: {
            type: Object,
            default: () => {
                return {
                    'a': 12
                };
            }
        },
        keyword: {
            type: String,
            default: 'a'
        },
        value: {
            type: String,
            default: new Date()
        },
        styles: {
            type: Object,
            default: () => {
                return {
                };
            }
        },
        attrs: {
            type: Object,
            default: () => {
                return {
                    placeholder: '选择日期',
                    type: 'date'
                };
            }
        },
        rawId: {
            type: String,
            default: ''
        }
    },
    inject: {
        env: {
            default: 'prod'
        },
        containerInject: {
            default: () => {}
        }
    },
    render,
    methods: {
        change(event) {
            // this.$emit('oInput', event)
            this.form[this.keyword] = this.val = event;
            this.$root.$emit('DEAL_CHOOSE', this);
        },
        input(event) {
            this.$emit('oInput', event);
            /* eslint-disable */
            this.form[this.keyword] = this.val = event.Format('yyyy-MM-dd HH:mm:ss');
            /* eslint-enable */
            this.$root.$emit('DEAL_CHOOSE', this);
        }
    },
    computed: {
        ...computed,
        configComponents() {
            return {
                children: [{
                    // 为了展示边框选中态特意加的
                    name: 'span',
                    attr: this.attrs,
                    on: {
                        click: e => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.$root.$emit('DEAL_CHOOSE', this);
                        }
                    },
                    children: [{
                        name: 'el-date-picker',
                        attrs: Object.assign({
                            size: 'small'
                        }, this.attrs),
                        style: Object.assign(this.style, this.styles),
                        ref: 'oDatePicker',
                        on: {
                            change: this.change,
                            input: this.input
                        },
                        props: {
                            value: this.val,
                            rawId: this.rawId
                        }
                    }]
                }]
            };
        }
    },
    created() {
        this.val = this.value || (this.keyword && this.form[this.keyword]) || this.attrs.value || '';
        console.log('timepicker,fsdf', this.val);
    },
    mounted() {
    }
};
export default base;
