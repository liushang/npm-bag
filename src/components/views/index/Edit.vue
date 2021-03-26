<template lang="html">
  <div class="config-main">
      <div class="projects">
        <el-row>
            <el-col :span="18">
                <el-select v-model="projectId" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in projectList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-select v-model="pageId" placeholder="请选择" size="small" @change="e => getModules(e)">
                  <el-option
                    v-for="item in pages"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-select v-model="moduleId" placeholder="请选择" size="small" @change="e => getModules(e)">
                  <el-option
                    v-for="item in modules"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-col>
            <el-col :span="6">
                <el-button size="small" @click="save">保存</el-button>
                <!-- <el-button size="small">更新</el-button> -->
            </el-col>
        </el-row>
      </div>
      <practice></practice>
      <el-dialog :visible.sync="showAddName" width="500px" title="添加名字" @close="closeWeight">
          <el-form style="text-align:center" label-width="120px">
              <el-form-item label="页面" style="width: 340px" v-if="!pageId">
                  <el-input v-model="pageName"></el-input>
              </el-form-item>
              <el-form-item label="模块" style="width: 340px" v-if="!moduleId">
                  <el-input v-model="moduleName"></el-input>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="closeWeight">取 消</el-button>
            <el-button size="small" type="primary" @click="saveModule" v-if="moduleName && (pageName || pageId)">提 交</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
import practice from './Home'
export default {
    name: 'index',
    data() {
        return {
            projectList: [],
            projectId: 1,
            pageId: 0,
            pages: [{
                label: '-- 新增 --',
                value: 0
            }],
            moduleId: 0,
            modules: [{
                label: '-- 新增 --',
                value: 0
            }],
            showAddName: false,
            moduleName: '',
            pageName: ''
        };
    },
    mounted() {
        this.getProjects();
        this.getConfig();
        this.getPage(this.projectId);
    },
    watch: {
        projectId(val) {
            if (val) {
                this.getPage(val);
            }
        }
    },
    components: { practice },
    methods: {
        getProjects() {
            this.$axios({
                url: 'bangumi-mng.bilibili.co/api/getProjects'
            }).then(({ data, code }) => {
                if (data && code === 0) {
                    this.projectList = data.map(x => {
                        return {
                            label: x.project_name,
                            value: x.project_id
                        };
                    });
                }
            });
        },
        getPage(val) {
            this.$axios({
                url: 'bangumi-mng.bilibili.co/api/getPageByProjectId',
                params: {
                    project_id: val
                }
            }).then(({ data, code }) => {
                if (data && code === 0) {
                    data = data.map(x => {
                        return {
                            label: x.page_name,
                            value: x.page_id
                        };
                    });
                    data.unshift({
                        label: '-- 新增 --',
                        value: 0
                    });
                    this.pages = data;
                }
            });
        },
        getModules(val) {
            this.$axios({
                url: 'bangumi-mng.bilibili.co/api/getModuleByPageId',
                params: {
                    page_id: val
                }
            }).then(({ data, code }) => {
                if (data && code === 0) {
                    data = data.map(x => {
                        return {
                            label: x.module_name,
                            value: x.module_id
                        };
                    });
                    data.unshift({
                        label: '-- 新增 --',
                        value: 0
                    });
                    this.modules = data;
                }
            });
        },
        getConfig() {
            this.$axios({
                url: 'bangumi-mng.bilibili.co/api/getConfig'
            }).then(e => {
                console.log(e);
            });
        },
        saveModule() {
            // if (!this.moduleName || !this.moduleId) {
            //     this.showAddName = true;
            // }
            // const module = localStorage.getItem('drawingItems');
            // console.log(module);
            this.$axios({
                url: 'bangumi-mng.bilibili.co/api/addModule',
                params: {
                    project_id: +this.projectId,
                    page_id: +this.pageId,
                    module_id: +this.moduleId,
                    module_name: this.moduleName,
                    page_name: this.pageName
                }
            });
        },
        save() {
            if (!this.moduleName || !this.moduleId) {
                this.showAddName = true;
            }
            const module = localStorage.getItem('drawingItems');
            console.log(module);
            this.$axios({
                url: 'bangumi-mng.bilibili.co/api/updateModule',
                params: {
                    project_id: this.projectId,
                    page_id: this.pageId,
                    module_id: this.moduleId,
                    module_name: this.moduleName,
                    page_name: this.pageName

                }
            });
        },
        closeWeight() {
            this.showAddName = false;
        }
    }
};
</script>

<style lang="less">
.config-main{
    .projects{
        margin: -10px 10px 10px 0;
    }
    .el-dialog__body {
        height: 100px;
    }
}
</style>
