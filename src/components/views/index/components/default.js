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
            // icon: {
            //     label: '图标',
            //     value: []
            // }
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
    }
};
// todo 增加其他元素
export const defaultNode = {
    div: {
        style: {},
        attrs: {},
        children: [],
        renderFun: x => x
    },
    span: {
        style: {},
        attrs: {},
        children: [],
        renderFun: x => x
    }
};