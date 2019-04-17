// 客户详情页面所有数据
<template>
  <div class="clientDetails">
    <el-card>
        <ul class="s_details_company">
          <li class="s_details_fuze s_details_fuze2">{{ date.sn_no }}</li>
          <li class="s_details_fuze s_details_fuze222">创建人:{{ date.nickname }}</li>
          <li class="s_details_fuze s_details_fuze222">创建时间:{{date.create_time}}</li>
        </ul>
        <el-button type="primary" v-show='date.is_change' class='isChangebtn' @click='changePeople'>转移创建人</el-button>
    </el-card>

    <el-card class='yejiHeader'>

        <div>
          <span class='ispanmargin'>业绩详情</span><i @click="charge" v-show='date.is_change' size="medium" class="el-icon-edit iPenhover"></i>          
        </div>
    </el-card>

      <el-card>
        <div>
          <span class='aboatOder'>关联订单</span>   
          <p class='aboatOderPFont'>
              <el-button type="text" @click="clientDetailOrder(date.order_id 
)">{{ date.order_name }}({{ date.order_code}})</el-button></p>     
        </div>

        <div class='ticheng'>
          <span class='aboatOder'>提成业绩</span>   

          <el-table :data="date.rate_list" border style="width: 30%"  class='aboatOderP'>
            <el-table-column prop="dis_nickname" label="姓名"></el-table-column>
            <el-table-column prop="rate" label="提成占比（%）"></el-table-column>
          </el-table>
        </div>
      </el-card>
     
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="float: left;color:#333333;font-size:16px;font-weight:700;">操作日志</span>
                <div style="clear:both"></div>
            </div>
            <el-steps direction="vertical" :active="1" space='80px'>
                <el-step
                    v-for="item in operation"
                    v-bind:key="item.id"
                    :title="item.opera_nickname + item.create_time"
                    :description="item.content"
                     class='stepsLog'
                >
                </el-step>
            </el-steps>
        </el-card>

        <el-dialog title="编辑业绩" :visible.sync="dialogFormVisible" :modal="false" width="700px"> 
            <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm">
                <el-form-item label="关联订单" prop="order_id" class='is-required'>
                    <el-input class="s_additem_btn2" @focus.prevent="dialogFollow" :disabled="true" v-model="date.sn_no" placeholder="请选择"></el-input>
                </el-form-item>

                <div v-for="(domain,index) in ruleForm.param"  :key="index">
                    <el-form-item :label="'提成人员'+ (index+1)" 
                        :prop="'param.' + index + '.dis_dd_id'"  
                        class='is-required royaltyBiliFath1'
                        :rules="[{ required: true, message: '请选择提成人员',trigger:'blur'}]"
                    >
                        <el-select v-model="domain.dis_dd_id"  clearable filterable placeholder="请选择" class="s_additem_form">
                        <!-- @change="handleChangeproduct" -->
                            <el-option
                                v-for="item in person"
                                :key="item.dd_id"
                                :label="item.nickname"
                                :value="item.dd_id">
                            </el-option>
                        </el-select>
                        <el-form-item  :prop="'param.' + index + '.rate'" label="提成占比" 
                        class='is-required royaltyBili' onpaste="alert('请手动输入价格');return false;"
                        :rules="[{ required: true, message: '请填写提成占比',trigger:'blur'}]"
                        >
                            <input type="number"  @keydown="handleInput2" class="s_additem_btn s_client_widthInput" v-model="domain.rate" placeholder="%">
                        </el-form-item>
                        <el-button class='deleteBtn' type="text" @click.prevent="removeDomain(domain)" v-show = 'ruleForm.param.length != 1'>删除</el-button>
                        <div style='clear:both'></div>

                    </el-form-item>
                </div>
               <!-- <el-form-item v-for="(domain,index) in ruleForm.domains" :label="'提成人员'+ (index+1)" :key="domain.key" :prop="'domains.' + index + '.value'"  class='is-required royaltyBiliFath1'>
                <el-select v-model="domain.value" @change="handleChangeproduct" clearable filterable placeholder="请选择" class="s_additem_form">
                    <el-option
                        v-for="item in person"
                        :key="item.dd_id"
                        :label="item.nickname"
                        :value="item.dd_id">
                    </el-option>
                </el-select>
                    <el-form-item  label="提成占比" class='is-required royaltyBili' onpaste="alert('请手动输入价格');return false;">
                        <input type="number"  @keydown="handleInput2" class="s_additem_btn s_client_widthInput" v-model="ruleForm.rate[index]" placeholder="%">
                    </el-form-item>
                    <el-button class='deleteBtn' type="text" @click.prevent="removeDomain(domain)" v-show = 'ruleForm.domains.length != 1'>删除</el-button>
                </el-form-item> -->

                <el-form-item>
                    <el-button @click="addDomain">增加</el-button>
                </el-form-item>
        
                <el-form-item style="margin-left: 30px;">
                <el-button type="primary" @click="onSubmit('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="转移创建人" :visible.sync="changePeopleDilog" :modal="false" width="600px">
          <div class='borderBottom'></div>
          <ul class='formRoyatty'>
              <li>创建人</li>
              <li>新创建人</li>
          </ul>
            <el-form :model="ruleForm2" class='inputdata'>
                <el-form-item class='is-required royaltyBiliFather2'>
                    <el-input class='royaltyBili2' v-model="input1" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item prop="client" class="s_client_item royaltyBiliFather2">
                    <el-select v-model="ruleForm2.create_dd_id" clearable filterable placeholder="请选择" class="s_order_search">
                        <el-option
                                v-for="item in person"
                                :key="item.dd_id"
                                :label="item.nickname"
                                :value="item.dd_id">
                        </el-option>
                    </el-select>
                </el-form-item>
            <div class='borderBottom borderBottom2'></div>
                 <el-form-item style="margin: 20px 0 0 320px;" class='formBtn'>
                    <el-button type="primary" @click="onSubmit2('ruleForm2')">确认</el-button>
                    <el-button @click="changePeopleDilog=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

      </div>
