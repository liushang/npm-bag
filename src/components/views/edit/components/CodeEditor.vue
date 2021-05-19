<template>
<el-dialog
  class="panel-dialog"
  :visible.sync="dialogVisible"
  width="80%"
  top="5vh"
  @close="close">
  <div class="field-box">
    <codemirror v-model="code" :options="cmOptions" ref="cmEditor"/>
  </div>
  <el-button @click="save" size="small" style="margin-top: 20px" type="primary">确定修改</el-button>
</el-dialog>
  <!-- Two-way Data-Binding -->

  <!-- Or manually control the data synchronization -->
  <!-- <codemirror
    ref="cmEditor"
    :value="code"
    :options="cmOptions"
    @ready="onCmReady"
    @focus="onCmFocus"
    @input="onCmCodeChange"
  /> -->
</template>

<script>
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/theme/base16-dark.css';
export default {
    data () {
        return {
            code: '',
            dialogVisible: true,
            cmOptions: {
                tabSize: 4,
                mode: 'text/javascript',
                theme: 'base16-dark',
                lineNumbers: true,
                line: true,
                smartIndext: true,
                indentUnit: 2
            }
        };
    },
    props: {
        dataStr: {
            type: String,
            default: 'fasdfs'
        }
    },
    methods: {
        onCmReady(cm) {
            console.log('the editor is readied!', cm);
        },
        onCmFocus(cm) {
            console.log('the editor is focused!', cm);
        },
        onCmCodeChange(newCode) {
            console.log('this is new code', newCode);
            this.code = newCode;
        },
        close() {
            this.$emit('close');
        },
        save() {
            this.code = this.code.replace(/'/g, "\"")
            console.log(this.code)
            let str = decodeURIComponent(encodeURIComponent(this.code))
            let newStr = `return ${str}`
            let newFun
            let err = false
            try {
                console.log(newStr)
                newFun = new Function(newStr)
            } catch (error) {
                err = true
                this.$message.error('代码编写有误请检查')
            }
            setTimeout(() => {
                !err && this.$emit('close', this.code);
            }, 100)
            
        }
    },
    computed: {
        codemirror() {
            return this.$refs.cmEditor.codemirror;
        }
    },
    mounted() {
        this.code = this.dataStr;
    }
};
</script>