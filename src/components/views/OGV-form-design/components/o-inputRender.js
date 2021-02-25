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
        styles: {
            type: Object,
            default: () => {
                return {
                    width: '200px'
                };
            }
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
            this.containerInject[this.rawId].input = event;
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
            return (this.containerInject[this.rawId] && this.containerInject[this.rawId].input) || '';
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
            return {
                children: this.env === 'dev' ? [{
                    // 为了展示边框选中态特意加的
                    name: 'span',
                    on: {
                        click: e => {
                            e.stopPropagation();
                            if (!this.containerInject[this.rawId]) {
                                this.$set(this.containerInject, this.rawId, {
                                    input: ''
                                });
                            }
                            this.$root.$emit('DEAL_CHOOSE', this);
                        }
                    },
                    children
                }] : children
            };
        }
    },
    created() {
        // if (!this.containerInject[this.rawId]) {
        this.$set(this.containerInject, this.rawId, {
            input: ''
        });
        // }
    },
    mounted() {
        console.log(this.containerInject);
        this.$set(this.containerInject, this.rawId, {
            input: ''
        });
    }
};
export default base;
