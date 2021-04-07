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

<script type="module">
import Home from "./Home.vue"
import Vue from 'vue'
export default {
    name: "index",
    data() {
        return {
            projectList: [],
            projectId: 1,
            pageId: 18,
            pages: [{
                label: "-- 新增 --",
                value: 0
            }],
            moduleId: 53,
            modules: [{
                label: "-- 新增 --",
                value: 0
            }],
            showAddName: false,
            moduleName: "",
            pageName: "",
            moduCf: "",
            configData: {
              "oContainer": {
                renderFun: function(o) {
                  return o
                },
                attrMap: {
                //   "elInput_value": "lcData.form.input"
                },
                methods: {
                    mounted() {
                        console.log("哒哒哒哒哒哒多");console.log(this.getData())
                    },
                    downloadCode({ batch_token }) {
                        window.open(`http://${window.location.href.indexOf("uat-") > -1 ? "uat-" : ""}${couponCodeDownloadUrl}?batch_token=${batch_token}`);
                    },
                    freeze({id, batch_token}, type) {
                        const text = type === 1 ? "发放冻结后，该券所有渠道停止且不可解冻，是否确认发放冻结？" : "使用冻结后，获得该券所有用户不可使用该券且不可解冻，是否确认使用冻结？";
                        this.$confirm(text, "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        }).then(() => {
                            this.$axios({
                                method: "post",
                                url: type === 1 ? couponIssueFreezeUrl : couponUseFreezeUrl,
                                params: {
                                    coupon_id: id,
                                    batch_token,
                                    freeze_status: 1
                                },
                                include: true
                            }).then(({ code, data }) => {
                                if (data && code === 0) {
                                    this.$message.success(`冻结成功`);
                                    this.getData();
                                } else {
                                    this.$message({
                                        showClose: true,
                                        type: "error",
                                        message: (data && data.message) || "接口开小差了，请稍后再试"
                                    });
                                }
                            });
                        });
                    },
                    getData(pn) {
                        const { id, status, batch_status, timeRange, batch_title, operator, order_by_id, order_by_receive_start } = this.lcData.form;
                        const [ receive_start, receive_end ] = timeRange || [];
                        this.$axios({
                            url: "manager.bilibili.co/pgc/admin/season/platform/coupon/batch/page",
                            params: {
                                id,
                                status,
                                batch_status,
                                batch_title,
                                operator,
                                receive_start,
                                receive_end,
                                ps: this.ps,
                                pn: pn || 1,
                                order_by_id,
                                order_by_receive_start
                            }
                        }).then(({ code, data }) => {
                            if (code === 0 && data) {
                                const { items, page: { size, total } } = data;
                                this.lcData.couponList = items;
                                this.lcData.ps = size;
                                this.lcData.pn = pn || 1;
                                this.lcData.totalCount = total;
                            } else {
                                this.$message({
                                    showClose: true,
                                    type: "error",
                                    message: (data && data.message) || "接口开小差了，请稍后再试"
                                });
                            }
                        }).catch(() => {});
                    },
                    addNum({ id }) {
                        this.addNumModal = true;
                        this.choosedId = id;
                    },
                    confirmAddNum() {
                        if (!this.addLoading) {
                            this.addLoading = true;
                        } else {
                            return;
                        }
                        this.$axios({
                            method: "post",
                            url: couponAddNumUrl,
                            params: {
                                coupon_id: this.choosedId,
                                incre_num: +this.incre_num
                            },
                            loading: true,
                            include: true
                        }).then(({ code }) => {
                            this.addLoading = false;
                            if (code === 0) {
                                this.addNumModal = false;
                                this.$message.success("追加成功");
                                this.getData();
                            }
                        }).catch(() => {
                            this.addLoading = false;
                        });
                    },
                    reset() {
                        this.lcData.form = {
                            batch_title: "",
                            timeRange: [],
                            batch_status: -1,
                            id: "",
                            operator: "",
                            status: -1,
                            order_by_id: 0,
                            order_by_receive_start: 0
                        };
                    },
                    review({ id, batch_status }, type) {
                        if (type === 2) {
                            this.$axios({
                                method: "post",
                                url: couponSubmitUrl,
                                params: {
                                    coupon_id: id,
                                    batch_status: type
                                },
                                include: true
                            }, this).then(({ status, data }) => {
                                if (status === 200 && data && data.code === 0) {
                                    this.$message({
                                        showClose: true,
                                        type: "success",
                                        message: "提交成功"
                                    });
                                    this.getData();
                                } else {
                                    this.$message({
                                        showClose: true,
                                        type: "error",
                                        message: (data && data.message) || "接口开小差了，请稍后再试"
                                    });
                                }
                            }).catch(() => {});
                        } else {
                            const text = type === 4 ? "审核通过后券即生效，是否确认通过审核？" : "确认驳回该券？";
                            this.$confirm(text, "提示", {
                                confirmButtonText: "确定",
                                cancelButtonText: "取消",
                                type: "warning"
                            }).then(() => {
                                this.doAxios({
                                    method: "post",
                                    url: couponAuditUrl,
                                    params: {
                                        coupon_id: id,
                                        batch_status: type
                                    },
                                    include: true
                                }, this).then(({ status, data }) => {
                                    if (status === 200 && data && data.code === 0) {
                                        this.$message.success(`${type === 4 ? "审核" : "驳回"}成功`);
                                        this.getData();
                                    } else {
                                        this.$message({
                                            showClose: true,
                                            type: "error",
                                            message: (data && data.message) || "接口开小差了，请稍后再试"
                                        });
                                    }
                                });
                            });
                        }
                    },
                    goDetail({ id = 0, batch_status }, type) {
                        if (batch_status === 4 && type === "edit") type = "passEdit";
                        this.$router.push({
                            name: "CouponDetail",
                            params: { id, type }
                        });
                    },
                    sortChange({ prop, order }) {
                        let sort = order === "descending" ? 1 : 0;
                        if (prop === "id") {
                            delete this.form.order_by_receive_start;
                            this.form.order_by_id = sort;
                        }
                        if (prop === "date") {
                            delete this.form.order_by_id;
                            this.form.order_by_receive_start = sort;
                        }
                        this.getData();
                    }
                },
                insData: {
                    form: {
                        batch_title: "",
                        timeRange: ["2021-03-25 00:00:00", "2021-03-31 23:59:59"],
                        batch_status: 1,
                        id: "",
                        operator: "",
                        status: 1
                    },
                    stateList: [{
                        label: "全部",
                        value: -1
                    }, {
                        label: "未开始",
                        value: 1
                    }, {
                        label: "进行中",
                        value: 2
                    }, {
                        label: "已完成",
                        value: 3
                    }, {
                        label: "使用/发放冻结",
                        value: 4
                    }, {
                        label: "发放冻结",
                        value: 5
                    }],
                    reviewList: [{
                        label: "全部",
                        value: -1
                    }, {
                        label: "待提交审核",
                        value: 1
                    }, {
                        label: "待审核",
                        value: 2
                    }, {
                        label: "审核驳回",
                        value: 3
                    }, {
                        label: "审核通过",
                        value: 4
                    }],
                    couponList: [],
                    addNumModal: false,
                    grantFreezeModal: false,
                    useFreezeModal: false,
                    pn: 1,
                    ps: 20,
                    totalCount: 0,
                    choosedId: "",
                    incre_num: "",
                    showEditButton: {
                        1: [1, 3, 4],
                        2: [4]
                    },
                    addLoading: false,
                    pickerOptions: {
                        shortcuts: [{
                            text: "今天",
                            onClick(picker) {const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + (24 * 60 * 60 - 1) * 1000);const start = new Date(new Date(new Date().toLocaleDateString()).getTime());console.log(picker);console.log([start, end]);picker.$emit("pick", [start, end]);}
                        }, {
                            text: "昨天",
                            onClick(picker) {const end = new Date(new Date(new Date().toLocaleDateString()).getTime() - 1000);const start = new Date(new Date(new Date().toLocaleDateString()).getTime() - (24 * 60 * 60) * 1000);picker.$emit("pick", [start, end]);}
                        }, {
                            text: "最近一周",
                            onClick(picker) {const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + (24 * 60 * 60 - 1) * 1000);const start = new Date(new Date(new Date().toLocaleDateString()).getTime() - (24 * 6 * 60 * 60) * 1000);picker.$emit("pick", [start, end]);}
                        }, {
                            text: "最近一个月",
                            onClick(picker) {const end = new Date(new Date(new Date().toLocaleDateString()).getTime() + (24 * 60 * 60 - 1) * 1000);const start = new Date(new Date(new Date().toLocaleDateString()).getTime() - (24 * 29 * 60 * 60) * 1000);picker.$emit("pick", [start, end]);}
                        }]
                    },
                },
                "ElOption_635044": {
                  attrMap: {},
                  renderFun: function(x) {
                    return this.lcData.reviewList.map(i => {let vv = this.deepClone(x);vv.label = i.label;vv.value = i.value;return vv})
                  },
                  nativeOn: {
                      click: function(e) {
                          this.lcData.form.batch_status = e.currentTarget.value
                      }
                  }
                },
                "ElOption_825874": {
                  attrMap: {},
                  renderFun: function(x) {
                    return this.lcData.stateList.map(i => {let vv = this.deepClone(x);vv.label = i.label;vv.value = i.value;return vv});
                  },
                  nativeOn: {
                      click: function(e) {
                          this.lcData.form.status = e.currentTarget.value
                      }
                  }
                },
                "ElOption_512646": {
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
                "ElOption_650915": {
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
                "ElOption_232249": {
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
                "ElTableColumn_600689": {
                  renderFun: function(x) {
                    x.value = this.lcData.filter.keyword
                  },
                  on: {
                      click: function(e) {
                          console.log("click")
                          console.log(e)
                      }
                  },
                  nativeOn: {
                      click: function(e) {
                          console.log("nativeOn")
                          console.log(e)
                      }
                  }
                },
              },
            }
        };
    },
    mounted() {
        console.log(Vue.compile('<div><span>{{ msg }}</span></div>'))
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
                url: "http://uat-bangumi-mng.bilibili.co/api/getProjects"
            }).then(({ data, code }) => {
                console.log(data)
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
                url: "http://uat-bangumi-mng.bilibili.co/api/getPageByProjectId",
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
                url: "http://uat-bangumi-mng.bilibili.co/api/getModuleDetailByModuleId",
                params: {
                    moduleId: val
                }
            }).then(({ data, code }) => {
                if (data && code === 0) {
                    if (data[0] && data[0].basic_config) {
                        // this.moduCf = data[0].basic_config.replace(/\s/g, "");
                        this.moduCf = decodeURIComponent(data[0].basic_config);
                        console.log(this.moduCf);
                        // localStorage.setItem("drawingItems", this.moduCf);
                    }
                    let item = this.modules.find(x => x.value === val && val !== 0);
                    this.moduleName = item ? item.label : "";
                }
            });
        },
        getModules(val, type) {
            this.$axios({
                url: "http://uat-bangumi-mng.bilibili.co/api/getModuleByPageId",
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
            this.$axios({
                url: "http://uat-bangumi-mng.bilibili.co/api/getConfig"
            }).then(e => {
                console.log(e);
            });
        },
        saveModule() {
            // if (!this.moduleName || !this.moduleId) {
            //     this.showAddName = true;
            // }
            // const module = localStorage.getItem("drawingItems");
            // console.log(module);
            const module = localStorage.getItem("drawingItems");
            this.$axios({
                method: "post",
                url: "http://uat-bangumi-mng.bilibili.co/api/updateModule",
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
            if (!this.moduleName && !this.moduleId) {
                this.showAddName = true;
                return;
            }
            const module = localStorage.getItem("drawingItems");
            console.log(module);
            console.log(decodeURIComponent(encodeURIComponent(module)));
            this.$axios({
                method: "post",
                url: "http://uat-bangumi-mng.bilibili.co/api/updateModule",
                params: {
                    project_id: this.projectId,
                    page_id: this.pageId,
                    module_id: this.moduleId,
                    module_name: this.moduleName,
                    page_name: this.pageName,
                    basicConfig: encodeURIComponent(module),
                    basicConfigsssss: module
                }
            }).then(() => {
                setTimeout(() => {
                    this.newGetData();
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
