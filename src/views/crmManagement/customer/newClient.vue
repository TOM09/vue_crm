<!--新建客户组件-->
<template>
  <div>
  <el-form class="newClient" :model="form" :label-position="'right'"  ref="form"  label-width="150px">
    <el-card>
      <div class="s_new_title">基础信息</div>
      <el-form-item prop="company" label="客户名称(必填)">
          <el-input v-model="form.company" autosize placeholder="请输入内容" class="s_client_width"></el-input>
      </el-form-item>
      <el-form-item prop="rank" label="客户级别(必填)">
        <el-select v-model="form.rank" clearable placeholder="请选择" class="s_client_width">
          <el-option
            v-for="item in rank"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="customer_source" label="客户来源(必填)">
        <el-cascader
          class="s_client_width"
          expand-trigger="click"
          filterable
          clearable
          :options="customer_source"
          v-model="form.customer_source"
          @change="changeSource">
        </el-cascader>
      </el-form-item>
      <el-form-item prop="ask_method" label="咨询方式(必填)" v-if="judge">
        <el-select v-model="form.ask_method" clearable filterable placeholder="请选择" class="s_client_width">
          <el-option
            v-for="item in options"
            :key="item.cost_type"
            :label="item.label"
            :value="item.cost_type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="ask_method" label="咨询方式(必填)" v-if="judgeLine">
        <el-select v-model="form.ask_method" clearable filterable placeholder="请选择" class="s_client_width">
          <el-option
            v-for="item in line"
            :key="item.cost_type"
            :label="item.label"
            :value="item.cost_type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="ask_method" label="咨询方式(必填)" v-if="judgeLinen">
        <el-select v-model="form.ask_method" clearable filterable placeholder="请选择" class="s_client_width">
          <el-option
            v-for="item in linen"
            :key="item.cost_type"
            :label="item.label"
            :value="item.cost_type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="ask_method" label="咨询方式(必填)" v-if="judgeHm">
        <el-select v-model="form.ask_method" clearable filterable placeholder="请选择" class="s_client_width">
          <el-option
                  v-for="item in hm"
                  :key="item.cost_type"
                  :label="item.label"
                  :value="item.cost_type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="industry" label="行业">
        <el-select v-model="form.industry" clearable filterable placeholder="请选择" class="s_client_width">
          <el-option
            v-for="item in industry"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="scale" label="公司规模">
        <el-select v-model="form.scale" clearable filterable placeholder="请选择" class="s_client_width">
          <el-option
            v-for="item in scale"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="location" label="客户地址(必填)">
        <el-select v-model="form.location" filterable placeholder="请选择省" class="s_client_width">
          <el-option
            v-for="item in location"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="address" label="详细地址(必填)">
        <el-input v-model="form.address" autosize placeholder="请输入详细地址" class="s_client_width"></el-input>
      </el-form-item>
      <el-form-item label="咨询日期" class="s_client_width">
        <el-date-picker
          class="s_client_width"
          v-model="form.ask_time"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="brief" label="备注">
        <el-input type="textarea"  v-model="form.brief" :autosize="{minRows: 2}"  class="s_client_width"></el-input>
      </el-form-item>
    </el-card>
    <el-card class="Contacts">
      <div class="s_new_title">联系人</div>
      <el-table :data="tableData" :fit="true">
        <el-table-column label="姓名(必填)">
          <template slot-scope="scope">
              <el-input v-model="form.link_name" placeholder="请输入"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="联系类型(必填)">
          <template slot-scope="scope">
            <el-select v-model="form.link_type">
              <el-option
                v-for="item in link_type"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="联系方式（必填）">
          <template slot-scope="scope">
            <el-input v-model="form.telephone" placeholder="请输入"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="部门">
          <template slot-scope="scope">
            <el-input v-model="form.department" placeholder="请输入"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="职务">
          <template slot-scope="scope">
            <el-input v-model="form.duty" placeholder="请输入"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="联系人备注">
          <template slot-scope="scope">
              <el-input type="textarea"  v-model="form.remarks" autosize ></el-input>
          </template>
        </el-table-column>
        </el-table>
        <div class="s_client_btn">
          <el-button type="primary" @click="confirm_add('form')">确认添加</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </div>
    </el-card>
  </el-form>
  </div>
