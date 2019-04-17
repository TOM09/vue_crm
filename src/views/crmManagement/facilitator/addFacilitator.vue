<!--新建服务商组件-->
<template>
  <div class='addfacilitator111'>
  <el-form class="facilitator" :model="form" ref="form">
    <el-card>
      <div slot="header" class="s_new_title">服务商信息</div>
      <el-form-item prop="name" label="公司名称" style="text-align:left" 
          :rules="[{ required: true, message: '请输入公司名称',trigger:'blur'}]"      
          class="is-required fuwuWidthFat">
          <el-input v-model="form.name" placeholder="请输入公司名称" class='fuwuWidthFatChild'></el-input>
      </el-form-item>

      <el-form-item prop="type" label="类型"  class="is-required fuwuWidthFat"
          :rules="[{ required: true, message: '请选择类型',trigger:'change'}]"            
      >
        <el-select v-model="form.type" clearable placeholder="请选择" class="fuwuWidthFatChild">
          <el-option
            v-for="item in rank"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="city" label="城市"  class="is-required fuwuWidthFat"
          :rules="[{ required: true, message: '请选择城市',trigger:'change'}]"            
      >
        <el-cascader
          class="fuwuWidthFatChild"
          expand-trigger="hover"
          filterable
          clearable
          :options="region"
          v-model="form.city"
          @change="changeSource">
        </el-cascader>
      </el-form-item>

       <el-form-item prop="valid_date" label="合作有效期" class="is-required fuwuWidthFat"
          :rules="[{ required: true, message: '请选择合作有效期',trigger:'change'}]"            
       >
          <el-date-picker
            v-model="form.valid_date"
            style="overflow: hidden;"
            unlink-panels
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy - MM - dd"
            value-format="yyyy-MM-dd"
            class="fuwuWidthFatChild"
            >
          </el-date-picker>
        </el-form-item>

         <el-form-item prop="employment_time" label="从业时间（年）" 
         :rules="[{ required: true, message: '请选择从业时间',trigger:'blur'}]" 
         class="s_order_item fuwuWidthFat">
            <el-input-number class="fuwuWidthFatChild" v-model="form.employment_time" :precision='0' @change="handleChange" @keyup='handleChangefocus' :min="0" label="描述文字"></el-input-number>
         </el-form-item>

       <el-form-item prop="rank" label="服务商级别" class="fuwuWidthFat">
        <el-select v-model="form.rank" clearable placeholder="请选择" class="fuwuWidthFatChild">
          <el-option
            v-for="item in sp_level"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

         <el-form-item label="合作产品"  class="is-required fuwuWidthFat222" prop="pro_info">
          <el-button type="primary" round @click="orderBtn" plain size="small" style="margin-left: 10px">增加产品</el-button>
          <div class='spaceWarp'></div>
          <el-table :data="form.products" border style="width: 50%;">
            <el-table-column fixed prop="product_name" label="产品信息"  width="120"></el-table-column>
            <el-table-column fixed prop="balance_price_text" label="结算标准"></el-table-column>
            <el-table-column fixed prop="price" label="价格"></el-table-column>
            <el-table-column fixed prop="brife" label="产品备注"></el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index, form.products)" type="text" size="small">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item prop="service_region" label="服务区域" class="fuwuquyu">
            <el-input  v-model="form.service_region" class='fuwuWidthFat1'></el-input>
         </el-form-item>

            <el-form-item  prop="remarks" label="公司介绍" class="is-required fuwuquyu">
              <el-input type="textarea" :rows="5" v-model="form.remarks"  class='fuwuWidthFat1' placeholder="请输入设备数量或者生产力/设计或开发团队人数/材质说明（制作类）">
              </el-input>
            </el-form-item>
       </el-card>
      
      <el-card class="Contacts2">
        <div slot="header" class="s_new_title">联系信息</div>
          <div  v-for="(domain,index) in form.contacts" :key="index" >
            <el-form-item class='contacts2Item' :prop="'contacts.' + index + '.user_name'"
              :rules="[{ required: true, message: '请输入名字',trigger:'blur'}]"
            >
                <el-input class='contacts2Iteminput' v-model="domain.user_name" placeholder="请输入名字"></el-input>
            </el-form-item>

            <el-form-item  class='contacts2Item2' :prop="'contacts.' + index + '.contact_type'"
              :rules="[{ required: true, message: '请选择联系方式',trigger:'change'}]"
            >
                <el-select v-model="domain.contact_type" clearable placeholder="联系方式">
                  <el-option
                    v-for="item in contacts_type"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
            </el-form-item>
              
            <el-form-item  class='contacts2Item3' :prop="'contacts.' + index + '.contact_number'"
              :rules="[{ required: true, message: '请输入联系号码',trigger:'blur'}]">
                <el-input  v-model="domain.contact_number" placeholder="请输入联系号码"></el-input>
            </el-form-item>

            <el-button class='deleteBtn' type="text" @click.prevent="removeDomain(domain)" v-show = 'form.contacts.length != 1'>删除</el-button>
          </div>
            <el-button @click="addDomain" class='addMessageNT'>增加</el-button>
      </el-card>

    <el-card class="Contacts">
      <div slot="header" class="s_new_title">资质信息</div>
      <el-button @click="newQualification" plain size="small" class='addBtnzizhi' style="margin-left: 10px">新增资质</el-button>
      <span>企业类型时营业执照和开户许可证必填，企业类型为个人时，银行账号和身份证必填</span>
      <div class='spaceWarp'></div>
      <el-table :data="qualitys" border style="width: 70%;">
            <el-table-column fixed prop="quality_name" label="资质类型"  width="120"></el-table-column>
            <el-table-column fixed label="信息">
              <template slot-scope="scope">
                <div v-html="scope.row.quality_info"></div>
            </template>
            </el-table-column>
            <el-table-column fixed prop="brife" label="备注"></el-table-column>
            <el-table-column fixed prop="file_size" label="大小"></el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index, qualitys)" type="text" size="small">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

      <div class="facilitatorBtn">
        <el-button @click="resetForm('form')">重置</el-button>
        <el-button type="primary" @click="confirm_add('form')">提交</el-button>
      </div>
    </el-card>
  </el-form>

  <el-dialog title="选择产品" :visible.sync="orderList" :modal="false" width="650px">
        <span>
          <el-form ref="order" :model="order" label-width="150px">
            <el-form-item label="产品信息" class='is-required'>
              <el-cascader
                expand-trigger="hover"
                filterable
                v-model='radioText'
                :options="product"
                @change="handleChange"
                class="pricePrepend">
              </el-cascader>
            </el-form-item>

          <div style="margin:20px 0 50px 0"> 
            <el-form-item label="结算价格" class='is-required'>
              <el-radio-group v-model="radio9" size="small">
                <el-radio :label="1" border>固定价格</el-radio>
                <el-radio :label="2" border>分成比例</el-radio>
                <el-radio :label="3" border>询价</el-radio>
              </el-radio-group>
            </el-form-item>

             <el-form-item v-show='radio9 == 1' onpaste="alert('请手动输入价格');return false;">
                <!-- <input type="number"  @keydown="handleInput2" class="s_additem_btn s_client_widthInput" v-model="form.products.balance_price" placeholder="请输入"> -->
                <el-input v-model="order.price" type="number" class='pricePrepend' @keyup="this.value=this.value.replace(/\D/g,'')" @afterpaste="this.value=this.value.replace(/\D/g,'')">
                  <template slot="prepend">￥</template>
                </el-input>
              </el-form-item>

             <el-form-item v-show='radio9 == 2' onpaste="alert('请手动输入价格');return false;">
                <el-select v-model="order.price_type" placeholder="请选择"  class='priceAppend1'>
                  <el-option
                    v-for="item in price_type"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>

                <el-input placeholder="请输入" v-model="order.price" class='priceAppend' type="number" @keyup="this.value=this.value.replace(/\D/g,'')" @afterpaste="this.value=this.value.replace(/\D/g,'')">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
          </div>
            
            <el-form-item label="产品备注">
              <el-input type="textarea" :rows="5" v-model="order.brife" class="pricePrepend" placeholder="请输入备注">
              </el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="orderListTrue">确 定</el-button>
          <el-button @click="orderList = false">取 消</el-button>
        </span>
      </el-dialog>

  <!-- 新增资质窗口 -->
      <el-dialog :visible.sync="qualificationWindow" :modal="false" width="650px">
        <el-form :model="qualification" ref="qualification" label-width="150px">
          <el-form-item label='资质类型'  class="is-required">
            <el-select v-model="qualification.quality_type" placeholder="请选择" class='zizhileixingbtn'>
              <el-option
                v-for="item in qualityArr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <div v-if='qualification.quality_type == 1||qualification.quality_type == 2'>

            <el-form-item label='编号' prop="quality_code"  class="is-required" v-if='qualification.quality_type == 1'
            >
              <el-input v-model="qualification.quality_code" class='zizhileixingbtn' placeholder="请输入编号"></el-input>
            </el-form-item>

            <el-form-item label='编号' prop="quality_code"  class="is-required" v-if='qualification.quality_type == 2'
            >
              <el-input v-model="qualification.quality_code" class='zizhileixingbtn' placeholder="请输入身份证号"></el-input>
            </el-form-item>

              <el-form-item label='有效期' class="is-required"  prop="valid_time" 
              >
                <el-date-picker
                 class='zizhileixingbtn'
                  :disabled='timedisabled'
                  type="daterange"
                  v-model="qualification.valid_time"
                  range-separator="~"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  format="yyyy - MM - dd"
                  value-format="yyyy-MM-dd"
                  >
                </el-date-picker>
                <el-checkbox @change='longTime' v-model='checkchange'>长期</el-checkbox>
            </el-form-item>
          </div>
           
          <div v-else-if='qualification.quality_type == 3||qualification.quality_type == 4'>
            <el-form-item label='开户行' class="is-required" prop="deposit_bank"
            >
                <el-input v-model="qualification.deposit_bank" class='zizhileixingbtn' placeholder="请输入开户行"></el-input>
            </el-form-item>
            <el-form-item label='银行账号' class="is-required" prop="bank_account"
            >
                <el-input v-model="qualification.bank_account" class='zizhileixingbtn' placeholder="请输入银行账号"></el-input>
            </el-form-item>
            <el-form-item label='开户名称' class="is-required" prop="account_name"
            >
                <el-input v-model="qualification.account_name" class='zizhileixingbtn' placeholder="请输入开户名称"></el-input>
            </el-form-item>
          </div>

          <div v-else>
            <el-form-item label='资质名称' class="is-required" prop="quality_name"
            >
                <el-input v-model="qualification.quality_name" class='zizhileixingbtn' placeholder="请输入资质名称"></el-input>
            </el-form-item>
          </div>

            <el-form-item label="附件 :" class='is-required'>
              <upload2 @fileStatus="fileStatus"  @fileTrue="fileTrue" :success="success" ref='fileDel' v-model='qualification.file'>
              </upload2> 
            </el-form-item>

            <el-form-item label="备注 :">
              <el-input type="textarea" :rows="5" v-model="qualification.brife" placeholder="请输入内容" class='inputWarn2'></el-input>
            </el-form-item>
            <el-form-item style="margin-left: 300px;" class='twoBtnbottom'>
              <el-button type="primary" @click="qualificationWindowTrue('qualification')">确 定</el-button>
              <el-button @click="resetFormquali('qualification')">取 消</el-button>
            </el-form-item>
            <div style="clear:both"></div>
          </el-form>    
      </el-dialog>
          
  </div>
