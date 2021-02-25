// import { analysisRenderConfig, analysisDataRender } from '../../../schema/util';
import { render, computed } from '../../../schema/api';
let base = {
    data() {
        return {
            style: {
                border: '1px solid #e4e7ed'
            },
            attr: {
                label: '123'
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
                    label: '标签',
                    'label-width': '74px'
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
                    'min-height': '30px'
                };
            }
        },
        nativeOn: {
            type: Object,
            default: () => {}
        },
        rawId: {
            type: String,
            default: ''
        }
    },
    render,
    methods: {
        change() {
            console.log('我是change');
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
            for (let i in this.on) {
                let func = this.on[i];
                this.on[i] = (e) => {
                    return func(e, this);
                };
            }
            return {
                children: [{
                    name: 'el-form-item',
                    ref: 'oFormItem',
                    on: {
                        click: () => {
                            console.log('心疼的感觉');
                        }
                    },
                    attrs: {
                        model: this.form,
                        ...this.attrs
                    },
                    nativeOn: {
                        click: e => {
                            e.stopPropagation();
                            console.log('啊啊啊啊啊啊啊啊啊啊啊啊');
                            this.$root.$emit('DEAL_CHOOSE', this);
                        },
                        ...this.nativeOn
                    },
                    style: Object.assign(this.style, this.styles),
                    props: {
                        value: this.value
                    },
                    children: this.children
                }]
            };
        }
    },
    mounted() {}
};
export default base;