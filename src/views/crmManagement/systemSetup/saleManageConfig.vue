<template>
  <div class="roles">
    <el-card>
      <div style="color:#333;font-size: 16px;" class="x_new_title">
        工单配置
      </div>
    </el-card>
    <el-card  style="margin-top: 15px">
      <el-button  style="margin-left:10px;" type="primary" @click="add">新增</el-button>
      <el-card style="margin-top:10px;">
        <el-table :data="tableData">
          <el-table-column prop="id" width="200"  label="序号"></el-table-column>
          <el-table-column  prop="link_type_str" label="工单类型"></el-table-column>
          <el-table-column  prop="dept" label="申请人部门"></el-table-column>
          <el-table-column  prop="step" label="角色"></el-table-column>
          <el-table-column  prop="nickname" label="人员"></el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button
                      size="mini"
                      @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                      size="mini"
                      type="danger"
                      @click="handleDelete(scope.$index, tableData)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-card>
    <el-dialog title="配置数据" :visible.sync="dialogFormVisibleT" :append-to-body="true" width="30%" @close="closeDialogModel()">
      <el-form :model="form">
        <el-form-item prop="manageType" label="工单类型：">
          <el-select v-model="form.manageType" filterable clearable placeholder="请选择" >
            <el-option
                    v-for="item in manageType"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="dept" label="申请人部门：" >
          <el-cascader
                  change-on-select
                  expand-trigger="click"
                  filterable
                  clearable
                  :show-all-levels="false"
                  :options="dept"
                  v-model="form.dept"
                  @change="getDeptId()"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item prop="manageStep" label="操作角色：">
          <el-select v-model="form.manageStep"  filterable clearable placeholder="请选择" >
            <el-option
                    v-for="item in manageStep"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="excutor_dd_id" label="人员：">
          <el-select v-model="form.excutor_dd_id"  filterable clearable placeholder="请选择" >
            <el-option
                    v-for="item in person"
                    :key="item.dd_id"
                    :label="item.nickname"
                    :value="item.dd_id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogModel()">取 消</el-button>
        <el-button type="primary" @click="subAdd()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="dialogFormVisible" :append-to-body="true" width="30%" @close="closeDialogModel()">
      <el-form :model="form">
        <el-form-item prop="manageType" label="工单类型：">
          <el-select v-model="form.manageType" filterable clearable placeholder="请选择" >
            <el-option
                    v-for="item in manageType"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="dept" label="申请人部门：">
          <el-cascader
                  change-on-select
                  expand-trigger="click"
                  filterable
                  clearable
                  :show-all-levels="false"
                  :options="dept"
                  v-model="form.dept"
                  @change="getDeptId()"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item prop="manageStep" label="操作角色：">
          <el-select v-model="form.manageStep"  filterable clearable placeholder="请选择" >
            <el-option
                    v-for="item in manageStep"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="excutor_dd_id" label="人员：">
          <el-select v-model="form.excutor_dd_id"  filterable clearable placeholder="请选择" >
            <el-option
                    v-for="item in person"
                    :key="item.dd_id"
                    :label="item.nickname"
                    :value="item.dd_id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialogModel()">取 消</el-button>
        <el-button type="primary" @click="determine()">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
    export default {
        data(){
            return {
                isRouterAlive:true,
                dialogFormVisible:false,
                dialogFormVisibleT:false,
                form: {
                    edit_id:'',
                    dept:[],
                    manageType:'',
                    manageStep:'',
                    excutor_dd_id:''
                },
                tableData:[],
                dept:[],
                manageType:[],
                manageStep:[],
                excutor_dd_id:"",
                person:[],
            }
        },
        provide(){
          return{
              reload: this.reload
          }
        },
        computed: {
            // person () {
            //     return this.$store.state.app.commonPerson;
            // }
        },
        methods:{
            reload(){
              this.isRouterAlive = false
              this.$nextTick(function(){
                  this.isRouterAlive = true
              })
            },
            default() {
                this.$get('system/manageConfigList')
                    .then((data) => {
                        this.tableData = data.content.list;
                        this.dept = data.content.dept;
                        this.manageType = data.content.manageType;
                        this.manageStep = data.content.manageStep;
                    })
                    .catch(() => {
                        this.$message.error('服务器错误，请稍后重试');
                    })
            },
            //设置部门对应角色
            add() {
                this.dialogFormVisibleT = true;
            },
            subAdd() {
                this.$post('system/addManageConfig',this.form)
                    .then( (data) => {
                        if(data.code) {
                            this.$message({
                                message: data.content,
                                type: 'success'
                            });
                            this.form = {};
                            this.dialogFormVisibleT = false;
                            this.$router.go(0)
                        }else {
                            this.$message({
                                message:data.errorMsg,
                                type:'warning'
                            })
                        }
                    })
                    .catch(() => {
                        this.$message.error('服务器错误，请稍后重试');
                    })
            },
            handleEdit(index, row) {
                this.form.edit_id = row.id;
                this.$get('system/getManageConfig',{id:row.id})
                    .then( (data) => {
                        if(data.code) {
                            this.form.manageType = data.content.link_type;
                            this.form.dept = data.content.dept;
                            this.form.manageStep = data.content.step_id;
                            this.form.excutor_dd_id = data.content.excutor_dd_id;
                            if(data.content.dept[0]==1){
                                this.person = this.$store.state.app.commonPerson;
                            }else{
                                this.$get('admin/company_admin',{'dept_id':data.content.dept[0]})
                                    .then( (data) => {
                                        this.person = data.content
                                    })
                                    .catch(() => {
                                        this.$message.error('服务器错误，请稍后重试');
                                    })
                            }

                        }else {
                            this.$message({
                                message:data.errorMsg,
                                type:'warning'
                            })
                        }
                    }).catch( () => {
                    this.$message.error('服务器错误，请稍后重试');
                })
                this.dialogFormVisible = true;
            },
            determine(){
                this.$post('system/editManageConfig',this.form)
                    .then( (data) => {
                        if(data.code) {
                            this.dialogFormVisible = false;
                            this.form = {};
                            this.$message({
                                message: data.content,
                                type: 'success'
                            });
                            //this.default();
                            this.$router.go(0)
                        }else {
                            this.$message({
                                message:data.errorMsg,
                                type:'warning'
                            })
                        }
                    }).catch( () => {
                    this.$message.error('服务器错误，请稍后重试');
                })
            },
            //删除
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post('system/delManageConfig', {id:row[index].id})
                        .then((data) => {
                            if(data.code) {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                row.splice(index, 1);
                            }
                        })
                        .catch(() => {
                            this.$message.error('服务器错误，请稍后重试');
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            closeDialogModel(){
                this.dialogFormVisibleT = false
                this.dialogFormVisible = false
                this.form.manageType = "";
                this.form.dept = [];
                this.form.manageStep = "";
                this.form.excutor_dd_id = "";
                this.form.edit_id = "";
                this.person = [];
            },
            getDeptId(){
                var dept = this.form.dept[0]
                if(dept==1){
                    this.person = this.$store.state.app.commonPerson;
                }else{
                    this.$get('admin/company_admin',{'dept_id':dept})
                        .then( (data) => {
                            this.person = data.content
                        })
                        .catch(() => {
                            this.$message.error('服务器错误，请稍后重试');
                        })
                }
            },
        },
        created () {
            this.default();
        }
    }
</script>

<style>
  .el-form-item__label{
    width:110px;
  }
</style>