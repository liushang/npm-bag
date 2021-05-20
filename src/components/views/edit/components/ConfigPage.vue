<template>
<div class="config-page">
    <div style="margin: 10px 0 15px">
      <div style="margin: 10px 0 0">当前处于{{metaData[metaData.length - 1].name}}节点</div>
      您可使用 <el-input v-model="moduledId" size="mini" style="width: 80px" @keyup.enter.native="getModuleDetail(moduledId)" placeholder="输入配置页面id"></el-input> ({{moduleName}})配置
    </div>
    <ogvdesign :constructure="dataConfig" v-if="dataConfig" :propData="propData" :metaData="metaData"></ogvdesign>
</div>
</template>

<script>
import {
    getDrawingList,
} from '../../../utils/db';
export default {
  props: {
    propData: {
      type: Object,
      default: () => {}
    },
    metaData: {
      type: Array,
      default: () => {}
    }
  },
  data() {
      return {
        dataConfig: null,
        moduledId: 57,
        moduleName: ''
      }
  },
  mounted() {
      this.getModuleDetail(this.moduleId);
  },
  watch: {
     moduledId(val) {
       this.getModuleDetail(val)
     },
     // 节点list
     metaData(val) {
       console.log('当前list变更')
       console.log(val)
     }
  },
  methods: {
      getModuleDetail(val) {
          this.$axios({
              url: 'http://uat-manager.bilibili.co/ogv/form/api/getModuleDetailByModuleId',
              params: {
                  moduleId: val || 57
              }
          }).then(({ data, code }) => {
              if (data && code === 0) {
                  if (data[0] && data[0].basic_config) {
                      this.moduCf = decodeURIComponent(data[0].basic_config);
                      this.dataConfig = getDrawingList(this.moduCf)[0];
                      this.dataConfig.props.env = 'prod'
                      this.moduleName = data[0].module_name
                  }
              }
          });
      },
  }
}
</script>

<style>

</style>