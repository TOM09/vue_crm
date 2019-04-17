<template>
  <el-card class="inquoryList">
    <el-tabs v-model="form.range" @tab-click="handleClick" class="hitemList">
      <el-tab-pane label="待处理" name="wait">
        <inquirySearch @searchNew="searchNew"  :range="form.range" :auth="form.auth"></inquirySearch>
        <inquory_list  :list="list" @inquiryNewData="paging"></inquory_list>
      </el-tab-pane>
      <el-tab-pane label="全部咨询" name="all">
        <inquirySearch @searchNew="searchNew"  :range="form.range" :auth="form.auth"></inquirySearch>
        <inquory_list  :list="list" @inquiryNewData="paging"></inquory_list>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
  import inquory_list from '@/views/components/inquiry/inquiryList';
  import inquirySearch from '@/views/components/inquiry/inquirySearch';
  export default {
    name: "inquiryList",
    components:{
      inquirySearch,
      inquory_list
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
        range:'',
        formSearch:{},
      }
    },
    methods:{
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
        this.formSearch['range'] = this.form.range;
        this.$get('consult/list',this.formSearch)
          .then((data) => {
            if(data.code){
              this.list = data.content;
            }
          })
          .catch(() => {})
      },
      //查询
      searchNew(val) {
        this.ruleForm = val;
        this.formSearch['range'] = this.form.range;
        this.ruleForm['perPage'] = 10;
        this.ruleForm['page'] = 1;
        this.$get('consult/list',this.ruleForm)
          .then((data) => {
            if(data.code){
              this.list = data.content;
            }
          })
          .catch(() => {})
      },
      consult(){
        this.$get('consult/list',this.form)
          .then((data) => {
            if(data.code){
              this.list = data.content;
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
