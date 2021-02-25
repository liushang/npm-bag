// import { analysisRenderConfig, analysisDataRender } from '../../../schema/util';
import { render, computed } from '../../../schema/api';
let base = {
    data() {
        return {
            val: '',
            style: {
                border: '1px solid #e4e7ed'
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
        styles: {
            type: Object,
            default: () => {
                return {
                };
            }
        },
        attrs: {
            type: Object,
            default: () => {}
        },
        rawId: {
            type: String,
            default: ''
        },
        children: {
            type: Array,
            default: () => ['确定']
        }
    },
    render,
    methods: {
        change(event) {
            this.form[this.keyword] = this.val = event;
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
                name: 'el-radio-group',
                attrs: {
                    size: 'small',
                    ...this.attrs,
                    value: this.containerInject[this.rawId].radioGroup
                },
                style: Object.assign(this.style, this.styles),
                ref: 'oRadioGroup',
                on: {
                    change: this.change,
                    changeVal: ({ label, value }) => {
                        // this.containerInject[this.rawId].select = label;
                        this.containerInject[this.rawId].radioGroup = value;
                    }
                },
                props: {
                    rawId: this.rawId
                },
                children: this.children
            }];
            return {
                children: this.env === 'dev' ? [{
                    // 为了展示边框选中态特意加的
                    name: 'span',
                    attr: this.attrs,
                    on: {
                        click: e => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.$root.$emit('DEAL_CHOOSE', this);
                        }
                    },
                    children
                }] : children
            };
        }
    },
    created() {
        this.val = this.value || (this.keyword && this.form[this.keyword]) || this.attrs.value || '';
        if (!this.containerInject[this.rawId]) {
            this.$set(this.containerInject, this.rawId, {
                radioGroup: ''
            });
        }
    },
    mounted() {}
};
export default base;
