<template>
  <div class="x_caseDtails">
    <el-card style="margin-bottom: 15px;">
      <div class="x_case_name">{{date.name}}</div>
      <el-rate :value="date.designer" disabled :max="date.designer"></el-rate>
      <div class="x_case_edit" v-if="date.can_op">编辑案例<i class="el-icon-edit" @click="dialogOpen" style="display: inline-block;"></i></div>
      <div style="clear: both"></div>
      <p class="case_p_width">
        <span>分类产品：{{date.product}}</span>
        <span>客户:{{date.client}}</span>
        <span>价格:{{date.price}}</span>
      </p>
      <p class="case_p_width">
        <span>行业：{{date.industry}}</span>
        <span>地区：{{date.address}}</span>
        <span v-if="date.excutor_type == 1">执行方：自营</span>
        <span v-else>执行方：服务商</span>
      </p>
      <p class="case_p_width">
        <span>设计师：{{date.producer}}</span>
        <span>是否可外宣：{{date.can_publicity}}</span>
        <span>来源渠道：{{date.source}}</span>
      </p>
      <p class="case_p_width">
        <span>浏览量：{{date.view}}</span>
      </p>
      <p class="x_lable">{{date.lable.name}}</p>
      <p class="x_lable">{{date.make_time}}</p>
      <p class="x_lable" v-for="(item,index) in date.tag" :key="index">
        <span>{{item}}</span>
      </p>
      <div class="x_case_download">
        <span class="tpr">
        <span class="x_lable x_lable_img" :class="{x_lable_img1:date.is_praise}" style="width:80px;border:none;" @click="pointPraise"><b>{{date.praise}}</b></span>
        </span>
      </div>
      <div class="clearfix"></div>
    </el-card>
    <el-card style="float: left;width: 70%;margin-right: 15px;">
      <div class="x_case_name1">创意思路</div>
      <p class="date_edit">{{date.idea}}</p>
      <p v-html="date.edit" class="date_edit_img"></p>
    </el-card>
    <el-card>
      <p class="x_case_name1" style="border-bottom: 1px solid #ebeef5; margin-bottom: 15px;">封面</p>
      <p class="date_cover_img">
        <img :src="over" alt=""  title="点击查看大图"  @click="eImgClick($event)" >
      </p>
      <transition name="ts">
        <imgview v-if="isImgViewsShow" :src="imgViewsSrc" @click="eImgViewClick"></imgview>
      </transition>
      <p class="date_brief">{{date.brief}} </p>
      <p> 附件:</p>
      <el-table :data="date.annex" align="center" style="width: 100%">
        <el-table-column
          prop="name"
          label="名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="size"
          label="大小"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button  type="text" size="small"  @click="fileClone(scope.$index,date.annex)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--案例修改（关联工单）-->
    <caseDtailsOrder :dialogTableVisible1="dialogTableVisible1" @dialogOrder="dialogOrder"></caseDtailsOrder>
    <!--案例修改-->
    <el-dialog title="案例详情修改" :visible.sync="dialogTableVisible" :modal="false">
      <el-form ref="form" :model="form" label-position="top" label-width="100px">
        <el-form-item label="案例名称" prop="name" class="x_case_width">
          <el-input v-model="form.name" placeholder="请输入（30个字以内）"  class="x_case_search"></el-input>
        </el-form-item>

        <el-form-item label="客户名称" prop="client" class="x_case_width">
          <el-input class="x_case_search" @focus.prevent="dialogFollow" v-model="form.client" clearable placeholder="请选择"></el-input>
        </el-form-item>
        <el-form-item label="客户城市" prop="address" class="x_case_width">
          <el-select v-model="form.address" placeholder="请选择"  class="x_case_search">
            <el-option
                v-for="item in region"
                :key="item.id"
                :label="item.name"
                :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="lable" class="x_case_width">
          <el-select v-model="form.lable" :disabled="!can_label" placeholder="请选择"  class="x_case_search">
            <el-option
                v-for="item in label"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类产品" prop="pro" class="x_case_width">
          <el-cascader
            class="x_case_search"
            placeholder="请选择"
            :show-all-levels="false"
            :options="product"
            v-model="form.product_id"
            filterable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="出品人星级" prop="designer" class="x_case_width">
          <el-select v-model="form.designer" placeholder="请选择" class="x_case_search">
            <el-option
              v-for="item in producerLevel"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="案例日期" prop="make_time" class="x_case_width">
          <el-date-picker
            style="width:270px;"
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
        <el-form-item label="行业" prop="industry" class="x_case_width">
          <el-select v-model="form.industry" placeholder="请选择" filterable class="x_case_search">
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
        <el-form-item label="出品人" prop="producer" class="x_case_width">
          <el-select v-if="executiveF1 == 0" v-model="form.producer" multiple placeholder="请选择" filterable allow-create class="x_case_search"></el-select>
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
        <!--<el-form-item label="出品人" prop="producer" class="x_case_width">-->
          <!--<el-select v-model="form.producer"  placeholder="请选择" multiple filterable allow-create class="x_case_search">-->
            <!--<el-option-->
              <!--v-for="(item, index) in person"-->
              <!--:key="index"-->
              <!--:label="item.nickname"-->
              <!--:value="item.nickname">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="价格" prop="price" class="x_case_width">
          <el-input v-model="form.price" placeholder="请输入"  class="x_case_search" clearable></el-input>
        </el-form-item>
        <el-form-item label="浏览量" prop="view" class="x_case_width">
          <el-input v-model="form.view" placeholder="请输入浏览量"  class="x_case_search"></el-input>
        </el-form-item>
        <el-form-item label="是否可外宣" prop="can_publicity" class="x_case_width">
          <el-switch v-model="form.can_publicity"></el-switch>
        </el-form-item>
        <label class="el-form-item__label" style="display: flex">风格</label>
        <el-tag
          :key="index"
          v-for="(tag,index) in form.tag"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
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
        <el-form-item label="案例介绍" prop="brief"  style="clear: both">
          <el-input type="textarea" v-model="form.brief" :autosize="{minRows: 4}" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="创意思路" prop="idea"  style="clear: both">
          <el-input type="textarea" v-model="form.idea" :autosize="{minRows: 4}" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="封面图" prop="cover"  class="x_case_width" style="position: relative;">
          <img :src="form.cover" alt="" style="float: left;width:100px;height:100px;margin-right: 5px;">
          <casefile  @fileStatus1="fileStatus1"  @fileTrue="fileTrue" :successes="successes" @filexx="filexx"></casefile>
        </el-form-item>
        <div style="clear:both;"></div>
        <el-form-item label="源文件">
          <upload @fileStatus="fileStatus" :success="success" @fileTrue="fileTrue"></upload>
          <el-table border :data="attachment" style="width:80%;margin-top: 10px;">
            <el-table-column label="文件名" prop="name">
            </el-table-column>
            <el-table-column prop="size" label="大小">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index,attachment)" type="text" size="small">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <div class="clearfix"></div>
        <editorUpload @editup="editup" :xkedit="xkedit" :successful="successful"></editorUpload>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmCancel()">取 消</el-button>
        <el-button type="primary" @click="confirmAdd(form)">确 定</el-button>
      </div>
    </el-dialog>
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
    <el-dialog :title="styleTitle" :visible.sync="styleTab" :modal="false" width="20%" class="styleBody">
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
  import  casefile from '../.././components/x_case/case_file'
  import  editorUpload from '../.././components/x_case/editorUpload'
  import  imgview from  '../.././components/x_case/imgview'
  import { quillEditor } from 'vue-quill-editor'
  import caseDtailsOrder from './caseDtailsOrder'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  export default {
    name: 'casedtails',
    components: {
      upload,
      casefile,
      quillEditor,
      editorUpload,
      imgview,
      caseDtailsOrder
    },
    data(){
      return{
        options5: [{
          value: '111',
          label: 'HTML'
        }, {
          value: 'CSS',
          label: 'CSS'
        }, {
          value: 'JavaScript',
          label: 'JavaScript'
        }],
        isImgViewsShow:0,
        cover_source:'',
        imgViewsSrc:'',
        dialogTableVisible:false,
        dialogTableVisible1:false,
        successful:false,
        successes:false,
        success:false,
        id:'',
        xkedit:'',
        date:{
          id:'',
          name:'',
          client:'',
          industry:'',
          address:'',
          producer:'',
          can_publicity:'',
          lable:[],
          designer:1,
          make_time:'',
          praise:'',
          idea:'',
          edit:'',
          cover:'',
          brief:'',
          can_op:'',
          product:'',
          annex:[],
          view: '',

          price:"",
          excutor_type:"",
          source:[],  //来源渠道
          tag: [],
        },
        //编辑案例页面
        client:[],
        industry:[],
        label:[],
        producerLevel:[],
        product:[],
        region:[],
        attachment:[],
        can_label:false, //能否编辑标签的权限
        form:{
          name:'',            // 案例
          client: '',         // 客户
          address:'',         // 客户地址
          lable:'',           // 标签
          industry: '',       // 行业
          product_id:[],      // 产品id
          make_time:'',       // 时间
          designer:'',        // 出品人星级
          brief:'',           // 案例介绍
          idea: '',           // 创意思路
          edit: '',           // 内容预览
          can_publicity:false,// 外宣
          file:[],
          cover_source:'',
          view: '',
//          xin
          excutor_type:"",  //执行方
          source:[],  //来源渠道
          producer:[],
          price:"",
          tag: [],     //风格
        },
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
//        xin新增案例
        executive:[
          {label: "自营",id:1},
          {label: "服务商",id:2}
        ],
        executiveF1 :0,  //判断自营还是服务商
        customer_source:[],  //来源渠道
        service:[],         //服务商styleTitle: "新增标签",
        styleTab: false,
        styleTags:'',
        formTag:[],  //风格标签
        inputVisible: false,
        inputValue: '',
        styleTitle: "新增标签",
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
//        （关联工单）
        case_type:"",  //判断是否关联工单
      }
    },
    computed:{
      over(){
        let ossUrl = this.date.cover.indexOf('?');
        return this.date.cover.substring(0,ossUrl);
      },
      person () {
        return this.$store.state.app.commonPerson;
      }
    },
    methods:{
      //oss
      filexx(data) {
        //封面图上传后随后点击删除 需要让封面图展示默认封面图
        if(data) {
          this.form.cover_source = this.cover_source;
        }
      },
      editup(data){
        this.form.edit = data;
      },
      fileStatus(data) {
        this.form.file = data;
      },
      fileStatus1(data) {
        this.form.cover_source = data[0].path;
      },
      fileTrue(data){
        this.success = data;
      },
      pointPraise(){
        if(!this.date.is_praise){
          this.$put('case/praise/' + this.id)
            .then((data) => {
              if(data.code){
                this.$message({
                  message:data.errorMsg,
                  type: 'success',
                });
                this.caseDtail();
              }else{
                this.$message.error(data.errorMsg);
              }
            })
            .catch(() => {
              this.$message.error('服务器错误，请稍后重试');
            })
        }else {
          this.$message({
            message: '您已经点过赞了',
            type: 'warning'
          });
        }
      },
      fileClone(index, rows){
        window.open(rows[index].path);
      },
      dialogOpen() {
        if(this.case_type == 2){
          this.dialogTableVisible1 = true;
        }else{
          this.dialogTableVisible = true;
          this.$get('case/editPageData/' + this.$route.params.id)
                  .then((data) => {
//            console.log(data.content.case)
                    if(data.code) {
                      this.industry = data.content.industry;
                      // this.producer = data.content.producer;
                      this.label = data.content.label;
                      this.producerLevel = data.content.producerLevel;
                      this.product = data.content.product;
                      this.region = data.content.region;
                      this.attachment = data.content.case.attachment;
                      let customer = data.content.customer_source;  //来源渠道
                      this.customer_source = Util.obj2Arr(customer);
                      this.service = data.content.service;  //服务商
                      this.formTag = data.content.tag;  //风格
//                      console.log(this.service);

                      let form = data.content.case;
                      // 默认值
                      this.form.name = form.name;
                      this.form.product_id = form.product_id;
                      // this.form.product_id = ["1","4","1"];
                      this.form.client = form.client.id;
                      /*let client = form.client.id;
                       let cli = parseInt(client);
                       this.form.client = isNaN(cli) ? form.client.id : client;
                       console.log(this.form.client);*/
                      this.form.industry = form.industry.id;
                      this.form.address = form.address;
                      console.log(form);
                      this.form.can_publicity = form.can_publicity;
                      this.form.lable = form.lable.id;
                      this.form.designer = form.designer.id;
                      this.form.make_time = form.make_time;
                      this.form.idea = form.idea;
                      this.xkedit = form.edit;
                      this.form.cover = form.cover;
                      this.cover_source = form.cover_source;
                      this.form.brief = form.brief;
                      this.form.view = form.view;
                      this.can_label = form.can_label;
                      this.form.excutor_type = form.excutor_type;   //执行方
                      this.form.source = form.source;   //来源渠道
                      this.form.price = form.price;   //价格
                      this.form.tag = form.tag;   //风格

//                      let arr=["zhangsn","lisi"];
//                      let arr2=["259","267","271"];
                      if(this.form.excutor_type == ""){
                        this.executiveF1 = 0;
                      }
                      if(this.form.excutor_type == 1){
                        this.executiveF1 = 1;
                        this.form.producer = form.producer;
                      }
                      if(this.form.excutor_type == 2){
                        this.executiveF1 = 2;
                        var arr3 = [];
//                        console.log(form.producer);
                        for(var i=0;i<form.producer.length;i++){
                            arr3.push(parseInt(form.producer[i]));
                        }
//                        console.log(arr3);
                        this.form.producer = arr3;
//                        this.form.producer = arr2;
                      }
                    }else {
                      this.$message.error(data.errorMsg);
                      this.$router.push({name:"caseList"});
                    }
                  })
                  .catch(() => {
                    this.$message.error('服务器错误，请稍后重试');
                  })
        }

      },
      deleteRow(index, rows){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$delete( 'case/attachment/' + rows[index].id)
            .then( (data) => {
              if(data.code) {
                this.$message({
                  message: data.errorMsg,
                  type: 'success'
                });
                rows.splice(index, 1);
              }
            })
            .catch(() => {
              this.$message.error('服务器错误，请稍后重试');
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      confirmCancel(){
        this.dialogTableVisible = false;
        this.caseDtail();
      },
      confirmAdd(){
        if(!this.form.edit){
          this.form.edit = this.xkedit;
        }
        if(!this.form.brief){
          this.$message({
            message: '请输入案例介绍',
            type: 'warning'
          });
        }else if(!this.form.idea){
          this.$message({
            message: '请输入创意思路',
            type: 'warning'
          });
        }else {
          if(this.form.cover) {
            this.form.cover = '';
          }
          if(!this.form.cover_source) {
            this.form.cover_source = this.cover_source;
          }
          console.log(this.form)
          this.$put('case/' + this.id,this.form)
            .then((data) => {
              if (data.code) {
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                });
                this.dialogTableVisible = false;
                this.success = true;
                this.successes = true;
                this.successful = true;
                this.form.cover_source = '';
                // this.$refs[formName].resetFields();
                this.caseDtail();
              } else {
                this.$message.error(data.errorMsg);
              }
            })
            .catch(() => {
              this.$message.error('服务器错误，请稍后重试');
            })
        }
      },
      caseDtail(){
        this.$get('case/' + this.$route.params.id)
          .then((data) => {
            if(data.code) {
              console.log(data.content.edit);
              this.id = data.content.id;
              this.date.name = data.content.name;
              this.date.client = data.content.client;
              this.date.industry = data.content.industry;
              this.date.address = data.content.address;
              this.date.producer = data.content.producer;
              this.date.can_publicity = data.content.can_publicity;
              this.date.lable = data.content.lable;
              this.date.designer = data.content.designer.id + 1;
              this.date.make_time = data.content.make_time;
              this.date.praise = data.content.praise;
              this.date.idea = data.content.idea;
              this.date.edit = data.content.edit;
              this.date.cover = data.content.cover;
              this.date.brief = data.content.brief;
              this.date.is_praise = data.content.is_praise;
              this.date.can_op = data.content.can_op;
              this.date.product = data.content.product;
              this.date.annex = data.content.annex;
              this.date.view = data.content.view;

              this.date.price = data.content.price;
              this.date.excutor_type = data.content.excutor_type;
              this.date.source = data.content.source;
              this.date.tag = data.content.tag;
              //              关联工单
              this.case_type = data.content.case_type;  //是否是关联工单
            }else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      //点击图片放大
      eImgClick(e){
        this.isImgViewsShow = 1;
        this.imgViewsSrc = e.currentTarget.src
      },
      eImgViewClick(){
        this.isImgViewsShow = 0;
      },
      getClient() {
        this.$get('case/allClient')
          .then((data) => {
            if(data.code === 200) {
              this.client = data.content;
            }
          })
          .catch(() => {

          })
      },
//      xin
      //判断自营还是服务商
      executiveF(data){
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
      //来源渠道
      changeSource (val){
        val[0] === 1 ? this.judge = true : this.judge = false;
        val[0] === 4 ? this.judgeLine = true : this.judgeLine = false;
        val[0] === 5 ? this.judgeLinen = true : this.judgeLinen = false;
        val[0] === 6 ? this.judgeHm = true : this.judgeHm = false;
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
          if (inputValue && inputValue.length <= 4) {
            this.form.tag.push(inputValue);
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
//          this.form.tag = this.form.tag;
          console.log(this.form.tag)

          this.styleTab = false;
          this.inputVisible = false;
        }
//        let inputValue = this.styleTag.tag;
//        if (inputValue) {
//          this.form.tag.push(inputValue);
//        }
//        this.styleTab = false;
//        this.inputVisible = false;
//        this.inputValue = '';
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
      dialogOrder(data){
        this.dialogTableVisible1 = data;
      }
    },
    created(){
      this.caseDtail();
      this.getClient();
    }
  }
</script>

<style lang="less">
  .x_caseDtails{
    .x_case_name{
      height: 50px;
      font-size: 16px;
      float: left;
      text-align: left;
      font-weight: 700;
      margin-right: 20px;
    }
    .x_case_name1{
      height: 50px;
      font-size: 16px;
      font-weight: 700;
    }
    .date_edit{
      width: 100%;
      border-bottom: 1px solid #ebeef5;
      margin-bottom: 15px;
      font-size: 14px;
      box-sizing: border-box;
      padding: 0 20px;
      word-wrap:break-word;
      word-break:break-all;
      overflow: hidden;
    }
    .date_edit_img  img{
      margin:0 auto;
      width:auto;
      height:auto;
      max-width:100%;
      max-height:100%;
    }
    .date_edit_img p{
      line-height: 30px;
      font-size: 14px;
    }
    .x_case_width{
      width: 33%;
      float: left;
    }
    .x_case_search{
      width: 270px;
      /*height: 50px;*/
    }
    .date_cover{
      width: 100%;
      height: 500px;
    }
    .date_cover_img{
      width:100%;
      height:186px;
      max-width:100%;
      max-height:100%;
    }
    .date_cover_img img{
      width:auto;
      height:186px;
      display: block;
      max-width:100%;
      max-height:100%;
      margin: 0 auto;
    }
    .date_cover_img:hover{
      cursor: pointer;
    }
    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }
    .x_lable_img:hover{
      cursor: pointer;
    }
    .date_brief{
      width: 100%;
      border-bottom: 1px solid #ebeef5;
      margin:15px 0px;
      line-height: 30px;
      text-indent:20px;
      word-wrap:break-word;
      word-break:break-all;
      overflow: hidden;
    }
    .clearfix:after {
      clear: both
    }
    .x_case_edit{
      float: right;
      width:100px;
      font-size: 14px;
      margin-right: 30px;
    }
    .x_case_download{
      float: right;
      margin-right: 60px;
    }
    .case_p_width{
      line-height: 30px;
    }
    .case_p_width span{
      display: inline-block;
      width: 30%;
      font-size: 14px;
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
    .x_lable{
      display: inline-block;
      text-align: center;
      width: auto;
      height: 24px;
      border-radius: 15px;
      border: 1px solid #99d4ff;
      font-size: 12px;
      line-height: 24px;
      color:#99d4ff;
      padding: 0 15px;
      margin-right: 10px;
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
    .x_lable_img{
      background: url("../../.././images/parse.png") no-repeat;
      background-position: 18px 5px;
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
    .el-icon-edit:hover{
      cursor: pointer;
    }
    ts-enter-active,
    ts-leave-active{
      transition:all .5s;
    }
    ts-enter,
    ts-leave-active{
      transform: translate(100%,0);
    }
    @media screen and (max-width: 1366px) {
      .el-dialog{
        width: 68%;
      }
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
