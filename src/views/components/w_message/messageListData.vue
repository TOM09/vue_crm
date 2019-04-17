<!--// 客户列表组件-->
<template>
  <div class="dataList">
    <div class="hitemlisttop">
      已选择<span>{{ number }}</span>项 <el-button type="text" @click="toggleSelection()">清空</el-button>
    </div>
    <el-card class="box-card">
      <div class="block">
        <span class="demonstration">
          <el-table ref="multipleTable"  :data="wordsList.data" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" align="center">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column fixed prop="word_code" label="留言编号"></el-table-column>
            <el-table-column prop="data_source" label="数据来源"></el-table-column>
            <el-table-column prop="contacts" label="联系方式"></el-table-column>
            <el-table-column prop="category" label="留言类目"></el-table-column>
            <el-table-column prop="contacts_time" label="联系时间"></el-table-column>
            <el-table-column prop="region" label="留言地区"></el-table-column>
            <el-table-column prop="page_source" label="页面来源"></el-table-column>
            <el-table-column prop="create_time" label="提交时间"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column prop="nickname"  label="负责人"></el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="gotoInfo(scope.row)">查看</el-button>
                <el-button @click="transfer(scope.row)" v-if="scope.row.status == '待领取'" type="text" size="small">领取</el-button>
              </template>
            </el-table-column>
          </el-table>
        </span>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="form.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="form.perPage"
          layout="total, sizes, prev, pager, next, jumper"
          :total="wordsList.count">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'messageListData',
    props: {
      wordsList:{
        type:Object
      }
    },
    data () {
      return {
        dialogFormVisible: false,
        selectedOptions:[],
        form: {
            perPage:10,
            page:1,
        },
        client: [],
        number: 0,
        date: {
            project: false,
            order: false,
            id_all:[],
            new_dd_id: '',
        },
        selectionAll:[],
      }
    },
    methods: {
      toggleSelection(){
          this.$refs.multipleTable.clearSelection();
      },
      transfer(row) {
        this.$confirm('是否确认领取', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
          this.$post( 'words/receiveWords',{id:row.id})
            .then( (data) => {
              if(data.code){
                this.$message({
                    type: 'success',
                    message: '领取成功!'
                });
                this.form.client = '';
                this.client = [];
                this.date.project = false;
                this.date.order = false;
                this.message_list();
              } else {
                this.$message({
                    message: data.errorMsg,
                    type: 'warning'
                });
              }
            })
            .catch ( (error) => {
            })
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消转移'
            });
        });
      },
      gotoInfo(row){
            this.$router.push({name: 'messageDetail',params:{id:row.id}})
        },
      transferTrue(){
        this.$confirm('是否确认转移', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post( 'client/transfer',this.date)
            .then( (data) => {
              if(data.code){
                this.$message({
                    type: 'success',
                    message: '转移成功!'
                });
                this.dialogFormVisible = false;
                this.form.client = '';
                this.client = [];
                this.date.project = false;
                this.date.order = false;
                this.message_list();
              } else {
                this.$message({
                    message: data.errorMsg,
                    type: 'warning'
                });
              }
            })
            .catch ( (error) => {
            })
          }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消转移'
              });
          });
      },
        handleSizeChange(val) {
            this.form.perPage = val;
            this.message_list();
        },
        handleCurrentChange(val) {
            this.form.page = val;
            this.message_list();
        },
        message_list () {
          this.$emit("messageData",this.form)
        },
        // 列表的选择状态
        handleSelectionChange(val) {
            this.date.id_all = [];
            if(val.length > 0){
                for(let i = 0; i < val.length; i++){
                    this.date.id_all.push(val[i].id);
                    this.date.id_all = Array.from(new Set(this.date.id_all))
                }
            }else{
                this.selectionAll = [];
            }
            this.number = val.length;
        },
    },

  }
</script>
<style scoped>
    .btn{
        margin-top: 15px;
        margin-bottom: 15px;
    }
    .s_client_loading{
        width: 100%;
        height: 50px;
        text-align: left;
        line-height: 50px;
        text-indent:2em;
        background: #e1e1e1;
    }
    .s_client_loading span{
        color: #fff;
        margin-left: 10px;
    }
    .el-pagination{
        padding: 20px;
        text-align: center
    }
    .box-card {
        margin: 0;
    }
</style>
