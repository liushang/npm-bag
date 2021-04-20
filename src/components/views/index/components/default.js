export const allHtmlNode = [ '!DOCTYPE', 'html', 'title', 'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'abbr', 'address', 'b', 'bdi', 'bdo', 'blockquote', 'cite', 'code', 'del', 'dfn', 'em', 'i', 'ins', 'kbd', 'mark', 'meter', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'small', 'srong', 'sub', 'time', 'u', 'var', 'wbr', 'from', 'input', 'textarea', 'button', 'select', 'optgroup', 'option', 'label', 'fieldset', 'legend', 'datalist', 'keygen', 'output', 'iframe', 'img', 'map', 'area', 'canvas', 'figcaption', 'figure', 'audio', 'source', 'track', 'video', 'a', 'link', 'nav', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'menu', 'command', 'table', 'caption', 'th', 'tr', 'td', 'thead', 'tbody', 'tfoot', 'col', 'colgroup', 'style', 'div', 'span', 'header', 'footer', 'section', 'article', 'aside', 'details', 'dialog', 'summary', 'head', 'meta', 'base', 'basefont', 'script', 'noscript', 'applet', 'enbed', 'object', 'param']

const styleProperty = {
    'min-height': {
        label: '最小高度',
        value: []
    },
    'padding': {
        label: 'padding',
        value: []
    },
    'margin': {
        label: 'margin',
        value: []
    },
    'background': {
        label: '背景',
        value: []
    },
    'border': {
        label: 'border',
        value: []
    },
    'color': {
        label: '文本颜色',
        value: []
    },
    'text-align': {
        label: '文本对齐',
        value: [ 'center', 'left', 'right' ]
    },
    'font-size': {
        label: '字体大小',
        value: []
    },
    'height': {
        label: '高度',
        value: []
    },
    'width': {
        label: '宽度',
        value: []
    },
    'position': {
        label: '定位',
        value: [ 'relative', 'absolute', 'fixed' ]
    },
    'z-index': {
        label: '层级',
        value: []
    },
    'display': {
        label: '显示',
        value: [ 'none', 'block', 'inline', 'inline-block' ]
    },
    'float': {
        label: '浮动',
        value: [ 'left', 'right' ]
    },
    'overflow': {
        label: '超出',
        value: ['hidden']
    },
    'vertical-align': {
        label: '垂直对齐',
        value: ['center', 'top', 'bottom']
    },
    'line-height': {
        label: '行高',
        value: []
    }
};
export const htmlNode = allHtmlNode;
export const elNode = name => name.startsWith('El');

let htmlNodeWrapper = htmlNode.map(x => {
    return {
        x: {
            style: styleProperty
        }
    };
});
const commonComponent = {
    styles: styleProperty
};
export const defaultKV = {
    ...htmlNode.reduce((pre, item, index) => {
        pre[item] = {
            style: styleProperty
        };
        return pre;
    }, {}),
    oContainer: {
        attrs: {
            size: {
                label: '尺寸',
                value: ['small', 'mini']
            }
        },
        children: {
            0: {
                value: ['ElForm', 'ElRow', 'ElCol', 'ElDialog', 'ElButton']
            } 
        },
        ...commonComponent
    },
    oButton: {
        attrs: {
            type: {
                label: '类型',
                value: [ 'primary', 'success', 'info', 'warning', 'danger' ]
            },
            size: {
                label: '尺寸',
                value: [ 'small', 'medium', 'mini' ]
            },
            plain: {
                label: '平铺',
                value: [ 1, 0 ]
            },
            round: {
                label: '圆角按钮',
                value: [ true, false ]
            },
            circle: {
                label: '圆形按钮',
                value: [ true, false ]
            },
            loading: {
                label: '展示加载状态',
                value: [ true, false ]
            },
            disabled: {
                label: '禁用',
                value: [ true, false ]
            },
            autofocus: {
                label: '自动聚焦',
                value: [ true, false ]
            },
            'native-type': {
                label: '原生属性',
                value: ['button', 'submit', 'reset']
            }
        }
    },
    oRow: {
        children: {
            0: {
                value: ['oCol']
            }
        }
    },
    ElInput: {
        props: {
            size: {
                label: '尺寸',
                value: [ 'small', 'medium', 'mini' ]
            },
        }
    },
    ElForm: {
        children: {
            0: {
                value: ['ElFormItem', 'ElRow']
            }
        },
        attrs: {
            size: {
                label: '尺寸',
                value: [ 'small', 'medium', 'mini' ]
            }
        }
    },
    ElFormItem: {
        children: {
            0: {
                value: [ 'ElSelect', 'ElInput', 'ElRow', 'ElCol' ]
            }
        }
    },
    ElSelect: {
        children: {
            0: {
                value: ['ElOption']
            }
        },
        attrMap: {
            elSelect_value: {
                label: '属性',
                value: []
            }
        }
    },
    ElTable: {
        children: {
            0: {
                value: ['ElTableColumn']
            }
        }
    },
    ElRadioGroup: {
        children: {
            0: {
                value: ['ElRadio']
            }
        }
    }
};

const htmlDefaultNode = {
    ...htmlNode.map(x => {
        return {
            style: {},
            attrs: {},
            classes: {},
            on: {},
            children: [],
            renderFun: x => x,
            scopedSlots: {},
            slot: ''
        }
    }),
    style: {
        style: {},
        attrs: {},
        on: {},
        children: [".abcde{color: red}"],
        renderFun: x => x,
        scopedSlots: {},
        slot: ''
    },
}

const elDefaultNode = {
    ElInput: {
        style: {
            width: '200px',
        },
        attrMap: {
            elInput_value: ''
        },
        attrs: {},
        children: [],
        on: {
            input: function (e) {
                this.lcData.elInput_value = e
            }
        },
        nativeOn: {
            input: e => {
                setTimeout(() => {
                    e.target.click()
                }, 100)
            }
        },
        renderFun: function (x) {
            x.value = this.lcData.elInput_value;
            return x
        },
    },
    ElForm: {
        attrs: {
            ref: 'form',
            size: 'small'
        },
        children: [],
        nativeOn: {},
        attrMap: {
            elForm_rule: '',
            elForm_form: ''
        },
        renderFun: function(x) {
            x.rules= (this.lcData || {}).elForm_rule || {};
            x.model= (this.lcData || {}).elForm_form || {};
            return x
        },
    },
    ElFormItem: {
        attrs: {
            prop: 'item',
            label: '标签1'
        },
        style: {},
        children: [],
        on: {},
        nativeOn: {},
        renderFun: x => {
            return x
        },
    },
    ElTableColumn: {
        attrs: {
            prop: 'item',
            label: '标签1'
        },
        style: {},
        children: [],
        on: {},
        nativeOn: {},
        scopedSlots: {},
        renderFun: x => {
            return x
        },
    },
    ElSelect: {
        children: [],
        style: {
            width: '200px',
        },
        attrMap: {
            elSelect_value: ''
        },
        attrs: {
            value: 1
        },
        on: {
            input: e => e
        },
        nativeOn: {
            input: e => {}
        },
        renderFun: function(x) {
            x.value = this.lcData.elSelect_value;
            return x
        },
    },
    ElOption: {
        children: [],
        style: {
            width: '200px',
        },
        attrs: {},
        attrMap: {
            elSelect_value: '',
            elOption_items: ''
        },
        on: {},
        nativeOn: {
            click: function(e) {
                this.lcData.elSelect_value = e.currentTarget.value;
            }
        },
        renderFun: x => {
            return (this.lcData.elOption_items||[]).map(function (i) {
                var vv = deepClone(x);vv.label = i.label;vv.value = i.value;return vv;
            });
        },
    },
    ElRadioGroup: {
        children: [],
        style: {
            width: '200px',
        },
        attrMap: {
            elGroup_value: ''
        },
        attrs: {
            value: 1
        },
        on: {},
        nativeOn: {},
        renderFun: function(x) {
            x.value = this.lcData.elGroup_value;
            return x
        },
    },
    ElRadio: {
        children: ['选项'],
        style: {
            width: '200px',
        },
        attrs: {},
        attrMap: {
            elRadio_value: '',
            elRadio_items: ''
        },
        on: {},
        nativeOn: {
            click: function(e) {
                this.lcData.elRadio_value = +e.target.value;
                console.log(e.target.value);
            }
        },
        renderFun: function(x) {
            return ((this.lcData || {}).elRadio_items||[]).map(function (i) {
                var vv = deepClone(x);vv.label = +i.value;vv.values[0] = i.label;return vv;
            });
        },
    },
    ElButton: {
        attrs: {
            size: 'small',
            type: 'primary'
        },
        children: [ '确定' ],
        on: {},
        nativeOn: {},
        renderFun: x => {
            return x
        },
    },
    ElDialog: {
        children: [],
        style: {
        },
        attrMap: {
            showDialog: ''
        },
        attrs: {
            title: '提示' 
        },
        on: {
            close: function() {
                (this.lcData || {}).showDialog = false
            }
        },
        nativeOn: {
        },
        renderFun: x => {
            x.visible=(this.lcData || {}).showDialog;
            return x;
        },
    },
    ElDatePicker: {
        attrs: {
            size: 'small',
            type: 'primary',
            type: "daterange",
            align: "right",
            unlinkPanels: true,
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            format: "yyyy-MM-dd HH:mm:ss",
            rangeSeparator: "至",
            startPlaceholder: "开始日期",
            endPlaceholder: "结束日期",
        },
        children: [],
        attrMap: {
            elDatePicker_value: ''
        },
        on: {
            input: function(e) {
                this.lcData.elDatePicker_value = e
            }
        },
        nativeOn: {},
        renderFun: function(x) {
            x.value = (this.lcData || {}).elDatePicker_value;
            return x
        },
    }
}
// todo 增加其他元素
export const defaultNode = {
    ...htmlDefaultNode,
    ...elDefaultNode
};