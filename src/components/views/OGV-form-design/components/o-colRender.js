// import { analysisRenderConfig, analysisDataRender } from '../../../schema/util';
import { render, computed } from '../../../schema/api';
let base = {
    data() {
        return {
            style: {
                border: '1px solid #e4e7ed',
                'min-height': '40px'
            },
            attr: {
                span: 10
            }
        };
    },
    props: {
        on: {
            type: Object,
            default: () => {}
        },
        nativeOn: {
            type: Object,
            default: () => {}
        },
        attrs: {
            type: Object,
            default: () => {
                return {
                    span: 10,
                    offset: 0
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
                    'min-height': '40px'
                };
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
    render,
    methods: {
        updateMsg() {
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
    computed: {
        ...computed,
        configComponents() {
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
                        name: 'el-col',
                        attrs: {
                            ...this.attr,
                            ...this.attrs
                        },
                        style: Object.assign(this.style, this.styles),
                        ref: 'oCol',
                        on: {
                            ...this.on
                        },
                        props: {
                            rawId: this.rawId
                        },
                        nativeOn: {
                            click: e => {
                                e.stopPropagation();
                                this.$root.$emit('DEAL_CHOOSE', this);
                            },
                            ...this.nativeOn
                        },
                        children: this.children
                    }])
                }]
            };
        }
    },
    mounted() {}
};
export default base;
