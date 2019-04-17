<!-- 客服处理信息组件 -->
<template lang="html">
  <el-card class="clientInfo">
  <div slot="header" class="s_new_title">客服处理信息</div>
  <div class="x_details">
    <div class="x_details_child">
      <p><span>●</span>处理结果</p>
      <p>{{end_info[0]}}</p>
    </div>
    <div class="x_details_child">
      <p><span>●</span>结束原因</p>
      <p>{{end_info[1]}}</p>
    </div>
    <div class="x_details_child">
      <p><span>●</span>跟进次数</p>
      <p>{{end_info[2]}}</p>
    </div>
  </div>
  </el-card>
</template>

<script>
export default {
  name:'clientInformation',
  props:{
    end_info:{
      type:Array
    }
  },
  data(){
    return{
    }
  },
}
</script>

<style lang="less" scoped>
.clientInfo {
  font-size: 14px;
  .x_details {
    width: 100%;
    height: 100%;
    font-size: 16px;
    line-height: 30px;
  }
  .x_details_child{
    float:left;
    width: 33%;
    margin-bottom: 20px;
  }
  .x_details_child span{
    color:#409eff;
    margin-right: 5px;
    margin-left: 0px;
  }
  .x_details_child p:nth-child(2){
    margin-left: 15px;
    font-size: 14px;
  }
  .s_new_title{
    font-size: 16px;
    font-weight: 700;
  }
}
</style>
