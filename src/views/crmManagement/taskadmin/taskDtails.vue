// Brief详情页面所有数据
<template>
  <div class="taskDetail">
    <el-card>
      <div class="x_details_company">
        <div class="s_details_title">{{date.title}} ( {{ date.task_number }} )</div>
      </div>
      <el-button type="primary" size="medium" v-if="date.button == '1'"  @click="startTask" class="x_details_btn">开始Brief</el-button>
      <el-button type="primary" size="medium"  v-if="date.button == '2'"  @click="finishTask" class="x_details_btn">完成Brief</el-button>
    </el-card>
    <el-card style=" margin-top: 20px;">
      <el-tabs>
        <el-tab-pane label="详情">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="float: left;color:#333333;font-size:16px;font-weight:800;">基础信息</span>
              <el-button type="text" icon="el-icon-edit" @click="dialogOpen" size="medium" v-show="date.edit_button" style="float: left; padding: 3px 0;margin-left: 10px;"></el-button>
            </div>
            <div class="s_details_basic">
              <div class="s_details_basic_title">
                <div class="s_details_basic_name">
                  <p>
                    <span style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</span>Brief编号</p>
                  <p style="height:10px;"></p>
                  <span>{{ date.task_number }}</span>
                </div>
                <div class="s_details_basic_industry">
                  <p><span style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</span>状态</p>
                  <p style="height:10px;"></p>
                  <span>{{ date.status_title }}</span>
                </div>
                <div class="s_details_basic_source">
                  <p><span style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</span>关联工单</p>
                  <p style="height:10px;"></p>
                  <span @click="workInfo()" style="color:#38adff">{{ date.number }}</span>
                </div>
              </div>
              <div class="s_details_basic_intermediate">
                <div class="s_details_basic_rank">
                  <p><span style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</span>Brief标题</p>
                  <p style="height:10px;"></p>
                  <span>{{date.title}}</span>
                </div>
                <div class="s_details_basic_scale">
                  <p><span style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</span>初稿或修改</p>
                  <p style="height:10px;"></p>
                  <span v-if="date.task_status=='1'">初稿</span>
                  <span v-else>修改</span>
                </div>
              </div>
              <div class="s_details_basic_intermediate">
                <div class="s_details_basic_rank">
                  <p><span style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</span>产品</p>
                  <p style="height:10px;"></p>
                  <span>{{ date.pro_name }}</span>
                </div>
                <div class="s_details_basic_scale">
                  <p><span style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</span>Brief类别</p>
                  <p style="height:10px;"></p>
                  <span>{{ date.tyle_title }}</span>
                </div>
              </div>
              <div class="s_details_basic_intermediate"  style="overflow: hidden;">
                <div class="s_details_basic_rank" style="width: 100%;">
                  <p><span style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</span>详情</p>
                  <p style="height:10px;"></p>
                  <span>{{ date.detail }}</span>
                </div>
              </div>
              <div class="s_details_basic_intermediate">
                <div class="s_details_basic_rank">
                  <p><span style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</span>Brief时间</p>
                  <p style="height:10px;"></p>
                  <span>{{ date.start_time }}至{{date.end_time}}</span>
                </div>
              </div>
              <div class="s_details_basic_intermediate">
                <div class="s_details_basic_rank">
                  <p><span style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</span>执行人</p>
                  <p style="height:10px;"></p>
                  <span v-for="(item,index) in date.check_excutor"  :key="index">
                     <span>{{item.nick_name}}</span>
									</span>
                </div>
              </div>
              <div class="s_details_basic_intermediate">
                <div class="x_details_basic_rank">
                  <p class="x_details_Enclosure">
                    <span style="color:#409eff;font-size:16px;margin-right: 5px;margin-left: 0px;">●</span>
                    <span style="color:#ccc;font-size: 16px;">附件</span>
                  </p>
                  <el-table border :data="date.task_file" style="width:55%;margin-bottom: 10px;">
                    <el-table-column type="index"></el-table-column>
                    <el-table-column prop="name" label="名称"></el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button @click="fileClone(scope.$index,date.task_file)" type="text" size="small"  style="color:#409eff;">下载</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="float: left;color:#333333;font-size:16px;font-weight:800;">操作日志</span>
            </div>
            <el-steps direction="vertical" :active="1" finish-status="success">
              <el-step v-for="(item,index) in operation" :key="index"  :title="item.nickname" :description="item.content">
              </el-step>
            </el-steps>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="执行明细">
          <executionDetail @xRefresh="xRefresh"  :detailed="detailed" :task_id="task_id" :excutor_all="excutor_all" :add_excuter_button="add_excuter_button"></executionDetail>
        </el-tab-pane>
        <el-tab-pane label="Brief附件">
          <el-button type="primary" plain size="mini" @click="newFile" v-if="file_button == '1'" class="x_details_btn">新增附件</el-button>
          <fileList :file="file"></fileList>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog title="添加附件" :visible.sync="finishDialogT" :modal="false">
      <upload @fileStatus="fileStatus" :success="success" @fileTrue="fileTrue"></upload>
      <div class="demo-input-suffix">
        <span class="s_details_input">备注：</span>
        <el-input style="margin-top: 20px" type="textarea" :rows="3" placeholder="请输入内容" v-model="textarea">
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="finishDialogT = false">取 消</el-button>
        <el-button type="primary" @click="finishDialog">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加附件" :visible.sync="newFileDialog" :modal="false">
    <upload @fileStatus="fileStatus" :success="success" @fileTrue="fileTrue"></upload>
    <div class="demo-input-suffix">
      <span class="s_details_input">备注：</span>
      <el-input style="margin-top: 20px" type="textarea" :rows="3" placeholder="请输入内容" v-model="textarea">
      </el-input>
    </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newFileDialog = false">取 消</el-button>
        <el-button type="primary" @click="newFileDialogT">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Brief详情修改" :visible.sync="dialogTableVisible" :modal="false">
      <el-form :model="form" ref="form" label-width="100px" class="demo-form">
      <el-form-item label="Brief标题" prop="title">
        <el-input v-model="form.title" class="x_client_width" style="width:300px;">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-radio v-model="form.task_status" :label="1">初稿</el-radio>
        <el-radio v-model="form.task_status" :label="2">修改</el-radio>
      </el-form-item>
      <el-form-item label="产品信息" prop="pro_detail">
        <el-select v-model="form.pro_id" placeholder="请选择" style="width:300px;">
          <el-option
            v-for="item in pro_detail"
            :key="item.pro_id"
            :label="item.name"
            :value="item.pro_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类别" prop="type_all">
        <el-select v-model="form.type_id" placeholder="请选择" style="width:300px;">
          <el-option
            v-for="item in type_all"
            :key="item.type_id"
            :label="item.title"
            :value="item.type_id">
          </el-option>
          <el-option :value="'其他'">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="type_title" v-if="form.type_id=='其他'" style="width:400px;">
        <div class="transition-box">
          <el-input v-model="form.type_title" placeholder="添加自定义类别">
          </el-input>
        </div>
      </el-form-item>
      <el-form-item label="Brief详情" prop="detail">
        <el-input style="width:300px;" type="textarea" v-model="form.detail" placeholder="请输入" class="x_client_width"></el-input>
      </el-form-item>
      <el-form-item label="Brief时间" prop="time">
        <div class="block">
          <el-date-picker
            style="width:400px;"
            v-model="form.time"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="原有执行人">
        <span v-for="(item,index) in date.check_excutor" :index="index" :key="item.dd_id">
        <span style="margin-right: 5px;">{{item.nick_name}}</span>
        </span>
      </el-form-item>
      <el-form-item label="新增执行人" prop="excutor_all">
        <el-select v-model="form.admin_ids" multiple placeholder="请选择" style="width:300px;">
          <el-option v-for="item in excutor_all" :key="item.dd_id" :label="item.nickname" :value="item.dd_id">
          </el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="附件">
          <upload @fileStatus="fileStatus" :success="success" @fileTrue="fileTrue"></upload>
          <el-button slot="trigger" size="small" type="primary">添加附件</el-button>
          <div slot="tip" class="el-upload__tip">上传文件不超过1G</div>
          <el-table border :data="date.attach" style="width:100%">
            <el-table-column type="index" align="center">
            </el-table-column>
            <el-table-column prop="name" label="姓名" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index,date.attach)" type="text" size="small">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd(form)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import executionDetail from '../.././components/x_task/executionDetail'
  import fileList from '../../components/x_task/fileList'
  import upload from '../.././components/s_customer/fiieDataCe'
  export default {
    components: {
      executionDetail,
      upload,
      fileList
    },
    props: [],
    data() {
      return {
        link_type:0,
        success:false,
        detailed: [],
        task_id: 0,
        dialogTableVisible: false,
        finishDialogT: false,
        newFileDialog: false,
        tabPosition: 'top',
        date: {
          task_number: '', 	  // Brief编号
          status_title: '', 	// Brief状态
          number: '', 		    // 关联工单
          title: '', 			    // Brief标题
          task_status: '', 	  // 初稿and修改
          pro_id: '', 		    // 产品
          tyle_title: '', 	  // Brief类别
          detail: '', 		    // Brief详情
          start_time: '', 	  // Brief开始时间
          end_time: '', 		  // Brief结束时间
          check_excutor: '', 	// 执行人
          edit_button: '', 	  // 编辑展示按钮
          button: '', 		    // 大的Brief按钮
          task_file: [], 		  // 客户编号
          manage_id: '', 		  // 工单编号
          attach:[]           // 附件信息
        },
        form: {
          task_id: '',
          title: '',
          task_status: false,
          pro_id: '',
          type_id: '',
          type_title: '',
          detail: '',
          time: [],
          admin_ids: [],
          attach:[]
        },
        pro_detail: [],
        type_all: [],
        excutor_all: [],
        check_excutor: [],
        task_file: [],
        start_time: '',
        end_time: '',
        time: [],
        textarea: '',
        file: [],
        file_button: '',
        operation: [], 			// 日志
        add_excuter_button: '',
        attach:[]
      }
    },
    methods: {
      workInfo() {
        this.$router.push({
          name: 'workInfo',
          query: {
            manage_id: this.date.manage_id,
            work_type:this.link_type
          }
        });
      },
      //开始Brief
      startTask() {
        this.$post('task/beginEnd', {task_id: this.$route.params.id,status: this.status})
          .then((data) => {
            if(data.code){
              this.$message({
                message: 'Brief开始！',
                type: 'success'
              });
              this.taskdetails();
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      //刷新(执行人和取消任务)
      xRefresh() {
        this.taskdetails();
      },
      //下载
      fileClone (index, rows) {
        window.open(rows[index].path);
      },
      //oss
      fileStatus(data) {
        this.attach = data; //完成上传附件
        this.file = data;   //列表上传附件
        this.form.attach = data; //修改上传附件
      },
      fileTrue(data){
        this.success = data;
      },
      // 完成Brief上传附件弹窗
      finishTask() {
        this.finishDialogT = true;
      },
      finishDialog() {
        this.$post('task/beginEnd', {task_id: this.$route.params.id,status: this.status,brife: this.textarea,attach: this.attach})
          .then((data) => {
            if(data.code){
              this.$message({
                message: '上传成功',
                type: 'success'
              });
              this.textarea = "";
              this.finishDialogT = false;
              this.success = true;
              this.taskdetails();
            } else {
              this.$message({
                message: data.errorMsg,
                type: 'warning'
              });
            }
          })
          .catch((error) => {
            this.$message.error(error);
          })
      },
      //列表上传附件弹窗
      newFile() {
        this.newFileDialog = true;
      },
      newFileDialogT() {
        this.$post('task/newFile', {task_id: this.$route.params.id, brife: this.textarea, attach: this.file})
          .then((data) => {
            if(data.code){
              this.$message({
                message: '上传成功',
                type: 'success'
              });
              this.textarea = "";
              this.newFileDialog = false;
              this.success = true;
              this.taskdetails();
            }else{
              this.$message.error(data.msg);
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      //删除附件
      deleteRow(index, rows) {
        this.$post('task/delete', {file_id: rows[index].file_id})
          .then((data) => {
            if(data.code) {
              this.$message({
                message: data.errorMsg,
                type: 'success'
              });
              rows.splice(index, 1);
              this.taskdetails();
            }else{
              this.$message.error(data.msg);
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      // 打开修改Brief信息的弹窗
      dialogOpen() {
        this.dialogTableVisible = true;
      },
      // 保存修改的Brief信息
      confirmAdd() {
        this.$post('task/edit',this.form)
          .then((data) => {
            if(data.code){
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
              this.dialogTableVisible = false;
              this.taskdetails();
            }else{
              this.$message.error(data.msg);
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      // Brief详情的所有数据请求
      taskdetails() {
        this.$get('task/detail', {task_id: this.$route.params.id})
          .then((data) => {
            let client = data.content.detail;
            this.date.task_number = client.task_number;
            this.date.status_title = client.status_title;
            this.date.number = client.number;
            this.date.task_status = client.task_status;
            this.date.pro_name = client.pro_name;
            this.date.title = client.title;
            this.date.tyle_title = client.tyle_title;
            this.date.detail = client.detail;
            this.date.start_time = client.start_time;
            this.date.end_time = client.end_time;
            this.date.check_excutor = client.check_excutor;
            this.date.task_file = client.task_file;
            this.pro_detail = client.ex_pro.pro_detail;
            this.type_all = client.ex_pro.type_all;
            this.excutor_all = client.ex_pro.excutor_all;
            this.task_file = client.task_file;
            this.date.edit_button = client.edit_button;
            this.date.button = client.button;
            this.detailed = data.content.excute_detail;
            this.add_excuter_button = data.content.add_excuter_button;
            this.task_id = this.$route.params.id;
            this.date.manage_id = client.manage_id;
            this.link_type = client.link_type;
            //修改提交数据
            this.form.task_id = this.$route.params.id;
            this.form.title = client.title;
            this.form.task_status = client.task_status;
            this.form.pro_id = client.check_pro.pro_id;
            this.form.type_id = client.check_type.type_id;
            this.form.type_title = client.type_title;
            this.form.detail = client.detail;
            this.form.time = client.time;
            this.date.attach = client.task_file;
            this.status = client.status;
            this.file = data.content.file;
            this.file_button = data.content.file_button;
            this.operation = data.content.log;
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      }
    },
    created(){
      this.taskdetails();
    }
  }
</script>
<style lang="less">
  .taskDetail {
    .x_details_company {
      width: 100%;
      height: 50px;
    }
    .x_details_btn {
      float: left;
      margin: 10px;
    }

    .x_client_width {
      width: 300px;
    }
    .x_edit {
      margin-left: 10px;
      margin-top: 2px;
    }
    .x_clientDetails_title {
      width: 100%;
      height: auto;
      margin-top: 30px;
    }
    .s_details_title {
      float: left;
      font-size: 20px;
      margin-left: 0px !important;
    }
    .el-form-item__label {
      margin-left: 30px;
    }

    .s_details_fuze {
      float: left;
      margin-left: 30px;
      margin-top: 10px;
      font-size: 14px;
      color: gray;
    }

    .x_details_btn .el-button {
      width: 106px;
    }
    p.x_details_Enclosure{
      color: #333333;
      font-size: 16px;
      margin-left: 14px;
    }
    .s_details_tabs {
      width: 90%;
      height: 700px;
      margin-left: 5%;
      background: gray;
    }
    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }
    .clearfix:after {
      clear: both
    }
    .s_details_basic_title {
      width: 100%;
      height: 100px;
    }
    .s_details_basic_intermediate {
      width: 100%;
      height: 100px;
    }
    .s_details_basic_title div,
    .s_details_basic_intermediate div {
      float: left;
    }
    .s_details_basic_name,
    .s_details_basic_source,
    .s_details_basic_industry,
    .s_details_basic_rank,
    .s_details_basic_scale,
    .s_details_basic_bottom {
      color: #999999;
      font-size: 14px;
      width: 32.5%;
    }
    .s_details_basic_name span,
    .s_details_basic_source span,
    .s_details_basic_industry span,
    .s_details_basic_rank span,
    .s_details_basic_scale span,
    .s_details_basic_bottom span {
      color: #333333;
      font-size: 16px;
      margin-left: 14px;
    }
    .s_details_basic_name p,
    .s_details_basic_source p,
    .s_details_basic_industry p,
    .s_details_basic_rank p,
    .s_details_basic_scale p,
    .s_details_basic_bottom p {}
    .s_details_basic_industry,
    .s_details_basic_source,
    .s_details_basic_scale {
      margin-left: 0px;
    }
    .s_client_sel_div {
      width: 300px;
    }
    .s_client_address {
      width: 80%;
      margin-top: 20px;
      margin-left: 26px;
    }
    .s_operationLog {
      float: left;
      margin-left: 120px;
    }
    .s_details_load {
      margin-top: 20px;
    }
    .s_details_input {
      float: left;
      margin-top: 20px;
    }
    .dialog-footer {
      margin-top: 50px;
    }
    .box-card {
      margin-top: 50px;
      width: 100%;
    }
    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }
    .clearfix:after {
      clear: both
    }
    .el-input__inner {
      width: 300px;
    }
    .x_client_width .el-input {
      width: 300px;
    }
    .el-step {
      flex-basis: 80px !important;
      height: 80px;
    }
  }
</style>