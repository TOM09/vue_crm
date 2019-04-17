<template>
  <div class="workInfo">
    <div class="workInfo_top">
      <div class="workNumber">
        <span class="NumberIcon"><img src="../../../../src/images/icon.png"></span>
        <span class="number">单号：{{ message.number }}</span>
      </div>
      <div class="workDetails">
        <div class="workDetailsContent">

          <div class="workDetailsLeft">
            <el-row class="detailsMessageFirst">
              <el-col :span="9">创建人：<span class="detailsMessageText">{{ message.person }}</span></el-col>
              <el-col :span="9">产品： <span class="detailsMessageText">{{ message.product }}</span></el-col>
            </el-row>
            <el-row class="detailsMessage">
              <el-col :span="9">工单类型：<span class="detailsMessageText">{{ message.link_type }}</span></el-col>
              <el-col show-overflow-tooltip="true" :span="11">来源单据： <span @click="itemOrderDetail" style="cursor:pointer;color:#38adff">{{ message.code}}</span></el-col>
            </el-row>
            <el-row class="detailsMessage">
              <el-col :span="9">客户： <span @click="clientDeatil" style="color:#38adff;cursor:pointer">{{ message.client }}</span></el-col>
              <el-col :span="11" v-if="work_type == 1">预计调用日期：<span class="detailsMessageText">{{ message.expect_time }}</span></el-col>
              <el-col :span="11" v-if="work_type == 2">合同是否签订：<span class="detailsMessageText">{{ message.contract ? '是' : '否' }}</span></el-col>
            </el-row>
            <el-row class="detailsMessage">
              <el-col :span="11" v-if="work_type == 1">调用类型： <span @click="clientDeatil" class="detailsMessageText">{{ message.call_that }}</span></el-col>
            </el-row>
            <el-row class="detailsMessage" v-if="work_type == 1">
              提案结果：{{ message.result }}
            </el-row>
          </div>

          <div class="workDetailsRight">
              <el-button type="danger" v-for="item in menu" :key="item.index" @click="workAll(item.id,item.value)" class="workDetailsButton" v-show='item.id==2'>{{ item.value }}</el-button>
              <el-button type="danger" v-for="item in menu" :key="item.index" @click="handleDelete()" class="workDetailsButton" v-show='item.id==12'>{{ item.value }}</el-button>
              <el-button type="primary" v-for="item in menu" :key="item.index" @click="workAll(item.id,item.value)" class="workDetailsButton" v-show='item.id!=2&&item.id!=12'>{{ item.value }}</el-button>
              <!-- <el-button class="workDetailsButton">提交</el-button> -->
          </div>
                   <!-- class='workDetailsButton'  :class="{'workDetailsButtonOver':item.id==2,'workDetailsButton':true}"-->
        </div>
        <div class="workDetailsBottom">
          <div class="workDetailsBottomMessage" v-if="work_type == 2">已回款金额：<span class="detailsMessageBottomText">{{ message.sum_price}}</span></div>
          <div class="workDetailsBottomMessage" v-if="work_type == 2">已托管金额：<span class="detailsMessageBottomText">{{ message.trusteeship_price}}</span></div>
          <div class="workDetailsBottomMessage">金额：<span class="detailsMessageBottomText">{{ message.price }}</span></div>
          <div class="workDetailsBottomMessage">状态：<span class="detailsMessageBottomText">{{ idObj.title}}</span></div>
        </div>
      </div>
    </div>
    <div class="s_workSummary">
      <el-collapse>
        <el-collapse-item v-if="message.summary">
          <template slot="title">
            提案总结：{{ message.summary }}
          </template>
          <div style="color: #999;">{{ message.summary }}</div>
        </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            申请说明：{{ message.description }}
          </template>
          <div style="color: #999;">{{ message.description }}</div>
        </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            分配说明：{{ message.remarks}}
          </template>
          <div style="color: #999;">{{ message.remarks }}</div>
        </el-collapse-item>
      </el-collapse>
    </div>
         <!-- <el-checkbox-group  v-model="val" @change='dingding'>
            <el-checkbox label= 1>钉钉通知</el-checkbox>
            <el-checkbox label= 2>发ding</el-checkbox>
          </el-checkbox-group> -->
   
<!-- 下部详情 -->
    <div class="workInfo_content">
      <el-tabs type="card" v-model="activeNameTab" center  @tab-click='workOperateLog2' class="workOperateLog22 workOperateLog23">
        <el-tab-pane v-model="tabActiveName" label="详情" name="first">
          <div class="progress_bar">
            <div class="first_style_title first_style_title_first">
              <img src="../../../../src/images/jindu.png" style="margin-left: 26px;"><span class="workInfo_content_title">流程进度</span>
            </div>
            <div class="rocket">
              <div v-for="(item,index) in 13" :key="index">
                <div :class="'rocket_style' +  index " v-if="item == number">
                  <!-- <img class="s_workIfo_img" src="../../../../src/images/rocket.jpg"> -->
                  <img class="s_workIfo_img" :src="require('../../../../src/images/rocket.jpg')">
                </div>
              </div>
            </div>

            <div class="first_style_content">
              <el-steps :active="number">
                <el-step
                    v-for="(item, index) in process"
                    :key="item.index"
                    :class="'s_workinfo_step_' + index"
                    :title="item.title"
                    :description="item.content"
                >
                </el-step>
              </el-steps>
            </div>
          </div>

            <div class="implement" v-if='work_type == 1'>
            <div class="first_style_title first_style_title_work1">
              <img src="../../../../src/images/renyuan.png"><span class="workInfo_content_title workInfo_content_title_work1">执行人员</span>
              <el-button v-if="add_excutor" @click="addExecutor" size="mini" plain type="primary" class="s_workInfoBtn">新增执行人</el-button>
            </div>
            <el-table :data="executor" border style="width: 100%;">
              <el-table-column fixed prop="nickname" label="姓名"></el-table-column>
              <el-table-column prop="position" label="岗位"></el-table-column>
              <el-table-column prop="department" label="部门"></el-table-column>
              <el-table-column prop="create_nickname" label="指派人"></el-table-column>
              <el-table-column prop="remarks" label="备注"></el-table-column>
              <el-table-column prop="result" label="取消原因"></el-table-column>
              <el-table-column prop="is_hidden" label="状态"></el-table-column>
              <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button v-if="add_excutor" @click="handleClick(scope.row,scope.$index, executorData)" type="text" size="small">{{ scope.row.operation }}</el-button>
              </template>
              </el-table-column>
            </el-table>
          </div>

        <!-- 客服团队 -->
          <div class="implement" v-if='work_type == 2'>
            <div class="first_style_titleH1">
              <img src="../../../../src/images/renyuan.png"><span class="workInfo_content_title">客服团队</span>
                <div class='right_title_btn'>
                  <!-- <el-button  size="small" type="primary" @click='executorChange4f()'>跟进</el-button> -->
                  <el-button plain size="small" type="primary" v-show='executorData_btn.serviec_change_record_btn' @click='serviec_change_record_btn'>转单记录</el-button>
                  <!-- <el-button plain size="small" type="primary" v-show='executorData_btn.change_ae_btn' @click='change_ae_btn()'>更换客服</el-button> -->
                </div>
            </div>

            <el-table :data="executorData" border v-if='executorDataleading != null || executorDataleadingAe != null'>
              <el-table-column prop="service_leading_nickname" label="客服负责人"></el-table-column>
              <el-table-column prop="ae" label="客服"></el-table-column>
              <el-table-column prop="position" label="职位"></el-table-column>
              <el-table-column prop="department" label="部门"></el-table-column>
              <el-table-column prop="service_remark" label="备注"></el-table-column>
              <el-table-column prop="service_remark" label="操作">
                <template slot-scope="scope">
                  <el-button @click="handleClickPeople(scope.row)" type="text" size="small" v-if='editNum == 1'>更改</el-button>
                  <el-button @click="change_ae_btn(scope.row)" type="text" size="small" v-if="scope.row.btn.change_ae_btn">更换客服</el-button>
                </template>
              </el-table-column>
            </el-table>

             <table class='tablePeople' cellpadding='0' cellspacing="0" v-else>
                <tr class='ExecutionDetailP1'>
                  <th cellpadding='0' cellspacing="0">客服负责人</th>
                  <th cellpadding='0' cellspacing="0">客服</th>
                  <th cellpadding='0'>职位</th>
                  <th cellpadding='0'>部门</th>
                  <th cellpadding='0'>备注</th>            
                </tr>
                <tr class='ExecutionDetailP'>
                  <td colspan="5">暂无数据</td>
                </tr>
             </table>
          </div>

<!-- 执行明细 -->
           <!-- <div class="Execution_detail" v-for="(item,index) in Execution_detail_list" :key='index'> -->
             <div class='implement' v-if='work_type == 2'>
              <div class="first_style_title first_style_title_width">
                <span class="workInfo_content_title workInfo_content_title2">执行明细</span>
                  <div class='right_title_btn right_title_btn2'>
                    <el-button plain size="small" type="primary" @click='executorChange'>转单记录</el-button>
                    <el-button plain size="small" type="primary" @click='executiveLeyeOpen'>跟进记录</el-button>
                    <!-- <el-button plain class= 'bgBtn' size="small" type="primary" v-show='item.split_btn' @click="executorChange3f(item.number,item.id)">拆分</el-button> -->
                    <!-- <el-button plain class= 'bgBtn' size="small" type="primary"  v-show='item.follow_btn' @click='executorChange4f(item.number,item.id,item.log_status)'>跟进</el-button> -->
                  </div>
              </div>

              <el-table border :data="Execution_detail_list" class='Execution_content Execution_content2' align='center'>
                 <!-- :default-sort = "{prop: 'price', order: 'descending'}" -->
                <el-table-column sortable prop="number" fixed label="编号" width="80" align='center'></el-table-column>
                <el-table-column prop="pro_info" fixed label="产品"></el-table-column>
                <el-table-column prop="product_brief" fixed label="产品说明"  align='center'></el-table-column>
                <el-table-column 
                  prop="log_status_str" 
                  fixed label="进度"
                  :filters="executorChange4DataArray"
                  :filter-method="handleFilterChange"
                  width="100"
                  >
                   <template slot-scope="scope">
                     <span :class="{tableInfo: scope.row.log_status_str === '待启动', 
                        tableBlue: ((scope.row.log_status_str === '进行中') || (scope.row.log_status_str === '修改中')),
                        tablered: ((scope.row.log_status_str === '已暂停') || (scope.row.log_status_str === '已退款')),
                        tablegreen: ((scope.row.log_status_str === '初稿提交') || (scope.row.log_status_str === '定稿') || (scope.row.log_status_str === '已完成'))
                        }">
                        {{scope.row.log_status_str}}
                        </span>
                <!--      <el-tag 
                        :type="{Info:scope.row.log_status_str === '未开始' ,
                         Danger:scope.row.log_status_str === '进行中'||'修改中',
                         Success:scope.row.log_status_str === '初稿定稿'||'修改稿定稿' || '已完成',
                         Warning:scope.row.log_status_str === '已暂停'||'已退款'
                         }"
                        >
                          {{scope.row.log_status_str}}
                      </el-tag> -->
                  </template>
                </el-table-column>

                <el-table-column prop="price" sortable label="价格" align='center'></el-table-column>
                <el-table-column prop="service_type" sortable label="执行团队"  width="110"></el-table-column>
                <el-table-column prop="excutor_leading" sortable label="负责人"  width="100"></el-table-column>
                <el-table-column prop="excutor" label="执行人" ></el-table-column>
                <el-table-column prop="begin_time" sortable label="初稿时间"  width="110"></el-table-column>
                <el-table-column prop="confirm_time" sortable label="定稿时间"  width="110"></el-table-column>
                <el-table-column prop="mod_count" sortable label="修改次数"  class='bianhao' width="85" align='center'></el-table-column>
                <el-table-column prop="refund_time" sortable label="退款时间"  width="110"></el-table-column>
                <el-table-column prop="refund_money" sortable label="退款金额" width="110"></el-table-column>
                <el-table-column prop="service_remark" fixed="right" label="操作" align='center'>
                  <template slot-scope="scope">
                    <el-button  class='allBtn' @click="changeAllPeople(scope.row)" v-if='scope.row.edit == 1' type="text" size="small">更改</el-button>
                    <el-button  class='allBtn' type="text" @click='executorChange2f(scope.row)' v-show='scope.row.change_excutor_btn == true'>更换执行</el-button>
                    <el-button  class='allBtn' type="text" @click="executorChange3f(scope.row)" v-show='scope.row.split_btn'>拆分</el-button>
                    <el-button  class='allBtn' type="text" @click='executorChange4f(scope.row)' v-show='scope.row.follow_btn'>跟进</el-button>
                  </template>
                </el-table-column>
              </el-table>
          </div>

           <!-- brief明细 -->
          <div class="implement">
            <div class="first_style_title">
              <span class="workInfo_content_title">brief明细</span>
              <el-button plain  size="small" type="primary" v-if = 'add_brife' class="addMission" @click="addTask">新增任务</el-button>
            </div>
            <el-table :data="breifDetail" border class='Execution_content'>
              <el-table-column prop="task_number" label="brief编号"></el-table-column>
              <el-table-column prop="type_title" label="brief类型"></el-table-column>
              <el-table-column prop="title" label="brief标题"></el-table-column>
              <el-table-column prop="man" label="执行人"></el-table-column>
              <el-table-column prop="status_title" label="状态"></el-table-column>
              <el-table-column prop="delay" label="已延期人员"></el-table-column>
              <el-table-column prop="end_time" label="要求截止时间"></el-table-column>
              <el-table-column prop="delay" label="操作" align='center'>
                <template slot-scope="scope">
                  <el-button @click.native.prevent="taskDetail(scope.$index, breifDetail)" type="text" size="small">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <el-tab-pane label="附件" name="second">
          <el-card>
            <div><el-button type="primary" round @click="newFlie" size="small" plain style="margin-left: 10px;">新增附件</el-button></div>
            <el-table :data="annexData" style="width: 100%">
              <el-table-column fixed prop="name" label="附件名称"></el-table-column>
              <el-table-column prop="person" label="创建人"></el-table-column>
              <el-table-column prop="size" label="大小"></el-table-column>
              <el-table-column prop="brife" label="备注"></el-table-column>
              <el-table-column prop="create_time" label="创建时间"></el-table-column>
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="fileUpload(scope.$index, annexData)">
                    下载
                  </el-button>
                  <el-button :disabled="(!scope.row.delete)" type="text" size="small" @click.native.prevent="deleteRow(scope.$index, annexData)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-dialog title="新增附件" :visible.sync="newFileAdd" :modal="false" width="600px">
              <el-form label-position='right' label-width="120px" :model="r_data">
                <el-form-item label="附件 :" class='is-required'>
                  <upload @fileStatus="fileStatus"  @fileTrue="fileTrue" :success="success" v-model="r_data.file" >
                    </upload> 
                </el-form-item>

                <el-form-item label="备注说明 :">
                  <el-input type="textarea" :rows="5" v-model="r_data.brife" placeholder="请输入内容" class='inputWarn2'></el-input>
                </el-form-item>
              </el-form>

              <span slot="footer" class="dialog-footer">
                  <el-button @click="newFileAdd = false">取 消</el-button>
                  <el-button type="primary" @click="newFileAddT">确 定</el-button>
              </span>
            </el-dialog>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="操作记录" name="third" v-if='work_type==1'>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>操作记录</span>
            </div>
            <el-table :data="operateLog">
              <el-table-column prop="nickname" label="人员" width="150"></el-table-column>
              <el-table-column prop="content" label="操作内容"></el-table-column>
              <el-table-column prop="create_time" label="操作时间"></el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="派单记录" name="fivth" v-if='work_type==2' class='workInfoData'>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>操作日志</span>
            </div>
            <el-table :data="operateLog2">
              <el-table-column prop="nickname" label="人员" width="150"></el-table-column>
              <el-table-column prop="active" label="动作"></el-table-column>
              <el-table-column prop="active_remark" label="操作内容"></el-table-column>
              <el-table-column prop="create_time" label="操作时间"></el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <el-tab-pane :label="'预警'+ warn_count" name="fourth" v-if='work_type==2'>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class='earlyWarning'>执行预警</span>
              <el-button type="primary" round  size="small" plain v-show='warnListDataBtn' @click='addEarlyWarning'>新增预警</el-button>
            </div>
            <el-table ref="multipleTable" :data="warnListData" tooltip-effect="dark" style="width: 100%"  class='multipleTableColor3' align="center">
                 <el-table-column type="expand" >
                  <template slot-scope="props" v-if='props.row.warn_status == 2'>
                    <el-form label-position="right" inline class="demo-table-expand"  style="width: 60%">

                      <table>
                        <tr class='warnTable'>
                          <th>解决方式</th>
                          <th>解决时间</th>
                          <th>解决人</th>
                        <tr>
                        <tr class='warnTableTd'>
                          <td>{{ props.row.close_reason }}</td>
                          <td>{{ props.row.update_time }}</td>
                          <td>{{ props.row.close_nickname }}</td>
                        </tr>
                      </table>

                    </el-form>
                  </template>
                </el-table-column>

                <el-table-column prop="number" label="执行明细"></el-table-column>
                <el-table-column prop="product_brief" label="产品说明"></el-table-column>
                <el-table-column prop="ae_nickname" label="客服"></el-table-column>
                <el-table-column prop="warn_brief" label="预警内容"></el-table-column>
                <el-table-column prop="warn_nickname" label="提醒关注人员"></el-table-column>
                <el-table-column prop="warn_status_desc" label="预警状态"></el-table-column>
                <el-table-column prop="create_time" label="发起时间"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                      <!-- <el-button @click="handleWarning(scope.row)" type="text" size="small">关闭</el-button> -->
                      <el-button @click="handleWarning(scope.row.id)" type="text" size="small" v-if='scope.row.warn_status == 1'>关闭</el-button>
                    </template>
                </el-table-column>>
            </el-table>

          </el-card>
        </el-tab-pane>

        <el-tab-pane label="日志" name="third" v-if='work_type==2'>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>操作日志</span>
            </div>
            <el-table :data="operateLog">
              <el-table-column prop="nickname" label="人员" width="150"></el-table-column>
              <el-table-column prop="content" label="操作内容"></el-table-column>
              <el-table-column prop="create_time" label="操作时间"></el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

      </el-tabs>
    </div>

