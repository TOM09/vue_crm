<template>
  <div class="orderSearch">
    <el-collapse accordion>
      <el-collapse-item class='clickTitle'>
        <template slot="title" >
          点击展开搜索列表<i class="header-icon el-icon-information"></i>
        </template>
        <el-form ref="ruleform" :model="ruleform" label-position="right" label-width='100px'>
          <el-form-item prop="orderName" label="订单名称/编号" class="s_order_item">
            <el-input v-model="ruleform.orderName" autosize placeholder="请输入内容" class="s_order_search"></el-input>
          </el-form-item>
          <el-form-item prop="orderName" label="来源编号" class="s_order_item">
            <el-input v-model="ruleform.third_order_code" autosize placeholder="请输入第三方来源编号" class="s_order_search"></el-input>
          </el-form-item>
          <el-form-item prop="trench" label="渠道" class="s_order_item">
            <el-cascader
                class="s_order_search"
                clearable
                filterable
                change-on-select
                expand-trigger="hover"
                :show-all-levels="false"
                :options="trench"
                v-model="ruleform.trench">
            </el-cascader>
          </el-form-item>
          <el-form-item prop="client" label="客户名称" class="s_order_item">
            <el-input v-model="ruleform.client" autosize placeholder="请输入内容" class="s_order_search"></el-input>
          </el-form-item>
          <el-form-item prop="pro" filterable label="产品" class="s_order_item">
            <el-cascader
                class="s_order_search"
                expand-trigger="hover"
                :options="orderData.product"
                :show-all-levels="false"
                v-model="ruleform.pro"
                @change="handleChange"
                filterable
                clearable
            >
            </el-cascader>
          </el-form-item>
          <el-form-item prop="task_type" label="状态" class="s_order_item">
            <el-cascader 
              expand-trigger="hover"
              change-on-select
              filterable 
              clearable
              class="s_order_search"
              :options="searchList"
              v-model="ruleform.task_type" 
              >
              <!-- @change="handleChange" -->
            </el-cascader>

          </el-form-item>
          <el-form-item  label="公司" class="s_order_item">
            <el-select v-model="profile" @change="handleCompany" placeholder="请选择" filterable clearable>
              <el-option
                  v-for="item in company_info"
                  :key="item.company_id"
                  :label="item.name"
                  :value="item.company_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="dept" label="部门" class="s_order_item">
            <el-cascader
                class="s_order_search"
                change-on-select
                expand-trigger="click"
                filterable
                clearable
                :options="dept"
                v-model="ruleform.dept"
                @change="departmentChange"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item prop="salesman" label="人员" class="s_order_item" >
            <el-select v-model="ruleform.salesman" placeholder="请选择" class="s_order_search" filterable clearable>
              <el-option
                  v-for="(item, index) in person"
                  :key="index"
                  :label="item.nickname"
                  :value="item.dd_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="partner" label="共同负责人" class="s_order_item" >
            <el-select v-model="ruleform.partner" placeholder="请选择" class="s_order_search"  filterable clearable>
              <el-option
                  v-for="(item, index) in commonPerson"
                  :key="index"
                  :label="item.nickname"
                  :value="item.dd_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="success_time" label="成单日期" class="s_order_item">
            <el-date-picker
                v-model="ruleform.success_time"
                style="overflow: hidden;"
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

          <el-form-item prop="create_time" label="创建日期" class="s_order_item">
            <el-date-picker
                v-model="ruleform.create_time"
                unlink-panels
                type="daterange"
                style="overflow: hidden;"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy - MM - dd"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>

          <div class="orderSearch_btn">
            <el-button type="primary" @click="Inquire_client()">查询</el-button>
            <el-button @click="resetForm('ruleform')">重置</el-button>
            <el-button @click="orderExport">导出</el-button>
          </div>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
  import cookies from 'js-cookie';
  import Util from '@/libs/util';
  export default {
    name: 'orderSearch',
    // props: ['orderData','range','searchList'],
    props: {
      'orderData':{
         type: Object, //必须是数字类型的
         default: 1    //如果未定义，默认值就是1
     },
     'range':{
         type: String, //必须是数字类型的
         default: 1    //如果未定义，默认值就是1
     },
     'searchList':{
         type: Array, //必须是数字类型的
         default: 1    //如果未定义，默认值就是1
     }
    },


    data() {
      return {
        searchListData:[],
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
        Authorization: cookies.get('access_token'),
        ruleform: {
          dept:[],
          orderName: '',
          third_order_code:'',
          trench: [],
          client: '',
          salesman: '',
          // product_id: '',
          partner: '',
          success_time:[], //承担日期
          create_time:[], //创建日期
          // stage:[],
          pro: [],
          range: (this.range ? this.range : ''),
          task_type:[]
        },
        company: {
          company_id: '',
          dept: ''
        },
        profile: JSON.parse(cookies.get('company_id'))
      }
    },
    computed:{
      trench() {
        return Util.obj2Arr(this.orderData.trench)
      },
      company_info () {
        return this.$store.state.app.company_info;
      },
      dept () {
        return this.$store.state.app.dept;
      },
      person () {
        return this.$store.state.app.person;
      },
      commonPerson () {
        return this.$store.state.app.commonPerson;
      }
    },
    methods: {
      handleCompany (val) {
        this.company.company_id = val;
        this.$store.dispatch('dept', this.company);
      },
      orderExport () {
        let strArgs = Util.makeUrl(this.ruleform);
        window.open(`${process.env.BASE_API}/export/orderList?Authorization=${this.Authorization}${strArgs}`)
      },
      //选择部门更新人员
      departmentChange(val){
        this.ruleform.dept = val;
        this.company.dept = val;
        this.$store.dispatch('dept', this.company);
      },
      //重新获取人员
      // personChange(){
      //   if(this.ruleform.dept.length > 0){
      //     this.orderPerson();
      //   }
      // },
      // orderPerson(){
      //   this.$get('getDeptPersonList',{dept:this.ruleform.dept})
      //     .then( (data) => {
      //       this.orderData.salesman = data;
      //     })
      //     .catch(() => {
      //       this.$message.error('服务器错误，请稍后重试')
      //     })
      // },
      handleChange(value) {
        this.ruleform.product_id = value[value.length-1];
      },
      Inquire_client() {
        this.$emit("searchNew",this.ruleform);
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
    created() {
      // this.$store.dispatch('dept',{});
      if (!this.orderData.product) {
        this.orderData.product = [];
      }
      if(!this.orderData.trench) {
        this.orderData.trench = [];
      }
    },
   
    activated () {
      this.$store.dispatch('dept',{});
    }
  }
</script>

<style lang="less" type='scoped'>
  .orderSearch {
    .s_order_search{
      width: 220px;
      height: 50px;
    }
    .s_order_item {
      float: left;
      /*margin-left: 10px;*/
    }
    .orderSearch_btn {
      width: 300px;
      float: left;
      margin-left: 70%;
      margin-bottom: 20px;
    }
    .el-range-input {
      margin-left: 5px;
    }
    .el-collapse-item__header{
      text-align: center;
    }
    .clickTitle .el-collapse-item__header{
      display: block!important;
    }
  }
</style>
