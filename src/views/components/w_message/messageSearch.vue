// 留言搜索的组件
<template>
  <div class="clientNew">
    <el-collapse accordion @change="clickCollapse">
      <el-collapse-item>
        <template slot="title" >
            {{search_str}}<i class="header-icon el-icon-information"></i>
        </template>
        <el-form ref="form" :model="form" label-position="right" label-width='100px'>
          <el-form-item prop="word_code" label="留言编号" class="s_client_item">
              <el-input clearable v-model="form.word_code" placeholder="请输入留言编号" class="s_client_sel"></el-input>
          </el-form-item>
          <el-form-item prop="data_source" label="数据来源" class="s_client_item">
            <el-select v-model="form.data_source" clearable filterable placeholder="请选择" class="s_client_sel_div">
              <el-option
                v-for="item in searchList.dataSource"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  prop="contacts" label="联系方式" class="s_client_item">
            <el-input clearable v-model="form.contacts" placeholder="请输入" class="s_client_sel"></el-input>
          </el-form-item>
          <el-form-item  prop="category" label="留言类目" class="s_client_item">
            <el-input clearable v-model="form.category" placeholder="请输入" class="s_client_sel"></el-input>
          </el-form-item>
          <el-form-item prop="region" label="留言地区" class="s_client_item">
            <el-select v-model="form.region" clearable filterable placeholder="请选择" class="s_client_sel_div">
              <el-option
                v-for="item in searchList.region"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  prop="page_source" label="页面来源" class="s_client_item">
            <el-input clearable v-model="form.page_source" placeholder="请输入" class="s_client_sel"></el-input>
          </el-form-item>
          <el-form-item prop="create_time" label="提交时间" class="s_client_item">
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
          <el-form-item prop="status" label="留言状态" class="s_client_item">
            <el-select v-model="form.status" clearable filterable placeholder="请选择" class="s_client_sel_div">
              <el-option
                v-for="item in searchList.status"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="leader" label="负责人" class="s_client_item">
            <el-select v-model="form.leader" clearable filterable placeholder="请选择" class="s_client_sel_div">
              <el-option
                v-for="item in person"
                :key="item.dd_id"
                :label="item.nickname"
                :value="item.dd_id">
              </el-option>
            </el-select>
          </el-form-item>
          <div class="s_client_btn">
            <el-button type="primary" @click="Inquire_message()">查询</el-button>
            <el-button @click="resetForm('form')">重置</el-button>
            <el-button @click="messageExport()">导出</el-button>
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
  name: 'messageSearch',
  props: {
    searchList:{
      type: Object
    },
    range:{
      type:String
    }
  },
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
        word_code:'',
        data_source:'',
        contacts: '',
        category: '',
        region: '',
        page_source: '',
        status: '',
        leader: '',
        create_time: [],
        type:(this.range ? this.range : ''),
      },
      search_str:"点击关闭搜索列表",
    }
  },
  computed:{
    trench() {
      return Util.obj2Arr(this.searchList.trench)
    },
    person () {
      return this.$store.state.app.commonPerson;
    }
  },
  methods:{
    // 列表导出
    messageExport () {
      let strArgs = Util.makeUrl(this.form);
      window.open('http://www.vipyipoint.com/report/exportWords?' + 'Authorization=' + this.Authorization + strArgs)
    },
    Inquire_message () {
      this.$emit("searchMessage",this.form);
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    clickCollapse (activeNames) {
      if(activeNames){
        this.search_str = "点击关闭搜索列表";
      }else{
        this.search_str = "点击展开搜索列表";
      }
    },
  },
  created () {
  },
}
</script>
<style lang="less" scoped>
  .clientNew{
    .s_client_list{
      width: 100%;
      background: #fff;
    }
    .s_client_item{
      float: left;
      height: 50px;
    }
    .s_client_sel_div{
      width: 220px;
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
    .el-collapse-item__header{
      text-align: center;
    }
  }
</style>
