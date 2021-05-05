import { allHtmlNode } from './index'

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

const commonComponent = {
  styles: styleProperty
};
export const defaultKV = {
  ...allHtmlNode.reduce((pre, item, index) => {
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
  ElButton: {
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
              value: [ true, false ]
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