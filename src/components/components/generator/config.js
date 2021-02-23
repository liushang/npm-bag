// 表单属性【右面板】
export const formConf = {
    basicData: []
};

// o-组件

export const oComponents = [
    {
        name: 'oContainer',
        props: {},
        __config__: {
            label: '容器',
            layout: 'oFormItem'
        }
    }, {
        name: 'oRow',
        props: {},
        __config__: {
            label: '行',
            layout: 'oFormItem'
        }
    }, {
        name: 'oCol',
        props: {},
        __config__: {
            label: '栏',
            layout: 'oFormItem'
        }
    }, {
        name: 'oForm',
        props: {},
        __config__: {
            label: '表单',
            layout: 'oFormItem'
        }
    }, {
        name: 'oFormItem',
        props: {},
        __config__: {
            label: '表单项',
            layout: 'oFormItem'
        }
    }, {
        name: 'oInput',
        props: {
            value: '323'
        },
        __config__: {
            label: '输入框',
            layout: 'oFormItem'
        }
    }, {
        name: 'oButton',
        props: {},
        __config__: {
            label: '按钮',
            layout: 'oFormItem',
            configShowMap: {
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
                        value: false
                    },
                    round: {
                        label: '圆角按钮',
                        value: false
                    },
                    circle: {
                        label: '圆形按钮',
                        value: false
                    },
                    loading: {
                        label: '展示加载状态',
                        value: false
                    },
                    disabled: {
                        label: '禁用',
                        value: false
                    },
                    autofocus: {
                        label: '自动聚焦',
                        value: false
                    },
                    'native-type': {
                        label: '原生属性',
                        value: ['button', 'submit', 'reset']
                    },
                    icon: ''
                }
            }
        }
    }, {
        name: 'oSwitch',
        props: {},
        __config__: {
            label: '开关',
            layout: 'oFormItem'
        }
    }, {
        name: 'oDatePicker',
        props: {},
        __config__: {
            label: '日期',
            layout: 'oFormItem'
        }
    }, {
        name: 'oTimePicker',
        props: {},
        __config__: {
            label: '时间',
            layout: 'oFormItem'
        }
    }, {
        name: 'oSelect',
        props: {},
        __config__: {
            label: '下拉列表',
            layout: 'oFormItem'
        }
    }, {
        name: 'oOption',
        props: {},
        __config__: {
            label: '下拉选项',
            layout: 'oFormItem'
        }
    }, {
        name: 'oCheckbox',
        props: {},
        __config__: {
            label: '多选框',
            layout: 'oFormItem'
        }
    }, {
        name: 'oRadioGroup',
        props: {},
        __config__: {
            label: '单选组',
            layout: 'oFormItem'
        }
    }, {
        name: 'oRadio',
        props: {},
        __config__: {
            label: '单选',
            layout: 'oFormItem'
        }
    }, {
        name: 'oTable',
        props: {},
        __config__: {
            label: '表格',
            layout: 'oFormItem'
        }
    }, {
        name: 'oTableColumn',
        props: {},
        __config__: {
            label: '表格项',
            layout: 'oFormItem'
        }
    }, {
        name: 'oPagination',
        props: {},
        __config__: {
            label: '分页',
            layout: 'oFormItem'
        }
    }
];

// 输入型组件 【左面板】
export const inputComponents = [];

// 选择型组件 【左面板】
export const selectComponents = [];

// 布局型组件 【左面板】
export const layoutComponents = [];
