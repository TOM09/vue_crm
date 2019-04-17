<template>
  <div class="haddOrder">
    <el-card>
      <div class="s_new_title">订单信息</div>
      <el-form :model="ruleForm" ref="ruleForm" label-position="right" label-width="180px">
        <el-form-item class="" label="关联项目(必填)" prop="project_id">
          <el-select v-model="ruleForm.project_id" @change="orderChange" filterable placeholder="请选择" class="s_client_width">
            <el-option
                v-for="item in project"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="成单日期(必填)" prop="success_time">-->
        <!--<el-date-picker-->
        <!--class="s_client_width"-->
        <!--v-model="ruleForm.success_time"-->
        <!--type="date"-->
        <!--placeholder="选择日期"-->
        <!--format="yyyy 年 MM 月 dd 日"-->
        <!--value-format="yyyy-MM-dd"-->
        <!--style="width: 300px"-->
        <!--&gt;-->
        <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <el-form-item label="订单渠道(必填)" prop="trench">
          <el-cascader
            class="s_client_width"
            clearable
            filterable
            expand-trigger="hover"
            :options="trench"
            v-model="ruleForm.trench">
          </el-cascader>
        </el-form-item>
        <el-form-item label="订单编号" prop="third_order_code">
           <!-- v-if="!(ruleForm.trench == 4)" -->
          <el-input v-model="ruleForm.third_order_code" placeholder="请输入猪八戒等外部来源订单编号" class="s_client_width"></el-input>
        </el-form-item>
        <el-form-item label="订单名称(必填)" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入名称" class="s_client_width"></el-input>
        </el-form-item>
        <el-form-item prop="contract_time" label="合同日期">
          <el-date-picker
            class="s_client_width2"
            v-model="ruleForm.contract_time"
            unlink-panels
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy - MM - dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            style="width: 300px">
          </el-date-picker>
        </el-form-item>
          
        <div style="clear: both"></div>
        <el-form-item label="产品信息" prop="pro_info">
          <el-button type="primary" round @click="orderBtn" plain size="small" style="margin-left: 10px">增加产品(必填)</el-button>
          <el-table :data="ruleForm.pro_info" style="width: 80%;" max-height="650">
            <el-table-column fixed prop="product_id.name" label="产品信息"></el-table-column>
            <el-table-column fixed prop="pro_period" label="周期（工作日）"></el-table-column>
            <el-table-column fixed prop="pro_std_price" label="标准价格（元）"></el-table-column>
            <el-table-column fixed prop="pro_contract_price" label="合同价格（元）"></el-table-column>
            <el-table-column fixed prop="pro_brife" label="备注"></el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
              <template slot-scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index, ruleForm.pro_info,scope.row.pro_contract_price)" type="text" size="small">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="订单金额" prop="price">
          <el-input disabled  v-model="ruleForm.price" placeholder="订单金额为合同累加金额" class="s_client_width"></el-input>
        </el-form-item>
        <el-form-item label="是否开票" prop="invoice">
          <el-switch v-model="ruleForm.invoice"></el-switch>
        </el-form-item>
        <el-form-item label="发票类型" prop="invoice_type" v-if="ruleForm.invoice">
          <el-select v-model="ruleForm.invoice_type" placeholder="请选择" class="s_client_width">
            <el-option
              v-for="item in invoice_type"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发票抬头" prop="invoice_title" v-if="ruleForm.invoice">
          <el-input v-model="ruleForm.invoice_title" class="s_client_width"></el-input>
        </el-form-item>
        <el-form-item label="纳税人识别号" prop="tax_number" v-if="ruleForm.invoice">
          <el-input v-model="ruleForm.tax_number" class="s_client_width"></el-input>
        </el-form-item>
        <el-form-item prop="location" label="公司地址" v-if="ruleForm.invoice_type == 2 && ruleForm.invoice">
          <el-select v-model="ruleForm.info.province" placeholder="请选择省" class="s_client_width">
            <el-option
              v-for="item in province"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-input v-model="ruleForm.info.address" autosize placeholder="请输入详细地址" style="width:500px; margin-left: 30px;">
          </el-input>
        </el-form-item>
        <el-form-item label="公司电话" prop="info.phone" v-if="ruleForm.invoice_type == 2 && ruleForm.invoice">
          <el-input v-model="ruleForm.info.phone" class="s_client_width">
          </el-input>
        </el-form-item>
        <el-form-item label="银行名称" prop="info.bank_name" v-if="ruleForm.invoice_type == 2 && ruleForm.invoice">
          <el-input v-model="ruleForm.info.bank_name" class="s_client_width">
          </el-input>
        </el-form-item>
        <el-form-item label="银行账号" prop="info.bank_number" v-if="ruleForm.invoice_type == 2 && ruleForm.invoice">
          <el-input v-model="ruleForm.info.bank_number" class="s_client_width">
          </el-input>
        </el-form-item>
        <!-- 原版
            <el-form-item :label="item.condition_name" prop="condition">
            <el-switch :active-value="item.id" :inactive-value="false"  v-model="ruleForm.condition[item.id]"></el-switch>
          </el-form-item> -->

        <!-- <div class="approvalN" v-for="(item,index) in condition" :key="index">
          <el-form-item :label="item.condition_name" prop="condition">
             <el-select prop="condition" v-model="conditionData[item.id]" class="is-required">
                <el-option label="是" value='true'></el-option>
                <el-option label="否" value='false'></el-option>
            </el-select> 
          </el-form-item>
        </div> -->
        
        <div class='selectSix'>
           <el-form-item label="是否需要三方" prop="condition" class='selectSixChild is-required'>
              <el-select prop="condition" v-model="conditionData[2]">
                <el-option label="是" value='true'></el-option>
                <el-option label="否" value='false'></el-option>
            </el-select> 
          </el-form-item>

         <el-form-item label="是否印刷(必填)" prop="printing" class='selectSixChild is-required'>
          <!-- <el-switch v-model="ruleForm.printing"></el-switch> -->
          <el-select v-model="ruleForm.printing">
              <el-option label="是" value='true'></el-option>
              <el-option label="否" value='false'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否拍摄(必填)" prop="photo"  class='selectSixChild is-required'>
          <el-select v-model="ruleForm.photo">
              <el-option label="是" value='true'></el-option>
              <el-option label="否" value='false'></el-option>
          </el-select>
          <!-- <el-switch v-model="ruleForm.photo"></el-switch> -->
        </el-form-item>

         <el-form-item label="未付款先执行" prop="condition" class='selectSixChild is-required'>
            <el-select prop="condition" v-model="conditionData[4]">
              <el-option label="是" value='true'></el-option>
              <el-option label="否" value='false'></el-option>
          </el-select> 
        </el-form-item>

        <el-form-item label="特殊折扣" prop="condition" class='selectSixChild'>
            <el-select prop="condition" v-model="conditionData[1]">
              <el-option label="是" value='true'></el-option>
              <el-option label="否" value='false'></el-option>
          </el-select> 
        </el-form-item>
       
        <el-form-item label="服务项是否有修改" prop="condition" class='selectSixChild'>
            <el-select prop="condition" v-model="conditionData[3]">
              <el-option label="是" value='true'></el-option>
              <el-option label="否" value='false'></el-option>
          </el-select> 
        </el-form-item>
       
      </div>

        <div style="clear: both"></div>
        <el-form-item label="审批通过后自动申请执行" prop="auto_manage">
          <el-switch v-model="ruleForm.auto_manage" active-value="1" inactive-value="2"></el-switch>
        </el-form-item>
        <div style="clear:both;"></div>
        <el-form-item label="附件">
          <upload @fileStatus="fileStatus"  @fileTrue="fileTrue" :success="success"></upload>
        </el-form-item>
        <el-form-item label="备注" prop="detail">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model="ruleForm.detail"
            class="s_client_width">
          </el-input>
        </el-form-item>
        <el-form-item style="margin-left: 30%">
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button @click="approvalForm('ruleForm')">提交审批</el-button>
        </el-form-item>
      </el-form>
      <el-dialog title="产品信息" :visible.sync="orderList" :modal="false">
        <span>
          <el-form ref="order" :model="order" label-width="150px">
            <el-form-item label="产品信息(必填)">
              <el-cascader
                expand-trigger="hover"
                filterable
                :options="product"
                v-model="product_id"
                @change="handleChange"
                class="s_client_width">
              </el-cascader>
            </el-form-item>
            <el-form-item label="周期（工作日）">
              <el-input v-model="order.pro_period" type="number" class="s_client_width" placeholder="请输入">
              </el-input>
            </el-form-item>
            <el-form-item label="标准价格（元）">
              <input  @keydown="handleInput2"  onpaste="alert('请手动输入价格');return false;"  v-model="order.pro_std_price" type="number" class="s_client_width s_client_widthInput" placeholder="请输入价格">
            </el-form-item>
            <el-form-item label="合同价格（元）(必填)" onpaste="alert('请手动输入价格');return false;" >
              <!-- <el-input @keydown="handleInput2" v-model="order.pro_contract_price" type="number" class="s_client_width" placeholder="请输入价格">
              </el-input> -->
                <input @keydown="handleInput2" v-model="order.pro_contract_price" type="number" class="s_client_width s_client_widthInput" placeholder="请输入价格">
            </el-form-item>
            <el-form-item label="产品备注">
              <el-input type="textarea" :rows="3" v-model="order.pro_brife" class="s_client_width" placeholder="请输入备注">
              </el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="orderList = false">取 消</el-button>
          <el-button type="primary" @click="orderListTrue">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
  import upload from '../.././components/s_customer/fiieDataCe';
  import Util from '@/libs/util';

  export default {
    components:{ upload },
    data () {
      return {
        pushpriceArray:[],
        order: {},
        success:false,
         conditionData:[
            '','false','','false',''
          ],
        ruleForm: {
          btn:1,
          task_type:[],
          condition:[
            // '','false','','false',''
          ],
          auto_manage: 2, //审批通过后申请执行
          project_id: '',
          // success_time: '',
          trench: [],
          name: '',
          printing: '',
          contract_time: [],
          third_order_code: '',
          pro_info: [],
          invoice: false,
          invoice_type: '',
          invoice_title: '',
          tax_number: '',
          info: [],
          detail: '',
          price: '',
          file: [],
          photo: '',
        },
        condition:[], //新增订单的条件数组
        project: [],
        trench: [],
        product: [],
        product_id: [],
        orderList: false,
        invoice_type: [],
        province: [],
        fileList: [],
        numberShiYan: 0,
        fileData: false,
        shop: [],
        // 筛选条件的日期选择器
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
      }
    },
    methods: {
     accAdd(arg1, arg2) {
        if (isNaN(arg1)) {
            arg1 = 0;
        }
        if (isNaN(arg2)) {
            arg2 = 0;
        }
        arg1 = Number(arg1);
        arg2 = Number(arg2);
        var r1, r2, m, c;
        try {
            r1 = arg1.toString().split(".")[1].length;
        }
        catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        }
        catch (e) {
            r2 = 0;
        }
        c = Math.abs(r1 - r2);
        m = Math.pow(10, Math.max(r1, r2));
        if (c > 0) {
            var cm = Math.pow(10, c);
            if (r1 > r2) {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", "")) * cm;
            } else {
                arg1 = Number(arg1.toString().replace(".", "")) * cm;
                arg2 = Number(arg2.toString().replace(".", ""));
            }
        } else {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", ""));
        }
        return (arg1 + arg2) / m;
    },
            handleInput2(e) {
                // 通过正则过滤小数点后两位
              e.target.value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || null
          },
          //oss
          fileStatus(data) {
            this.ruleForm.file = data;
          },
          orderBtn () {
            this.order = {
              product_id: {},
              pro_period: '',
              pro_std_price: '',
              pro_contract_price: '',
              pro_brife: '',
            }
            this.orderList = true
          },
          handleChange (value) {
            this.numberShiYan = value[1];
          },
          getSum(preValue,curValue,index,array) {
            return preValue += curValue;
            },
          orderListTrue () {
              var pushprice = this.order.pro_contract_price
              // if(pushprice == 0){
                // this.ruleForm.price = parseInt(this.ruleForm.price) + 0;
                // this.ruleForm.price = this.ruleForm.price + 0;
              // }else{
                this.ruleForm.price = this.accAdd(this.ruleForm.price,pushprice);
              // }

              // if(this.ruleForm.price == 0){
              //   this.ruleForm.price ='请输入金额'
              // }
                // this.pushpriceArray.push(pushprice)
                // var s = 0;
                // for (var i=this.pushpriceArray.length-1; i>=0; i--) {
                //     s += this.pushpriceArray[i];
                // }
                // this.ruleForm.price =s.toFixed(2);
                // this.ruleForm.price = s;

            let pro_arr = this.product;
            // for(let i = 0; i < pro_arr.length; i++){
            //   for(let j = 0; j < pro_arr[i]['children'].length; j++){
            //     for(let x = 0; x < pro_arr[i]['children'][j]['children'].length; x++){
            //       if(pro_arr[i]['children'][j]['children'][x]['value'] == this.numberShiYan){
            //         this.order.product_id.name = pro_arr[i]['children'][j]['children'][x]['label'];
            //         this.order.product_id.id = pro_arr[i]['children'][j]['children'][x]['value'];
            //       }
            //     }
            //   }
            // }
            
            for(let i = 0; i < pro_arr.length; i++){
              for(let j = 0; j < pro_arr[i]['children'].length; j++){
                  if(pro_arr[i]['children'][j]['value'] == this.numberShiYan){
                    this.order.product_id.name = pro_arr[i]['children'][j]['label'];
                    this.order.product_id.id = pro_arr[i]['children'][j]['value'];
                }
              }
            }
            if (this.order.product_id.name && this.order.pro_contract_price) {
              this.ruleForm.pro_info.push(this.order);
              this.product_id = [];
              this.orderList = false;
            } else {
              this.$message({
                message: '请选择产品,合同价格',
                type: 'warning'
              })
            }
          },
          deleteRow (index, rows,obj) {
           var objNum = this.accSub(this.ruleForm.price, obj)
            // var objNum = this.ruleForm.price - obj;
            if(objNum == 0 && rows.length == 1){
              this.ruleForm.price = ''
            }else{
              this.ruleForm.price = objNum;
            }
            rows.splice(index, 1);
          },
        accSub(arg1, arg2) {
          if (isNaN(arg1)) {
              arg1 = 0;
          }
          if (isNaN(arg2)) {
              arg2 = 0;
          }
          arg1 = Number(arg1);
          arg2 = Number(arg2);

          var r1, r2, m, n;
          try {
              r1 = arg1.toString().split(".")[1].length;
          }
          catch (e) {
              r1 = 0;
          }
          try {
              r2 = arg2.toString().split(".")[1].length;
          }
          catch (e) {
              r2 = 0;
          }
          m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
          n = (r1 >= r2) ? r1 : r2;
          return ((arg1 * m - arg2 * m) / m).toFixed(n);
        },
      fileTrue(data){
        this.success = data;
      },
      // 创建订单函数（保存）
      submitForm (formName) {
        for (let i = 0; i < this.conditionData.length; i++) {
          if(this.conditionData[i] == 'true'){
            this.ruleForm.condition[i] = i;
          }
        }

        // let reg  =/^[1-9]\d*$|^0$/;   
        let reg = /^(-1|-2|([0-9]+(\.[0-9]{1,2})?))$/;
        this.ruleForm.btn = 1;
        // let conditon = this.ruleForm.condition;
        // for(let i = 0; i < conditon.length; i++) {
        //   if(conditon[i] == false) {
        //     conditon.splice(i,conditon.length);
        //   }
        // }
        // this.ruleForm.condition = conditon;

        if (!this.ruleForm.project_id) {
          this.$message({
            message: '请选择关联项目',
            type: 'warning'
          })
        } else if (!this.ruleForm.trench) {
          this.$message({
            message: '请选择订单渠道',
            type: 'warning'
          })
        }else if ((this.ruleForm.trench[0] == 0 || this.ruleForm.trench[0] == 1 ||this.ruleForm.trench[0] == 7)&&this.ruleForm.third_order_code === '') {
          this.$message({
            message: '订单来源渠道为网络平台，请填写订单编号',
            type: 'warning'
          })
        } else if (!this.ruleForm.name) {
          this.$message({
            message: '请填写订单名称',
            type: 'warning'
          })
        } else if (!this.ruleForm.pro_info) {
          this.$message({
            message: '请选择产品',
            type: 'warning'
          })
        }else if (!this.ruleForm.printing) {
          this.$message({
            message: '请选择是否印刷',
            type: 'warning'
          })
        }else if (!this.ruleForm.photo) {
          this.$message({
            message: '请选择是否拍摄',
            type: 'warning'
          })
        }else if(this.ruleForm.pro_info.length == 0){
          this.$message({
            message: '请选择产品',
            type: 'warning'
          })
        }else if(this.conditionData[2] == ''){
          this.$message({
            message: '必须选择是否需要三方',
            type: 'warning'
          })
        }else if(this.conditionData[4] == ''){
          this.$message({
            message: '必须选择是否未付款先执行',
            type: 'warning'
          })
        } else {
          this.$post('crmManagement/order', this.ruleForm)
            .then((data) => {
              if(data.code == 201){
                this.$router.push({name: 'orderDetail', params: {id: data.content.id}})
                this.$message({
                  message: '保存成功！',
                  type: 'success'
                });
                
                this.success = true;
                this.$refs[formName].resetFields();
              }else {
                this.$message.error(data.errorMsg);
              }
            })
            .catch(() => {
              this.$message.error('服务器出错，请稍后重试')
            })
        }
                //  this.ruleForm.condition = ['','false','','false',''];
      },
      //审批
      approvalForm (formName) {
        this.ruleForm.btn = 2;
        // let conditon = this.ruleForm.condition;
        for (let i = 0; i < this.conditionData.length; i++) {
          if(this.conditionData[i] == 'true'){
            this.ruleForm.condition[i] = i;
          }
        }
        // for(let i = 0; i < conditon.length; i++) {
        //   if(conditon[i] == false) {
        //     conditon.splice(i,conditon.length);
        //   }
        // }
        // this.ruleForm.condition = conditon;
        if (!this.ruleForm.project_id) {
          this.$message({
            message: '请选择关联项目',
            type: 'warning'
          })
        } else if (!this.ruleForm.trench) {
          this.$message({
            message: '请选择订单渠道',
            type: 'warning'
          })
        }  else if ((this.ruleForm.trench[0] == 0 || this.ruleForm.trench[0] == 1 ||this.ruleForm.trench[0] == 7)&&this.ruleForm.third_order_code === '') {
          this.$message({
            message: '订单来源渠道为网络平台，请填写订单编号',
            type: 'warning'
          })
        } else if (!this.ruleForm.name) {
          this.$message({
            message: '请填写订单名称',
            type: 'warning'
          })
        } else if (!this.ruleForm.pro_info) {
          this.$message({
            message: '请选择产品',
            type: 'warning'
          })
        } else if (!this.ruleForm.printing) {
          this.$message({
            message: '请选择是否印刷',
            type: 'warning'
          })
        }else if (!this.ruleForm.photo) {
          this.$message({
            message: '请选择是否拍摄',
            type: 'warning'
          })
        } else if(this.ruleForm.pro_info.length == 0){
          this.$message({
            message: '请选择产品',
            type: 'warning'
          })
        } else if(this.conditionData[2] == ''){
          this.$message({
            message: '必须选择是否需要三方',
            type: 'warning'
          })
        }else if(this.conditionData[4] == ''){
          this.$message({
            message: '必须选择是否未付款先执行',
            type: 'warning'
          })
        }else {
          this.$post('crmManagement/order', this.ruleForm)
            .then((data) => {
              if(data.code == 201){
                this.$message({
                  message: '操作成功',
                  type: 'success'
                });
                this.success = true;
                this.$refs[formName].resetFields();
                this.$router.push({name: 'orderDetail', params: {id: data.content.id}})
              }else {
                this.$message.error(data.errorMsg);
              }
            })
            .catch(() => {
              this.$message.error('服务器出错，请稍后重试')
            })
        }
      },
      resetForm (formName) {
        this.$refs[formName].resetFields();
      },
      orderData () {
        this.$get('crmManagement/order/add')
          .then((data) => {
            this.project = data.content.project.reverse();
            let trench = data.content.trench;
            this.condition = data.content.condition;
            this.trench = Util.obj2Arr(trench);
            this.product = data.content.product;
            this.invoice_type = data.content.invoice_type;
            this.province = data.content.province;
            this.shop = data.content.shop;
          })
          .catch(() => {
            this.$message.error('服务器出错，请稍后重试')
          })
      },
      //选择关联项目自动匹配订单渠道
      orderChange(val) {
        this.$get('getProjectTrench/' + val)
          .then((data) => {
            this.ruleForm.trench = data;
          })
      },
      fetchData() {
        this.ruleForm.project_id = this.$route.params.id ? this.$route.params.id : '';
        this.ruleForm.trench = this.$route.params.trench ? this.$route.params.trench : [];
      }
    },
    watch: {
      '$route' : 'fetchData'
    },
    created () {
      this.orderData();
      this.fetchData();
    }
  }
</script>

<style lang="less"  type='scoped'>
  .haddOrder{
    .s_client_width {
      width: 300px;
    }

    .s_client_width2 {
      width: 300px !important;
    }
  
    .s_new_title {
      width: 100%;
      height: 50px;
      font-size: 19px;
      float: left;
      text-align: left;
      font-weight: 700;
    }
    .approvalN{
      float: left;
    }
    .approvalN:nth-child(3n){
      clear: both;
    }
    .s_client_widthInput{
      border-radius: 5px;
      background: #eef2f9;
      padding-left: 16px;
      border: 1px solid #dcdfe6; 
    }

    .s_client_widthInput::-webkit-input-placeholder { /* WebKit browsers */
    color:    #c3c7cf;
    }
    .s_client_widthInput:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color:    #c3c7cf;
    }
    .s_client_widthInput::-moz-placeholder { /* Mozilla Firefox 19+ */
        color:    #c3c7cf;
    }
    .s_client_widthInput:-ms-input-placeholder { /* Internet Explorer 10+ */
        color:    #c3c7cf;
    }
    .selectSix{
      overflow: hidden;
    }
    .selectSixChild{
      width: 33%!important;
      float: left;
    }
  }

</style>