<!-- 跟进记录 -->
<el-dialog :visible.sync="executiveLoggingEye" class='multipleTableColor multipleTableColor2' title="跟进记录" :modal-append-to-body="false" width="90%">
      <p class='executiveLogT'><el-checkbox class='checkedHave' @change = 'changeContent'>只显示有内容后的记录</el-checkbox></p> 
      <el-card class="box-card">
            <div class="block">
                <span class="demonstration">
                    <el-table ref="multipleTable" :data="eyeChangeRecord" tooltip-effect="dark" style="width: 100%"  align="center">
                        <el-table-column prop="name" 
                        label="产品" width='100px'
                        :filters="followArray"
                       :filter-method="followArrayChange"
                        >

                        </el-table-column>
                        <el-table-column prop="product_brief" label="产品说明"  width='100px'></el-table-column>
                        <el-table-column prop="create_time" label="记录时间"  width='120px'></el-table-column>
                        <el-table-column prop="excutor_brief" label="记录内容"></el-table-column>
                        <el-table-column prop="excutor_status_desc" label="执行进度" width="100"
                            :filters="executorChange4DataArray"
                          :filter-method="getFollowUpStatusChange"
                        >

                        </el-table-column>
                        <el-table-column prop="nickname" label="记录人" width="100"
                        :filters="followNickname"
                       :filter-method="followArrayChangePeople"
                        >

                        </el-table-column>
                    </el-table>
                </span>
                <el-pagination
                        class='paginationNum'
                        background
                        :current-page.sync="paginationNum.current_page"
                        @current-change="handleCurrentChange"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="paginationNum.per_page"
                        layout="prev, pager, next"
                        :total="paginationNum.total">
                </el-pagination>
            </div>
        </el-card>
</el-dialog>

<!-- 客服转单记录 -->
<el-dialog  :visible.sync="executiveLogging2"  title="转单记录(客服)" :modal-append-to-body='false' class='multipleTableColor' width="90%">
       <el-card class="box-card">
            <div class="block">
                <span class="demonstration">
                    <el-table ref="multipleTable" :data="changeRecord" tooltip-effect="dark" style="width: 100%"  align="center">
                        <el-table-column prop="before_excutor_leading" label="转出前执行负责人" width="140"></el-table-column>
                        <el-table-column prop="before_excutor" label="转出前执行人"></el-table-column>
                        <el-table-column prop="after_excutor_leading" label="转出后执行负责人" width="140"></el-table-column>
                        <el-table-column prop="after_excutor" label="转出后执行人"></el-table-column>
                        <el-table-column prop="reason" label="转单原因"></el-table-column>
                        <el-table-column prop="remark" label="转单说明"></el-table-column>
                        <el-table-column prop="create_nickname" label="操作人"></el-table-column>
                        <el-table-column prop="create_time" label="操作时间" width="100"></el-table-column>>
                    </el-table>
                </span>
                  <!-- @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" -->
                <el-pagination
                        class='paginationNum'
                        background
                        :current-page.sync="paginationNum2.current_page"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="paginationNum2.per_page"
                        layout="prev, pager, next"
                        @current-change="handleCurrentChange2"
                        :total="paginationNum2.total">
                </el-pagination>
            </div>
        </el-card>
</el-dialog>

<!-- 成单执行中的的更换客服 -->
<el-dialog  :visible.sync="workInReplace" title="更换客服" :modal="false" width="550px" class='executiveLogging3'>
      <el-form :model="replaceform" label-width="120px" class='executiveLogging3Top'>
       <el-form-item label="客服负责人" class='is-required'>
          <el-select v-model="replaceform.service_leading" filterable placeholder="请选择" class='inputWarn'>
              <el-option
                  v-for="item in person"
                  :key="item.dd_id"
                  :label="item.nickname"
                  :value="item.dd_id"
                  >
              </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="新客服" class='is-required'>
          <el-select v-model="replaceform.new_dd_id" filterable placeholder="请选择" class='inputWarn'>
              <el-option
                  v-for="item in person"
                  :key="item.dd_id"
                  :label="item.nickname"
                  :value="item.dd_id"
                  >
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="转单原因" class='is-required'>
          <el-select v-model="replaceform.result" placeholder="请选择" class='inputWarn'>
            <el-option            
                v-for="item in changeReson"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="历史未完成的Brief是否转移"  class='is-required historyBrief'>
          <el-switch v-model="replaceform.brife"></el-switch>
        </el-form-item>
       
        <el-form-item label="转单说明">
          <el-input class='inputWarn' type="textarea" :rows="5" v-model="replaceform.remarks" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="workInReplace = false">取 消</el-button>
        <el-button type="primary" @click="workInReplaceTAe">确 定</el-button>
      </div>
</el-dialog>

<!-- 售前中的的更换销管 -->
<el-dialog  :visible.sync="workInReplacePeople" title="更换执行人" :modal="false" width="550px" class='executiveLogging3'>
      <el-form :model="replaceform" label-width="120px" class='executiveLogging3Top'>
        <el-form-item label="执行人" class='is-required'>
          <el-select clearable v-model="replaceform.new_dd_id" filterable placeholder="请选择" class='inputWarn'>
              <el-option
                  v-for="item in person"
                  :key="item.dd_id"
                  :label="item.nickname"
                  :value="item.dd_id"
                  >
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="更换原因" class='is-required'>
          <el-select v-model="replaceform.result" placeholder="请选择" class='inputWarn'>
            <el-option            
                v-for="item in reasons"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="历史未完成的Brief是否转移"  class='is-required historyBrief'>
          <el-switch v-model="replaceform.brife"></el-switch>
        </el-form-item>
        <el-form-item label="说明">
          <el-input class='inputWarn' type="textarea" :rows="5" v-model="replaceform.remarks" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="workInReplacePeople = false">取 消</el-button>
        <el-button type="primary" @click="workInReplaceTAePeople">确 定</el-button>
      </div>
</el-dialog>


<!-- 新增预警 -->
<el-dialog  :visible.sync="warningDialog" title="新增预警" :modal="false" width="500px" class='executiveLogging3'>
      <el-form :model="replaceform" label-width="120px" class='executiveLogging3Top'>
        <el-form-item label="执行明细 :" class='is-required'>
          <el-select v-model="replaceform.detail_id" filterable placeholder="请选择" class="inputWarn">
              <el-option
                  v-for="item in excuteListData"
                  :key="item.id"
                  :label="item.number"
                  :value="item.id"
                  >
              <span style="float: left">{{ item.number }}</span>
              <!-- <span style="margin-left:15px">{{ item.product_brief }}</span> -->
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.product }}</span>
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预警内容 :" class='is-required'>
            <el-input  type="textarea" :rows="5" v-model="replaceform.warn_brief" placeholder="请输入" class='inputWarn'></el-input>            
        </el-form-item>
      
      <el-form-item label="提醒谁关注 :" class='is-required'>
          <el-select v-model="replaceform.warn_dd_ids" multiple filterable placeholder="可选择多人" class='inputWarn'>
              <el-option
                  v-for="item in person"
                  :key="item.dd_id"
                  :label="item.nickname"
                  :value="item.dd_id"
                  >
              </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="提醒方式 :" class='is-required'>
          <!-- <el-radio v-model="replaceform.warn_type" label="1">钉钉通知</el-radio>
          <el-radio v-model="replaceform.warn_type" label="2">发ding</el-radio> -->

          <el-checkbox-group  v-model="replaceform.warn_type" >
            <el-checkbox label="1">钉钉通知</el-checkbox>
            <el-checkbox label="2">发ding</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="warningDialog = false">取 消</el-button>
        <el-button type="primary" @click="workInReplaceTwarning('新增预警')">确 定</el-button>
      </div>
</el-dialog>

<!-- 关闭预警 -->
<el-dialog  :visible.sync="handleWarningDialog" title="关闭预警" :modal="false" width="550px">
      <el-form :model="replaceform" label-width="80px" class='executiveLogging3Top'>      
        <el-form-item label="解决方式 :">
          <el-col :span="18">
              <el-input  type="textarea" :rows="5" v-model="replaceform.close_reason" placeholder="请输入"></el-input>
          </el-col>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleWarningDialog = false">取 消</el-button>
        <el-button type="primary" @click="workInReplaceTwarning('关闭预警')">确 定</el-button>
      </div>
</el-dialog>

<!--执行工单中的四个按钮 -->
      <el-dialog  :visible.sync="executorFour" :modal-append-to-body='false' title="转单记录" :modal='true' class='multipleTableColor' width="90%">
       <el-card class="box-card">
            <div class="block">
                <span class="demonstration">
                  <!-- @selection-change="handleSelectionChange" -->
                  <!--  -->
                    <el-table ref="multipleTable" :data="changeRecord2data" tooltip-effect="dark" style="width: 100%"  align="center">
                        <el-table-column prop="name" label="产品" width="100"
                        :filters="executorFourArray"
                       :filter-method="executorFourChange"
                       >
                        </el-table-column>
                        <el-table-column prop="product_brief" label="产品说明" width="100"></el-table-column>
                        <el-table-column prop="change_time" label="转单日期" width="100"></el-table-column>
                        <el-table-column prop="before_excutor_leading" label="转出前执行负责人" width="140"></el-table-column>
                        <el-table-column prop="before_excutor" label="转出前执行人" width="110"></el-table-column>
                        <el-table-column prop="after_excutor_leading" label="转出后执行负责人" width="140"></el-table-column>
                        <el-table-column prop="after_excutor" label="转出后执行人" width="110"></el-table-column>
                        <el-table-column prop="reason" label="转单原因"  width="110"
                        :filters="executorFourArrayreason"
                       :filter-method="executorFourChangereason">
                        </el-table-column>
                        <el-table-column prop="remark" label="转单说明"></el-table-column>
                        <el-table-column prop="create_nickname" label="操作人"></el-table-column>
                        <el-table-column prop="create_time" label="操作时间" width="100"></el-table-column>>
                    </el-table>
                </span>
                  <!-- @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" -->
                <el-pagination
                        class='paginationNum'
                        background
                        :current-page.sync="paginationNum3.current_page"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="paginationNum3.per_page"
                        layout="prev, pager, next"
                        @current-change="handleCurrentChange3"
                        :total="paginationNum3.total">
                </el-pagination>
            </div>
        </el-card>
      </el-dialog>

      <!-- 更换执行团队 -->
          <el-dialog  :visible.sync="executorChange2"  title="更换执行团队" :modal="false" width="550px" @close='splitClose2'>
            <div class='CustomerLeaderAllbox'>
            <el-form label-position="right" label-width="140px" :model="changeExecutor"  :rules="rules" ref="changeExecutor">
            <!-- 自营团队 -->
            <div>
              <p class='CustomerLeaderOne'>执行明细{{changeExecutor.number}}</p>
			        <div class="dialogSolid2"></div>
                <!-- <div style="margin-top: 15px;" v-for="(item,index) in r_form.excutor_detail" :key="index"> -->
                <!-- <p class='Executive_self_support' v-show ='r_dataform.service_type == 1'>执行方 : 自营团队</p>  -->
                <!-- <p class='Executive_self_support' v-show ='r_dataform.service_type == 2'>执行方 : 服务商团队</p>  -->
                <el-form-item label="产品信息 :" >
                  <el-input    
                    type="text"
                    class="inputWarn"
                    :disabled="true"
                    v-model= 'changeExecutor.name'
                        >
                    </el-input>
                </el-form-item>

                <el-form-item label="产品说明 :">
                    <el-input    
                      :disabled="true"
                        type="textarea"
                        :rows="3"
                        class="inputWarn"
                        v-model= 'changeExecutor.product_brief'
                        >
                    </el-input>
                </el-form-item>

                <el-form-item label="合同价格 :">
                  <el-input
                      :disabled="true"
                      class="inputWarn"
                      v-model= 'changeExecutor.price'
                      type="number"
                      >
                  </el-input>
                </el-form-item>

                <el-form-item label="执行方 :" class='is-required'>
                  <el-radio v-model="changeExecutor.service_type" label=1>自营团队</el-radio>
                  <el-radio v-model="changeExecutor.service_type" label=2>服务商团队</el-radio>
                </el-form-item>

                <div v-if="changeExecutor.service_type == 1">
                  <el-form-item label="执行总监 :" class='is-required' 
					           prop="textName4"                 
                  >
                    <el-select class="inputWarn" clearable placeholder="可选择一位执行总监" v-model="changeExecutor.excutor_leading" filterable>
                        <el-option
                          v-for="item in person"
                          :key="item.dd_id"
                          :label="item.nickname"
                          :value="item.dd_id">
                        </el-option>									
                      </el-select>
                  </el-form-item>

                  <el-form-item label="执行人 :" class='is-required'  prop="textName3">                     
                    <el-select clearable v-if="updatePeople && changeExecutor.service_type == 1" multiple value-key='dd_id' class="inputWarn" placeholder="可选择多位执行人" v-model="changeExecutor.excutor_id" filterable>
                        <el-option
                          v-for="item in person"
                          :key="item.dd_id"
                          :label="item.nickname"
                          :value="item.dd_id">
                        </el-option>									
                      </el-select>
                  </el-form-item>
                </div>

              <div v-if="changeExecutor.service_type == 2">
                <el-form-item label="服务商负责人 :" class='is-required' prop="textName4"
                    v-if="changeExecutor.service_type == 2">
                    <el-select class="inputWarn" clearable placeholder="可选择一位服务商负责人" v-model="changeExecutor.excutor_leading" filterable>
                        <el-option
                          v-for="item in person"
                          :key="item.dd_id"
                          :label="item.nickname"
                          :value="item.dd_id">
                        </el-option>									
                      </el-select>
                  </el-form-item>

                  <el-form-item label="服务商 :" class='is-required'  prop="textName3">                     
                    <el-select class="inputWarn" allow-create filterable clearable placeholder="可选择一位服务商" v-model="changeExecutor.provider">
                        <el-option
                          v-for="item in CustomerBudinessMan"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>									
                      </el-select>
                  </el-form-item>
              </div>
                  
              <el-form-item label="转单时间 :" class='is-required'>
								<el-date-picker type="date" class="inputWarn" placeholder="请选择" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" v-model="changeExecutor.change_time">
								</el-date-picker>
							</el-form-item>

                  <el-form-item label="转单原因 :" class='is-required' prop="textName2">
                    <el-select class="inputWarn" placeholder="请选择" v-model="changeExecutor.reason" filterable>
                        <el-option
                          v-for="item in changeReson"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>									
                      </el-select>
                  </el-form-item>

                  <el-form-item label="转单说明 :" class='is-required' prop="textName">
                      <el-input    
                          type="textarea"
                          :rows="3"
                          class="inputWarn"
                          v-model= 'changeExecutor.remark'
                          >
                      </el-input>
                  </el-form-item>
              </div>  

            </el-form> 
          </div> 

          <div slot="footer" class="dialog-footer">
            <el-button @click="executorChange2 = false">取 消</el-button>
            <el-button type="primary" @click="changeTeam('changeExecutor')">确 定</el-button>
          </div>
        </el-dialog>

