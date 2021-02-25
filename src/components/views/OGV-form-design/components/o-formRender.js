// import { analysisRenderConfig, analysisDataRender } from '../../../schema/util';
import { render, computed } from '../../../schema/api';
let base = {
    data() {
        return {
            style: {
                border: '1px solid #e4e7ed'
            },
            attr: {
                size: 'small',
                'label-width': '74px'
            }
        };
    },
    props: {
        form: {
            type: Object,
            default: () => {}
        },
        attrs: {
            type: Object,
            default: () => {
                return {
                    size: 'small',
                    'label-width': '74px'
                };
            }
        },
        nativeOn: {
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
                return {
                    'min-height': '200px'
                };
            }
        },
        rawId: {
            type: String,
            default: ''
        }
    },
    render,
    methods: {},
    inject: {
        env: {
            type: String,
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
                children: this.renderFun([{
                    name: 'el-form',
                    ref: 'oForm',
                    on: {
                        click: e => {},
                        ...this.on
                    },
                    attrs: {
                        model: this.form,
                        ...this.attrs
                    },
                    nativeOn: {
                        click: e => {
                            e.stopPropagation();
                            if (!this.containerInject[this.rawId]) {
                                this.$set(this.containerInject, this.rawId, {});
                            }
                            this.$root.$emit('DEAL_CHOOSE', this);
                        },
                        ...this.nativeOn
                    },
                    style: {
                        ...this.style,
                        ...this.styles
                    },
                    props: {
                        value: this.value,
                        rawId: this.rawId
                    },
                    children: this.children
                }])
            };
        }
    }
};
export default base;