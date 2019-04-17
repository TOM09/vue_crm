<template>
  <div class="workNewSearch">
    <el-collapse accordion>
      <el-collapse-item>
        <template slot="title" class="workSearchButton">
          点击展开搜索列表<i class="header-icon el-icon-information"></i>
        </template>
        <el-form ref="searchForm" :model="searchForm"  label-width='80px'>
          <el-form-item prop="manage_number" label="工单编号:" class="s_client_item">
            <el-input v-model="searchForm.manage_number" clearable autosize placeholder="请输入内容" class="s_client_sel_div"></el-input>
          </el-form-item>
          <el-form-item prop="order_code" label="订单编号:" class="s_client_item">
            <el-input v-model="searchForm.order_code" clearable autosize placeholder="请输入订单或者售前项目的单号查询" class="s_client_sel_div"></el-input>
          </el-form-item>
          <el-form-item prop="third_order_code" label="来源编号:" class="s_client_item">
            <el-input v-model="searchForm.third_order_code" clearable autosize placeholder="请输入八戒、钉钉等外部订单编号" class="s_client_sel_div"></el-input>
          </el-form-item>

          <el-form-item prop="person" label="申请人:" class="s_client_item">
            <el-select v-model="searchForm.person" clearable filterable placeholder="请选择" class="s_client_sel_div">
              <el-option
                  v-for="item in persons"
                  :key="item.index"
                  :label="item.nickname"
                  :value="item.dd_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ae" label="客服人员:" class="s_client_item">
            <el-select v-model="searchForm.ae" clearable filterable placeholder="请选择" class="s_client_sel_div">
              <el-option
                  v-for="item in searchList.ae"
                  :key="item.index"
                  :label="item.nickname"
                  :value="item.dd_id">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item prop="task_type" label="工单类型:" class="s_client_item">
            <el-select v-model="searchForm.task_type" filterable clearable placeholder="请选择" class="s_client_sel_div">
              <el-option
                  v-for="item in searchList.task_type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item  prop="task_type" label="工单类型:" class="s_client_item">
            <el-cascader 
            class="s_client_sel_div"
              expand-trigger="hover"
              change-on-select
              filterable 
              clearable
              :options="searchList.step"
              v-model="searchForm.task_type" 
              >
            </el-cascader>
          </el-form-item>
            <!-- :show-all-levels="false" :options="searchListStep" searchList.step-->
          <el-form-item prop="client" label="客户名称:" class="s_client_item">
            <el-input v-model="searchForm.client" clearable autosize placeholder="请输入客户名" class="s_client_sel_div"></el-input>
          </el-form-item>

          <el-form-item prop="executor" label="执行人员:" class="s_client_item">
            <el-select v-model="searchForm.executor" filterable clearable placeholder="请选择" class="s_client_sel_div">
              <el-option
                  v-for="item in persons"
                  :key="item.dd_id"
                  :label="item.nickname"
                  :value="item.dd_id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="productList" label="产品信息:" class="s_client_item">
                <!-- change-on-select -->
            <el-cascader
                class="s_client_sel_div"
                filterable
                expand-trigger="hover"
                clearable
                :options="searchList.product"
                :show-all-levels="false"
                v-model="searchForm.productList"
                @change="handleChange">
            </el-cascader>
          </el-form-item>

           <!-- <el-form-item prop="step" label="状态:" class="s_client_item">
            <el-select v-model="searchForm.step" clearable filterable placeholder="请选择" class="s_client_sel_div">
              <el-option
                  v-for="item in searchList.step"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item prop="service" label="服务商:" class="s_client_item">
            <el-input v-model="searchForm.service" clearable autosize placeholder="请输入" class="s_client_sel_div"></el-input>
          </el-form-item>
          <el-form-item prop="time" label="申请日期:" class="s_client_item">
            <el-date-picker
                class="s_client_sel_div_n s_client_sel_div_n2"
                v-model="searchForm.time"
                unlink-panels
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy - MM - dd"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>

          <el-form-item prop="end_time" label="完成日期:" class="s_client_item">
            <el-date-picker
                class="s_client_sel_div_n s_client_sel_div_n2"
                v-model="searchForm.end_time"
                unlink-panels
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy - MM - dd"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <div class="s_client_btn">
            <el-button type="primary" @click="Inquire_client(searchForm)">查询</el-button>
            <el-button @click="resetForm('searchForm')">重置</el-button>
            <el-button v-if='searchForm.type == 2' @click="exportWorkInfo">导出</el-button>
          </div>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
    import Util from '@/libs/util';
    import cookies from 'js-cookie';

  export default {
    name: 'workList',
    props:
    {
      searchList:{
        type: Object
      },
      page:{
        type: Number
      }
    },
    data () {
      return {
        searchListStep:[],
        // person: [],
        rangeNum:this.page,
        searchForm: {
          ae: '',
          // step: '',
          client: '',
          product: '',
          person: '',
          task_type: [],
          executor: '',
          manage_number: '',
          time: [],
          productList: [],
          third_order_code:'',
          end_time:'',
          type:1,
          order_code:'',
          service:'',
          range:'pending'
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        Authorization: cookies.get('access_token')
      }
    },
    methods: {
      exportWorkInfo () {
        // this.searchForm.type = ''
        for (let index in this.searchForm) {
          // this.searchForm.type = 2 && 
            if (this.searchForm[index] && this.searchForm[index].length !== 0) {
                let strArgs = Util.makeUrl(this.searchForm);
                window.open(`${process.env.BASE_API}/report/exportManage?Authorization=${this.Authorization}${strArgs}`)
                return false;
            }
        }
        this.$message({
            message: '请输入查询条件后方可导出',
            type: 'warning'
        });
    },
      handleChange() {
        this.searchForm.product = this.searchForm.productList[1];
        // this.searchForm.step = this.searchForm.task_type[1];
      },
      resetForm (formName) {
        this.searchForm.product = '';
        this.$refs[formName].resetFields();
      },
      // 工单列表查询函数
      Inquire_client (searchForm) {
        if(this.page == 0){
          this.searchForm.range='pending'
          this.$emit("searchNewList",searchForm);
        } else if(this.page == 1) {
          this.searchForm.range='all'
          this.$emit("searchNewListAll",searchForm);
        } else if(this.page == 2) {
          this.searchForm.range='mine'
          this.$emit("searchNewMyList",searchForm);
        }
      },
    },
    computed: {
      rangeNumData(){
        return this.rangeNum;
      },
      persons () {
        return this.$store.state.app.commonPerson;
      }
    },
    watch:{
      page(newV,oldV){
        if(newV == 0){
          this.searchForm.range = 'pending';
        }else if(newV == 1){
          this.searchForm.range = 'all';
        }else if(newV == 2){
          this.searchForm.range = 'mine';
        }
        this.rangeNum = newV
      }
    },
    created () {
      // this.remoteMethod()
      var htmlHref = window.location.href;
			htmlHref = htmlHref.replace(/^http:\/\/[^/]+/, "");
			var addr = htmlHref.substr(htmlHref.lastIndexOf('/', htmlHref.lastIndexOf('/') - 1) + 1);
      var index = addr.lastIndexOf("\/");
      var addrLast = decodeURI(addr.substring(index + 1, addr.length));
      if(addrLast == 'PresaleWorkOrderList'){
        this.searchForm.type = 1;
      }else{
        this.searchForm.type = 2;
      }
    }
  }
</script>

<style lang="less"  type='scoped'>
  .workNewSearch{
    .workNewList {
      text-align: center;
      margin-top: 10px;
    }
    .clientNew{
      text-align: center
    }
    .s_client_list{
      width: 100%;
      background: #fff;
    }
    .s_client_sel_div{
      float: left;
      width: 270px;
      height: 50px;
    }
    .s_client_sel_div_n{
      width: 300px;
    }
     .s_client_sel_div_n2{
      width: 271px!important;
    }
    .s_client_btn{
      width: 250px;
      float: left;
      margin-top: 30px;
      margin-left: 75%;
      padding-bottom: 20px;
    }
    .s_client_item{
      float: left;
      width: 400px;
      margin-left: 30px;
    }
    .el-collapse-item__header{
      text-align: center;
    }
    .el-collapse-item__header{
      display: block!important;
    }
  }
</style>