<!-- 拆分 -->
        <el-dialog  :visible.sync="executorChange3"  title="执行拆分" :modal="false" width="550px" class='chaifen' @close='splitClose'>
            <div class='CustomerLeaderAllbox'>
            <el-form label-position="right" label-width="140px" :model="r_dataFrom"  ref="r_dataFrom">
            <!-- 自营团队 -->
              <el-row v-for="(item,index) in r_dataFrom.excutor_detail" :key = 'index'>
                <!-- <p class='CustomerLeaderOne'>执行明细{{zhixingNum}}-{{index+1}}</p> -->
                <div class='CustomerLeaderOne'>
                  <span>执行明细{{zhixingNum}}-{{index+1}}</span>
                  <!-- <el-button  type='text' v-if =" r_data.excutor_detail.length > 1" @click='deleteWork(index)' class='deleteWorkBtn'>删除</el-button>	 -->
                <el-button  type='text' class='deleteWorkBtn' v-if =" r_dataFrom.excutor_detail.length > 1"  @click="removeRow(index)">删除</el-button>	

                </div>
                <div class="dialogSolid2"></div>
                  <el-form-item label="执行方 :" class='is-required'  :prop="'excutor_detail.' + index + '.service_type'">
                    <!-- <el-radio-group v-model="item.service_type" :key="index"> -->
                      <el-radio disabled v-model="item.service_type" label=1>自营团队</el-radio>
                      <el-radio disabled v-model="item.service_type" label=2>服务商团队</el-radio>
                    <!-- </el-radio-group> -->
                  </el-form-item>

                <div v-if="item.service_type == 1">
                  <el-form-item label="执行总监 :" class='is-required'  
                    :rules="[{ required: true, message: '请选择一位执行总监',trigger:'blur'}]"
                    :prop="'excutor_detail.' + index + '.excutor_leading'">
                      <el-select class="inputWarn" clearable value-key='dd_id' placeholder="可选择一位执行总监" v-model="item.excutor_leading" filterable>
                          <el-option
                            v-for="item in r_dataFrom.sel_excutor_leading"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>									
                        </el-select>
                    </el-form-item>

                  <el-form-item label="执行人:" class='is-required'
                    :prop="'excutor_detail[' + index + '].excutor_id'"
                    :rules="[{ required: true, message: '请选择一位执行人',trigger:'blur'}]"
                    > 
                     <!-- v-if="updatePeople && item.service_type == 1"  -->
                    <el-select class="inputWarn"
                      multiple
                      value-key="dd_id" 
                      placeholder="可选择多个执行人" 
                      v-model="item.excutor_id"
                      filterable >
                        <el-option
                          v-for="item in r_dataFrom.sel_excutor"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>									
                      </el-select>
                  </el-form-item>

                  <!-- :prop="'domains.' + i + '.value'" -->

                 <!-- <el-form-item label="执行人:" class='is-required'
                  v-for="(domain,i) in r_dataFrom.excutor_detail[index].domains" :key="i"
                  > 
                    <el-select class="inputWarn"
                      placeholder="可选择一个执行人" 
                      v-model="domain.value"
                      clearable
                      filterable 
								      @change="handleChangeproductPerson($event,index)"
                      >
                        <el-option
                          v-for="item in person"
                          :key="item.dd_id"
                          :label="item.nickname"
                          :value="item.dd_id">
                        </el-option>									
                      </el-select>
          				<el-button @click.prevent="removeDomain(domain,index)" v-if='r_dataFrom.excutor_detail[index].domains.length > 1'>删除</el-button>						
                  </el-form-item> 
                  <el-form-item>
                    <el-button  v-if="1" @click="addDomain(index)">添加执行人</el-button>
                  </el-form-item> -->
                  
                  <!-- <el-button @click="addDomain">新增一个执行人</el-button> -->
                </div>

                <div v-if = "item.service_type == 2">
                  <el-form-item label="服务商负责人 :" class='is-required' 
					        :rules="[{ required: true, message: '请先到更换执行步骤选择一位服务商负责人',trigger:'blur'}]"                  
                  :prop="'excutor_detail.' + index + '.excutor_leading'">
                    <el-select class="inputWarn" clearable placeholder="可选择一位服务商负责人" v-model="item.excutor_leading" filterable>
                         <el-option
                          v-for="item in r_dataFrom.sel_excutor_leading"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>							
                        <!-- <el-option
                          v-for="item in person"
                          :key="item.dd_id"
                          :label="item.nickname"
                          :value="item.dd_id">
                        </el-option> -->
                      </el-select>
                  </el-form-item>
                 
                  <el-form-item label="服务商 :" class='is-required'
                   v-if="item.service_type == 2" 
					        :rules="[{ required: true, message: '请选择一位服务商',trigger:'blur'}]"
                   :prop="'excutor_detail.' + index + '.provider'">     
                    <el-select class="inputWarn" placeholder="可选择一个服务商" v-model="item.provider" filterable clearable>
                        <el-option
                          v-for="item in r_dataFrom.personSplic"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>									
                      </el-select>
                  </el-form-item>
                </div>

                <el-form-item label="产品信息 :" class='is-required'
                 :prop="'excutor_detail.' + index + '.product_id'"
					        :rules="[{ required: true, message: '请选择产品信息',trigger:'blur'}]"
                 >
                  <el-cascader
                    v-model="item.product_id"
                    expand-trigger="hover"
                    filterable
                    clearable
                    placeholder="请选择"
                    :options="product"
                    class="inputWarn">
                  </el-cascader>
                </el-form-item>

                <el-form-item label="产品说明 :" class='is-required' 
					        :rules="[{ required: true, message: '请填写产品说明',trigger:'blur'}]"
                  :prop="'excutor_detail.' + index + '.product_brief'"
                >
                    <el-input    
                        placeholder="请输入"              
                        type="textarea"
                        :rows="3"
                        class="inputWarn inputWarn23"
                        v-model="item.product_brief"
                        >
                    </el-input>
                </el-form-item>

                <el-form-item label="合同价格 :" class='is-required' 
					      :prop="'excutor_detail.' + index + '.product_brief'">
                  <input
                    @keydown="handleInput2" 
                      type="number"
                      placeholder="￥请输入"
                      class="s_client_widthInput inputWarn inputWarnPrice"
                      v-model.number="item.price"
                      ref="handleInputPrice"
                      >
                  <span class='spanRed' style="display: none;" ref="abc">请输入价格</span>
                  <!-- </el-input> -->
                </el-form-item>
                <!-- <el-button class='deleteWorkBtn' v-if =" r_dataFrom.excutor_detail.length > 1"  @click="removeRow(index)">删除</el-button>	 -->
            </el-row>

            </el-form> 
             <!-- v-show = '如果只有一个就使其不起作用' @click='deleteWork(index)' -->
          </div> 
          <!--  @click.prevent='addWork'  -->
        <el-button @click.prevent='addWork()'>新增明细</el-button>
            <div slot="footer" class="dialog-footer">
              <el-button @click="executorChange3 = false">取 消</el-button>
              <el-button type="primary" @click="executeSplit('r_dataFrom')">确 定</el-button>
            </div>
        </el-dialog>

<!-- 执行明细 点击跟进事件 -->
    <el-dialog  :visible.sync="executorChange4" title="执行情况跟进1" :modal="false" width="550px" class='executiveLogging3'>
      <p class='CustomerLeaderOne2'>执行明细{{genjinNum}}</p>
      <div class="dialogSolid2"></div>
      <el-form :model="replaceform" label-width="100px" class='executiveLogging3Top' ref='replaceform' :rules="rules">
        <el-form-item label="执行进度 :" class='is-required'>
          <el-select v-model="replaceform.status"  class="inputWarn" filterable placeholder="请选择" @change='followUP'>
              <el-option
                  v-for="item in executorChange4Data"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  >
              </el-option>
          </el-select>
        </el-form-item>
      
          <el-form-item label="初稿时间 :" class="is-required"  prop="begin_time" v-if="followUPNum == 3 || followUPNum == 6">
            <el-date-picker
                class="inputWarn"
                v-model="replaceform.begin_time"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions1"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>


            <el-form-item label="修改次数 :" class="is-required" v-if="followUPNum == 4" prop="mod_count">
             <el-input    
                placeholder="请输入"              
                type="text"
                class="inputWarn"
                v-model="replaceform.mod_count"
                >
            </el-input>
          </el-form-item>

          <el-form-item label="定稿时间 :" class="is-required"  prop="confirm_time" v-if="followUPNum == 5 || followUPNum == 6 ">
            <el-date-picker
                class="inputWarn"
                v-model="replaceform.confirm_time"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions1"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="执行记录 :" v-if="followUPNum !== 8">
              <el-input  class="inputWarn" type="textarea" :rows="5" v-model="replaceform.brief" placeholder="请输入备注"></el-input>
          </el-form-item>
          
          <div v-if="followUPNum == 8" >
            <el-form-item label="退款时间 :" class="is-required" prop="refund_time">
              <el-date-picker
                  v-model="replaceform.refund_time"
                  type="date"
                  class="inputWarn" 
                  placeholder="选择日期"
                  :picker-options="pickerOptions1"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="退款金额 :" class="is-required" prop="refund_money">
                <input @keydown="handleInput2" v-model="replaceform.refund_money" type="number" class="inputWarn s_client_widthInput" placeholder="请输入价格">
                  <!-- <el-input class="inputWarn"  type="text" v-model="replaceform.refund_money" placeholder="请输入"></el-input> -->
            </el-form-item>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="executorChange4 = false">取 消</el-button>
        <el-button type="primary" @click.prevent="followUpBtn('replaceform')">确 定</el-button>
      </div>
    </el-dialog>

<!-- 更改客服团队 -->
		<!-- <el-dialog  :visible.sync="changePeopleAe" :modal="false" @close='cancel' :title="dialogValChildTitle" width="550px" @open='whenOpen'> -->
		<el-dialog  :visible.sync="changePeopleAe" :modal="false" title="更改" width="550px">
      <el-form label-position='right' label-width="100px"  :model="r_dataPeople" ref="r_dataPeople">									
					<el-form-item label="负责人 :" class='is-required'>
						<el-select  
							placeholder="请选择"
							v-model="r_dataPeople.service_leading" 
							filterable 
							clearable
							class='elText'
							>
							<el-option
								v-for="item in person"
								:key="item.dd_id"
                :label="item.nickname"
                :value="item.dd_id">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="备注 :">
						<el-input    
							placeholder="请输入"              
							type="textarea"
							class='elText'
							:rows="5"
							v-model="r_dataPeople.remarks" 
							>
						</el-input>
					</el-form-item>
				</el-form> 
        <span slot="footer" class="dialog-footer">
          <el-button @click="changePeopleAe = false">取 消</el-button>
          <el-button type="primary" @click="changePeopleAeFc">确 定</el-button>
			</span>
    </el-dialog>

    <!-- 更改执行明细负责人 -->
		<!-- <el-dialog  :visible.sync="changePeopleAe" :modal="false" @close='cancel' :title="dialogValChildTitle" width="550px" @open='whenOpen'> -->
		<el-dialog  :visible.sync="changePeopleLeader" :modal="false" title="更改" width="550px">
      <el-form label-position='right' label-width="100px"  :model="r_dataPeople" ref="r_dataPeople">									
					<el-form-item label="负责人 :" class='is-required'>
						<el-select  
							placeholder="请选择"
							v-model="r_dataPeople.excutor_leading" 
							filterable 
							clearable
							class='elText'
							>
							<el-option
								v-for="item in person"
								:key="item.dd_id"
                :label="item.nickname"
                :value="item.dd_id">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="备注 :">
						<el-input    
							placeholder="请输入"              
							type="textarea"
							class='elText'
							:rows="5"
							v-model="r_dataPeople.remarks" 
							>
						</el-input>
					</el-form-item>
				</el-form> 
        <span slot="footer" class="dialog-footer">
          <el-button @click="changePeopleLeader = false">取 消</el-button>
          <el-button type="primary" @click="changePeopleLeaderFc">确 定</el-button>
			</span>
    </el-dialog>

      <el-dialog :visible.sync="changePeopleLeader22" :modal="false" title="派单" width="550px">
				<el-form ref='r_dataLeder' label-position="right" label-width="120px" :model="r_dataLeder">
					<el-form-item label="执行人 :" 
							class='is-required'
							:rules="[{ required: true, message: '请选择至少一位执行人',trigger:'blur'}]"
							>							
							<el-select  
								v-model="r_dataLeder.excutor_id"
								multiple
								filterable 
                clearable
								value-key="dd_id"
								placeholder="可选择多个执行人"
								class="elText elText2"
								>
								<el-option
									v-for="item in person"
									:key="item.dd_id"
									:label="item.nickname"
									:value="item.dd_id">
								</el-option>
							</el-select>
						</el-form-item>
					
					<el-form-item label="备注 :">
						<el-input v-model="r_dataLeder.remark" type="textarea" :rows="5"  class='elText'>
						</el-input>
					</el-form-item>
				</el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="changePeopleLeader22 = false">取 消</el-button>
          <el-button type="primary" @click="dialogAllBtn">确 定</el-button>
        </span>
      </el-dialog>
