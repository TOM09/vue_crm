<template>
  <div class="messageList">
    <el-card>
      <el-tabs  style="width: 100%" @tab-click="handleClick" v-model="form.type">
        <el-tab-pane label="待领取留言" class="cilentListPane" name="1">
          <messageSearch :searchList="wordsList" :range="'1'" @searchMessage="searchMessage"></messageSearch>
          <messageListData :wordsList="listData" @messageData="messageData"></messageListData>
        </el-tab-pane>
        <el-tab-pane label="全部留言" name="2">
          <messageSearch :searchList="wordsList" :range="'2'" @searchMessage="searchMessage"></messageSearch>
          <messageListData :wordsList="listData" @messageData="messageData"></messageListData>
        </el-tab-pane>
        <el-tab-pane label="我的留言" name="3">
          <messageSearch :searchList="wordsList" :range="'3'" @searchMessage="searchMessage"></messageSearch>
          <messageListData :wordsList="listData" @messageData="messageData"></messageListData>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import messageListData from '../.././components/w_message/messageListData';
import messageSearch from '../.././components/w_message/messageSearch';
export default {
  name:'messageList',
  components: {
    messageListData,
    messageSearch
  },
  data () {
    return {
      wordsList:{},
      listData:{},
      form:{
        type:'1',
        perPage:10,
        page:1,
      },
      ruleForm:{},
      formSearch:{},
    }
  },
  methods: {
    //切换
    handleClick(tab) {
      this.form.type = tab.name;
      this.message();
    },
    //分页数据
    messageData(val) {
      this.ruleForm = this.formSearch;
      this.ruleForm['perPage'] = val.perPage;
      this.ruleForm['page'] = val.page;
      this.ruleForm['type'] = this.form.type;
      this.$get('words',this.ruleForm)
        .then((data) => {
          this.listData = data.content.wordsList
        })
        .catch(()=> {

        })
    },
    //查询
    searchMessage(val) {
      this.formSearch = val;
      /*if(this.ruleForm.perPage || this.ruleForm.page) {
        this.formSearch['perPage'] = this.ruleForm.perPage;
        this.formSearch['page'] = this.ruleForm.page;
      }*/
      this.$get('words',this.formSearch)
        .then((data) => {
          this.listData = data.content.wordsList
        })
        .catch(()=> {})
    },
    //总数居
    message() {
      this.$get('words',this.form)
        .then((data) => {
          this.wordsList = data.content;
          this.listData = data.content.wordsList
        })
        .catch(()=> {})
    },

  },
  mounted(){
    this.message();
  }
}
</script>
<style>

</style>
