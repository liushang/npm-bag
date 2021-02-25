// import { analysisRenderConfig, analysisDataRender } from '../../../schema/util';
import { render, computed } from '../../../schema/api';
let base = {
    data() {
        return {
            style: {
                border: '1px solid #e4e7ed',
                'min-height': '40px'
            }
        };
    },
    props: {
        on: {
            type: Object,
            default: () => {}
        },
        attrs: {
            type: Object,
            default: () => {
                return {
                    layout: 'prev, pager, next',
                    total: 50,
                    'pager-size': 20,
                    background: true
                };
            }
        },
        children: {
            type: Array,
            default: () => []
        },
        styles: {
            type: Object,
            default: () => {
                return {
                    'text-align': 'center'
                };
            }
        },
        rawId: {
            type: String,
            default: ''
        }
    },
    render,
    methods: {
        updateMsg() {
        },
        click() {
            this.$root.$emit('DEAL_CHOOSE', this);
        }
    },
    inject: {
        env: {
            type: String,
            default: 'prod'
        },
        rootId: {
            type: String
        },
        containerInject: {
            default: () => {}
        }
    },
    computed: {
        ...computed,
        configComponents() {
            for (let i in this.on) {
                let func = this.on[i];
                this.on[i] = (e) => {
                    return func(e, this);
                };
            }
            let children = [{
                name: 'el-pagination',
                attr: this.attrs,
                style: Object.assign(this.style, this.styles),
                ref: 'oPagination',
                on: {
                    click: this.click,
                    'current-change': e => {
                        console.log('current-change');
                        console.log('当前页是', `${e}`);
                        console.log(this.$root);
                        console.log(this.containerInject[this.rootId].methods);
                        this.containerInject[this.rootId].pn = e;
                        this.containerInject[this.rootId].methods.getData(this, e);
                    },
                    ...this.on
                },
                children: this.children
            }];
            return {
                children: this.env === 'dev' ? [{
                // 为了展示边框选中态特意加的
                    name: 'span',
                    on: {
                        click: e => {
                            e.stopPropagation();
                            this.$root.$emit('DEAL_CHOOSE', this);
                        },
                        'current-change': e => {
                            console.log('current-change');
                        }
                    },
                    children
                }] : children
            };
        }
    },
    created() {
    },
    mounted() {
    }
};
export default base;
