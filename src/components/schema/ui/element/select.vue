<template>
<el-select v-model="formData[keyword]" placeholder="请选择分区" size="small" clearable @change="select">
	<el-option :label="item.label || item" :value="item.value || index" v-for="(item, index) in optionList" :key="index"> </el-option>
</el-select>
</template>
<script>
export default {
    props: {
        formData: {
            type: Object,
            default: () => {
                return { key: 0 };
            }
        },
        variable: {},
        keyword: {
            type: String,
            default: '0'
        },
        optionList: {
            type: Array | String,
            default: () => []
        }
    },
    data() {
        return {
            key: ''
        };
    },
    methods: {
        select(e) {
            this.$emit('change', e);
        }
    }
};
</script>