<template>
<el-form :model="formData" :ref="formData" :label-width="labelWidth" :style="formStyle">
    <ogvdesign :configComponents="dataConfig" v-if="showDesign"></ogvdesign>
</el-form>
</template>
<script>
import formIns from './form';
export default {
    props: {
        formData: {},
        formConfig: {
            children: []
        },
        labelWidth: {},
        formStyle: {}
    },
    data() {
        return {
            showDesign: false,
            dataConfig: {
                children: []
            },
            data: {}
        };
    },
    mounted() {
        this.dataConfig = this.formConfig;
        this.data = this.formData;
        this.dataConfig = new formIns(this).componentConfig;
        console.log('form 拼装成数据');
        console.log(this.dataConfig);
        this.showDesign = true;
    }
};
</script>