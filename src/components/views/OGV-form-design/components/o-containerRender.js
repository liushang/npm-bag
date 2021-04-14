// import { analysisRenderConfig, analysisDataRender } from '../../../schema/util';
import { render, computed } from '../../../schema/api';
import { dealMultiChildren, deepClone } from '../../../schema/util';
import baseAttr from '../base/attrs';
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
            lcData: {}
        };
    },
    props: {
        ...baseAttr.props,
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
        scopedSlots: {
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
                    'min-height': '650px',
                    'padding': '10px 0 40px'
                };
            }
        },
        rawId: {
            type: String,
            default: 'oContainer'
        },
        // slot: {
        //     type: String,
        //     default: ''
        // },
        computed: {
            type: Object,
            default: () => {}
        },
        watch: {
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
        },
        insData: {
            type: Object,
            default: () => {}
        }
    },
    render,
    methods: {
        deepClone: deepClone,
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
    watch: {
        // 'lcData.form.status':function(val){
        //     console.log('status变化')
        //     console.log(val)
        // },
        // lcData: {
        //     handler: function(val, old) {
        //         console.log('lcData变化')
        //         console.log(val.form.batch_status)
        //         console.log(old.form.batch_status)
        //         console.log(val.form.status)
        //         console.log(old.form.status)
        //         // todo 属性变化绑定
        //         for(let i in this.watch) {
        //             if (val[i] !== old[i]) {
        //                 this.watch[i].bind(this)()
        //             }
        //         }
        //         // console.log(this.computed.nnn.bind(this)())
        //     },
        //     deep: true
        // },
        // 'lcData.form.status': (val, old) => {
        //     console.log(val, old)
        // }
    },
    computed: {
        ...computed,
        // ...(this.computed || {oo:() => this.lcData}),
        // ...Object.assign({}, this.computed),
        // oo() {
        //     return this.lcData.form.status + 11
        // },
        // computed,
        rootData() {
            return (this.env === 'dev' ? this.containerInject : this.container) || {};
        },
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
            for (let i in this.scopedSlots) {
                let func = this.scopedSlots[i];
                this.scopedSlots[i] = (e) => {
                    return func(e, this);
                };
            }
            const  cc = dealMultiChildren(this.renderFun({
                name: 'ElRow',
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
                scopedSlots: {
                    ...this.scopedSlots
                },
                style: Object.assign(this.style, this.styles),
                props: {
                    value: this.value,
                    rawId: this.containerId
                },
                children: this.children
            }))
            return {
                children: cc
            };
        }
    },
    created() {
        this.lcData = deepClone(this.insData)
        console.log(this.methods)
        for(let i in this.methods) {
            this[i] = this.methods[i]
        }
        for(let i in this.watch) {
            console.log('lcData.' + i)
            this.$watch('lcData.' + i, this.watch[i].bind(this))
        }
    },
    mounted() {
        this.containerId = 'oContainer'
        if (!this.rootData[this.containerId]) {
            this.$set(this.rootData, this.containerId, {});
        }
        this.$set(this.rootData[this.containerId], 'methods', this.methods);
        this.mounted && this.mounted()
    }
};
export default base;