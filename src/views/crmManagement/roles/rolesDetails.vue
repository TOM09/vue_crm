<!--角色详情-->

<template>
  <div class="roles_details">
    <el-card>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
        <el-form-item label="角色名称(必填)" prop="name">
          <el-input v-model="ruleForm.name"placeholder="请输入项目名称" class="roles_name">
          </el-input>
        </el-form-item>
        <el-form-item label="状态(必选)" prop="status">
          <el-select v-model="ruleForm.status" filterable placeholder="请选择" class="roles_name">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限(必选)">
          <el-radio-group v-model="ruleForm.auth_type">
            <el-radio :label="1">本人及以下数据</el-radio>
            <el-radio :label="2">全部数据</el-radio>
            <el-radio :label="3">自定义</el-radio>
          </el-radio-group>
          <div v-show="ruleForm.auth_type === 3">
            <el-tree
              class="filter-tree"
              :data="dept"
              show-checkbox
              node-key="value"
              :props="defaultProps1"
              :default-expanded-keys="parent_dept"
              :default-checked-keys="select_dept"
              ref="tree">
            </el-tree>
          </div>
        </el-form-item>
        <el-form-item label="菜单显示(必选)">
          <el-tree
            :data="menu"
            show-checkbox
            node-key="id"
            ref="treer"
            highlight-current
            :default-expanded-keys="parent_menu"
            :default-checked-keys="select_menu"
            :props="defaultProps2">
          </el-tree>
        </el-form-item>
        <el-form-item style="margin-bottom: 200px;">
          <el-button type="primary" @click="roleEdit('ruleForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "roles-details",
    data(){
      return {
        options: [{
          id: 0,
          label: '有效'
        }, {
          id: 1,
          label: '无效'
        }],
        ruleForm:{
          name:'',
          status: '',
          auth_type: '',
        },
        dept:[],
        menu:[],
        select_dept:[],
        parent_dept: [],
        select_menu:[],
        parent_menu : [],
        defaultProps1: {
          children: 'children',
          label: 'label'
        },
        defaultProps2: {
          children: 'children',
          label: 'name'
        },
        rules: {
          name:[
            { required: true, message: '请输入角色名称', trigger: 'blur' },
          ],
          status:[
            { required: true, message: '请选择状态', trigger: 'change' }
          ],
        }
      }
    },
    methods:{
      roleEdit(formName){
        if(this.ruleForm.auth_type === 3 && this.$refs.tree.getCheckedKeys().length < 1) {
          this.$message({
            type:'warning',
            message:'请勾选自定义的数据权限'
          })
        } else if (this.$refs.treer.getCheckedKeys().length < 1){
          this.$message({
            type:'warning',
            message:'请勾选自定义的菜单权限'
          })
        }else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.ruleForm.menu = Array.from(new Set(this.$refs.treer.getHalfCheckedKeys().concat(this.$refs.treer.getCheckedKeys())));
              this.ruleForm.dept = this.$refs.tree.getCheckedKeys();
              this.ruleForm.role_id = this.$route.params.id;
              this.$post('role/roleAdd',this.ruleForm)
                .then((data) => {
                  if(data.code) {
                    this.$message({
                      type: 'success',
                      message: '操作成功！'
                    });
                    this.roleDetail();
                  }else {
                    this.$message({
                      type: 'warning',
                      message: data.errorMsg
                    });
                  }
                })
                .catch(() => {
                  this.$message.error('服务器错误请稍后重试')
                })
            } else {
              return false;
            }
          });
        }
      },
      roleData(){
        this.$get('role/roleSelectData')
          .then((data) => {
            if(data.code) {
              this.menu = data.content.menu;
              let dept = data.content.dept;
              let dataT = [];
              for(let i in dept) {
                for(let j = 0; j < dept[i].length; j++) {
                  dataT.push(dept[i][j]);
                }
              }
              this.dept = dataT;
            } else {
              this.$message({
                type: 'warning',
                message: data.errorMsg
              });
            }
          })
          .catch(() => {})
      },
      roleDetail(){
        this.$get('role/roleDetail',{role_id:this.$route.params.id})
          .then((data) => {
            if(data.code) {
              this.ruleForm.name = data.content.name;
              this.ruleForm.status = data.content.status;
              this.ruleForm.auth_type = data.content.auth_type ? data.content.auth_type : 1;
              this.$nextTick(() => {
                for(let index in data.content.select_menu) {
                  this.parent_menu.push(parseInt(index));
                  data.content.select_menu[index].forEach((key) => {
                    this.select_menu.push(key);
                  })
                }
              });
              this.select_dept = data.content.select_dept;
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
    mounted () {
      setTimeout(() => {
        this.parent_dept = this.$refs.tree.getHalfCheckedKeys();
      },500);
    },
    created () {
      this.roleData();
      this.roleDetail();
    }
  }
</script>

<style lang="less" scoped>
  .el-tree{
    width: 300px;
  }
  .roles_name{
    width: 250px;
  }
</style>