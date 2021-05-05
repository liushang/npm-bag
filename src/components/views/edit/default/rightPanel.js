// 表单属性【右面板】
export const formConf = {
  basicData: []
};
export const allHtmlNode = [ '!DOCTYPE', 'html', 'title', 'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'abbr', 'address', 'b', 'bdi', 'bdo', 'blockquote', 'cite', 'code', 'del', 'dfn', 'em', 'i', 'ins', 'kbd', 'mark', 'meter', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'small', 'srong', 'sub', 'time', 'u', 'var', 'wbr', 'from', 'input', 'textarea', 'button', 'select', 'optgroup', 'option', 'label', 'fieldset', 'legend', 'datalist', 'keygen', 'output', 'iframe', 'img', 'map', 'area', 'canvas', 'figcaption', 'figure', 'audio', 'source', 'track', 'video', 'a', 'link', 'nav', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'menu', 'command', 'table', 'caption', 'th', 'tr', 'td', 'thead', 'tbody', 'tfoot', 'col', 'colgroup', 'style', 'div', 'span', 'header', 'footer', 'section', 'article', 'aside', 'details', 'dialog', 'summary', 'head', 'meta', 'base', 'basefont', 'script', 'noscript', 'applet', 'enbed', 'object', 'param']

// element 组件

export function getElementList (list) {
  let elCommonList = [ 'ElRow', 'ElCol', 'ElInput', 'ElSelect', 'ElOption', 'ElButton', 'ElTable', 'ElForm', 'ElItem', 'ElFormItem', 'ElRadioGroup', 'ElRadio', 'ElDatePicker' ]
  let elRareList = []
  let elList = []
  for(let i in list) {
      if (i.startsWith('El')) {
          if (elCommonList.includes(i)) {
              elList.push({
                  name: i,
                  props: {},
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
          }
      })
  })
  return elList;
}
export function getAntDesignList (list) {
  // let elCommonList = [ 'ElRow', 'ElCol', 'ElInput', 'ElSelect', 'ElOption', 'ElButton', 'ElTable', 'ElForm', 'ElItem', 'ElFormItem', 'ElRadioGroup', 'ElRadio', 'ElDatePicker' ]
  let elRareList = []
  let elList = []
  for(let i in list) {
      if (i.startsWith('A')) {
              elList.push({
                  name: i,
                  props: {},
              })
      }
  }
  return elList;
}
export function getOtherComList (list) {
  let elRareList = []
  let elList = []
  for(let i in list) {
      if (!i.startsWith('A') && !i.startsWith('El') && !['oContainer', 'oRow'].includes(i)) {
              elList.push({
                  name: i,
                  props: {},
              })
              elRareList.push(i)
      }
  }
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
      }
  }))
  list.push({
      title: '不常用html',
      list: rareHtmlLabel.map(i => {
          return {
              name: i,
              props: {},
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
  }
];

// 输入型组件 【左面板】
export const inputComponents = [];

// 选择型组件 【左面板】
export const selectComponents = [];

// 布局型组件 【左面板】
export const layoutComponents = [];
