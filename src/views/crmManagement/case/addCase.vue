<template>
  <div class="addCase">
    <el-card>
      <div class="x_case_title">
        案例信息
      </div>
      <el-form ref="form" :model="form"  label-position="top" label-width="110px">
        <el-form-item label="案例名称（必填）" prop="name" class="x_case_width">
          <el-input v-model="form.name" placeholder="请输入（30个字以内）" class="x_case_search" clearable></el-input>
        </el-form-item>
        <el-form-item label="客户名称（必填）" prop="client" class="x_case_width">
          <el-input class="x_case_search" @focus.prevent="dialogFollow" v-model="form.client" clearable placeholder="请选择"></el-input>
        </el-form-item>
        <el-form-item label="客户城市（必填）" filterable prop="address" class="x_case_width">
          <el-select v-model="form.address" placeholder="请选择" class="x_case_search" clearable>
            <el-option
                v-for="item in region"
                :key="item.id"
                :label="item.name"
                :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签（必填）" prop="lable" class="x_case_width">
          <el-select v-model="form.lable" placeholder="请选择" disabled  class="x_case_search">
            <el-option
                v-for="item in label"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类产品（必填）" prop="product_id" class="x_case_width">
          <el-cascader
              class="x_case_search"
              placeholder="请选择"
              :show-all-levels="false"
              :options="product"
              v-model="form.product_id"
              filterable clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="出品人星级（必填）" prop="designer" class="x_case_width">
          <el-select v-model="form.designer" placeholder="请选择" class="x_case_search" clearable>
            <el-option
                v-for="item in producerLevel"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="案例日期（必填）" prop="make_time" class="x_case_width">
          <el-date-picker
              style="width: 90%;"
              v-model="form.make_time"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="执行方（必填）" prop="excutor_type" class="x_case_width">
          <el-select v-model="form.excutor_type" @change="executiveF" placeholder="请选择" filterable class="x_case_search" clearable>
            <el-option
                    v-for="item in executive"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行业（必填）" prop="industry" class="x_case_width">
          <el-select v-model="form.industry" placeholder="请选择" filterable class="x_case_search" clearable>
            <el-option
                v-for="item in industry"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="来源渠道" prop="source" class="x_case_width">
          <el-cascader
            class="x_case_search"
            expand-trigger="click"
            filterable
            clearable
            :options="customer_source"
            v-model="form.source"
            @change="changeSource">
          </el-cascader>
        </el-form-item>
        <el-form-item label="出品人（必填）" prop="producer" class="x_case_width">
          <el-select v-if="executiveF1 == 0" v-model="form.producer" multiple placeholder="请选择" filterable allow-create class="x_case_search">

          </el-select>
          <el-select v-else-if="executiveF1 == 1" v-model="form.producer" multiple placeholder="请选择" filterable allow-create class="x_case_search">
            <el-option
                    v-for="item in person"
                    :key="item.dd_id"
                    :label="item.nickname"
                    :value="item.nickname">
            </el-option>
          </el-select>
          <el-select v-else="executiveF1 == 2" v-model="form.producer" multiple placeholder="请选择" filterable allow-create class="x_case_search">
            <el-option
                    v-for="item in service"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price" class="x_case_width">
          <el-input v-model="form.price" placeholder="请输入"  class="x_case_search" clearable></el-input>
        </el-form-item>
        <el-form-item label="浏览量" prop="view" class="x_case_width">
          <el-input v-model="form.view" placeholder="请输入浏览次数"  class="x_case_search" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否可外宣" prop="can_publicity" class="x_case_width">
          <el-switch v-model="form.can_publicity" active-value=1 inactive-value=0></el-switch>
        </el-form-item>
        <label class="el-form-item__label" style="display: flex">风格</label>
        <el-tag
          v-for="(tag,index) in form.tag"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)" :key="index">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        ></el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 标签</el-button>

        <el-form-item prop="brief" label="案例介绍（必填）"  style="clear: both;" class='x_case_width2'>
          <el-input type="textarea" v-model="form.brief" :autosize="{ minRows: 3}" placeholder="请输入" style="width: 40%;"></el-input>
        </el-form-item>
        <el-form-item prop="idea" label="创意思路（必填）"  style="clear: both" class='x_case_width2'>
          <el-input type="textarea" v-model="form.idea" :autosize="{ minRows: 3}" placeholder="请输入" style="width: 40%;"></el-input>
        </el-form-item>
        <el-form-item  label="封面图（必填）"  class="x_case_width">
          <casefile @fileStatus1="fileStatus1"  @fileTrue1="fileTrue1" :successes="successes"></casefile>
        </el-form-item>
        <el-form-item label="源文件（必填）"  class="x_case_width" style="margin-left: 20px;" >
          <upload @fileStatus="fileStatus" :success="success" @fileTrue="fileTrue"></upload>
        </el-form-item>
        <addEditorUpload @editup="editup" :successful="successful" @fileTrue2="fileTrue2" style="clear:both;margin-top: 180px;"></addEditorUpload>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">立即创建</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!--客户名称弹窗-->
    <el-dialog :title="customerTitle" :visible.sync="customer" :modal="false" width="60%">
      <div class="customerRadio">
        <el-radio v-model="radio" label="1" border>选择客户</el-radio>
        <el-radio v-model="radio" label="2" border>自行输入客户</el-radio>
      </div>
      <div v-show="radio == 1">
        <el-form ref="formCustomer" :model="formCustomer" :inline="true">
          <el-form-item>
            <el-input prefix-icon="el-icon-search" v-model="formCustomer.company" placeholder="请输入客户名称" class="customerInput"></el-input>
            <el-input prefix-icon="el-icon-search" v-model="formCustomer.code" placeholder="请输入客户编号" class="customerInput"></el-input>
            <el-form-item>
              <el-button type="primary" @click="onSubmit('formCustomer')">查询</el-button>
            </el-form-item>
          </el-form-item>
        </el-form>
        <el-table :data="customerTable" style="width: 100%;" @row-click="handleClick">
          <el-table-column prop="code" label="客户编号" width="180"></el-table-column>
          <el-table-column prop="company" label="客户名称" width="180"></el-table-column>
          <el-table-column prop="trench" label="客户来源" width="180"></el-table-column>
          <el-table-column prop="location" label="地区"></el-table-column>
          <el-table-column prop="rank" label="客户级别"></el-table-column>
          <el-table-column prop="nickname" label="创建人"></el-table-column>
          <el-table-column prop="partner" label="跟进人"></el-table-column>
          <el-table-column prop="create_time" label="创建时间"></el-table-column>
          <el-table-column prop="customerDrive" label="操作" width="80px">
            <template slot-scope="scope">
              <el-button type="text" size="small">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="formCustomer.currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="formCustomer.pageSize"
                layout="sizes, prev, pager, next"
                :total="count">
        </el-pagination>
      </div>
      <div v-show="radio == 2">
        <el-form ref="formCustomer1" :model="formCustomer1" label-width="80px" :inline="true">
          <el-form-item label="客户名称">
            <el-input v-model="formCustomer1.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="confirm()">确认</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!--风格标签弹窗-->
    <el-dialog :title="styleTitle" :visible.sync="styleTab" :modal="false" width="40%" class="styleBody">
      <el-form>
        <el-form-item label="风格">
          <el-select v-model="styleTags" placeholder="请选择" filterable allow-create>
            <el-option
                v-for="item in formTag"
                :key="item.id"
                :label="item.name"
                :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="styleDialog">
          <el-button @click="styleOff()">取消</el-button>
          <el-button type="primary" @click="stylePut()">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import Util from '@/libs/util';
  import upload from '../.././components/s_customer/fiieDataCe'
  import casefile from '../.././components/x_case/case_file'
  import { quillEditor } from 'vue-quill-editor'
  import addEditorUpload from '../.././components/x_case/addEditorUpload'
  export default {
    components: {
      upload,
      casefile,
      quillEditor,
      addEditorUpload
    },
    data () {
      return {
        success: false,  //传文件
        successes:false, //封面图
        successful:false, //改造后的富文本编辑器 的清空默认值
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
        form: {
          name:'',            // 案例
          client: '',         // 客户
          address:'',         // 客户地址
          lable:0,           // 标签
          industry: '',       // 行业
          product_id:[],      // 产品id
          make_time:'',       // 时间
          designer:'',        // 出品人星级
          brief:'',           // 案例介绍
          idea: '',           // 创意思路
          producer:[],        // 出品人
//          service:[],         //服务商
          edit: '',           // 内容预览
          can_publicity:0,    // 外宣
          file:[],
          cover:'',
          view: '',
          excutor_type:"",     //执行方
          source:[],  //来源渠道
          price: '',           //价格
          tag: [],     //风格
        },
        cover:'',
        industry:[],
        customer_source:[],  //来源渠道
        producer:[],
        service:[],         //服务商
        label:[],
        producerLevel:[],
        product:[],
        region:{},
        customer: false,  //客户名称弹窗
        customerTitle: "客户搜索",  //弹窗标题
        radio: "1",
//        xin start
        formCustomer:{
          company:"",
          code:"",
          currentPage: 1,
          pageSize: 10,  //默认每页显示10条
        },
        customerTable:[],  //弹窗表格
        count: 0,
        formCustomer1:{
          name:""
        },
        executive:[
          {label: "自营",id:1},
          {label: "服务商",id:2}
        ],
        executiveF1 :0,  //判断自营还是服务商
        inputVisible: false,
        inputValue: '',
        styleTitle: "新增标签",
        styleTab: false,
        styleTags:'',
        formTag:[],  //风格标签
        inputValue1:"",
      }
    },
    computed: {
      person () {
        return this.$store.state.app.commonPerson;
      }
    },
    methods: {
      //oss
      editup(data){
        this.form.edit = data;
      },
      fileStatus(data) {
        this.form.file = data;
      },
      fileStatus1(data) {
        this.form.cover = data[0].path;
      },
      fileTrue(data){
        this.success = data;
      },
      fileTrue1(data){
        this.successes = data;
      },
      fileTrue2(data){
        this.successful = data;
      },
      addCase(){
        this.$get('/case/addPageData')
          .then((data) => {
            if(data.code){
              this.industry = data.content.industry;
              let customer = data.content.customer_source;  //来源渠道
              this.customer_source = Util.obj2Arr(customer);
              this.service = data.content.service;  //服务商
              this.formTag = data.content.tag;  //风格标签
              this.label = data.content.label;
              this.producerLevel = data.content.producerLevel;
              this.product = data.content.product;
              this.region = data.content.region;
              this.form.excutor_type = this.$route.params.excutor_type;
              if(this.form.excutor_type == ""){
                this.executiveF1 = 0;
              }
              if(this.form.excutor_type == 1){
                this.executiveF1 = 1;
              }
              if(this.form.excutor_type == 2){
                this.executiveF1 = 2;
              }
              if(this.$route.params.id){
                this.form.producer.push(parseInt(this.$route.params.id));
              }
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      changeSource (val){
        val[0] === 1 ? this.judge = true : this.judge = false;
        val[0] === 4 ? this.judgeLine = true : this.judgeLine = false;
        val[0] === 5 ? this.judgeLinen = true : this.judgeLinen = false;
        val[0] === 6 ? this.judgeHm = true : this.judgeHm = false;
      },
      submitForm(formName) {
        if(!this.form.name){
          this.$message({
            message: '请填写案例名称',
            type: 'warning'
          });
        }else if(!this.form.client){
          this.$message({
            message: '请选择客户名称',
            type: 'warning'
          });
        }else if(!this.form.address){
          this.$message({
            message: '请选择客户城市',
            type: 'warning'
          });
        }else if(this.form.lable.length == 0){
          this.$message({
            message: '请选择标签',
            type: 'warning'
          });
        }else if(this.form.product_id.length < 1){
          this.$message({
            message: '请选择分类产品',
            type: 'warning'
          });
        }else if(this.form.designer != '0' && this.form.designer === ''){
          this.$message({
            message: '请选择出品人星级',
            type: 'warning'
          });
        }else if(!this.form.make_time){
          this.$message({
            message: '请选择案例日期',
            type: 'warning'
          });
        }else if(!this.form.excutor_type){
          this.$message({
            message: '请选择执行方',
            type: 'warning'
          });
        }else if(!this.form.industry){
          this.$message({
            message: '请选择行业',
            type: 'warning'
          });
        }else if(this.form.producer.length < 1){
          this.$message({
            message: '请选择出品人',
            type: 'warning'
          });
        }else if(this.form.tag.length < 1){
          this.$message({
            message: '请新增或选择标签',
            type: 'warning'
          });
        }else if(!this.form.brief){
          this.$message({
            message: '请输入案例介绍',
            type: 'warning'
          });
        }else if(!this.form.idea){
          this.$message({
            message: '请输入创意思路',
            type: 'warning'
          });
        }else if(!this.form.cover){
          this.$message({
            message: '请选择封面图',
            type: 'warning'
          });
        }else if(this.form.file.length < 1){
          this.$message({
            message: '请选择源文件',
            type: 'warning'
          });
        }else if(!this.form.edit){
          this.$message({
            message: '请填写内容预览',
            type: 'warning'
          });
        }else{
          this.$post('case',this.form)
            .then((data) => {
              if(data.code) {
                this.$message({
                  message: data.errorMsg,
                  type: 'success'
                });
                this.success = true;
                this.successes = true;
                this.successful = true;
                this.form.file = [];
                this.form.edit = '';
                this.form.cover = '';
                this.$refs[formName].resetFields();
                this.$router.push({
                  name: 'caseDetail',
                  params: {
                    id: data.content
                  }
                })
              } else {
                this.$message({
                  message: data.errorMsg,
                  type: 'warning'
                });
              }
            })
            .catch(() => {
              this.$message.error('服务器错误，请稍后重试');
            })
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
//      客户名称
      dialogFollow(){
        this.customer = true;
        this.$get("client/list",this.formCustomer)
          .then((data)=>{
            this.customerTable = data.content.data;
            this.count = data.content.count;
          })
          .catch(()=>{})
      },
      onSubmit(){
        this.customer = true;
        this.formCustomer.currentPage = 1;
        this.formCustomer.pageSize = 10;
        this.$get("client/list",this.formCustomer)
          .then((data)=>{
            this.customerTable = data.content.data;
            this.count = data.content.count;
          })
          .catch(()=>{})
      },
      handleSizeChange(val) {
        this.formCustomer.pageSize = val;
        this.dialogFollow();
//        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.formCustomer.currentPage = val;
        this.dialogFollow();
//        console.log(`当前页: ${val}`);
      },
//      选择
      handleClick(row) {
        this.form.client = row.company;
        this.form.address = row.location;
        this.customer = false;
      },
//      自行输入客户
      confirm(){
        this.form.client = "";
        this.form.address = "";
        this.form.client = this.formCustomer1.name;
        this.customer = false;
      },
      //判断自营还是服务商
      executiveF(data){
       console.log(data);
        if(data == ""){
          this.executiveF1 = 0;
          this.form.producer = [];
        }
        if(data == 1){
          this.executiveF1 = 1;
          this.form.producer = [];
        }
        if(data == 2){
          this.executiveF1 = 2;
          this.form.producer = [];
        }
      },
      handleClose(tag) {
        this.form.tag.splice(this.form.tag.indexOf(tag), 1);
      },
      showInput() {
        if(this.form.tag.length >= 2){
          this.$message({
            message: '最多可增加2个标签',
            type: 'warning'
          });
        }else{
          this.styleTab = true;
//          this.inputVisible = true;
//          this.$nextTick(_ => {
//            this.$refs.saveTagInput.$refs.input.focus();
//          });
        }

      },
      handleInputConfirm() {
        if(this.form.tag.length < 2){
          let inputValue = this.inputValue;
          if(inputValue.length > 4){
            this.$message({
              message: '字符不得超过4个字',
              type: 'warning'
            });
          };
          if (inputValue == this.inputValue1 && inputValue != "") {
            this.$message({
              message: '风格不可以重复',
              type: 'warning'
            });
          }else if(inputValue && inputValue.length <= 4){
            this.form.tag.push(inputValue);
            this.inputValue1 = inputValue;
          }
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      styleOff(){
        this.styleTab = false;
      },
      stylePut(){

        if(this.styleTags == false){
          this.$message({
            message: '标签内容不能为空',
            type: 'warning'
          });
        }else if(this.styleTags.length > 4){
          this.$message({
            message: '字符不得超过4个字',
            type: 'warning'
          });
        }else if(this.styleTags == this.form.tag[0]){
          this.$message({
            message: '风格不可以重复',
            type: 'warning'
          });
        }else{
          this.form.tag.push(this.styleTags);
          console.log(this.form.tag)
          console.log(this.form.tag_name)

          this.styleTab = false;
          this.inputVisible = false;
        }
      },
//      caseDefault(){
//        this.form.excutor_type = this.$route.params.excutor_type;
//        if(this.form.excutor_type == ""){
//          this.executiveF1 = 0;
//        }
//        if(this.form.excutor_type == 1){
//          this.executiveF1 = 1;
//        }
//        if(this.form.excutor_type == 2){
//          this.executiveF1 = 2;
//        }
//        this.form.producer.push(parseInt(this.$route.params.id));
//      }
    },
    created(){
      this.addCase();
//      this.caseDefault();

    }
  }
</script>

<style lang="less" type="scoped">
  .addCase{
    .x_case_title{
      width: 100%;
      height: 50px;
      font-size: 16px;
      float: left;
      text-align: left;
      font-weight: 700;
    }
    .x_case_width{
      width: 33%;
      float: left;
      .el-form-item__label{
        display: inline!important;
      }
    }
    .x_case_width2{
      .el-form-item__label{
        display: inline!important;
      }
    }
    .x_case_search{
      width: 90%;
      /*height: 50px;*/
    }
    .quill-editor {
      height: 380px;
      clear: both;

      .ql-container {
        height: 280px;
      }
    }
    .limit {
      height: 30px;
      border: 1px solid #ccc;
      line-height: 30px;
      text-align: right;

      span {
        color: #ee2a7b;
      }
    }
    .ql-snow .ql-editor img {
      max-width: 80px;
    }
    .ql-editor .ql-video {
      max-width: 80px;
    }

    .customerRadio{
      width: 100%;
      margin-bottom: 30px;
    }
    .customerInput{
      width: 35%;
      margin-right: 3%;
    }
    /*风格标签*/
    .el-dialog__header{
      padding: 20px 20px 20px;
      border-bottom: 1px solid #ccc;
    }
    .el-tag + .el-tag {
      margin-left: 10px;
    }
    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }

    /*风格弹窗*/
    .styleBody .el-dialog__body{
      padding: 30px 0;
    }
    .styleDialog{
      text-align: right;
      border-top: 1px solid #ccc;
      padding-top: 22px;
      padding-right: 50px;
      margin-bottom: 0;
      margin-top: 100px;
    }
  }
</style>
