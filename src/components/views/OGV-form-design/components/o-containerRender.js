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
        classes: {
            type: Object,
            default: () => {
                return {
                    'abcde': true
                };
            }
        },
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
        directives: {
            type: Array,
            default: () => []
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
        },
        propData: {
            default: () => {}
        },
        metaData: {
            default: () => []
        },
    },
    watch: {
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
                        // this.$set(this.container[this.containerId], 'methods', this.methods);
                    },
                    ...this.on
                },
                classes: {
                    ...this.classes
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
                    },
                    ...this.nativeOn
                },
                scopedSlots: {
                    ...this.scopedSlots
                },
                directives: {
                    ...this.directives
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
        console.log(this.lcData)
        for(let i in this.methods) {
            this[i] = this.methods[i]
        }
        for(let i in this.watch) {
            console.log('lcData.' + i)
            this.$watch('lcData.' + i, this.watch[i].bind(this))
        }
        this.containerId = 'oContainer'
        if (!this.rootData[this.containerId]) {
            this.$set(this.rootData, this.containerId, {});
        }
        this.$set(this.rootData[this.containerId], 'methods', this.methods);
        this.$set(this.rootData[this.containerId], 'lcData', this.lcData);
    },
    mounted() {
        this.mounted && this.mounted()
        setTimeout(() => {
            // this.containerInject = {}
            // for(let i in this.containerInject) {
            //     this.$set(this.containerInject, i, undefined);
            // }
            for(let i in this.rootData) {
                this.containerInject && this.$set(this.containerInject, i, this.rootData[i])
            }
        }, 2000)
        console.log(this.prData)
    }
};
export default base;