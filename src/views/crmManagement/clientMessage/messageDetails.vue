// 客户详情页面所有数据
<template>
  <div class="messageDetails">
    <el-card>
      <div style="width: 100%;height: 80px;">
        <div class="s_details_company">
          <div class="s_details_title">留言编号:{{ date.word_code }}</div>
          <div class="s_details_fuze">
            负责人：
            <span>{{ date.leader }}</span>
          </div>
        </div>
        <div class="s_details_btn">
          <el-button type="primary" v-if="get_button" @click="get_message">领取留言 </el-button>
          <el-button type="primary" v-if="back_button" @click="dispose_message">处理 </el-button>
          <el-button type="primary" v-if="back_button" @click="back_message">退回 </el-button>
          <el-button type="primary" v-if="back_button" @click="closeLeaveWords()">关闭 </el-button>
        </div>
      </div>
      <div class="status">
        <p>状态</p>
        <p>{{date.status_desc}}</p>
      </div>
    </el-card>
    <el-card>
      <el-tabs :tab-position="tabPosition" v-model="tabsName">
        <el-tab-pane label="留言信息" name="clientDet">
          <el-card>
            <div slot="header" class="s_new_title">留言信息</div>
            <div class="x_details">
              <div class="x_details_child">
                <p><span>●</span>数据来源</p>
                <p>{{date.data_source}}</p>
              </div>
              <div class="x_details_child">
                <p><span>●</span>联系方式</p>
                <p>{{ date.contacts }}</p>
              </div>
              <div class="x_details_child">
                <p><span>●</span>留言类目</p>
                <p>{{ date.category}}</p>
              </div>
              <div class="x_details_child">
                <p><span>●</span>联系时间</p>
                <p>{{ date.contacts_time }}</p>
              </div>
              <div class="x_details_child">
                <p><span>●</span>地区</p>
                <p>{{ date.region}}</p>
              </div>
              <div class="x_details_child">
                <p><span>●</span>页面来源</p>
                <p>{{ date.page_source}}</p>
              </div>
              <div class="x_details_child">
                <p><span>●</span>客户姓名</p>
                <p>{{ date.name }}</p>
              </div>
              <div class="x_details_child">
                <p><span>●</span>提交时间</p>
                <p>{{date.create_time}}</p>
              </div>
              <div class="x_details_child">
                <p><span>●</span>留言内容</p>
                <div style="margin-left:15px;">{{ date.content }}</div>
              </div>
            </div>
          </el-card>
          <!--备注-->
          <el-card>
            <div class="x_details">
              <div class="x_details_child">
                <p>备注 <el-button v-show="edit_button" @click="editMessage()" icon="el-icon-edit" type="text"></el-button></p>
                <p style="height:10px;"></p>
                <span v-if="remark_show" style="color:black;">{{ date.remark }}</span>
                <span v-else="remark_show" style="color:black;">暂无</span>
              </div>
            </div>
          </el-card>

          <el-card v-if="showCloseRes">
            <div class="x_details">
              <div class="x_details_child">
                <p>关闭原因 </p>
                <span style="color:black;">{{ date.close_res }}</span>
              </div>
            </div>
          </el-card>

          <div>
            <inquiryInfo :contactlist="consultInfo"></inquiryInfo>
          </div>
          <el-card>
            <div slot="header" class="s_new_title">操作日志</div>
            <el-steps direction="vertical" :active="1">
              <el-step
                  v-for="item in operation"
                  v-bind:key="item.id"
                  :title="item.desc"
                  :description="item.content">
              </el-step>
            </el-steps>
          </el-card>
        </el-tab-pane>
      </el-tabs>
      <!--编辑备注内容-->
      <el-dialog title="编辑备注内容" :visible.sync="dialogFormVisible" :modal="false" width="700px">
        <el-form :model="form" label-width="150px">
          <el-form-item label="备注">
            <el-input
                class="s_item_form"
                type="textarea"
                :rows="5"
                placeholder="请输入至少五个字符"
                v-model="form.remark">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="formTrue">确 定</el-button>
        </div>
      </el-dialog>

      <!--关闭操作弹框-->
      <el-dialog title="关闭留言" :visible.sync="closeFormVisible" :modal="false" width="700px">
        <el-form :model="closeForm" label-width="100px" label-margin-top="-10px;">
          <el-form-item label="关闭原因">
            <el-input
                    class="s_item_form"
                    type="textarea"
                    :rows="5"
                    placeholder="请输入留言关闭原因"
                    style="margin-top: 10px;"
                    v-model="closeForm.close_res">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="subCloseLeaveWords">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import inquiryInfo from '../../components/w_message/consultInfo';
  import Util from '@/libs/util';
  export default {
    components:{
      inquiryInfo
    },
    data () {
      return {
        success:false,
        remark_show: false,
        get_button: false,    //领取留言按钮显隐
        back_button: false,  //退回留言按钮显隐
        edit_button: false, //编辑备注按钮显隐
        dialogFormVisible:false,
        closeFormVisible:false,
        showCloseRes:false,   //是否显示关闭原因
        tabsName: 'clientDet',
        // 留言详情展示的数据
        date: {
          name: '',               // 名称
          category: '',          // 留言类目
          contacts: '',         // 联系方式
          dd_id: '',           // 负责人id
          status: '',         // 状态id
          status_desc: '',   //状态中文
          id: '',            // 留言序号
          word_code: '',     // 留言编号
          data_source: '',   //数据来源
          contacts_time:'',  //联系时间
          region:'',         //留言地区
          page_source:'',   //页面来源
          leader:'',        //负责人
          department: '',   // 负责人的部门
          content: '',      //留言内容
          remark:'',
          create_time:'',   //提交时间
          close_res:''      //关闭原因
        },
        // 修改客户数据后台需要的参数
        form : {
          remark: '',
        },
        closeForm : {
          close_res: '',
        },
        tabPosition: 'top',
        contactList: [],                    // 联系人列表数据
        client: [],                     // 负责人的存放数据
        operation: [],                // 附件的备注信息
        // 表格数据
        tableData: [],
        orderData: [],
        projectData: [],
        consultInfo:[],  //关联的咨询列表
      }
    },
    methods: {
      changeClientInfo(val){
        this.$post('client/selectPartner',{'id':this.$route.params.id,'dd_ids':val})
          .then((data) => {
            if(data.code) {
              this.partner_sel = data.content;
            }else {
              this.$message({
                message: data.errorMsg,
                type:'wraning',
              })
            }
          })
          .catch(() => {
          })
      },
      // 确认领取留言
      get_message(){
        this.$confirm('此操作将领取留言, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post( 'words/receiveWords',{id:this.$route.params.id})
            .then( (data) => {
              if(data.code) {
                this.$message({
                  type: 'success',
                  message: '领取成功!'
                });
                this.clientAdd();
              }else {
                this.$message({
                  message: data.errorMsg,
                  type: 'warning'
                });
              }
            })
            .catch(() => {})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消领取'
          });
        });
      },
      // 确认退回留言
      back_message(){
        this.$confirm('此操作将退回留言, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$post( 'words/sendBack',{id:this.$route.params.id})
            .then( (data) => {
              if(data.code) {
                this.$message({
                  type: 'success',
                  message: '留言退回成功!'
                });
                this.clientAdd();
              }else{
                this.$message({
                  type: 'warning',
                  message: '该留言不能执行退回操作!'
                });
              }
            })
            .catch(() => {})

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消退回'
          });
        });
      },
      //处理留言
      dispose_message(){
        this.$router.push({
          name:'addInquiry',
          params:{
            name:this.$route.name,
            id:this.clild,
            contact:this.date.contacts,
            create_time:this.date.create_time,
            page_source:this.date.data_source,
            breif:this.date.content,
          }
        })
      },
      //打开编辑备注弹窗
      editMessage(){
        this.dialogFormVisible = true;
      },
      //打开关闭操作弹窗
      closeLeaveWords(){
        this.closeFormVisible = true;
      },
      //提交备注
      formTrue(){
        this.form.id = this.date.id;
        this.$post( 'words/editRemark',this.form)
          .then( (data) => {
            if(data.code) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
              this.dialogFormVisible = false;
              this.clientAdd();
            }else {
              this.$message({
                message: data.errorMsg,
                type: 'warning'
              });
            }
          })
          .catch(() => {})
      },
        //提交关闭操作
        subCloseLeaveWords(){
            this.closeForm.id = this.date.id;
            this.$post( 'words/closeLeaveWords',this.closeForm)
                .then( (data) => {
                    if(data.code) {
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        this.closeFormVisible = false;
                        this.clientAdd();
                    }else {
                        this.$message({
                            message: data.errorMsg,
                            type: 'warning'
                        });
                    }
                })
                .catch(() => {})
        },
      // 获取留言详情数据
      clientAdd () {
        this.$get( 'words/details',{id:this.$route.params.id})
          .then( (data) => {
            let client = data.content.wordsInfo;
            this.clild = client.id;
            this.date.word_code = client.word_code;
            this.date.name = client.name;
            this.date.leader = client.leader;
            this.date.department = client.department;
            this.date.data_source = client.data_source;
            this.date.contacts = client.contacts;
            this.date.category = client.category;
            this.date.contacts_time = client.contacts_time;
            this.date.region = client.region;
            this.date.page_source = client.page_source;
            this.date.content = client.content;
            this.date.create_time = client.create_time;
            this.date.status_desc = client.status_desc;
            this.date.id = client.id;
            this.date.close_res = client.close_res;
            this.date.remark = client.remark;
            this.operation = data.content.opearLog;
            this.consultInfo = data.content.consultInfo;
            this.edit_button = data.content.is_words_edit;
            this.remark_show = client.remark ? true : false ;
            // 1 领取    2 退回 操作按钮
            // is_admin
            if(client.status == 2 && data.content.is_admin) {
              this.back_button = true;
              this.get_button = false;
            }else if(client.status == 1) {
              this.get_button = true;
              this.back_button = false;
            }else {
              this.get_button = false;
              this.back_button = false;
            }
            if(client.status == 4){
                this.showCloseRes = true;
            }else{
                this.showCloseRes = false;
            }
          })
          .catch(() => {})
      },
    },
    created(){
      this.clientAdd();
    }
  }
