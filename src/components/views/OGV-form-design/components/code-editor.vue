<template>
<el-dialog
  class="panel-dialog"
  :visible.sync="dialogVisible"
  width="80%"
  @close="close">
  <div class="field-box">
    <codemirror v-model="code" :options="cmOptions" ref="cmEditor"/>
  </div>
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
// import language js
import 'codemirror/mode/javascript/javascript.js';

// import theme style
import 'codemirror/theme/base16-dark.css';

// import more 'codemirror/some-resource...'

export default {
    data () {
        return {
            code: 'const a = 10',
            dialogVisible: true,
            cmOptions: {
                tabSize: 4,
                mode: 'text/javascript',
                theme: 'base16-dark',
                lineNumbers: true,
                line: true
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
            this.$emit('close', this.code);
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