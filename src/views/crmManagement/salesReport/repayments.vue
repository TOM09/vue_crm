<template>
  <div class="s_repayments">
    <el-card>
      <el-form :model="ruleForm" ref="ruleForm" label-position="left" label-width='85px'>
        <el-form-item  label="公司："  class="WHSInput">
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
            expand-trigger="hover"
            :show-all-levels="false"
            filterable
            clearable
            :options="dept"
            v-model="ruleForm.department"
            @change="departmentChange">
          </el-cascader>
        </el-form-item>
        <el-form-item prop="person" label="人员：" class="WHSInput" >
          <el-select v-model="ruleForm.person" placeholder="请选择" filterable clearable>
            <el-option
                v-for="(item, index) in person"
                :key="index"
                :label="item.nickname"
                :value="item.dd_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="person" label="客服人员：" class="WHSInput" >
          <el-select v-model="ruleForm.custom_service" placeholder="请选择" filterable clearable>
            <el-option
                v-for="item in custom_service"
                :key="item.dd_id"
                :label="item.nickname"
                :value="item.dd_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="type" label="执行状态：" class="WHSInput">
          <!-- <el-select v-model="ruleForm.type" clearable placeholder="请选择">
            <el-option
                v-for="item in type"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select> -->
          <el-cascader 
              expand-trigger="hover"
              change-on-select
              filterable 
              clearable
              class="s_order_search"
              :options="searchList"
              v-model="ruleForm.task_type" 
              >
          </el-cascader>
        </el-form-item>
        <el-form-item prop="client" label="客户：" class="WHSInput">
          <el-input v-model="ruleForm.client" placeholder="请输入客户名称"></el-input>
        </el-form-item>
        <el-form-item prop="order_code" label="订单编号：" class="WHSInput">
          <el-input v-model="ruleForm.order_code" placeholder="请输入订单编号">

          </el-input>
        </el-form-item>
        <el-form-item prop="trench" label="渠道：" class="WHSInput">
          <el-cascader
              change-on-select
              expand-trigger="hover"
              filterable
              clearable
              :options="trench"
              v-model="ruleForm.trench"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item prop="third_code" label="来源单号：" class="WHSInput">
          <el-input v-model="ruleForm.third_code" placeholder="请输入来源单号">
          </el-input>
        </el-form-item>
        <el-form-item prop="time" label="回款日期：" class="WHSInput">
          <el-date-picker
              v-model="ruleForm.time"
              clearable
              type="daterange"
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
              v-model="ruleForm.create_time"
              clearable
              type="daterange"
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
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button @click="exportWorkInfo">导出</el-button>
        </el-form-item>
      </el-form>
      <div style="clear:both"></div>
    </el-card>
    <el-card style="margin-top:10px;">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            订单金额：{{ price }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            计划回款金额： {{ plan_price }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            托管金额： {{ trusteeship }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            实际回款金额： {{ transfer_price }}
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="margin-top:10px;">
      <el-table :data="panymentData" stripe style="width: 100%" ref="tableRef" :summary-method="getSummaries" show-summary>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.payment" stripe style="width: 100%">
              <el-table-column prop="number" label="回款期数"></el-table-column>
              <el-table-column prop="pay_time" label="回款日期"></el-table-column>
              <el-table-column prop="money" label="回款金额"></el-table-column>
              <el-table-column prop="type" label="回款方式"></el-table-column>
              <el-table-column prop="nickname" label="创建人"></el-table-column>
              <el-table-column prop="create_time" label="创建时间"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="order_code" label="订单编号"></el-table-column>
        <el-table-column prop="company" label="客户"></el-table-column>
        <el-table-column prop="product_name" label="产品"></el-table-column>
        <el-table-column prop="trench" label="渠道"></el-table-column>
        <!-- <el-table-column prop="shop" label="店铺"></el-table-column> -->
        <el-table-column prop="third_code" label="来源单号"></el-table-column>
        <el-table-column prop="success_time" label="成单日期"></el-table-column>
        <el-table-column prop="status" label="执行状态"></el-table-column>
        <el-table-column prop="nickname" label="销售人员"></el-table-column>
        <el-table-column prop="department" label="部门"></el-table-column>
        <el-table-column prop="custom_service" label="客服人员"></el-table-column>
        <el-table-column prop="price" label="订单金额（元）"></el-table-column>
        <el-table-column prop="plan_price" label="计划回款（元）"></el-table-column>
        <el-table-column prop="trusteeship " label="托管金额（元）"></el-table-column>
        <el-table-column prop="transfer_price" label="已回款金额（元）"></el-table-column>
        <el-table-column prop="not_transfer_price" label="未回款金额（元）"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="ruleForm.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="ruleForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count" style="text-align:center;margin-top:10px;">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  import Cookies from 'js-cookie';
  import Util from '@/libs/util';

  export default {
    data () {
      return {
        searchList:[],
        Authorization: Cookies.get('access_token'),
        ruleForm: {
          type: '',
          client: '',
          order_code: '',
          third_code: '',
          trench: [],
          time: [Util.formGetTime(new Date().getTime() - 3600 * 1000 * 24 * 30),Util.formGetTime(new Date().getTime())],
          create_time:[],
          department: [],
          person: '',
          custom_service:'', //客服人员
        },
        custom_service:[], //客服人员
        loading: false,
        type: [],
        trench: [],
        panymentData: [],
        price: 0,
        plan_price: 0,
        trusteeship: 0,
        transfer_price: 0,
        count: 0,
        page_price: 0,
        page_plan_price: 0,
        page_trusteeship: 0,
        page_transfer_price: 0,
        page_not_transfer_price: 0,
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
        company: {
          company_id: '',
          dept: ''
        },
        profile: JSON.parse(Cookies.get('company_id'))
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
      }
    },
    methods: {
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          } else if (index === 4) {
            sums[index] = '';
            return;
          } else if (index === 5) {
            sums[index] = '';
            return;
          } else if (index === 6) {
            sums[index] = '';
            return;
          } else if (index === 11) {
            sums[index] = this.page_price;
            return;
          } else if (index === 12) {
            sums[index] = this.page_plan_price;
            return;
          } else if (index === 13) {
            sums[index] = this.page_trusteeship;
            return;
          } else if (index === 14) {
            sums[index] = this.page_transfer_price;
            return;
          } else if (index === 15) {
            sums[index] = this.page_not_transfer_price;
            return;
          }
        });

        return sums;
      },
      handleCompany (val) {
        this.company.company_id = val;
        this.$store.dispatch('dept', this.company);
      },
      departmentChange (val) {
        this.ruleForm.department = val;
        this.company.dept = val;
        this.$store.dispatch('dept',this.company);
        /*this.$get( 'report/selectPanymentData',{department: val})
          .then( (data) => {
            if(data.code){
              this.person = data.content.person;
            }
          })
          .catch( (error) => {

          })*/
      },
      // 查询
      onSubmit () {
        this.$get( 'report/panymentData',this.ruleForm)
          .then( (data) => {
            let pageNumber = data.content;
            this.page_price = pageNumber.page_price;
            this.page_plan_price = pageNumber.page_plan_price;
            this.page_trusteeship = pageNumber.page_trusteeship;
            this.page_transfer_price = pageNumber.page_transfer_price;
            this.page_not_transfer_price = pageNumber.page_not_transfer_price;
            this.panymentData = pageNumber.order_data;
            this.count = pageNumber.count;
            this.price = pageNumber.price;
            this.plan_price = pageNumber.plan_price;
            this.trusteeship = pageNumber.trusteeship;
            this.transfer_price = pageNumber.transfer_price;
          })
          .catch((error) => {

          })
      },
      // 跳转订单详情
      handleClick(row) {
        this.$router.push({name: 'orderDetail', params: {id: row.id}})
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields();
      },
      // 导出
      exportWorkInfo () {
        let strArgs = Util.makeUrl(this.ruleForm);
        window.open(`${process.env.BASE_API}/report/exportPanyment?Authorization=${this.Authorization}${strArgs}`)
      },
      // 每页多少条
      handleSizeChange (val) {
        this.ruleForm.pageSize = val;
        this.onSubmit();
      },
      // 第几页
      handleCurrentChange (val) {
        this.ruleForm.currentPage = val;
        this.onSubmit();
      },
      // 查询条件
      remoteMethod() {
        this.$get( 'report/selectPanymentData')
          .then( (data) => {
            if(data.code){
              /*this.departmenta = data.content.dept;
              this.person = data.content.person;*/
              this.type = data.content.type;
              let trench = data.content.trench;
              this.trench = Util.obj2Arr(trench);
              this.custom_service = data.content.custom_service;
            }
          })
          .catch(() => {

          })
      },
    },
    created () {
      this.$get( 'manageNew/manageList')
          .then ( (data) => {
            this.searchList = data.content.step;
          })
          .catch (() => {
            this.$message.error('服务器错误，请稍后重试');
          })

      this.onSubmit();
      this.remoteMethod();
      this.$store.dispatch('dept',{});
    }
  }
</script>

<style lang="less">
  .s_repayments{
    .WHSInput {
      float: left;
      margin-left: 20px;
      height: 50px;
    }
    .WHSBtn {
      float: left;
      margin-left: 70%;
    }
  }
</style>
