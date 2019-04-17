<!-- 留言信息列表组件 -->
<template lang="html">
  <el-card>
    <div slot="header" class="s_new_title">留言信息</div>
    <el-table :data="LeaveWords_info">
      <el-table-column prop="word_code" label="留言编号" width="150">
      </el-table-column>
      <el-table-column prop="data_source" label="数据来源" width="150">
      </el-table-column>
      <el-table-column prop="contacts" label="联系方式">
      </el-table-column>
      <el-table-column prop="category" label="留言类目">
      </el-table-column>
      <el-table-column prop="contacts_time" label="联系时间">
      </el-table-column>
      <el-table-column prop="region" label="留言地区">
      </el-table-column>
      <el-table-column prop="create_time" label="提交时间">
      </el-table-column>
      <el-table-column prop="leader" label="负责人">
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
</el-card>
</template>
<script>
export default {
  name:'messageInfo',
  props:{
    LeaveWords_info:{
      type:Array
    }
  },
  data(){
    return{
    }
  },
  methods:{
    handleClick(row){
      this.$router.push({name:'messageDetail',params:{id:row.id}});
    }
  },
  created() {

  }
}
</script>

<style lang="css" scoped>
.s_new_title{
  font-size: 16px;
  font-weight: 700;
}
</style>