</template>

<script>
export default {
    data () {
      return {
        input1:'',
        changePeopleDilog:false,
        paramdis_dd_id:'',
        dialogFormVisible:false,
        ruleForm2:{
          sn_no:'',
          create_dd_id:''
        },
// 客户详情展示的数据
        date: {
          sn_no:'',
          company: '',        // 客户名称
          industry: '',       // 客户行业
          source: '',         // 客户来源
          rank: '',           // 客户级别
          scale: '',          // 公司规模
          location: '',       // 公司省市地址
          address: '',        // 公司详细地址
          nickname: '',       // 销售负责人
          department: '',     // 负责人的部门
          id: '',           // 客户编号
          code: '',
          partner:[],       //共同负责人
          ask_method:'',    //咨询方式
          ask_time:'',
          brief:'',
          first_success_time:'',
          rate_list:[]
        },
        operation:[],
         ruleForm:{
            sn_no:'',
            param: [{
                rate_id:'',
                dis_dd_id:'', 
                rate:''
            }]
        }
      }
    },
    computed: {
        person () {
            return this.$store.state.app.commonPerson;
        }
    },
    methods:{
        // 跳转订单
      clientDetailOrder (id) {
        this.$router.push({name: 'orderDetail',params: {id: id}});
      },
      changePeople(){
        this.changePeopleDilog = true;
      },
        resetForm(){
            this.dialogFormVisible = false;
        },
        onSubmit2(){
            this.$post( 'orderRoyalty/changeCreator',this.ruleForm2)
                .then( (data) => {
                if(data.code){
                    this.$message({
                        message: data.content,
                        type: 'success'
                    });
                    this.changePeopleDilog = false;
                    this.ruleForm2.sn_no = '';
                    this.ruleForm2.create_dd_id = '';
                    setTimeout(() => {
                        location.reload()
                    }, 100);
                    
                } else {
                    this.$message.error(data.errorMsg);
                }
                })
                .catch(() => {
                this.$message.error('服务器错误，请稍后重试');
                })
        },
        sumArr(arr){
            return eval(arr.join("+"));
        },
        onSubmit (ruleForm) {
            this.$refs[ruleForm].validate((valid) => {
                if (valid) {
                    const element = [];
                    for (let i = 0; i < this.ruleForm.param.length; i++) {
                        element[i] = parseFloat(this.ruleForm.param[i].rate);
                    }
                    this.sumArr(element);
                    if (this.sumArr(element) != 100) {
                    this.$message({
                        message: '业绩提成总和应为100',
                        type: 'warning'
                    });
                    }else{
                        this.$post( 'orderRoyalty/editRoyalty',this.ruleForm)
                        .then( (data) => {
                        if(data.code){
                            this.$message({
                            message: data.content,
                            type: 'success'
                            });
                            this.dialogFormVisible = false;
                            this.ruleForm = {};
                            setTimeout(() => {
                                    location.reload()
                                }, 100);
                        } else {
                            this.$message.error(data.errorMsg);
                        }
                        })
                        .catch(() => {
                        this.$message.error('服务器错误，请稍后重试');
                        })
                    }
                }
            })
        },
        removeDomain(item) {
            let index = this.ruleForm.param.indexOf(item);
            if (index !== 0) {
            this.ruleForm.param.splice(index, 1);
            }
        },
         addDomain() {
            this.ruleForm.param.push({
                key: Date.now(),
                rate_id:0
            });
            // this.date.rate_list.push({
            //     value: [],
            //     key: Date.now(),
            // });
            // this.date.rate_id.push(0);
      },
        handleChangeproduct(value) {
        this.ruleForm.dis_dd_id.push(value);
        // if(value[value.length-1]){
        //   this.ruleForm.dis_dd_id.push(value[value.length-1]);
        // } else {
        //   this.ruleForm.dis_dd_id.splice(0,1);
        // }
      },
        charge(){
            this.dialogFormVisible = true;
        },
         handleInput2(e) {
      // 通过正则过滤小数点后两位
        e.target.value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || null
      },
          // 客户详情的所有数据请求
      clientAdd () {
        this.$get( 'orderRoyalty/royaltyDetail',{sn_no:this.$route.params.id})
          .then( (data) => {
            this.date = data.content;
            this.ruleForm.param = data.content.rate_list;
            this.operation = data.content.opera_list;
            this.input1 = data.content.nickname;
            this.ruleForm2.sn_no = data.content.sn_no;
            this.ruleForm.sn_no = data.content.sn_no;

            this.date.rate_list = data.content.rate_list;
            // var dataList = data.content.rate_list;
            //   for (let i = 0; i < dataList.length; i++) {
            //       this.ruleForm.rate_id[i] = dataList[i].rate_id;
            //       this.ruleForm.dis_dd_id[i] = dataList[i].dis_dd_id; 
            //       this.ruleForm.rate[i] = dataList[i].rate;           
            //   }
            })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
    },
    created() {
        this.clientAdd();
    },
}
</script>

<style scoped>
.s_details_company{
    overflow: hidden;
    font-size:0; 
}
.s_details_fuze{
    float: left;
    margin-right: 5%;
    list-style: none;
     color: gray;
     vertical-align: bottom;
      font-size: 14px;
      display:inline-block;
      vertical-align:top;
}
.s_details_fuze2{
    font-size: 20px;
    color: #303133;
    margin-left: 0;
}
.isChangebtn{
    margin-top: 30px;
}
.ispanmargin{
    font-size: 18px;
    color: #303133;
    margin-right: 10px;
}
.el-card{
    margin-bottom: 20px;
}
.s_additem_btn2{
  width: 66%;
}
 .royaltyBiliFath1{
    /* overflow:hidden; */
  }
  .royaltyBili{
    float:left;
    width: 36%;
  }
  .s_additem_form {
    width: 30%;
    float: left;
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
   .deleteBtn{
    float:left;
    padding-left:2%; 
  }
  .yejiHeader{
    margin-bottom: 0;
    border-bottom: 1px solid #ebeef5;
  }
  .aboatOder{
    font-size: 16px;
  }
  
.ticheng{
      margin-top: 20px;
}
.aboatOderP{
  margin:10px 0 0 20px;
}

.el-table th{
    background: red;
  }
  .borderBottom{
    width: 100%;
    margin-bottom: 10px;
    border-top: 1px solid #eef2f9;
}
.royaltyBiliFather2{
    display: inline-block;
    width: 30%;
    margin: 10px 0 30px 20px;
}
.formRoyatty{
    overflow: hidden;
    margin: 20px 0 0 38px;
}
.formRoyatty li{
    float: left;
    list-style: none;
    width: 130px;
    text-align: center;
    font-size: 16px;
    padding: 20px;
    margin-right: 50px;
}
/* .stepsLog{
    margin-bottom: 10px;
} */
.s_details_fuze222{
    margin-top: 10px;
}
.aboatOderPFont .el-button{
    font-size: 16px;
    padding-left: 30px;
}
.iPenhover:hover{
    cursor:pointer;
}
</style>


