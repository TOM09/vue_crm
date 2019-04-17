<template>
    <div class="inquiryListData">
        <div class="orderBtn" v-if="addShow">
            <el-button type="primary"><router-link to="addInquiry" style="color: #fff">+新建</router-link></el-button>
        </div>
        <div class="hitemlisttop">
            已选择<span>{{ number }}</span>项 <el-button type="text" @click="toggleSelection()">清空</el-button>
        </div>
        <el-card class="box-card">
          <div class="block">
            <span class="demonstration">
              <el-table ref="multipleTable" :data="list.data" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" align="center">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column fixed prop="code" label="咨询编号"></el-table-column>
                <el-table-column prop="product" label="咨询类目"> </el-table-column>
                <el-table-column prop="client_Intent" label="客户意向度"></el-table-column>
                 <el-table-column prop="future_price" align="center" label="预算"></el-table-column>
                <el-table-column prop="trench" label="来源"></el-table-column>
                <el-table-column prop="is_valid" label="是否有效"></el-table-column>
                <el-table-column prop="is_follow" label="是否可跟进"></el-table-column>
                <el-table-column prop="ask_method" label="咨询方式"></el-table-column>
                <el-table-column prop="static" label="状态"></el-table-column>
                <el-table-column prop="nickname" label="负责人"></el-table-column>
                <el-table-column prop="manager_nickname" label="销售主管"></el-table-column>
                <el-table-column prop="sale_nickname" label="销售负责人"></el-table-column>
                <el-table-column prop="ask_time" label="咨询日期"></el-table-column>
                <el-table-column prop="update_time" label="更新时间"></el-table-column>
                <el-table-column fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                  <el-button @click="transfer(scope.row)"  type="text" size="small" style="color: #4380ff;">查看</el-button>
                  <el-button @click="del_btn(scope.$index,list.data)" v-if="scope.row.is_del" type="text" size="small" style="color: #4380ff;">删除</el-button>
                </template>
                </el-table-column>
              </el-table>
            </span>
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.page"
              :page-sizes="[10, 20, 50, 100]" :page-size="form.pageSize" layout="total, sizes, prev, pager, next, jumper"
              :total="list.count">
            </el-pagination>
          </div>
        </el-card>
    </div>
</template>

<script>
  export default {
    name: 'inquiryListData',
    props: {
      list:{
        type:Object,
      }
    },
    data () {
        return {
          count:0,
          dialogVisible:false,
          form:{
            pageSize: 10,
            page: 1,
          },
          number:0,
          options:[
              {
                  value: '2',
                  label: '通过'
              }, {
                  value: '3',
                  label: '不通过'
              }
          ],
          addShow:false,
        }
    },
    methods: {
      handleSelectionChange (selection) {
        this.number = selection.length;
      },
      handleSizeChange(val) {
        this.form.pageSize = val;
        this.inquiryNewData();
      },
      handleCurrentChange(val) {
        this.form.page = val;
        this.inquiryNewData();
      },
      inquiryNewData () {
        this.$emit("inquiryNewData",this.form)
      },
      toggleSelection () {
          this.$refs.multipleTable.clearSelection();
      },
      transfer(row) {
          this.$router.push({name: 'inquiryDetail', params: {id: row.id}})
      },
      //删除
      del_btn(index,row) {
          this.$confirm('确认删除该咨询?删除后不可恢复, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              this.$post('consult/delete',{id:row[index].id})
                  .then((data) => {
                      if(data.code) {
                          row.splice(index, 1);
                          this.$message({
                              type: 'success',
                              message: '删除成功!'
                          });
                      }else {
                          this.$message({
                              type: 'warning',
                              message: data.errorMsg
                          });
                      }
                  })
                  .catch(() => { this.$message.error('服务器错误，请稍后重试') })
          }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消删除'
              });
          });
      },
    },
    created(){
      if(this.$route.name == 'inquiryList') {
        this.addShow = true;
      }
    },
  }
</script>

<style lang="less">
.inquiryListData{
    .orderBtn{
        margin-top: 20px;
        margin-left: 20px;
        margin-bottom: 20px;
    }
    .el-pagination{
        padding: 20px;
        text-align: center
    }
}
</style>
