<template>
  <div class="clientList">
    <el-card>
      <el-tabs  style="width: 100%" @tab-click="handleClick" v-model="range">
        <el-tab-pane label="全部客户" class="cilentListPane" name="1">
          <clientSearch :searchList="searchList,dept,range" @eventFromChild="eventFromChild"></clientSearch>
          <clientListData :clientList="clientList,count,person,x_form,name" @client="client"></clientListData>
        </el-tab-pane>
       
         <el-tab-pane label="我的客户" name="2">
          <clientSearch :searchList="searchList,dept,range" @eventFromChild="eventFromChild"></clientSearch>
          <clientListData :clientList="clientList,count,person,x_form,name" @client="client"></clientListData>
        </el-tab-pane>

        <el-tab-pane label="我可查看的客户" name="3">
          <clientSearch :searchList="searchList,dept,range" @eventFromChild="eventFromChild"></clientSearch>
          <clientListData :clientList="clientList,count,person,x_form,name" @client="client"></clientListData>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import clientListData from '../.././components/s_customer/clientListData';
  import clientSearch from '../.././components/s_customer/clientSearch';
  // import clientSearch2 from '../.././components/s_customer/clientSearch2';

  export default {
    name:'clientList',
    components: {
      clientListData,
      clientSearch
      // clientSearch2
    },
    data () {
      return {
        activeName:'1',
        searchList:{},
        dept:[],    //部门
        person:[],	//人员
        clientList: [], //客户列表
        count: 0,
        new_time:(this.$route.params.time ? this.$route.params.time : ""),
        x_form:{
          range:'1',
          // time_range : this.$router.params.time
        },
        range:'1',
        searchData:{},
        name:'',
      }
    },
    methods: {
      //查询所需的条件
      filterConditions () {
        this.$get( 'client/index_show')
          .then((data) => {
            if(data.code) {
              this.searchList = data.content;
              this.dept = data.content.department;
              this.person = data.content.person;
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      //客户列表
      eventFromChild (data) {
        this.searchData = data;
        this.searchData.range = this.range;
        this.$get( 'client/list',this.searchData)
          .then( (data) => {
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
        this.$get( 'client/list',this.searchData)
          .then((data) => {
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
      // if(this.searchData) {
      //   this.handleClick({name:this.range},this.searchData);
      // }else {
      //   this.handleClick({name:'1'})
      // }
    },
  }
</script>
<style>

</style>
