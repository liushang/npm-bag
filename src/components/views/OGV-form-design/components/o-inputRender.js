import { render, computed } from '../../../schema/api';
import { dealMultiChildren } from '../../../schema/util';
import baseAttr from '../base/attrs';
let base = {
    data() {
        return {
            style: {
                border: '1px solid #e4e7ed'
            }
        };
    },
    props: {
        ...baseAttr.props,
        styles: {
            type: Object,
            default: () => {
                return {
                    width: '200px'
                };
            }
        },
        value: {
            type: String,
            default: '1'
        },
        attrs: {
            type: Object,
            default: () => {

            }
        },
        rawId: {
            type: String,
            default: ''
        }
    },
    render,
    methods: {
        input(event) {
            this.$emit('oInput', event);
            console.log(event);
            // 为啥这里一定要用￥set
            this.containerInject[this.rawId].value = event;
            // this.$set(this.containerInject[this.rawId], 'value', event)
            this.$root.$emit('DEAL_CHOOSE', this);
        }
    },
    inject: {
        containerInject: {
            default: () => {}
        },
        env: {
            default: 'prod'
        },
        rootId: {
            default: ''
        }
    },
    computed: {
        ...computed,
        val() {
            return (this.containerInject[this.rawId] && this.containerInject[this.rawId].value) || '';
        },
        configComponents() {
            for (let i in this.on) {
                let func = this.on[i];
                this.on[i] = (e) => {
                    return func(e, this);
                };
            }
            let children = [{
                name: 'el-input',
                attrs: Object.assign({
                    size: 'small'
                }, this.attrs),
                style: Object.assign(this.style, this.styles),
                ref: 'oInput',
                on: {
                    input: this.input,
                    focus: () => {}
                },
                props: {
                    value: this.val,
                    rawId: this.rawId
                }
            }];
            let renderChildren = this.renderFun(children)
            let multiChildren = dealMultiChildren(renderChildren)
            return {
                children: this.env === 'dev' ? [{
                    // 为了展示边框选中态特意加的
                    name: 'span',
                    on: {
                        click: e => {
                            e.stopPropagation();
                            if (!this.containerInject[this.rawId]) {
                                this.$set(this.containerInject, this.rawId, {
                                    value: ''
                                });
                            }
                            this.$root.$emit('DEAL_CHOOSE', this);
                        }
                    },
                    children: multiChildren
                }] : multiChildren
            };
        }
    },
    created() {},
    mounted() {
        this.$set(this.containerInject, this.rawId, {
            value: this.value || ''
        });
        // this.$set(this.containerInject[this.rawId], 'input', this.value || '');
    }
};
export default base;
