<template lang="html">
  <div class="config-main">
      <div class="projects">
        <el-row>
            <el-col :span="20">
                <el-select v-model="projectId" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in projectList"
                    :key="item.value"
                    :label="item.label + '(' + item.value + ')'"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-select v-model="pageId" placeholder="请选择" size="small" @change="e => getModules(e, 1)">
                  <el-option
                    v-for="item in pages"
                    :key="item.value"
                    :label="item.label + '(' + item.value + ')'"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-select v-model="moduleId" placeholder="请选择" size="small" @change="e => getModuleDetail(e)">
                  <el-option
                    v-for="item in modules"
                    :key="item.value"
                    :label="item.label + '(' + item.value + ')'"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-input v-model="pageName" style="width: 120px" size="small" v-show="pageId" placeholder="请输入页面名"></el-input>
                <el-input v-model="moduleName" style="width: 120px" size="small" v-show="moduleId" placeholder="请输入模块名"></el-input>
            </el-col>
            <el-col :span="4">
                <el-button size="small" @click="save" type="primary">保存</el-button>
                <el-button size="small" @click="del">删除</el-button>
            </el-col>
        </el-row>
      </div>
      <Home :moduleChangeDetail="moduCf" :configData="configData" @saveModuleCode="saveModuleCode"></Home>
      <!-- <practice :moduleChangeDetail="moduCf" :configData="{}"  @saveModuleCode="saveModuleCode"></practice> -->
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

