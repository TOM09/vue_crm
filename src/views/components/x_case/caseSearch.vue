<template>
  <el-card class="caseSearch">
    <p  class="case_text">案例列表</p>
    <el-collapse accordion @change="handleChange" style="margin-top: 15px;">
      <el-collapse-item >
        <template slot="title">
          {{condition}}
        </template>
        <el-form ref="form" :model="form" label-position="right" label-width='80px' style="margin-top: 15px;">
          <el-form-item prop="pro" label="分类产品" class="x_case_search">
            <el-cascader
                style="width: 260px;"
                placeholder="请选择"
                :show-all-levels="false"
                :options="product"
                v-model="form.pro"
                clearable
                filterable
                @change="changeProduct">
            </el-cascader>
          </el-form-item>
          <el-form-item prop="lable" label="标签" class="x_case_search">
            <el-select v-model="form.lable" clearable placeholder="请选择" class="x_case_input">
              <el-option
                  v-for="item in caseTop.lable"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="producerLevel" label="出品人星级" class="x_case_search x_case_search1">
            <el-select v-model="form.producerLevel" class="x_case_input" clearable filterable placeholder="请选择">
              <el-option
                  v-for="item in caseTop.produceLevel"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="industry"  label="行业" class="x_case_search">
            <el-select v-model="form.industry" class="x_case_input" placeholder="请选择" filterable clearable>
              <el-option
                  v-for="item in caseTop.industry"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="excutor_type"  label="执行方" class="x_case_search">
            <el-select v-model="form.excutor_type" class="x_case_input" placeholder="请选择" filterable clearable>
              <el-option
                      v-for="item in executive"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="can_publicity" label="是否外宣" class="x_case_search x_case_search1">
            <el-select v-model="form.can_publicity" clearable placeholder="请选择" class="x_case_input">
              <el-option
                  v-for="item in allDate"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="来源渠道" prop="trench" class="x_case_search">
            <el-cascader
                    expand-trigger="click"
                    filterable
                    clearable
                    :options="customer_source"
                    v-model="form.trench"
                    @change="changeSource">
            </el-cascader>
          </el-form-item>
          <el-form-item prop="producer" label="出品人"  class="x_case_search">
            <el-select v-model="form.producer" class="x_case_input"  placeholder="请选择" allow-create filterable clearable>
              <el-option
                      v-for="(item, index) in person"
                      :key="index"
                      :label="item.nickname"
                      :value="item.dd_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="tag_id" label="风格"  class="x_case_search">
            <el-select v-model="form.tag_id" class="x_case_input"  placeholder="请选择" allow-create filterable clearable>
              <el-option
                      v-for="(item, index) in caseTop.tag"
                      :key="index"
                      :label="item.name"
                      :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="make_time" label="案例日期" class="x_case_search">
            <el-date-picker
                style="width:280px;"
                v-model="form.make_time"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy - MM - dd"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="create_time" label="创建日期" class="x_case_search">
            <el-date-picker
                style="width:280px;"
                v-model="form.create_time"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy - MM - dd"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <div style="clear: both;"></div>
          <div class="caseSearch_btn">
            <el-button type="primary" @click="Inquire_client('form')">查询</el-button>
            <el-button @click="resetForm('form')">重置</el-button>
            <el-button v-if="caseTop.can_op" @click="derived()">导出</el-button>
          </div>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<script>
  import ElCard from "element-ui/packages/card/src/main";
  import cookies from 'js-cookie';
  import Util from '@/libs/util';
  export default {
    components: {
      ElCard
    },
    name: 'caseSearch',
    props: {
      caseTop:{
        type:Object
      },
      product:{
        type:Array,
      },
      customer_source:{
        type:Array,
      }
    },
    data() {
      return {
        Authorization: cookies.get('access_token'),
        form: {
          product_id:'',      // 分类产品
          lable:'',           // 标签
          producerLevel:'',   // 星级
          industry:'',        // 行业
          make_time:[],       // 案例日期
          create_time:[],     // 创建日期
          producer:'',        // 出品人
          can_publicity:'',   // 可否外宣
          pro:[],
          excutor_type:"",  //执行方
          trench:[],  //来源渠道
          tag_id:[],  //风格
          // page: 1,
          // perPage: 12,
          // count:0,
        },
        allDate: [{
          value: '1',
          name: '是'
        }, {
          value: '0',
          name: '否'
        }],
        condition:'更多筛选条件',
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
        executive:[
          {label: "自营",id:1},
          {label: "服务商",id:2}
        ],
      }
    },
    computed: {
      person () {
        return this.$store.state.app.commonPerson;
      }
    },
    methods: {
      derived () {
        let strArgs = Util.makeUrl(this.form);
        window.open(`${process.env.BASE_API}/report/caseExcel?Authorization=${this.Authorization}${strArgs}`)
      },
      handleChange(val){
        if(val){
          this.condition = '收起筛选条件';
        }else {
          this.condition = '更多筛选条件';
        }
      },
      changeProduct(value) {
        this.form.product_id = value[2];
      },
      Inquire_client() {
        this.$emit("searchNew",this.form);
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      changeSource (val){
        val[0] === 1 ? this.judge = true : this.judge = false;
        val[0] === 4 ? this.judgeLine = true : this.judgeLine = false;
        val[0] === 5 ? this.judgeLinen = true : this.judgeLinen = false;
        val[0] === 6 ? this.judgeHm = true : this.judgeHm = false;
      },
    },
    created(){
    }
  }
</script>

<style lang="less">
  .caseSearch {
    /*margin-bottom: 22px;*/
    .x_case_search {
      float: left;
      width: 33%;
    }
    .x_case_search .el-input{
      width: 260px;
    }
    .x_case_search1 label{
      width: 85px !important;
    }
    .x_case_input{
      width: 260px;
      height: 50px;
    }
    .caseSearch_btn {
      width: 100%;
      float: left;
      margin-left: 72%;
      margin-bottom: 20px;
    }
    .el-collapse-item__header{
      text-align: center;
    }
    .accordion{
      width: 102px;
      margin-left: 837px;
    }
    .el-collapse-item__header{
      width: 102px;
      margin-left: 55%;
      border:none;
      color: #999;
      margin-top: -22px;
    }
    .el-collapse{
      border:none;
    }
    .case_text{
      font-size: 16px;
      color:black;
    }
    .el-date-editor .el-range__close-icon{
      width:23px;
    }
  }
</style>
