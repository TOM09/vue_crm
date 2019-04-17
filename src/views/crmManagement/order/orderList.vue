<template>
    <div class="orderList">
        <el-card>
        <el-tabs @tab-click="handleClick" v-model="range">
            <el-tab-pane label="全部订单" name="all">
                    <orderSearch  :searchList='searchList' :orderData="orderData,range" @searchNew="searchNew"></orderSearch>
                    <orderListData :orderData="orderData,orderList,count,x_form,name" @x_list="x_list"></orderListData>
            </el-tab-pane>
            <el-tab-pane label="我的订单" name="mine">
                    <orderSearch :searchList='searchList' :orderData="orderData,range" @searchNew="searchNew"></orderSearch>
                    <orderListData :orderData="orderData,orderList,count,x_form,name" @x_list="x_list"></orderListData>
            </el-tab-pane>
            <el-tab-pane label="审批中订单" name="view">
                    <orderSearch :searchList='searchList' :orderData="orderData,range" @searchNew="searchNew"></orderSearch>
                    <orderListData :orderData="orderData,orderList,count,x_form,name" @x_list="x_list"></orderListData>
            </el-tab-pane>
            <el-tab-pane label="待提交订单"  name="part_in">
                    <orderSearch :searchList='searchList' :orderData="orderData,range" @searchNew="searchNew"></orderSearch>
                    <orderListData :orderData="orderData,orderList,count,x_form,name" @x_list="x_list"></orderListData>
            </el-tab-pane>
            <el-tab-pane label="待我审批订单"  name="my_approve">
                <orderSearch :searchList='searchList' :orderData="orderData,range" @searchNew="searchNew"></orderSearch>
                <orderListData :orderData="orderData,orderList,count,x_form,name" @x_list="x_list"></orderListData>
            </el-tab-pane>
        </el-tabs>
    </el-card>
    </div>
</template>

<script>
    import orderSearch from '../.././components/s_order/orderSearch'
    import orderListData from '../.././components/s_order/orderListData'
    export default {

        components: { orderSearch, orderListData },

        data() {
            return {
                orderData:{

                },
                searchList:[],
                orderNewList: {},
                orderList:[],
                dept:[],
                count: 0,
                pageSize: 0,
                current: 0,
                create_time:this.$route.params.time ? this.$route.params.time : "",
                x_form:{
                    perPage:10,
                    currentPage:1,
                },
                name: '',
                range: this.$route.params.range ? this.$route.params.range : 'all',
                searchData:{},
            }
        },
        methods: {
            handleClick(tab) {
                if(this.range) {
                    this.searchData.range = this.range;
                } else {
                    this.range = tab.name;
                    this.searchData.range = tab.name;
                }
                if(this.create_time || this.range ) {
                    if(this.create_time == undefined) {
                        this.create_time = [];
                    } else {
                        this.searchData.create_time = this.create_time;
                    }
                    this.searchData.create_time = this.create_time;
                    this.searchData.range = this.range;
                    this.x_form.create_time = this.create_time;
                    this.x_form.range = this.range;
                }
                this.$get( 'crmManagement/order/index',this.searchData)
                    .then( (data) => {
                        this.orderData = data.content;
                        this.orderList = data.content.orderList;
                        this.dept = data.content.dept;
                        this.count = data.content.count;
                    })
                    .catch(() => {

                    });
                this.name = tab.name;
            },
            searchNew (data) {
                this.searchData = data;
                this.searchData.range = this.name;
                this.$get( 'crmManagement/order/index',this.searchData)
                    .then( (data) => {
                        this.orderList = data.content.orderList;
                        this.count = data.content.count;
                    })
                    .catch( (error) => {

                    });
                this.x_form = data;
            },
            //刷新分页
            x_list(data){
                this.orderList = data[0];
                this.count = data[1];
            },
            // 监听
            getParams(){
                let routerParams = this.$route.params.time;
                this.create_time = routerParams
            },
        },
        watch:{
            '$route':'getParams'
        },
        created(){
            this.getParams();
            if(this.searchData){
                this.handleClick({name:this.range},this.searchData);
            }else{
                this.handleClick({name: "all"});
            }

            
          this.$get( 'manageNew/manageList')
            .then ( (data) => {
              this.searchList = data.content.step;
            })
            .catch (() => {
              this.$message.error('服务器错误，请稍后重试');
            })
        }
    }
</script>

<style lang="less">
  
</style>
