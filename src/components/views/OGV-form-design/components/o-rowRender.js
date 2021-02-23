// import { analysisRenderConfig, analysisDataRender } from '../../../schema/util';
import { render, computed } from '../../../schema/api';
let base = {
    data() {
        return {
            style: {
                border: '1px solid #e4e7ed',
                'min-height': '40px'
            }
        };
    },
    props: {
        on: {
            type: Object,
            default: () => {}
        },
        attrs: {
            type: Object,
            default: () => {}
        },
        children: {
            type: Array,
            default: () => []
        },
        styles: {
            type: Object,
            default: () => {}
        },
        rawId: {
            type: String,
            default: ''
        }
    },
    render,
    inject: {
        env: {
            default: 'prod'
        },
        containerInject: {
            default: () => {}
        }
    },
    methods: {
        updateMsg() {
        },
        click() {
            console.log('啊啊啊啊啊啊啊啊啊啊啊啊');
            this.$root.$emit('DEAL_CHOOSE', this);
        }
    },
    computed: {
        ...computed,
        configComponents() {
            let children = [{
                name: 'el-row',
                attr: this.attrs,
                style: Object.assign(this.style, this.styles),
                ref: 'oRow',
                on: {
                    click: this.click,
                    ...this.on
                },
                children: this.children
            }];
            return {
                children: this.env === 'dev' ? [{
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
                }] : children
            };
        }
    },
    created() {
    },
    mounted() {
        console.log('我是raw');
        console.log(this.env);
    }
};
export default base;
