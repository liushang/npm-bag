// import { analysisRenderConfig, analysisDataRender } from '../../../schema/util';
import { render, computed } from '../../../schema/api';
let base = {
    data() {
        return {
            style: {
                border: '1px solid #e4e7ed',
                'min-height': '200px'
            },
            attr: {
                size: 'small',
                'label-width': '74px',
                'min-height': '200px'
            },
            basicData: {},
            container: {},
            containerId: '',
        };
    },
    props: {
        // 以下属性正式环境下皆为 data
        attrs: {
            type: Object,
            default: () => {
                return {
                    size: 'small'
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
                    'min-height': '700px',
                    'padding': '10px 0 40px'
                };
            }
        },
        rawId: {
            type: String,
            default: 'oContainer'
        },
        computed: {
            type: Object,
            default: () => {}
        },
        env: {
            type: String,
            default: 'dev'
        },
        methods: {
            type: Object,
            default: () => {}
        }
    },
    render,
    methods: {
        ...((this && this.methods) || {}),
    },
    provide() {
        return {
            rootId: this.rawId,
            env: this.env,
            containerInject: this.rootData
        };
    },
    inject: {
        containerInject: {
            default: () => {}
        }
    },
    computed: {
        ...computed,
        rootData() {
            return this.env === 'dev' ? this.containerInject : this.container;
        },
        ...((this && this.compute) || {}),
        configComponents() {
            for (let i in this.on) {
                let func = this.on[i];
                this.on[i] = (e) => {
                    return func(e, this);
                };
            }
            for (let i in this.nativeOn) {
                let func = this.nativeOn[i];
                this.nativeOn[i] = (e) => {
                    return func(e, this);
                };
            }
            return {
                children: this.renderFun([{
                    name: 'ElCard',
                    ref: 'oContainer',
                    on: {
                        click: e => {
                            e.stopPropagation();
                            this.$set(this.container[this.containerId], 'methods', this.methods);
                        },
                        ...this.on
                    },
                    attrs: {
                        ...this.attrs
                    },
                    nativeOn: {
                        click: () => {
                            if (this.env === 'dev') {
                                this.$root.$emit('DEAL_CHOOSE', this);
                            }
                            if (!this.container[this.containerId]) {
                                this.$set(this.container, this.containerId, {});
                            }
                            this.$set(this.container[this.containerId], 'methods', this.methods);
                            
                        },
                        ...this.nativeOn
                    },
                    style: Object.assign(this.style, this.styles),
                    props: {
                        value: this.value,
                        rawId: this.containerId
                    },
                    children: this.children
                }])
            };
        }
    },
    created() {

    },
    mounted() {
        this.containerId = 'oContainer'
        if (!this.containerInject[this.containerId]) {
            this.$set(this.rootData, this.containerId, {});
        }
        this.$set(this.rootData[this.containerId], 'methods', this.methods);
        this.on && this.on['mounted'] && this.on['mounted'](this);
    }
};
export default base;