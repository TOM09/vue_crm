<!--新建用户-->
<template>
  <div class="add_user">
    <el-card>
      <div class="new_title">新建用户</div>
      <el-form :model="form" :rules="rules" ref="form" label-width="170px">
        <el-form-item label="用户" prop="in_out">
          <el-radio-group v-model="form.in_out">
            <el-radio :label="1">内部用户</el-radio>
            <el-radio :label="0">外部用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="姓名" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入姓名" class="demo-form">
          </el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"placeholder="请输入用户名" class="demo-form">
          </el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input type="password" v-model="form.password" auto-complete="off"  placeholder="请输入登录密码" class="demo-form">
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repassword">
          <el-input type="password" v-model="form.repassword" placeholder="请确认密码" auto-complete="off" class="demo-form">
          </el-input>
        </el-form-item>
        <el-form-item label="公司" prop="company_id">
          <el-select v-model="form.company_id" @change="companyChange" filterable placeholder="请选择" class="demo-form">
            <el-option
              v-for="item in company"
              :key="item.company_id"
              :label="item.name"
              :value="item.company_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-cascader
            class="demo-form"
            :options="dept"
            clearable
            change-on-select
            v-model="form.department">
          </el-cascader>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="form.role_id" filterable placeholder="请选择" class="demo-form">
            <el-option
                v-for="item in role"
                :key="item.role_id"
                :label="item.name"
                :value="item.role_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位" prop="position">
          <el-input v-model="form.position"placeholder="请输入岗位" class="demo-form"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="induction_time">
          <el-date-picker
              class="demo-form"
              v-model="form.induction_time"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">确认</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "addUser",
    components:{},
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.form.repassword !== '') {
            this.$refs.form.validateField('repassword');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        dept:[],
        company:[],
        role:[],
        form:{
          in_out:'',
          nickname:'',
          username:'',
          password:'',
          repassword:'',
          company_id:'',
          department:[],
          position:'',
          role_id:'',
          induction_time:'',
        },
        rules: {
          in_out: [
            { required: true, message: '请选择内外用户', trigger: 'change' }
          ],
          nickname: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
          ],
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          password: [
            { required: true, validator: validatePass, trigger: 'blur' }
          ],
          repassword: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ],
          company_id: [
            { required: true, message: '请选择公司', trigger: 'change' }
          ],
          department: [
            { required: true, message: '请选择部门', trigger: 'change' }
          ],
          role_id: [
            { required: true, message: '请选择角色', trigger: 'change' }
          ],
          position: [
            { required: true, message: '请输入岗位', trigger: 'blur' },
          ]
        }

      }
    },
    methods:{
      addData() {
        this.$get('admin/selectDataAddAdmin')
          .then( (data) => {
            this.company = data.content.company;
            this.role = data.content.role;
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试')
          })
      },
      companyChange(val) {
        this.$get('admin/selectDataAddAdmin',{company_id:val})
          .then((data) => {
            this.dept = data.content.dept;
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试')
          })
      },
      onSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if(valid) {
            this.$post('admin/addAdmin',this.form)
              .then((data) => {
                if(data.code){
                  this.$message({
                    type:'success',
                    message:'操作成功'
                  });
                  this.$refs[formName].resetFields();
                  this.$router.push({
                    name: 'userDetails',
                    params:{
                      id:data.content.id
                    }
                  })
                } else {
                  this.$message({
                    type: 'warning',
                    message: data.errorMsg
                  })
                }
              })
              .catch(() => {
                this.$message.error('服务器错误，请稍后重试')
              })
          }else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
    created(){
      this.addData();
    }
  }
</script>

<style lang="less">
  .add_user{
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
  }
</style>