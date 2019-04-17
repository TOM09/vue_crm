<template>
<el-card class="consulting_info">
  <div slot="header" class="s_new_title">咨询信息</div>
  <el-table :data="contactlist" style="width: 100%">
    <el-table-column fixed prop="code" label="咨询编号"></el-table-column>
    <el-table-column prop="pro_id_text" label="咨询类目"></el-table-column>
    <el-table-column prop="client_Intent" label="客户意向度"></el-table-column>
    <el-table-column prop="future_price" label="预算"></el-table-column>
    <el-table-column prop="trench_text" label="来源"></el-table-column>
    <el-table-column prop="is_valid_text" label="是否有效"></el-table-column>
    <el-table-column prop="is_follow_text" label="是否可跟进"></el-table-column>
    <el-table-column prop="ask_method_text" label="咨询方式"></el-table-column>
    <el-table-column prop="status_text" label="状态"></el-table-column>
    <el-table-column prop="ask_time" label="咨询日期"></el-table-column>
    <el-table-column  fixed="right" label="操作" width="120">
      <template slot-scope="scope">
        <el-button @click="inquiryClick(scope.row)" type="text" size="mini">查看</el-button>
      </template>
    </el-table-column>
  </el-table>
</el-card>
</template>

<script>
export default {
  props:{
    contactlist:{
      type:Array
    }
  },
  data(){
    return {

    }
  },
  methods:{
    inquiryClick(row) {
      this.$router.push({name:'inquiryDetail',params:{id:row.id}})
    }
  }
}
</script>

<style lang="less">
  .consulting_info{
    .s_new_title{
      font-size: 16px;
      font-weight: 700;
    }
  }
</style>
