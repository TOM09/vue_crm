<template>
  <div class="addcost">
    <el-card>
      <div class="s_new_title">费用信息</div>
      <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm">
        <el-form-item label="关联订单(必填)" prop="order_code">
          <el-input v-model="order_code" @focus="popUp" placeholder="请选择"  class="s_additem_form">
          </el-input>
        </el-form-item>
        <el-form-item label="费用项(必填)" prop="cost_type">
          <el-select v-model="ruleForm.cost_type" filterable placeholder="请选择" class="s_additem_form">
            <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额(必填)" prop="cost_price" >
          <el-input v-model="ruleForm.cost_price" placeholder="￥(元)" type="number" class="s_additem_form"></el-input>
        </el-form-item>
        <el-form-item label="费用日期(必填)" prop="cost_time">
          <el-date-picker
              style="width: 300px"
              v-model="ruleForm.cost_time"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="ruleForm.remarks" type="textarea"  :autosize="{ minRows: 3}" placeholder="请输入费用备注信息" class="s_additem_form"></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 30px;margin-bottom: 270px;">
          <el-button type="primary" @click="onSubmit('ruleForm')">确定</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
      <!--订单列表-->
      <el-dialog title="订单列表" :visible.sync="choiceWorder" :append-to-body="true">
        <el-input v-model="form.order_code" clearable placeholder="订单编号" class="x_cost_item"></el-input>

        <el-input v-model="form.company" clearable placeholder="客户名称" class="x_cost_item"></el-input>
        <el-input v-model="form.price" clearable placeholder="订单金额（元）" class="x_cost_item"></el-input>
        <el-date-picker
            v-model="form.create_time"
            unlink-panels
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy - MM - dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions1">
        </el-date-picker>
        <el-button  type="primary" @click="costSearch()" style="display: inline-block;margin-top: 10px;">搜索</el-button>

        <el-table :data="detail" @row-click="rowClick">
          <el-table-column property="order_code" label="订单编号" width="120" align="center"></el-table-column>
          <el-table-column property="client" label="客户名称"></el-table-column>
          <el-table-column property="product" label="产品信息" width="200"></el-table-column>
          <el-table-column property="trench" label="渠道"></el-table-column>
          <el-table-column property="nickname" label="销售人员" align="center"></el-table-column>
          <el-table-column property="price" label="订单金额" align="center"></el-table-column>
          <el-table-column property="time" label="成单日期"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="handleEdit(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="form.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="form.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count" style="text-align:center;margin-top:10px;">
        </el-pagination>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "addExpenses",
    data(){
      return{
        choiceWorder:false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        pickerOptions1: {
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
        detail:[],
        count:0,
        id:'', //费用id
        order_code:'',
        input:'', //搜索
        options: [], // 费用项
        ruleForm:{
          cost_type:'',
          cost_price:'',
          cost_time:'',
          remarks:'',
        },
        form:{
          company:'',
          sale_man:'',
          order_code:'',
          price:'',
          create_time:[],
          pageSize: 0,
          currentPage: 1,
        },

      }
    },
    methods:{
      //弹出订单列表
      popUp(){
        this.choiceWorder = true;
        this.orderList();
      },
      //订单搜索
      costSearch(){
        this.orderList();
        // this.input = '';
      },
      handleSizeChange(val){
        this.form.pageSize = val;
        this.orderList();
      },
      handleCurrentChange(val){
        this.form.currentPage = val;
        this.orderList();
      },
      orderList(){
        this.$get('OrderCost/OrderAll',this.form)
          .then((data) => {
            if(data.code){
              this.detail = data.content.list.data;
              this.options = data.content.cost_type;
              this.count = data.content.count;

            }else{
              this.$message.error(data.msg);
            }
          })
          .catch((error) => {
            this.$message.error('服务器错误，请稍后重试')
          });
      },
      handleEdit(row) {
        this.choiceWorder = false;
        this.ruleForm.order_id = row.id;
        this.order_code = row.order_code;
      },
      rowClick(row){
        this.choiceWorder = false;
        this.ruleForm.order_id = row.id;
        this.order_code = row.order_code;
      },
      //新增费用
      onSubmit (formName) {
        this.$post( 'OrderCost/CostInsert',this.ruleForm)
          .then( (data) => {
            if(data.code){
              this.id = data.content;
              this.$message({
                message: data.errorMsg,
                type: 'success'
              });
              this.order_code = '';
              this.$refs[formName].resetFields();
              this.$router.push({
                name: 'expensesDetail',
                params:{id:this.id}
              })
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
    created(){
      this.orderList();
    }

  }
</script>

<style scoped>
  .s_additem_form {
    width: 300px;
  }
  .s_new_title {
    width: 100%;
    height: 50px;
    font-size: 19px;
    float: left;
    text-align: left;
    font-weight: 700;
  }
  .x_cost_item{
    width: 30%;
    margin-right: 3%;
    float: left;
  }
</style>