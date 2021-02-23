// import { analysisRenderConfig, analysisDataRender } from '../../../schema/util';
import { render, computed } from '../../../schema/api';
let base = {
    data() {
        return {
            style: {
                border: '1px solid #e4e7ed'
            },
            attr: {

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
        attrs: {
            type: Object,
            default: () => {
                return {
                    label: '选项1'
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
        renderFun: {
            type: Function,
            default: x => x
        },
        styles: {
            type: Object,
            default: () => {
                return {
                };
            }
        },
        rawId: {
            type: String,
            default: ''
        }
    },
    render,
    inject: {
        env: {
            type: String,
            default: 'prod'
        },
        containerInject: {
            default: () => {}
        }
    },
    methods: {
        change() {
            console.log('我是change');
            console.log(this.configData);
        }
    },
    computed: {
        ...computed,
        val() {
            return (this.containerInject && this.containerInject[this.rawId] && this.containerInject[this.rawId].option) || '';
        },
        configComponents() {
            return {
                children: this.renderFun([{
                    name: 'el-option',
                    attrs: {
                        size: 'small',
                        ...this.attr,
                        ...this.attrs
                    },
                    style: Object.assign(this.style, this.styles),
                    ref: 'oOption',
                    on: {
                        focus: () => {},
                        ...this.on
                    },
                    nativeOn: {
                        click: e => {
                            console.log('触发选中态', e);
                            this.$parent.$parent.$parent.$emit('changeVal', {
                                label: e.target.textContent,
                                value: e.target.value
                            });
                            this.$emit('changeVal', this.val);
                            this.$root.$emit('DEAL_CHOOSE', this);
                        },
                        ...this.nativeOn
                    },
                    props: {
                        value: this.val,
                        rawId: this.rawId
                    }
                }])
            };
        }
    },
    created() {},
    mounted() {}
};
export default base;
