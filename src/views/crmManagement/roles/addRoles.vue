<!--新建角色-->

<template>
  <div class="add_roles">
    <el-card>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px" class="demo-ruleForm">
        <el-form-item label="角色名称（必填）" prop="name">
          <el-input v-model="ruleForm.name"placeholder="请输入角色名称" class="roles_name">
          </el-input>
        </el-form-item>
        <el-form-item label="状态（必选）" prop="status">
          <el-select v-model="ruleForm.status"  placeholder="请选择" class="roles_name">
            <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.label"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限（必选）" prop="auth_type">
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
                ref="tree">
            </el-tree>
          </div>
        </el-form-item>
        <el-form-item label="菜单显示(必选)">
          <el-tree
              :data="menu"
              style="margin-top: 15px;"
              show-checkbox
              node-key="id"
              ref="treer"
              highlight-current
              :props="defaultProps2">
          </el-tree>
        </el-form-item>
        <el-form-item style="margin-bottom: 200px;">
          <el-button type="primary" @click="addCompany('ruleForm')">创建</el-button>
          <el-button  @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "add-roles",
    data() {
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
          status:'',
          auth_type: 1,
          dept:[],
          menu:[]
        },
        dept:[],
        menu:[],
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
      addCompany(formName){
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
              // this.ruleForm.dept = Array.from(new Set(this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys())));
              this.ruleForm.dept = this.$refs.tree.getCheckedKeys();
              this.$post('role/roleAdd',this.ruleForm)
                .then((data) => {
                  if(data.code) {
                    this.$message({
                      type: 'success',
                      message: data.errorMsg
                    });
                    this.$router.push({
                      name:'rolesDetails',
                      params:{
                        id:data.content.role_id
                      }
                    })
                  }else {
                    this.$message({
                      type: 'warning',
                      message: data.errorMsg
                    });
                  }
                })
                .catch(() => {

                })
            } else {
              return false;
            }
          });
        }
      },
      resetForm(formName){
        this.$refs[formName].resetFields();
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
            }else {
              this.$message({
                type: 'warning',
                message: data.errorMsg
              });
            }
          })
          .catch(() => {

          })
      }
    },
    created(){
      this.roleData();
    }
  }
</script>

<style lang="less">
  .el-tree{
    width: 300px;
  }
  .roles_name{
    width: 250px;
  }
</style>