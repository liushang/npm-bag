// import { analysisRenderConfig, analysisDataRender } from '../../../schema/util';
import { render, computed } from '../../../schema/api';
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
            default: ''
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
            default: () => {}
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
        updateMsg() {
            console.log('updateMsg');
            console.log(this.configData);
        },
        change(event) {
            // this.$emit('oInput', event)
            console.log('我是switch');
            console.log(event);
            this.form[this.keyword] = this.val = event;
            this.$root.$emit('DEAL_CHOOSE', this);
        }
    },
    computed: {
        ...computed,
        configComponents() {
            let children = [{
                name: 'el-switch',
                attrs: Object.assign({
                    size: 'small'
                }, this.attrs),
                style: Object.assign(this.style, this.styles),
                ref: 'oSwitch',
                on: {
                    change: this.change
                },
                props: {
                    value: this.val,
                    rawId: this.rawId
                }
            }];
            return {
                children: this.env === 'dev' ? [{
                    // 为了展示边框选中态特意加的
                    name: 'span',
                    attr: this.attrs,
                    on: {
                        click: e => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('啊啊啊啊啊啊啊啊啊啊我是div');
                            this.$root.$emit('DEAL_CHOOSE', this);
                        }
                    },
                    children
                }] : children
            };
        }
    },
    created() {
        this.val = this.value || (this.keyword && this.form[this.keyword]) || this.attrs.value || '';
    },
    mounted() {
    }
};
export default base;
