<template>
  <div class="listSearch">
    <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline" label-width="80px">
      <el-form-item prop="dept" label="部门">
        <el-cascader
            class="searchS"
            change-on-select
            expand-trigger="click"
            filterable
            clearable
            :options="dept"
            v-model="formInline.dept"
            @change="departmentChange"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="填写人" prop="person">
        <el-select v-model="formInline.person" placeholder="请选择" @visible-change="personChange" clearable filterable class="searchS">
          <el-option
              v-for="item in person"
              :key="item.dd_id"
              :label="item.nickname"
              :value="item.dd_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择模板" prop="is_week">
        <el-select class="searchS"  v-model="formInline.is_week" @change="isWeekN" placeholder="请选择">
          <el-option v-for="item in isWeek" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请选择周" v-if="formInline.is_week == 1" class="writeSelect">
        <el-date-picker   class="writeSelectP" v-model="weekN"   type="week" @change="getTime" format="yyyy 第 WW 周" placeholder="选择周"></el-date-picker>
      </el-form-item>
      <el-form-item label="请选择月" v-if="formInline.is_week == 2" class="writeSelect">
        <el-date-picker class="writeSelectP" v-model="formInline.month" @change="getMonth"  type="month" value-format="yyyy-MM" placeholder="选择月"></el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="is_approval">
        <el-select v-model="formInline.is_approval" placeholder="请选择" clearable class="searchS">
          <el-option
              v-for="item in isApproval"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建日期" clearable prop="create_time">
        <el-date-picker
            v-model="formInline.create_time"
            type="daterange"
            align="right"
            unlink-panels
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="审批时间" clearable prop="check_time">
        <el-date-picker
            v-model="formInline.check_time"
            type="daterange"
            align="right"
            unlink-panels
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="searchB">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="primary" @click="resetForm('formInline')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'listSearch',
    props: ['approval'],
    data () {
      return {
        isWeek: [{
          value: 1,
          label: '周报'
        },{
          value: 2,
          label: '月报'
        }
        ],
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
        isApproval: [
          {id: 1, name: '待审批'},
          {id: 2, name: '审批通过'},
          {id: 3, name: '审批不通过'}
        ],
        formInline : {
          person: '',
          is_approval: '',
          check_time: [],
          create_time: [],
          approval: '',
          dept:[],
          is_week: '',
          week: [],
          month: '',
        },
        weekN: '',
      }
    },
    computed: {
      dept () {
        return this.$store.state.app.dept;
      },
      person () {
        return this.$store.state.app.person;
      }
    },
    methods: {
      Appendzero(obj) {
        if(obj < 10)
          return '0' + '' + obj
        else
          return obj;
      },
      //切换事件
      isWeekN(val) {
        if(val == 1) {
          this.formInline.is_week = 1;
          this.formInline.month = '';
        } else {
          this.formInline.is_week = 2;
          this.formInline.week = [];
        }
      },
      //changge 时间
      getTime(data) {
        let currentDay = data.getDay();
        if(currentDay == 0){
          currentDay = 7
        }
        let mondayTime = data.getTime() - ( currentDay - 1 ) * 24 * 60 * 60 * 1000;
        let sundayTime = data.getTime() + ( 7 - currentDay) * 24 * 60 * 60 * 1000;
        this.formInline.week = [];
        let aDate = new Date(mondayTime).getFullYear() + '/' + this.Appendzero((new Date(mondayTime).getMonth() + 1)) + '/' + this.Appendzero(new Date(mondayTime).getDate());
        let bDate = new Date(sundayTime).getFullYear() + '/' + this.Appendzero((new Date(sundayTime).getMonth() + 1)) + '/' + this.Appendzero(new Date(sundayTime).getDate());
        this.formInline.week.push(aDate,bDate);
      },

      //change月份
      getMonth(val) {
        this.formInline.month = val;
      },
      //选择部门更新人员
      departmentChange(val) {
        this.formInline.dept = val;
        if(this.formInline.dept.length == 0){
          this.formInline.dept = [];
          this.listSelect();
        }
      },
      //重新获取人员
      personChange(){
        if(this.formInline.dept.length > 0){
          this.listSelect();
        }
      },
      listSelect() {
        this.$store.dispatch('dept',this.formInline.dept);
        /*this.$get('weekmonthwork/listSelectData',{department:this.formInline.dept})
          .then((data) => {
            if(data.code) {
              this.dept = data.content.dept;
              this.person = data.content.person;
            }
          })*/
      },
      onSubmit() {
        this.formInline.approval = this.approval;
        this.$emit("searchData",this.formInline);
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    created () {
      this.$store.dispatch('dept',{});
      this.listSelect();
    }
  }
</script>

<style lang="less" scoped>
  .listSearch {
    .searchS {
      width: 230px;
    }
    .searchB {
      margin-top: 10px;
      margin-left: 80%;
    }
  }
</style>