<!-- 新增咨询页面 -->
<template>
  <div class="addInquiry">
    <el-card>
      <div slot="header" class="s_new_title">联系信息</div>
      <el-form :model="ruleForm" :rules="rules"  ref="ruleForm" label-width="80px" class="demo-ruleForm">
        <div style="margin-top: 15px;" v-for="(item,index) in ruleForm.clientData" :key="index">
          <el-input placeholder="请输入" v-model="item.info" clearable style="width: 600px;" @blur="queryClient"  @change="clientClear()">
            <el-select v-model="item.type" slot="prepend" style="width: 80px;" placeholder="请选择">
              <el-option
                v-for="item in link_type"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button slot="append" @click="addTel(index)" :icon="le_iocn[index] ? 'el-icon-plus' : 'el-icon-minus'"></el-button>
          </el-input>
        </div>
        <div style="margin-top: 20px;float: left;margin-bottom:20px;">
          <el-button type="primary" @click="queryClient">查询</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card  v-if="clientShow">
      <div slot="header" class="s_new_title">客户信息</div>
      <el-table :data="clientList" border width="100%">
        <el-table-column prop="company" label="客户名称" width="150">
        </el-table-column>
        <el-table-column prop="rank" label="客户级别">
        </el-table-column>
        <el-table-column prop="customer_source" label="客户来源">
        </el-table-column>
        <el-table-column prop="location" label="所在地">
        </el-table-column>
        <el-table-column prop="consult_count" label="历史咨询数">
        </el-table-column>
        <el-table-column prop="link_info" label="联系人" align="center" width="520">
          <template slot-scope="scope">
            <el-table :data="scope.row.link_info" :show-header="false">
              <el-table-column prop="link_name"></el-table-column>
              <el-table-column prop="link_type"></el-table-column>
              <el-table-column prop="telephone"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-radio v-model="ruleForm.client_id" :label="scope.row.id">选择</el-radio>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-form :model="ruleForm" :label-position="'top'" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-card v-if="!clientShow">
        <div slot="header" class="s_new_title">客户信息</div>
        <el-form-item label="客户名称" prop="company" class="inquiryLeft">
          <el-input v-model="ruleForm.company" clearable placeholder="请输入" class="optionWidth"></el-input>
        </el-form-item>
        <el-form-item label="客户级别" prop="rank" class="inquiryLeft">
          <el-select v-model="ruleForm.rank" clearable placeholder="请选择" class="optionWidth">
            <el-option
              v-for="item in client_show.root"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行业" class="inquiryLeft">
          <el-select v-model="ruleForm.industry" filterable clearable placeholder="请选择" class="optionWidth">
            <el-option
              v-for="item in client_show.industry"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司规模" class="inquiryLeft">
          <el-select v-model="ruleForm.scale"  clearable placeholder="请选择" class="optionWidth">
            <el-option
                v-for="item in client_show.scale"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户地址"  prop="location" class="inquiryLeft">
          <el-select v-model="ruleForm.location" filterable clearable placeholder="请选择" class="optionWidth">
            <el-option
              v-for="item in index_show.location"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="address" class="inquiryLeft">
          <el-input v-model="ruleForm.address" clearable placeholder="请输入" class="optionWidth"></el-input>
        </el-form-item>
      </el-card>

      <!-- 
        type="date" 
        placeholder="选择日期"
        format="yyyy 年 MM 月 dd 日,HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
            -->
      <el-card>
        <div slot="header" class="s_new_title">咨询信息</div>
        <el-form-item label="咨询日期" clearable prop="ask_time" class="inquiryLeft">
          <el-date-picker
            v-model="ruleForm.ask_time"
            class="optionWidth"
            type="datetime"
            placeholder="选择日期时间"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="咨询类目" icon="el-icon-warning"  prop="pro_id" class="inquiryLeft">
          <el-cascader
            class="optionWidth"
            expand-trigger="click"
            filterable
            clearable
            :options="product"
            v-model="ruleForm.pro_id">
          </el-cascader>
        </el-form-item>
        <el-form-item class="inquiryLeft" >
          <el-popover
            placement="left"
            width="500"
            title="等级说明"
            trigger="hover">
          <el-table  :data="client_Intent" :show-header="false">
            <el-table-column width="50" property="name" label="日期">
            </el-table-column>
            <el-table-column width="400" property="info" label="姓名">
            </el-table-column>
          </el-table>
          <i slot="reference" style="position:absolute;left:83px;top:13px;" class="el-icon-question"></i>
          </el-popover>
          <el-form-item prop="client_Intent"  label="客户意向度">
            <el-select v-model="ruleForm.client_Intent" clearable placeholder="请选择" class="optionWidth">
              <el-option
                v-for="item in index_show.client_Intent"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item label="预算" prop="future_price" class="inquiryLeft">
          <el-input clearable v-model="ruleForm.future_price" type="number" class="optionWidth"></el-input>
        </el-form-item>
        <el-form-item label="咨询来源" prop="customer_source" class="inquiryLeft">
          <el-cascader
            class="optionWidth"
            expand-trigger="click"
            filterable
            clearable
            :options="trench"
            v-model="ruleForm.customer_source"
            @change="changeSource">
          </el-cascader>
        </el-form-item>
        <el-form-item label="是否有效" prop="is_valid" class="inquiryLeft">
          <el-select v-model="ruleForm.is_valid" clearable placeholder="请选择" @change="changeValid" class="optionWidth">
            <el-option
              v-for="item in isItValid"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否可跟进" prop="is_follow" class="inquiryLeft">
          <el-select v-model="ruleForm.is_follow" clearable placeholder="请选择" @change="changeFollow" class="optionWidth">
            <el-option
              v-for="item in isItValid"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="咨询方式" prop="ask_method" class="inquiryLeft">
          <el-select v-model="ruleForm.ask_method" clearable :disabled="judge" placeholder="请选择" class="optionWidth">
            <el-option
              v-for="item in methodsr"
              :key="item.cost_type"
              :label="item.label"
              :value="item.cost_type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="无效分类" prop="invalid_type" class="inquiryLeft">
          <el-select v-model="ruleForm.invalid_type" clearable placeholder="请选择" :disabled="classification" class="optionWidth">
            <el-option
              v-for="item in index_show.invalid_type"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <div style="clear: both"></div>
        <el-form-item prop="message_page" label="留言页面">
          <el-input type="textarea" clearable v-model="ruleForm.message_page" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item prop="breif" label="跟进反馈">
          <el-input type="textarea" clearable v-model="ruleForm.breif" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="处理结果" :show-message="ruleStatus">
          <el-radio-group v-model="ruleForm.status" @change="checkboxGroup">
            <el-radio :label="1">结束</el-radio>
            <el-form-item prop="end_reason" :show-message="disabled == 1"  style="display:inline-block;margin-left: 15px;">
              <el-select v-model="ruleForm.end_reason" :disabled="disabled !== 1" clearable placeholder="请选择">
                <el-option
                  v-for="item in index_show.end_reason"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-radio :label="2">再次跟进</el-radio>
            <el-radio :label="3">转销售主管</el-radio>
            <el-form-item prop="sale_manager_id" :show-message="disabled == 3" style="display:inline-block;margin-left: 15px;">
              <el-select v-model="profiles" :disabled="disabled !== 3" @change="handleCompany" placeholder="请选择" filterable clearable>
                <el-option
                    v-for="item in company_info"
                    :key="item.company_id"
                    :label="item.name"
                    :value="item.company_id">
                </el-option>
              </el-select>
              <el-select v-model="ruleForm.sale_manager_id" clearable :disabled="disabled !== 3" placeholder="请选择" filterable >
                <el-option
                  v-for="item in person"
                  :key="item.dd_id"
                  :label="item.nickname"
                  :value="item.dd_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-radio :label="4">转销售</el-radio>
            <el-form-item prop="sale_id" :show-message="disabled == 4" style="display:inline-block;margin-left: 15px;">
              <el-select v-model="profile" :disabled="disabled !== 4" @change="handleCompany" placeholder="请选择" filterable clearable>
                <el-option
                    v-for="item in company_info"
                    :key="item.company_id"
                    :label="item.name"
                    :value="item.company_id">
                </el-option>
              </el-select>
              <el-select v-model="ruleForm.sale_id" clearable :disabled="disabled !== 4" placeholder="请选择" filterable >
                <el-option
                  v-for="item in person"
                  :key="item.dd_id"
                  :label="item.nickname"
                  :value="item.dd_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="margin:20px 140px 40px 0px;float: right;">
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script>
  import Util from '@/libs/util'
  import Cookies from 'js-cookie'
  export default {
    name: "addInquiry",
    data() {
      return {
        tableClass:'tableClass',
        rules: {
          company: [
            { required: true, message: '请输入客户名称', trigger: 'blur' },
          ],
          rank: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          location: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          address: [
            { required: true, message: '请填写详细地址', trigger: 'blur' }
          ],
          // ask_time:[
          //   { type: 'string', required: true, message: '请选择日期', trigger: 'change' }
          // ],
          pro_id:[
            { type: 'array', required: true, message: '请选择', trigger: 'change' }
          ],
          client_Intent:[
            { required: true, message: '请选择', trigger: 'change' }
          ],
          future_price:[
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          customer_source:[
            { type: 'array', required: true, message: '请选择', trigger: 'change' }
          ],
          is_valid:[
            { required: true, message: '请选择', trigger: 'change' }
          ],
          is_follow:[
            { required: true, message: '请选择', trigger: 'change' }
          ],
          breif:[
            { required: true, message: '请填写跟进反馈', trigger: 'blur' }
          ],
          status:[
            { required: true, message: '请选择处理结果', trigger: 'blur' }
          ],
          end_reason:[{ required: true, message: '请选择', trigger: 'change' }], //结束
          sale_manager_id:[], //转销售主管
          sale_id:[], //转销售
          ask_method:[],
          invalid_type:[],
        },
        clientList:[],
        product:[],
        trench:[],
        client_show:{}, //客户初始化数据
        client_Intent:[], //客户满意
        link_type: [{
          value: 1,
          label: '电话'
        }, {
          value: 2,
          label: '微信'
        }, {
          value: 3,
          label: 'QQ'
        }],
        ruleForm: {
          clientData:[{
            type:1,
            info: ''
          }],
          client_id:'',
          company: '',
          rank: '',
          location: '',
          address: '',
          industry: '',
          scale:'',
          // ask_time: new Date().toLocaleString(),
          ask_time: new Date().toLocaleString('chinese',{hour12:false}),
          pro_id:[],
          customer_source:[],
          client_Intent:'',
          future_price:'',
          is_valid:'',
          is_follow:'',
          ask_method:'',
          message_page:'',
          breif: '',
          status:'',
          sale_manager_id:'',
          sale_id:'',
          end_reason:'',
          invalid_type:'', //无效分类
          leave_words_id:'', // 留言id
        },
        isItValid:[{
          value: 1,
          label: '是'
        }, {
          value: 2,
          label: '否'
        }],
        clientShow:false,
        judge:true,
        classification:true,
        disabled:10, //结果的状态
        le_iocn:[{}],
        methodsr:[], //咨询方式
        options: [{
          cost_type: 1,
          label: 'IM'
        },{
          cost_type: 2,
          label: 'QQ'
        },{
          cost_type: 3,
          label: '电话'
        },{
          cost_type: 4,
          label: '派单'
        }, {
            cost_type: 11,
            label: '顾问推广'
        }, {
            cost_type: 12,
            label: '优选派单'
        }, {
            cost_type: 13,
            label: '严选派单'
        }],
        line: [{
          cost_type: 5,
          label: '自拓'
        },{
          cost_type: 6,
          label: '投标扫单'
        }],
        linen:[{
          cost_type: 7,
          label: '留言'
        },{
          cost_type: 8,
          label: 'QQ'
        },{
          cost_type: 9,
          label: '电话'
        },{
          cost_type: 10,
          label: '商桥'
        }],
        hm:[
            {
                cost_type: 7,
                label: '留言'
            },{
                cost_type: 8,
                label: 'QQ'
            },{
                cost_type: 9,
                label: '电话'
            },{
                cost_type: 10,
                label: '商桥'
            }
        ],
        ruleStatus:true,
        company: {
          company_id: '',
          dept: ''
        },
        profile: JSON.parse(Cookies.get('company_id')),
        profiles: JSON.parse(Cookies.get('company_id'))
      }
    },
    computed: {
      company_info () {
        return this.$store.state.app.company_info;
      },
      person () {
        return this.$store.state.app.person;
      },
      menuList () {
        return this.$store.state.app.menuList;        // 导航菜单
      }
    },
    methods:{
      handleCompany (val) {
        this.company.company_id = val;
        this.$store.dispatch('dept', this.company);
      },
      addTel(index) {
        index > 0 ? this.ruleForm.clientData.pop({type:1,info:''}) : this.ruleForm.clientData.push({type:1,info:''})
      },
      clientClear() {
        this.clientShow = false;
        this.clientList = [];
        this.ruleForm.client_id = '';
      },
      queryClient() {
        this.ruleForm.client_id = '';
        let form = {};
        form.clientData = this.ruleForm.clientData;
        this.$post('consult/clientSearch',form)
          .then((data) => {
            if(data.code) {
              if(data.content.client_data.length > 0) {
                this.clientShow = true;
                this.clientList = data.content.client_data;
              }else {
                this.$message({
                  type:'warning',
                  message:'无该客户信息，请新建客户！'
                });
              }
            }
          })
          .catch(() => {
          })
      },
      //处理结果函数
      checkboxGroup(val) {
        if(this.ruleForm.status){
          this.ruleStatus = false;
        }
        let num = parseInt(val);
        this.disabled = num;
        switch(num){
          case 1:
            this.rules.end_reason = [{ required: true, message: '请选择', trigger: 'change' }];
            this.ruleForm.sale_manager_id = '';
            this.ruleForm.sale_id = '';
            break;
          case 2:
            this.ruleForm.end_reason = '';
            this.ruleForm.sale_manager_id = '';
            this.ruleForm.sale_id = '';
            this.rules.end_reason = [];
            this.rules.sale_manager_id = [];
            this.rules.sale_id = [];
            break;
          case 3:
            this.rules.sale_manager_id = [{ required: true, message: '请选择', trigger: 'change' }];
            this.rules.end_reason = [];
            this.rules.sale_id = [];
            this.ruleForm.end_reason = '';
            this.ruleForm.sale_id = '';
            break;
          case 4:
            this.rules.sale_id = [{ required: true, message: '请选择', trigger: 'change' }];
            this.rules.end_reason = [];
            this.rules.sale_manager_id = [];
            this.ruleForm.end_reason = '';
            this.ruleForm.sale_manager_id = '';
            break;
        }
      },
      //咨询来源函数
      changeSource (val){
        if(val[0] == 1){
          this.judge = false;
          this.methodsr = this.options
          this.rules.ask_method = [{
            required: true, message: '请选择', trigger: 'change'
          }];
        }else if(val[0] === 4) {
          this.judge = false;
          this.methodsr = this.line;
          this.rules.ask_method = [{
            required: true, message: '请选择', trigger: 'change'
          }];
          this.ruleForm.ask_method = '';
        } else if (val[0] === 5) {
          this.judge = false;
          this.methodsr = this.linen;
          this.rules.ask_method = [{
            required: true, message: '请选择', trigger: 'change'
          }];
          this.ruleForm.ask_method = '';
        }else if (val[0] === 6) {
            this.judge = false;
            this.methodsr = this.hm;
            this.rules.ask_method = [{
                required: true, message: '请选择', trigger: 'change'
            }];
            this.ruleForm.ask_method = '';
        } else {
          this.judge = true;
          this.ruleForm.ask_method = '';
          this.rules.ask_method = [];
        }
      },
      changeValid(val) {
        if(val === 2) {
          this.classification = false;
          this.rules.invalid_type = [{ required: true, message: '请选择', trigger: 'change' }]
        } else {
          this.classification = true;
          this.rules.invalid_type = [];
          this.ruleForm.invalid_type = '';
        }
      },
      //是否可跟进change事件
      changeFollow(val) {
        if(val === 2){
          this.rules.rank = [];
          this.rules.location = [];
          this.rules.address = [];
          this.rules.future_price = [];
          this.ruleForm.rank ? this.ruleForm.rank : this.ruleForm.rank = 1;
          this.ruleForm.location ? this.ruleForm.location : this.ruleForm.location = 35;
          this.ruleForm.address ? this.ruleForm.address : this.ruleForm.address = '无';
        }else {
          this.rules.rank = [{ required: true, message: '请选择', trigger: 'change' }];
          this.rules.location = [{ required: true, message: '请选择', trigger: 'change' }];
          this.rules.address = [{ required: true, message: '请填写详细地址', trigger: 'blur' }];
          this.rules.future_price = [{ required: true, message: '请输入', trigger: 'blur' }];
        }
      },
      //重置
      resetForm(formName) {
        for(let key in this.ruleForm.clientData) {
          this.ruleForm.clientData[key].info = '';
        }
        this.clientShow = false;
        this.profile = '';
        this.profiles = '';
        this.clientList = [];
        this.$refs[formName].resetFields();
        this.ruleForm.ask_time = new Date().toLocaleDateString();
      },
      submitForm(formName) {
        for(let item in this.ruleForm.clientData) {
          if(this.ruleForm.clientData[item].info == '') {
            this.$message({
              type:'warning',
              message:'联系方式必填'
            });
            return false;
          }
          for(let val in this.ruleForm.clientData) {
            let key = this.ruleForm.clientData[item];
            let index = this.ruleForm.clientData[val];
            if(item !== val && key.info == index.info && key.type == index.type) {
              this.$message({
                type:'warning',
                message:'联系方式不可以重复'
              });
              return false;
            }
          }
        }
        if(this.clientShow && this.ruleForm.client_id == '') {
          this.$message({
            type:'warning',
            message:'请选择一个查询出来的客户再提交！'
          });
          return false;
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$post('consult/add',this.ruleForm)
              .then((data) => {
                if(data.code) {
                  this.$refs[formName].resetFields();
                  this.ruleForm.leave_words_id = '';
                  this.clientShow = false;
                  this.clientList = [];
                  this.ruleForm.clientData = [{type:1,info: ''}];
                  this.$store.commit('removeTag','addInquiry');
                  this.$store.commit('closePage','addInquiry');
                  this.$router.push({name:'inquiryDetail',params:{id:data.content}})
                } else {
                  this.$message({
                    type:'warning',
                    message:data.errorMsg
                  })
                }
              })
              .catch(() => {})
          }
        });
      },
      //初始化数据
      clientShows() {
        this.index_show = JSON.parse(localStorage.consultSearch);
        this.product = this.index_show.product;
        this.client_Intent = this.index_show.client_Intent;
        this.trench = Util.obj2Arr(this.index_show.trench);
        this.$get('client/index_show')
          .then((data) => {
            this.client_show = data.content;
          })
          .catch(() => {});
      },
    },
    created(){
      this.clientShows();
      this.$store.dispatch('dept',{});
      if(this.$route.params.name == 'messageDetail') {
        this.ruleForm = {
          clientData:[{
            type:1,
            info: ''
          }],
          client_id:'',
          company: '',
          rank: '',
          location: '',
          address: '',
          industry: '',
          scale:'',
          ask_time: '',
          pro_id:[{}],
          customer_source:[],
          client_Intent:'',
          future_price:'',
          is_valid:'',
          is_follow:'',
          ask_method:'',
          message_page:'',
          breif: '',
          status:'',
          sale_manager_id:'',
          sale_id:'',
          end_reason:'',
          invalid_type:'', //无效分类
          leave_words_id:'', // 留言id
        };
        this.ruleForm.leave_words_id = this.$route.params.id ? this.$route.params.id : this.ruleForm.leave_words_id;
        this.ruleForm.clientData[0].info = this.$route.params.contact ? this.$route.params.contact : this.ruleForm.clientData[0].info;
        this.ruleForm.ask_time = this.$route.params.create_time ? this.$route.params.create_time : this.ruleForm.ask_time;
        this.ruleForm.message_page = this.$route.params.page_source ? this.$route.params.page_source : this.ruleForm.message_page;
        this.ruleForm.breif = this.$route.params.breif ? this.$route.params.breif : this.ruleForm.breif;
        if(this.ruleForm.leave_words_id) {
          this.ruleForm.customer_source = [5,8];
          this.judge = false;
          this.methodsr = this.linen;
          this.ruleForm.ask_method = 7;
          this.rules.ask_method = [{
            required: true, message: '请选择', trigger: 'change'
          }];
        }
      }
    },
    activated(){
      this.clientShows();
      this.$store.dispatch('dept',{});
      this.ruleForm.leave_words_id = this.$route.params.id ? this.$route.params.id : this.ruleForm.leave_words_id;
      this.ruleForm.clientData[0].info = this.$route.params.contact ? this.$route.params.contact : this.ruleForm.clientData[0].info;
      this.ruleForm.ask_time = this.$route.params.create_time ? this.$route.params.create_time : this.ruleForm.ask_time;
      this.ruleForm.message_page = this.$route.params.page_source ? this.$route.params.page_source : this.ruleForm.message_page;
      this.ruleForm.breif = this.$route.params.breif ? this.$route.params.breif : this.ruleForm.breif;
      if(this.ruleForm.leave_words_id) {
        this.ruleForm.customer_source = [5,8];
        this.judge = false;
        this.methodsr = this.linen;
        this.ruleForm.ask_method = 7;
        this.rules.ask_method = [{
          required: true, message: '请选择', trigger: 'change'
        }];
      }
    }

  }
</script>

<style lang="less">
  .addInquiry{
    .tableClass{
      height: 20px;
      background: red;
    }
    .s_new_title{
      font-size: 16px;
      font-weight: 700;
    }
    .inquiryLeft{
      width: 33%;
      float: left;
    }
    .optionWidth{
      float: left;
      width: 60%;
      height: 40px;
    }
    .el-radio {
      margin-left: 10px;
    }
    .el-card{
      margin-bottom: 15px;
    }
  }
</style>
