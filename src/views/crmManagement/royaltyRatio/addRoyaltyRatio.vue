<!--新建项目组件-->
<template>
  <div class="hblock_itemAdd">
    <el-card>
      <!-- <div class="s_new_title">CRM/新增业绩分成</div> -->
      <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm">
        <el-form-item label="关联订单" prop="companyName" class='is-required'
        >
          <el-input class="s_additem_btn2" @focus.prevent="dialogFollow" v-model="ruleForm.companyName" placeholder="请选择"></el-input>
        </el-form-item>
 
      <div v-for="(domain,index) in ruleForm.param"  :key="domain.key">
        <el-form-item :label="'提成人员'+ (index+1)" :prop="'param.' + index + '.dis_dd_id'" 
          class='is-required royaltyBiliFather12'
          :rules="[{ required: true, message: '请选择提成人员',trigger:'blur'}]"
          >
            <el-select v-model="domain.dis_dd_id" clearable filterable placeholder="请选择">
                <el-option
                        v-for="item in person"
                        :key="item.dd_id"
                        :label="item.nickname"
                        :value="item.dd_id">
                </el-option>
            </el-select>
          </el-form-item>

          <el-form-item  label="提成占比" class='is-required royaltyBili'
          :prop="'param.' + index + '.rate'" onpaste="alert('请手动输入价格');return false;"
          :rules="[{ required: true, message: '请填写提成占比',trigger:'blur'}]"
          >
            <input type="number"  @keydown="handleInput2" class="s_additem_btn s_client_widthInput" v-model="domain.rate" placeholder="%">
            <!-- <el-input-number v-model="domain.rate" @change="handleInput2"></el-input-number> -->
          </el-form-item>
          <el-button class='deleteBtn' type="text" @click.prevent="removeDomain(domain)" v-show = 'ruleForm.param.length != 1'>删除</el-button>
          <div style='clear:both'></div>
      </div>
        <el-form-item>
          <el-button @click="addDomain">增加</el-button>
        </el-form-item>
  
        <el-form-item style="margin-left: 30px;">
          <el-button type="primary" @click="onSubmit('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>

      <el-dialog :title="flowTitle" :visible.sync="ProcessVisible" :modal="false" width="950px">
        <el-form ref="formAdd" :model="formAdd" class='formSearchpeople'>
          <el-input v-model="formAdd.orderName" placeholder="订单编号" class="addInput"></el-input>
          <el-input v-model="formAdd.client" placeholder="客户名称" class="addInput"></el-input>

          <el-form-item prop="trench" class="addInput">
            <el-cascader
                class="s_order_search"
                clearable
                filterable
                 placeholder="渠道"
                change-on-select
                expand-trigger="hover"
                :show-all-levels="false"
                :options="trench"
                v-model="formAdd.trench">
            </el-cascader>
          </el-form-item>

          <!-- <el-input v-model="formAdd.code" placeholder="渠道" class="addInput"></el-input> -->
          <el-button type="primary" @click="dialogFollow('formAdd')">搜索                         </el-button>
        </el-form>
        <el-table :data="tableData" style="width: 100%;padding-top: 30px;" @row-click="handleClick" class='tableHover'>
          <el-table-column prop="order_code" label="订单编号" width="120px"></el-table-column>
          <el-table-column prop="name" label="订单名称"> </el-table-column>
          <el-table-column prop="client_name" label="客户名称"></el-table-column>
          <el-table-column prop="product_name" label="产品信息"></el-table-column>
          <el-table-column prop="trench" label="渠道"></el-table-column>
          <el-table-column prop="salesman" label="销售人员" width="80px"></el-table-column>
          <el-table-column prop="partner" label="共同负责人"></el-table-column>
          <el-table-column prop="price" label="订单金额(元)"></el-table-column>
          <el-table-column prop="approve_status" label="执行状态"></el-table-column>
          <el-table-column prop="success_time" label="成单日期"></el-table-column>
          <el-table-column prop="customerDrive" label="操作" width="80px">
            <template slot-scope="scope">
              <el-button type="text" size="small">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="formAdd.currentPage"
          :page-size="5"
          layout="sizes, prev, pager, next"
          :total="count">
          <!-- :page-sizes="[5,10,15,20]" -->
        </el-pagination>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import upload from '../.././components/s_customer/fiieDataCe';
  import Util from '@/libs/util';
  export default {
    components:{ upload },
    name:'addItem',
    data() {
      return {
        clickNum:1,
        rate:[],
        ruleForm:{
          companyName:'',
          order_id: '',
          rate:[],
          dis_dd_id: [],     // 产品
          param: [{
            dis_dd_id:'',
            rate:''
          }]
        },
//        弹窗搜索
        formAdd:{
          company:"",
          client:'',
          code:"",
          pageSize: 10,
          currentPage: 1,
          trench:[],
          orderName:''
        },
          trench2:[],
//        弹窗表格
        tableData:[],
//        弹窗分页
        count: 0,
        formSearch: {
          pageSize: 10,
          currentPage: 1,
        },
        selectCustomers: [],
        dis_dd_id: [],
        itemState: [],
        order_id: [],
        product: [],
        shop: [],
        success: false,
        is_client:true,
        ProcessVisible:false,
        flowTitle:"订单搜索"
      };
    },
    methods: {
 
//      选择
      handleClick(row) {
        this.ruleForm.companyName = row.order_code;
        this.ruleForm.order_id = row.id;
        this.ruleForm.sn_no = row.sn_no;
        this.ProcessVisible = false;
      },
      handleInput2(e) {
      // 通过正则过滤小数点后两位
        e.target.value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || null
      },
//      关联订单弹出弹窗
      dialogFollow(formAdd){
        this.formAdd.currentPage = 1;
        this.ProcessVisible = true;
        this.$get("crmManagement/order/index",this.formAdd)
          .then((data)=>{
            this.trench2 = data.content.trench;
            this.tableData = data.content.orderList;
            this.count = data.content.count;
          })
          .catch(()=>{})
      },
      dialogFollow1(){
        this.$get("crmManagement/order/index",this.formAdd)
          .then((data)=>{
            this.tableData = data.content.orderList;
            this.count = data.content.count;
          })
          .catch(()=>{})
      },
      //分页
      handleSizeChange(val) {
        this.formSearch.pageSize = val;
        this.dialogFollow1();
      },
      handleCurrentChange(val) {
        this.formAdd.currentPage = val;
        this.dialogFollow1();
      },
   
      removeDomain(item) {
        let index = this.ruleForm.param.indexOf(item);
        if (index !== 0) {
          this.ruleForm.param.splice(index, 1);
          this.ruleForm.dis_dd_id.splice(index, 1);
        }
      },
      addDomain() {
        this.ruleForm.param.push({
          dis_dd_id:'',
          rate:'',
          key: Date.now(),
        });
      },
   
      handleChangeproduct(value) {
        this.ruleForm.dis_dd_id.push(value);
        // if(value[value.length-1]){
        //   this.ruleForm.dis_dd_id.push(value[value.length-1]);
        // } else {
        //   this.ruleForm.dis_dd_id.splice(0,1);
        // }
      },
     
      sumArr(arr){
        return eval(arr.join("+"));
      },

      onSubmit (ruleForm) {
            if (!this.ruleForm.order_id){
          this.$message({
            message: '请选择关联订单',
            type: 'warning'
          });
        }else{
            this.$refs[ruleForm].validate((valid) => {
                      if (valid) {
                        this.$post( 'orderRoyalty/addRoyalty',this.ruleForm)
                            .then( (data) => {
                              if(data.code){
                                this.$message({
                                  message: '新增提成比例成功！',
                                  type: 'success'
                                });
                                this.$store.commit('removeTag','addItem');
                                this.$store.commit('closePage','addItem');
                                this.ruleForm = {};
                                this.success = true;
                                this.ruleForm.dis_dd_id = [];
                                this.ruleForm.param = [{dis_dd_id:'',rate:''}];
                                this.$router.push({name: 'royaltyDetail',params:{id:data.content}})
                              } else {
                                this.$message.error(data.errorMsg);
                              }
                            })
                            .catch(() => {
                              this.$message.error('服务器错误，请稍后重试');
                            })
                          }
                        })
        }
         
        
        // this.sumArr(this.rate);
        // if (!this.ruleForm.order_id){
        //   this.$message({
        //     message: '请选择关联订单',
        //     type: 'warning'
        //   });
        // }  else if (this.ruleForm.param.length == 0) {
        //   this.$message({
        //     message: '请选择提成人员',
        //     type: 'warning'
        //   });
        // }else if (!this.ruleForm.rate.length) {
        //   this.$message({
        //     message: '请填写提成比例',
        //     type: 'warning'
        //   });
        // }else if (this.sumArr(this.ruleForm.rate) != 100) {
        //   this.$message({
        //     message: '提成比例之和必须为100',
        //     type: 'warning'
        //   });
        // } else{
         
        // }
      },
      resetForm(ruleForm) {
        this.$refs[ruleForm].resetFields();
        this.ruleForm.order_id = ''
      },
      //选项 产品列表
      addItem() {
        this.$get( 'crmManagement/item/addItem')
          .then((data) => {
            this.selectCustomers = data.content.client;
            this.product = data.content.product;
            this.shop = data.content.shop;
          })
          .catch((data) => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
    
      fetchData() {
        this.ruleForm.order_id = this.$route.params.id ? this.$route.params.id : '';  
        this.companyName = this.$route.params.company?this.$route.params.company:'';
        // var  s_additem_btn = document.getElementsByClassName('s_additem_btn')[0]
        // s_additem_btn.style.placeholder = '123';
      },
    },
    watch: {
      '$route': 'fetchData'
    },
    created (){
      this.addItem();
      this.fetchData();
    },
    computed: {
            person () {
                return this.$store.state.app.commonPerson;
            },
            trench() {
              return Util.obj2Arr(this.trench2)
            }
        }
  }
</script>
<style scoped>
.s_additem_btn2{
  width: 80%;
}
.demo-ruleForm{
  padding:5% 20% ;
  /* margin: auto; */
}
  .s_additem_btn{
    width: 100%;
    /*border: 1px solid #dcdfe6;*/
    color: #495060;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    outline: 0;
    font-size: 14px;
    font-weight: normal;
    text-align: left;
    /*padding: 0 15px;*/
    border-radius: 4px;
    background-color: #eef2f9;
  }
  .addInput{
    width: 25%;
    float: left;
    margin: 0 2%;
  }
  .s_new_title {
    width: 100%;
    height: 50px;
    font-size: 19px;
    float: left;
    text-align: left;
    font-weight: 700;
  }
  .formSearchpeople .addInput:nth-child(0){
    margin-left: 0px;
  }
  .tableHover:hover{
    cursor: pointer;
  }
  .royaltyBiliFather12{
    float:left;
    width: 42%;
  }
   .royaltyBili{
    float:left;
    width: 41%;
  }
  .deleteBtn{
    float:left;
    padding-left:2%; 
  }
  .s_client_widthInput{
      border-radius: 5px;
      background: #eef2f9;
      padding-left: 16px;
      border: 1px solid #dcdfe6; 
    }
</style>
