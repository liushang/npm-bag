// import { analysisRenderConfig, analysisDataRender } from '../../../schema/util';
import { render, computed } from '../../../schema/api';
import baseAttr from '../base/attrs';
// import {
//     stringToFunc
//   } from '@/utils/db'
let base = {
    data() {
        return {
            style: {
                border: '1px solid yellow'
            },
            // 这里存放默认属性
            attr: {
                size: 'small',
                type: 'primary'
            },
        };
    },
    props: {
        ...baseAttr.props,
        attrs: {
            type: Object,
            default: () => {
                return {
                    type: 'primary',
                    size: 'small'
                };
            }
        }
    },
    inject: {
        containerInject: {
            default: () => {}
        },
        rootId: {
            type: String,
            default: ''
        },
        env: {
            default: 'prod'
        }
    },
    computed: {
        ...computed,
        configComponents() {
            for (let i in this.on) {
                let func = this.on[i];
                this.on[i] = (e) => {
                    // return func(e, this);
                    return func.bind(this)(e);
                };
            }
            return {
                children: [{
                    // 为了展示边框选中态特意加的
                    name: 'span',
                    on: {
                        click: e => {
                            e.stopPropagation();
                            this.$root.$emit('DEAL_CHOOSE', this);
                        }
                    },
                    children: this.renderFun([{
                        name: 'el-button',
                        style: Object.assign(this.style, this.styles),
                        attrs: {
                            ...this.attr,
                            ...this.attrs
                        },
                        ref: 'oButton',
                        jNode: 'oButton',
                        on: {
                            click: e => {
                                e.stopPropagation();
                                this.$root.$emit('DEAL_CHOOSE', this);
                            },
                            ...this.on
                        },
                        props: {
                            rawId: this.rawId
                        },
                        nativeOn: {},
                        children: this.children
                    }])
                }]
            };
        }
    },
    render,
    methods: {},
    created() {
    },
    mounted() {}
};
export default base;
