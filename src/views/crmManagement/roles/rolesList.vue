<!--角色列表-->
<template>
  <div class="roles_list">
    <el-card>
      <div class="hitemlistbtn">
        <el-button type="primary" @click="addRoles()">+新建</el-button>
        <el-button type="primary" @click="enable()">启用</el-button>
        <el-button type="primary" @click="disable()">禁用</el-button>
      </div>
      <div class="hitemlisttop">
        已选择<span>{{ number }}</span>项 <el-button type="text" @click="toggleSelection()">清空</el-button>
      </div>
      <el-card>
        <div class="hblock">
				<span class="demonstration">
					<el-table ref="multipleTable" :data="rolesLists" tooltip-effect="dark" width="100%" @selection-change="handleSelectionChange" align="center">
						<el-table-column type="selection" width="55">
            </el-table-column>
						<el-table-column prop="name" label="角色名称">
            </el-table-column>
						<el-table-column prop="status_title" label="状态">
            </el-table-column>
            <el-table-column
              prop="status_title"
              label="状态"
              :filters="[{ text: '有效', value: '有效' }, { text: '无效', value: '无效' }]"
              :filter-method="filterTag"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.status_title === '有效' ? 'primary' : 'danger'"
                  disable-transitions>{{scope.row.status_title}}</el-tag>
              </template>
            </el-table-column>
						<el-table-column prop="create_time" label="创建时间">
            </el-table-column>
						<el-table-column prop="del_time" label="失效时间">
            </el-table-column>
						<el-table-column fixed="right" label="操作">
							<template slot-scope="scope">
								<el-button type="text" @click="roleDetail(scope.row)" size="small">查看</el-button>
                <el-button type="text" @click="roleClick(scope.row)" size="small">{{scope.row.status === 0 ? '禁用' : '启用'}}</el-button>
                <el-button type="text" v-if="scope.row.is_del" @click="deleteClick(scope.row)" size="small">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</span>
          <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="form.currentPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="form.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="count"
              style="text-align: center; margin-top: 15px;">
          </el-pagination>
        </div>
      </el-card>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "roles-list",
    data(){
      return {
        number:0,
        rolesLists:[],
        count:0,
        form:{
          pageSize:10,
          currentPage:1,
        },
        role_ids:[], //启用禁用
      }
    },
    methods:{
      addRoles () {
        this.$router.push({name:'addRoles'})
      },
      filterTag(value, row) {
        return row.status_title === value;
      },
      handleSizeChange(val) {
        this.form.pageSize = val;
        this.form.currentPage = 1;
        this.roleList();
      },
      handleCurrentChange(val) {
        this.form.currentPage = val;
        this.roleList();
      },
      roleList(){
        this.$get('role/roleList',this.form)
          .then((data) => {
            if(data.code) {
              this.rolesLists = data.content.detail;
              this.count = data.content.count;
            }else {
              this.$message({
                type: 'warning',
                message: data.errorMsg
              });
            }
          })
          .catch(() => {})
      },
      // 列表的选择状态
      handleSelectionChange(val) {
        this.number = val.length;
        for(let i in val) {
          this.role_ids.push(val[i].id);
        }
      },
      // 清空所选状态
      toggleSelection(){
        this.$refs.multipleTable.clearSelection();
      },
      roleDetail(row){
        this.$router.push({
          name: 'rolesDetails',
          params: {
            id : row.id}
        })
      },
      roleClick(row){
        this.$confirm('确定要进行该操作吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.role_ids.push(row.id);
          this.$post('role/roleCloseon',{role_ids:this.role_ids,status:row.status === 1 ? 0 : 1})
            .then((data) => {
              if(data.code) {
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                });
                this.roleList();
              }
            })
            .catch(() => {})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      //启用
      enable() {
        this.$confirm('确定要全部启用吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('role/roleCloseon',{role_ids:this.role_ids,status:0})
            .then((data) => {
              if(data.code) {
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                });
                this.roleList();
              }
            })
            .catch(() => {})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      //禁用
      disable(){
        this.$confirm('确定要全部禁用吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('role/roleCloseon',{role_ids:this.role_ids,status:1})
            .then((data) => {
              if(data.code) {
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                });
                this.roleList();
              }
            })
            .catch(() => {})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      deleteClick (row) {
        this.$confirm('确定要删除该角色吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post('role/delRole',{id:row.id})
            .then((data) => {
              if(data.code) {
                this.$message({
                  type: 'success',
                  message: data.errorMsg
                });
                this.roleList();
              } else {
                this.$message({
                  type: 'warning',
                  message: data.errorMsg
                })
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
    created(){
      this.roleList();
    }
  }
</script>

<style scoped>

</style>
