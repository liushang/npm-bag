<template>
    <el-dialog
      width="500px"
      :visible="true"
      :modal-append-to-body="false"
      title="起个名字吧"
      @close="close"
    >
      <el-row :gutter="15">
        <el-form
          ref="elForm"
          :model="formData"
          :rules="rules"
          size="medium"
          label-width="100px"
        >
          <el-col :span="24">
            <el-form-item label="文件名" prop="name">
              <el-input v-model="formData.name" placeholder="请输入文件名" clearable />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <div slot="footer">
        <el-button @click="close">
          取消
        </el-button>
        <el-button type="primary" @click="handelConfirm">
          确定
        </el-button>
      </div>
    </el-dialog>
</template>
<script>
export default {
    props: ['showFileName'],
    data() {
        return {
            formData: {
                name: '',
            },
            rules: {
                name: [{
                    required: true,
                    message: '请输入名字',
                    trigger: 'blur'
                }],
            },
        };
    },
    methods: {
        close(e) {
            this.$emit('close');
        },
        handelConfirm() {
            this.$refs.elForm.validate(valid => {
                if (!valid) return;
                console.log({ ...this.formData })
                this.$emit('confirm', { ...this.formData });
                this.close();
            });
        }
    }
};
</script>
