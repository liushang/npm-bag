// import { analysisRenderConfig, analysisDataRender } from '../../../schema/util';
import { render, computed } from '../../../schema/api';
let base = {
    data() {
        return {
            form: {
                'form-item-0': 1
            }
        };
    },
    props: {
        // form: {
        //   type: Object,
        //   default: () => {}
        // },
        config: {
            type: Array,
            default: () => []
        }
    },
    render,
    methods: {
        updateMsg() {
            console.log('updateMsg');
        },
        change() {
            console.log('我是change');
        },
        input(event) {
            this.value = event;
        },
        submit(e) {
            console.log('submit');
            console.log(e);
        }
    },
    computed: {
        ...computed,
        configComponents() {
            return {
                children: [{
                    name: 'el-form',
                    ref: 'oInput',
                    on: {
                        blur: this.updateMsg,
                        input: this.input
                    },
                    props: {
                        value: this.value
                    },
                    children: this.renderArr
                }]
            };
        },
        renderArr() {
            let config = this.config.map((x, index) => {
                let needProps = [ 'oInput' ];
                let needOnclick = [ 'oButton' ];
                if (needProps.includes(x.name)) {
                    x.props = Object.assign(x.props || {}, {
                        form: this.form,
                        keyword: 'form-item-' + index
                    });
                }
                if (x.on) {
                    x.props.on = Object.assign(x.on || {}, {
                        click: this.submit
                    });
                };
                if (x.children) x.props.children = x.children;
                if (x.name === 'oHtml') {
                    x.props.subName = x.subName;
                }
                return {
                    name: 'el-col',
                    attr: {
                        span: x.span,
                        offset: x.offset
                    },
                    children: [
                        x
                    ]
                };
            });
            return [{
                name: 'el-row',
                children: config
            }];
        }
    },
    mounted() {}
};
export default base;