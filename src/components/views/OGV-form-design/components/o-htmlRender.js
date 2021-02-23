// import { analysisRenderConfig, analysisDataRender } from '../../../schema/util';
import { render, computed } from '../../../schema/api';
let base = {
    data() {
        return {
            style: {}
        };
    },
    props: {
        on: {
            type: Object,
            default: () => {}
        },
        children: {
            type: Array,
            default: () => ['确定']
        },
        subName: {
            type: String,
            default: ''
        },
        styles: {
            type: Object,
            default: () => {
                return {
                    border: '1px solid #e4e7ed'
                };
            }
        }
    },
    computed: {
        ...computed,
        configComponents() {
            return {
                children: [{
                    name: this.subName,
                    attr: {
                        size: 'small',
                        type: 'primary'
                    },
                    style: Object.assign(this.style, this.styles),
                    ref: 'oHtml',
                    jNode: 'oHtml',
                    on: this.on,
                    children: this.children
                }]
            };
        }
    },
    render,
    methods: {
        updateMsg() {
            console.log('updateMsg');
        },
        change() {
            console.log('我是change');
        }
    },
    mounted() {}
};
export default base;