</template>
<script>
  import upload from "../.././components/s_customer/fiieDataCe";
  import upload2 from "../.././components/s_customer/fiieDataCe2";
  import Util from '@/libs/util';
  
  export default {
    components: {
      upload,upload2
    },
    name:'facilitator',
    data () {
      return {
        dynamicTags:[],
        timedisabled:false,
        yanzhengArray:[],
        radio9:1,
        ordprice2:'',
        radioText:[],
        numberShiYan: 0,
        product:[],
        product_id:'',
        price_type:[],
        contacts_type:[],
        qualitys:[],
        checkchange:false,
        form: {
          name:'',
          type:'',
          city:[],
          pro_info:[],
          employment_time:'',//从业时间（整数）
          rank:'',
          service_region:'',
          remarks:'',
          products:[],
          contacts:[{
            user_name:'',
            contact_type:'',
            contact_number:''
          }],
          contacts_type:[],
          file: "",
          // 新增资质相关
          qualitys:[
          //   {
          //   quality_type:1,
          //   quality_code:'',
          //   valid_type:'',
          //   valid_time:[],
          //   file:[{
          //     name:'',
          //     path:'',
          //     size:''
          //   }
          //   ],
          //   brife:'',
          //   deposit_bank:'',
          //   bank_account:'',
          //   account_name:'',
          //   quality_name:''
          // }
          ],

          // ask_time:new Date().toLocaleDateString(),
          // ask_time: new Date().toLocaleString('chinese',{hour12:false}),
        },
        qualityArr:[],
        sp_level:[],
        rank: [],
        region:[],
        tableData: [{}],
        order:{
          price_type:1
        },
        qualification:{
          file:[]
        },
        orderList:false,
        qualificationWindow:false,
        success: false
      }
    },

    methods: {
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      // 新增资质取消提交
      resetFormquali(qualification) {
        this.$refs[qualification].resetFields();
        this.qualificationWindow = false;
        this.timedisabled = false;
        this.checkchange = false;
      },
      // 资质类型弹窗的下拉更改事件
      longTime(data){
        this.checkchange = data;
        this.qualification.valid_time = [];
        if(data){
         this.timedisabled=true;
        this.qualification.valid_type = 2;
        }else{
         this.timedisabled=false;
        this.qualification.valid_type = 1;
        }
      },
      IdCodeValid(code){  
            var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};  
            var row = true;
            var msg = "验证成功";
            
            if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(code)){  
                row=false,  
              msg = "被保人身份证号格式错误"; 
            }else if(!city[code.substr(0,2)]){  
                row=false,  
              msg = "被保人身份证号地址编码错误";
            }else{  
                //18位身份证需要验证最后一位校验位  
                if(code.length == 18){  
                    code = code.split('');  
                    //∑(ai×Wi)(mod 11)  
                    //加权因子  
                    var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];  
                    //校验位  
                    var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];  
                    var sum = 0;  
                    var ai = 0;  
                    var wi = 0;  
                    for (var i = 0; i < 17; i++)  
                    {  
                        ai = code[i];  
                        wi = factor[i];  
                        sum += ai * wi;  
                    }  
                    if(parity[sum % 11] != code[17].toUpperCase()){  
                        row=false,  
                    msg = "被保人身份证号校验位错误";
                    }  
                }  
            }  
            return row;  
        },

      // 新增资质
      qualificationWindowTrue(){
        console.log(this.timedisabled)
          if(!this.qualification.quality_type){
            this.$message({
              message: '请选择资质类型',
              type: 'warning'
            });
          }else if(this.qualification.quality_type == 2 && !this.IdCodeValid(this.qualification.quality_code)){
            this.$message({
              message: '请填写正确的身份证号码',
              type: 'warning'
            });
          }else if((this.qualification.quality_type == 1||this.qualification.quality_type == 2) && !this.qualification.quality_code){
            this.$message({
              message: '请填写编号',
              type: 'warning'
            });
          }else if((this.qualification.quality_type == 1||this.qualification.quality_type == 2) && this.qualification.valid_time.length == 0 && this.qualification.valid_type==1){
            this.$message({
              message: '请选择有效期',
              type: 'warning'
            });
          }else if((this.qualification.quality_type == 3||this.qualification.quality_type == 4)&&!this.qualification.deposit_bank){
              this.$message({
                message: '请输入开户行',
                type: 'warning'
              });
            }else if((this.qualification.quality_type == 3||this.qualification.quality_type == 4)&&!this.qualification.bank_account){
              this.$message({
                message: '请输入银行账号',
                type: 'warning'
              });
            }else if((this.qualification.quality_type == 3||this.qualification.quality_type == 4)&&!this.qualification.account_name){
              this.$message({
                message: '请输入开户名称',
                type: 'warning'
              });
            }else if((this.qualification.quality_type == 5||this.qualification.quality_type == 6||this.qualification.quality_type == 7) && !this.qualification.quality_name){
              this.$message({
                message: '请输入资质名称',
                type: 'warning'
              });
            }else if((this.qualification.quality_type !== 4 || this.qualification.quality_type !== 2) && this.qualification.file.length == 0){
              this.$message({
                message: '请上传相关附件',
                type: 'warning'
              });
           }else if((this.qualification.quality_type !== 4 || this.qualification.quality_type !== 2) && this.qualification.file.length > 1){
              this.$message({
                message: '附件只能上传1个，请删除多余附件',
                type: 'warning'
              });
           }else{
             if(this.qualification.quality_type == 1||this.qualification.quality_type == 2){
               if(this.timedisabled){
                this.qualification.quality_info = `编号 : ${this.qualification.quality_code}<br/>有效期 ：长期`;
               }else{
                this.qualification.quality_info = `编号 : ${this.qualification.quality_code}<br/>有效期 ：${this.qualification.valid_time[0]}~${this.qualification.valid_time[1]}`
               }
             }else if(this.qualification.quality_type == 3||this.qualification.quality_type == 4){
               this.qualification.quality_info = `开户行 : ${this.qualification.deposit_bank}<br/>银行账号 ：${this.qualification.bank_account}<br/>开户名称 ：${this.qualification.account_name}`              
             }else{
               this.qualification.quality_info = `名称 : ${this.qualification.quality_name}`              
             }
              this.qualificationWindow = false;
              let pro_arr = this.qualityArr;
              for (const i in pro_arr) {
                if (pro_arr[i].id == this.qualification.quality_type) {
                  this.qualification.quality_name = pro_arr[i].name;
                }
              }
              this.yanzhengArray.push(this.qualification.quality_type)
              this.qualitys.push(this.qualification);
              this.form.qualitys.push(this.qualification);
                this.timedisabled = false;
                this.checkchange = false;
              // if(this.timedisabled){
              //   this.timedisabled = false;
              // }
              
              console.log(this.yanzhengArray)
        }
      },
      fileStatus(data) {
        this.qualification.file = data;
        this.qualification.file_size = (this.qualification.file[0].size/1024).toFixed(2) + 'M';
      },
        fileTrue(data) {
        this.success = data;
      },
      newQualification(){
        console.log(this.qualification.file.length)
        console.log(this.success)

        if(this.qualification.file.length > 0){
          this.$refs.fileDel.delOssFile2(this.qualification.file[0].path);
        }
        
        this.selectDataFunc();
          this.radioText = [];
            this.qualification = {
                quality_type:1,
                quality_code:'',
                valid_type:1,
                valid_time:[],
                file:[],
                brife:'',
                deposit_bank:'',
                bank_account:'',
                account_name:'',
                quality_name:''
            }
            this.qualificationWindow = true
      },
      // 其他
        removeDomain(item) {
          let index = this.form.contacts.indexOf(item);
          if (index !== 0) {
            this.form.contacts.splice(index, 1);
            // this.ruleForm.dis_dd_id.splice(index, 1);  //之后看需要加什么id在取消注释
          }
        },
       addDomain() {
        this.form.contacts.push({
          user_name:'',
          contact_type:'',
          contact_number:''
        });
      },
           orderListTrue () {
             console.log(this.order)
             console.log(this.order.price)
              if(!this.order.price_type){
                  this.order.price_type = '';
              }
              this.order.balance_price = this.radio9;
              if ( !this.order.product_name || !this.order.product_id) {
                  this.$message({
                  message: '请选择产品',
                  type: 'warning'
                })
                
              }else if ( this.order.balance_price !=3 && !this.order.price) {
                  this.$message({
                  message: '请填写价格或者分成比例',
                  type: 'warning'
                })
              } else if(this.order.balance_price ==2 && (this.order.price>100)){
                this.$message.error('分成比例不能大于100');
              }else {

                    switch(this.radio9){
                      case 1:
                        this.order.balance_price_text = '固定价格'
                        break;     
                      case 2:
                        this.order.balance_price_text = '分成比例'
                        this.order.price = this.order.price + '%'
                        break; 
                      case 3:
                        this.order.balance_price_text = '询价'
                        this.order.price = ''
                        break; 
                      default:
                        this.order.balance_price_text = '固定价格'
                    }
                  console.log(this.order)

                    this.form.products.push(this.order);
                    this.product_id = '';
                    this.numberShiYan = '';
                    this.orderList = false;
                    this.order = {
                      product_id: '',
                      balance_price: 1,
                      price_type: 1,
                      price: '',
                      brife: '',
                      balance_price_text:'',
                      product_name:''
                    }
             }

          },

      orderlistClick(){
           this.$get( 'crmManagement/order/index',this.searchData)
              .then( (data) => {
                  this.product = data.content.product;
              })
              .catch(() => {
              });
      },
        orderBtn(){
          console.log(this.order)
          this.radioText = [];
            
            this.orderList = true
          console.log(this.order)

        },
        handleChange(data){
            this.numberShiYan = data[1];

            let pro_arr = this.product;
            for(let i = 0; i < pro_arr.length; i++){
              for(let j = 0; j < pro_arr[i]['children'].length; j++){
                  if(pro_arr[i]['children'][j]['value'] == this.numberShiYan){
                    this.order.product_name = pro_arr[i]['children'][j]['label'];
                    this.order.product_id = pro_arr[i]['children'][j]['value'];
                }
              }
            }
          console.log(this.order)
        },
        handleChangefocus(data){
            console.log(data)
        },
      deleteRow (index, rows) {
        rows.splice(index, 1);
        this.yanzhengArray.splice(index, 1);
      },
      client_show(){
        this.$get( 'serviceProvider/getSelData')
          .then((data) => {
              if(data.code){
                this.price_type = data.content.price_type;
                this.rank = data.content.sp_type;
                let region = data.content.region;
                this.region = Util.obj2Arr(region);
                this.sp_level = data.content.sp_level;
                this.contacts_type = data.content.contacts_type;
              }else{
                  this.$message({
                        message: data.errorMsg,
                        type: 'warning'
                    });
              }
          })
          .catch(() => {})
      },
      selectDataFunc(){
        this.$get( 'serviceProvider/selectData')
          .then((data) => {
              if(data.code){
                this.qualityArr = data.content;
              }else{
                  this.$message({
                        message: data.errorMsg,
                        type: 'warning'
                    });
              }
          })
          .catch(() => {})
      },
        changeSource (val){
            val[0] === 1 ? this.judge = true : this.judge = false;
            val[0] === 4 ? this.judgeLine = true : this.judgeLine = false;
            val[0] === 5 ? this.judgeLinen = true : this.judgeLinen = false;
            val[0] === 6 ? this.judgeHm = true : this.judgeHm = false;
        },
         // 搜索重置按钮函数
        resetForm(form) {
            this.$refs[form].resetFields();
        },
        confirm_add(form){

          //  if(this.form.type == 1){
                var arrForm = this.yanzhengArray;
                console.log(this.form)
                if(this.form.type == 1 && (arrForm.length == 0 || (arrForm.indexOf(1)<=-1 ||arrForm.indexOf(3)<=-1)) ){
                   this.$message({
                        message: '类型为企业时，必须上传营业执照和开户许可证',
                        type: 'warning'
                      });

                  }else if(this.form.type == 2 &&  (arrForm.length == 0 || (arrForm.indexOf(2)<=-1 ||arrForm.indexOf(4)<=-1)) ){
                      this.$message({
                        message: '企业类型为个人时，银行账号和身份证必填',
                        type: 'warning'
                      });
                  }else{
                    this.$refs[form].validate((valid) => {
                      if (valid) {
                          this.$post( 'serviceProvider/addServiceProvider',this.form)
                            .then( (data) => {
                                  if(data.code){
                                    this.$message({
                                      message: '新增服务商成功！',
                                      type: 'success'
                                    });
                                    this.form = {};
                                    this.$router.push({name: 'facilitator',params: {id: data.content.provider_id}})
                                } else {
                                  this.$message({
                                    type:'warning',
                                    message:data.errorMsg,
                                    duration:6000
                                  });
                                return false;
                              }
                            })
                            .catch ( (data) => {
                                this.$message.error('服务器错误，请稍后重试');
                            })
                          }
                })
                  }
        },
    },
    created () {
        this.client_show();
        this.orderlistClick();
 
    },
}
</script>

