import { render, computed } from '../api';
import { dealMultiChildren, deepClone, activateStr, analysisInjectData } from '../util';
import axios from 'axios';
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
            classes: null,
            attrs: null,
            on: null,
            nativeOn: null,
            scopedSlots: null,
            directives: null,
            children: null,
            renderFun: null,
            styles: null,
            rawId: 'oContainer',
            watch: null,
            methods: null,
            env: 'dev',
            insData: null,
            attrMap: null,
            constructure: null
        };
    },
    props: {
        moduleId: {
            type: Number,
            default: 0
        },
        originStr: {
            type: String,
            default: ''
        },
        // constructure: {
        //     type: Object,
        //     default: {}
        // }
    },
    render,
    methods: {
        deepClone,
        injectData() {
            analysisInjectData({ name: 'oContainer', props: this.constructure }, { attr: {} }, '', {} )
            for(let i in this.constructure) {
                this[i] = this.constructure[i]
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
            console.log('this.on', this.on)
            console.log('this.render', this.renderFun)
            console.log(this.constructure)
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
            const  cc = dealMultiChildren(this.renderFun && this.renderFun({
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
            }) || [])
            return {
                children: cc
            };
        }
    },
    created() {
        if (this.moduleId) {
            axios({
                url: 'http://manager.bilibili.co/ogv/form/api/getModuleDetailByModuleId',
                params: {
                    moduleId: this.moduleId
                }
            }).then((res) => {
                console.log(res)
                const { data, code } = res.data
                if (data && code === 0) {
                    if (data[0] && data[0].basic_config) {
                        let moduCf = decodeURIComponent(data[0].basic_config);
                        this.constructure = activateStr(moduCf)[0].props;
                        this.injectData()
                        if (this.mounted) {
                            this.mounted()
                        }
                    }
                }
            });
        } else if (this.originStr) {
            let moduCf = decodeURIComponent(this.originStr);
            this.constructure = activateStr(moduCf)[0].props;
            this.injectData()
        } else {
            this.injectData()
        }
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
        this.beforeDestroy && this.beforeDestroy()
    },
    destroyed() {
        this.destroyed && this.destroyed()
    }
};
export default base;