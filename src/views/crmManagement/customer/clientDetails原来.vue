// 客户详情页面所有数据
<template>
  <div class="clientDetails">
    <el-card>
      <div style="width: 100%;height: 80px;">
        <div class="s_details_company">
          <div class="s_details_title">{{ date.company }} （{{ date.code }}）</div>
          <div class="s_details_fuze">
            创建人:
            <el-popover trigger="hover" placement="top">
              <p> {{date.department}} - {{ date.nickname }}</p>
              <div slot="reference" class="name-wrapper">
                <el-button  size="small" style="border: none !important; background:none !important;">{{ date.nickname }}
                  <!--<span v-if="manage_percent.is_show"> ( {{manage_percent.manage_percent }}% )</span>-->
                </el-button>
              </div>
            </el-popover>
          </div>
          <div class="s_details_fuze" :class="{s_fuzeman:fuzeman}">
            跟进人1:
            <el-popover trigger="hover" placement="top"  v-for="item in date.partner" :key="item.partner">
              <p> {{item.dept}}{{item.partner}}</p>
              <div slot="reference" class="name-wrapper">
                <el-button  size="small" style="border: none !important; background:none !important; padding-right: 0px !important;">{{item.partner}}
                  <!--<span v-if="item.is_show">( {{item.percent}}% )</span>-->
                </el-button>
              </div>
            </el-popover>
            <i @click="charge" v-if="button_root" class="el-icon-edit"></i>
          </div>
        </div>
        <div class="s_details_btn">
          <el-button type="primary" @click="newAnnex">+新增附件</el-button>
          <el-button type="primary" v-if="button_root" @click="addItems">+新增项目</el-button>
          <el-button type="primary" v-if="button_root" @click="addOrder">+新增订单</el-button>
          <el-button type="primary" v-if="button_transfer" @click="toggleSelectionAll">转移给他人</el-button>
        </div>
      </div>

      <!-- 弹窗 -->
      <el-dialog title="" :visible.sync="dialogFormVisible" :modal="false">
        <el-form :model="person">
          <el-form-item prop="options" label="人员"  class="s_client_item">
            <el-select v-model="selectedOptions" @change="handleChange" clearable filterable placeholder="请选择" class="s_order_search">
              <el-option
                  v-for="item in persons"
                  :key="item.dd_id"
                  :label="item.nickname"
                  :value="item.dd_id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <el-switch
            v-model="project"
            @change
            active-text="是否转移全部项目">
        </el-switch>
        <el-switch
            v-model="order"
            @change
            active-text="是否转移全部订单">
        </el-switch>
        
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="transferTrue">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="编辑" :visible.sync="dialogFormTime" :modal="false" width='500px'>
        <el-form :model="r_data">
          <el-form-item label="首次成单日期"  class="s_client_item">
            <el-date-picker type="date" placeholder="请选择" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" v-model="r_data.success_time">
						</el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormTime = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormTimeF">确 定</el-button>
        </div>
      </el-dialog>


    </el-card>
    <br/>
    <el-card>
      <el-tabs :tab-position="tabPosition" v-model="tabsName">
        <el-tab-pane label="详情" name="clientDet">
          <el-card>
            <div slot="header" class="clearfix">
              <span style="float: left;color:#333333;font-size:16px;font-weight:800;">基础信息</span>
              <el-button v-if="button_root" @click="dialogOpen" icon="el-icon-edit" style="float: left; padding: 3px 0;margin-left: 10px;" type="text"></el-button>
            </div>
            <div class="s_details_basic">
              <div class="s_details_basic_title">
                <div class="s_details_basic_name">
                  <p><span style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</span>客户名称</p>
                  <p style="height:10px;"></p>
                  <span>{{ date.company }}</span>
                </div>
                <div class="s_details_basic_industry">
                  <p><div style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</div>行业</p>
                  <p style="height:10px;"></p>
                  <span>{{ date.industry }}</span>
                </div>
                <div class="s_details_basic_source">
                  <p><div style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</div>客户来源</p>
                  <p style="height:10px;"></p>
                  <span>{{ date.source }}</span>
                </div>
              </div>
              <div class="s_details_basic_intermediate">
                <div class="s_details_basic_rank">
                  <p><div style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</div>客户级别</p>
                  <p style="height:10px;"></p>
                  <span>{{ date.rank }}</span>
                </div>
                <div class="s_details_basic_scale">
                  <p><div style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</div>公司规模</p>
                  <p style="height:10px;"></p>
                  <span>{{ date.scale}}</span>
                </div>
                <div class="s_details_basic_scale">
                  <p><div style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</div>咨询方式</p>
                  <p style="height:10px;"></p>
                  <span>{{ date.ask_method}}</span>
                </div>
              </div>
              <div class="s_details_basic_intermediate">
                <div class="s_details_basic_rank">
                  <p><div style="color:#409eff;margin-right: 5px;float:left;margin-left: 0px;">●</div>客户地址</p>
                  <p style="height:10px;"></p>
                  <span>{{ date.location }} {{ date.address }}</span>
                </div>

                <div class="s_details_basic_rank">
                  <p><div style="color:#409eff;margin-right: 5px;float:left;margin-left: 0px;">●</div>咨询时间</p>
                  <p style="height:10px;"></p>
                  <span>{{date.ask_time}}</span>
                </div>

                <div class="s_details_basic_rank">
                  <p>
                    <div style="color:#409eff;margin-right: 5px;float:left;margin-left: 0px;">●</div>
                    首次成单时间 <i @click="chargeTime" v-if="button_root_first == 1" class="el-icon-edit"></i>
                  </p>
                  <p style="height:10px;"></p>
                  <span>{{date.first_success_time}}</span>
                </div>

                <div class="s_details_basic_scale" style="width: 50%; margin: 15px 0px;">
                  <p><div style="color:#409eff;margin-right: 5px;float:left;margin-left: 0px;">●</div>备注</p>
                  <p style="height:10px;"></p>
                  <span>{{ date.brief }}</span>
                </div>
              </div>
            </div>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="float: left;color:#333333;font-size:16px;font-weight:800;">联系人</span>
              <div><el-button type="primary" @click="dialogTable = true" plain size="mini" style="margin-left: 10px">添加联系人</el-button></div>
            </div>
            <div>
              <el-table :data="contactList" style="width: 100%" max-height="250">
                <el-table-column  fixed prop="link_name" label="姓名"></el-table-column>
                <el-table-column prop="link_type" label="联系类型"></el-table-column>
                <el-table-column prop="telephone" label="联系方式"></el-table-column>
                <el-table-column prop="department" label="部门"></el-table-column>
                <el-table-column prop="duty" label="职务"></el-table-column>
                <el-table-column prop="remark" label="联系人备注"></el-table-column>
                <el-table-column  fixed="right" label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button
                        @click.native.prevent="deleteRow(scope.$index, contactList)"
                        type="text"
                        size="mini">
                      移除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="float: left;color:#333333;font-size:16px;font-weight:800;">操作日志</span>
            </div>
            <el-steps direction="vertical" :active="1">
              <el-step
                  v-for="item in operation"
                  v-bind:key="item.id"
                  :title="item.title"
                  :description="item.content"
              >
              </el-step>
            </el-steps>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="项目" name="clientItem">
          <div><el-button type="primary" v-if="button_transfer" @click="addItems" plain size="mini" style="margin-left: 10px">新增项目</el-button></div>
          <el-table  :data="projectData" style="width: 100%">
            <el-table-column prop="code" label="项目编号"></el-table-column>
            <el-table-column prop="nickname" label="负责人"></el-table-column>
            <el-table-column prop="price" label="项目预算"></el-table-column>
            <el-table-column prop="stage" label="项目状态"></el-table-column>
            <el-table-column prop="product" label="产品信息"></el-table-column>
            <el-table-column prop="details" label="项目详情"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="itemDetail(scope.row)" type="text" size="mini">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="订单" name="clientOrder">
          <div><el-button type="primary" v-if="button_transfer" @click="addOrder" plain size="mini" style="margin-left: 10px">新增订单</el-button></div>
          <el-table  :data="orderData" style="width: 100%">
            <el-table-column prop="code" label="订单编号"></el-table-column>
            <el-table-column prop="nickname" label="负责人"></el-table-column>
            <el-table-column prop="partner" label="共同负责人"></el-table-column>
            <el-table-column prop="price" label="订单预算"></el-table-column>
            <el-table-column prop="stage" label="订单状态"></el-table-column>
            <el-table-column prop="product" label="产品信息"></el-table-column>
            <el-table-column prop="details" label="服务日期"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="orderDetail(scope.row)" type="text" size="mini">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="附件" name="clientFile">
          <div>
            <el-button type="primary" @click="newAnnex" plain size="mini">新增附件</el-button>
          </div>
          <annexList :annexData="annexData" @annex="annex"></annexList>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog title="联系人添加" :visible.sync="dialogTable" :modal="false" width="45%" class='lianxirenAdd'>
      <el-form  label-width="110px" class='lableContent'>
        <el-form-item prop="contact">
          <el-form-item prop="link_name" label="姓名(必填)">
            <el-input v-model="contact.link_name" autosize placeholder="请输入内容" class="s_client_sel_div" ></el-input>
          </el-form-item>
          <br/>
          <el-form-item prop="company" label="联系类型(必填)">
            <el-select v-model="contact.link_type" placeholder="请选择" class="s_client_sel_div">
              <el-option
                  v-for="item in link_type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <br/>
          <el-form-item prop="company" label="联系方式(必填)">
            <el-input v-model="contact.telephone" placeholder="请输入内容" class="s_client_sel_div"></el-input>
          </el-form-item>
          <br/>
          <el-form-item prop="company" label="部门">
            <el-input v-model="contact.department" placeholder="请输入内容" class="s_client_sel_div"></el-input>
          </el-form-item>
          <br/>
          <el-form-item prop="company" label="职务">
            <el-input v-model="contact.duty" placeholder="请输入内容" class="s_client_sel_div"></el-input>
          </el-form-item>
          <br/>
          <el-form-item prop="company" label="联系人备注">
            <el-input v-model="contact.remarks" placeholder="请输入内容" class="s_client_sel_div"></el-input>
          </el-form-item>
          <br/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTable = false">取 消</el-button>
        <el-button type="primary" @click="confirm(contact)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="客户信息修改" :visible.sync="dialogTableVisible" :modal="false" width="600px">
      <el-form ref="form" :model="form" label-position="right" label-width="100px" class='lableContent'>
        <el-form-item label="客户名称：">
          <el-input v-model="form.company" placeholder="请输入内容" class="s_client_sel_div"></el-input>
        </el-form-item>
        <el-form-item label="客户级别：">
          <el-select v-model="form.rank" placeholder="请选择" class="s_client_sel_div">
            <el-option
                v-for="item in rank"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行业：">
          <el-select v-model="form.industry" placeholder="请选择" class="s_client_sel_div">
            <el-option
                v-for="item in industry"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="customer_source" label="客户来源：">
          <el-cascader 
              class='peopleFrom'
              expand-trigger="click"
              filterable
              clearable
              :options="source"
              v-model="form.source"
              @change="changeSource"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item prop="ask_method" label="咨询方式" v-if="judge">
          <el-select v-model="form.ask_method"  filterable placeholder="请选择" class="s_client_width">
            <el-option
                v-for="item in options"
                :key="item.cost_type"
                :label="item.label"
                :value="item.cost_type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="ask_method" label="咨询方式" v-if="judgeLine">
          <el-select v-model="form.ask_method"  filterable placeholder="请选择" class="s_client_width">
            <el-option
                v-for="item in line"
                :key="item.cost_type"
                :label="item.label"
                :value="item.cost_type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="ask_method" label="咨询方式" v-if="judgeLinen">
          <el-select v-model="form.ask_method" clearable filterable placeholder="请选择" class="s_client_width">
            <el-option
                v-for="item in linen"
                :key="item.cost_type"
                :label="item.label"
                :value="item.cost_type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="ask_method" label="咨询方式" v-if="judgeHm">
          <el-select v-model="form.ask_method" clearable filterable placeholder="请选择" class="s_client_width">
            <el-option
                    v-for="item in hm"
                    :key="item.cost_type"
                    :label="item.label"
                    :value="item.cost_type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司规模：">
          <el-select v-model="form.scale"  placeholder="请选择" class="s_client_sel_div">
            <el-option
                v-for="item in scale"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户地址：">
          <el-select v-model="form.location" placeholder="请选择省" class="s_client_sel_div">
            <el-option
                v-for="item in location"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="咨询日期" prop="ask_time" class="">
          <el-date-picker
              class="s_client_sel_div"
              v-model="form.ask_time"
              type="datetime"
              placeholder="选择日期时间"
              >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="详细地址：">
          <el-input v-model="form.address" autosize placeholder="请输入详细地址" class="s_client_sel_div"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="form.brief" type="textarea" :rows="3" autosize placeholder="请输入" class="s_client_sel_div"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
                <el-button @click="dialogTableVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmAdd(form)">确 定</el-button>
            </span>
    </el-dialog>
    <el-dialog
        title="添加附件"
        :visible.sync="newAnnexDialog"
        :modal="false"
    >
      <upload @fileStatus="fileStatus" @fileTrue="fileTrue" :success="success"></upload>
      <div class="demo-input-suffix">
        <span class="s_details_input">备注：</span>
        <el-input
            style="margin-top: 20px"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="textarea">
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="newAnnexDialog = false">取 消</el-button>
                <el-button type="primary" @click="newAnnexDialogT">确 定</el-button>
            </span>
    </el-dialog>
    <el-dialog title="编辑跟进人" :visible.sync="dialogFormVisible1" :before-close="handleClose" :modal="false">
      <el-form :model="form">
        <el-form :inline="true" v-if="all_order">
          <el-form-item  class="s_client_item">创建人业绩</el-form-item>
          <el-form-item :label="manage_percent.nickname" class="s_client_item s_client_sel_divMargin0" label-width="66px">
            <el-input v-model="manage_percent.manage_percent"  autosize placeholder="两位整数" style="width:'100px'">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-form>

        <el-form-item  label="跟进人"  class="s_client_item s_client_sel_divMargin0" style="margin-left: 80px;">
          <el-select v-model="partner" multiple clearable filterable placeholder="请选择" @change="changeClientInfo" class="s_order_search s_order_search2 el-form-item__content">
            <el-option
                v-for="item in persons"
                :key="item.dd_id"
                :label="item.nickname"
                :value="item.dd_id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form :inline="true" v-if="all_order">
          <el-form-item  class="s_client_item" style="width: 180px;">业绩占比</el-form-item>
          <div v-for="item in partner_sel" :key="item.dd_id" style="position: relative;top: -60px;left: 80px;">
            <el-form-item   :label="item.partner" class="s_client_item s_client_sel_divMargin0">
              <el-input v-model="item.percent"  autosize placeholder="两位整数">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </div>
        </el-form>
      </el-form>

      <el-switch
          v-model="all_project"
          @change
          active-text="共同跟进该客户下的所有项目">
      </el-switch>
      <el-switch
          v-model="all_order"
          @change
          active-text="共同跟进该客户下的所有订单">
      </el-switch>
      <div slot="footer" class="dialog-footer">
        <!--<el-button @click="dialogFormVisible1 = false">取 消</el-button>-->
        <el-button @click="cancelMethod">取 消</el-button>
        <el-button type="primary" @click="CoinCharge">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import contacts from '../.././components/s_customer/contacts';
  import annexList from '../.././components/s_customer/annexList';
  import upload from '../.././components/s_customer/fiieDataCe';
  import Util from '@/libs/util';

  export default {

    components: { contacts,annexList,upload },

    data () {
      return {
        dialogFormTime:false,
        s_fuzeman:true,
        judgeLine:false, //如果来源为线下时 显示咨询方式
        judge:false, //如果来源为猪八戒时 显示咨询方式
        judgeLinen:false,
        judgeHm:false,
        success:false,
        button_root: false,
        dialogFormVisible1:false,
        tabsName: 'clientDet',
        fileList: [],
        partner:[], //共同负责人
        partner_person:[], //负责人
        partner_sel:[],
        manage_percent:[],
        partner_dept:'',   //部门
        clild:'',
        // 客户详情展示的数据
        date: {
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
          first_success_time:''
        },
        // 修改客户数据后台需要的参数
        form : {
          company: '',        // 客户名称
          industry: '',       // 客户行业
          source: [],         // 客户来源
          rank: '',           // 客户级别
          scale: '',          // 公司规模
          location: '',       // 公司省市地址
          address: '',        // 公司详细地址
          id: '',             // 客户id
          ask_method:'',      //后加的字段（咨询方式）
          ask_time:'',
          brief:'',
        },
        // 新加联系人后台需要的数据
        contact : {
          link_name: '',
          telephone: '',
          department: '',
          duty: '',
          link_type: '',
          remarks: '',
          client_id : '',
        },
        rank: [],                            // 客户级别的存放数据
        industry: [],                        // 客户行业的存放数据
        source: [],                         // 客户来源的存放数据
        scale: [],                          // 客户公司规模存放数据
        location: [],                       // 客户地址存放数据
        dialogTableVisible: false,          // 客户详情修改弹窗的显示
        dialogTable: false,                 // 添加联系人弹窗的显示
        tabPosition: 'top',
        contactList: [],                    // 联系人列表数据
        selectedOptions:'',                // 转移客户绑定的数组值
        dialogFormVisible: false,          // 转移客户弹窗的控制显示
        dd_id: '',    
        button_root_first:0,                    // 转移客户，负责人的dd_id
        person: {
          client: '',                  // 转移客户选中负责人，绑定的值
        },
        r_data:{
          id:this.$route.params.id,
          success_time:''
        },
        project: false,                 // 转移客户下的项目
        order: false,                   // 转移客户下的订单
        all_project:false,              //共同负责人的所有项目
        all_order:false,                //共同负责人的所有订单
        operation: [],                  // 操作日志
        annexData: [],
        newAnnexDialog: false,          // 新增附件的对话框
        textarea: '',                   // 附件的备注信息
        // 联系方式的选择
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
        }],
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
        hm:[{
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
        // 表格数据
        tableData: [{}],
        orderData: [],
        projectData: [],
        //附件
        file: [],
        source_client:[], //客户来源的编辑
        button_transfer:'',
      }
    },
    computed:{
      fuzeman() {
        if(this.date.partner) {
          this.s_fuzeman = false;
        } else {
          this.s_fuzeman = true;
        }
        return this.s_fuzeman
      },
      persons () {
        return this.$store.state.app.commonPerson;
      }
    },
    methods: {
      dialogFormTimeF(){
        this.$post('client/editSuccessTime',this.r_data)
          .then((data) => {
            if(data.code) {
              this.$message({
                message: '修改成功！',
                type:'wraning',
              });
              setTimeout(() => {
                 this.dialogFormTime = false;
                  this.$router.go(0);
              }, 50);
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
      chargeTime(){
        this.dialogFormTime = true;
      },
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
      changeSource (val){
        this.form.ask_method = '';
        val[0] === 1 ? this.judge = true : this.judge = false;
        val[0] === 4 ? this.judgeLine = true : this.judgeLine = false;
        val[0] === 5 ? this.judgeLinen = true : this.judgeLinen = false;
        val[0] === 6 ? this.judgeHm = true : this.judgeHm = false;
      },
      //弹出跟进人弹窗
      charge() {
        this.dialogFormVisible1 = true;
      },
      change() {

      },
      //编辑跟进人
      CoinCharge() {
        let all_project = this.all_project ? 1 : 0;
        let all_order = this.all_order ? 1 : 0;
        let manage_percent = 0;
        let kpi_percent = [];
        if(all_order == 1){
          //主负责人业绩占比
          manage_percent = parseInt(this.manage_percent.manage_percent);
          let reg = /^\d{1,3}$/;
          if(!reg.test(manage_percent)){
            this.$message({
              message: '业绩必须是3位以内的整数',
              type: 'warning'
            })
            return false;
          }
          let all_percent = manage_percent;
          let bol = true;
          let str = this.manage_percent.nickname + ":" + manage_percent + "%";

          // 此变量是本地变量   如果给它赋值 它有数据 就给kpi赋值 id = 数字。
          // 
          if(this.partner_sel !== null){
            for (let i = 0; i < this.partner_sel.length; i++) {
              if(!reg.test(this.partner_sel[i].percent)){
                this.$message({
                  message: '业绩必须是3位以内的整数',
                  type: 'warning'
                })
                bol = false;
                break;
              }
              
              kpi_percent[this.partner_sel[i].dd_id] = this.partner_sel[i].percent;
              all_percent = all_percent + parseInt(this.partner_sel[i].percent);
              str += this.partner_sel[i].partner + ":" + this.partner_sel[i].percent + "%";
            }
            if(!bol){
              return false;
            }
          }


          if(all_percent != 100){
            this.$message({
              message: '业绩总和必须是100%',
              type: 'warning'
            })
            return false;
          }
          let info = '确认信息后，该客户下的所有订单业绩都将拆分为' + str + '，请确认？';
          this.$confirm(info, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$put('client/updPartner/' + this.clild,{partner:this.partner,all_project:all_project,all_order:all_order,kpi_percent:kpi_percent,manage_percent:manage_percent})
              .then((data) => {
                if(data.code) {
                  this.$message({
                    message: data.errorMsg,
                    type:'success',

                  });
                  this.dialogFormVisible1 = false;
                  this.client = [];
                  this.partner = [];
                  this.clientAdd();
                  this.personList();
                }else {
                  this.$message({
                    message: data.errorMsg,
                    type:'warning',

                  })
                }
              })
              .catch(() => {

              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消提交'
            });
          });
        }else{
          this.$put('client/updPartner/' + this.clild,{partner:this.partner,all_project:all_project,all_order:all_order,kpi_percent:kpi_percent,manage_percent:manage_percent})
            .then((data) => {
              if(data.code) {
                this.$message({
                  message: data.errorMsg,
                  type:'success',

                });
                this.dialogFormVisible1 = false;
                this.client = [];
                this.partner = [];
                this.clientAdd();
                this.personList();
              }else {
                this.$message({
                  message: data.errorMsg,
                  type:'warning',

                })
              }
            })
            .catch(() => {

            })
        }
      },
      //编辑共同负责任人的选择框change事件
      changeProduct(value) {
        this.form.source = value;
      },
      //oss
      fileStatus(data) {
        this.file = data;
      },
      fileTrue(data) {
        this.success = data;
      },
      // 文件上传
      newAnnexDialogT() {
        this.$post( 'client/file',{id: this.$route.params.id,file: this.file,brife:this.textarea})
          .then( (data) => {
            if(data.code){
              this.$message({
                message: '上传成功',
                type: 'success'
              });
              this.newAnnexDialog = false;
              this.tabsName = 'clientFile';
              this.success = true;
              this.textarea = "";
              this.annexUpload();
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      // 子组件传回来删除附件的值
      annex (data) {
        this.$get( 'client/fileDelete',{id : data})
          .then( (data) => {
            if(data.code){
              this.$message({
                message: '删除成功',
                type: 'success'
              });
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch( (error) => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      // 打开新增附件的提示框
      newAnnex () {
        this.newAnnexDialog = true;
      },
      // 打开转移客户的弹窗
      toggleSelectionAll(){
        this.dialogFormVisible = true;
      },
      // 负责人的级联选择
      handleChange(value) {
        this.dd_id = value;
      },
      // 跳转项目详情
      itemDetail (row) {
        this.$router.push({name: 'itemDetail', params: {id: row.id}})
      },
      // 跳转订单详情
      orderDetail (row) {
        this.$router.push({name: 'orderDetail', params: {id: row.id}})
      },
      // 确定转移客户数据
      transferTrue(){
        this.$post( 'client/transfer', {id_all: this.form.id, new_dd_id: this.dd_id,project: this.project,order: this.order})
          .then( (data) => {
            if(data.code){
              this.$message({
                type: 'success',
                message: '转移成功!'
              });
              this.selectedOptions = '';
              this.dialogFormVisible = false;
              this.$router.push({name: 'clientList'})
            } else {
              this.$message({
                message: data.errorMsg,
                type: 'warning'
              });
            }
          })
          .catch (() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      cancelMethod() {
        this.dialogFormVisible1 = false
        this.clientAdd();
      },
      handleClose(done) {
        this.dialogFormVisible1 = false
        this.clientAdd();
      },
      // 删除联系人
      deleteRow(index, rows) {
        if(rows.length > 1){
          this.$post( 'client/delete_linkman',{id :rows[index].id})
            .then ( (data) => {
              if(data.code){
                this.$message({
                  message: data.errorMsg,
                  type: 'success'
                });
                rows.splice(index, 1);
                this.clientAdd();
              }
            })
            .catch (() => {
              this.$message.error('服务器错误，请稍后重试');
            })
        } else {
          this.$message({
            message: '联系人最少有一个',
            type: 'warning'
          });
        }
      },
      // 确定添加联系人接口
      confirm () {
        if(!this.contact.link_name){
          this.$message.error('联系人姓名不能为空，请输入联系人');
        } else if(!this.contact.link_type) {
          this.$message.error('联系类型不能为空，请选择联系类型');
        } else if (!this.contact.telephone){
          this.$message.error('客户联系方式不能为空，请输入联系方式');
        } else {
          this.$post( 'client/add_linkman',this.contact)
            .then( (data) => {
              if(data.code){
                this.$message({
                  message: data.errorMsg,
                  type: 'success'
                });
                this.dialogTable = false;
                this.clientAdd();
                this.contact = {};
              } else {
                this.$message.error(data.errorMsg);
              }
            })
            .catch(() => {
              this.$message.error('服务器错误，请稍后重试');
            })
        }
      },
      // 打开修改客户信息的弹窗
      dialogOpen () {
        this.dialogTableVisible = true;
      },
      // 新增订单
      addOrder() {
        this.$router.push({name: 'addOrder'})
      },
      // 保存修改的客户信息
      confirmAdd () {
        if (!this.form.company) {
          this.$message({
            message: '请填写客户名称',
            type: 'warning'
          });
        } else if (!this.form.address) {
          this.$message({
            message: '请填写客户详情地址',
            type: 'warning'
          });
        }else {
          this.$post( 'client/update_client',this.form)
            .then( (data) => {
              if(data.code){
                this.$message({
                  message: data.errorMsg,
                  type: 'success'
                });
                this.dialogTableVisible = false;
                this.clientAdd();
              } else {
                this.$message.error(data.errorMsg);
              }
            })
            .catch(() => {
              this.$message.error('服务器错误，请稍后重试');
            })
        }
      },
      // 客户详情的所有数据请求
      clientAdd () {
        this.$get( 'client/detail',{id:this.$route.params.id})
          .then( (data) => {
            let client = data.content.client;
            this.clild = client.id;
            this.date.code = client.code;
            this.date.company = client.company;
            this.date.nickname = client.nickname;
            this.date.department = client.department;
            this.date.industry = client.industry.name;
            this.date.location = client.location.name;
            this.date.address = client.address;
            this.date.source = client.source_show;
            this.date.rank = client.rank.name;
            this.date.scale = client.scale.name;
            this.date.first_success_time = client.first_success_time;
            this.r_data.success_time = client.first_success_time;
            this.button_root_first = client.edit_first_success;

            if(client.partner !== null){
              // 循环partner 如果没有数据  使用is——show为false，如果有数据 则为true
              for(let i = 0; i < client.partner.length; i++){
                client.partner[i]['is_show'] = false;
                if(client.partner[i].percent > 0){
                  client.partner[i]['is_show'] = true;
                }
              }
            }
            this.date.partner = client.partner;
            this.date.ask_method = client.ask_method.name;
            this.date.id = client.id;
            this.date.brief = client.brief;
            this.date.ask_time = client.ask_time;
            this.form.id = client.id;
            this.contact.client_id = client.id;
            this.contactList = data.content.linkman;
            this.operation = data.content.operate_log;
            this.form.industry = client.industry.id;     // 客户行业
            this.form.source = client.source;            // 客户来源
            client.source[0] === 1 ? this.judge = true : this.judge = false;
            client.source[0] === 4 ? this.judgeLine = true : this.judgeLine = false;
            client.source[0] === 5 ? this.judgeLinen = true : this.judgeLinen = false;
            client.source[0] === 6 ? this.judgeHm = true : this.judgeHm = false;
            this.form.ask_method = client.ask_method.id;
            this.form.rank = client.rank.id;                 // 客户级别
            this.form.scale = client.scale.id;               // 公司规模
            this.form.location = client.location.id;         // 公司省市地址
            this.form.address = client.address;              // 公司详细地址
            this.form.company = client.company;
            this.form.brief = client.brief;
            this.orderData = data.content.order;
            this.projectData = data.content.project;
            this.button_root = data.content.button_root;
            this.partner = client.partner_edit ? client.partner_edit : [];
            this.partner_sel = client.partner;
            this.manage_percent = client.manage_percent;
            this.button_transfer = data.content.button_transfer;
            if(client.manage_percent.manage_percent == 0 || client.manage_percent.manage_percent == ""){
              this.manage_percent['is_show'] = false;
            }else{
              this.manage_percent['is_show'] = true;
            }
            this.form.ask_time = client.ask_time;
            client.all_order == 1 ? this.all_order = true : this.all_order = false;
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      // 新负责人的请求接口
      personList () {
        this.$get( 'client/index_show')
          .then( (data) => {
            this.client = data.content.person;
            let client = data.content;
            this.company = client.company;
            this.industry = client.industry;
            let source = client.customer_source;
            let source_arr = Util.obj2Arr(source);
            this.source = source_arr;
            this.rank = client.root;
            this.scale = client.scale;
            this.location = client.location;
            this.address = client.address;
          })
          .catch (() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      // 新增项目
      addItems () {
        this.$router.push({
          name: 'addItem',
          params:{
            id:this.date.id,
            origin:this.form.source,
            company:this.form.company
          }
        })
      },
      // 附件列表请求接口
      annexUpload () {
        this.$get( 'client/fileList',{id:this.$route.params.id})
          .then( (data) => {
            this.annexData = data.content;
          })
          .catch (() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      }
    },
    created(){
      this.clientAdd();
      this.personList();
      this.annexUpload();
    }
  }
</script>

<style lang="less" scoped>
  .clientDetails{
    .show{
      display: block;
    }
    .hide{
      display: none;
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
      margin-top: 10px;
      font-size: 14px;
      color: gray;
    }
    .s_details_btn {
      float: left;
      margin-top: 10px;
      margin-bottom: 20px;
      margin-left: 0px !important;
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
    .s_details_basic_title div, .s_details_basic_intermediate div{
      float: left;
    }
    .s_details_basic_name, .s_details_basic_source, .s_details_basic_industry, .s_details_basic_rank, .s_details_basic_scale, .s_details_basic_bottom {
      color: #999999;
      font-size: 14px;
      width: 32.5%;
    }
    .s_details_basic_name span, .s_details_basic_source span, .s_details_basic_industry span, .s_details_basic_rank span, .s_details_basic_scale span, .s_details_basic_bottom span {
      color: #333333;
      font-size: 16px;
      margin-left: 14px;
    }
    .s_details_basic_industry, .s_details_basic_source, .s_details_basic_scale {
      margin-left: 0px;
    }
    .box-card {
      margin-top: 15px;
    }
    .s_client_address {
      width: 80%;
      margin-top: 20px;
      margin-left: 26px;
    }
    .s_details_input {
      float: left;
      margin-top: 20px;
    }
    .s_detailForm {
      width: 100%;
      float: left;
    }
    .el-icon-edit:hover {
      cursor: pointer;
    }
    .name-wrapper {
      display: inline !important;
    }
    .s_fuzeman {
      margin-top: 15px !important;
    }
    .el-step {
      flex-basis: 80px !important;
      height: 80px;
    }
    .s_client_sel_div {
      width: 80%;
    }
    .el-form-item__content {
      margin-left: 40px !important;
    }
    .s_client_sel_divMargin0 .el-form-item__content{
      margin-left: 30px !important;
    }
    .s_order_search2{
      width: 256px;
    }
    .lianxirenAdd .el-dialog__body{
      padding: 0 40px!important;
    }
    .lableContent .s_client_sel_div{
      width: 300px !important;
    }
    .peopleFrom{
      width: 300px !important;
    }
  }
</style>
