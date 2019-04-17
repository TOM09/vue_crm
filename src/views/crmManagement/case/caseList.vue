<template>
  <div class="caselist" style="position: relative">
    <span @keydown.enter="allSearch">
      <el-input placeholder="全文搜索" v-model="input"  clearable class="x_input" >
        <el-button slot="append" type="primary" icon="el-icon-search" @click="allSearch"></el-button>
      </el-input>
      <caseSearch :caseTop="caseTop" :product="product" :customer_source="customer_source"  @searchNew="searchNew"></caseSearch>
    </span>
    <div>
    <span class="x_listsort">
      <el-button type="text" @click="stageChange">按人气排序</el-button>
      <i :class="activeClass"  style="color:#409eff;"></i>
      <el-button type="text" @click="stageChangeTime">按时间排序</el-button>
      <i :class="activeClass" style="color:#409eff;"></i>
    </span>
      <el-row style="margin-top: -15px; overflow: hidden;">
        <div  v-for="(item,index) in caseData" :key="item.id" class="x_case_img">
          <el-card :body-style="{ padding: '8px' }" style="width: 100%;height: 100%;padding-top: 8px;">
            <img v-if="item.cover"  :src="item.cover.slice(0,item.cover.indexOf('?'))" class="image" @click="clicklist(item)">
            <div>
              <p class="case_detail">{{item.name}}</p>
              <p style="height: 30px;">
                <span class="x_lable" style="text-align: center;" v-for="(item1,index) in item.tag">
                  {{item1}}
                </span>
                <span class="tpr" style="float: right;">
                <span class="x_lable x_lable_img" :class="{x_lable_img1:item.is_praise} " style="width:80px;border: none;" @click="pointPraise(item)"><b>{{item.praise}}</b></span>
                </span>
                <span style="text-align: center;position: absolute;top: 5px;right: 0;" v-if="item.lable == '精品'">
                  <img src="/src/images/caseIcon.png" style="width: 50px;">
                </span>
              </p>
              <p class="Designer">
                <span class="publisher" style="float:left;height: 35px;" v-if="item.excutor_type == 1">自营</span>
                <span class="publisher" style="float:left;height: 35px;" v-else-if="item.excutor_type == 2">服务商</span>
                <el-rate
                    :value="item.designer"
                    disabled
                    :max="item.designer"
                    score-template="{value}">
                </el-rate>
              </p>
            </div>
          </el-card>
        </div>
      </el-row>
    </div>
    <el-pagination background
     @size-change="handleSizeChange"
     @current-change="handleCurrentChange"
     :current-page="page"
     :page-sizes="[12, 24, 48, 96]"
     layout="total, sizes, prev, pager, next, jumper"
     :total="count">
    </el-pagination>
  </div>
</template>

