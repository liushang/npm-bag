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
export const htmlNode = [ 'div', 'span', 'img', 'a' ];
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
    oTable: {
        children: {
            0: {
                value: [ 'oTableColumn' ]
            }
            // 1: {
            //     label: '表格项',
            //     value: [ 'oTableColumn' ]
            // }
        }
    },
    oRow: {
        children: {
            0: {
                value: ['oCol']
            }
        }
    },
    oForm: {
        children: {
            0: {
                value: [ 'oFormItem' ]
            }
        }
    },
    oSelect: {
        children: {
            0: {
                value: [ 'oOption' ]
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
    }
};

const htmlDefaultNode = {
    div: {
        style: {},
        attrs: {},
        children: [],
        renderFun: x => x,
        scopedSlots: {},
        slot: ''
    },
    span: {
        style: {},
        attrs: {},
        children: [],
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
                this.elInput_value = e
            }
        },
        nativeOn: {
            input: e => {
                setTimeout(() => {
                    e.target.click()
                }, 100)
            }
        },
        // 这里如果是箭头函数某些情况下 this会变成_this
        renderFun: function (x) {
            x.value = this.elInput_value;
            return x
        },
    },
    ElForm: {
        attrs: {
            ref: 'form',
            size: 'small'
        },
        children: [],
        on: {
            input: e => e
        },
        nativeOn: {},
        renderFun: x => {
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
        nativeOn: {
            change: e => {
                console.log(e)
            }
        },
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
        // slot: {},
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
        },
        attrs: {
            value: '1'
        },
        on: {
            input: e => e
        },
        nativeOn: {
            input: e => {}
        },
        renderFun: x => {
            x.value = this.elSelect_value;
            return x
        },
    },
    ElOption: {
        children: [],
        style: {
            width: '200px',
        },
        attrs: {},
        on: {
            input: e => e
        },
        nativeOn: {
            click: e => {
                console.log(e.currentTarget.value)
            }
        },
        renderFun: x => {
            x.value = "1";
            x.label="选项";
            return x
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
            close: e => {
                this.showDialog = false
            }
        },
        nativeOn: {
        },
        renderFun: x => {
            x.visible=this.showDialog;
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
        on: {},
        nativeOn: {},
        renderFun: x => {
            return x
        },
    }
}
export const allHtmlNode = [ '!DOCTYPE', 'html', 'title', 'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'abbr', 'address', 'b', 'bdi', 'bdo', 'blockquote', 'cite', 'code', 'del', 'dfn', 'em', 'i', 'ins', 'kbd', 'mark', 'meter', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'small', 'srong', 'sub', 'time', 'u', 'var', 'wbr', 'from', 'input', 'textarea', 'button', 'select', 'optgroup', 'option', 'label', 'fieldset', 'legend', 'datalist', 'keygen', 'output', 'iframe', 'img', 'map', 'area', 'canvas', 'figcaption', 'figure', 'audio', 'source', 'track', 'video', 'a', 'link', 'nav', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'menu', 'command', 'table', 'caption', 'th', 'tr', 'td', 'thead', 'tbody', 'tfoot', 'col', 'colgroup', 'style', 'div', 'span', 'header', 'footer', 'section', 'article', 'aside', 'details', 'dialog', 'summary', 'head', 'meta', 'base', 'basefont', 'script', 'noscript', 'applet', 'enbed', 'object', 'param']
// todo 增加其他元素
export const defaultNode = {
    ...htmlDefaultNode,
    ...elDefaultNode
};