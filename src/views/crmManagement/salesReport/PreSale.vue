<template>
  <div class="PreSalesFollowUpDaily">
    <el-card>
      <el-form :model="form" ref="form" label-position="right" label-width='90px'>
        <el-form-item prop="code" label="项目编号：" class="WHSInput">
          <el-select
              v-model="form.code"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="请输入关键词查询"
              :remote-method="orderStatement"
              :loading="loading">
            <el-option
                v-for="item in pro_code"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
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
          <el-select v-model="form.person" placeholder="请选择"  filterable clearable>
            <el-option
                v-for="(item, index) in person"
                :key="index"
                :label="item.nickname"
                :value="item.dd_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="type" label="执行状态：" class="WHSInput" >
          <!-- <el-select v-model="form.type" placeholder="请选择"  filterable clearable>
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
              v-model="form.task_type" 
              >
          </el-cascader>
        </el-form-item>
        <el-form-item prop="call_type" label="调用类型：" class="WHSInput" >
          <el-select v-model="form.call_type" placeholder="请选择"  filterable clearable>
            <el-option
                v-for="item in call_type"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="pro_name" label="项目名称：" class="WHSInput">
          <el-select
              v-model="form.pro_name"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="请输入关键词查询"
              :remote-method="orderStatement"
              :loading="loading">
            <el-option
                v-for="item in pro_name"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="time" label="申请日期：" class="WHSInput">
          <el-date-picker
              v-model="form.create_time"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions1">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="time" label="跟进日期：" class="WHSInput">
          <el-date-picker
              v-model="form.follow_time"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions1">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="WHSBtn">
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
          <el-button @click="exportPreSale">导出</el-button>
        </el-form-item>
      </el-form>
      <div style="clear:both"></div>
    </el-card>
    <el-card style="margin-top:10px;">
      <el-table :data="preSaleData" stripe style="width: 100%">
        <el-table-column prop="code"  width="100" label="项目编号"></el-table-column>
        <el-table-column prop="pro_name" width="150" label="项目名称" align="center"></el-table-column>
        <el-table-column prop="product_name" width="200" label="产品" align="center"></el-table-column>
        <el-table-column prop="department" label="部门" align="center"></el-table-column>
        <el-table-column prop="person" label="人员" align="center"></el-table-column>
        <el-table-column prop="call_type" label="调用类型" align="center"></el-table-column>
        <el-table-column prop="create_time" width="100" label="申请日期" align="center"></el-table-column>
        <el-table-column prop="expect_time" width="150" label="预计调用日期" align="center"></el-table-column>
        <el-table-column prop="excutor.executor"  width="100" label="执行人员" align="center"></el-table-column>
        <el-table-column prop="status" width="100" label="执行状态" align="center"></el-table-column>
        <el-table-column prop="result" width="100" label="结果" align="center"></el-table-column>
        <el-table-column prop="time" width="150" label="跟进日期" align="center"></el-table-column>
        <el-table-column prop="follow_result"   label="最新跟进反馈" width="500" align="center"></el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="form.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="form.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
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
        searchList:[],
        Authorization: cookies.get('access_token'),
        preSaleData:[],
        type:[],
        call_type:[],
        pro_name:[],
        pro_code:[],
        loading: false,
        pickerOptions1: {
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
          code:'',
          pro_name:'',
          type:'',
          task_type:[],
          call_type:'',
          create_time:[],
          follow_time:[]
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
      }
    },
    methods: {
      //查看
      handleClick(row) {
        this.$router.push({
          name: 'workInfo',
          query:{
            manage_id:row.id,
            work_type:1
          }
        })
      },
      selectPresale() {
        this.$get('report/selectPresale')
          .then( (data) => {
            if(data.code) {
              this.type = data.content.type;
              this.call_type = data.content.call_type;
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      handleSizeChange (val) {
        this.form.pageSize = val;
        this.onSubmit();
      },
      handleCurrentChange (val) {
        this.form.currentPage = val;
        this.onSubmit();
      },
      onSubmit () {
        // this.form.currentPage = 1;
        this.$get( 'report/presaleData',this.form)
          .then( (data) => {
            this.preSaleData = data.content.detail;
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
      exportPreSale () {
        let strArgs = Util.makeUrl(this.form);
        window.open(`${process.env.BASE_API}/report/exportpresaleData?Authorization=${this.Authorization}${strArgs}`)
      },
      handleCompany (val) {
        this.company.company_id = val;
        this.$store.dispatch('dept', this.company);
      },
      departmentChange(val){
        this.form.department = val;
        this.company.dept = val;
        this.$store.dispatch('dept', this.company);
      },
      //远程搜索自动建议
      orderStatement(value){
        if(value !== ''){
          this.loading = true;
          this.$get('report/selectPresale',{pro_name:value,code:value})
            .then((data) => {
              if(data.code){
                this.loading = false;
                this.pro_name = data.content.pro_name;
                this.pro_code = data.content.pro_code;
              }else{
                this.$message.error(data.errorMsg);
              }
            })
            .catch( () => {
              this.$message.error('服务器错误，请稍后重试');
            })
        }
      },
    },
    created () {
      this.selectPresale();
      this.onSubmit();
      this.$store.dispatch('dept',{});

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

<style lang="less"  type='scoped'>
  .PreSalesFollowUpDaily{
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
