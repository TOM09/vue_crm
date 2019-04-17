<template>
  <div class="login">
    <el-card>
      <div class="login_Search">
        <el-collapse accordion @change="clickCollapse">
          <el-collapse-item>
            <template slot="title">
              {{search_str}}<i class="header-icon el-icon-information"></i>
            </template>
            <el-form ref="ruleForm" :model="ruleForm" label-position="right" label-width='100px'>
              <el-form-item prop="username_id" label="用户名" class="user_search">
                <el-input v-model="ruleForm.username" clearable placeholder="请输入用户名" class="user_search_btn"></el-input>
                <!--<el-select v-model="ruleForm.username_id" clearable filterable placeholder="请选择" class="user_search_btn">
                  <el-option
                      v-for="item in username"
                      :key="item.id"
                      :label="item.username"
                      :value="item.id">
                  </el-option>
                </el-select>-->
              </el-form-item>
              <el-form-item prop="nickname_id" label="姓名" class="user_search">
                <el-input v-model="ruleForm.nickname" clearable placeholder="请输入用户名" class="user_search_btn"></el-input>
                <!--<el-select v-model="ruleForm.nickname" clearable filterable placeholder="请选择" class="user_search_btn">
                  <el-option
                      v-for="item in nickname"
                      :key="item.id"
                      :label="item.nickname"
                      :value="item.id">
                  </el-option>
                </el-select>-->
              </el-form-item>
              <el-form-item prop="role_id" label="角色" class="user_search">
                <el-select v-model="ruleForm.role_id" clearable filterable placeholder="请选择" class="user_search_btn">
                  <el-option
                      v-for="item in role"
                      :key="item.role_id"
                      :label="item.name"
                      :value="item.role_id">
                  </el-option>
                </el-select>
              </el-form-item>
              <!--<el-form-item prop="company_id" label="公司" class="user_search">
                  <el-select v-model="ruleForm.company_id" @change="companyChange" clearable filterable placeholder="请选择" class="user_search_btn">
                      <el-option
                              v-for="item in Company"
                              :key="item.company_id"
                              :label="item.name"
                              :value="item.company_id">
                      </el-option>
                  </el-select>
              </el-form-item>-->
              <!-- <el-form-item prop="department_id" label="部门"class="user_search">
                   <el-cascader
                           clearable
                           filterable
                           change-on-select
                           class="user_search_btn"
                           :show-all-levels="false"
                           :options="Department"
                           v-model="ruleForm.department_id">
                   </el-cascader>
               </el-form-item>-->
              <el-form-item prop="login_time" label="登录日期" class="user_search">
                <el-date-picker
                    style="width: 300px;"
                    v-model="ruleForm.login_time"
                    type="daterange"
                    unlink-panels
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions2">
                </el-date-picker>
              </el-form-item>
              <div class="userSearch_btn">
                <el-button type="primary" @click="loginList()">查询</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </div>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </div>
      <el-table :data="logList"  style="width: 100%">
        <el-table-column prop="id" label="ID" width="50">
        </el-table-column>
        <el-table-column prop="login_time" label="登录时间">
        </el-table-column>
        <el-table-column prop="company" label="公司">
        </el-table-column>
        <el-table-column prop="department" label="部门">
        </el-table-column>
        <el-table-column prop="nickname" label="姓名">
        </el-table-column>
        <el-table-column prop="username" label="登录用户">
        </el-table-column>
        <el-table-column prop="role" label="角色">
        </el-table-column>
        <el-table-column prop="ip" label="IP">
        </el-table-column>
      </el-table>
      <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="ruleForm.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="ruleForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count"
          style="text-align: center; margin-top: 15px;">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "login-log",
    data(){
      return {
        search_str:"点击展开搜索列表",
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        username:[],
        nickname:[],
        role:[],
        department:[],
        logList:[],
        count:0,
        ruleForm:{
          username:'',
          nickname:'',
          role_id:'',
          department_id:[],
          login_time:[],
          pageSize:10,
          currentPage:1,
        }

      }
    },
    methods:{
      clickCollapse (activeNames) {
        if(activeNames){
          this.search_str = "点击关闭搜索列表";
        }else{
          this.search_str = "点击展开搜索列表";
        }
      },
      selectData(){
        this.$get('message/selectData')
          .then((data) => {
            if(data.code) {
              this.role = data.content.role;
              this.department = data.content.department;
            }
          })
          .catch(() => {})
      },
      handleSizeChange(val) {
        this.ruleForm.pageSize = val;
        this.ruleForm.currentPage = 1;
        this.loginList();
      },
      handleCurrentChange(val) {
        this.ruleForm.currentPage = val;
        this.loginList();
      },
      loginList(){
        this.$get('message/loginlog',this.ruleForm)
          .then((data) => {
            if(data.code) {
              this.logList = data.content.list;
              this.count = data.content.count;
            }
          })
          .catch(() => {})
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    created() {
      this.selectData();
      this.loginList();
    }
  }
</script>

<style lang="less">
  .login {
    .el-collapse-item__header{
      text-align: center;
    }
    .user_search {
      float: left;
      height: 50px;
    }
    .user_search_btn {
      width: 250px;
    }
    .userSearch_btn {
      width: 300px;
      float: right;
      margin: 20px;
    }
  }
</style>