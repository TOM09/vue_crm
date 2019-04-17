<!--用户详情-->

<template>
  <div class="userDetails">
    <el-card>
      <p class="userDetails-title">用户详情</p>
      <div class="xxk_user">
        <p>所在公司: {{company}}</p>
        <p>用户名: {{username}}</p>
        <p>用户ID: {{form.id}}</p>
        <p>最后登录时间: {{login_time}}</p>
        <p>状态: {{form.is_del === 0 ? '有效' : '无效' }}</p>
        <p>登录次数: {{login_number}}</p>
        <p>钉钉ID: {{dd_sync_id}}</p>
        <p>用户: {{is_out}}</p>
      </div>
      <el-tabs v-model="activeName" style="clear: both">
        <el-tab-pane label="基本信息" name="first">
          <el-form :model="form" :rules="rules"  ref="form" label-width="170px">
            <el-form-item label="状态" prop="is_del">
              <el-select v-model="form.is_del" @change="handleChange" placeholder="请选择" class="demo-form">
                <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="姓名" prop="nickname">
              <el-input v-model="form.nickname" autocomplete placeholder="请输入" class="demo-form">
              </el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input type="password"  v-model="form.password" autocomplete  placeholder="请输入要修改的密码" class="demo-form">
              </el-input>
            </el-form-item>
            <el-form-item label="入职时间" prop="induction_time" >
              <el-date-picker
                  id="1"
                  class="demo-form"
                  v-model="form.induction_time"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="离职时间" prop="del_time">
              <el-date-picker
                  id="2"
                  class="demo-form"
                  v-model="form.del_time"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="岗位" prop="position">
              <el-input  v-model="form.position" placeholder="请输入" class="demo-form">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit('form')">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="角色" name="second">
          <div>
            <el-button type="primary" @click="userOpen" plain size="mini" style="margin-left: 10px">新增</el-button>
          </div>
          <el-table :data="role" style="width: 100%">
            <el-table-column prop="name" label="角色" width="300">
            </el-table-column>
            <el-table-column prop="create_time" label="创建日期">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index, role)" type="text" size="small"> 删除 </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="部门" name="third">
          <div>
            <el-button type="primary" @click="deptOpen" plain size="mini" style="margin-left: 10px">新增</el-button>
          </div>
          <el-table :data="department" style="width: 100%">
            <el-table-column prop="company_name" label="公司"  width="300">
            </el-table-column>
            <el-table-column prop="department_name" label="部门">
            </el-table-column>
            <el-table-column label="" >
              <template slot-scope="scope">
                <p v-if="scope.row.is_default=='1'">
                  <el-tag>默认</el-tag>
                </p>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click.native.prevent="deptDelete(scope.$index, department)" type="text" size="small"> 删除 </el-button>
                <el-button v-if="scope.row.is_default!='1'" @click.native.prevent="setDefault(scope.$index, department)" type="text" size="small"> 设为默认 </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog title="新增角色" :visible.sync="dialogVisible" :modal="false" width="600px">
      <el-select v-model="role_id"  filterable placeholder="请选择">
        <el-option
          v-for="item in all_role"
          :key="item.role_id"
          :label="item.name"
          :value="item.role_id">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新增部门" :visible.sync="dialogVisiblet" :modal="false" width="600px">
      <el-cascader
        expand-trigger="hover"
        clearable
        :options="all_department"
        change-on-select
        v-model="dept"
        :show-all-levels="false">
      </el-cascader>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblet = false">取 消</el-button>
        <el-button type="primary" @click="addDept">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "user-details",
    components:{},
    data() {
      return {
        activeName: 'first',
        dialogVisible:false,
        dialogVisiblet:false,
        tabsItem:'',
        all_role:[],        // 全部角色
        all_department:[],  // 全部部门
        department:[],   // 组织
        company: '',
        username: '',
        login_time:'',
        login_number:'',
        dd_sync_id: '',
        role:[],
        is_out: '',
        options: [{
          id: 0,
          label: '有效'
        }, {
          id: 1,
          label: '无效'
        }],
        form:{
          id:'',
          is_del:'',
          nickname:'',
          password:'',
          position:'',
          induction_time:'',  //入职时间
          del_time:'', // 离职时间
        },
        role_id:'', //角色
        dept:[],
        company_id:[],
        rules: {
          is_del: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ],
          nickname:[
            { required: true, message: '请输入姓名', trigger: 'blur' },
          ],
          username:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          position: [
            { required: true, message: '请输入岗位', trigger: 'blur' },
          ],
          del_time: [

          ]
        }

      }
    },
    methods:{
      handleChange (val) {
        if(val == 1) {
          this.rules.del_time = [
            { required: true, message: '请选择离职时间', trigger: 'change' }
          ]
        } else {
          this.rules.del_time = []
        }
      },
      usersDetail() {
        this.$get('admin/detailAdmin',{id:this.$route.params.id})
          .then((data) => {
            if(data.code) {
              this.login_time = data.content.login_time;
              this.login_number = data.content.login_number;
              this.department = data.content.department;
              if(data.content.department.length > 0) {
                this.company = data.content.department[0]['company_name'];
              }
              this.dd_sync_id = data.content.dd_sync_id;
              this.role = data.content.role;
              this.all_role = data.content.all_role;
              this.all_department = data.content.all_department;
              this.company_id = data.content.company_id;
              this.is_out = data.content.in_out;
              this.form.id = data.content.id;
              this.form.is_del = data.content.is_del;
              if(this.form.is_del === 1) {
                this.rules.del_time = [
                  { required: true, message: '请选择离职时间', trigger: 'change' }
                ]
              }
              this.form.nickname = data.content.nickname;  //姓名
              this.username = data.content.username;
              this.form.position = data.content.position;  // 职位
              this.form.induction_time = data.content.induction_time; // 入职时间
              this.form.del_time = data.content.del_time;  // 离职时间
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试')
          })
      },
      userOpen(){
        this.dialogVisible = true;
      },
      //新增角色
      addUsers() {
        this.$post('admin/addRole',{id:[this.form.id],role_id:this.role_id})
          .then((data) => {
            if(data.code){
              this.$message({
                type:'success',
                message:'操作成功'
              });
              this.dialogVisible = false;
              this.role_id = '';
              this.usersDetail();
            } else{
              this.$message({
                type:'warning',
                message:data.errorMsg
              })
            }
          })
          .catch((data) => {
            this.$message.error(data)
          })
      },
      //删除角色
      deleteRow (index,rows) {
        this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('admin/delRole',{id:[this.form.id],role_id:rows[index].role_id})
            .then((data) => {
              if(data.code){
                rows.splice(index, 1);
                this.$message({
                  type:'success',
                  message:'操作成功'
                });
              } else{
                this.$message({
                  type:'warning',
                  message:data.errorMsg
                })
              }
            })
            .catch((data) => {
              this.$message.error(data)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deptOpen() {
        this.dialogVisiblet = true;
      },
      //新增组织
      addDept(){
        this.$post('admin/is_department',{id:this.form.id,company_id:this.company_id,action:'add',department:this.dept})
          .then((data) => {
            if(data.code){
              this.$message({
                type:'success',
                message:'操作成功'
              });
              this.dialogVisiblet = false;
              this.dept = [];
              this.usersDetail();
            } else{
              this.$message({
                type:'warning',
                message:data.errorMsg
              })
            }
          })
          .catch((data) => {
            this.$message.error(data)
          })
      },
      deptDelete(index,rows){
        this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('admin/is_department',{id:this.form.id,company_id:rows[index].company_id,action:'del',department:[rows[index].department_id]})
            .then((data) => {
              if(data.code){
                rows.splice(index, 1);
                this.$message({
                  type:'success',
                  message:'操作成功'
                });
                this.dialogVisiblet = false;
              } else{
                this.$message({
                  type:'warning',
                  message:data.errorMsg
                })
              }
            })
            .catch((data) => {
              this.$message.error(data)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      setDefault(index,rows){
          this.$confirm('确定要设置为默认部门?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              this.$post('admin/setDefaultDept',{admin_id:this.form.id,dept_id:rows[index].department_id})
                  .then((data) => {
                      if(data.code){
                          this.$message({
                              type:'success',
                              message:'操作成功'
                          });
                          this.dialogVisiblet = false;
                          this.usersDetail();
                      } else{
                          this.$message({
                              type:'warning',
                              message:data.errorMsg
                          })
                      }
                  })
                  .catch((data) => {
                      this.$message.error(data)
                  })
          }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消设置'
              });
          });
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$post('admin/updateAdmin',this.form)
              .then((data) => {
                if(data.code){
                  this.$message({
                    type:'success',
                    message:'操作成功'
                  });
                } else{
                  this.$message({
                    type:'warning',
                    message:data.errorMsg
                  })
                }
              })
              .catch((data) => {
                this.$message.error(data)
              })
          } else {
            return false;
          }
        });
      }
    },
    created () {
      this.usersDetail()
    }
  }
</script>

<style lang="less">
  .userDetails{
    .userStatus p{
      width: 50%;
      font-size: 14px;
      float: left;
    }
    &-title{
      font-size: 16px;
      font-weight: 700;
      line-height: 50px;
    }
    .new_title {
      width: 100%;
      height: 50px;
      font-size: 19px;
      float: left;
      text-align: left;
      font-weight: 700;
    }
    .demo-form {
      width: 300px;
    }
    .xxk_user p{
      width: 50%;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      float: left;
    }
  }
</style>
