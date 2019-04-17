<template>
  <div class="workNewSearch">
    <el-collapse accordion>
      <el-collapse-item>
        <template slot="title" class="workSearchButton">
          点击展开搜索列表<i class="header-icon el-icon-information"></i>
        </template>
        <el-form ref="form" :model="searchForm"  label-width='80px'>
          <el-form-item prop="manage_number" label="工单编号:" class="s_client_item">
            <el-input v-model="searchForm.manage_number" clearable autosize placeholder="请输入内容" class="s_client_sel_div"></el-input>
          </el-form-item>
          <el-form-item prop="manage_number" label="订单编号:" class="s_client_item">
            <el-input v-model="searchForm.order_code" clearable autosize placeholder="请输入订单或者售前项目的单号查询" class="s_client_sel_div"></el-input>
          </el-form-item>
          <el-form-item prop="manage_number" label="来源编号:" class="s_client_item">
            <el-input v-model="searchForm.third_order_code" clearable autosize placeholder="请输入八戒、钉钉等外部订单编号" class="s_client_sel_div"></el-input>
          </el-form-item>

          <el-form-item prop="person" label="申请人:" class="s_client_item">
            <el-select v-model="searchForm.person" clearable filterable placeholder="请选择" class="s_client_sel_div">
              <el-option
                  v-for="item in person"
                  :key="item.dd_id"
                  :label="item.nickname"
                  :value="item.dd_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ae" label="客服人员:" class="s_client_item">
            <el-select v-model="searchForm.ae" clearable filterable placeholder="请选择" class="s_client_sel_div">
              <el-option
                  v-for="item in searchList.ae"
                  :key="item.dd_id"
                  :label="item.nickname"
                  :value="item.dd_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="task_type" label="工单类型:" class="s_client_item">
            <el-select v-model="searchForm.task_type" filterable clearable placeholder="请选择" class="s_client_sel_div">
              <el-option
                  v-for="item in searchList.task_type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item prop="client" label="客户名称:" class="s_client_item">-->
          <!--<el-select v-model="searchForm.client" clearable filterable placeholder="请选择" class="s_client_sel_div">-->
          <!--<el-option-->
          <!--v-for="item in searchList.client"-->
          <!--:key="item.id"-->
          <!--:label="item.company"-->
          <!--:value="item.id">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--</el-form-item> -->
          <el-form-item prop="client" label="客户名称:" class="s_client_item">
            <el-input v-model="searchForm.client" clearable autosize placeholder="请输入客户名" class="s_client_sel_div"></el-input>
          </el-form-item>

          <el-form-item prop="executor" label="执行人员:" class="s_client_item">
            <el-select v-model="searchForm.executor" filterable clearable placeholder="请选择" class="s_client_sel_div">
              <el-option
                  v-for="item in person"
                  :key="item.dd_id"
                  :label="item.nickname"
                  :value="item.dd_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="step" label="状态:" class="s_client_item">
            <el-select v-model="searchForm.step" clearable filterable placeholder="请选择" class="s_client_sel_div">
              <el-option
                  v-for="item in searchList.step"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="productList" label="产品信息:" class="s_client_item">
            <el-cascader
                class="s_client_sel_div"
                change-on-select
                expand-trigger="hover"
                filterable
                clearable
                :options="searchList.product"
                :show-all-levels="false"
                v-model="searchForm.productList"
                @change="handleChange">
            </el-cascader>
          </el-form-item>
          <el-form-item prop="manage_number" label="服务商:" class="s_client_item">
            <el-input v-model="searchForm.service" clearable autosize placeholder="请输入" class="s_client_sel_div"></el-input>
          </el-form-item>
          <el-form-item prop="time" label="申请日期:" class="s_client_item">
            <el-date-picker
                class="s_client_sel_div_n"
                v-model="searchForm.time"
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
            <el-button type="primary" @click="Inquire_client(searchForm)">查询</el-button>
            <el-button @click="resetForm('form')">重置</el-button>
          </div>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
  export default {
    name: 'workList',
    props:{
      searchList:{
        type: Object
      },
      page:{
        type: Number
      }
    },
    data () {
      return {
        // person: [],
        searchForm: {
          ae: '',
          step: '',
          client: '',
          product: '',
          person: '',
          task_type: '',
          executor: '',
          manage_number: '',
          time: '',
          productList: [],
          third_order_code:'',
        },
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
      }
    },
    methods: {
      handleChange() {
        this.searchForm.product = this.searchForm.productList[2];
      },
      resetForm (formName) {
        this.searchForm.product = '';
        this.$refs[formName].resetFields();
      },
      // 工单列表查询函数
      Inquire_client (searchForm) {
        if(this.page == 0){
          this.$emit("searchNewList",searchForm);
        } else if(this.page == 1) {
          this.$emit("searchNewListAll",searchForm);
        } else if(this.page == 2) {
          this.$emit("searchNewMyList",searchForm);
        }
      }
    },
    computed: {
      person () {
        return this.$store.state.app.commonPerson;
      }
    },
    created () {
    }
  }
</script>

<style lang="less">
  .workNewSearch{
    .workNewList {
      text-align: center;
      margin-top: 10px;
    }
    .clientNew{
      text-align: center
    }
    .s_client_list{
      width: 100%;
      background: #fff;
    }
    .s_client_sel_div{
      float: left;
      width: 270px;
      height: 50px;
    }
    .s_client_sel_div_n{
      width: 300px;
    }
    .s_client_btn{
      width: 200px;
      float: left;
      margin-top: 30px;
      margin-left: 80%;
      padding-bottom: 20px;
    }
    .s_client_item{
      float: left;
      width: 400px;
      margin-left: 30px;
    }
    .el-collapse-item__header{
      text-align: center;
    }
  }
</style>
