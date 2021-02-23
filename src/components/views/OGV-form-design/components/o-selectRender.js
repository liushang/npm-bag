// import { analysisRenderConfig, analysisDataRender } from '../../../schema/util';
import { render, computed } from '../../../schema/api';
let base = {
    data() {
        return {
            style: {
                border: '1px solid #e4e7ed'
            }
        };
    },
    props: {
        value: {
            type: String,
            default: ''
        },
        attrs: {
            type: Object,
            default: () => {
                return {
                    placeholder: '请选择活动区域'
                };
            }
        },
        styles: {
            type: Object,
            default: () => {
                return {
                };
            }
        },
        children: {
            type: Array,
            default: () => []
        },
        rawId: {
            type: String,
            default: ''
        }
    },
    render,
    methods: {
        input(event) {
            this.$emit('oSelect', event);
            // this.configComponents.children[0].props.value = event
            // this.form[this.keyword] = event
            if (!this.containerInject[this.rawId]) {
                this.$set(this.containerInject, this.rawId, {
                    select: '',
                    value: ''
                });
            }
            this.$set(this.containerInject[this.rawId], 'select', event);
            this.$root.$emit('DEAL_CHOOSE', this);
        }
    },
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
        val() {
            return (this.containerInject && this.containerInject[this.rawId] && this.containerInject[this.rawId].select) || '';
        },
        configComponents() {
            return {
                children: [{
                    name: 'el-select',
                    attrs: Object.assign({
                        size: 'small'
                    }, this.attrs),
                    style: Object.assign(this.style, this.styles),
                    ref: 'oSelect',
                    on: {
                        input: this.input,
                        changeVal: ({ label, value }) => {
                            this.containerInject[this.rawId].select = label;
                            this.containerInject[this.rawId].value = value;
                        }
                    },
                    nativeOn: {
                        click: () => {
                            this.$root.$emit('DEAL_CHOOSE', this);
                        }
                    },
                    props: {
                        value: this.val,
                        rawId: this.rawId
                    },
                    children: this.children
                }]
            };
        }
    },
    mounted() {}
};
export default base;
