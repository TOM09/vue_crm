// 客户搜索的组件
<template>
  <div class="clientNew">
    <el-collapse accordion @change="clickCollapse">
      <el-collapse-item>
        <template slot="title" >
          {{search_str}}<i class="header-icon el-icon-information"></i>
        </template>
        <el-form ref="form" :model="form" label-position="right" label-width='100px'>
          <el-form-item prop="company" label="客户编号" class="s_client_item">
            <el-input clearable v-model="form.code" placeholder="请输入客户编号" class="s_client_sel">
            </el-input>
          </el-form-item>
          <el-form-item prop="company" label="客户名称" class="s_client_item">
            <el-input clearable v-model="form.company" placeholder="请输入客户名称" class="s_client_sel">
            </el-input>
          </el-form-item>
          <el-form-item  prop="phone" label="手机号" class="s_client_item">
            <el-input clearable v-model="form.phone" placeholder="请输入手机号" class="s_client_sel">
            </el-input>
          </el-form-item>
          <el-form-item prop="customer" label="客户类型" class="s_client_item">
            <el-select v-model="form.customer" clearable filterable placeholder="请选择" class="s_client_sel_div">
              <el-option
                  v-for="item in searchList.root"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="industry" label="客户行业" class="s_client_item">
            <el-select v-model="form.industry" clearable filterable placeholder="请选择" class="s_client_sel_div">
              <el-option
                  v-for="item in searchList.industry"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="trench" label="来源" class="s_client_item">
            <el-cascader
                class="s_client_sel_div"
                clearable
                filterable
                expand-trigger="hover"
                :show-all-levels="false"
                :options="trench"
                v-model="form.trench">
            </el-cascader>
          </el-form-item>

          <el-form-item prop="location" label="所在地区" class="s_client_item">
            <el-select v-model="form.location" clearable filterable placeholder="请选择" class="s_client_sel_div">
              <el-option
                  v-for="item in searchList.location"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="scale" label="客户规模" class="s_client_item">
            <el-select v-model="form.scale" clearable filterable placeholder="请选择" class="s_client_sel_div">
              <el-option
                  v-for="item in searchList.scale"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="scale" label="公司" class="s_client_item">
            <el-select v-model="company" @change="handleChange"  clearable filterable placeholder="请选择" class="s_client_sel_div">
              <el-option
                  v-for="item in company_info"
                  :key="item.company_id"
                  :label="item.name"
                  :value="item.company_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="department" label="部门" class="s_client_item">
            <el-cascader
                change-on-select
                class="s_client_sel_div"
                expand-trigger="click"
                filterable
                clearable
                :options="dept"
                v-model="form.department"
                @change="departmentChange">
            </el-cascader>
          </el-form-item>
          <el-form-item prop="nickname" label="创建人" class="s_client_item" >
            <el-select v-model="form.nickname" placeholder="请选择" class="s_client_sel_div" filterable clearable>
              <el-option
                  v-for="(item,index) in person"
                  :key="index"
                  :label="item.nickname"
                  :value="item.dd_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="nickname" label="跟进人" class="s_client_item" >
            <el-select v-model="form.partner" placeholder="请选择"  class="s_client_sel_div" filterable clearable>
              <el-option
                  v-for="item in commonPerson"
                  :key="item.dd_id"
                  :label="item.nickname"
                  :value="item.dd_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="new_time" label="咨询日期" class="s_client_item">
            <el-date-picker
                class="s_client_sel_div_n"
                v-model="form.ask_time"
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
          <el-form-item prop="new_time" label="创建时间" class="s_client_item">
            <el-date-picker
                class="s_client_sel_div_n"
                v-model="form.new_time"
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
            <el-button type="primary" @click="Inquire_client(form)">查询</el-button>
            <el-button @click="resetForm('form')">重置</el-button>
            <el-button @click="clientExport">导出</el-button>
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
    name: 'clientSearch',
    props: ['searchList','range'],
    data () {
      return {
        Authorization: cookies.get('access_token'),
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
        form: {
          code:'',
          phone:'',
          company: '',
          customer: '',
          industry: '',
          location: '',
          nickname: '',  //人员
          scale: '',
          new_time: [],
          department:[], //部门
          range:(this.range ? this.range : ''),
          trench:[],
          ask_time:[],
          partner:'', //共同负责人
        },
        search_str:"点击展开搜索列表",
        company: JSON.parse(cookies.get('company_id')),
        companys: {
          company_id: '',
          dept: ''
        }
      }
    },
    computed:{
      trench() {
        return Util.obj2Arr(this.searchList.customer_source)
      },
      dept () {
         return this.$store.state.app.dept;
      },
      person () {
        return this.$store.state.app.person;
      },
      commonPerson () {
        return this.$store.state.app.commonPerson
      },
      company_info () {
        return this.$store.state.app.company_info
      }
    },
    // watch:{
    //     'customerLength'(){
    //       setTimeout(()=>{
    //         this.customerLength = this.customer_source;
    //       })
    //     }
    // },
    methods:{
      // 列表导出
      clientExport () {
        for(let key in this.form) {
          if(key !== 'range') {
            if(this.form[key] && (typeof this.form[key] === 'number' || this.form[key].length !== 0) ) {
              let strArgs = Util.makeUrl(this.form);
              window.open(`${process.env.BASE_API}/report/clientExcel?Authorization=${this.Authorization}${strArgs}`);
              return false;
            }
          }
        }
        this.$message({
          message: '请输入查询条件后方可导出',
          type: 'warning'
        });
      },
      handleChange (val) {
        this.companys.company_id = val;
        this.$store.dispatch('dept',this.companys);
      },
      departmentChange (val) {
        this.form.department = val;
        this.companys.dept = val;
        this.$store.dispatch('dept',this.companys);
      },
      // 查询接口
      Inquire_client () {
        this.$emit("eventFromChild",this.form);
      },
      // 搜索重置按钮函数
      resetForm (formName) {
        this.$refs[formName].resetFields();
      },
      clickCollapse (activeNames) {
        if(activeNames){
          this.search_str = "点击关闭搜索列表";
        }else{
          this.search_str = "点击展开搜索列表";
        }
      }
    },
    created (){
      // 原来是打开的
      // this.$store.dispatch('dept',{});

      // this.$store.dispatch('dept');
      /*this.person = JSON.parse(localStorage.person);
      this.commonPerson = JSON.parse(localStorage.person);
      this.dept = JSON.parse(localStorage.dept);*/
    },
    activated () {
      // 原来是打开的
      // this.$store.dispatch('dept',{});
    }
  }
</script>
<style lang="less">
  .clientNew{
    .s_client_list{
      width: 100%;
      background: #fff;
    }
    .s_client_sel_div{
      float: left;
      height: 50px;
    }
    .s_client_sel_div_n{
      width: 350px;
    }
    .s_client_sel{
      width: 220px;
    }
    .s_client_btn{
      width: 300px !important;
      float: left;
      margin-top: 30px;
      margin-left: 70%;
      padding-bottom: 20px;
    }

    .s_client_item{
      float: left;
    }
    .el-collapse-item__header{
      text-align: center;
    }
    .el-collapse-item__header{
      display: block;
    }
  }
</style>
