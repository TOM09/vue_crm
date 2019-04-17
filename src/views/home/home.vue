<template>
  <div class="home-main">
    <div class="x_box">
      <p class="portrait">
        <span v-if="userAvatar==''">{{userName[0]}}</span>
        <img v-if="userAvatar!=''" :src="userAvatar" alt="" width="50px"/>
      </p>
      <div class="x_content">
        <h3 style="line-height: 50px;height:50px;overflow: hidden; margin-top: 10px;">hello，{{userName}}，祝你开心每一天！</h3>
        <div class="bottom clearfix">
          <span>部门：</span>
          <span v-for="(item, index) in department" :key="index">
            <span v-for="(val,index) in item" :key="index">
              {{val.name}}
            </span>
            <span>；</span>
          </span>
        </div>
      </div>
      <div class="all_status">
        <p>待审批报告</p>
        <p class="num_status" @click="workStatus">{{ new_work_approve_num}}</p>
      </div>
      <div class="all_status">
        <p>待审批订单</p>
        <p class="num_status" @click="orderStatus">{{ new_order_approve_num}}</p>
      </div>
      <span v-if="sale_button">
        <div class="all_status">
          <p>待跟进咨询</p>
          <p class="num_status" @click="saleStatus">{{ sale_num}}</p>
        </div>
        <div class="all_status">
          <p>待分单咨询</p>
          <p class="num_status" @click="salesStatus">{{ manage_num }}</p>
        </div>
      </span>
      <span v-if="four_button">
        <div class="all_status">
            <p>待处理咨询</p>
            <p class="num_status" @click="inquiryStatus">{{ new_consult_num}}</p>
        </div>
        <div class="all_status">
            <p>待领取留言</p>
            <p class="num_status" @click="messageStatus">{{ new_leave_num}}</p>
        </div>
      </span>
    </div>
    <el-select v-model="value" placeholder="筛选" class="screen" @change="stageChange"  v-if="is_show">
      <el-option
        v-for="item in allDate"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <div class="newAdd" v-if="is_show">
      <router-link :to="{ name: 'clientList',params:{time:this.time}}" class="Modular">
        <img src="../../images/icon_client.png" alt="" class="home_img">
        <p>{{new_client_num}}</p>
        <i class="symbol"></i>
        <span>新增客户数</span>
      </router-link>
      <router-link :to="{ name: 'itemList',params:{time:this.time}}" class="Modular Modular_item">
        <img  src="../../images/icon_item.png" alt="" class="home_img">
        <p>{{new_project_num}}</p>
        <i class="symbol" style="background:#fc5a57;"></i>
        <span>新增项目数</span>
      </router-link>
      <router-link :to="{ name: 'orderList',params:{time:this.time}}" class="Modular Modular_order">
        <img src="../../images/icon_order.png" alt="" class="home_img">
        <p>{{new_order_num}}</p>
        <i class="symbol" style="background:#21a9ff;"></i>
        <span>新增订单数</span>
      </router-link>
      <router-link :to="{ name: 'salesDay',params:{time:this.time}}" class="Modular Modular_follow">
        <img src="../../images/icon_follow.png" alt="" class="home_img">
        <p> {{new_follow_num}}</p>
        <i class="symbol" style="background: #fe6f37"></i>
        <span>新增跟进数</span>
      </router-link>
    </div>
    <homeList :form="form"></homeList>
    <div class="noticeList">
      <div class="notice_header">
        <span>系统公告</span>
      </div>
      <div class="list_notice">
        <div>
          <span class="x_title">
              <span class="x_icon"></span>
              公告标题
          </span>
          <div class="notice_text"
               v-for="(item,index) in  noticeList"
               :index="index"
               :key="item.id"
               v-if="index < 3">
            {{item.content}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import homeList from '.././components/home/homeList.vue'
  import Cookies from 'js-cookie';
  export default {
    name: 'home',
    components: {
      homeList
    },
    data() {
      return {
        allDate: [{
          value: '1',
          label: '本日'
        }, {
          value: '2',
          label: '本周'
        }, {
          value: '3',
          label: '本月'
        }],
        value:'2',
        department: [],
        userName:"",
        noticeList:'',
        new_client_num:'',
        new_order_num:'',
        new_project_num:'',
        new_follow_num:'',
        new_work_approve_num:'',
        new_order_approve_num:'',
        four_button:'',
        new_leave_num:'',
        new_consult_num:'',
        sale_button:'',
        time:[],
        userAvatar:(Cookies.get('avatar') ? Cookies.get('avatar') : ''),
        is_show:'',
        form:{
          taskCount: '',
          taskList: [],
          orderList: [],
          orderCount: '',
        },
      }
    },
    methods: {
      workStatus(){
        this.$router.push({name:'reportList',params:{approval:'not'}})
      },
      orderStatus(){
        this.$router.push({name:'orderList',params:{range:'my_approve'}})
      },
      messageStatus(){
        this.$router.push({name:'messageList'})
      },
      inquiryStatus(){
        this.$router.push({name:'inquiryList'})
      },
      salesStatus(){
        this.$router.push({name:'consultList'})
      },
      saleStatus(){
        this.$router.push({name:'folowUpList'})
      },
      admin_own(){
        this.department = JSON.parse(Cookies.get('department'));
        this.userName = Cookies.get('user');
      },
      stageChange(){
        this.$get('message/system',{time_range:this.value})
          .then((data) => {
            if(data.code){
              this.is_show = data.content.is_show;
              this.form.taskList = data.content.task_list;
              this.form.taskCount = data.content.task_count;
              this.noticeList = data.content.system_list;
              this.new_work_approve_num = data.content.new_work_approve_num;
              this.new_order_approve_num = data.content.new_order_approve_num;
              this.time = data.content.time.create_time;
              this.new_client_num = data.content.new_client_num;
              this.new_order_num = data.content.new_order_num;
              this.new_project_num = data.content.new_project_num;
              this.new_follow_num = data.content.new_follow_num;
              this.four_button = data.content.service_button; // 带领去留言
              this.new_leave_num = data.content.new_leave_num; //待领取留言数量
              this.new_consult_num = data.content.new_consult_num; //待处理留言显示
              this.sale_button = data.content.sale_button; // 销售显示
              this.manage_num = data.content.manage_num; // 待跟进咨询
              this.sale_num = data.content.sale_num;  // 待跟进咨询
            }
          })
          .catch(() => {});
      },
      workOrder() {
        this.$get('manageNew/manageList',{range :"pending"})
          .then((data) => {
            if(data.code) {
              this.form.orderList = data.content.data;
              this.form.orderCount = data.content.count;
            }
          })
          .catch((data) => {
            this.$message.error(data.errorMsg);
          });
      }
    },
    created() {
      this.admin_own();
      this.workOrder();
      this.stageChange();
    },
  }
</script>
<style scoped>
  .home-main{
    height: 893px;
    background: #fff !important;
    box-sizing: border-box;
    padding: 0 20px;
  }
  .screen{
    float:right;
    margin-bottom: 20px;
    width: 110px;
  }
  .newAdd{
    float: left;
    width:100%;
    height: 150px;
    box-sizing: border-box;
  }
  .Modular{
    float: left;
    width:22.5%;
    height:120px;
    margin-right:calc( 10% / 3);
    background: #fff;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(67,128,255,.1);
    position: relative;
  }
  .Modular:nth-child(4){
    margin-right: 0;
  }
  .Modular:hover{
    background:#fdfbed;
    box-shadow: 0 2px 12px 0 #fdfbed;
  }
  .Modular_item:hover{
    background:#fff6ff;
    box-shadow: 0 2px 12px 0 #fff6ff;
  }
  .Modular_order:hover{
    background: #f2f7ff;
    box-shadow: 0 2px 12px 0 #f2f7ff;
  }
  .Modular_follow:hover{
    background: #fff4f5;
    box-shadow: 0 2px 12px 0  #fff4f5;
  }
  .symbol{
    width:5px;
    height: 5px;
    border-radius: 50%;
    background: #ffda10;
    position: absolute;
    left: 40%;
    top:37%;
  }
  .Modular p{
    height: 50px;
    line-height: 50px;
    margin-top: 20px;
    font-size: 36px;
    color:#000000;
    font-weight: bold;
    box-sizing: border-box;
    padding-left: 44%;
  }
  .Modular span{
    display: block;
    width: 100%;
    line-height: 20px;
    font-size: 14px;
    color:#a1a1a1;
    text-align: center;
  }
  .home_img{
    width: 76px;
    height:76px;
    position: absolute;
    top: 10px;
    left: 10px;
  }
  .x_box{
    width:100%;
    height: 85px;
  }
  .portrait{
    width: 50px;
    height: 50px;
    float: left;
    background-color: #4380ff;
    border-radius: 50%;
    margin-top: 25px;
    line-height: 50px;
    text-align: center;
    font-size: 16px;
    color:#fff;
    margin-left: 5px;
  }
  .portrait img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .portrait span {
    font-size: 14px;
  }
  .x_content{
    float:left;
    width: 300px;
    margin-left: 15px;
    height: 85px;
  }
  .noticeList {
    height: 224px;
    width: 100%;
    float: left;
    margin-top: 30px;
    margin-bottom: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(67,128,255,.1);
  }
  .notice_header{
    float: left;
    height: 225px;
    width:55px;
    background: #a1aab3;
    border-top-left-radius: 5px;
    border-bottom-left-radius:5px;
  }
  .notice_header span{
    display: block;
    padding:50px 20px;
    width: 30px;
    font-size: 18px;
    color:#fff;
    font-weight:600;
  }
  .list_notice{
    float: right;
    width: calc(100% - 55px);
  }
  .list_notice>div{
    width: 100%;
    height: 112px;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    padding-left: 20px;
  }
  .notice_text{
    box-sizing: border-box;
    padding-left: 32px;
  }
  .x_icon{
    display: inline-block;
    margin-right: 15px;
    margin-top: 5px;
    background:url("../.././images/xicon.png");
    background-size:100%;
    width: 17px;
    height: 24px;
  }
  .x_title{
    font-size: 14px;
    color: #000;
    line-height: 60px;
  }
  .all_status{
    float: right;
    margin: 25px 50px 5px 0px;
  }
  .all_status p{
    text-align: center;

  }
  .num_status {
    font-size: 24px;
    color:#000000;
    font-weight: bold;
  }
  .num_status:hover{
    cursor: pointer;
  }
  .dept {
    display: inline-block;
  }
</style>
