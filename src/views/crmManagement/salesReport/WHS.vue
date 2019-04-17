<template>
  <div class="Working">
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
              :show-all-levels="false"
              change-on-select
              filterable
              clearable
              :options="dept"
              v-model="ruleForm.department"
              @change="departmentChange"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item prop="person" label="人员："  class="WHSInput">
          <el-select v-model="ruleForm.person" filterable  clearable placeholder="请选择">
            <el-option
              v-for="(item, index) in person"
              :key="index"
              :label="item.nickname"
              :value="item.dd_id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="type" label="类型：" class="WHSInput">
          <el-cascader
              expand-trigger="hover"
              change-on-select
              filterable
              clearable
              :options="status"
              v-model="ruleForm.type">
          </el-cascader>
        </el-form-item>
        
        <el-form-item prop="clientId" label="客户：" class="WHSInput">
          <el-input v-model="ruleForm.client" placeholder="请输入">

          </el-input>
        </el-form-item>
        <el-form-item prop="product_id" label="产品：" class="WHSInput">
          <el-cascader
              expand-trigger="hover"
              :show-all-levels="false"
              filterable
              clearable
              :options="product"
              v-model="ruleForm.product_id"
              @change="handleProduct"
              class="s_client_width"
          >
          </el-cascader>
        </el-form-item>

        <el-form-item prop="order_code" label="服务商：" class="WHSInput">
          <el-input v-model="ruleForm.service" placeholder="请输入">

          </el-input>
        </el-form-item>
        <el-form-item prop="order_code" label="订单编号：" class="WHSInput">
          <el-input v-model="ruleForm.code" placeholder="请输入">

          </el-input>
        </el-form-item>
        <el-form-item prop="order_code" label="工单编号：" class="WHSInput">
          <el-input v-model="ruleForm.number" placeholder="请输入">

          </el-input>
        </el-form-item>
        <el-form-item prop="apply_time" label="申请日期：" class="WHSInput">
          <el-date-picker
              v-model="ruleForm.apply_time"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions2">
          </el-date-picker>
        </el-form-item>

          <el-form-item prop="manage_end_time" label="工单完成时间:" class="WHSInput WHSInput2">
            <el-date-picker
                v-model="ruleForm.manage_end_time"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions2">
            </el-date-picker>
          </el-form-item>
        


        <el-form-item class="WHSBtn">
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button @click="exportWorkInfo">导出</el-button>
        </el-form-item>
      </el-form>
      <!-- <div class="raduisRigth">
        <div>共{{count}}条</div>
        <serviceRequests></serviceRequests>
      </div>
      <div class="raduisRigth">
        <raduisDab></raduisDab>
      </div> -->
      <div style="clear:both"></div>
    </el-card>
    <el-card style="margin-top:10px;">
      <el-table :data="tableData" stripe style="width: 100%" ref="tableRef">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.task" stripe style="width: 100%">
              <el-table-column prop="task_number" label="Brief编号"></el-table-column>
              <el-table-column prop="type_title" label="类型"></el-table-column>
              <el-table-column prop="pro_tile" label="产品"></el-table-column>
              <el-table-column prop="title" label="标题"></el-table-column>
              <el-table-column prop="excutor" label="执行人"></el-table-column>
              <el-table-column prop="end_time" label="截止时间"></el-table-column>
              <el-table-column prop="stat" label="状态"></el-table-column>
              <el-table-column prop="use_time" label="工时"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="order_code" label="订单编号"></el-table-column>
        <el-table-column prop="number" label="编号"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column prop="clint_name" label="客户"></el-table-column>
        <el-table-column prop="pro_name" label="产品"></el-table-column>
        <el-table-column prop="price" label="金额"></el-table-column>
        <el-table-column prop="saleman" label="销售人员"></el-table-column>
        <el-table-column prop="ae" label="客服"></el-table-column>
        <el-table-column prop="excutor" label="执行人"></el-table-column>
        <el-table-column prop="service" label="服务商"></el-table-column>
        <el-table-column prop="brief" label="Brief数量"></el-table-column>
        <el-table-column prop="task_status" label="修改次数"></el-table-column>
        <el-table-column prop="time" label="耗时（天）"></el-table-column>
        <el-table-column prop="brife_time" label="工时（天）"></el-table-column>
        <el-table-column prop="next_person" label="下一步操作人"></el-table-column>
        <el-table-column prop="expect_time" label="申请日期"></el-table-column>
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
  import serviceRequests from '../.././components/s_customer/serviceRequests.vue';
  import raduisDab from '../.././components/s_customer/raduisDab.vue';
  import Util from '@/libs/util';
  import Cookies from 'js-cookie';
  export default {
    components: { serviceRequests, raduisDab },
    data () {
      return {
        pickerOptions2: {
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
        Authorization: Cookies.get('access_token'),
        ruleForm: {
          type: [],
          client: '',
          department: [],
          person: '',
          pro: '',
          product_id: [],
          apply_time:[],
          code:'',   // 来源单号
          number:'', //工单编号
          service:'',  //服务商
        },
        type: [
          {type: 1, name: '售前调用'},
          {type: 2, name: '成单执行'},
        ],
        product: [],
        list: [],
        loading: false,
        client_arr: [],
        clientAll: [],
        tableData: [{}],
        inquireData: {
          currentPage: 1,
          pageSize: 10,
        },
        count: 0,
        status:[],
        DN: [],
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
      exportWorkInfo () {
        for (let index in this.ruleForm) {
          if (this.ruleForm[index] && this.ruleForm[index].length !== 0) {
            let strArgs = Util.makeUrl(this.ruleForm);
            window.open(`${process.env.BASE_API}/report/exporttaskTimeP?Authorization=${this.Authorization}${strArgs}`)
          }
        }
        this.$message({
          message: '请输入查询条件后方可导出',
          type: 'warning'
        });
      },
      handleClick (row) {
        var workType = 0;
        if(row.type == '售前调用'){
         workType = 1;
        }else if(row.type == '成单执行'){
          workType = 2;
        }
         this.$router.push({
            name :'workInfo',
            query: {
              manage_id: row.manage_id,
              work_type:workType
            }
          })
        
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
      // 选择产品的id
      handleProduct (value) {
        if(value.length > 1){
          this.ruleForm.pro = value[value.length-1];
        } else {
          this.ruleForm.pro = '';
        }
      },
      // 查询列表
      onSubmit () {
        this.$get( 'report/taskTimeP',this.ruleForm)
          .then( (data) => {
            if(data.code){
              this.tableData = data.content.detail;
              this.count = data.content.count;
            }
          })
          .catch(() => {

          })
      },
      // 重置查询条件
      resetForm (formName) {
        this.ruleForm.pro = '';
        this.$refs[formName].resetFields();
      },
      handleCompany (val) {
        this.company.company_id = val;
        this.$store.dispatch('dept', this.company);
      },
      departmentChange(val){
        this.company.dept = val;
        this.$store.dispatch('dept', this.company);
      },
      personChange() {
        if (this.ruleForm.department.length > 0) {
          this.orderPerson();
        }
      },
      orderPerson() {
        this.$get( 'report/selectData',this.ruleForm)
          .then( (data) => {
            this.product = data.content.product;
          })
          .catch(() => {})
      }
    },
    created () {
      this.orderPerson();
      this.onSubmit();
      this.$store.dispatch('dept',{});

      this.$get( 'manageNew/manageList',this.searchData)
          .then ( (data) => {
            this.status = data.content.step;
          })
          .catch (() => {
            this.$message.error('服务器错误，请稍后重试');
          })
    }
  }
</script>

<style lang="less" type='scoped'>
  .Working {
    .raduisRigth{
      float: left;
      margin-left: 30px
    }
    .WHSInput {
      float: left;
      margin-left: 15px;
      height: 50px;
    }
    .WHSInput2 .el-form-item__label{
      width: 100px !important;
    }
    .WHSInput2 {
      width: 450px;
    }
    .WHSBtn {
      float: left;
      margin-left: 70%;
    }
  }
</style>
