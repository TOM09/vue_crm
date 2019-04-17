<template>
  <div class="inquirySearch">
  <el-collapse accordion @change="clickCollapse">
    <el-collapse-item>
      <template slot="title">
        {{search_str}}<i class="header-icon el-icon-information"></i>
      </template>
      <el-form ref="ruleform" :model="ruleform" label-position="right" label-width='100px'>
        <el-form-item prop="sn_no"  label="订单编号" class="s_order_item">
          <el-input v-model="ruleform.sn_no" clearable placeholder="请输入" class="s_order_search"></el-input>
        </el-form-item>
          <el-form-item prop="dis_dd_id" label="提成人员" class="s_order_item">
          <el-select v-model="ruleform.dis_dd_id" clearable filterable placeholder="请选择" class="s_order_search">
            <el-option
              v-for="item in person"
              :key="item.dd_id"
              :label="item.nickname"
              :value="item.dd_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="department" label="提成部门" class="s_order_item">
           <el-cascader
            change-on-select
            :options="departmentdata"
            expand-trigger="hover"
            v-model="ruleform.department"
             placeholder="请选择" 
             class="s_order_search"
             clearable
            >
            <!-- @change="handleChange" -->
          </el-cascader>
        </el-form-item>
        <el-form-item prop="create_time" label="创建日期" class="s_order_item">
          <el-date-picker
            v-model="ruleform.create_time"
            style="overflow: hidden;"
            unlink-panels
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy - MM - dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="create_dd_id" label="创建人" class="s_order_item">
          <el-select v-model="ruleform.create_dd_id" clearable filterable placeholder="请选择" class="s_order_search">
            <el-option
              v-for="item in person"
              :key="item.dd_id"
              :label="item.nickname"
              :value="item.dd_id">
            </el-option>
          </el-select>
        <div style="clear:both"></div>
        </el-form-item>

         <el-form-item prop="create_time" label="收支时间" class="s_order_item">
          <el-date-picker
            v-model="ruleform.budget_time"
            style="overflow: hidden;"
            unlink-panels
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy - MM - dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <div class="orderSearch_btn">
            <el-button type="primary" @click="inquiry_query('ruleform')">查询</el-button>
            <el-button @click="resetForm('ruleform')">重置</el-button>
            <el-button @click="inquiryExport()">导出</el-button>
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
    name: 'inquirySearch',
    props:{
      range:{
        type:String
      },
      auth:{
        type:Number
      }
    },
    data() {
      return {
        trench:[],
        product:[],
        end_reason:[],
        client_Intent:[],
        // person: [], //存到本地的所有人员
        index_show:{},
        isItValid:[{
            value: '1',
            label: '是'
        }, {
            value: '2',
            label: '否'
        }],
        allStatus:[{
          value:1,
          label:'已结束'
        },{
          value:2,
          label:'待客服跟进'
        },{
          value:3,
          label:'待销售主管分单'
        },{
          value:4,
          label:'待销售跟进'
        },{
          value:5,
          label:'已退回'
        }],
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
        search_str:"点击展开搜索列表",
        statusShow: false,
        methodsr:[], //咨询方式
        options: [{
          cost_type: 1,
          label: 'IM'
          },{
          cost_type: 2,
          label: 'QQ'
          },{
          cost_type: 3,
          label: '电话'
          },{
          cost_type: 4,
          label: '派单'
        }],
        line: [{
          cost_type: 5,
          label: '自拓'
          },{
          cost_type: 6,
          label: '投标扫单'
        }],
        linen:[{
          cost_type: 7,
          label: '留言'
          },{
          cost_type: 8,
          label: 'QQ'
          },{
          cost_type: 9,
          label: '电话'
          },{
          cost_type: 10,
          label: '商桥'
        }],
        ruleform: {
          perPage:10,
          page: 1,
          sn_no:'',
          dis_dd_id: '',
          create_time: [],
          create_dd_id:'',
          department:[],
          budget_time:[]
        },
        departmentdata:[]
      }
    },
    computed: {
      person () {
        return this.$store.state.app.commonPerson;
      }
    },
    methods: {
      clickCollapse (activeNames) {
          if(this.ruleform.range == 'all') {
            this.statusShow = true;
          }
          if(activeNames){
              this.search_str = "点击关闭搜索列表";
          }else{
              this.search_str = "点击展开搜索列表";
          }
      },
      //咨询来源函数
      changeSource (val){
        if(val[0] === 1) {
          this.methodsr = this.options
        }else if(val[0] === 4) {
          this.methodsr = this.line
        }else if(val[0] === 5) {
          this.methodsr = this.linen
        }else {
          this.methodsr = []
        }
      },
      inquiryExport () {
        for(let key in this.ruleform) {
          if(key !== 'range' && key !== 'auth') {
            if(this.ruleform[key] && this.ruleform[key].length !== 0) {
              let strArgs = Util.makeUrl(this.ruleform);
              window.open(`${process.env.BASE_API}/report/exportRoyaltyList?Authorization=${this.Authorization}${strArgs}`)
              return false;
            }
          }
        }
        this.$message({
          message: '请输入查询条件后方可导出',
          type: 'warning'
        });
      },
      inquiry_query() {
        this.$emit("searchNew",this.ruleform);
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      inquiryInit() {
        this.index_show = JSON.parse(localStorage.consultSearch);
        this.product = this.index_show.product;
        this.trench = Util.obj2Arr(this.index_show.trench);
        for(let index in this.index_show.client_Intent) {
            this.client_Intent.push(this.index_show.client_Intent[index]);
        }
        // this.person = JSON.parse(localStorage.person);
      },
    },
    watch:{
      range (val) {
        this.ruleform.range = val
      },
      auth (val) {
        this.ruleform.auth = val
      }
    },
    created() {
      this.inquiryInit();
      this.$get( 'system/companyDeptInfo')
          .then((data) => {
            if(data.code) {
              let dept = data.content.dept;
              let dataT = [];
              for(let i in dept) {
                for(let j = 0; j < dept[i].length; j++) {
                  dataT.push(dept[i][j]);
                }
              }
              this.departmentdata = dataT[0].children;
            }
          })
          .catch((data) => {
            this.$message.error('服务器错误，请稍后重试');
          })
    }
  }
</script>
<style lang="less" scoped>
.inquirySearch {
    .s_order_search{
      width: 220px;
      height: 50px;
    }
    .s_order_item {
      float: none;
      display: inline-block;
      // float: left;
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
    .el-collapse-item__header{
      display: block;
    }
}
</style>
