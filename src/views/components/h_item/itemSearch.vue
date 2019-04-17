<template>
  <div class="itemList_top">
    <el-collapse accordion>
      <el-collapse-item  name="1" class='clickOpen'>
        <template slot="title">
          点击展开搜索列表<i class="header-icon el-icon-information"></i>
        </template>
        <el-form ref="form" :model="form" label-position="left" label-width='90px'>
          <el-form-item label="项目名称" prop="projectName" class="h_itemTop_div">
            <el-input v-model="form.projectName" placeholder="请输入" style="width: 217px;">
            </el-input>
          </el-form-item>
          <el-form-item label="项目编号" prop="code" class="h_itemTop_div">
            <el-input v-model="form.code" placeholder="请输入项目编号" style="width: 217px;"></el-input>
          </el-form-item>
          <el-form-item label="项目来源" prop="origin" class="h_itemTop_div" v-if="origin">
            <el-cascader
              clearable
              filterable
              change-on-select
              expand-trigger="click"
              :options="origin"
              v-model="form.origin"
               v-if="origin">
            </el-cascader>
          </el-form-item>
          <el-form-item label="项目意向" prop="intention" class="h_itemTop_div">
            <el-select v-model="form.intention" filterable clearable placeholder="请选择项目意向">
              <el-option
                v-for="item in searchData.intention"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户名称" prop="client" class="h_itemTop_div">
            <el-input v-model="form.client" placeholder="请输入" style="width: 217px;"></el-input>
          </el-form-item>
          <el-form-item label="项目状态" prop="stage" class="h_itemTop_div">
            <el-select v-model="form.stage" filterable clearable  placeholder="请选择">
              <el-option
                v-for="item in searchData.stage"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="product_id" filterable label="选择产品" class="h_itemTop_div">
            <el-cascader
              clearable
              filterable
              expand-trigger="hover"
              :options="product"
              v-model="form.product_id"
              :show-all-levels="false">
            </el-cascader>
          </el-form-item>
          <el-form-item  label="公司" class="h_itemTop_div">
            <el-select v-model="profile" @change="handleChange" placeholder="请选择" filterable clearable>
              <el-option
                  v-for="item in company_info"
                  :key="item.company_id"
                  :label="item.name"
                  :value="item.company_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="dept" label="部门" class="h_itemTop_div">
            <el-cascader
              change-on-select
              expand-trigger="click"
              filterable
              clearable
              :options="dept"
              v-model="form.dept"
              @change="departmentChange">
            </el-cascader>
          </el-form-item>
          <el-form-item prop="salesman" label="人员" class="h_itemTop_div">
            <el-select v-model="form.salesman" placeholder="请选择" filterable clearable>
              <el-option
                v-for="(item, index) in person"
                :key="index"
                :label="item.nickname"
                :value="item.dd_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="partner" label="共同负责人" class="h_itemTop_div">
            <el-select v-model="form.partner" placeholder="请选择"   filterable clearable>
              <el-option
                v-for="item in commonPerson"
                :key="item.dd_id"
                :label="item.nickname"
                :value="item.dd_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="create_time" label="创建时间" class="h_itemTop_div">
            <el-date-picker
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
          <div style="clear: both"></div>
          <div class="top_btn_botton">
            <el-button type="primary" @click="Inquire_item('form')">查询</el-button>
            <el-button @click="resetForm('form')">重置</el-button>
            <el-button @click="exportForm">导出</el-button>
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
    props:['searchData','product','range'],
    data () {
      return {
        Authorization: cookies.get('access_token'),
        itemList_show: true,
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
          // origin: [],                // 项目来源

        form: {
          dept:[],
          salesman: '',              // 销售人员 ==》 换人员
          partner: '',               // 共同负责人
          projectName: '',           // 项目名称
          client: '',                // 客户
          origin: [],                // 项目来源
          stage: '',                 // 项目状态
          create_time: [],           // 创建时间
          product_id: [],
          code: '',
          intention: '',
          range: '',
        },
        // product:[],
        // searchData:{},
        company: {
          company_id: '',
          dept: ''
        },
        profile: JSON.parse(cookies.get('company_id')) // 绑定公司选值
      }
    },
    computed:{
      origin() {
        return Util.obj2Arr(this.searchData.origin)
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
      handleChange (val) {
        this.company.company_id = val;
        this.$store.dispatch('dept', this.company);
      },
      departmentChange(value){
        this.form.dept = value;
        this.company.dept = value;
        this.$store.dispatch('dept', this.company);
      },
      Inquire_item(){
        this.$emit("itemQuery",this.form)
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      exportForm(){
        let strArgs = Util.makeUrl(this.form);
        window.open(`${process.env.BASE_API}/export/projectList?Authorization=${this.Authorization}${strArgs}`)
      }
    },
    // mounted () {
    //   if(this.range == 'all'){
    //     this.$get('crmManagement/item/itemList')
    //             .then((data) => {
    //               this.searchData = data.content;
    //               this.product = data.content.product;
    //             })
    //             .catch(() => {})
    //   }
    // },

    // 加入 watch 监听数据变化
    watch: {
      range (val) {
        this.form.range = val;
      }
    },
    created () {
      /*this.person = JSON.parse(localStorage.person);
      this.commonPerson = JSON.parse(localStorage.person);
      this.dept = JSON.parse(localStorage.dept);*/

      // this.$store.dispatch('dept',{});
    },
    activated () {
      // this.$store.dispatch('dept',{});
    }

  }
</script>
<style lang="less" >
  .itemList_top{
    .el-collapse-item__header{
      text-align: center;
    }
    .h_itemTop_div{
      float: left;
      margin-left: 50px;
      height: 50px;
    }
    .top_btn_botton{
      float: right;
      padding: 15px;
    }
    .top_btn{
      float: left;
    }
    .clickOpen .el-collapse-item__header{
      display: block;
    }
  }
</style>
