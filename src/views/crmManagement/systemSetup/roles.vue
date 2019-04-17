<template>
  <div class="roles">
    <el-card>
      <div style="color:#333;font-size: 16px;" class="x_new_title">
        部门与角色对应
      </div>
    </el-card>
    <el-card  style="margin-top: 15px">
      <el-button  style="margin-left:10px;" type="primary" @click="addRoleT">添加部门对应角色</el-button>
      <el-button  style="margin-left:10px;" type="primary" @click="synchro">同步部门信息</el-button>
      <el-card style="margin-top:10px;">
        <el-table :data="tableData">
          <el-table-column type="index" width="200"  label="序号"></el-table-column>
          <el-table-column  prop="dept" label="部门"></el-table-column>
          <el-table-column  prop="role" label="角色"></el-table-column>
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
    <el-dialog title="编辑" :visible.sync="dialogFormVisible" :append-to-body="true" width="30%">
      <el-form :model="form">
        <el-form-item prop="dept" label="部门：">
          <el-cascader
              change-on-select
              expand-trigger="click"
              filterable
              clearable
              :options="dept"
              v-model="form.dept"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item prop="role" label="角色：">
          <el-select v-model="form.role" filterable clearable placeholder="请选择" >
            <el-option
                v-for="item in role"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="determine()">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="配置部门对应角色" :visible.sync="dialogFormVisibleT" :append-to-body="true" width="30%">
      <el-form :model="form">
        <el-form-item prop="dept" label="部门：">
          <el-cascader
              change-on-select
              expand-trigger="click"
              filterable
              clearable
              :show-all-levels="false"
              :options="dept"
              v-model="form.dept"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item prop="role" label="角色：">
          <el-select v-model="form.role" filterable clearable placeholder="请选择" >
            <el-option
                v-for="item in role"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleT = false">取 消</el-button>
        <el-button type="primary" @click="addRole()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        dialogFormVisible:false,
        dialogFormVisibleT:false,
        form: {
          dept:[],
          role:'',
        },
        tableData:[],
        dept:[],
        role:[],
        edit_id:'',
      }
    },
    methods:{
      //同步部门员工信息
      synchro() {
        this.$get('updEmployeeInfo')
          .then(() => {
            this.$message({
              message:'同步成功',
              type: 'success'
            });
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      default() {
        this.$get('system/getDeptRolePageData')
          .then((data) => {
            this.tableData = data.conf;
            this.dept = data.dept;
            this.role = data.role;
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      handleEdit(index, row) {
        this.dialogFormVisible = true;
        this.edit_id = row.id;
      },
      //编辑
      determine() {
        this.$put('system/updDeptRole/' + this.edit_id ,this.form)
          .then( (data) => {
            if(data.code) {
              this.dialogFormVisible = false;
              this.form = {};
              this.$message({
                message: data.errorMsg,
                type: 'success'
              });
              this.default();
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
          this.$delete('system/delDeptRole/' + row[index].id)
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
      //设置部门对应角色
      addRoleT() {
        this.dialogFormVisibleT = true;
      },
      addRole() {
        this.$post('system/setDeptRole',this.form)
          .then( (data) => {
            if(data.code) {
              this.$message({
                message: data.errorMsg,
                type: 'success'
              });
              this.form = {};
              this.dialogFormVisibleT = false;
              this.default();
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
    },
    created () {
      this.default();
    }
  }
</script>

<style scoped>
  .x_new_title{

  }
</style>