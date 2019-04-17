<template>
  <div class="itemList">
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick" class="hitemList">
        <el-tab-pane label="全部项目" name="all">
          <itemSearch @itemQuery="itemQuery" :searchData="searchData" :range="form.range" :product="product"></itemSearch>
          <ItemAll ref="profile" :itemList="itemList" :count="count" @itemPaging="itemPaging"></ItemAll>
        </el-tab-pane>
        <el-tab-pane label="我的项目" name="mine">
          <itemSearch @itemQuery="itemQuery" :searchData="searchData" :range="form.range" :product="product"></itemSearch>
          <ItemAll ref="profile" :itemList="itemList" :count="count" @itemPaging="itemPaging"></ItemAll>
        </el-tab-pane>
         <el-tab-pane label="未成单项目" name="no_order">
           <itemSearch @itemQuery="itemQuery" :searchData="searchData" :range="form.range" :product="product"></itemSearch>
           <ItemAll ref="profile" :itemList="itemList" :count="count" @itemPaging="itemPaging"></ItemAll>
         </el-tab-pane>
         <el-tab-pane label="已成单项目" name="has_order">
           <itemSearch @itemQuery="itemQuery" :searchData="searchData" :range="form.range" :product="product"></itemSearch>
           <ItemAll ref="profile" :itemList="itemList" :count="count" @itemPaging="itemPaging"></ItemAll>
         </el-tab-pane>
         <el-tab-pane label="超过七天未跟进" name="no_follow">
           <itemSearch @itemQuery="itemQuery"  :searchData="searchData" :range="form.range" :product="product"></itemSearch>
           <ItemAll  ref="profile" :itemList="itemList" :count="count" @itemPaging="itemPaging"></ItemAll>
         </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import itemSearch from '@/views/components/h_item/itemSearch'
  import ItemAll from '@/views/components/h_item/itemList'
  import Util from '@/libs/util';
  export default {
    name: 'itemList',
    components: {
      itemSearch,
      ItemAll
    },
    data () {
      return {
        activeName: 'all',
        itemList: [],
        count: 0,
        searchData:{},
        product:[],
        form:{
          perPage: 10,
          currentPage: 1,
          range:'all'
        },
        formSearch: {},
        ruleForm:{},
      }
    },
    methods: {
      handleClick(tab) {
        this.form.range = tab.name;
        this.itemAjax();
      },

      itemAjax () {
        // let form = Util.makeArgsObj(this.form);
        this.$get('crmManagement/item/itemList', this.form)
          .then((data) => {
            this.searchData = data.content;
            this.product = data.content.product;
            this.itemList = data.content.projectList;
            this.count = data.content.count;
          })
          .catch(() => {})
      },
      itemQuery (val) {
        this.ruleForm = val;
        this.ruleForm['perPage'] = 10;
        this.ruleForm['currentPage'] = 1;
        this.formSearch['range'] = this.form.range;
        this.$refs.profile.info();
        let form = Util.makeArgsObj(this.ruleForm);
        this.$get('crmManagement/item/itemList',form)
          .then((data) => {
            this.itemList = data.content.projectList;
            this.count = data.content.count;
          })
          .catch(() => {})
      },
      itemPaging (val) {
        this.formSearch = this.ruleForm;
        this.formSearch['range'] = this.form.range;
        this.formSearch['perPage'] = val.pageSize;
        this.formSearch['currentPage'] = val.currentPage;
        let form = Util.makeArgsObj(this.formSearch);
        this.$get('crmManagement/item/itemList',form)
          .then((data) => {
            this.itemList = data.content.projectList;
            this.count = data.content.count;
          })
          .catch(() => {})
      },
    },
    created (){
      this.itemAjax();
    },
  };
</script>
