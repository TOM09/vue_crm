// 服务商搜索的组件
<template>
  <div class="clientNew1">
    <el-collapse accordion @change="clickCollapse">
      <el-collapse-item>
        <template slot="title" >
          {{search_str}}<i class="header-icon el-icon-information"></i>
        </template>
        <el-form ref="form" :model="form" label-position="right" label-width='100px' class='allFacilit'>
          <el-form-item prop="sn_no" label="服务商编号" class="s_client_item">
            <el-input clearable v-model="form.sn_no" placeholder="请输入服务商编号" class="s_client_sel">
            </el-input>
          </el-form-item>
          <el-form-item prop="type" label="类型" class="s_client_item">
            <el-select v-model="form.type" clearable filterable placeholder="请选择" class="s_client_sel_div">
              <el-option
                  v-for="item in searchList.sp_type"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="city" label="所在地"  class="s_client_sel_div is-required">
            <el-cascader
              expand-trigger="hover"
              filterable
              clearable
              :options="region"
              v-model="form.city2"
              @change="changeSource">
            </el-cascader>
          </el-form-item>

          <el-form-item prop="provider_name" label="服务商名称" class="s_client_item">
            <el-input clearable v-model="form.provider_name" placeholder="请输入服务商名称" class="s_client_sel">
            </el-input>
          </el-form-item>

          <el-form-item prop="productArr" label="合作产品" class="s_client_item">
            <el-cascader
              expand-trigger="hover"
              v-model="form.productArr"
              :show-all-levels="false"
              placeholder="请选择"
              :options="product"
              filterable
              clearable
              @change="handleChangeproduct"
              class="s_additem_form">
            </el-cascader>
          </el-form-item>

          <el-form-item prop="create_dd_id" label="负责人" class="s_client_item" >
            <el-select v-model="form.create_dd_id" placeholder="请选择" class="s_client_sel_div" filterable clearable>
              <el-option
                  v-for="(item,index) in person"
                  :key="index"
                  :label="item.nickname"
                  :value="item.dd_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="status" label="状态" class="s_client_item">
            <el-select v-model="form.status" clearable filterable placeholder="请选择" class="s_client_sel_div">
              <el-option
                  v-for="item in typeStatus"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="create_time" label="创建日期" class="s_client_item">
            <el-date-picker
                class="s_client_sel_div_n"
                v-model="form.create_time"
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
    props: ['searchList','range','region','product'],
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
          productArr:[],
          sn_no:'',
          type: '',
          city: '',
          city2:[],
          provider_name: '',
          product_id:'',
          create_dd_id: '',  //人员
          status:'',
          create_time: [],
          department:[], //部门
          range:(this.range ? this.range : ''),
        },
        search_str:"点击展开搜索列表",
        company: JSON.parse(cookies.get('company_id')),
        companys: {
          company_id: '',
          dept: ''
        },
        typeStatus:[
          {
          id: 0,
          name: "无效"
          },
          {
          id: 1,
          name: "有效"
          }
        ]
      }
    },
    computed:{
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
      // 合作产品
       handleChangeproduct(value) {
        this.form.product_id = value[value.length-1];
        console.log(this.form.product_id)

      },
      changeSource(value){
        // 选择所在地的事件
        this.form.city = value[value.length-1];
      },
      // 列表导出
      clientExport () {
        for(let key in this.form) {
          if(key !== 'range') {
            // if(this.form[key] && (typeof this.form[key] === 'number' || this.form[key].length !== 0) ) {
              let strArgs = Util.makeUrl(this.form);
              window.open(`${process.env.BASE_API}/report/exportProviders?Authorization=${this.Authorization}${strArgs}`);
              return false;
            // }
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
  .clientNew1{
    .allFacilit{
      overflow: hidden;
      .el-form-item{
        height: 50px;
      }
    }
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
