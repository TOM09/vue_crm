<template>
  <div class="consult-follow-up">
    <el-card>
      <el-form :model="form" ref="form" label-position="right" label-width='100px'>
        <el-form-item prop="consult_code" label="咨询编号：" class="WHSInput">
          <el-input clearable v-model="form.consult_code" placeholder="请输入咨询编号">
          </el-input>
        </el-form-item>
        <el-form-item prop="company" label="客户名称：" class="WHSInput" >
          <el-input clearable v-model="form.company" placeholder="请输入客户名称">
          </el-input>
        </el-form-item>
        <el-form-item label="客户来源" prop="customer_source" class="WHSInput">
          <el-cascader
              clearable
              filterable
              change-on-select
              expand-trigger="hover"
              :show-all-levels="false"
              :options="trench"
              v-model="form.customer_source">
          </el-cascader>
        </el-form-item>
        <el-form-item prop="person_id" label="咨询负责人：" class="WHSInput" >
          <el-select v-model="form.person_id" placeholder="请选择"  filterable clearable>
            <el-option
                v-for="item in person"
                :key="item.dd_id"
                :label="item.nickname"
                :value="item.dd_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="sale_id" label="销售负责人：" class="WHSInput" >
          <el-select v-model="form.sale_id" placeholder="请选择"  filterable clearable>
            <el-option
                v-for="item in person"
                :key="item.dd_id"
                :label="item.nickname"
                :value="item.dd_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status" label="咨询状态：" class="WHSInput" >
          <el-select v-model="form.status" placeholder="请选择"  filterable clearable>
            <el-option
                v-for="item in allStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="is_leave" label="由留言转化：" class="WHSInput" >
          <el-select v-model="form.is_leave" placeholder="请选择"  filterable clearable>
            <el-option
                v-for="item in leave"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="is_project" label="是否立项：" class="WHSInput" >
          <el-select v-model="form.is_project" placeholder="请选择"  filterable clearable>
            <el-option
                v-for="item in leave"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="pro_dd_id" label="项目负责人：" class="WHSInput" >
          <el-select v-model="form.pro_dd_id" placeholder="请选择"  filterable clearable>
            <el-option
                v-for="item in person"
                :key="item.dd_id"
                :label="item.nickname"
                :value="item.dd_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="stage" label="项目状态：" class="WHSInput" >
          <el-select v-model="form.stage" placeholder="请选择"  filterable clearable>
            <el-option
                v-for="item in stage"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="is_order" label="是否成单：" class="WHSInput" >
          <el-select v-model="form.is_order" placeholder="请选择"  filterable clearable>
            <el-option
                v-for="item in leave"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="ask_time" label="咨询日期：" class="WHSInput">
          <el-date-picker
              v-model="form.ask_time"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="pro_create_time" label="创建项目日期" class="WHSInput">
          <el-date-picker
              v-model="form.pro_create_time"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="reason_time" label="流单日期：" class="WHSInput">
          <el-date-picker
              v-model="form.reason_time"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="WHSBtn">
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
          <el-button @click="exportWorkInfo">导出</el-button>
        </el-form-item>
      </el-form>
      <div style="clear:both"></div>
    </el-card>
    <el-card style="margin-top:10px;">
      <el-table :data="list" width="100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table :data="scope.row.order" width="90%">
              <el-table-column prop="order_code" label="订单编号">
              </el-table-column>
              <el-table-column prop="name" label="订单名称">
              </el-table-column>
              <el-table-column prop="nickname" label="销售">
              </el-table-column>
              <el-table-column prop="product_name" label="产品">
              </el-table-column>
              <el-table-column prop="price" label="订单金额（元）">
              </el-table-column>
              <el-table-column prop="order_transfer_price" label="已回款金额（元）">
              </el-table-column>
              <el-table-column prop="approve_status" label="订单状态">
              </el-table-column>
              <el-table-column prop="status" label="执行状态">
              </el-table-column>
              <el-table-column prop="success_time" label="成单时间">
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="咨询编号">
        </el-table-column>
        <el-table-column prop="ask_time" label="咨询日期">
        </el-table-column>
        <el-table-column prop="company" label="客户名称">
        </el-table-column>
        <el-table-column prop="trench" label="客户来源">
        </el-table-column>
        <el-table-column prop="dd_id" label="咨询负责人">
        </el-table-column>
        <el-table-column prop="sale_man" label="销售负责人">
        </el-table-column>
        <el-table-column prop="sale_department" label="所属部门">
        </el-table-column>
        <el-table-column prop="status" label="咨询状态">
        </el-table-column>
        <el-table-column prop="word_code" label="留言编号">
        </el-table-column>
        <el-table-column prop="pro_code" label="项目编号">
        </el-table-column>
        <el-table-column prop="future_price" label="项目预算">
        </el-table-column>
        <el-table-column prop="pro_dd_id" label="项目负责人">
        </el-table-column>
        <el-table-column prop="stage" label="项目状态">
        </el-table-column>
        <el-table-column prop="follow_time" label="立项日期">
        </el-table-column>
        <el-table-column prop="order_num" label="订单数量">
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="form.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="form.perPage"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count" style="text-align:center;margin-top:10px;">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  import cookies from 'js-cookie'
  import Util from '@/libs/util'
  export default {
    name: "consultFollow",
    data () {
      return {
        Authorization: cookies.get('access_token'),
        list:[],
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
        stage:[{
          id:0,
          name:'初步洽谈'
        },{
          id:1,
          name:'二次回访'
        },{
          id:2,
          name:'需求确定'
        },{
          id:3,
          name:'售前跟进'
        },{
          id:4,
          name:'提案报价'
        },{
          id:5,
          name:'签单准备'
        },{
          id:6,
          name:'签约'
        },{
          id:7,
          name:'回款'
        },{
          id:8,
          name:'结单'
        },{
          id:9,
          name:'流单'
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
        leave:[{
          value:1,
          label:'是'
        },{
          value:0,
          label:'否'
        }],
        count:0,
        form:{
          consult_code:'',
          company:'',
          customer_source:[],
          person_id:'',
          sale_id:'',
          status:'',
          is_leave:'',
          is_project:'',
          pro_dd_id:'',
          stage:'',
          is_order:'',
          ask_time:[],
          pro_create_time:[],
          reason_time:[],
          perPage:10,
          page:1,
        },
        trench:[],
      }
    },
    computed: {
      person:{
         get: function(){
            return this.$store.state.app.commonPerson;
          },
        set: function(){
        }
      }
    },
    methods: {
      handleSizeChange (val) {
        this.form.perPage = val;
        this.followList();
      },
      handleCurrentChange (val) {
        this.form.page = val;
        this.followList();
      },
      onSubmit () {
        this.form.perPage = 10;
        this.form.page = 1;
        this.$get( 'report/consultData',this.form)
          .then( (data) => {
            this.list = data.content.detail;
            this.count = data.content.count;
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields();
        this.followList();
      },
      exportWorkInfo () {
        let strArgs = Util.makeUrl(this.form);
        window.open(`${process.env.BASE_API}/report/exportSaleConsult?Authorization=${this.Authorization}${strArgs}`);
      },
      clientShows() {
        let index_show = JSON.parse(localStorage.consultSearch);
        this.trench = Util.obj2Arr(index_show.trench);
        this.person = index_show.person;
      },
      followList(){
        this.$get( 'report/consultData',this.form)
          .then( (data) => {
            this.list = data.content.detail;
            this.count = data.content.count;
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      }
    },
    created () {
      this.clientShows();
      this.followList();
    }
  }
</script>

<style lang="less">
  .consult-follow-up{
    .WHSInput {
      float: left;
      height: 50px;
    }
    .WHSBtn {
      width: 350px;
      float: right;
      max-height: 10%;
    }
  }
</style>