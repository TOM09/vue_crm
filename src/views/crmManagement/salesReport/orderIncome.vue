<template>
  <div class="x_repayments">
    <el-card>
      <el-form :model="form" ref="form" label-position="right" label-width='110px'>
        <el-form-item prop="order_code" label="订单编号：" class="WHSInput">
          <el-input clearable v-model="form.order_code" placeholder="请输入订单编号">
          </el-input>
        </el-form-item>
        <el-form-item  label="公司：" class="WHSInput" >
          <el-select v-model="profile" @change="handleCompany" placeholder="请选择" filterable clearable>
            <el-option
                v-for="item in company_info"
                :key="item.company_id"
                :label="item.name"
                :value="item.company_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="department" label="部门：" class="WHSInput">
          <el-cascader
              change-on-select
              expand-trigger="click"
              filterable
              clearable
              :options="dept"
              v-model="form.department"
              @change="departmentChange">
          </el-cascader>
        </el-form-item>
        <el-form-item prop="person" label="人员：" class="WHSInput" >
          <el-select v-model="form.person" placeholder="请选择" filterable clearable>
            <el-option
                v-for="(item, index) in person"
                :key="index"
                :label="item.nickname"
                :value="item.dd_id">
            </el-option>
          </el-select>
        </el-form-item>


        <!-- <el-form-item prop="person" label="共同负责人：" class="WHSInput" >
          <el-select v-model="form.partner" placeholder="请选择"  filterable clearable>
            <el-option
                v-for="item in commonPerson"
                :key="item.dd_id"
                :label="item.nickname"
                :value="item.dd_id">
            </el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item prop="SourceNumber" label="来源单号：" class="WHSInput">
          <el-input clearable v-model="form.SourceNumber" placeholder="请输入来源单号">

          </el-input>
        </el-form-item>
        <el-form-item prop="client" label="客户：" class="WHSInput">
          <el-input clearable v-model="form.client" placeholder="请输入客户名称">

          </el-input>
        </el-form-item>
        <el-form-item prop="time" label="回款日期：" class="WHSInput">
          <el-date-picker
              v-model="form.paybackTime"
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
        <el-form-item prop="time" label="支出日期：" class="WHSInput">
          <el-date-picker
              v-model="form.costTime"
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
        <el-form-item prop="time" label="成单日期：" class="WHSInput">
          <el-date-picker
              v-model="form.time"
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
      <el-table :data="panymentData" style="width: 100%">
        <el-table-column prop="order_code" label="订单编号" width="150" fixed></el-table-column>
        <el-table-column prop="company" label="客户" width="180" align="center"></el-table-column>
        <el-table-column prop="cli_nickname" label="客户创建人" width="100" align="center"></el-table-column>
        <el-table-column prop="product" label="产品" align="center"></el-table-column>
        <el-table-column prop="trench" label="渠道" align="center"></el-table-column>
        <!-- <el-table-column prop="shop" label="店铺" align="center"></el-table-column> -->
        <el-table-column prop="SourceNumber" label="来源单号" align="center"></el-table-column>
        <el-table-column prop="success_num" label="售前成功数" align="center"></el-table-column>
        <el-table-column prop="success_time" label="成单日期" align="center"></el-table-column>
        <el-table-column prop="nickname" label="业绩人员" align="center"></el-table-column>
        <el-table-column prop="department" label="业绩部门" align="center"></el-table-column>
        <el-table-column prop="kpi_percent" label="业绩占比(%)" align="center"></el-table-column>
        <el-table-column prop="approve_status" label="订单状态" align="center"></el-table-column>
        <!--<el-table-column prop="partner" label="共同负责人" align="center"></el-table-column>-->
        <el-table-column prop="status" label="执行状态" align="center"></el-table-column>
        <el-table-column prop="price" label="订单金额（元）" align="center"></el-table-column>
        <el-table-column label="回款总款" align="center">
          <el-table-column prop="transfer_price" label="总回款（元）" align="center" :formatter="formatFee"></el-table-column>
          <el-table-column prop="current_price" label="当期回款（元）" align="center" :formatter="formatFee"></el-table-column>
          <el-table-column prop="not_transfer_price" label="未回款（元）" align="center" :formatter="formatFee"></el-table-column>
        </el-table-column>
        <el-table-column label="总支出" align="center">
          <el-table-column prop="other_fees" label="其他费用（元）" align="center" :formatter="formatFee"></el-table-column>
          <el-table-column prop="other_contract" label="三方合同金额（元）" align="center" :formatter="formatFee"></el-table-column>
          <el-table-column prop="third_fees" label="第三方费用（元）" align="center" :formatter="formatFee"></el-table-column>
          <!--<el-table-column prop="third_estimate_fees" label="第三方预估费用（元）" align="center"></el-table-column>-->
        </el-table-column>
        <el-table-column label="当期支出" align="center">
          <el-table-column prop="current_other_fees" label="其他费用（元）" align="center" :formatter="formatFee"></el-table-column>
          <el-table-column prop="current_third_fees" label="第三方费用（元）" fixed="right" align="center"  :formatter="formatFee"></el-table-column>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="form.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="form.pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="count" style="text-align:center;margin-top:10px;">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  import cookies from 'js-cookie';
  import Util from '@/libs/util';
  export default {
    data () {
      return {
        Authorization: cookies.get('access_token'),
        panymentData:[],  // 列表
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
        count:0,
        form:{
          department:[],
          person:'',
          client:'',
          SourceNumber:'',
          order_code:'',
          time:[],
          paybackTime:[],
          costTime:[],
          partner:''
        },
        company: {
          company_id: '',
          dept: ''
        },
        profile: JSON.parse(cookies.get('company_id'))
      }
    },
    computed: {
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
      handleSizeChange (val) {
        this.form.pageSize = val;
        this.onSubmit();
      },
      handleCurrentChange (val) {
        this.form.currentPage = val;
        
        this.$get( 'report/orderStatement',this.form)
          .then( (data) => {
            this.panymentData = data.content.data;
            this.count = data.content.count;
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      onSubmit () {
        this.handleCurrentChange(1)
        this.$get( 'report/orderStatement',this.form)
          .then( (data) => {
            this.panymentData = data.content.data;
            this.count = data.content.count;
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields();
        this.orderPerson();
        this.onSubmit();
      },
      exportWorkInfo () {
        let strArgs = Util.makeUrl(this.form);
        window.open(`${process.env.BASE_API}/report/orderStatementExcel?Authorization=${this.Authorization}${strArgs}`)
      },
      handleCompany (val) {
        this.company.company_id = val;
        this.$store.dispatch('dept', this.company);
      },
      departmentChange(val){
        this.form.department = val;
        this.company.dept = val;
        this.$store.dispatch('dept',this.company);
      },
      formatFee: function(row,column,cellValue) {
        if(cellValue != 0 || cellValue !== null){
          return parseFloat(cellValue).toFixed(2)
        }else{
          return cellValue
        }
      }
    },
    created () {
      this.onSubmit();
      this.$store.dispatch('dept',{});
    }
  }
</script>

<style lang="less">
  .x_repayments{
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
