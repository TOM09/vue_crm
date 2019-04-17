<!-- 销售跟进信息组件 -->
<template lang="html">
<div class="sale_info">
  <el-card>
     <div slot="header" class="s_new_title">跟进记录</div>
    <el-table
      :data="log_info"
      style="width: 100%">
      <el-table-column
        prop="create_time"
        label="跟进时间">
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="跟进人">
      </el-table-column>
      <el-table-column
        prop="identity"
        label="跟进人身份">
      </el-table-column>
      <el-table-column
        prop="button_text"
        label="跟进类型">
      </el-table-column>
      <el-table-column
        prop="content"
        label="跟进内容">
      </el-table-column>
    </el-table>
    <el-pagination
       style="margin-top:20px;"
       @size-change="handleSizeChange"
       @current-change="handleCurrentChange"
       :current-page="form.page"
       :page-sizes="[10, 20, 50, 100]"
       :page-size="form.perPage"
       layout="total, sizes, prev, pager, next, jumper"
       :total="count">
     </el-pagination>
</el-card>
<el-card>
  <div slot="header" class="s_new_title">相关项目信息</div>
  <el-table :data="pro_info" style="width: 100%">
    <el-table-column
      prop="code"
      label="项目编号"
      width="180">
      <template slot-scope="scope">
        <el-button @click="itemDetail(scope.row)" type="text" size="medium">{{scope.row.code}}</el-button>
      </template>
    </el-table-column>
    <el-table-column
      prop="name"
      label="项目名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="company"
      label="客户名称">
    </el-table-column>
    <el-table-column
      prop="origin"
      label="来源">
    </el-table-column>
    <el-table-column
      prop="intention"
      label="意向">
    </el-table-column>
    <el-table-column
      prop="salesman"
      label="销售">
    </el-table-column>
    <el-table-column
      prop="product_name"
      label="产品">
    </el-table-column>
    <el-table-column
      prop="future_price"
      label="预算（元）">
    </el-table-column>
    <el-table-column
      prop="stage"
      label="状态">
    </el-table-column>
    <el-table-column
      prop="create_time"
      label="创建日期">
    </el-table-column>
  </el-table>
</el-card>
</div>
</template>

<script>
export default {
  name:'sfuInfo',
  props:[],
  data(){
    return{
      log_info:[],
      pro_info:[],
      count:0,
      form:{
        id:'',
        page:1,
        perPage:10,
      },
    }
  },
  methods:{
    handleSizeChange(val) {
      this.form.perPage = val;
      this.follow_log_info();
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.follow_log_info();
    },
    itemDetail(row){
      this.$router.push({name:'itemDetail',params:{id:row.id}})
    },
    follow_log_info() {
      this.$get('consult/follow_log_info',this.form)
        .then((data) => {
          if(data.code) {
            this.log_info = data.content.log_info.data;
            this.count = data.content.log_info.count;
            this.pro_info = data.content.pro_info;
          }else{
            this.$message({
              type:'warning',
              message:data.errorMsg
            })
          }
        })
        .catch(() => {})
    }
  },
  created(){
    this.form.id = this.$route.params.id
    this.follow_log_info()
  }
}
</script>
<style lang="less" scoped>
.sale_info{
  .s_new_title{
    font-size: 16px;
    font-weight: 700;
  }
  .el-card{
    margin-bottom: 15px;
  }
}
</style>
