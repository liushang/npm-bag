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
            default: () => []
        }
    },
    render,
    methods: {},
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
        val() {
            return (this.containerInject && this.containerInject[this.rawId] && this.containerInject[this.rawId].table) || [];
        },
        configComponents() {
            for (let i in this.on) {
                let func = this.on[i];
                this.on[i] = (e) => {
                    return func(e, this);
                };
            }
            let children = [{
                name: 'el-table',
                attrs: {
                    size: 'small',
                    ...this.attrs,
                    data: this.val
                },
                style: Object.assign(this.style, this.styles),
                ref: 'oTable',
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
                            e.stopPropagation();
                            // table数据存在在根属性上
                            this.$root.$emit('DEAL_CHOOSE', this);
                        }
                    },
                    children
                }] : children
            };
        }
    },
    created() {
        if (!this.containerInject[this.rawId]) {
            this.$set(this.containerInject, this.rawId, {
                table: []
            });
        }
        // if (this.containerInject && this.containerInject[this.rawId] && !this.containerInject[this.rawId].table) {
        //     console.log('dsfahnsodpfnapsdfjnp');
        //     this.$set(this.containerInject[this.rawId], 'table', []);
        // }
    },
    mounted() {}
};
export default base;
