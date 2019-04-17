<template>
  <div class="reportList">
    <el-card>
      <el-tabs v-model="approval" @tab-click="tabClick">
        <el-tab-pane label="全部报告" name="all">
          <listSearch :approval="approval" @searchData="searchData"></listSearch>
          <listDetails :listData="listData,count" @sizeC="sizeC" @currentC="currentC" @dialogVisible="dialogVisible"></listDetails>
        </el-tab-pane>
        <el-tab-pane label="待审批的" name="not">
          <listSearch :approval="approval" @searchData="searchData"></listSearch>
          <listDetails :listData="listData,count" @sizeC="sizeC" @currentC="currentC" @dialogVisible="dialogVisible"></listDetails>
        </el-tab-pane>
        <el-tab-pane label="已审批的" name="end">
          <listSearch :approval="approval" @searchData="searchData"></listSearch>
          <listDetails :listData="listData,count" @sizeC="sizeC" @currentC="currentC" @dialogVisible="dialogVisible"></listDetails>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import listSearch from '../.././components/s_report/listSearch'
  import listDetails from '../.././components/s_report/listDetails'
  export default {
    components: { listSearch,listDetails },
    data () {
      return {
        approval:this.$route.params.approval ? this.$route.params.approval : 'all',
        count: 0,
        showCount:'',
        thirdCount:'',
        num: 0,
        person: [],
        listData: [],
        formList: {
          currentPage: 1,
          pageSize: 10,
        }
      }
    },
    methods: {
      tabClick (tab) {
        this.approval = tab.name;
        this.$get( 'weekmonthwork/weekList',{approval: this.approval})
          .then( (data) => {
            // this.num = 1;
            this.person = data.content.person;
            this.count = data.content.count;
            this.listData = data.content.detail;
          })
          .catch( (error) => {

          })
        /*if(tab.name == 'first'){
            this.$get( 'weekmonthwork/weekList',{approval: 'all'})
                .then( (data) => {
                    this.num = 1;
                    this.person = data.content.person;
                    this.count = data.content.count;
                    this.listData = data.content.detail;
                })
                .catch( (error) => {

                })
        } else if (tab.name == 'second') {
            this.$get( 'weekmonthwork/weekList',{approval: 'not'})
                .then( (data) => {
                    this.num = 2;
                    this.person = data.content.person;
                    this.count = data.content.count;
                    this.showCount = data.content.count;
                    this.listData = data.content.detail;
                })
                .catch( (error) => {

                })
        } else if (tab.name == 'third') {
            this.$get( 'weekmonthwork/weekList',{approval: 'end'})
                .then( (data) => {
                    this.num = 3;
                    this.person = data.content.person;
                    this.count = data.content.count;
                    this.listData = data.content.detail;
                })
                .catch( (error) => {

                })
        } else {
            this.$message({
                message: '请选择标签，全部、待审批、已审批',
                type: 'warning'
            });
        }*/
      },
      dataNew () {
        this.$get( 'weekmonthwork/weekList',this.formList)
          .then( (data) => {
            this.count = data.content.count;
            this.listData = data.content.detail;
          })
          .catch( (error) => {

          })
      },
      sizeC (val) {
        this.formList.pageSize = val;
        this.dataNew();
      },
      currentC (val) {
        this.formList.currentPage = val;
        this.dataNew();
      },
      dialogVisible(data) {
        if(data) {
          this.$get( 'weekmonthwork/weekList',{approval: 'all'})
            .then( (data) => {
              this.num = 1;
              this.person = data.content.person;
              this.count = data.content.count;
              this.listData = data.content.detail;
            })
            .catch( (error) => {

            })
        }
      },
      searchData (data) {
        this.$get( 'weekmonthwork/weekList',data)
          .then( (data) => {
            this.person = data.content.person;
            this.count = data.content.count;
            this.listData = data.content.detail;
          })
          .catch( (error) => {

          })
        /*
        if (this.num === 1) {
            this.$get( 'weekmonthwork/weekList',data)
                .then( (data) => {
                    this.person = data.content.person;
                    this.count = data.content.count;
                    this.listData = data.content.detail;
                })
                .catch( (error) => {

                })
        } else if (this.num === 2) {
            this.$get( 'weekmonthwork/weekList',data)
                .then( (data) => {
                    this.person = data.content.person;
                    this.count = data.content.count;
                    this.listData = data.content.detail;
                })
                .catch( (error) => {

                })
        } else if (this.num === 3) {
             this.$get( 'weekmonthwork/weekList',data)
                .then( (data) => {
                    this.person = data.content.person;
                    this.count = data.content.count;
                    this.listData = data.content.detail;
                })
                .catch( (error) => {

                })
        }*/
      }
    },
    created () {
      this.tabClick({name: this.approval})
    }
  }
</script>

<style lang="less" scoped>

</style>