<script type="module">
import Home from "./Home.vue"
export default {
    name: "index",
    data() {
        return {
            projectList: [],
            projectId: 1,
            pageId: 1,
            pages: [{
                label: "-- 新增 --",
                value: 0
            }],
            moduleId: 7,
            modules: [{
                label: "-- 新增 --",
                value: 0
            }],
            showAddName: false,
            moduleName: "",
            pageName: "",
            moduCf: "",
            configData: {
              "oContainer": {},
            }
        };
    },
    mounted() {
        this.getProjects();
        this.getConfig();
        this.getPage(this.projectId);
    },
    components: { Home },
    watch: {
        projectId(val) {
            if (val) {
                this.getPage(val);
            }
        }
    },
    methods: {
        saveModuleCode(code, name, nodeId) {
            code = JSON.stringify(code, function(key, value) {
                if (typeof value === 'function') {
                    return value.toString();
                } else {
                    return value;
                }
            })
            this.$axios({
                method: "post",
                url: "http://uat-manager.bilibili.co/ogv/form/api/node/saveNode",
                params: {
                    projectId: +this.projectId,
                    nodeName: name,
                    nodeId,
                    nodeConfig: encodeURIComponent(code)
                }
            }).then(({ code }) => {
                if (code === 0) {
                    this.$message.success('保存成功')
                }
            });
        },
        getProjects() {
            this.$axios({
                url: "http://uat-manager.bilibili.co/ogv/form/api/getProjects"
            }).then(({ data, code }) => {
                if (data && code === 0) {
                    this.projectList = data.map(x => {
                        return {
                            label: x.project_name,
                            value: x.project_id
                        };
                    });
                    if (this.pageId) {
                        this.getModules(this.pageId)
                    }
                    if (this.moduleId) {
                        this.getModuleDetail(this.moduleId)
                    }
                }
            });
        },
        getPage(val) {
            this.$axios({
                url: "http://uat-manager.bilibili.co/ogv/form/api/getPageByProjectId",
                // url: "http://uat-bangumi-mng.bilibili.co/ogv/form/api/getPageByProjectId",
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
                        label: "-- 新增 --",
                        value: 0
                    });
                    this.pages = data;
                }
            });
        },
        getModuleDetail(val) {
            this.$axios({
                url: "http://uat-manager.bilibili.co/ogv/form/api/getModuleDetailByModuleId",
                // url: "http://uat-bangumi-mng.bilibili.co/ogv/form/api/getModuleDetailByModuleId",
                params: {
                    moduleId: val
                }
            }).then(({ data, code }) => {
                if (data && code === 0) {
                    if (data[0] && data[0].basic_config) {
                        // this.moduCf = data[0].basic_config.replace(/\s/g, "");
                        this.moduCf = decodeURIComponent(data[0].basic_config);
                        // console.log(this.moduCf);
                        // localStorage.setItem("drawingItems", this.moduCf);
                    }
                    let item = this.modules.find(x => x.value === val && val !== 0);
                    this.moduleName = item ? item.label : "";
                }
            });
        },
        getModules(val, type) {
            this.$axios({
                url: "http://uat-manager.bilibili.co/ogv/form/api/getModuleByPageId",
                // url: "http://uat-bangumi-mng.bilibili.co/ogv/form/api/getModuleByPageId",
                params: {
                    page_id: val
                }
            }).then(({ data, code }) => {
                if (data && code === 0) {
                    if (type) {
                        this.moduleId = 0;
                        this.moduleName = "";
                    }
                    data = data.map(x => {
                        return {
                            label: x.module_name,
                            value: x.module_id
                        };
                    });
                    data.unshift({
                        label: "-- 新增 --",
                        value: 0
                    });
                    this.modules = data;
                    let item = this.pages.find(x => x.value === val && val !== 0);
                    this.pageName = item ? item.label : "";
                }
            });
        },
        getConfig() {
            // this.$axios({
            //     url: "http://uat-bangumi-mng.bilibili.co/ogv/form/api/getConfig"
            // }).then(e => {});
        },
        saveModule() {
            const module = localStorage.getItem("drawingItems");
            this.$axios({
                method: "post",
                url: "http://uat-bangumi-mng.bilibili.co/ogv/form/api/updateModule",
                // url: "http://uat-manager.bilibili.co/ogv/form/api/updateModule",
                params: {
                    project_id: +this.projectId,
                    page_id: +this.pageId,
                    module_id: +this.moduleId,
                    module_name: this.moduleName,
                    page_name: this.pageName,
                    basicConfig: encodeURIComponent(module)
                }
            }).then(() => {
                this.newGetData();
            });
        },
        newGetData() {
            this.getPage(this.projectId);
            this.getModules(this.pageId);
            this.getModuleDetail(this.moduleId);
        },
        // 新增
        save() {
            if (!this.moduleName && !this.moduleId) {
                this.showAddName = true;
                return;
            }
            const module = localStorage.getItem("drawingItems");
            // this.$axios({
            //     url: "http://uat-manager.bilibili.co/ogv/form/api/setProjects",
            // }).then(() => {})
            this.$axios({
                method: "post",
                url: "http://uat-manager.bilibili.co/ogv/form/api/updateModule",
                params: {
                    project_id: this.projectId,
                    page_id: this.pageId,
                    module_id: this.moduleId,
                    module_name: this.moduleName,
                    page_name: this.pageName,
                    basicConfig: encodeURIComponent(module),
                    basicConfigsssss: module
                }
            // this.$axios({
            //     method: "post",
            //     url: "http://uat-manager.bilibili.co/ogv/form/api/updateModule",
            //     params: {
            //         project_id: 1,
            //         page_id: 18,
            //         module_id: 60,
            //         module_name: '默认modulename',
            //         page_name: '默认pagename',
            //         basicConfig: encodeURIComponent(module),
            //         basicConfigsssss: module
            //     }
            }).then(() => {
                this.$message.success('保存成功')
                setTimeout(() => {
                    this.newGetData();
                }, 100)
            });
        },
        del() {
            this.$axios({
                method: "post",
                url: "http://uat-manager.bilibili.co/ogv/form/api/node/delNodeById",
                params: {
                    nodeId: 8
                }
            }).then(() => {
                this.$message.success('删除成功')
                setTimeout(() => {
                }, 100)
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
        margin: 10px 10px 10px 0;
    }
}
</style>
