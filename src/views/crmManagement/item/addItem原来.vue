<!--新建项目组件-->
<template>
  <div class="hblock_itemAdd">
    <el-card>
      <div class="s_new_title">项目信息</div>
      <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm">
        <el-form-item label="项目名称(必填)" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入项目名称" class="s_additem_form">
          </el-input>
        </el-form-item>
        <el-form-item  v-if="is_client" label="关联客户(必填)" prop="client_id">
          <el-select v-model="ruleForm.client_id"  @change="clientChange" filterable placeholder="请选择" class="s_additem_form">
            <el-option
                v-for="item in selectCustomers"
                :key="item.id"
                :label="item.company"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目来源(必填)" prop="origin">
          <el-cascader
              class="s_additem_form"
              clearable
              filterable
              expand-trigger="hover"
              :options="origin"
              v-model="ruleForm.origin">

          </el-cascader>
        </el-form-item>
        <el-form-item label="项目意向(必填)" prop="intention">
          <el-select v-model="ruleForm.intention" filterable placeholder="请选择项目状态" class="s_additem_form">
            <el-option
                v-for="item in intention"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目状态(必填)" prop="stage">
          <el-select v-model="ruleForm.stage"   filterable placeholder="请选择项目状态" class="s_additem_form">
            <el-option
                v-for="item in itemState"
                :key="item.id"
                :label="item.name"
                :value="item.id.toString()">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流单原因(必填)" v-if="this.ruleForm.stage == 9">
          <el-select v-model="ruleForm.reason"  filterable placeholder="请选择流单原因" class="s_additem_form">
            <el-option
                v-for="item in reason"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流单说明" v-if="this.ruleForm.stage == 9">
          <el-input
              class="s_additem_form"
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              v-model="ruleForm.reason_brief">
          </el-input>
        </el-form-item>
        <el-form-item label="项目预算(必填)" prop="future_price" >
          <el-input v-model="ruleForm.future_price" placeholder="￥(元)" type="number" class="s_additem_form" @change="priceRuleFun()"></el-input>
        </el-form-item>

        <el-form-item v-for="(domain, index) in ruleForm.domains" label="选择产品(必填)" :key="domain.key" :prop="'domains.' + index + '.value'" >
          <el-cascader
              expand-trigger="hover"
              v-model="domain.value"
              :show-all-levels="false"
              placeholder="请选择"
              :options="product"
              filterable
              @change="handleChangeproduct"
              class="s_additem_form">
          </el-cascader>
          <el-button @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>

        <el-form-item>
          <el-button @click="addDomain">新增产品</el-button>
        </el-form-item>
        <el-form-item label="预计签约时间" prop="expect_sign_time" >
          <el-date-picker
              v-model="ruleForm.expect_sign_time"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="附件" >
          <upload @fileStatus="fileStatus"  @fileTrue="fileTrue" :success="success"></upload>
        </el-form-item>
        <el-form-item label="备注" >
          <el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入项目备注信息" class="s_additem_form"></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 30px;">
          <el-button type="primary" @click="onSubmit('ruleForm')">确认添加</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
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
        ruleForm: {
          client_id: '',
          origin: [],
          expect_sign_time: '',
          future_price: '',   // 项目预算
          product_id: [],     // 产品
          intention: '',
          remark: '',         // 项目备注
          stage: '',      	// 项目状态
          name: '',           // 项目名称
          file: [],
          domains: [{
            value:[]
          }],
          reason:'',
          reason_brief:'',
          consult_id:''
        },
        selectCustomers: [],
        product_id: [],
        itemState: [],
        intention: [],
        client_id: [],
        product: [],
        origin: [],
        // shop: [],
        reason:[],
        success: false,
        is_client:true,
      };
    },
    methods: {
      priceRuleFun(){
        if(this.ruleForm.future_price < 0){
          this.$message.error('项目预算输入错误');
          this.ruleForm.future_price = "";
        }
      },
      removeDomain(item) {
        let index = this.ruleForm.domains.indexOf(item);
        if (index !== -1) {
          this.ruleForm.domains.splice(index, 1);
          this.ruleForm.product_id.splice(index, 1);
        }
      },
      addDomain() {
        this.ruleForm.domains.push({
          value: [],
          key: Date.now(),
        });
      },
      fileTrue(data){
        this.success = data;
      },
      handleChangeproduct(value) {
        if(value[value.length-1]){
          this.ruleForm.product_id.push(value[value.length-1]);
        } else {
          this.ruleForm.product_id.splice(0,1);
        }
      },
      fileStatus(data) {
        this.ruleForm.file = data;
      },
      onSubmit (obj) {
        if (!this.ruleForm.name){
          this.$message({
            message: '请填写项目名称',
            type: 'warning'
          });
        } else if (!this.ruleForm.client_id) {
          this.$message({
            message: '请选择关联客户',
            type: 'warning'
          });
        } else if (this.ruleForm.intention.length === 0 ) {
          this.$message({
            message: '请选择项目意向',
            type: 'warning'
          });
        } else if (!this.ruleForm.stage) {
          this.$message({
            message: '请选择项目状态',
            type: 'warning'
          });
        } else if (this.ruleForm.stage == 9 && this.ruleForm.reason.length == 0) {
          this.$message({
            message: '请选择流单原因',
            type: 'warning'
          });
        } else if (this.ruleForm.reason == 99 && !this.ruleForm.reason_brief) {
          this.$message({
            message: '请输入流单说明',
            type: 'warning'
          });
        }else if (!this.ruleForm.future_price) {
          this.$message({
            message: '请填写项目预算',
            type: 'warning'
          });
        } else if (this.ruleForm.product_id.length != 0){
          this.$post( 'crmManagement/item/addItem',this.ruleForm)
            .then( (data) => {
              if(data.code){
                this.$message({
                  message: data.errorMsg,
                  type: 'success'
                });
                this.$store.commit('removeTag','addItem');
                this.$store.commit('closePage','addItem');
                this.ruleForm = {};
                this.success = true;
                this.ruleForm.product_id = [];
                this.ruleForm.domains = [{value: []}];
                this.$router.push({name: 'itemDetail',params:{id:data.content}})
              } else {
                this.$message.error(data.errorMsg);
              }
            })
            .catch(() => {
              this.$message.error('服务器错误，请稍后重试');
            })
        } else {
          this.$message.error('产品必选');
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      //选项 产品列表
      addItem() {
        this.$get( 'crmManagement/item/addItem')
          .then((data) => {
            this.selectCustomers = data.content.client;
            this.intention = data.content.intention;
            let origin = data.content.origin;
            this.origin = Util.obj2Arr(origin);

            this.product = data.content.product;
            this.reason = data.content.reason;
            // this.shop = data.content.shop;
            this.itemState = data.content.stage;

          })
          .catch((data) => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      //选择客户自动匹配项目来源
      clientChange(val) {
        this.$get('getCliTrench/' + val)
          .then((data) => {
            this.ruleForm.origin = data;
          })
          .catch(() => {})
      },
      fetchData() {
        this.ruleForm.client_id = this.$route.params.id ? this.$route.params.id : '';
        this.ruleForm.origin = this.$route.params.origin ? this.$route.params.origin : [];
      }
    },
    watch: {
      '$route': 'fetchData'
    },
    created (){
      this.addItem();
      this.fetchData();
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

</style>
