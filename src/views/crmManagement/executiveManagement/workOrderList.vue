<template>
  <div class="workOrderList">
    <el-card>
      <el-tabs class="s_woek_tab" @tab-click="handleClick">
        <el-tab-pane class="s_work_pane">
          <el-badge slot="label" :is-dot ="this.showCount > 0" class="item">待办工单</el-badge>
          <workSearch :searchList="searchList,page" :searchListStep = 'searchListStep' @searchNewList="searchNewList"></workSearch>
          <workList :workListLoad="workListLoad,count,page,searchData" @workList="workList"></workList>
        </el-tab-pane>
        <el-tab-pane class="s_work_pane">
          <el-badge slot="label" class="item">全部工单</el-badge>
          <workSearch :searchList="searchList,page"  @searchNewListAll="searchNewListAll"></workSearch>
          <workList :workListLoad="workListLoad,count,page,searchData" @workListAll="workListAll"></workList>
        </el-tab-pane>
        <el-tab-pane class="s_work_pane">
          <el-badge slot="label" class="item">我的工单</el-badge>
          <workSearch :searchList="searchList,page" @searchNewMyList="searchNewMyList"></workSearch>
          <workList :workListLoad="workListLoad,count,page,searchData" @myWorkList="myWorkList"></workList>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
  import workList from '../.././components/s_work/workNewList'
  import workSearch from '../.././components/s_work/workNewSearch'

  export default {

    components: { workList, workSearch },

    data () {
      return {
        workListLoad: [],
        count: 0,
        showCount:'',
        pageSize: 10,
        page: 0,
        searchList: {
          product:[],
          step:[]
        },
        searchData:{
          type:2
        },
        searchListStep:[]
      }
    },
    methods: {
      workList (data) {
        this.workListLoad = data;
      },
      workListAll (data) {
        this.workListLoad = data;
      },
      myWorkList (data) {
        this.workListLoad = data;
      },
      searchNewList(data) {
        this.searchData = data;
        this.searchData['range'] = "pending";
        this.$get( 'manageNew/manageList',this.searchData)
          .then ( (data) => {
            this.workListLoad = data.content.data;
            this.count = data.content.count;
            this.showCount = data.content.count;
            this.page = 0;
          })
          .catch (() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      searchNewListAll (data) {
        this.searchData = data;
        this.searchData['range'] = "all";
        this.$get( 'manageNew/manageList',this.searchData)
          .then ( (data) => {
            this.workListLoad = data.content.data;
            this.count = data.content.count;
            this.page = 1;
          })
          .catch (() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      searchNewMyList  (data) {
        this.searchData = data;
        this.searchData['range'] = "mine";
        this.$get( 'manageNew/manageList',this.searchData)
          .then ( (data) => {
            this.workListLoad = data.content.data;
            this.count = data.content.count;
            this.page = 2;
          })
          .catch (() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      handleClick (tab) {
        if(tab.index == 0){
          this.$get( 'manageNew/manageList',{range :"pending",type:this.searchData.type})
            .then ( (data) => {
              this.workListLoad = data.content.data;
              this.count = data.content.count;
              this.showCount = data.content.count;
              this.page = 0;
            })
            .catch (() => {
              this.$message.error('服务器错误，请稍后重试');
            })
        } else if (tab.index == 1) {
          this.$get( 'manageNew/manageList',{range :"all",type:this.searchData.type})
            .then ( (data) => {
              this.workListLoad = data.content.data;
              this.count = data.content.count;
              this.page = 1;
            })
            .catch (() => {
              this.$message.error('服务器错误，请稍后重试');
            })
        } else if (tab.index == 2) {
          this.$get( 'manageNew/manageList',{range :"mine",type:this.searchData.type})
            .then ( (data) => {
              this.workListLoad = data.content.data;
              this.count = data.content.count;
              this.page = 2;
            })
            .catch (() => {
              this.$message.error('服务器错误，请稍后重试');
            })
        } else {
          this.$message({
            showClose: true,
            message: '请点击待办或者全部工单',
            type: 'warning'
          });
        }
      },
      workListNewData() {
        this.searchData['range'] = "pending";
        this.$get( 'manageNew/manageList',this.searchData)
          .then ( (data) => {
            this.searchList = data.content;
            this.searchListStep = data.content.step;
            this.workListLoad = data.content.data;
            this.count = data.content.count;
            this.showCount = data.content.count;
            this.page = 0;
          })
          .catch (() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      }
    },
    created () {
       var htmlHref = window.location.href;
			htmlHref = htmlHref.replace(/^http:\/\/[^/]+/, "");
			var addr = htmlHref.substr(htmlHref.lastIndexOf('/', htmlHref.lastIndexOf('/') - 1) + 1);
      var index = addr.lastIndexOf("\/");
      var addrLast = decodeURI(addr.substring(index + 1, addr.length));
      if(addrLast == 'PresaleWorkOrderList'){
        this.searchData.type = 1;
      }else{
        this.searchData.type = 2;
      }

      if(this.page == 0){
        this.workListNewData();
      } else if (this.page == 1){
        this.searchData['range'] = "all";
        this.$get( 'manageNew/manageList',this.searchData)
          .then ( (data) => {
            this.workListLoad = data.content.data;
            this.count = data.content.count;
            this.page = 1;
          })
          .catch (() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      } else if (this.page == 2){
        this.searchData['range'] = "mine";
        this.$get( 'manageNew/manageList',this.searchData)
          .then ( (data) => {
            this.workListLoad = data.content.data;
            this.count = data.content.count;
            this.page = 1;
          })
          .catch (() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      }
    }
  }
</script>

<style lang="less" scoped>
  .workOrderList {
    .s_woek_tab {
      width: 100%;
      margin: auto;
    }
    .s_work_btn {
      margin-top: 10px;
    }
    .s_work_form_item {
      margin-left: 50px;
    }
    .demo-table-expand {
      height: 50px;
    }
    .el-tabs__item {
      font-size: 16px;
      line-height: 29px !important;
      height: 45px !important;
    }
    .item{
      margin-top: 10px;
    }
  }
</style>
