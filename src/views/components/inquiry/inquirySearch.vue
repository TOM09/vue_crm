<template>
  <div class="inquirySearch">
  <el-collapse accordion @change="clickCollapse">
    <el-collapse-item>
      <template slot="title">
        {{search_str}}<i class="header-icon el-icon-information"></i>
      </template>
      <el-form ref="ruleform" :model="ruleform" label-position="right" label-width='100px'>
        <el-form-item prop="code"  label="咨询编号" class="s_order_item">
          <el-input v-model="ruleform.code" clearable placeholder="请输入" class="s_order_search"></el-input>
        </el-form-item>
        <el-form-item prop="phone"  label="客户手机号" class="s_order_item">
          <el-input v-model="ruleform.phone" clearable placeholder="请输入" class="s_order_search"></el-input>
        </el-form-item>
        <el-form-item prop="pro_id" label="咨询类目" class="s_order_item">
          <el-cascader
            class="s_order_search"
            expand-trigger="click"
            :options="product"
            v-model="ruleform.pro_id"
            change-on-select
            clearable>
          </el-cascader>
        </el-form-item>
        <el-form-item prop="client_Intent" label="客户意向度" class="s_order_item">
          <el-select v-model="ruleform.client_Intent" clearable filterable placeholder="请选择" class="s_order_search">
            <el-option
              v-for="item in client_Intent"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="trench" label="来源" class="s_order_item">
          <el-cascader
            class="s_order_search"
            clearable
            filterable
            change-on-select
            expand-trigger="hover"
            :show-all-levels="false"
            :options="trench"
            @change="changeSource"
            v-model="ruleform.trench">
          </el-cascader>
        </el-form-item>
        <el-form-item  label="咨询方式" prop="ask_method" class="s_order_item">
          <el-select v-model="ruleform.ask_method" clearable filterable placeholder="请选择" class="s_order_search">
            <el-option
              v-for="item in methodsr"
              :key="item.cost_type"
              :label="item.label"
              :value="item.cost_type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="is_valid" label="是否有效" class="s_order_item">
          <el-select v-model="ruleform.is_valid" clearable filterable placeholder="请选择" class="s_order_search">
            <el-option
              v-for="item in isItValid"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="is_follow" label="是否可跟进" class="s_order_item">
          <el-select v-model="ruleform.is_follow" clearable filterable placeholder="请选择" class="s_order_search">
            <el-option
              v-for="item in isItValid"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="person_id" label="负责人" class="s_order_item">
          <el-select v-model="ruleform.person_id" clearable filterable placeholder="请选择" class="s_order_search">
            <el-option
              v-for="item in person"
              :key="item.dd_id"
              :label="item.nickname"
              :value="item.dd_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="sale_manager_id" label="销售主管" class="s_order_item">
          <el-select v-model="ruleform.sale_manager_id" clearable filterable placeholder="请选择" class="s_order_search">
            <el-option
              v-for="item in person"
              :key="item.dd_id"
              :label="item.nickname"
              :value="item.dd_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="sale_id" label="销售负责人" class="s_order_item">
          <el-select v-model="ruleform.sale_id" clearable filterable placeholder="请选择" class="s_order_search">
            <el-option
              v-for="item in person"
              :key="item.dd_id"
              :label="item.nickname"
              :value="item.dd_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status" v-if="statusShow" label="咨询状态" class="s_order_item">
          <el-select v-model="ruleform.status" clearable filterable placeholder="请选择" class="s_order_search">
            <el-option
              v-for="item in allStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="ask_time" label="咨询日期" class="s_order_item">
          <el-date-picker
            v-model="ruleform.ask_time"
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
        <div class="orderSearch_btn">
            <el-button type="primary" @click="inquiry_query()">查询</el-button>
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
          phone:'',
          code: '',
          pro_id:[],
          client_Intent: '',
          ask_method: '',
          trench:[],
          is_valid:'',
          is_follow:'',
          ask_time: [],
          status:'',
          sale_id:'',
          sale_manager_id:'',
          person_id:'',
          range:'wait',
          auth:'',
        },
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
              window.open(`${process.env.BASE_API}/report/exportConsult?Authorization=${this.Authorization}${strArgs}`)
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
    }
  }
</script>
<style lang="less" type='scoped'>
.inquirySearch {
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
    .el-collapse-item__header{
      display: block;
    }
}
</style>