</script>
<style lang="less">
  .messageDetails{
    .el-card{
      margin-bottom: 15px;
    }
    .s_new_title{
      font-size: 16px;
      font-weight: 700;
    }
    .x_details {
      width: 100%;
      height: 100%;
      font-size: 16px;
      line-height: 30px;
    }
    .x_details_child{
      float:left;
      width: 33%;
      margin-bottom: 20px;
    }
    .x_details_child span{
      color:#409eff;
      margin-right: 5px;
      margin-left: 0px;
    }
    .x_details_child p:nth-child(2){
      margin-left: 15px;
      height:30px;
      font-size: 14px;
    }
    .s_details_title {
      float: left;
      font-size: 20px;
      margin-left: 0px !important;
    }
    .el-form-item__label {
      margin-left: 0px !important;
    }
    .s_details_company {
      width: 100%;
      height: 50px;
    }
    .s_details_fuze {
      float: left;
      margin-left: 30px;
      margin-top: 5px;
      font-size: 14px;
      color: gray;
    }
    .s_details_btn {
      float: left;
      margin-top: 10px;
      margin-bottom: 20px;
      margin-left: 0px !important;
    }
    .box-card {
      margin-top: 15px;
    }
    .el-icon-edit:hover {
      cursor: pointer;
    }
    .el-step {
      flex-basis: 80px !important;
      height: 80px;
    }
    .status{
      position: relative;
      top:-50px;
      right: 10px;
      float: right;
    }
    .status p:first-child{
      font-size: 12px;
    }
    .status p:last-child{
      font-size: 18px;
    }
  }
</style>