<script>
  import Util from '@/libs/util';
  import caseSearch from '../.././components/x_case/caseSearch';
  export default {
    name: 'caseList',
    components:{
      caseSearch
    },
    data(){
      return{
        caseData:[],  // 列表
        caseTop:{},
        product:[],
        customer_source:[],
        x_form:{},
        page: 1,
        perPage: 12,
        count:0,
        sort_field:'',
        sortord:'',
        praise:'praise',
        make_time:'make_time',
        desc:'desc',
        asc:'asc',
        timedesc:'desc',
        timeasc:'asc',
        input:'',   // 全文搜索
        activeClass: 'el-icon-arrow-up',
      }
    },
    methods:{
      allSearch(){
        this.caselist();
      },
      stageChange(){
        if(this.desc){
          this.x_form.sort_field = this.praise;
          this.x_form.sortord = this.desc;
          this.activeClass = 'el-icon-arrow-up';
          this.desc = '';
          this.asc = 'asc';
          this.caselist();
        }else{
          this.x_form.sort_field = this.praise;
          this.x_form.sortord = this.asc;
          this.activeClass = 'el-icon-arrow-down';
          this.asc = '';
          this.desc = 'desc';
          this.caselist();
        }
      },
      stageChangeTime(){
        if(this.timedesc){
          this.x_form.sort_field = this.make_time;
          this.x_form.sortord = this.timedesc;
          this.activeClass = 'el-icon-arrow-up';
          this.caselist();
          this.timedesc = '';
          this.timeasc = 'asc';
        }else{
          this.x_form.sort_field = this.make_time;
          this.x_form.sortord = this.timeasc;
          this.activeClass = 'el-icon-arrow-down';
          this.timeasc = '';
          this.timedesc = 'desc';
          this.caselist();
        }
      },
      //点赞
      pointPraise(item){
        if(!item.is_praise){
          this.$put('case/praise/' + item.id)
            .then((data) => {
              if(data.code){
                this.$message({
                  message:data.errorMsg,
                  type: 'success',
                });
                this.caselist();
              }else{
                this.$message.error(data.errorMsg);
              }
            })
            .catch( () => {
              this.$message.error('服务器错误，请稍后重试');
            })
        }else {
          this.$message({
            message: '您已经点过赞了',
            type: 'warning'
          });
        }
      },
      clicklist (item) {
        this.$router.push({name:'caseDetail',params:{id:item.id}})
      },
      searchNew (data) {
        this.x_form = data;
        this.caselist();
      },
      handleSizeChange (val) {
        this.perPage = val;
        this.caselist();
      },
      handleCurrentChange (val) {
        this.page = val;
        this.caselist();
      },
      caselist () {
        let x_form = this.x_form;
        x_form.perPage = this.perPage;
        x_form.page = this.page;
        x_form.count = this.count;
        x_form.keyword = this.input;
        this.$get('case',x_form)
          .then((data) => {
            if(data.code){
              this.caseTop = data.content;
              this.product = data.content.product;
              let customer = data.content.customer_source;  //来源渠道
              this.customer_source = Util.obj2Arr(customer);
              let list = data.content.caseList;
              this.page = list.page;
              this.perPage = list.perPage;
              this.pageNums = list.pageNums;
              this.count = list.count;
              this.caseData = list.data;
//              console.log(data)
            }else{
              this.$message.error(data.errorMsg);
            }
          })
          .catch( () => {})
      },
    },
    created(){
      this.caselist();
    }
  }
</script>

<style scoped>
  .x_input{
    width: 30%;
    position: absolute;
    left: 24%;
    top: 44px;
  }
  .x_lable_img{
    background: url("../../.././images/parse.png") no-repeat;
    background-position: 18px 5px;
  }
  .x_lable_img b{
    margin-left: 35px;
  }
  .x_lable_img:hover{
    cursor: pointer;
  }
  .image:hover{
    cursor: pointer;
  }
  .el-card__body{
    overflow: hidden;
  }
  .el-pagination{
    padding: 20px;
    text-align: center
  }
  .case_detail{
    width: 80%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .tpr{
    display: inline-block;
    text-align: center;
    width: 80px;
    height: 24px;
    border-radius: 15px;
    font-size: 12px;
    line-height: 24px;
    background: #f8f8f8;
  }
  .x_lable_img1{
    background: url("../../.././images/parses.png") no-repeat;
    background-position: 18px 5px;
  }
  .x_lable_img b{
    margin-left: 35px;
    color:#ccc;
  }
  .x_lable_img1 b{
    color:#f92d54;
  }
  .image {
    width: auto;
    display: block;
    height: 186px;
    margin: 0 auto;
    max-width: 100%;
  }
  .x_case_img{
    width: 24.25%;
    float: left;
    margin: 20px auto;
    margin-right: 1%;
    position: relative;
  }
  .x_case_img:nth-child(4n){
    margin-right: 0px;
  }
  .x_case_img:nth-child(4n+1){
    margin-left: 0px;
  }
  .x_case_img p{
    height: 30px;
    line-height: 35px;
    font-size: 14px;
  }
  .Designer{
    height: 15px !important;
    border-top: 1px solid #eee;
  }
  .x_case_img p span{
    float: left;
    margin-right: 5px;
  }
  .x_lable{
    display: inline-block;
    width: auto;
    height: 24px;
    padding: 0 15px;
    border-radius: 15px;
    border: 1px solid #99d4ff;
    font-size: 12px;
    line-height: 24px;
    color:#99d4ff;
  }
  .publisher{
    display: inline-block;
    width: 24%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .x_listsort{
    box-sizing: border-box;
    margin-left: 20px;
  }
  .el-rate{
    float: right;
    margin-top: 6px;
  }

</style>