<!-- 驳回 --> 
        <!-- <span v-for="item in input_content" :key="item.id">
                <el-row v-if="item.type === 'choose'">
                    <el-col :span="4">
                        {{item.title}}
                    </el-col>
                    <el-col :span="10">
                        <el-switch v-model="r_data[item.name]" @change></el-switch>
                    </el-col>
                </el-row>
                <el-row v-if="item.type === 'pay_choose'">
                    <el-col :span="4">
                        {{item.title}}
                    </el-col>
                    <el-col :span="10">
                        <el-switch v-model="r_data.first_pay" @change></el-switch>
                    </el-col>
                </el-row>
                <el-row v-if="item.type === 'pay_time'" v-show="r_data.first_pay">
                    <el-col :span="4">
                        {{item.title}}
                    </el-col>
                    <el-col :span="10">
                        <el-date-picker
                            v-model="r_data[item.name]"
                            type="date"
                            placeholder="选择日期"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-col>
                </el-row>
                <el-row v-if="item.type === 'pay_select'" v-show="r_data.first_pay">
                    <el-col :span="4">
                        {{item.title}}
                    </el-col>
                    <el-col :span="10">
                        <el-select v-model="r_data[item.name]" filterable placeholder="请选择">
                            <el-option
                                v-for="val in item.content"
                                :key="val.value"
                                :label="val.label"
                                :value="val.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row v-if="item.type === 'pay_input'" v-show="r_data.first_pay">
                    <el-col :span="4">
                        {{item.title}}
                    </el-col>
                    <el-col :span="10">
                        <el-input v-model="r_data[item.name]" type="number" placeholder="￥(元)" style="width:220px"></el-input>
                    </el-col>
                </el-row>
                <el-row v-if="item.type === 'time'">
                    <el-col :span="4">
                        {{item.title}}
                    </el-col>
                    <el-col :span="10">
                        <el-date-picker
                            v-model="r_data[item.name]"
                            type="date"
                            placeholder="选择日期"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-col>
                </el-row>
                <el-row v-if="item.type === 'select'">
                    <el-col :span="4">
                        {{item.title}}
                    </el-col>
                    <el-col :span="10">
                        <el-select v-model="r_data[item.name]" filterable clearable placeholder="请选择">
                            <el-option
                                v-for="val in item.content"
                                :key="val.value"
                                :label="val.label"
                                :value="val.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row v-if="item.type === 'option'">
                  <el-col :span="4" style="line-height: 40px">
                        {{item.title}}
                    </el-col>
                  <el-col :span="8">
                    <el-select v-model="profile" @change="handleCompany" placeholder="请选择" filterable clearable>
                      <el-option
                          v-for="item in company_info"
                          :key="item.company_id"
                          :label="item.name"
                          :value="item.company_id">
                      </el-option>
                    </el-select>
                  </el-col>
                    <el-col :span="8">
                        <el-select v-model="r_data[item.name]" multiple filterable placeholder="请选择">
                            <el-option
                              v-for="(item, index) in person"
                              :key="index"
                              :label="item.nickname"
                              :value="item.dd_id">
                            </el-option>
                          </el-select>
                    </el-col>
                </el-row>
                <el-row v-if="item.type === 'provider'">
                    <el-col :span="4">
                        {{item.title}}
                    </el-col>
                    <el-col :span="10">
                        <el-select v-model="r_data[item.name]" clearable filterable allow-create placeholder="请选择服务商">
                            <el-option
                                v-for="provider in item.content"
                                :key="provider.value"
                                :label="provider.label"
                                :value="provider.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                 <el-row v-if="item.type === 'summary_textarea'">
                    <el-col :span="4">
                        {{item.title}}
                    </el-col>
                    <el-col :span="10">
                        <el-input type="textarea" :rows="2" v-model="r_data[item.name]" placeholder="请输入内容"></el-input>
                    </el-col>
                </el-row>
                <el-row v-if="item.type === 'textarea'">
                    <el-col :span="4">
                        {{item.title}}
                    </el-col>
                    <el-col :span="10">
                        <el-input type="textarea" :rows="2" v-model="r_data[item.name]" placeholder="请输入说明"></el-input>
                    </el-col>
                </el-row>
                 <el-row v-if="item.type === 'file'">
                    <el-col :span="4">
                        {{item.title}}
                    </el-col>
                    <el-col :span="10">
                        <upload @fileStatus="fileStatus" @fileTrue="fileTrue" :success="success"></upload>
                    </el-col>
                </el-row>
                <el-row v-if="item.type === 'file_textarea'">
                    <el-col :span="4">
                        {{item.title}}
                    </el-col>
                    <el-col :span="10">
                        <el-input type="textarea" :rows="2" v-model="r_data[item.name]" placeholder="请输入内容"></el-input>
                    </el-col>
                </el-row>
                <br/>
            </span> -->
    
    
    <!-- <el-dialog title="驳回" :visible.sync="centerDialogVisible" width="30%" :modal="false">      
       <div class = 'dialogSolid'></div>
       <div class = 'spaceSky'></div>

       <el-form>
        <el-form-item label="说明 :" label-width="82px">
            <el-col :span="20">
              <el-input    
                   placeholder="请输入"              
                  type="textarea"
                  :rows="5"
                  class="s_item_form"
                  v-model="r_data.remarks" 
                  >
              </el-input>
            </el-col>
          </el-form-item>
        </el-form>
           
      <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="centerDialogVisible_btn">确 定</el-button>
            </span>
    </el-dialog> -->

<!-- 终止 -->
<!-- <el-dialog title="终止" :visible.sync="centerDialogEnd" width="30%" :modal="false">      
       <div class = 'dialogSolid'></div>
       <div class = 'spaceSky'></div>

       <el-form>
        <el-form-item label="说明 :" label-width="82px">
            <el-col :span="20">
              <el-input         
                  placeholder="请输入"      
                  type="textarea"
                  :rows="5"
                  class="s_item_form"
                  v-model="r_data.reason" 
                  >
              </el-input>
            </el-col>
          </el-form-item>
        </el-form>
           
      <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogEnd = false">取 消</el-button>
                <el-button type="primary" @click="centerDialogVisible_btn">确 定</el-button>
            </span>
    </el-dialog> -->
    		<el-dialog :visible.sync="addExecutorDialogAE" :modal="false" title="更换" width="550px">
				<div class='spaceBox'></div>
				<el-form label-position='right' label-width="100px"  :model="r_data" ref="r_data">									
					<el-form-item label="客服 :" class='is-required'>
						<el-select  
							placeholder="请选择"
							v-model="r_data.ae" 
							filterable 
							clearable
							class='elText'
							>
							<el-option
								v-for="item in person"
								:key="item.dd_id"
								:label="item.nickname"
								:value="item.dd_id">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="备注 :">
						<el-input    
							placeholder="请输入"              
							type="textarea"
							class='elText'
							:rows="5"
							v-model="r_data.remarks" 
							>
						</el-input>
					</el-form-item>
				</el-form>  
        <span slot="footer" class="dialog-footer">
          <el-button @click="addExecutorDialogAE==false">取 消</el-button>
          <el-button type="primary" @click="dialogAllBtnAE('r_data')">确 定</el-button>
        </span>
		</el-dialog> 

    		<el-dialog :visible.sync="addExecutorDialog" :modal="false" title="新增执行人" width="550px">
    <el-form label-position="right" label-width="140px" :model="r_data" ref = 'r_data'>
					<div class="dialogSolid"></div>  						
          	 <!-- :prop="'excutor_detail.' + index + '.service_type'"					 -->
                  <el-form-item label="执行方 :" class='is-required' >
                    <el-radio-group v-model="r_data.type">
                      <el-radio label=1>自营团队</el-radio>
                      <el-radio label=2>服务商团队</el-radio>
                    </el-radio-group>
                  </el-form-item>

               <!-- :rules="[{ required: true, message: '请选择至少一位执行人',trigger:'blur'}]" 
               :prop="'detail[' + index + '].excutor_id'"-->
						<el-form-item label="执行人 :" 
							class='is-required' v-if='r_data.type == 1'
							>		

              <!-- multiple
              		@change='changeselectData'				 -->
							<el-select  
								v-model="r_data.excutor_id"
									filterable 
                  clearable
									value-key="dd_id"
									placeholder="可选择一个执行人"
									class="elText elText2"
								>
								<el-option
									v-for="item in person"
									:key="item.dd_id"
									:label="item.nickname"
									:value="item.dd_id">
								</el-option>
							</el-select>
						</el-form-item>

					<!-- :prop="'detail.' + index + '.provider_id'" 
						:rules="[{ required: true, message: '请选择一位服务商',trigger:'blur'}]" -->
            <el-form-item label="服务商 :" v-if='r_data.type == 2'
						 class='is-required'
						 >							
							<el-select  
								allow-create
								filterable
                clearable
								placeholder="可选择一个服务商"
								v-model="r_data.excutor_id" 
								class="elText elText2"
								>
								<el-option
									v-for="item in CustomerBudinessMan"
									:key="item.value"
									:value="item.value"
									:label="item.label"
									>
								</el-option>
							</el-select>	 
						</el-form-item>

            <el-form-item label="备注">
            <el-input class="elText" type="textarea" :rows="5" v-model="r_data.remarks" placeholder="请输入备注"></el-input>
          </el-form-item>


		  </el-form> 
      <span slot="footer" class="dialog-footer">
        <el-button @click="addExecutorDialog = false">取 消</el-button>
        <el-button type="primary" @click="dialogAllBtnPeople('r_data')">确 定</el-button>
			</span>
      </el-dialog>

    <!-- <el-dialog
        :modal="false"
        title="新增执行人"
        :visible.sync="addExecutorDialog">
      <el-row v-if="BasicData.type == 'select'">
        <el-col :span="4">
          {{ BasicData.title }}
        </el-col>
        <el-col :span="10">
          <el-select v-model="r_form.value" filterable placeholder="请选择">
            <el-option
                v-for="index in BasicData.content"
                :key="index.value"
                :label="index.label"
                :value="index.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <br/>
      <el-row v-if="r_form.value === 'self_support'">
        <el-col :span="4">
          执行人
        </el-col>
        <el-col :span="6">
          <el-select v-model="profile" @change="handleCompany" placeholder="请选择" filterable clearable>
            <el-option
                v-for="item in company_info"
                :key="item.company_id"
                :label="item.name"
                :value="item.company_id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="10">
          <el-select v-model="r_form.self_support" multiple filterable placeholder="请选择">
            <el-option
              v-for="(item, index) in person"
              :key="index"
              :label="item.nickname"
              :value="item.dd_id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <br/>
      <el-row v-if="r_form.value === 'service_provider'">
        <el-col :span="4">
          服务商
        </el-col>
        <el-col :span="10">
          <el-select v-model="r_form.service_provider" filterable allow-create placeholder="请选择">
            <el-option
                v-for="item in service_provider"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <br/>
      <el-row v-if="remark.type == 'textarea'">
        <el-col :span="4">
          {{ remark.title }}
        </el-col>
        <el-col :span="10">
          <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="r_form.remark"></el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
                <el-button @click="addExecutorDialog = false">取 消</el-button>
                <el-button type="primary" @click="addTrue">确 定</el-button>
            </span>
    </el-dialog>
    <el-dialog title="驳回说明：" :visible.sync="workInfoReject" :modal="false">
            <span>
                <el-input
                    style="width: 400px"
                    type="textarea"
                    :rows="5"
                    placeholder="请输入驳回说明"
                    v-model="RejectDescription">
                </el-input>
            </span>
      <span slot="footer" class="dialog-footer">
                <el-button @click="workInfoReject = false">取 消</el-button>
                <el-button type="primary" @click="workInfoRejectT">确 定</el-button>
            </span>
    </el-dialog>
  
     -->
     <!-- 取消执行人 -->
       <el-dialog title="" :visible.sync="workInCancelForm" :modal="false" width="550px">
      <el-form :model="cancelform" label-width="120px">
        <el-form-item label="取消原因">
          <el-select v-model="r_data.result" placeholder="请选择" class='inputWarn is-required'>
            <el-option
                v-for="item in reasons"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否取消该执行人未完成的brief">
          <el-switch v-model="r_data.brife"></el-switch>
        </el-form-item>
        <el-form-item label="备注">
          <el-input  type="textarea" :rows="5"  class='inputWarn' v-model="r_data.remarks" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="workInCancelForm = false">取 消</el-button>
        <el-button type="primary" @click="workInCancelFormT">确 定</el-button>
      </div>
    </el-dialog>
    
    <!-- when i wrote this.only God and I understood what I was doing -->
    <!-- Now,God only knows -->
    <allDialog @dialogall='dialogall' :dialogValChildTitle='dialogAllTitle,product,dialogAll1,dialogId,menuId5,message,annexData'></allDialog>
    <beforeAllDialog @beforedialogall='beforedialogall' :dialogValChildTitle2='beforeDialogAllTitle,beforeDialogAll1,message,dialogId,annexData'></beforeAllDialog>

  </div>
</template>

<script>
import annexList from "../.././components/s_customer/annexList";
import upload from "../.././components/s_customer/fiieDataCe";
import Cookies from "js-cookie";
import allDialog from "./allDialog";
import beforeAllDialog from "./beforeAllDialog";


