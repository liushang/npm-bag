<template lang="html">
  <div class="config-main">
      <div class="projects">
        <el-row>
            <el-col :span="20">
                <el-select v-model="projectId" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in projectList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-select v-model="pageId" placeholder="请选择" size="small" @change="e => getModules(e, 1)">
                  <el-option
                    v-for="item in pages"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-select v-model="moduleId" placeholder="请选择" size="small" @change="e => getModuleDetail(e)">
                  <el-option
                    v-for="item in modules"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-input v-model="pageName" style="width: 120px" size="small" v-show="pageId"></el-input>
                <el-input v-model="moduleName" style="width: 120px" size="small" v-show="moduleId"></el-input>
            </el-col>
            <el-col :span="4">
                <el-button size="small" @click="save">保存</el-button>
                <!-- <el-button size="small">更新</el-button> -->
            </el-col>
        </el-row>
      </div>
      <Home :moduleChangeDetail="moduCf" :configData="configData"></Home>
      <!-- <practice :moduleChangeDetail="moduCf" :configData="{}"></practice> -->
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
import Home from './Home.vue'
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
            pageName: '',
            moduCf: '',
            configData: {
              'oContainer': {
                renderFun: function(o) {
                  return o
                },
                attrMap: {
                //   'elInput_value': 'lcData.form.input'
                },
                methods: {
                },
                insData: {
                    loading: false,
                    clientShow: false,
                    copyRights: [{
                        label: '不限', value: 1
                    }, {
                        label: '正版', value: 2
                    }, {
                        label: '独家', value: 3
                    }, {
                        label: '合作', value: 4
                    }, {
                        label: '搬运', value: 5
                    }],
                    payTypes: [{
                        label: '不限', value: -1
                    }, {
                        label: '免费', value: 2
                    }, {
                        label: '付费观看', value: 6
                    }, {
                        label: '付费抢先', value: 7
                    }, {
                        label: '付费观看（大会员付费）', value: 8
                    }, {
                        label: '付费抢先（大会员付费）', value: 9
                    }, {
                        label: '仅非正片付费', value: 11
                    }],
                    allowBps: [{
                        label: '不限', value: -1
                    }, {
                        label: '允许', value: 1
                    }, {
                        label: '不允许', value: 3
                    }],
                    areas: [{
                        label: '全球', value: 1
                    }, {
                        label: '全球禁止', value: 2
                    }, {
                        label: '大陆', value: 3
                    }, {
                        label: '香港', value: 3
                    }, {
                        label: '澳门', value: 4
                    }, {
                        label: '台湾', value: 5
                    }, {
                        label: '韩国', value: 6
                    }, {
                        label: '马来西亚/新加坡', value: 7
                    }, {
                        label: '其他(除日本)', value: 8
                    }],
                    // areas: [{
                    //     label: '全球', value: 1
                    // }, {
                    //     label: '全球禁止', value: 2
                    // }, {
                    //     label: '全球禁止1', value: 3
                    // }],
                    filter: {
                        pn: 1,
                        season_type: 1,
                        keyword: '',
                        copyright: 1,
                        status: -1,
                        allow_bp: -1,
                        limit_groups: 1
                    },
                },
                'ElOption_792126': {
                  attrMap: {},
                  renderFun: function(x) {
                    return this.lcData.areas.map(i => {
                        let vv = this.deepClone(x)
                        vv.label = i.label;
                        vv.value = i.value;
                        return vv
                    })
                    // console.log('gggg')
                    // console.log(gg);
                    // return gg
                  },
                  nativeOn: {
                      click: function(e) {
                          this.lcData.filter.limit_groups = e.currentTarget.value
                      }
                  }
                },
                'ElOption_512646': {
                  attrMap: {},
                  renderFun: function(x) {
                    return this.lcData.copyRights.map(i => {
                        let vv = this.deepClone(x)
                        vv.label = i.label;
                        vv.value = i.value;
                        return vv
                    })
                  },
                  nativeOn: {
                      click: function(e) {
                          this.lcData.filter.copyright = e.currentTarget.value
                      }
                  }
                },
                'ElOption_650915': {
                  attrMap: {},
                  renderFun: function(x) {
                    return this.lcData.payTypes.map(i => {
                        let vv = this.deepClone(x)
                        vv.label = i.label;
                        vv.value = i.value;
                        return vv
                    })
                  },
                  nativeOn: {
                      click: function(e) {
                          this.lcData.filter.status = e.currentTarget.value
                      }
                  }
                },
                'ElOption_232249': {
                  attrMap: {},
                  renderFun: function(x) {
                    return this.lcData.allowBps.map(i => {
                        let vv = this.deepClone(x)
                        vv.label = i.label;
                        vv.value = i.value;
                        return vv
                    })
                  },
                  nativeOn: {
                      click: function(e) {
                          this.lcData.filter.allow_bp = e.currentTarget.value
                      }
                  }
                },
                'ElInput_741168': {
                //   attrMap: {},
                //   renderFun: function(x) {
                //     x.value = this.lcData.filter.keyword
                //   },
                //   on: {
                //       input: function(e) {
                //           this.lcData.filter.keyword = e
                //       }
                //   }
                },
                'ElTableColumn_600689': {
                  renderFun: function(x) {
                    x.value = this.lcData.filter.keyword
                  },
                  on: {
                      click: function(e) {
                          console.log('click')
                          console.log(e)
                      }
                  },
                  nativeOn: {
                      click: function(e) {
                          console.log('nativeOn')
                          console.log(e)
                      }
                  }
                },
              },
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
        getProjects() {
            this.$axios({
                url: 'http://uat-bangumi-mng.bilibili.co/api/getProjects'
            }).then(({ data, code }) => {
                console.log(data)
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
                url: 'http://uat-bangumi-mng.bilibili.co/api/getPageByProjectId',
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
        getModuleDetail(val) {
            this.$axios({
                url: 'http://uat-bangumi-mng.bilibili.co/api/getModuleDetailByModuleId',
                params: {
                    moduleId: val
                }
            }).then(({ data, code }) => {
                if (data && code === 0) {
                    // console.log(data);
                    // let json = JSON.stringify(data[0].basicConfig, function(key, value) {
                    //     if (typeof value === 'function') {
                    //         return value.toString();
                    //     } else {
                    //         return value;
                    //     }
                    // });
                    if (data[0] && data[0].basic_config) {
                        // this.moduCf = data[0].basic_config.replace(/\s/g, '');
                        this.moduCf = decodeURIComponent(data[0].basic_config);
                        console.log(this.moduCf);
                        // localStorage.setItem('drawingItems', this.moduCf);
                    }
                    let item = this.modules.find(x => x.value === val && val !== 0);
                    console.log(item);
                    this.moduleName = item ? item.label : '';
                }
            });
        },
        getModules(val, type) {
            this.$axios({
                url: 'http://uat-bangumi-mng.bilibili.co/api/getModuleByPageId',
                params: {
                    page_id: val
                }
            }).then(({ data, code }) => {
                if (data && code === 0) {
                    if (type) {
                        this.moduleId = 0;
                        this.moduleName = '';
                    }
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
                    let item = this.pages.find(x => x.value === val && val !== 0);
                    this.pageName = item ? item.label : '';
                }
            });
        },
        getConfig() {
            this.$axios({
                url: 'http://uat-bangumi-mng.bilibili.co/api/getConfig'
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
            const module = localStorage.getItem('drawingItems');
            this.$axios({
                method: 'post',
                url: 'http://uat-bangumi-mng.bilibili.co/api/updateModule',
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
        save() {
            // if (!this.moduleName && !this.moduleId) {
            //     this.showAddName = true;
            //     return;
            // }
            const module = localStorage.getItem('drawingItems');
            console.log(module);
            this.$axios({
                method: 'post',
                url: 'http://uat-bangumi-mng.bilibili.co/api/updateModule',
                params: {
                    project_id: this.projectId,
                    page_id: 18 || this.pageId,
                    module_id: 48 || this.moduleId,
                    module_name: this.moduleName,
                    page_name: this.pageName,
                    basicConfig: encodeURIComponent(module)
                }
            }).then(() => {
                this.newGetData();
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
