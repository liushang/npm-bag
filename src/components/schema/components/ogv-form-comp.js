// import { analysisRenderConfig, analysisDataRender } from '../../../schema/util';
import { render, computed } from '../api';
import { dealMultiChildren, deepClone } from '../util';
let base = {
    data() {
        return {
            style: {
                border: '1px solid #e4e7ed',
                'min-height': '200px'
            },
            attr: {
                size: 'small',
            },
            basicData: {},
            container: {},
            containerId: '',
            lcData: {},
            // ogv-form-comp add
            classes: {},
            attrs: {},
            on: {},
            nativeOn: {},
            scopedSlots: {},
            directives: {},
            children: {},
            renderFun: {},
            styles: {
              'min-height': '650px',
              'padding': '10px 0 40px'
            },
            rawId: 'oContainer',
            watch: {},
            methods: {},
            env: 'dev',
            insData: {},
            attrMap: {}
        };
    },
    props: {
        // ...baseAttr.props,
        // classes: {
        //     type: Object,
        //     default: () => {
        //         return {
        //             // 'abcde': true
        //         };
        //     }
        // },
        // attrs: {
        //     type: Object,
        //     default: () => {
        //         return {
        //             size: 'small'
        //         };
        //     }
        // },
        // on: {
        //     type: Object,
        //     default: () => {}
        // },
        // nativeOn: {
        //     type: Object,
        //     default: () => {}
        // },
        // scopedSlots: {
        //     type: Object,
        //     default: () => {}
        // },
        // directives: {
        //     type: Array,
        //     default: () => []
        // },
        // children: {
        //     type: Array,
        //     default: () => []
        // },
        // renderFun: {
        //     type: Function,
        //     default: x => x
        // },
        // styles: {
        //     type: Object,
        //     default: () => {
        //         return {
        //             'min-height': '650px',
        //             'padding': '10px 0 40px'
        //         };
        //     }
        // },
        // rawId: {
        //     type: String,
        //     default: 'oContainer'
        // },
        // computed: {
        //     type: Object,
        //     default: () => {}
        // },
        // watch: {
        //     type: Object,
        //     default: () => {}
        // },
        // env: {
        //     type: String,
        //     default: 'dev'
        // },
        // methods: {
        //     type: Object,
        //     default: () => {}
        // },
        // insData: {
        //     type: Object,
        //     default: () => {}
        // },
        constructure: {
          type: Object,
          default: () => {
            return {}
          }
        },
    },
    render,
    methods: {
        deepClone,
        dealData (obj) {
          for(let key in obj) {
            if(!obj.hasOwnProperty(key)) return;
            if (typeof obj[key] == 'function') {
              obj[key] = obj[key].bind(this)
            }
            if(typeof obj[key] == 'object' || typeof obj[key] == 'function') {
              this.dealData(obj[key]);//递归遍历属性值的子属性
            }
          }
        },
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
        metaData(val) {},
        metaData: {
            handle(val) {},
            deep: true
        },
        propData(val) {}
    },
    computed: {
        ...computed,
        rootData() {
            return (this.env === 'dev' ? this.containerInject : this.container) || {};
        },
        configComponents() {
            // 方法作用域绑定
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
        console.log(this.constructure)
        for(let i in this.constructure) {
          if (this[i]) {
            this[i] = this.constructure[i]
          }
        }
        this.containerId = 'oContainer'
        this.lcData = deepClone(this.insData)
        this.dealData(this.lcData)
        for(let i in this.methods) {
            this[i] = this.methods[i]
        }
        for(let i in this.watch) {
            this.$watch('lcData.' + i, this.watch[i].bind(this))
        }
        if (!this.rootData[this.containerId]) {
            this.$set(this.rootData, this.containerId, {});
        }
        this.$set(this.rootData[this.containerId], 'methods', this.methods);
        this.$set(this.rootData[this.containerId], 'lcData', this.lcData);
    },
    mounted() {
        this.mounted && this.mounted()
    },
    beforeUpdate() {
        this.beforeUpdate && this.beforeUpdate()
    },
    updated() {
        this.updated && this.updated()
    },
    beforeDestroy() {
        this.beforeUpdate && this.beforeUpdate()
    },
    destroyed() {
        this.destroyed && this.destroyed()
    }
};
export default base;