export default {
  components: {
    annexList,
    allDialog,
    beforeAllDialog,
    upload
  },

  data() {
    return {
       pickerOptions1:{
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
    },
      updatePeople:true,
      activeNameTab:'first',
      work_type:1,
      tableStatus:[{ text: '未开始', value: '未开始' },{ text: '进行中', value: '进行中' },{ text: '修改中', value: '修改中' },{ text: '已暂停', value: '已暂停' }],
      editNum:0,
      changePeopleAe:false,
      val:[],
      handleWarningId:0,
      eyeId:0,
      manage_id:0,
      genjinNum:'',
      genjinId:'',
      excutor_brief:true,
      excuteListData:[],
      workInReplacePeople:false,
      // getFollowUpStatus:[
      //    {
      //       "text": "待启动",
      //       "value": "待启动"
      //   },
      //    {
      //      "text": "进行中",
      //       "value": "进行中"
      //   },
      //   {
      //     "text": "初稿定稿",
      //     "value": "初稿定稿"
      //   },
      //   {
      //     "text": "修改中",
      //     "value": "修改中"
      //   },
      //   {
      //     "text": "修改稿定稿",
      //     "value": "修改稿定稿"
      //   },
      //   {
      //      "text": "已完成",
      //     "value": "已完成"
      //   },
      //   {
      //     "text": "已暂停",
      //     "value": "已暂停"
      //   },
      //   {
      //     "text": "已退款",
      //     "value": "已退款"
      //   }
      // ],
      rules:{
          begin_time: [
            { required: true, message: '请选择初稿时间', trigger: 'blur' }
          ],
          mod_count: [
            { required: true, message: '请选择修改次数', trigger: 'blur' }
          ],
          confirm_time: [
            { required: true, message: '请选择定稿时间', trigger: 'blur' }
          ],
          refund_time: [
            { required: true, message: '请选择退款时间', trigger: 'blur' }
          ],
          refund_money: [
            { required: true, message: '请填写退款金额', trigger: 'blur' }
          ]
          // textName2: [
          //   { required: true, message: '请选择转单原因', trigger: 'blur' }
          // ],
          // textName3: [
          //   { required: true, message: '请选择至少一个执行人', trigger: 'blur' }
          // ],
          // textName4: [
          //   { required: true, message: '请选择一个执行负责人', trigger: 'blur' }
          // ]
      },
      itemType:2,
      changePeopleLeader22:false,
      r_dataLeder:{
        manage_id:0,
				btn_no:7,
				excutor_id:[],
				remark:''
      },
      changePeopleLeader:false,
      zhixingNum:0,
      product:[],
      CustomerBudinessMan:[],
      warn_count:0,
      changeReson:{},
      briefList:[],
      eyeChangeRecord:[],
      menuId5:false,
      handleWarningDialog:false,
      warningDialog:false,
      warnListData:[],
      warnListDataBtn:false,
      followUPNum:1,
      executor:[],
      executorChange4Data:{},
      executorChange4DataArray:[
        { text: '待启动', value: '待启动' },
        { text: '进行中', value: '进行中' },
        { text: '初稿提交', value: '初稿提交' },
        { text: '修改中', value: '修改中' },
        { text: '定稿', value: '定稿' },
        { text: '已完成', value: '已完成' },
        { text: '已暂停', value: '已暂停' },
        { text: '已退款', value: '已退款' }
        ],
        executorFourArrayreason:[
          {text: '多次修改不满意', value: '多次修改不满意'},
          {text: '设计不满意/沟通不顺畅/客户要求换设计', value: '设计不满意/沟通不顺畅/客户要求换设计'},
          {text: '客户要求不明确/设计师提出换设计', value: '客户要求不明确/设计师提出换设计'},
          {text: '客户长期失联/换对接人/换项目/升级设计', value: '客户长期失联/换对接人/换项目/升级设计'},
          {text: '设计师由于其他工作/离职无法继续设计', value: '设计师由于其他工作/离职无法继续设计'},
          {text: '无法注册', value: '无法注册'},
          {text: '操作有误', value: '操作有误'},
          {text: '其他', value: '其他'}
        ],
        executorFourArray:[],
        followArray:[],
        followNickname:[],
      detail_ids:0,
      dialogId:0,
      paginationNum:{},
      isContent:0,
      paginationNum2:{},
      paginationNum3:{},      
      changeRecord:[],
      changeRecord2data:[],
      executorChangeBialog:false,
      executorChange2:false,
      executorChange3:false,
      executorChange4:false,
      executorFour:false,

      exeCchecked:false,
      exVal:'',
      executiveLoggingEye:false,
      executiveLogging2:false,
      executorData: [],
      executorDataleading:'',
      executorDataleadingAe:'',
      executorData_btn:{},
      Execution_detail_list: [],

      ison:true,
      CustomerRadios:3,
      CustomerRadio:3,
      CustomerRadio2:4,
      CustomerLeader:[],
      isFirst:true,
      determineWindow: false, //点击确认按钮
      idObj: {},
      value: "",
      operateLog:[], // 操作日志数组
      operateLog2:[],
      instruction: "",
      RejectDescription: "",
      workInfoReject: false,
      annexData: [],
      number: 0,
      message: {}, // 工单详情数据
      menu: [], // 工单的按钮事件
      input_content: {}, // 工单派单的数据
      process: [], // 详情步骤条
      tabActiveName: "first",
      centerDialogVisible: false, // 派单loading框
      centerDialogEnd: false,
      dialogAll1: false,
      beforeDialogAll1:false,
      beforeDialogAllTitle:'',
      dialogAllTitle: "",
      workInCancelForm: false,
      workInReplace: false,
      warn_status:1,
      reasons:[],
      reasons2: [
        { id: "1", name: "派单不符" },
        { id: "2", name: "客户不满意" },
        { id: "3", name: "离职" },
        { id: "4", name: "其它" }
      ],
      // 取消执行人发送的数据
      cancelform: {
        result: "", // 取消原因
        brife: false, // 取消执行人未完成的任务
        remarks: "", // 取消执行人备注
        id: "",
        type: "",
        manage_id: ""
      },
      // 更换AE发送数据
      replaceform: {
        service_leading:'',
        log_status:'',
        status:1,
        begin_time:'',
        mod_count:'',
        confirm_time:'',
        
        manage_id: 0,
        detail_id:'',  //执行明细ID 指哪个
        warn_brief:'', //预警内容
        warn_dd_ids:[], //提醒关注人 【0】 【1】
        warn_type:[],  //提醒方式  1钉钉通知  2 ding

        warn_id:'',//预警信息ID
        close_reason:'',//解决方式

        new_dd_id: "",
        result: "", // 更换原因
        remarks: "", // 更换AE备注
        brife: true, // 历史未完成的Brief是否转移
      },
      ruleForm:{
        pay_count:'',        
      },
      paytype:[],
       pay_periods:[],
       r_datas: {

       },
			addExecutorDialogAE:false,
      r_data: {
        // 派单需要传送后台的数据
        excute_detail_id:'',
        type:'1',
        manage_id: 0,
        detail_id:0,
        service_type:1,
        excutor_leading:'',
        excutor_id:[],
        reason:'',
        remark:'',
        remarks:'',
        btn_no: 0,
        first_pay: true,
        pay_time: '',
        pay_count:'',
        pay_price: '',
        pay_type: '',
        pay_remarks: '',

        pay_abc:'',
        pro_id:[],

        pre_sale_id: [],
        client_director_id: "",
        dd_id: [],
        provider_id: "",
        brife: "",
        file_remarks: "",

        step: 0,
        task_id: 0,
        result: "",
        summary: "",
        summary_textarea: "",
        file: [],
        contract: false,
        
        description: ""
      },
      r_dataFrom:{
           manage_id:0,
           detail_id:0,
           sel_excutor_leading:[],
           personSplic:[],
           sel_excutor:[],
          excutor_detail:[
          { 
            service_type:'1',
            excutor_leading:'',
            excutor_id:[],
            product_id:[],
            product_brief:'',
            price:'',
            domains: []
          }
        ],
       
      },
      changeExecutor:{
        provider:'',
        manage_id:0,
        detail_id:0,
        service_type:1,
        excutor_leading:'',
        excutor_id:[],
        change_time:'',
        reason:'',
        remark:''
      },
      changeExecutor2:['03551210501668796203','03551210501668796203','23'],
      r_form: {
        value: "",
        self_support: [],
        service_provider: "",
        remark: "",
        manage_id: "",

        client_director_id:'',
        excutor_detail:[{
            service_type:1,
            excutor_leading: '',
            product_id:'',
            product_brief:'',
            price:'',
            provider_id:''
        }]
      },
      brife: "",
      add_brife: false,
      add_excutor: false,
     
      addExecutorDialog: false,
      BasicData: {},
      self_support: [],
      service_provider: [],
      remark: {},
      breifDetail: [], // 工单任务
      client_id: 0, // 客户id
      second_count: 0, // 修改次数
      first_count: 0, // 初稿次数
      task_type: 0, // 判断项目或订单
      link_id: 0, // 项目或订单id
      newFileAdd: false,
      remarks: "",
      file: "",
      name: "",
      path: "",
      size: "",
      success: false,
      updata: false,
      AeBossPeople:[],
      r_dataPeople:{
        id:0,
        manage_id:0,
        service_leading:'',
        remarks:''
      },
      // person: [],
      company: {
        company_id: "",
        dept: ""
      },
      profile: JSON.parse(Cookies.get("company_id"))
    }
  },
  computed:{
    company_info(){
      return this.$store.state.app.company_info;
    },
    person(){
      return this.$store.state.app.person;
    }
  },
  methods: {
   
    getFollowUpStatusChange(value, row){
        return row.excutor_status_desc === value;
    },
    followArrayChange(value, row){
        return row.name === value;
    },
     followArrayChangePeople(value, row){
        return row.nickname === value;
    },
    splitClose(){
      let excutorArr = this.r_dataFrom.excutor_detail;
      this.r_dataFrom.excutor_detail.splice(1,excutorArr.length);
      this.r_dataFrom.sel_excutor_leading = []
      this.r_dataFrom.sel_excutor = []
      this.r_dataFrom.excutor_detail[0].excutor_id = []
    },
    splitClose2(){
      this.changeExecutor.excutor_id = [];
      // let excutorArr = this.changeExecutor.excutor_id;
      // this.changeExecutor.excutor_id.splice(1,excutorArr.length);
    },
    removeDomain(item,num) {
      let index = this.r_dataFrom.excutor_detail[num].domains.indexOf(item);
		if (index !== -1) {
			this.r_dataFrom.excutor_detail[num].domains.splice(index, 1);
			this.r_dataFrom.excutor_detail[num].excutor_id.splice(index, 1);
			}
		},
    handleChangeproductPerson(value,index){
				this.r_dataFrom.excutor_detail[index].excutor_id.push(value);
    },
    tableRowClassName({row, rowIndex}){
    },
    dialogAllBtnAE(){
      if (!this.r_data.excutor_id) {
            this.$message({
              message: '请选择执行人',
              type: 'warning'
            })
            }else{
              this.$post("managePresale/addExcutor", this.r_data)
                .then(data => {
                  if (data.code) {
                    this.$message({
                      message: '增加成功!',
                      type: "success"
                    });
                    this.$router.go(0)
                    this.$store.commit("removeTag", "workInfo");
                    this.$store.commit("closePage", "workInfo");
                    this.addExecutorDialog = false;
                    this.r_dataPeople = {};
                    this.workOperateLog();
                  } else {
                    this.$message({
                      message: data.errorMsg,
                      type: "warning"
                    });
                  }
                })
                .catch(() => {
                  this.$message.error("服务器错误，请稍后重试..");
                });
            }
    },
    executorFourChange(value, row){
        return row.name === value;
    },
    executorFourChangereason(value, row){
        return row.reason === value;
    },
    dialogAllBtnPeople(){
        if (!this.r_data.excutor_id) {
			this.$message({
				message: '请选择执行人',
				type: 'warning'
			})
			}else{
        this.$post("managePresale/addExcutor", this.r_data)
          .then(data => {
            if (data.code) {
              this.$message({
                message: '增加成功!',
                type: "success"
              });
              this.$router.go(0)
              this.$store.commit("removeTag", "workInfo");
              this.$store.commit("closePage", "workInfo");
              this.addExecutorDialog = false;
              this.r_dataPeople = {};
              this.workOperateLog();
            } else {
              this.$message({
                message: data.errorMsg,
                type: "warning"
              });
            }
          })
          .catch(() => {
            this.$message.error("服务器错误，请稍后重试..");
          });
      }
    },
    dialogAllBtn(){
      if (this.r_dataLeder.excutor_id.length == 0) {
			this.$message({
				message: '请选择执行人',
				type: 'warning'
			})
			}else{
        this.$post("managePresale/operateBtn", this.r_dataLeder)
          .then(data => {
            if (data.code) {
              this.$message({
                message: '更改成功!',
                type: "success"
              });
              this.$router.go(0)
              this.$store.commit("removeTag", "workInfo");
              this.$store.commit("closePage", "workInfo");
              this.changePeopleAe = false;
              this.r_dataPeople = {};
              this.workOperateLog();
            } else {
              this.$message({
                message: data.errorMsg,
                type: "warning"
              });
            }
          })
          .catch(() => {
            this.$message.error("服务器错误，请稍后重试..");
          });
      }
    },
    handleInput2(e) {
                // 通过正则过滤小数点后两位
              e.target.value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || null
          },
      handleFilterChange(value, row) {
        return row.log_status_str === value;
      },
    changePeopleLeaderFc(){
      this.$post("manageNew/editExcutorLeading", this.r_dataPeople)
          .then(data => {
            if (data.code) {
              this.$message({
                message: '更改成功!',
                type: "success"
              });
              // this.$router.push({ name: "workInfoNew" });
              this.$router.go(0)
              this.$store.commit("removeTag", "workInfo");
              this.$store.commit("closePage", "workInfo");
              this.changePeopleAe = false;
              this.r_dataPeople = {};
              this.workOperateLog();
            } else {
              this.$message({
                message: data.errorMsg,
                type: "warning"
              });
            }
          })
          .catch(() => {
            this.$message.error("服务器错误，请稍后重试..");
          });
    },
    changeAllPeople(val){
      this.changePeopleLeader = true;
      this.r_dataPeople.id = val.id;
    },
   
    changePeopleAeFc(){
      // 更改提交
      if (!this.r_dataPeople.service_leading) {
          this.$message({
            message: '请选择负责人',
            type: 'warning'
          })
        }else{
          this.$post("manageNew/editServiceLeading", this.r_dataPeople)
          .then(data => {
            if (data.code) {
              this.$message({
                message: '更改成功!',
                type: "success"
              });
              // this.$router.push({ name: "workInfoNew" });
              this.$store.commit("removeTag", "workInfo");
              this.$store.commit("closePage", "workInfo");
              this.changePeopleAe = false;
              this.r_dataPeople = {};
              this.workOperateLog();
              this.$router.go(0)
            } else {
              this.$message({
                message: data.errorMsg,
                type: "warning"
              });
            }
          })
          .catch(() => {
            this.$message.error("服务器错误，请稍后重试..");
          });
        }
    },
    handleClickPeople(val){
      this.changePeopleAe = true;
    },
    handleCurrentChange(val){
      if(this.isContent==1){
        this.changeContent(true,val)
      }else{
        this.executiveLeyeOpen(val)
      }
    },
    handleCurrentChange2(val){
      this.serviec_change_record_btn(val);
    },
      handleCurrentChange3(val){
      this.executorChange(this.executorChangeNum,val);
    },
      addDomain(index) {
          this.r_dataFrom.excutor_detail[index].domains.push(
          { 
            value: '',
            key: Date.now()
          });
        // this.r_dataFrom.domains.push(
        //   { 
        //     service_type:'1',
        //     excutor_leading:'',
        //     excutor_id:[],
        //     product_id:[],
        //     product_brief:'',
        //     price:'',
        //     value: [],
        //     key: Date.now()
        //   });
      },
    radioChange(){
      setTimeout(()=>{
          this.itemType = 1
        })
      // this.$forceUpdate();
    },
    // dingding(){

    // },
    // 新增Brief任务
     addTask(){
        this.$router.push({name:'addTask'});
      },
    // 执行情况跟进
    followUpBtn(replaceform){
       this.$refs[replaceform].validate((valid) => {
          if (valid) {
            	this.$post("manageNew/modFollowUp", this.replaceform)
                .then(data => {
                  if (data.code) {
                    this.$message({
                      message: '提交成功!',
                      type: "success"
                    });
                    this.executorChange4 = false;
                    this.replaceform = {};
                    // this.$router.push({ name: "workInfoNew" });
                    this.$router.go(0)
                    this.$store.commit("removeTag", "workInfo");
                    this.$store.commit("closePage", "workInfo");
                    this.workOperateLog();
                  } else {
                    this.$message({
                      message: data.errorMsg,
                      type: "warning"
                    });
                  }
                })
                .catch(() => {
                  this.$message.error("服务器错误，请稍后重试..");
                });
          } else {
            return false;
          }
        });
    },
     // 删除属性列
      removeRow(index) {
        this.r_dataFrom.excutor_detail.splice(index, 1);
        this.$forceUpdate(); 
      },
    addWork(typeId){
      this.r_dataFrom.excutor_detail.push({ 
            service_type:this.r_dataFrom.excutor_detail[0].service_type,
            excutor_leading:'',
            excutor_id:[],
            product_id:[],
            product_brief:'',
            price:'',
            domains: [{
              value:'',
              key: Date.now()
            }]
          });

      this.$forceUpdate(); 
    },
    // 执行拆分
    executeSplit(r_dataFrom){
      var array = this.r_dataFrom.excutor_detail
      var inputWarnPriceS = document.getElementsByClassName('inputWarnPrice');
        for (let i = 0; i < array.length; i++) {
          if(array[i].price == ''){
            this.$refs.abc[i].style.display = 'block';
            this.$refs.handleInputPrice[i].style.borderColor = '#f56c6c';
            // return false;
          }else{
            this.$refs.abc[i].style.display = 'none'
            this.$refs.handleInputPrice[i].style.borderColor = '#c3c7cf'
          }
      }
     
      this.$refs[r_dataFrom].validate((valid) => {
				if (valid) {
          var array = this.r_dataFrom.excutor_detail;
      var inputWarnPriceS = document.getElementsByClassName('inputWarnPrice');
        for (let i = 0; i < array.length; i++) {
          if(array[i].price == ''){
            this.$refs.abc[i].style.display = 'block';
            this.$refs.handleInputPrice[i].style.borderColor = '#f56c6c';
            // return false;
          }else{
            this.$refs.abc[i].style.display = 'none';
            this.$refs.handleInputPrice[i].style.borderColor = '#c3c7cf';
            this.$post("manageNew/splitExecute", this.r_dataFrom)
						.then(data => {
							if (data.code) {
								this.$message({
									message: '拆分成功！',
									type: "success"
								});
                this.r_data = {};
                this.executorChange3 = false;
								this.$store.commit("removeTag", "workInfo");
								this.$store.commit("closePage", "workInfo");
                this.workOperateLog();
                setTimeout(() => {
                  this.$router.go(0)
                }, 150);
							} else {
								this.$message({
									message: data.errorMsg,
									type: "warning"
								});
							}
						})
						.catch(() => {
							this.$message.error("服务器错误，请稍后重试..");
						});
          }
      }
				} else {
					return false;
				}
			});						
    },
    	//选项 产品列表
      addItem(){
        // this.$get('crmManagement/item/addItem')
        //   .then((data) => {
        //     this.product = data.content.product;
        //   })
        //   .catch((data) => {
        //     this.$message.error('服务器错误，请稍后重试');
		    //   });
					// 服务商
      this.$get("manageNew/provider")
        .then(data => {
          this.CustomerBudinessMan = data.content;
        })
        .catch(() => {
          this.$message.error("服务器错误，请稍后重试");
		  });				
		},
    // 更换执行团队
    changeTeam(changeExecutor){
      if (!this.changeExecutor.excutor_leading) {
          this.$message({
            message: '请选择执行负责人',
            type: 'warning'
          })
        } else if (!this.changeExecutor.excutor_id) {
          this.$message({
            message: '请选择执行人',
            type: 'warning'
          })
        } else if (!this.changeExecutor.reason) {
          this.$message({
            message: '请填写转单原因',
            type: 'warning'
          })
        } else if (!this.changeExecutor.remark) {
          this.$message({
            message: '请填写转单说明',
            type: 'warning'
          })
        } else {
					this.$post("manageNew/updateExecuteDetail", this.changeExecutor)
						.then(data => {
							if (data.code) {
								this.$message({
									message: '更换执行团队成功！',
									type: "success"
								});
								this.replaceform = {};
								// this.$router.push({ name: "workInfoNew" });
								this.$router.go(0)
								this.$store.commit("removeTag", "workInfo");
								this.$store.commit("closePage", "workInfo");
								this.workOperateLog();
							} else {
								this.$message({
									message: data.errorMsg,
									type: "warning"
								});
							}
						})
						.catch(() => {
							this.$message.error("服务器错误，请稍后重试..");
            });
        }
    },
    changeContent(val,val2){
        if (val) {
          this.isContent = 1;
        }else{
          this.isContent = 0;
        }
       this.$get( 'manageNew/exctuorOperaLog', {
            manage_id: this.manage_id,
            is_content:this.isContent,
          })
          .then((data) => {
             this.eyeChangeRecord = data.content.data; 
             this.paginationNum = data.content;
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })

    },
    //产品处理函数
      handleChangeproduct (value) {
        if(value[2]){
          this.formAll.product_id.push(value[2]);
        } else {
          this.formAll.product_id.splice(0,1);
        }
      },
    // 关闭预警
    handleWarning(id){
        this.replaceform.warn_id = id;
        this.handleWarningDialog = true;
    },
    // 新增预警
    addEarlyWarning(){
        this.warningDialog = true;
         this.$get( 'manageNew/excuteList', {
            manage_id: this.manage_id,
          })
          .then((data) => {
             this.excuteListData = data.content; 
              // this.paginationNum = data.content;
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
        
    },
    fileTrue(data) {
        this.success = data;
      },
    //oss
      fileStatus(data) {
        this.r_data.file = data;
        this.file = data;
      },

      //跟进状态切换事件 
    followUP(val){
      this.followUPNum = val;
    },
    // 执行转单记录 上面的四个按钮  1.转单记录 2.更换执行
    executorChange(){
      // this.executorChangeNum = num.id;
      this.$get( 'manageNew/changeRecord', {
        manage_id: this.manage_id,
      })
        .then((data) => {
          this.changeRecord2data = data.content.data;
          this.paginationNum3 = data.content;
          this.executorFourArray = data.content.sel_product;
        })
        .catch(() => {
          this.$message.error('服务器错误，请稍后重试');
        })
        
        this.$get( 'manageNew/getChangeAeReason')
        .then((data) => {
          var dataS = data.content;
            // this.executorFourArrayreason.push(dataS);
        })
        .catch(() => {
          this.$message.error('服务器错误1，请稍后重试');
        })
      this.executorFour = true;
    },
    executorChange2f(val){
      this.executorChange2 = true;
      this.changeExecutor.detail_id = val.id;
      
        this.$get("manageNew/provider")
          .then(data => {
            this.CustomerBudinessMan = data.content;
          })
          .catch(() => {
            this.$message.error("服务器错误，请稍后重试");
        });	
      
       this.$get( 'manageNew/oneExecuteDetail', {
          id: val.id
        })
        .then((data) => {
            var strArr = data.content
            this.changeExecutor.excutor_leading = data.content.excutor_leading;
            this.changeExecutor.name = data.content.name;
            this.changeExecutor.number = data.content.number;
            this.changeExecutor.price = data.content.price;
            this.changeExecutor.product_brief = data.content.product_brief;
            this.changeExecutor.service_type = data.content.service_type;
            var dataArr = data.content.excutor_id;
              if(data.content.sel_provider.length > 0){
                  this.changeExecutor.provider = parseInt(data.content.sel_provider[0].value);
              }
            //  this.changeExecutor.excutor_id = [];
          //  if(this.changeExecutor.excutor_id.length == 0){
             for (let i = 0; i < data.content.sel_excutor.length; i++) {
              this.changeExecutor.excutor_id.push(data.content.sel_excutor[i].value)
            }
          //  }
            
            // this.changeExecutor.excutor_id = ['096710455124280617']
            // 096710455124280617

              // this.changeExecutor.excutor_id = data.content.sel_excutor;
        })
        .catch(() => {
          this.$message.error('服务器错误1，请稍后重试');
        })
//更换AE原因
        this.$get( 'manageNew/getChangeAeReason')
        .then((data) => {
            this.changeReson = data.content;
        })
        .catch(() => {
          this.$message.error('服务器错误，请稍后重试');
        })
    },

    executorChange3f(scopeRow){
      this.addItem();
      this.zhixingNum = scopeRow.num;
      this.r_dataFrom.detail_id = scopeRow.id;
        this.$get( 'manageNew/oneExecuteDetail', {
          id: scopeRow.id
        })
        .then((data) => {
            var strArr = data.content;
            // if(){}
            this.r_dataFrom.sel_excutor_leading.push(strArr.sel_excutor_leading);
            this.r_dataFrom.personSplic = strArr.sel_provider;
              this.r_dataFrom.sel_excutor = strArr.sel_excutor;
            
            this.r_dataFrom.excutor_detail[0].service_type = strArr.service_type.toString();
            this.r_dataFrom.excutor_detail[0].price = strArr.price;

            this.r_dataFrom.excutor_detail[0].excutor_leading = strArr.excutor_leading;

            this.r_dataFrom.excutor_detail[0].product_brief = strArr.product_brief;
            this.r_dataFrom.excutor_detail[0].product_id = strArr.product_ids;

            if(strArr.service_type == 2){
              this.r_dataFrom.excutor_detail[0].provider = strArr.sel_provider[0].value;
              // parseInt(strArr.excutor_id[0]);
            }else{
              for (let i = 0; i < strArr.sel_excutor.length; i++) {
                 this.r_dataFrom.excutor_detail[0].excutor_id.push(strArr.sel_excutor[i].value);
              }
            }
        })
        .catch(() => {
          this.$message.error('服务器错误，请稍后重试');
        })

      if(this.r_dataFrom.excutor_detail[0].service_type == 1){
          var strArr =  scopeRow.excutor.split(',');
          this.r_dataFrom.excutor_detail[0].domains = [];
          if(strArr.length != 0){
            for (const i in strArr) {
                this.r_dataFrom.excutor_detail[0].domains.push({value: strArr[i],key: Date.now()});
           } 
          }else{
            this.r_dataFrom.excutor_detail[0].domains.push({value: '',key: Date.now()});
          }
      }
      this.executorChange3 = true;
    },

    // 点击跟进事件
    executorChange4f(scopeRow){
      this.executorChange4 = true;
      this.genjinNum = scopeRow.number;
      this.replaceform.detail_id = scopeRow.id;
      this.replaceform.begin_time = scopeRow.begin_time;
      this.replaceform.confirm_time = scopeRow.confirm_time;
      this.replaceform.mod_count = scopeRow.mod_count;

      if(scopeRow.log_status==0){
        this.replaceform.status = 1;
        this.followUPNum = 1;
      }else{
        this.replaceform.status = scopeRow.log_status;
        this.followUPNum = scopeRow.log_status;
      }

      this.$get( 'manageNew/getFollowUpStatus')
          .then((data) => {
             this.executorChange4Data = data.content;
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
    },
    //  执行明细的跟进记录
    executiveLeyeOpen(currentPage){
      // this.eyeId = id;
        this.$get( 'manageNew/exctuorOperaLog', {
            manage_id: this.manage_id,
            // detail_id:id,
            page:currentPage
          })
          .then((data) => {
              this.eyeChangeRecord = data.content.data; 
              this.paginationNum = data.content;
              this.followArray = data.content.product_name;
              this.followNickname = data.content.nickname;
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
          this.executiveLoggingEye = true;
    },
     // 客服转单记录
    serviec_change_record_btn(currentPage){
      this.$get( 'manageNew/serviceChangeRecord', {
        manage_id: this.manage_id,
        page:currentPage
      })
          .then((data) => {
              this.changeRecord = data.content.data;
              this.paginationNum2 = data.content;
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      this.executiveLogging2 = true;      
    },
    // 更换客服  
    change_ae_btn(val){
      this.workInReplace = true;
      //更换AE原因
        this.$get( 'manageNew/getChangeAeReason')
        .then((data) => {
            this.changeReson = data.content;
        })
        .catch(() => {
          this.$message.error('服务器错误，请稍后重试');
        })
    },
    dialogall(bool){
      this.dialogAll1 = bool;
    },
    beforedialogall(bool){
      this.beforeDialogAll1 = bool;
    },
     changeHandler(value) {
            this.CustomerRadios = !this.CustomerRadios;
        },
    selfWay(){
      this.ison==true?this.ison=false:this.ison=true;
    },
    // 订单分配选择产品数组
      dismantlingSelect () {
        this.$get( 'manageNew/DismantlingSelect', {
        manage_id: this.$route.query.manage_id,
      })
          .then((data) => {
            if(data.code){
              this.workOrnderLength = data.content;
              this.r_data.pro_id = objs.product.map(Number);
            }else{
              this.$message.error(data.errorMsg);
            }
            // this.formAll.domains[0].value = this.ruleForm.pro_id;
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
    // 工单共用事件
    workAll(itemId, itemVale) {
      if(this.work_type == 1){
        if(itemVale == '指派执行人'){
          this.changePeopleLeader22 = true;
          this.r_dataLeder.btn_no = itemId;
        }else{
          this.beforeDialogAllTitle = itemVale;
          this.beforeDialogAll1 = true;
          this.r_data.btn_no = itemId;
          this.dialogId = itemId;
        }
      }else if(this.work_type == 2){
          if (itemVale == "确认"){
          this.dialogAllTitle = "首付款确认";
        } else {
          this.dialogAllTitle = itemVale;
          this.r_data.first_pay = '';
        }
          this.dialogAll1 = true;
          this.r_data.btn_no = itemId;
          this.dialogId = itemId;
      }
    },
    handleCompany(val) {
      this.company.company_id = val;
      this.$store.dispatch("dept", this.company);
    },
    changeBtn(){
      this.isFirst = false;
    },
    // 更换和取消执行人
    handleClick(scopeData) {
       this.$get( 'manageNew/getChangeAeReason')
          .then((data) => {
            if(data.code){
              this.reasons = data.content;
            }else{
              this.$message.error(data.errorMsg);
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      if (scopeData.operation == "取消") {
        this.r_data.excute_detail_id = scopeData.id;
        this.r_data.type = scopeData.type;
        this.workInCancelForm = true;
      } else if (scopeData.operation == "更换") {
        this.replaceform.excutor_id = scopeData.id;
        this.replaceform.type = scopeData.type;
        this.workInReplacePeople = true;
      }
    },
    // 取消执行人
    workInCancelFormT() {
      if (!this.r_data.result) {
       this.$message({
				message: '请选择取消原因！',
				type: 'warning'
			})
      }else{
        this.$post("managePresale/cancelExcutor", this.r_data)
        .then(data => {
          if (data.code) {
             this.$message({
              message: '取消成功！',
              type: 'warning'
            })
            this.r_data = {};
            this.workInCancelForm = false;
            // this.workData();
            this.$store.commit("removeTag", "workInfo");
			      this.$store.commit("closePage", "workInfo");
            this.workOperateLog();
            this.$router.go(0)
          } else {
            this.$message.error(data.errorMsg);
          }
        })
        .catch(() => {
          this.$message.error("服务器错误，请稍后重试");
        });
      }
      
    },
    // 提交
    workInReplaceTwarning(messageData) {
      if(messageData == '新增预警'){
         // 新增预警
      this.$post("manageNew/addWarning", this.replaceform)
        .then(data => {
            this.$message({
              message: "新增预警成功！",
              type: "success"
            });

          if (data.code) {
            this.warningDialog = false;
            // this.replaceform = {};detail_id
            this.replaceform.detail_id ='';
            this.replaceform.warn_brief ='';
            this.replaceform.warn_dd_ids = [];
            this.replaceform.warn_type =[];

            this.$store.commit("removeTag", "workInfo");
			      this.$store.commit("closePage", "workInfo");
            this.workOperateLog();

            this.workData()

            //  this.$get("manageNew/warnList", this.$route.query)
            //   .then(data => {
            //     if (data.code) {
            //       // 预警中的小表格数据
            //       this.warnListData = data.content.list;
            //       this.warnListDataBtn = data.content.add_warn_btn;
            //     } else {
            //       this.$message({
            //         message: data.errorMsg,
            //         type: "warning"
            //       });
            //     }
            //   })
            //   .catch(() => {
            //     this.$message.error("服务器错误，请稍后重试");
            //   }); 
            // this.$router.go(0)
            // this.$router.push({path: '/workInfo',query:{manage_id:this.manage_id,work_type:'2'}})
          } else {
            this.$message.error(data.errorMsg);
          }

        })
        .catch(() => {
          this.$message.error("服务器错误，请稍后重试");
        });
      }else if(messageData == '关闭预警'){
      this.$post("manageNew/closeWarning", this.replaceform)
        .then(data => {
          if (data.code) {
            this.$message({
              message: '关闭预警成功！',
              type: "success"
            });
            this.handleWarningDialog = false;

             this.replaceform.detail_id ='';
            this.replaceform.warn_brief ='';
            this.replaceform.warn_dd_ids = [];
            this.replaceform.warn_type =[];
            this.replaceform.close_reason ='';


            // this.workData();
            this.$store.commit("removeTag", "workInfo");
			      this.$store.commit("closePage", "workInfo");
            this.workOperateLog();
            this.workData()

          } else {
            this.$message.error(data.errorMsg);
          }
        })
        .catch(() => {
          this.$message.error("服务器错误，请稍后重试");
        });
      }
        this.activeNameTab = 'fourth';
    },
    // 更换客服 workInReplaceTAe
    workInReplaceTAe() {
      	if(!this.replaceform.service_leading){
					this.$message({
                    message: '请选择客服负责人',
                    type: 'warning'
                });
				}else if(!this.replaceform.new_dd_id){
					this.$message({
                    message: '请选择客服',
                    type: 'warning'
                });
				}else if(!this.replaceform.result){
                this.$message({
                    message: '请选择更换原因',
                    type: 'warning'
                });
        } else{
      this.$post("manageNew/changeAe", this.replaceform)
        .then(data => {
          if (data.code) {
            this.$message({
              message: '更换客服成功！',
              type: "success"
            });
            this.workInReplace = false;
            this.replaceform = {};
            this.$store.commit("removeTag", "workInfo");
			      this.$store.commit("closePage", "workInfo");
            this.workOperateLog();
            this.$router.go(0)
          } else {
            this.$message.error(data.errorMsg);
            // this.$message({
            //   message:data.errorMsg,
            //   type: "warning"
            // });
          }
        })
        .catch(() => {
          this.$message.error("服务器错误，请稍后重试");
        });
      }
    },

     // 更换销管 workInReplaceTAe
    workInReplaceTAePeople() {
      	if(!this.replaceform.new_dd_id){
					this.$message({
            message: '请选择执行人',
            type: 'warning'
          });
				}else if(!this.replaceform.result){
          this.$message({
            message: '请选择更换原因',
            type: 'warning'
          });
        }else{
      this.$post("managePresale/changeSaleManage", this.replaceform)
        .then(data => {
          if (data.code) {
            this.$message({
              message: '更换成功！',
              type: "success"
            });
            this.workInReplace = false;
            this.$store.commit("removeTag", "workInfo");
			      this.$store.commit("closePage", "workInfo");
            this.replaceform = {};
            this.workOperateLog();
            this.$router.go(0)
          } else {
            this.$message.error(data.errorMsg);
          }
        })
        .catch(() => {
          this.$message.error("服务器错误，请稍后重试");
        });
      }
    },
   
    //下载
    fileUpload(index, rows) {
      window.open(rows[index].path);
    },
    
    // 新增附件
    newFlie() {
      this.newFileAdd = true;
      // this.$delete("manageNew/addAttachment",this.r_data)
      //   .then(data => {
      //     if (data.code) {
      //       this.$message({
      //         message: data.errorMsg,
      //         type: "success"
      //       });
      //       this.fileListAll();
      //       this.workOperateLog();
      //     } else {
      //       this.$message({
      //         message: data.errorMsg,
      //         type: "warning"
      //       });
      //     }
      //   })
      //   .catch(() => {
      //     this.$message.error("服务器错误，请稍后重试");
      //   });
    },
    // 删除项目附件
    annex(data) {
      this.$delete("manage/deleteAttachment/" + data)
        .then(data => {
          if (data.code) {
            this.$message({
              message: data.errorMsg,
              type: "success"
            });
            this.fileListAll();
            this.workOperateLog();
          } else {
            this.$message({
              message: data.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(() => {
          this.$message.error("服务器错误，请稍后重试");
        });
    },
    // 确定执行人添加
    addTrue() {
      this.$post("manage/newExecutorAdd", this.r_form)
        .then(data => {
          if (data.code) {
            this.$message({
              message: data.errorMsg,
              type: "success"
            });
            this.addExecutorDialog = false;
            this.r_form.self_support = [];
            this.r_data.service_provider = "";
            this.r_data.remark = "";
            // this.workData();
            // this.$router.push({ name: "workOrderNew" });
            this.$store.commit("removeTag", "workInfo");
            this.$store.commit("closePage", "workInfo");
            this.workOperateLog();
            this.$router.go(0)
          } else {
            this.$message.error(data.errorMsg);
          }
        })
        .catch(() => {
          this.$message.error("服务器错误，请稍后重试");
        });
    },
    addExecutor() {
      this.addExecutorDialog = true;
      	// 服务商
      this.$get("manageNew/provider")
        .then(data => {
          this.CustomerBudinessMan = data.content;
        })
        .catch(() => {
          this.$message.error("服务器错误，请稍后重试");
		  });	
    },
    // 工单驳回事件
    workReject() {
      this.workInfoReject = true;
    },
    // 显示派单的loading框
    show() {
      this.centerDialogVisible = true;
    },
    // 售前和成单第三步 确定事件
    determine() {
      this.determineWindow = true;
    },
    determine2() {
      this.$post("manageNew/operateBtn", this.r_data)
        .then(data => {
          if (data.code) {
            this.$message({
              message: data.errorMsg,
              type: "success"
            });
            this.$router.go(0)
            // this.$router.push({ name: "workOrderNew" });
            this.$store.commit("removeTag", "workInfo");
            this.$store.commit("closePage", "workInfo");
            this.workOperateLog();
          } else {
            this.$message({
              message: data.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(() => {
          this.$message.error("服务器错误，请稍后重试");
        });
    },

    // 提交时点击取消
    determineOff() {
      this.determineWindow = false;
    },

    // 确定派单事件
    centerDialogVisible_btn() {
      //组件的复用 后台返回的name值会造成干扰；所以后台改了name值 前台需要匹配字段
      if (this.r_data.pre_sale_id7) {
        this.r_data.pre_sale_id = this.r_data.pre_sale_id7;
      }
      if (this.r_data.pre_sale_id2) {
        this.r_data.pre_sale_id = this.r_data.pre_sale_id2;
      }
      if (this.r_data.dd_id3) {
        this.r_data.dd_id = this.r_data.dd_id3;
      }
      if (this.r_data.dd_id8) {
        this.r_data.dd_id = this.r_data.dd_id8;
      }
      this.$post("manageNew/operateBtn", this.r_data)
        .then(data => {
          if (data.code) {
            this.$message({
              message: data.errorMsg,
              type: "success"
            });
            this.centerDialogEnd = false;
            this.r_data = {};
            this.input_content = [];
            this.r_data.pre_sale_id = [];
            this.workOperateLog();
            // this.workData();
            this.$router.push({
              name: "workOrder"
            });
          } else {
            this.$message({
              message: data.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(() => {
          this.$message.error("服务器错误，请稍后重试");
        });
    },
    deleteRow(index, rows) {
      this.$delete("manage/deleteAttachment/" + rows[index].id)
        .then(data => {
          if (data.code) {
            this.$message({
              message: data.errorMsg,
              type: "success"
            });
            this.fileListAll();
            this.workOperateLog();
          }
        })
        .catch(() => {});
    },
    // 获取数组下标
    findWithAttr(array, attr, value) {
      for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
          return i;
        }
      }
      return -1;
    },
    // 售前工单详情所需页面
    workDataBefore() {
      this.$get("managePresale/projectDetail", this.$route.query)
        .then(data => {
          if (data.code) {
            var processArr = data.content.process;
            var numberId = data.content.message.status;
            var objId = processArr.find(function(obj) {
              return obj.step_id === numberId;
            });

            this.idObj = objId;

            this.r_data.description = data.content.message.description;
            this.message = data.content.message;
            this.menu = data.content.input;
            this.executor = data.content.executor;

            for (let index = 0; index < this.menu.length; index++) {
              if(this.menu[index].id == 5 ){
                this.menuId5 = true;
              }
            }

            // this.warn_count =  data.content.warn_count? '('+data.content.warn_count+')':'';
            // this.input_content = data.content.input.input_content;

            this.process = data.content.process;
            this.number = data.content.message.status;
            this.executorData.push(data.content.service);
            
            this.add_brife = data.content.add_brife;
            this.add_excutor = data.content.add_excutor;
            this.client_id = data.content.message.client_id;
            this.task_type = data.content.message.task_type;
            this.link_id = data.content.message.link_id;

          this.number = this.findIndex(processArr, objId) + 1;
          
          } else {
            this.$message({
              message: data.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(() => {
          this.$message.error("服务器错误2，请稍后重试");
        }); 

    this.$get("manageNew/warnList", this.$route.query)
        .then(data => {
          if (data.code) {
            // 预警中的小表格数据
            this.warnListData = data.content.list;
            this.warnListDataBtn = data.content.add_warn_btn;
          } else {
            this.$message({
              message: data.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(() => {
          this.$message.error("服务器错误，请稍后重试");
        }); 
      // brief详情s
        // this.$get('task/list')
        // .then(data => {
        //   if (data.code) {
        //     this.briefList = data.content.detail;
        //   } else {
        //     this.$message({
        //       message: data.errorMsg,
        //       type: "warning"
        //     });
        //   }
        // })
        // .catch(() => {
        //   this.$message.error("服务器错误，请稍后重试");
        // }); 
        this.$get("task/breifDetail", { manage_id: this.manage_id })
        .then(data => {
          this.breifDetail = data.content.detail;
          this.first_count = data.content.first_count;
          this.second_count = data.content.second_count;
        })
        .catch(() => {
          this.$message({
            message: data.errorMsg,
            type: "warning"
          });
        });
    },
    // 工单详情所需页面
    workData() {
      this.$get("manageNew/orderDetail", this.$route.query)
        .then(data => {
          if (data.code) {
            var processArr = data.content.process;
            var numberId = data.content.message.status;
            var objId = processArr.find(function(obj) {
              return obj.step_id === numberId;
            });
            
            this.idObj = objId;

            this.r_data.description = data.content.message.description;
            this.message = data.content.message;
            this.menu = data.content.input;

            for (let index = 0; index < this.menu.length; index++) {
              if(this.menu[index].id == 5 ){
                this.menuId5 = true;
              }
            }

            this.warn_count =  data.content.warn_count? '('+data.content.warn_count+')':'';
            this.input_content = data.content.input.input_content;
            this.process = data.content.process;
            this.number = data.content.message.status;

            this.executorDataleading = data.content.service.service_leading;
            this.executorDataleadingAe = data.content.service.ae;
            this.executorData.push(data.content.service);
            this.replaceform.service_leading = data.content.service.service_leading;
            this.executorData_btn = data.content.service.btn;
            this.editNum = data.content.service.edit;
            this.Execution_detail_list = data.content.executor;
            
            this.add_brife = data.content.add_brife;

            this.add_excutor = data.content.add_excutor;

            this.client_id = data.content.message.client_id;

            this.task_type = data.content.message.task_type;
            this.link_id = data.content.message.link_id;
            this.r_data.contract = data.content.message.contract;
            this.remarks = data.content.message.remarks;
           
            this.number = this.findIndex(processArr, objId) + 1;

          } else {
            this.$message({
              message: data.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(() => {
          this.$message.error("服务器错误1，请稍后重试");
        }); 

    this.$get("manageNew/warnList", this.$route.query)
        .then(data => {
          if (data.code) {
            this.warnListData = data.content.list;
            this.warnListDataBtn = data.content.add_warn_btn;
            // this.warn_status = data.content.list.warn_status;
          } else {
            this.$message({
              message: data.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(() => {
          this.$message.error("服务器错误，请稍后重试");
        }); 
      // brief详情s
        // this.$get('task/list')
        // .then(data => {
        //   if (data.code) {
        //     this.briefList = data.content.detail;
        //   } else {
        //     this.$message({
        //       message: data.errorMsg,
        //       type: "warning"
        //     });
        //   }
        // })
        // .catch(() => {
        //   this.$message.error("服务器错误，请稍后重试");
        // }); 
        this.$get("task/breifDetail", { manage_id: this.manage_id })
        .then(data => {
          this.breifDetail = data.content.detail;
          this.first_count = data.content.first_count;
          this.second_count = data.content.second_count;
        })
        .catch(() => {
          this.$message({
            message: data.errorMsg,
            type: "warning"
          });
        });
    },
    findIndex(l, o) {
        var objStr = JSON.stringify(o);
        return l.reduce((index, ele, i) => {
          if (JSON.stringify(ele) === objStr) {
            return i;
          } else {
            return index;
          }
        }, -1);
      },
    /*// 人员列表接口
      personnel() {
        this.$get( 'manage/personnel')
          .then( (data) => {
            this.personAll = data.content;
          })
          .catch(() => {
          })
      },*/

    // 跳转项目或订单
    itemOrderDetail() {
      if (this.task_type === 1) {
        this.$router.push({ name: "itemDetail", params: { id: this.link_id } });
      } else if (this.task_type === 2) {
        this.$router.push({
          name: "orderDetail",
          params: { id: this.link_id }
        });
      } else {
        this.$router.push({ name: "error-404" });
      }
    },
    // 跳转任务详情
    taskDetail(index, rows) {
      this.$router.push({ name: "taskDetail", params: { id: rows[index].id } });
    },
    // 跳转客户详情
    clientDeatil() {
      this.$router.push({
        name: "clientDetail",
        params: { id: this.client_id }
      });
    },
    // 新增执行人数据
    executorBasicData() {
      this.$get("manage/executorBasicData")
        .then(data => {
          this.BasicData = data.content.title;
          this.self_support = data.content.self_support;
          this.service_provider = data.content.service_provider;
          this.remark = data.content.remark;
          this.r_form.value = data.content.title.content[0].value;
        })
        .catch(() => {
          this.$message({
            message: data.errorMsg,
            type: "warning"
          });
        });
    },
   
    // 附件页
    fileListAll() {
      this.$get("manageNew/manageAttachment", {
        manage_id: this.$route.query.manage_id
      })
        .then(data => {
          if (data.code) {
            this.annexData = data.content;
          }
        })
        .catch(() => {
          this.$message({
              message: data.errorMsg,
              type: "warning"
            });
        });
    },
    // 确定添加附件
    newFileAddT() {
      if(this.r_data.file.length == 0){
          this.$message({
              message: '请选择附件',
              type: "warning"
            });
      }else{
        this.$post("manageNew/addAttachment", 
        {
          manage_id:this.r_data.manage_id,
          file:this.r_data.file,
          brife:this.r_data.brife,
        }
      )
        .then(data => {
          if (data.code) {
            this.$message({
              message: data.errorMsg,
              type: "success"
            });
            this.success = true;
            this.newFileAdd = false;

            this.r_data.file = [];
            this.r_data.remarks = '';

            this.fileListAll();
            this.workOperateLog();
          } else {
            this.$message({
              message: data.errorMsg,
              type: "warning"
            });
          }
        })
        .catch(() => {
          this.$message({
            message: data.errorMsg,
            type: "warning"
          });
        });
      }
      
    },
    // 
    workOperateLog2(tab,event) {
      if(tab.label == '派单记录'){
         this.$get("manageNew/manageStatusLog", {
        //  this.$get("manageNew/manageOperateLog", {
          manage_id: this.manage_id
      })
        .then(data => {
          this.operateLog2 = data.content;
        })
        .catch(data => {
          this.$message({
            message: data.errorMsg,
            type: "warning"
          });
        });
      }
     
    },
    handleDelete(){
            this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // this.$message({
                //     type: 'success',
                //     message: '删除成功!'
                // });
                this.$get( 'manageNew/manageDel',{manage_id :this.manage_id})
                    .then ( (data) => {
                        if(data.code){
                            this.$message({
                                message: data.content,
                                type: 'success'
                            });
                            // rows.splice(index, 1);
                             this.$router.push({name: 'workOrder'})
                        }
                    })
                    .catch (() => {
                        this.$message.error('服务器错误，请稍后重试');
                    })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
    // 操作日志
    workOperateLog() {
      this.$get("manageNew/manageOperateLog", {
        manage_id: this.$route.query.manage_id
      })
        .then(data => {
          this.operateLog = data.content;
        })
        .catch(data => {
          this.$message({
            message: data.errorMsg,
            type: "warning"
          });
        });
    }
  },
   watch:{
      'changeExecutor.service_type'(){
      this.updatePeople = false
      setTimeout(()=>{
        this.updatePeople = true
      })
    },
    'item.service_type'(){
      this.updatePeople = false
      setTimeout(()=>{
        this.updatePeople = true
      })
    }
   },
  created() {
    // 派单需要的步骤数等三个传过来的参数   changeExecutor
    this.r_data.manage_id = this.$route.query.manage_id;
    this.r_form.manage_id = this.$route.query.manage_id;
    this.r_dataLeder.manage_id = this.$route.query.manage_id;

    this.r_dataPeople.manage_id = this.$route.query.manage_id;
    this.r_dataFrom.manage_id = this.$route.query.manage_id;
    this.changeExecutor.manage_id = this.$route.query.manage_id;
    this.replaceform.manage_id = this.$route.query.manage_id;
    this.cancelform.manage_id = this.$route.query.manage_id;
    this.manage_id = this.$route.query.manage_id;
    this.r_data.step = this.$route.query.step;
    this.work_type = this.$route.query.work_type;

    if(this.work_type == 1){
      this.workDataBefore();
      this.executorBasicData();  
    }else{
      this.workData();
    }

    this.$store.dispatch("dept", {});
    this.workOperateLog();
    this.fileListAll();

      setTimeout(() => {
        this.$get('manageNew/productInfo')
            .then((data) => {
              this.product = data.content.product;
            })
            .catch((data) => {
              this.$message.error('服务器错误，请稍后重试');
            });
      }, 500);
      // if(this.work_type == 2){
      //   setTimeout(() => {
      //       this.$get('crmManagement/item/addItem')
      //           .then((data) => {
      //             this.product = data.content.product;
      //           })
      //           .catch((data) => {
      //             this.$message.error('服务器错误，请稍后重试');
      //           });
      //     }, 500);
      // }
    
  }
  ,
   mounted(){
      var aP = document.getElementsByTagName('label');
    for(var i=0;i<aP.length;i++)
    {
        if(aP[i].innerHTML == '*'){
            aP[i].style.color = 'red';
        }
    }
        //do something
    }
};
</script>

<style lang="less" type="scoped">
.workInfo {
  .s_workinfo_step_0,
  .s_workinfo_step_1,
  .s_workinfo_step_2,
  .s_workinfo_step_3,
  .s_workinfo_step_4,
  .s_workinfo_step_5,
  .s_workinfo_step_6 {
    flex-basis: 180px !important;
  }
  .s_workinfo_step_0 .el-step__line-inner {
    border-image: linear-gradient(to right, #ffd801, #ffb214) 30 30;
  }
  .s_workinfo_step_1 .el-step__line-inner {
    border-image: linear-gradient(to right, #ffb214, #ff9722) 30 30;
  }
  .s_workinfo_step_2 .el-step__line-inner {
    border-image: linear-gradient(to right, #ff9722, #ff6c38) 30 30;
  }
  .s_workinfo_step_3 .el-step__line-inner {
    border-image: linear-gradient(to right, #ff6c38, #ff464a) 30 30;
  }
  .s_workinfo_step_4 .el-step__line-inner {
    border-image: linear-gradient(to right, #ff464a, #ff2f55) 30 30;
  }
  .s_workinfo_step_5 .el-step__line-inner {
    border-image: linear-gradient(to right, #ff2f55, #f81841) 30 30;
  }
  .s_workinfo_step_6 .el-step__head {
    position: static;
  }
  .el-step__head {
    width: 180px;
  }
  .s_workinfo_step_0 .el-step__title.is-finish {
    color: #ffd801 !important;
  }
  .s_workinfo_step_0 .el-step__description.is-finish {
    color: #ffd801 !important;
  }
  .s_workinfo_step_1 .el-step__title.is-finish {
    color: #ffb214 !important;
  }
  .s_workinfo_step_1 .el-step__description.is-finish {
    color: #ffb214 !important;
  }
  .s_workinfo_step_2 .el-step__title.is-finish {
    color: #ff9722 !important;
  }
  .s_workinfo_step_2 .el-step__description.is-finish {
    color: #ff9722 !important;
  }
  .s_workinfo_step_3 .el-step__title.is-finish {
    color: #ff6c38 !important;
  }
  .s_workinfo_step_3 .el-step__description.is-finish {
    color: #ff6c38 !important;
  }
  .s_workinfo_step_4 .el-step__title.is-finish {
    color: #ff464a !important;
  }
  .s_workinfo_step_4 .el-step__description.is-finish {
    color: #ff464a !important;
  }
  .s_workinfo_step_5 .el-step__title.is-finish {
    color: #ff2f55 !important;
  }
  .s_workinfo_step_5 .el-step__description.is-finish {
    color: #ff2f55 !important;
  }
  .s_workIfo_img {
    width: 80px;
    height: 40px;
  }
  .s_workinfo_step_0 .el-step__icon.is-text {
    width: 10px;
    height: 10px;
    border: 0;
    left: 0;
    top: 3px;
    background: #ffd801;
    border-radius: 50%;
  }
  .s_workinfo_step_1 .el-step__icon.is-text {
    width: 10px;
    height: 10px;
    border: 0;
    left: 0;
    top: 3px;
    background: #ffb214;
    border-radius: 50%;
  }
  .s_workinfo_step_2 .el-step__icon.is-text {
    width: 10px;
    height: 10px;
    border: 0;
    left: 0;
    top: 3px;
    background: #ff9722;
    border-radius: 50%;
  }
  .s_workinfo_step_3 .el-step__icon.is-text {
    width: 10px;
    height: 10px;
    border: 0;
    top: 3px;
    background: #ff6c38;
    border-radius: 50%;
  }
  .s_workinfo_step_4 .el-step__icon.is-text {
    width: 10px;
    height: 10px;
    border: 0;
    top: 3px;
    background: #ff464a;
    border-radius: 50%;
  }
  .s_workinfo_step_5 .el-step__icon.is-text {
    width: 10px;
    height: 10px;
    border: 0;
    top: 3px;
    background: #ff2f55;
    border-radius: 50%;
  }
  .s_workinfo_step_6 .el-step__icon.is-text {
    width: 10px;
    height: 10px;
    border: 0;
    top: 3px;
    background: #ff2f55;
    border-radius: 50%;
  }
  .el-collapse-item__header {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .s_workSummary {
    width: 100%;
    border-radius: 5px;
    margin-top: 10px;
    background: #fff;
  }
  .el-collapse {
    margin-left: 30px;
    border: 0;
  }
  .el-collapse,
  .el-collapse-item__header,
  .el-collapse-item__wrap {
    border-bottom: 0;
  }
  .workInfo .el-step__icon.is-text {
    width: 10px;
    height: 10px;
    margin-top: 6px;
    background: #ffd801;
    border: 0px;
  }
  .workInfo .el-step__icon-inner {
    display: none;
  }
  .workInfo_top {
    color: #fff;
    border-radius: 8px;
    background: linear-gradient(to right, #6a85fd, #76ccff);
    width: 100%;
  }
  .workNumber {
    width: 100%;
    font-size: 18px;
    font-weight: 800;
    height: 45px;
  }
  .NumberIcon {
    margin-left: 25px;
    position: relative;
  }
  .number {
    position: relative;
    margin-left: 20px;
  }
  .workDetails {
    -webkit-box-shadow: 0px -5px 6px rgba(51, 51, 51, 0.1);
    -moz-box-shadow: 0px -5px 6px rgba(51, 51, 51, 0.1);
    box-shadow: 0px -5px 6px rgba(51, 51, 51, 0.1);
    color: #000000;
    width: 100%;
    height: 250px;
    margin-top: 20px;
    background-color: #ffffff;
    border-top-left-radius: 45px;
    border-top-right-radius: 45px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  .s_workInfo_description {
    float: left;
    width: 700px;
    margin-left: 80px;
    margin-top: -20px;
  }
  .detailsMessageText {
    color: #999999;
  }
  .workDetailsContent {
    margin-left: 2%;
    width: 96%;
    height: 80%;
    // border-bottom: 1px solid #f0f0f0;
  }
  .workDetailsLeft {
    position: relative;
    float: left;
    width: 67%;
    height: 80%;
  }
  .detailsMessageFirst {
    padding-top: 3%;
    margin-left: 30px;
    font-size: 16px;
  }
  .detailsMessage {
    margin-top: 1.2%;
    margin-left: 30px;
    font-size: 16px;
  }
  .workDetailsRight {
    position: relative;
    float: right;
    width: 33%;
    height: 80%;
    display: flex;
    justify-content:center;
  }
  .workDetailsButtonFather {
    float: left !important;
  }
  .workDetailsButton {
    width: 130px;
    height: 44px;
    font-size: 16px;
    margin-top: 15%;
    border-radius: 10px;
    text-align: center;
    padding: 0px;
  }
 
  @media screen and (max-width: 1430px) {
    .workDetailsButton {
      width: 90px;
      height: 35.2px;
      font-size: 14px;
    }
  }

   @media screen and (max-width: 1200px) {
    .workDetailsButton {
      width: 70px;
      height: 35.2px;
      font-size: 12px;
    }
  }
  .workDetailsBottom {
    margin-left: 2%;
    width: 96%;
    height: 50px;
    overflow: hidden;
  }
  .workDetailsBottomMessage {
    width: 15%;
    position: relative;
    float: right;
    height: 100%;
    line-height: 50px;
    font-size: 16px;
  }
  .detailsMessageBottomText {
    color: #707970;
  }
  .workInfo_content {
    margin-top: 16px;
    border-radius: 10px;
  }
  .el-tabs__nav-wrap {
    background-color: #ffffff;
  }
  .el-tabs__active-bar {
    height: 0px;
  }
  .el-tabs__item {
    font-size: 16px;
    font-weight: 600;
    color: #999999;
    text-align: center;
    margin-left: 20px;
    padding: 0px;
  }
  .el-tabs__item.is-active {
    color: #4380ff;
  }
  .el-tabs__header {
    margin: 0px;
  }
  .workInfo_content_title {
    color: #333333;
    font-size: 16px;
    position: absolute;
    top: 2px;
    left: 26px;
  }
  .progress_bar {
    background-color: #ffffff;
    width: 100%;
    height: auto;
  }
  .first_style_title {
    padding-top: 10px;
    font-weight: 600;
    width: 96%;
    height: 48px;
    line-height: 50px;
    position: relative;
    overflow: hidden;
    margin-right: 0;
  }
  .first_style_titleH1{
    padding-top: 10px;
    font-weight: 600;
    width: 96%;
    margin-left: 26px;
    height: 48px;
    line-height: 50px;
    position: relative;
    overflow: hidden;
    margin-right: 0;
  }

.el-dialog__title{
  font-size: 16px;
}
  .el-dialog__header{
    border: 1px solid #f0f0f0;
  }

  .first_style_content {
    width: 96%;
    margin-left: 2%;
    margin-top: 2px;
    padding-bottom: 20px;
  }
  .rocket {
    margin-top: 30px;
    padding: 0;
    width: 100%;
    height: 44px;
    position: relative;
  }
  .first_style_content .el-step__icon-inner {
    display: none;
  }
  .rocket_style0 {
    width: 83px;
    height: 39px;
    position: absolute;
    top: 5px;
    left: 0px;
  }
  .rocket_style1 {
    width: 83px;
    height: 39px;
    position: absolute;
    top: 5px;
    left: 165px;
  }
  .rocket_style2 {
    width: 83px;
    height: 39px;
    position: absolute;
    top: 5px;
    left: 340px;
  }
  .rocket_style3 {
    width: 83px;
    height: 39px;
    position: absolute;
    top: 5px;
    left: 520px;
  }
  .rocket_style4 {
    width: 83px;
    height: 39px;
    position: absolute;
    top: 5px;
    left: 700px;
  }
  .rocket_style5 {
    width: 83px;
    height: 39px;
    position: absolute;
    top: 5px;
    left: 880px;
  }
  .rocket_style6 {
    width: 83px;
    height: 39px;
    position: absolute;
    top: 5px;
    left: 1050px;
  }
  .implement {
    margin-top: 20px;
    // border-radius: 10px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-color: #ffffff;
    width: 100%;
    height: auto;
  }
  .tast {
    margin-top: 20px;
    border-radius: 10px;
    background-color: #ffffff;
    width: 100%;
    height: auto;
  }
  .el-collapse-item__header {
    color: #333;
    font-size: 16px;
  }
  .s_workInfoBtn {
    position: relative;
    top: -5px;
    left: 78px;
  }
}

// 拆单新样式
.dialogSolid {
  border-top: 1px solid #f0f0f0 !important;
}
.dialogSolid2{
  padding: 20px 0;
 
}



.workButtonYN {
  float: right;
}
.workButtonYN2 {
  overflow: hidden;
}
.spaceSky {
  height: 50px;
}
// 分单
.CustomerLeaderOne{
  padding-bottom: 10px;
}
.CustomerLeaderOne2{
  padding: 10px 0;
}

.CustomerLeaderAllbox{
  padding-top: 15px;
}

.spaceBox{
  padding-bottom: 30px;
  
}
.CustomerTitle{
  padding-left: 50px;
}

.itemformInfo{
  width: 60%!important;
}
.upLoad2{
  padding-left: 34px!important;
}
.moreName{
  color: #8d8d8d;
}
.Executive_self_support{
  padding: 0 78px 20px;
}
.right_title_btn{
  position: absolute;
  top: 0;
  right: 0;
}

.Execution_detail{
  background: #fff;
  margin: 10px 0;
  width: 100%;
}
.Execution_detail_table{
  width: 100%;
}
.Execution_detail_table{
  border-collapse: collapse;
}
.Execution_detail_table tr td{
  line-height: 20px;
}
.Execution_detail_table_tr{
  background: #fafafa;
  border: 1px solid #ebebeb;
  border-radius: 5px;
  font-size:14px;
  color:#909399;
}

.Execution_detail_table_tr2 td{
  font-size:14px;
  color:#606266;
}

.Execution_detail_table_tr th,.Execution_detail_table_tr2 td{
  width: 15%;
  text-align: left;
  padding-left: 10px;
  height: 50px;
  line-height: 50px;
}
.executiveLogT{
  overflow: hidden;
}
.checkedHave{
  float:right;
  padding: 10px 0;
}
.block{
  overflow: hidden;
}
.paginationNum{
  float: right;
}
.historyBrief .el-form-item__label{
  line-height: 16px;
}
.executiveLogging3Top{
  margin-top: 20px;
}
.executiveLogging3 .el-dialog__body{
  padding-top: 0; 
}
.multipleTableColor .el-table__header tr th,.multipleTableColor3 .el-table__header tr th{
  background-color: #fafafa !important;
    font-size: 14px;
}
.multipleTableColor3 .el-table__row td{
    font-size: 12px;
}

.multipleTableColor .el-table__header-wrapper{
  border: 1px solid #ebebeb;
}
.multipleTableColor .el-card.is-always-shadow{
  box-shadow: none!important;
  border: none;
}
.multipleTableColor{
  margin: 100px 0 0 200px!important;
}
.multipleTableColor .el-dialog__body,.multipleTableColor .el-dialog__body .el-card__body{
  padding: 10px!important;
}
.multipleTableColor2 .el-dialog__body,.multipleTableColor2 .el-dialog__body .el-card__body{
  padding-top: 0 !important;
}
.chaifen .el-dialog__body{
  padding: 10px 20px!important;
}

.earlyWarning{
  color: #000000;
  font-size: 16px;
  display: inline-block;
  padding: 0 20px;
}
.inputWarn{
  width: 260px !important;
}
.inputWarn2{
  width: 320px !important;
}
.demo-table-expand{
  margin: 0 auto;
}
.addMission{
  position: absolute;
    top: 12px;
    left: 122px;
}
.bgBtn{
  padding: 10px 30px !important;
}
.workDetailsButtonOver{
  background-color: #f11d4e;
  border-color: #f11d4e;
}
.workDetailsButtonOver:hover{
  background-color: #f11d4e;
  border-color: #f11d4e;
}
.workDetailsButton span{
  padding: 0 10px;
}
.noData{
  text-align: center;
  font-size: 15px;
  color: #909399;
}

.workOperateLog22 .el-tabs__nav-wrap{
  // border-bottom: 2px solid #eef2f9;
}



.ExecutionDetailP{
  width:100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 14px;
  color: #909399;
}
.tablePeople{
  width:100%;
  border-collapse: collapse;
}

.tablePeople2{
  width:100%;
  border-collapse: collapse;
}

.tablePeople2 .ExecutionDetailP2{
  border:1px solid #ebeef5;
  // border-left:none;
  border-right:none;
}

.tablePeople2 tr th,.tablePeople2 tr td{
  width:14%;
  border-right:1px solid #ebeef5;
  border-collapse: collapse;
  color:#909399;
  height: 48px;
  font-size: 14px;
  text-align:center;
}

.tablePeople2 .ExecutionDetailP3 th,.tablePeople2 .ExecutionDetailP3 td{
   width:141px !important;
}

.tablePeople2 tr th,.tablePeople2 tr td:last-child{
  // border-right:none;
}

.tablePeople .ExecutionDetailP1{
  border:1px solid #ebeef5;
  border-left:none;
  border-right:none;
}
.tablePeople tr th{
  width:20%;
  border-right:1px solid #ebeef5;
  border-collapse: collapse;
  color:#909399;
  height: 48px;
  font-size: 14px;
}
.tablePeople tr th:last-child{
  border-right:none;
}
.selectMade{
  width: 100px;
}
.tableBlue{
  color : #409EFF;
  border: 1px solid #409EFF;
  border-radius: 4px;
  padding: 2px;
}
.tableInfo{
  color : #909399;
  border: 1px solid #909399;
  border-radius: 4px;
  padding: 2px;
}
.tablered{
  color : #F56C6C;
  border: 1px solid #F56C6C;
  border-radius: 4px;
  padding: 2px;
}
.tablegreen{
  color : #67C23A;
  border: 1px solid #67C23A;
  border-radius: 4px;
  padding: 2px;
}
.tableYellow{
  color : #E6A23C;
  border: 1px solid #E6A23C;
  border-radius: 4px;
  padding: 2px;
}
.inputWarn23 textarea{
  background-color: #eef2f9!important;
}
.spanRed{
  color: #f56c6c;
}
.s_client_widthInput{
      border-radius: 5px;
      background: #eef2f9;
      padding-left: 16px;
      border: 1px solid #dcdfe6; 
    }
    .s_client_width {
      width: 300px;
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
    .Execution_content th{
      text-align: center;
    }
    .Execution_content2{
      border-radius: 10px;
    }
    .Execution_content2 .el-table_2_column_7 .cell,
    .Execution_content2 .el-table_2_column_17 .cell
    {
      padding:0!important;
      padding-left:0!important;
    }
    .first_style_title_first .workInfo_content_title {
      left: 54px;
    }
    .first_style_title_work1{
      padding-left:26px!important;
    }
    .workInfo .workInfo_content_title_work1{
      left:52px!important;
    }
    .allBtn{
      color:#409eff;
      font-size:12px;
    }
    .workInfo .first_style_title_width{
       width:100%!important;
    }
     .right_title_btn2{
      right:20px!important;
     }
     .workOperateLog23 .el-tabs__nav-wrap{
       margin-bottom:0!important;
     }
     .workOperateLog23 .el-tabs__nav-wrap .el-tabs__nav div{
       margin-left:0;
       padding:0 20px;
     }
    //  .workOperateLog23
.warnTable th{
  background:#fafafa;
  width:300px;
  text-align:center;
}
.warnTableTd td{
  text-align:center;
}
</style>
