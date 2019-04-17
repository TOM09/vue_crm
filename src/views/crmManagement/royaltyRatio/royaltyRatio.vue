<template>
  <el-card class="royaltyRatio">
    <el-tabs v-model="form.range" @tab-click="handleClick" class="hitemList">
      <el-tab-pane label="提成比例" name="wait">
        <!-- <inquirySearch @searchNew="searchNew"  :range="form.range" :auth="form.auth"></inquirySearch> -->
        <royaltyRatioSearch @searchNew="searchNew"  :range="form.range" :auth="form.auth"></royaltyRatioSearch>
        <!-- <inquory_list  :list="list" @inquiryNewData="paging"></inquory_list> -->
        <royaltyRatioList :list="list" :listdata="listdata" @client="client" :x_form="x_form" @inquiryNewData="paging"></royaltyRatioList>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
  import royaltyRatioList from '@/views/components/RoyaltyRatio/royaltyRatioList';
  import royaltyRatioSearch from '@/views/components/RoyaltyRatio/royaltyRatioSearch';
  export default {
    name: "royaltyRatio",
    components:{
      royaltyRatioList,
      royaltyRatioSearch
    },
    data(){
      return {
        ruleForm:{},
        form:{
          range: 'wait',
          perPage: 10,
          page: 1,
          auth: 1,
        },
        list:{},
        listdata:[],
        x_form:{},
        range:'',
        formSearch:{},
      }
    },
    methods:{
       //刷新列表
      client (data) {
        this.listdata = data[0].data;
        this.list = data[0];
      },
      //切换
      handleClick(tab) {
        this.form.range = tab.name;
        this.consult();
      },
      //分页
      paging(val) {
        this.formSearch = this.ruleForm;
        this.formSearch['perPage'] = val.pageSize;
        this.formSearch['page'] = val.page;
        this.$get('orderRoyalty/royaltyList',this.formSearch)
          .then((data) => {
            if(data.code){
              this.list = data.content;
              this.listdata = data.content.data;

            }
          })
          .catch(() => {})
      },
      //查询
      searchNew(val) {
        this.ruleForm = val;
        this.ruleForm['perPage'] = 10;
        this.ruleForm['page'] = 1;
        this.$get('orderRoyalty/royaltyList',this.ruleForm)
          .then((data) => {
            if(data.code){
              this.list = data.content;
              this.listdata = data.content.data;
            }
          })
          .catch((data) => {'服务器错误，请稍后重试'})
        this.x_form = val; //查询的限制条件传给组件
      },
      consult(){
        this.$get('orderRoyalty/royaltyList',this.form)
          .then((data) => {
            if(data.code){
              this.list = data.content;
              this.listdata = data.content.data;
            }
          })
          .catch(() => {})
      }
    },
    created(){
      this.consult();
    }
  }
</script>

<style scoped>

</style>