</template>
<script>
  import Util from '@/libs/util';
  export default {
    name:'newClient',
    data () {
      return {
        judge:false,
        judgeLine:false, //线下
        judgeLinen:false, //400
        judgeHm:false, //忽米
        options: [{
            cost_type: 1,
            label: 'IM'
        }, {
            cost_type: 2,
            label: 'QQ'
        }, {
            cost_type: 3,
            label: '电话'
        }, {
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
        }
        ],
        line: [{
            cost_type: 5,
            label: '自拓'
        }, {
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
        form: {
          company: '',
          rank: '',
          industry: '',
          customer_source:[],
          location: '',
          scale: '',
          address: '',
          link_name: '',
          telephone: '',
          department: '',
          duty: '',
          link_type: '',
          remarks: '',
          ask_method:'',  //后加的字段（咨询方式）
          // ask_time:new Date().toLocaleDateString(),
          ask_time: new Date().toLocaleString('chinese',{hour12:false}),
          brief:'', //备注
        },
        dialogVisible:false,
        rank: [],
        industry: [],
        location: [],
        customer_source:[],
        scale: [],
        array: [],
        link_type: [{
          value: '1',
          label: '电话'
          }, {
          value: '2',
          label: '微信'
          }, {
          value: '3',
          label: 'QQ'
        }],
        tableData: [{}]
      }
    },
    methods: {
      deleteRow () {
         this.tableData.push({

         })
      },
      client_show(){
        this.$get( 'client/index_show')
          .then((data) => {
            this.rank = data.content.root;
            this.industry = data.content.industry;
            this.location = data.content.location;
            this.scale = data.content.scale;
            let customer = data.content.customer_source;
            this.customer_source = Util.obj2Arr(customer);
            this.city = data.content.location;
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
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        confirm_add (formName){
            if (!this.form.company) {
                this.$message({
                    message: '请填写客户名称',
                    type: 'warning'
                });
            } else if (!this.form.rank) {
                this.$message({
                    message: '请选择客户级别',
                    type: 'warning'
                });
            } else if (!this.form.location && this.form.location != '0') {
                this.$message({
                    message: '请选择客户所在省份',
                    type: 'warning'
                });
            } else if (!this.form.address) {
                this.$message({
                    message: '请填写客户详情地址',
                    type: 'warning'
                });
            } else if ((this.judge && !this.form.ask_method) || (this.judgeLine && !this.form.ask_method)) {
                this.$message({
                    message: '请选择咨询方式',
                    type: 'warning'
                });
            } else if (!this.form.link_name) {
                this.$message({
                    message: '请填写联系人姓名',
                    type: 'warning'
                });
            } else if (!this.form.link_type) {
                this.$message({
                    message: '请选择联系类型',
                    type: 'warning'
                });
            } else if (!this.form.telephone) {
                this.$message({
                    message: '请填写联系方式',
                    type: 'warning'
                });
            } else {
                this.$post( 'client/store',this.form)
                  .then( (data) => {
                    if(data.code){
                        this.$message({
                          message: data.errorMsg,
                          type: 'success'
                        });
                        this.form = {};
                        this.$router.push({name: 'clientDetail',params: {id: data.content}})
                    } else {
                      this.$message({
                        type:'warning',
                        message:data.errorMsg,
                        duration:6000
                      });
                      return false;
                    }
                  })
                  .catch(() => {})
            }
        },
    },
    created () {
        this.client_show();
    },
}
</script>

<style lang="less" scoped>
    .newClient {
        .s_new_title {
            width: 100%;
            height: 50px;
            font-size: 19px;
            float: left;
            text-align: left;
            font-weight: 700;
        }
        .s_client_width {
            width: 300px;
        }
        .s_client_btn {
            width: 400px;
            float: left;
            margin-top: 30px;
            margin-left: 75%;
            padding-bottom: 40px;
        }
        .el-select .el-input{
            width: 300px;
        }
        .Contacts {
            margin-top: 15px;
        }
        .Contacts .el-select .el-input{
            width: auto;
        }

    .s_client_new_loca {
        width: 100%;
        height: 40px;
    }
    .s_new_tion {
        width: 100%;
        float: left;
        margin-left: 50px;
    }
    .s_new_tion_content {
        width: 250px;
        height: 50px;
        float: left;
    }
    .s_new_tion_content:nth-of-type(2) {
        margin-left: 30px;
    }
    .s_new_tion_contents {
        width: 500px;
        height: 50px;
        float: left;
        margin-left: 30px;
    }
    .s_client_per {
        width: 100%;
        font-size: 18px;
        text-align: left;
        margin-top: 50px;
        font-weight: 700;
    }
        .x_client_width{
            width: 500px;
        }
}
    </style>
