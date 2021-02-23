<template>
<div>
<ogvdesign :configComponents="configComponents1" :configData="configData" v-if="showDesign"></ogvdesign>
</div>
</template>

<script>
import indexIns from './o-button';
export default {
    data() {
        return {
            showDesign: false,
            configComponents: [],
            configComponents1: [],
            configData: [],
            myProp: '我是',
            clientShow: true,
            formData: {
                select: '2'
            },
            formOne: {
                select1: '1'
            },
            vForArr: [1, 2],
            value: 1234546577
        };
    },
    render(h) {

    },
    methods: {
        updateMsg() {
            console.log('updateMsg');
        },
        change() {
            console.log('我是change');
            console.log(this.formOne);
        }
    },
    mounted() {
        this.configComponents1 = new indexIns(this).config;
        this.showDesign = true;
    }
};
</script>