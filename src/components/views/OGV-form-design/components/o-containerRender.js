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
            container: {}
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
            default: ''
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
        submit(e) {},
        ...((this && this.methods) || {})
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
            return {
                children: this.renderFun([{
                    name: 'el-row',
                    ref: 'oContainer',
                    on: {
                        click: e => {
                            e.stopPropagation();
                            console.log('container');
                            this.$set(this.container[this.rawId], 'methods', this.methods);
                            // this.$root.$emit('DEAL_CHOOSE', this);
                        },
                        ...this.on
                    },
                    attrs: {
                        model: this.form,
                        ...this.attrs
                    },
                    nativeOn: {
                        click: () => {
                            if (!this.container[this.rawId]) {
                                this.$set(this.container, this.rawId, {});
                            }
                            console.log('metcontainerInjecthods');
                            console.log(this.methods);
                            // if (!this.containerInject[this.rawId].methods) {
                            this.$set(this.container[this.rawId], 'methods', this.methods);
                            // }
                            this.$root.$emit('DEAL_CHOOSE', this);
                        },
                        ...this.nativeOn
                    },
                    style: Object.assign(this.style, this.styles),
                    props: {
                        value: this.value,
                        rawId: this.rawId
                    },
                    children: this.children
                }])
            };
        }
    },
    created() {
        if (!this.containerInject[this.rawId]) {
            this.rawId = 'oContainer' + parseInt(Math.random() * 1000000);
            this.$set(this.containerInject, this.rawId, {});
        }
        this.$set(this.containerInject[this.rawId], 'methods', this.methods);
    },
    mounted() {
        if (!this.container[this.rawId]) {
            // this.rawId = 'oContainer' + parseInt(Math.random() * 1000000);
            this.$set(this.container, this.rawId, {});
        }
        this.$set(this.container[this.rawId], 'methods', this.methods);
        this.on && this.on['mounted'] && this.on['mounted'](this);
    }
};
export default base;