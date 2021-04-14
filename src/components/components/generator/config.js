// 表单属性【右面板】
export const formConf = {
    basicData: []
};
export const allHtmlNode = [ '!DOCTYPE', 'html', 'title', 'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'abbr', 'address', 'b', 'bdi', 'bdo', 'blockquote', 'cite', 'code', 'del', 'dfn', 'em', 'i', 'ins', 'kbd', 'mark', 'meter', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'small', 'srong', 'sub', 'time', 'u', 'var', 'wbr', 'from', 'input', 'textarea', 'button', 'select', 'optgroup', 'option', 'label', 'fieldset', 'legend', 'datalist', 'keygen', 'output', 'iframe', 'img', 'map', 'area', 'canvas', 'figcaption', 'figure', 'audio', 'source', 'track', 'video', 'a', 'link', 'nav', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'menu', 'command', 'table', 'caption', 'th', 'tr', 'td', 'thead', 'tbody', 'tfoot', 'col', 'colgroup', 'style', 'div', 'span', 'header', 'footer', 'section', 'article', 'aside', 'details', 'dialog', 'summary', 'head', 'meta', 'base', 'basefont', 'script', 'noscript', 'applet', 'enbed', 'object', 'param']

// element 组件

export function getElementList (list) {
    let elCommonList = [ 'ElRow', 'ElCol', 'ElInput', 'ElSelect', 'ElOption', 'ElButton', 'ElTable', 'ElForm', 'ElItem', 'ElFormItem' ]
    let elRareList = []
    let elList = []
    for(let i in list) {
        if (i.startsWith('El')) {
            if (elCommonList.includes(i)) {
                elList.push({
                    name: i,
                    props: {},
                    __config__: {
                        label: i,
                        layout: 'oFormItem'
                    }
                })
            } else {
                elRareList.push(i)
            }
        }
    }
    elList.push({
        title: '不常用',
        list: elRareList.map(x => {
            return {
                name: x,
                props: {},
                __config__: {
                    label: x,
                    layout: 'oFormItem'
                }
            }
        })
    })
    return elList;
}

export const commonHtmlLabel = [ 'div', 'span', 'img', 'a' ]
export const rareHtmlLabel = allHtmlNode.filter(x => !commonHtmlLabel.includes(x))
export function getHtmlLabel() {
    let list =  []
    list.push(...commonHtmlLabel.map(x => {
        return {
            name: x,
            props: {},
            __config__: {
                label: x,
                layout: 'oFormItem'
            }
        }
    }))
    list.push({
        title: '不常用html',
        list: rareHtmlLabel.map(i => {
            return {
                name: i,
                props: {},
                __config__: {
                    label: i,
                    layout: 'oFormItem'
                }
            }
        })
    })
    return list
}

// o-组件

export const oComponents = [
    {
        name: 'oRow',
        props: {},
        __config__: {
            label: 'row',
            layout: 'oFormItem'
        }
    // }, {
    //     name: 'oCol',
    //     props: {},
    //     __config__: {
    //         label: '栏',
    //         layout: 'oFormItem'
    //     }
    // }, {
    //     name: 'oForm',
    //     props: {},
    //     __config__: {
    //         label: '表单',
    //         layout: 'oFormItem'
    //     }
    // }, {
    //     name: 'oFormItem',
    //     props: {},
    //     __config__: {
    //         label: '表单项',
    //         layout: 'oFormItem'
    //     }
    // }, {
    //     name: 'oInput',
    //     props: {
    //         value: '1'
    //     },
    //     __config__: {
    //         label: '输入框',
    //         layout: 'oFormItem'
    //     }
    // }, {
    //     name: 'oButton',
    //     props: {},
    //     __config__: {
    //         label: '按钮',
    //         layout: 'oFormItem',
    //         configShowMap: {
    //             attrs: {
    //                 type: {
    //                     label: '类型',
    //                     value: [ 'primary', 'success', 'info', 'warning', 'danger' ]
    //                 },
    //                 size: {
    //                     label: '尺寸',
    //                     value: [ 'small', 'medium', 'mini' ]
    //                 },
    //                 plain: {
    //                     label: '平铺',
    //                     value: false
    //                 },
    //                 round: {
    //                     label: '圆角按钮',
    //                     value: false
    //                 },
    //                 circle: {
    //                     label: '圆形按钮',
    //                     value: false
    //                 },
    //                 loading: {
    //                     label: '展示加载状态',
    //                     value: false
    //                 },
    //                 disabled: {
    //                     label: '禁用',
    //                     value: false
    //                 },
    //                 autofocus: {
    //                     label: '自动聚焦',
    //                     value: false
    //                 },
    //                 'native-type': {
    //                     label: '原生属性',
    //                     value: ['button', 'submit', 'reset']
    //                 },
    //                 icon: ''
    //             }
    //         }
    //     }
    // }, {
    //     name: 'oSwitch',
    //     props: {},
    //     __config__: {
    //         label: '开关',
    //         layout: 'oFormItem'
    //     }
    // }, {
    //     name: 'oDatePicker',
    //     props: {},
    //     __config__: {
    //         label: '日期',
    //         layout: 'oFormItem'
    //     }
    // }, {
    //     name: 'oTimePicker',
    //     props: {},
    //     __config__: {
    //         label: '时间',
    //         layout: 'oFormItem'
    //     }
    // }, {
    //     name: 'oSelect',
    //     props: {},
    //     __config__: {
    //         label: '下拉列表',
    //         layout: 'oFormItem'
    //     }
    // }, {
    //     name: 'oOption',
    //     props: {},
    //     __config__: {
    //         label: '下拉选项',
    //         layout: 'oFormItem'
    //     }
    // }, {
    //     name: 'oCheckbox',
    //     props: {},
    //     __config__: {
    //         label: '多选框',
    //         layout: 'oFormItem'
    //     }
    // }, {
    //     name: 'oRadioGroup',
    //     props: {},
    //     __config__: {
    //         label: '单选组',
    //         layout: 'oFormItem'
    //     }
    // }, {
    //     name: 'oRadio',
    //     props: {},
    //     __config__: {
    //         label: '单选',
    //         layout: 'oFormItem'
    //     }
    // }, {
    //     name: 'oTable',
    //     props: {},
    //     __config__: {
    //         label: '表格',
    //         layout: 'oFormItem'
    //     }
    // }, {
    //     name: 'oTableColumn',
    //     props: {},
    //     __config__: {
    //         label: '表格项',
    //         layout: 'oFormItem'
    //     }
    // }, {
    //     name: 'oPagination',
    //     props: {},
    //     __config__: {
    //         label: '分页',
    //         layout: 'oFormItem'
    //     }
    }
];

// 输入型组件 【左面板】
export const inputComponents = [];

// 选择型组件 【左面板】
export const selectComponents = [];

// 布局型组件 【左面板】
export const layoutComponents = [];
