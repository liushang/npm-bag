// import { analysisRenderConfig, analysisDataRender } from '../../../schema/util';
import { render, computed } from '../../../schema/api';
import { dealMultiChildren, deepClone } from '../../../schema/util';
import baseAttr from '../base/attrs';
let base = {
    data() {
        return {
            style: {
                border: '1px solid #e4e7ed',
                'min-height': '40px'
            },
            attr: {
                size: 'small',
            },
            lcData: {}
        };
    },
    props: {
        ...baseAttr.props,
        // 以下属性正式环境下皆为 data
        attrs: {
            type: Object,
            default: () => {
                return {
                    size: 'small'
                };
            }
        },
        on: {
            type: Object,
            default: () => {}
        },
        nativeOn: {
            type: Object,
            default: () => {}
        },
        scopedSlots: {
            type: Object,
            default: () => {}
        },
        children: {
            type: Array,
            default: () => []
        },
        renderFun: {
            type: Function,
            default: x => x
        },
        styles: {
            type: Object,
            default: () => {
                return {};
            }
        },
        rawId: {
            type: String,
            default: ''
        },
        // slot: {
        //     type: String,
        //     default: ''
        // },
        computed: {
            type: Object,
            default: () => {}
        },
        watch: {
            type: Object,
            default: () => {}
        },
        env: {
            type: String,
            default: 'dev'
        },
        methods: {
            type: Object,
            default: () => {}
        },
        insData: {
            type: Object,
            default: () => {}
        }
    },
    render,
    inject: {
        env: {
            default: 'prod'
        },
        containerInject: {
            default: () => {}
        }
    },
    methods: {
        click() {
            this.$root.$emit('DEAL_CHOOSE', this);
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
            for (let i in this.nativeOn) {
                let func = this.nativeOn[i];
                this.nativeOn[i] = (e) => {
                    return func(e, this);
                };
            }
            for (let i in this.scopedSlots) {
                let func = this.scopedSlots[i];
                this.scopedSlots[i] = (e) => {
                    return func(e, this);
                };
            }
            let children = {
                name: 'el-row',
                attr: this.attrs,
                style: Object.assign(this.style, this.styles),
                ref: 'oRow',
                class: this.classes,
                on: {
                    click: this.click,
                    ...this.on
                },
                children: this.children
            };
            let renderChildren = this.renderFun(children)
            let multiChildren = dealMultiChildren(renderChildren)
            return {
                children: this.env === 'dev' ? [{
                    // 为了展示边框选中态特意加的
                    name: 'span',
                    on: {
                        click: e => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.$root.$emit('DEAL_CHOOSE', this);
                        }
                    },
                    children: multiChildren
                }] : multiChildren
            };
        }
    },
    created() {
        this.lcData = deepClone(this.insData)
        for(let i in this.methods) {
            this[i] = this.methods[i]
        }
        for(let i in this.watch) {
            console.log('lcData.' + i)
            this.$watch('lcData.' + i, this.watch[i].bind(this))
        }
    },
    mounted() {
        this.on && this.on['mounted'] && this.on['mounted'](this);
    }
};
export default base;