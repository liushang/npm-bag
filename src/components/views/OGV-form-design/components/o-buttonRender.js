// import { analysisRenderConfig, analysisDataRender } from '../../../schema/util';
import { render, computed } from '../../../schema/api';
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
                    type: 'primary',
                    size: 'small'
                };
            }
        },
        children: {
            type: Array,
            default: () => ['确定']
        },
        styles: {
            type: Object,
            default: () => {
                return {};
            }
        },
        renderFun: {
            type: Function,
            default: x => x
        },
        rawId: {
            type: String,
            default: ''
        }
    },
    inject: {
        containerInject: {
            default: () => {}
        },
        rootId: {
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
                    return func(e, this);
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
                        nativeOn: {
                            // click: () => {
                            //   console.log('啊啊啊啊啊啊啊啊啊啊啊啊')
                            //   this.$root.$emit('DEAL_CHOOSE', this)
                            // },
                        },
                        children: this.children
                    }])
                }]
            };
        }
    },
    render,
    methods: {
        change() {
            console.log('我是change');
        }
    },
    mounted() {}
};
export default base;
