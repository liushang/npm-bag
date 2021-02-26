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
        keyword: {
            type: String,
            default: ''
        },
        attrs: {
            type: Object,
            default: () => {
                return {
                    label: '选项'
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
    methods: {
        updateMsg() {
            console.log('updateMsg');
            console.log(this.configData);
        },
        change() {
            console.log('我是change');
            console.log(this.configData);
        },
        click(event) {
            // this.configComponents.children[0].props.value = event
            // this.form[this.keyword] = event
            console.log('我是click');
            this.form[this.keyword] = this.val = event;
            this.$emit('changeVal', event);
            this.$root.$emit('DEAL_CHOOSE', this);
        }
    },
    inject: {
        containerInject: {
            default: () => {}
        },
        env: {
            type: String,
            default: 'prod'
        },
        rootId: {
            default: ''
        }
    },
    computed: {
        ...computed,
        configComponents() {
            let children = [{
                name: 'el-radio',
                attrs: Object.assign({
                    size: 'small'
                }, this.attrs),
                style: Object.assign(this.style, this.styles),
                ref: 'oRadio',
                on: {
                    blur: this.updateMsg,
                    click: this.click,
                    focus: () => {}
                },
                nativeOn: {
                    click: e => {
                        console.log('啊啊啊啊啊啊啊啊啊啊啊啊option', this.val);
                        console.log(this.$parent);
                        // this.containerInject[this.containerInject[this.rawId].radio].radioGroup = this.val;
                        if (this.$parent.$options._componentTag === 'el-radio-group') {
                            // 上层有radiogroup
                            this.$parent.$emit('changeVal', {
                                value: this.val
                            });
                        } else {
                            console.log('单独设置选择');
                            console.log(e.target);
                            this.$set(this.containerInject[this.rootId], this.keyword, e.target.textContent);
                            // this.containerInject[this.rootId][this.keyword] = e.target.textContent;
                        }
                        // this.$emit('changeVal', this.val);
                        this.$root.$emit('DEAL_CHOOSE', this);
                    }
                },
                props: {
                    label: this.val,
                    value: (this.containerInject[this.rootId] || {})[this.keyword],
                    rawId: this.rawId
                }
            }];
            return {
                children: this.env === 'dev' ? this.renderFun([{
                    // 为了展示边框选中态特意加的
                    name: 'span',
                    on: {
                        click: e => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('啊啊啊啊啊啊啊啊啊啊我是div');
                            this.$root.$emit('DEAL_CHOOSE', this);
                        }
                    },
                    children
                }]) : children
            };
        }
    },
    created() {
        this.val = this.attrs.label || (this.keyword && this.form[this.keyword]) || this.attrs.value || '';
        if (!this.containerInject[this.rawId]) {
            this.$set(this.containerInject, this.rawId, {
                radio: ''
            });
        }
    },
    mounted() {
    }
};
export default base;
