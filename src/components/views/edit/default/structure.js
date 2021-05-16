import { allHtmlNode } from './index'

const htmlDefaultNode = {
  ...allHtmlNode.map(x => {
      return {
          style: {},
          attrs: {},
          classes: {},
          on: {},
          children: [],
          renderFun: function (x) { return x },
          scopedSlots: {},
          directives: [],
          slot: ''
      }
  }),
  style: {
      style: {},
      attrs: {},
      on: {},
      children: [".abcde{color: red}"],
      renderFun: function (x) { return x },
      scopedSlots: {},
      directives: [],
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
      style: {}
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
      renderFun: function(x) {
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
      renderFun: function (x){
        return x  
      },
  },
  ElTable: {
      attrs: {},
      style: {},
      children: [],
      on: {},
      nativeOn: {},
      scopedSlots: {},
      renderFun: function (x){
          x.data = this.lcData.list || [];
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
          value: 1,
          size: 'mini'
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
      renderFun: function(x) {
          return (this.lcData.elOption_items || []).map(function (i) {
              var vv = deepClone(x);
              vv.label = i.label;
              vv.value = i.value;
              return vv;
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
          }
      },
      renderFun: function(x) {
          return (this.lcData.elRadio_items || []).map(function (i) {
              var vv = deepClone(x);
            vv.label = +i.value;
            vv.values = [i.label];
            return vv;
          });
      },
  },
  ElButton: {
      attrs: {
          size: 'small',
          type: 'primary'
      },
      style: {},
      children: [ '确定' ],
      on: {
          click: function(e) {
              e.preventDefault();
          }
      },
      nativeOn: {},
      renderFun: function (x) {
          return x
      },
  },
  ElDialog: {
      children: [],
      style: {},
      attrMap: {
          showDialog: ''
      },
      attrs: {
          title: '提示' 
      },
      on: {
          close: function() {
              this.lcData.showDialog = false
          }
      },
      nativeOn: {},
      renderFun: function(x) {
          x.visible = this.lcData.showDialog;
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
          x.value = this.lcData.elDatePicker_value;
          return x
      },
      style: {},
  },
  ElSwitch: {
    children: [],
    style: {},
    attrMap: {
        elSwitch_value: ''
    },
    attrs: {},
    on: {
        change: function(e) {
            this.lcData.elSwitch_value = e
        }
    },
    nativeOn: {},
    renderFun: function(x) {
        x.value = this.lcData.elSwitch_value
        return x;
    },
  },
  ElCheckbox: {
    children: [],
    style: {},
    attrMap: {
        elCheckbox_value: ''
    },
    attrs: {},
    on: {
        change: function(e) {
            this.lcData.elCheckbox_value = e
        }
    },
    nativeOn: {},
    renderFun: function(x) {
        x.value = this.lcData.elCheckbox_value
        return x;
    },
  },
}
const otherCompNode = {
  codemirror: {
      attrs: {},
      children: [],
      attrMap: {
          elDatePicker_value: ''
      },
      on: {},
      nativeOn: {},
      renderFun: function(x) {
          x.option = {
              tabSize: 4,
              mode: "text/javascript",
              theme: "base16-dark",
              lineNumbers: true,
              line: true,
              smartIndext: true,
              indentUnit: 2
          }
          return x
      },
  }
}
// todo 增加其他元素
export const defaultNode = {
  ...htmlDefaultNode,
  ...elDefaultNode,
  ...otherCompNode
};