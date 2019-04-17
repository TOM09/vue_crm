<template>
  <div class="clientList">
    <el-card>
      <el-tabs  style="width: 100%" @tab-click="handleClick" v-model="range">
        <el-tab-pane label="全部服务商" class="cilentListPane" name="1">
          <facilitatorSearch :searchList="searchList,region,product,range" @eventFromChild="eventFromChild"></facilitatorSearch>
          <facilitatorList :clientList="clientList,count,person,x_form,name" @client="client"></facilitatorList>
        </el-tab-pane>
       
         <el-tab-pane label="我的服务商" name="2">
          <facilitatorSearch :searchList="searchList,region,product,range" @eventFromChild="eventFromChild"></facilitatorSearch>
          <facilitatorList :clientList="clientList,count,person,x_form,name" @client="client"></facilitatorList>
        </el-tab-pane>

      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import facilitatorList from '../.././components/sh_facilitator/facilitatorList';
  import facilitatorSearch from '../.././components/sh_facilitator/facilitatorSearch';

  export default {
    name:'clientList',
    components: {
      facilitatorList,
      facilitatorSearch
    },
    data () {
      return {
        activeName:'1',
        searchList:{},
        region:[],    //地区
        person:[],	//人员
        product:[],
        clientList: [], //客户列表
        count: 0,
        new_time:(this.$route.params.time ? this.$route.params.time : ""),
        x_form:{
          range:'1',
        },
        range:'1',
        searchData:{},
        name:'1',
      }
    },
    methods: {     
      //查询所需的条件
      filterConditions () {
        this.$get( 'serviceProvider/getSelData')
          .then((data) => {
            if(data.code) {
              this.searchList = data.content;
              this.region = data.content.region;
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })

          //选项 产品列表
        this.$get( 'crmManagement/item/addItem')
          .then((data) => {
            this.product = data.content.product;
          })
          .catch((data) => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      //服务商列表
      eventFromChild (data) {
        this.searchData = data;
        this.searchData.range = this.range;
        console.log(this.searchData)
        this.$get( 'serviceProvider/providerList',this.searchData)
          .then( (data) => {
              console.log(data)
            if(data.code) {
              this.clientList = data.content.data;
              this.count = data.content.count;
            }
          })
          .catch( (data) => {
            this.$message.error('服务器错误，请稍后重试');
          });
        this.x_form = data; //查询的限制条件传给组件
      },
      //切换权限
      handleClick(tab) {
        this.range = tab.name;
        this.searchData.range = tab.name;
        if(this.new_time) {
          this.searchData.new_time = this.new_time;
          this.x_form.new_time = this.new_time;
        }
        this.$get( 'serviceProvider/providerList',this.searchData)
          .then((data) => {
              console.log(data)
            if(data.code) {
              this.clientList = data.content.data;
              this.count = data.content.count;
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          });
        this.name = tab.name;
      },
      //刷新列表
      client (data) {
        console.log(data)
        this.clientList = data[0];
        this.count = data[1]
      },
      // 监听
      getParams(){
        let routerParams = this.$route.params.time;
        this.new_time = routerParams;
      },
    },
    watch:{
      '$route':'getParams'
    },
    created(){
      this.getParams();
      this.filterConditions();   //查询需要的条件
    },
  }
</script>
<style>

</style>
