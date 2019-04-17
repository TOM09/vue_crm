<template lang="html">
  <el-card>
    <div slot="header" class="s_new_title">客户信息</div>
    <el-table :data="clientData" style="width: 100%">
      <el-table-column
        prop="code"
        label="客户编号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="company"
        label="客户名称"
        width="150">
      </el-table-column>
      <el-table-column
          prop="rank"
          label="客户级别">
      </el-table-column>
      <el-table-column
        prop="industry"
        label="行业">
      </el-table-column>
      <el-table-column
        prop="location"
        label="所在地">
      </el-table-column>
      <el-table-column
        prop="scale"
        label="公司规模">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建日期">
      </el-table-column>
      <el-table-column
        prop="linkman"
        label="联系人"
        align="center"
        width="520">
        <template slot-scope="scope">
            <el-table :data="scope.row.linkman" :show-header='false'>
                <el-table-column prop="link_name"></el-table-column>
                <el-table-column prop="link_type"></el-table-column>
                <el-table-column prop="telephone"></el-table-column>
            </el-table>
        </template>
      </el-table-column>
      <!--<el-table-column
                prop="consult_count"
                label="联系人"
        >
        </el-table-column>
        <el-table-column
                prop="consult_count"
                label="联系类型"
        >
        </el-table-column>
        <el-table-column
                prop="consult_count"
                label="联系方式"
        >
        </el-table-column>-->
      <el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="clientDetail(scope.row)" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
</el-card>
</template>

<script>
export default {
  name:'clientInfo',
  data(){
    return{
      clientData:[],
    }
  },
  methods:{
    clientDetail(row) {
			this.$router.push({name: 'clientDetail', params: {id : row.id}})
		}
  },
  created() {
    this.$get('consult/clientInfo',{id:this.$route.params.id})
      .then((data) => {
        if(data.code) {
          this.clientData = [];
          this.clientData.push(data.content);
        }else {
          this.$message({
            type:'warning',
            message:data.errorMsg
          })
        }
      })
      .catch(() => {})
  }
}
</script>

<style lang="less" scoped>
.s_new_title{
  font-size: 16px;
  font-weight: 700;
}
</style>
