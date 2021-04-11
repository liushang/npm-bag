// import { analysisRenderConfig, analysisDataRender } from '../../../schema/util';
import { render, computed } from '../../../schema/api';
import baseAttr from '../base/attrs';
import { dealMultiChildren, deepClone } from '../../../schema/util';
let base = {
    data() {
        return {
            style: {
                border: '1px solid #e4e7ed',
                'min-height': '40px',
                lcData: {}
            }
        };
    },
    props: {
        ...baseAttr.props,
        on: {
            type: Object,
            default: () => {}
        },
        classes: {
            type: Object,
            default: () => {}
        },
        attrs: {
            type: Object,
            default: () => {}
        },
        children: {
            type: Array,
            default: () => []
        },
        styles: {
            type: Object,
            default: () => {}
        },
        rawId: {
            type: String,
            default: ''
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
        updateMsg() {
        },
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
            console.log(this.renderFun)
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
    },
    mounted() {
    }
};
export default base;