<style lang='less'>
.addfacilitator111{
  .facilitator{
    .fuwuWidthFat {
      .el-form-item__label{
        width: 130px;
      }

    }
  }

  .priceAppend{
      width: 42%;
    }
    .priceAppend1{
      width: 25%;
    }
    .pricePrepend{
      width: 300px;
    }
    .Contacts2{
      margin: 10px 0;
    }
    .contacts2Item{
      width: 150px;
      display: inline-block;
    }
    .contacts2Item2{
      width: 110px;
      margin: 0 20px;
      display: inline-block;
    }

    .contacts2Father .contacts2Item .el-input--suffix{
      width: 100% !important;
    }
    .contacts2Item3{
      width: 200px;
      display: inline-block;

    }
    .line{
        margin: 20px 0;
        width: 100%;
        border-bottom: 1px solid rgba(233, 233, 233, 1);
    }
    .s_new_title {
        font-size: 16px;
        font-weight: 700;
    }

    .fuwuWidthFat .el-form-item__label{
      text-align: left !important;
    }

    .fuwuWidthFat{
      display: inline-block;
      width: 30% !important;
    }
    .fuwuWidthFatChild{
      width: 80% !important;
    }
 
    .fuwuWidthFat1{
      width: 40% !important;
    }
    .fuwuWidthFat222{
        .el-form-item__label{
          text-align: left;
          width: auto;
        }
       
    }
    .fuwuquyu .el-form-item__label{
      float: none;
    }
    .spaceWarp{
          height: 20px;
        }
    .facilitator{
      .addBtnzizhi{
        margin-left: 0 !important;
      }
    }
    .addMessageNT{
      margin-top:5px;
    }
    .facilitatorBtn{
      margin: 20PX;
      float: right;
    }
    .zizhileixingbtn{
      width: 70%
    }
    .twoBtnbottom{
      width: 70%
    }
}

    </style>
