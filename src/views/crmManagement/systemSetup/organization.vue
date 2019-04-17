<template>
  <div class="organization">
    <el-card style="padding-bottom: 200px;">
      <div class="company">
        <el-input
          placeholder="请输入公司名称或者部门名称"
          ref="tree"
          class="x_search"
          v-model="filterText">
        </el-input>
        <div>
          <el-button type="text" @click="companyOpen('ruleForm')">增加公司</el-button>
          <el-button type="text" @click="deptOpen('form')">增加部门</el-button>
          <el-button type="text" @click="upTo">上移</el-button>
          <el-button type="text" @click="downTo">下移</el-button>
        </div>
        <el-tree
          class="filter-tree"
          :data="data"
          :props="defaultProps"
          @node-click="handleNodeClick"
          :filter-node-method="filterNode"
          ref="tree">
        </el-tree>
      </div>
      <!--公司模块-->
      <div class="add_organ" v-show="showCompany">
        <div class="new_title">{{ruleForm.name}}</div>
        <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="150px">
          <el-form-item label="公司名称(必填)" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="机构类型" prop="type_id">
            <el-select v-model="ruleForm.type_id" filterable placeholder="请选择">
              <el-option
                v-for="(item, index) in type"
                :key="index"
                :label="item.title"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地区" prop="location_id" >
            <el-select v-model="ruleForm.location_id" filterable placeholder="请选择">
              <el-option
                v-for="item in location"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否同步钉钉架构" prop="is_ding_synchro">
            <el-select v-model="ruleForm.is_ding_synchro" @change="handleChange"  filterable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业ID" prop="corpid" v-if="ruleForm.is_ding_synchro === 1 ? true : false">
            <el-input v-model="ruleForm.corpid" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="企业应用的凭证密钥" prop="corpsecret" v-if="ruleForm.is_ding_synchro === 1 ? true : false">
            <el-input v-model="ruleForm.corpsecret" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item style="margin-left: 30px;">
            <el-button type="primary" v-if="company_edit"  @click="addCompany('ruleForm')">创建</el-button>
            <el-button v-if="company_edit"  @click="resetForm('ruleForm')">重置</el-button>
            <el-button  v-if="!company_edit" type="primary"  @click="onSubmit('ruleForm')">保存</el-button>
            <el-button   v-if="!company_edit" @click="deleteId()">删除</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--部门模块-->
      <div class="add_organ" v-show="!showCompany">
        <div class="new_title">{{form.name}}</div>
        <el-form :model="form" ref="form" label-width="150px" :rules="rule">
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item label="机构类型" prop="type_id">
            <el-select v-model="form.type_id" filterable placeholder="请选择">
              <el-option
                v-for="(item, index) in deptType"
                :key="index"
                :label="item.title"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="父级部门" prop="parentid">
            <el-cascader
              class="s_additem_form"
              :change-on-select="true"
              clearable
              filterable
              expand-trigger="hover"
              :show-all-levels="false"
              :options="data"
              v-model="form.parentid">
            </el-cascader>
          </el-form-item>
          <el-form-item label="部门主管" prop="managelist">
            <el-select v-model="form.managelist" filterable placeholder="请选择" class="s_additem_form">
              <el-option
                v-for="(item, index) in person"
                :key="index"
                :label="item.nickname"
                :value="item.dd_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 30px;">
            <el-button type="primary" v-if="company_edit"  @click="addDept('form')">创建</el-button>
            <el-button v-if="company_edit"  @click="resetForm('form')">重置</el-button>
            <el-button  v-if="!company_edit" type="primary"  @click="deptSubmit('form')">保存</el-button>
            <el-button   v-if="!company_edit" @click="deleteId()">删除</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "organization",
    data() {
      return {
        dialogVisible: false,
        showCompany: true,
        showDept: false,  // 部门和公司区分标识
        id: 1,     // 公司部门的详情id
        fn: 1,     // 区分部门和公司
        input:'',
        data: [], // tree树形
        company:[],
        location:[],
        person:[],       // 人员
        filterText: '',  // 树结构过滤
        ruleForm: {
          name:'',
          type_id:'',
          location_id:'',
          corpid:'',
          corpsecret:'',
          is_ding_synchro:'',
          company_id:'',
        },
        options: [{
          value: 1,
          label: '是'
        }, {
          value: 2,
          label: '否'
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        company_edit: false,
        type:[{
          id: 1,
          title: '公司'
        },{
          id: 3,
          title: '供应商'
        }],
        deptType: [{
          id: 2,
          title: '部门'
        }],
        form: {
          name: '',
          type_id: '',
          parentid: [],
          managelist: '',
        },
        rules: {
          name: [
            { required: true, message: '请输入公司名称', trigger: 'blur' },
          ],
          type_id: [
            { required: true, message: '请选择机构类型', trigger: 'change' },
          ],
          location_id: [
            { required: true, message: '请选择地区', trigger: 'change' }
          ],
          corpid: [],
          corpsecret: []
        },
        rule: {
          name: [
            { required: true, message: '请输入部门名称', trigger: 'blur' },
          ],
          parentid: [
            { required: true, message: '请选择父级部门', trigger: 'change' },
          ]
        }
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      //搜索公司和部门
      filterNode (value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      addDept (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$post('system/deptAdd',this.form)
              .then((data) => {
                if(data.code) {
                  this.$message({
                    type: 'success',
                    message: '部门创建成功'
                  });
                  this.treeData();
                }else {
                  this.$message({
                    type: 'warning',
                    message: data.errorMsg
                  });
                }
              })
              .catch(() => {})
          } else {
            return false;
          }
        });
      },
      //编辑部门
      deptSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form['dept_id'] = this.id;
            this.$post('system/deptAdd',this.form)
              .then((data) => {
                if(data.code) {
                  this.$message({
                    type: 'success',
                    message: '编辑成功'
                  });
                  this.detail();
                  this.treeData();
                }else {
                  this.$message({
                    type: 'warning',
                    message: data.errorMsg
                  });
                }
              })
              .catch(() => {})
          } else {
            return false;
          }
        });
      },
      deptOpen (formName) {
        this.$refs[formName].resetFields();
        this.form = {
          name: '',
          type_id: '',
          parentid: [],
          managelist: '',
        };
        this.company_edit = true;
        this.showCompany = false;
      },
      companyOpen (formName) {
        this.$refs[formName].resetFields();
        this.ruleForm = {
          name:'',
          type_id:'',
          location_id:'',
          corpid:'',
          corpsecret:'',
          is_ding_synchro:'',
          company_id:'',
        };
        this.company_edit = true;
        this.showCompany = true;
      },
      handleNodeClick (data) {
        this.id = data.value;
        if(data.pid === 0) {
          this.showCompany = true;
        } else {
          this.showCompany = false;
          this.form['dept_id'] = data.value;
        }
        this.company_edit = false;
        this.detail();
      },
      handleChange (val) {
        if(val == 1) {
          this.rules.corpid = [{required: true, message: '请输入企业ID', trigger: 'blur'}];
          this.rules.corpsecret = [{required: true, message: '请输入企业应用密钥', trigger: 'blur'}]
        } else {
          this.rules.corpid = [];
          this.rules.corpsecret = []
        }
      },
      //新增
      addCompany (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$post('system/companyAdd',this.ruleForm)
              .then((data) => {
                if(data.code) {
                  this.$message({
                    type: 'success',
                    message: data.errorMsg
                  });
                  this.treeData();
                }else {
                  this.$message({
                    type: 'warning',
                    message: data.errorMsg
                  });
                }
              })
              .catch(() => {});
          } else {
            return false;
          }
        })
      },
      // 树结构数据
      treeData () {
        this.$get('system/companyDeptInfo')
          .then( (data) => {
            if(data.code) {
              let dept = data.content.dept;
              let dataT = [];
              for(let i in dept) {
                for(let j = 0; j < dept[i].length; j++) {
                  dataT.push(dept[i][j]);
                }
              }
              this.data = dataT;
            }
          })
          .catch(() => {
            this.$message.error('服务器错误请稍后重试！')
          })
      },
      // 新建公司初始化数据
      treeCompany () {
        this.$get('system/selectCompany')
          .then((data) => {
            this.location = data.content.location;
          })
          .catch(() => {})
      },
      //公司,部门详情
      detail () {
        this.$get('system/infoById',{id:this.id})
          .then((data) => {
            if(data.code) {
              this.person = data.content.person; // 全部主管
              this.ruleForm.name = data.content.info.name;
              this.ruleForm.type_id = data.content.info.type_id;
              this.ruleForm.location_id = data.content.info.location_id;
              this.ruleForm.is_ding_synchro = data.content.info.is_ding_synchro;
              this.ruleForm.corpid = data.content.info.corpid;
              this.ruleForm.corpsecret = data.content.info.corpsecret;
              this.ruleForm.company_id = data.content.info.company_id; // 父级id
              this.form.name = data.content.info.name;
              this.form.type_id = data.content.info.type_id;
              this.form.parentid = data.content.info.parentid; // 父级部门
              this.form.managelist = data.content.info.managelist;
            }
          })
          .catch(() => {})
      },
      //公司部门清除
      resetForm (formName) {
        this.$refs[formName].resetFields();
      },
      //编辑公司
      onSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$post('system/companyAdd',this.ruleForm)
              .then((data) => {
                if(data.code) {
                  this.$message({
                    type: 'success',
                    message: '编辑成功'
                  });
                  this.detail();
                  this.treeData();
                }else {
                  this.$message({
                    type: 'warning',
                    message: data.errorMsg
                  });
                }
              })
              .catch(() => {})
          } else {
            return false;
          }
        });
      },
      // 删除公司和部门
      deleteId () {
        this.$post('system/delCompanyDept',{id:this.id})
          .then((data) => {
            if(data.code) {
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.detail();
              this.treeData();
              this.id = 1;
            }else {
              this.$message({
                type: 'warning',
                message: data.errorMsg
              });
            }
          })
          .catch(() => {})
      },
      // 上移
      upTo () {
        this.record();
        this.$get('system/upDown',{id:this.id,move:'up'})
          .then((data) => {
            if(data.code) {
              this.$message({
                type: 'success',
                message: '操作成功'
              });
              this.treeData()
            }else {
              this.$message({
                type: 'warning',
                message: data.errorMsg
              });
            }
          })
          .catch(() => {})
      },
      downTo () {
        this.$get('system/upDown',{id:this.id,move:'down'})
          .then((data) => {
            if(data.code) {
              this.$message({
                type: 'success',
                message: '操作成功'
              });
              this.treeData()
            }else {
              this.$message({
                type: 'warning',
                message: data.errorMsg
              });
            }
          })
          .catch(() => {})
      }
    },
    created(){
      this.treeData();
      this.treeCompany();
      this.detail();
    }
  }
</script>

<style lang="less" scoped>
  .organization{
    .company{
      width:40%;
      float: left;
      margin-bottom: 15px;
      padding-left: 30px;
    }
    .add_organ {
      float: left;
      padding: 0px 15px 200px 40px;
      border-left: 1px solid #ccc;
    }
    .new_title {
      width: 100%;
      height: 50px;
      font-size: 19px;
      float: left;
      text-align: left;
      font-weight: 700;
    }
    .x_search{
      width: 300px;
    }
  }
</style>


