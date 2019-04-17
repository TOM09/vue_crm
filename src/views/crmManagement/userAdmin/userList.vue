<!--用户列表-->
<template>
  <div class="user_list">
    <el-card>
      <div class="user_Search">
        <el-collapse accordion @change="clickCollapse">
          <el-collapse-item>
            <template slot="title">
              {{search_str}}<i class="header-icon el-icon-information"></i>
            </template>
            <el-form ref="ruleForm" :model="ruleForm" label-position="right" label-width='100px'>
              <el-form-item prop="username" label="用户名" class="user_search">
                <el-input v-model="ruleForm.username" clearable placeholder="请输入用户名" class="user_search_btn"></el-input>
              </el-form-item>
              <el-form-item prop="nickname" label="姓名" class="user_search">
                <el-input v-model="ruleForm.nickname" clearable placeholder="请输入姓名" class="user_search_btn"></el-input>
              </el-form-item>
              <el-form-item prop="role_id" label="角色" class="user_search">
                <el-select v-model="ruleForm.role_id" clearable filterable placeholder="请选择" class="user_search_btn">
                  <el-option
                      v-for="item in Role"
                      :key="item.role_id"
                      :label="item.name"
                      :value="item.role_id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="company_id" label="公司" class="user_search">
                <el-select v-model="ruleForm.company_id" @change="companyChange" clearable filterable placeholder="请选择" class="user_search_btn">
                  <el-option
                      v-for="item in Company"
                      :key="item.company_id"
                      :label="item.name"
                      :value="item.company_id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="department_id" label="部门"class="user_search">
                <el-cascader
                    clearable
                    filterable
                    change-on-select
                    class="user_search_btn"
                    :show-all-levels="false"
                    :options="Department"
                    v-model="ruleForm.department_id">
                </el-cascader>
              </el-form-item>
              <el-form-item prop="is_del" label="状态" class="user_search">
                <el-select v-model="ruleForm.is_del" clearable filterable placeholder="请选择" class="user_search_btn">
                  <el-option
                      v-for="item in Is_del"
                      :key="item.is_del"
                      :label="item.is_delName"
                      :value="item.is_del">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="position" label="岗位" class="user_search">
                <el-input v-model="ruleForm.position" clearable placeholder="请输入想要查询的岗位" class="user_search_btn"></el-input>
              </el-form-item>
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
                <el-button type="primary" @click="searchList()">查询</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </div>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </div>

      <div  class="hitemlistbtn">
        <el-button type="primary" @click="addUser()">+新建</el-button>
        <el-button type="primary" @click="allEnable">启用</el-button>
        <el-button type="primary" @click="allDisable">禁用</el-button>
        <el-button type="primary" @click="allRole">增加角色</el-button>
        <el-button type="primary" @click="deleteRole">删除角色</el-button>
      </div>
      <div class="hitemlisttop">
        已选择<span>{{ number }}</span>项 <el-button type="text" @click="toggleSelection()">清空</el-button>
      </div>
      <el-card>
        <el-table :data="Userlist" tooltip-effect="dark" ref="multipleTable" style="width: 100%"
                  @selection-change="handleSelectionChange" align="center">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="id" label="用户ID">
          </el-table-column>
          <el-table-column prop="nickname" label="姓名">
          </el-table-column>
          <el-table-column prop="username" label="用户名">
          </el-table-column>
          <el-table-column prop="company" label="公司">
          </el-table-column>
          <el-table-column prop="department" label="部门">
          </el-table-column>
          <el-table-column prop="role" label="角色">
          </el-table-column>
          <el-table-column  label="状态">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.is_del === 0 ? '有效' : '无效' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="login_number" sortable  label="登录次数">
          </el-table-column>
          <el-table-column prop="login_time" sortable label="最后登录时间">
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="userDetail(scope.row)" size="small">查看</el-button>
              <el-button type="text" @click="userClick(scope.row)" size="small">{{scope.row.is_del === 0 ? '禁用' : '启用'}}</el-button>
            </template>
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
      <el-dialog title="离职时间" :visible.sync="dialogVisible" :modal="false" width="600px">
        <el-date-picker
            class="user_search_btn"
            v-model="del_time"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期">
        </el-date-picker>
        <span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="disableClick">确 定</el-button>
				</span>
      </el-dialog>
      <el-dialog  title="角色" :visible.sync="dialogRole" :modal="false" width="600px">
        <el-form :model="form">
          <el-form-item label="角色" prop="role_id">
            <el-select v-model="form.role_id"  filterable placeholder="请选择">
              <el-option
                  v-for="item in Role"
                  :key="item.role_id"
                  :label="item.name"
                  :value="item.role_id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
					<el-button @click="dialogRole = false">取 消</el-button>
					<el-button type="primary" @click="rolesClick">确 定</el-button>
				</span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "userList",
    data(){
      return {
        search_str: '点击展开搜索列表',
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
        dialogVisible:false,
        dialogRole:false,
        Is_del:[],    // 0 是在职 1 是离职
        Position:[],  // 职位
        Role:[],      // 角色
        Nickname:[],  // 姓名
        Username:[],  // 用户名
        Department:[],
        Company:[],
        Userlist:[],
        count:0,
        number:0,
        ruleForm:{
          username: '',
          nickname: '',
          position: '', //岗位
          role_id: '',
          department_id: [],
          is_del: '',
          login_time: [],
          company_id: '',
          currentPage: 1,
          pageSize: 10,
        },
        user_ids:[],  // 禁用启用id
        is_del:'',    // 状态
        del_time:'',  // 离职时间
        form:{
          role_id:'',
        },
        deleteDis:false, // 区分删除角色和新增角色的标识
      }
    },
    methods:{
      addUser () {
        this.$router.push({name:'addUser'})
      },
      clickCollapse (activeNames) {
        if(activeNames){
          this.search_str = "点击关闭搜索列表";
        }else{
          this.search_str = "点击展开搜索列表";
        }
      },
      selectData(){
        this.$get('admin/selectDataAdmin')
          .then((data) => {
            if(data.code) {
              this.Role = data.content.Role;
              this.Is_del = data.content.Is_del;
              this.Company = data.content.company;
            }
          })
          .catch(() => {})
      },
      companyChange(val) {
        this.$get('admin/selectDataAddAdmin',{company_id:val})
          .then( (data) => {
            this.Department = data.content.dept;
          })
          .catch( () => {

          })
      },
      resetForm(formName){
        this.$refs[formName].resetFields();
      },
      //查询
      searchList () {
        this.ruleForm.currentPage = 1;
        this.ruleForm.pageSize = 10;
        this.$get('admin/adminList',this.ruleForm)
          .then((data) => {
            if(data.code) {
              this.Userlist = data.content.list;
              this.count = data.content.count;
            }
          })
          .catch(() => {

          })
      },
      //列表
      userList(){
        this.$get('admin/adminList',this.ruleForm)
          .then((data) => {
            if(data.code) {
              this.Userlist = data.content.list;
              this.count = data.content.count;
            }
          })
          .catch(() => {

          })
      },
      //分页
      handleSizeChange(val) {
        this.ruleForm.pageSize = val;
        this.userList();
      },
      handleCurrentChange(val) {
        this.ruleForm.currentPage = val;
        this.userList();
      },
      userDetail(row) {
        this.$router.push({
          name:'userDetails',
          params:{
            id:row.id
          }
        })
      },
      userClick(row) {
        if(row.is_del === 0) {
          //禁用
          this.dialogVisible = true;
          this.user_ids.push(row.id);
        }else {
          //启用
          this.$confirm('确定要进行该操作吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$post('admin/updateMoreAdmin',{id:[row.id],is_del:row.is_del === 1 ? 0 : 1})
              .then((data) => {
                if(data.code) {
                  this.$message({
                    type: 'success',
                    message: '操作成功!'
                  });
                  this.userList();
                }
              })
              .catch(() => {})
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            });
          });
        }
      },
      //禁用
      disableClick() {
        this.$post('admin/updateMoreAdmin',{id:this.user_ids,is_del:1})
          .then((data) => {
            if(data.code) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.dialogVisible = false;
              this.del_time = '';
              this.user_ids = [];
              this.userList();
            }else {
              this.$message({
                type: 'warning',
                message: data.errorMsg
              });
            }
          })
          .catch(() => {})
      },
      //全部禁用弹窗
      allDisable(){
        if(this.number > 0) {
          this.dialogVisible = true;
        }else {
          this.$message({
            type:'warning',
            message:'请勾选想要操作的用户'
          })
        }
      },
      toggleSelection() {
        this.$refs.multipleTable.clearSelection();
      },
      handleSelectionChange(val) {
        this.number = val.length;
        for(let i in val) {
          this.user_ids.push(val[i].id);
        }
      },
      //全部启用
      allEnable() {
        if(this.number > 0) {
          this.$confirm('确定要全部启用吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$post('admin/updateMoreAdmin',{id:this.user_ids,is_del:0})
              .then((data) => {
                if(data.code) {
                  this.$message({
                    type: 'success',
                    message: '操作成功!'
                  });
                  this.userList();
                }
              })
              .catch(() => {})
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            });
          });
        }else {
          this.$message({
            type:'warning',
            message:'请勾选想要操作的用户'
          })
        }
      },
      allRole() {
        if(this.number >= 1) {
          this.dialogRole = true;
        }else {
          this.$message({
            type:'warning',
            message:'请勾选想要操作的用户'
          })
        }
      },
      deleteRole() {
        if(this.number > 0 ) {
          this.dialogRole = true;
          this.deleteDis = true;
        }else {
          this.$message({
            type:'warning',
            message:'请勾选想要操作的用户'
          })
        }
      },
      //角色
      rolesClick() {
        if(this.deleteDis) {
          this.$post('admin/delRole',{id:this.user_ids,role_id:this.form.role_id})
            .then((data) => {
              if(data.code) {
                this.$message({
                  type: 'success',
                  message: '操作成功'
                });
              } else {
                this.$message({
                  type: 'warning',
                  message: data.errorMsg
                });
              }
              this.dialogRole = false;
              this.form.role_id = '';
              this.userList();
            })
            .catch(() => {})
        } else {
          this.$post('admin/addRole',{id:this.user_ids,role_id:this.form.role_id})
            .then((data) => {
              if(data.code) {
                this.$message({
                  type: 'success',
                  message: '操作成功'
                });
              } else {
                this.$message({
                  type: 'success',
                  message: data.errorMsg
                });
              }
              this.dialogRole = false;
              this.form.role_id = '';
              this.userList();
            })
            .catch(() => {})
        }
      },
    },
    created(){
      this.selectData();
      this.userList();
    }
  }
</script>

<style lang="less"  type='scoped'>
  .user_list{
    .el-collapse-item__header{
      text-align: center;
      display: block;
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