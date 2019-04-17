// 项目详情页面所有数据
<template>
  <div class="itemDetails">
    <el-card>
      <div style="width: 100%;height: 120px;">
        <div class="s_details_company">
          <div class="s_details_title">{{ date.name }} ( {{ date.code }} )</div>
          <div class="s_details_fuze">
            负责人：
            <el-popover trigger="hover" placement="top">
              <p> {{date.department}} - {{ date.salesman }}</p>
              <div slot="reference" class="name-wrapper" style="display: inline; margin:0 5px">
                <el-button  size="small" style="border: none !important; background:none !important;">{{ date.salesman }}</el-button>
              </div>
            </el-popover>
          </div>
          <div class="s_details_fuze" :class="{s_fuzeman:fuzeman}">
            共同负责人:
            <el-popover trigger="hover" placement="top"  v-for="item in  data.partner" :key="item.partner">
              <p> {{item.dept}} - {{item.partner}}</p>
              <div slot="reference" class="name-wrapper" style="display: inline; margin:0 5px">
                <el-button  size="small" style="border: none !important; background:none !important; padding-right: 0px !important;">{{item.partner}}</el-button>
              </div>
            </el-popover>
            <i style="margin-left: 10px" v-if="button_root" @click="charge" class="el-icon-edit"></i>
          </div>
        </div>
        <div class="s_details_btn">
          <el-button type="primary" @click="dialogFollow">写跟进</el-button>
          <el-button type="primary" @click="addOrder()">转成订单</el-button>
          <el-button type="primary" @click="toggleSelectionAll">转移给他人</el-button>
          <el-button type="primary" @click="proposalApplication">+发起售前调用申请</el-button>
        </div>
        <div class="s_item_status">
          <p>状态</p>
          <el-select v-model="stage" :disabled="!button_root" placeholder="请选择" filterable @change="stageChange">
            <el-option
                v-for="item in status"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
          </el-select>
          <el-dialog
              :visible.sync="FlowList"
              :modal="false"
              width="600px"
          >
            <el-form :model="reasonForm" label-width="80px">
              <el-form-item label="流单日期">
                <el-date-picker
                        v-model="reasonForm.sameDate"
                        type="date"
                        placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="流单原因">
                <el-select v-model="reasonForm.reason" placeholder="请选择">
                  <el-option
                      v-for="item in reason"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="说明">
                <el-input
                    class="s_item_new"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入内容"
                    v-model="reasonForm.reason_brief">
                </el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
							<el-button @click="FlowListF">取 消</el-button>
							<el-button type="primary" @click="FlowListT">确 定</el-button>
						</span>
          </el-dialog>
        </div>
      </div>
      <el-dialog title="转移给他人" :visible.sync="dialogFormItem" :modal="false" width="30%">
        <el-form :model="person">
          <el-form-item prop="client" label="人员"  class="s_client_item">
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
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormItem = false">取 消</el-button>
          <el-button type="primary" @click="transferTrue">确 定</el-button>
        </div>
      </el-dialog>
      <el-tabs :tab-position="tabPosition" v-model="tabsItem">
        <el-tab-pane label="详情" name="itemDet">
          <el-card>
            <div slot="header" class="clearfix">
              <span style="float: left;color:#333333;font-size:16px;font-weight:800;">项目信息</span>
              <el-button v-if="button_root" @click="dialogOpen" icon="el-icon-edit" style="float: left; padding: 3px 0;margin-left: 10px;" type="text"></el-button>
            </div>
            <div class="s_details_basic">
              <div class="s_details_basic_title">
                <div class="s_details_basic_name">
                  <p><span style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</span>项目名称</p>
                  <p style="height:10px;"></p>
                  <span>{{ date.name }}</span>
                </div>
                <div class="s_details_basic_name">
                  <p><span style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</span>关联客户</p>
                  <p style="height:10px;"></p>
                  <span @click="clientOpen" style="color:#409eff;">{{ date.company }}</span>
                </div>
                <div class="s_details_basic_name">
                  <p><span style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</span>项目状态</p>
                  <p style="height:10px;"></p>
                  <span>{{ date.status }}</span>
                </div>
              </div>
              <div class="s_details_basic_intermediate">
                <div class="s_details_basic_name">
                  <p><span style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</span>项目预算</p>
                  <p style="height:10px;"></p>
                  <span>{{ date.future_price }}</span>
                </div>
                <div class="s_details_basic_name">
                  <p><span style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</span>产品信息</p>
                  <p style="height:10px;"></p>
                  <span v-for="pro in form.pro_info" :key="pro.id">
								{{ pro.name }}
							</span>
                </div>
                <div class="s_details_basic_name">
                  <p><span style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</span>项目来源</p>
                  <p style="height:10px;"></p>
                  <span>
								{{ date.origin }}
							</span>
                </div>
              </div>
              <div class="s_details_basic_bottom">
                <div class="s_details_basic_name">
                  <p><span style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</span>意向</p>
                  <p style="height:10px;"></p>
                  <span>{{ date.intention }}</span>
                </div>
                <div class="s_details_basic_name">
                  <p><span style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</span>预计签约时间</p>
                  <p style="height:10px;"></p>
                  <span>
								{{ date.expect_sign_time }}
							</span>
                </div>
                <div class="s_details_basic_name">
                  <p><span style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</span>备注</p>
                  <p style="height:10px;"></p>
                  <span>{{ date.remark }}</span>
                </div>
              </div>
              <div class="s_details_basic_bottom_btn">
                <div class="s_details_basic_name_btn">
                  <p><span style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</span>流单原因</p>
                  <p style="height:10px;"></p>
                  <span>{{ date.reason }}</span>
                </div>
                <div class="s_details_basic_name_btn">
                  <p><span style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</span>流单说明</p>
                  <p style="height:10px;"></p>
                  <span>{{ date.reason_brief }}</span>
                </div>
                <div class="s_details_basic_name_btn">
                  <p><span style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</span>流单日期</p>
                  <p style="height:10px;"></p>
                  <span>{{ date.reason_time }}</span>
                </div>
              </div>
            </div>
          </el-card>
          <div v-if="contactlist.length > 0">
            <contactlist  :contactlist="contactlist"></contactlist>
          </div>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>操作日志</span>
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
        <el-tab-pane label="跟进记录" name="itemFollow">
          <div class="followListTop">
            <el-button type="primary" @click="dialogFollow" plain size="mini" style="margin-left: 10px">新增跟进</el-button>
          </div>
          <follow_list :followData="followData,formWay" @followNew="followNew"></follow_list>
        </el-tab-pane>
        <el-tab-pane label="售前工单" name="itemOrder">
          <el-table :data="itemProjectData" style="width: 100%">
            <el-table-column prop="number" label="关联工单"></el-table-column>
            <el-table-column prop="person" label="发起人"></el-table-column>
            <el-table-column prop="link_type" label="工单类型"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column prop="call_that" label="调用类型"></el-table-column>
            <el-table-column prop="next_person" label="下一步操作人"></el-table-column>
            <el-table-column prop="update_time" label="更新日期"></el-table-column>
            <el-table-column prop="create_time" label="创建日期"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="附件" name="itemFile">
          <div>
            <el-button type="primary" @click="newAnnex" plain size="mini" style="margin-left: 10px">新增附件</el-button>
          </div>
          <annexList :annexData="annexData" @annex="annex"></annexList>
        </el-tab-pane>
      </el-tabs>
      <!--新增跟进弹窗内容-->
      <el-dialog title="新增跟进记录" :visible.sync="dialogFormVisible" :modal="false" width="500px">
        <el-form :model="formAll" label-width="150px">
          <el-form-item label="拜访方式">
            <el-select v-model="formAll.form" placeholder="请选择" class="s_item_form">
              <el-option
                  v-for="item in formWay"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="陪访人">
            <el-input v-model="formAll.accompany" placeholder="请输入" class="s_item_form"></el-input>
          </el-form-item>
          <el-form-item label="下次拜访时间">
            <el-date-picker
                class="s_item_form"
                v-model="formAll.next_time"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="拜访结果">
            <el-input
                class="s_item_form"
                type="textarea"
                :rows="5"
                placeholder="请输入至少五个字符"
                v-model="formAll.result">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="formTrue">确 定</el-button>
        </div>
      </el-dialog>
      <!--项目信息修改弹窗内容-->
      <el-dialog title="详情修改" :visible.sync="dialogTableVisible" :modal="false" width="600px">
        <el-form ref="form" :model="form" label-position="left" label-width='100px'>
          <el-form-item prop="company" label="项目名称：">
            <el-input v-model="form.name" autosize placeholder="请输入内容" class="s_item_el_form"></el-input>
          </el-form-item>
          <el-form-item label="关联客户：" prop="client">
            <el-select v-model="form.client" filterable placeholder="请选择" class="s_item_el_form" :disabled="true">
              <el-option
                  v-for="item in client"
                  :key="item.id"
                  :label="item.company"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目来源" prop="origin">
            <el-cascader
                class="s_item_el_form"
                filterable
                expand-trigger="hover"
                :options="origin"
                v-model="form.origin"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="产品信息：" prop="client">
            <el-cascader
                expand-trigger="hover"
                :options="product"
                v-model="product_id"
                :show-all-levels="false"
                @change="orderChange">
            </el-cascader>
          </el-form-item>
          <el-button type="text" @click="orderBtn" class="item_btn">增加产品</el-button>
          <div clear="both"></div>
          <el-table :data="form.pro_info" border class="item_table" style="width: 62.5%;">
            <el-table-column prop="name" label="产品信息"></el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
              <template slot-scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index, form.pro_info)" type="text" size="small">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-form-item prop="expect_sign_time" label="预计签约时间">
            <el-date-picker
                v-model="form.expect_sign_time"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="state_all" label="项目状态：">
            <el-select v-model="form.status" clearable filterable placeholder="请选择" class="s_item_el_form">
              <el-option
                  v-for="item in state_all"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="state_all" label="项目意向：">
            <el-select v-model="form.intention" clearable filterable placeholder="请选择" class="s_item_el_form">
              <el-option
                  v-for="item in intention"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="reason_time" label="流单日期：" v-if="form.status == 9">
            <el-date-picker
                    v-model="form.reason_time"
                    type="date"
                    class="s_item_el_form"
                    placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="reason" label="流单原因：" v-if="form.status == 9">
            <el-select v-model="form.reason" clearable filterable placeholder="请选择" class="s_item_el_form">
              <el-option
                  v-for="item in reason"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="state_all" label="流单说明：" v-if="form.status == 9">
            <el-input v-model="form.reason_brief" placeholder="请填写说明" type="textarea" :rows="5" class="s_item_el_form"></el-input>
          </el-form-item>
          <el-form-item label="项目预算" prop="future_price">
            <el-input v-model="form.future_price" placeholder="￥(元)" type="number" class="s_item_el_form"></el-input>
          </el-form-item>
          <el-form-item  label="项目备注：">
            <el-input v-model="form.remark" type="textarea" :rows="5" placeholder="备注" class="s_item_el_form"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisibleF">取 消</el-button>
          <el-button type="primary" @click="confirmAdd(form)">确 定</el-button>
        </div>
      </el-dialog>
      <!--发起售前提案弹窗-->
      <el-dialog title="发起售前提案" width="500px" :show-close='false' :close-on-click-modal='false' :close-on-press-escape='false' :visible.sync="proposalDialog" :modal="false">
        <el-form ref="proposal" :model="proposal" label-width="140px">
          <el-form-item label="预计调用时间(必填)">
            <el-date-picker
                v-model="proposal.expect"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="调用类型(必填)">
            <el-select v-model="proposal.call_that" placeholder="请选择">
              <el-option
                  v-for="item in CallType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="调用说明(必填)">
            <el-input
                type="textarea"
                :rows="5"
                placeholder="请输入调用说明"
                v-model="proposal.description"
                class="s_item_form">
            </el-input>
          </el-form-item>
          <el-form-item label="附件">
            <upload @fileStatus="fileStatus"  @fileTrue="fileTrue" :success="success"></upload>
          </el-form-item>
          <el-form-item label="附件备注">
            <el-input
                placeholder="请输入附件备注"
                v-model="proposal.brife"
                type="textarea"
                :rows="5"
                class="s_item_form">
            </el-input>
          </el-form-item>
          <el-form-item style="margin-left: 90px;">
            <el-button @click="proposalDialogF">取 消</el-button>
            <el-button type="primary" @click="onSubmit">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog
          title="添加附件"
          :visible.sync="itemFile"
          :modal="false"
          width="600px"
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
					<el-button @click="itemFile = false">取 消</el-button>
					<el-button type="primary" @click="itemFileLoad">确 定</el-button>
				</span>
      </el-dialog>
      <el-dialog title="编辑共同负责人" :visible.sync="dialogFormVisible1" :modal="false" width="30%">
        <el-form :model="form">
          <el-form-item prop="partner" label="共同负责人"  class="s_client_item">
            <el-select v-model="partner" multiple   clearable filterable placeholder="请选择" style="width: 250px;" class="s_order_search">
              <el-option
                  v-for="item in persons"
                  :key="item.dd_id"
                  :label="item.nickname"
                  :value="item.dd_id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="CoinCharge">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import follow_list from '@/views/components/h_item/follow_list'
  import annexList from '@/views/components/s_customer/annexList'
  import upload from '@/views/components/s_customer/fiieDataCe'
  import contactlist from '@/views/components/w_message/consultInfo'
  import Util from '@/libs/util';
  export default {
    components: {
      follow_list,
      contactlist,
      annexList,
      upload,
    },
    data () {
      return {
        dialogFormVisible1:false,
        partner:[],       // 项目共同负责人
        data:{
          partner:[]
        },
        origin_edit: [],
        success: false,
        button_root: false,
        tabsItem: 'itemDet',
        numberShiYan: 0,
        add_manage: false,
        fileList: [],
        FlowList: false,
        reason: [],
        reasonForm: {
          sameDate: new Date(),//流单默认当天日期
          reason: '',
          reason_brief: '',
        },
        CallType:[
          {id: '1', name: '三方'},
          {id: '2', name: '电话'},
          {id: '3', name: '接待'},
          {id: '4', name: '当地陪访'},
          {id: '5', name: '异地陪访'},
          {id: '6', name: '提案'},
          {id: '7', name: '大赛'},
          {id: '8', name: '竞标'},
        ],
        // 客户详情展示的数据
        date: {
          name: '',           // 项目名称
          company: '',        // 关联客户
          status: '',         // 项目状态
          future_price: '',   // 项目预算
          remark: '',       	// 备注
          origin: '',        	// 项目来源
          salesman: '',       // 负责人
          department: '',     // 负责人的部门
          code: '',           // 项目编号
          client_id: 0,
          id: '',
          reason:'',
          intention: '',
          reason_brief:'',
          reason_time:"",     //流单日期
          expect_sign_time: '',
        },
        // 修改项目数据后台需要的参数
        form : {
          remark: '',                 // 修改备注信息
          pro_info: [],             	// 修改产品信息
          future_price: '',           // 项目预算
          status: '',                 // 项目状态
          name: '',                   // 项目名称
          id: '',                     // 项目id
          client: '',                 // 关联客户
          origin: [],                 // 项目来源
          reason_time: "",             //流单日期
          reason: '',
          reason_brief: '',
          intention: '',
          expect_sign_time: '',
        },
        product_id: [],
        product_id_num: [],
        proposal: {
          call_that: '',
          expect: '',
          description: '',
          file: [],
          brife:'',
          id: '',
        },
        formAll:{
          form: '',
          accompany: '',
          project_id: '',
          next_time: '',
          result: '',
        },
        product: [],                        // 产品信息
        itemProjectData: [],
        itemFile: false,
        formWay: [],                   		// 拜访方式选项
        client: [],                         // 关联客户数组
        state_all: [],                      // 项目状态数组
        origin: [],                         // 项目来源数组
        dialogTableVisible: false,          // 客户详情修改弹窗的显示
        dialogFormVisible: false,           // 新增跟进
        tabPosition: 'top',
        selectedOptions:'',                 // 转移项目绑定的数组值
        dialogFormItem: false,              // 转移项目弹窗的控制显示
        dd_id: '',                          // 转移项目，负责人的dd_id
        person: {
          client: '',                       // 转移项目选中负责人，绑定的值
        },
        operation: [],                      // 操作日志
        proposalDialog: false,
        stage: '',
        status: [],
        annexData: [],
        textarea: '',
        followData: [],
        file:[],
        intention:[],
        contactlist:[], //咨询列表
      }
    },
    computed:{
      fuzeman() {
        if(this.data.partner) {
          this.s_fuzeman = false;
        } else {
          this.s_fuzeman = true;
        }
        return this.s_fuzeman
      },
      persons () {
        return this.$store.state.app.person;
      }
    },
    methods: {
      //弹出共同负责人弹窗
      charge() {
        this.dialogFormVisible1 = true;
      },
      CoinCharge() {
        this.$put('crmManagement/updPartner/' + this.date.id,{partner:this.partner})
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
      //选择产品
      orderBtn () {
        // let pro_arr = this.product;
        // for(let i = 0; i < pro_arr.length; i++){
        //   for(let j = 0; j < pro_arr[i]['children'].length; j++){
        //     for(let x = 0; x < pro_arr[i]['children'][j]['children'].length; x++){
        //       if(pro_arr[i]['children'][j]['children'][x]['value'] == this.numberShiYan){
        //         if( x == 0){
        //           this.form.pro_info.push({id: pro_arr[i]['children'][j]['children'][x]['value'], name: pro_arr[i]['children'][j]['children'][x]['label']});
        //         }
        //       }
        //     }
        //   }
        // }
        let pro_arr = this.product;
        for(let i = 0; i < pro_arr.length; i++){
          for(let j = 0; j < pro_arr[i]['children'].length; j++){
            // for(let x = 0; x < pro_arr[i]['children'][j]['children'].length; x++){
              if(pro_arr[i]['children'][j]['value'] == this.numberShiYan){
                  // for (let x = 0; x < this.form.pro_info.length; x++) {

                    // if(this.numberShiYan == this.form.pro_info[x].id){
                    //   this.$message({
                    //     message: '已有此产品，请选择其他产品',
                    //     type: 'warning'
                    //   });
                    // }else{
                    if(this.isInArray(this.product_id_num,this.numberShiYan)){
                          this.$message({
                        message: '已有此产品，请选择其他产品',
                        type: 'warning'
                      });
                    }else{
                    this.product_id_num.push(this.numberShiYan)
                    this.form.pro_info.push({id: pro_arr[i]['children'][j]['value'], name: pro_arr[i]['children'][j]['label']});
                    }
                    // }
                  // }
                // if( j == 0){
                // }
              }
            // }
          }
        }
        this.product_id = [];
        this.numberShiYan = '';
      },
      isInArray(arr,value){
        for(var i = 0; i < arr.length; i++){
            if(value === arr[i]){
            return true;
            }
        }
        return false;
      },
      fileTrue(data){
        this.success = data;
      },
      // 取消项目详情的修改
      dialogTableVisibleF () {
        this.dialogTableVisible = false;
        this.clientAdd();
      },
      orderChange (value) {
        this.numberShiYan = value[1];
      },
      // 文件上传
      fileStatus(data) {
        this.proposal.file = data;
        this.file = data;
      },
      // 打开转移项目的弹窗
      toggleSelectionAll(){
        this.dialogFormItem = true;
      },
      // 打开新增跟进的弹窗
      dialogFollow(){
        this.dialogFormVisible = true;
      },
      // 负责人的级联选择
      handleChange(value) {
        this.dd_id = value;
      },
      // 发起售前提案申请
      proposalApplication () {
        this.proposalDialog = true;
      },
      // 项目附件窗口
      newAnnex () {
        this.itemFile = true;
      },
      itemFileLoad() {
        this.$post( 'crmManagement/project/attachment',{id: this.$route.params.id,file: this.file, brife: this.textarea})
          .then( (data) => {
            if(data.code){
              this.$message({
                message: '上传成功',
                type: 'success'
              });
              this.success = true;
              this.itemFile = false;
              this.textarea = '';
              this.clientAdd();
            } else {

            }
          })
          .catch( () => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      // 跳转客户
      clientOpen () {
        this.$router.push({
          name: 'clientDetail',
          params: {
            id: this.date.client_id
          }
        });
      },
      // 跳转新增订单
      addOrder () {
        this.$router.push({
          name: 'addOrder',
          params: {
            id : this.date.id,
            trench: this.form.origin,
            name: this.form.name
          }
        });
      },
      // 跳转工单
      handleClick (row) {
        this.$router.push({
          name: 'workInfo',
          query: {
            manage_id: row.manage_id,
            work_type: 1
          }
        })
      },
      deleteRow ( index, rows) {
        rows.splice(index, 1);
      },
      // 删除项目附件
      annex (data) {
        this.$delete ( 'crmManagement/project/attachment/del/' + data)
          .then ( (data) => {
            if(data.code){
              this.$message({
                message: data.errorMsg,
                type: 'success'
              });
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch ( (error) => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      // 审批成功
      followNew(data) {
        if(data) {
          this.clientAdd();
        }
      },
      FlowListF() {
        this.FlowList = false;
        this.clientAdd();
      },
      // 流单确定
      FlowListT() {
        if(!this.reasonForm.sameDate){
          this.$message({
            message: '请选择流单日期',
            type: 'error'
          });
        } else if(!this.reasonForm.reason && this.reasonForm.reason != 0){
          this.$message({
            message: '请选择流单原因',
            type: 'warning'
          });
        } else if (!this.reasonForm.reason_brief){
          this.$message({
            message: '请选择流单说明',
            type: 'warning'
          });
        } else {
          this.reasonForm.sameDate = this.reasonForm.sameDate.getFullYear() + "-" + (this.reasonForm.sameDate.getMonth()+1) + "-" + this.reasonForm.sameDate.getDate();
          this.$get( 'crmManagement/item/editState',{id: this.form.id, stage: this.stage, reason: this.reasonForm.reason,reason_brief: this.reasonForm.reason_brief,reason_time: this.reasonForm.sameDate})
            .then ( (data) => {
              if(data.code){
                this.$message({
                  message: data.errorMsg,
                  type: 'success'
                });
                this.FlowList = false;
                this.reasonForm = {};
                this.clientAdd();
              } else {
                this.$message.error(data.errorMsg);
              }
            })
            .catch ( (error) => {
              this.$message.error('服务器错误，请稍后重试');
            })
        }
      },
      // 取消发起售前调用
      proposalDialogF () {
        this.proposalDialog = false;
        this.$router.go(0);
      },
      // 项目状态改变
      stageChange () {
        if(this.stage == 9){
          this.FlowList = true;
        } else {
          this.$get( 'crmManagement/item/editState',{id: this.form.id, stage: this.stage})
            .then ( (data) => {
              if(data.code){
                this.$message({
                  message: data.errorMsg,
                  type: 'success'
                });
                this.clientAdd();
              } else {
                this.$message.error(data.errorMsg);
              }
            })
            .catch (() => {
              this.$message.error('服务器错误，请稍后重试');
            })
        }
      },
      formTrue () {
        this.$post( 'crmManagement/item/addUp', this.formAll)
          .then( (data) => {
            if(data.code){
              this.$message({
                type: 'success',
                message: '添加成功'
              });
              this.dialogFormVisible = false;
              this.tabsItem = 'itemFollow';
              this.clientAdd();
              this.formAll = {};
              this.formAll.project_id = this.form.id;
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      // 确定转移项目数据
      transferTrue(){
        this.$post( 'crmManagement/project/transfer', {project_id: this.form.id, trans_dd_id: this.dd_id})
          .then( (data) => {
            if(data.code){
              this.$message({
                type: 'success',
                message: '转移成功成功!'
              });
              this.selectedOptions = '';
              this.dialogFormItem = false;
              this.$router.push({
                name: 'itemList'
              })
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
      // 打开修改项目信息的弹窗
      dialogOpen () {
        this.clientModify();
        this.dialogTableVisible = true;
      },
      // 保存修改的项目信息
      confirmAdd () {
        this.$post( 'crmManagement/item/edit',this.form)
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
      },
      // 项目详情的所有数据请求
      clientAdd () {
        this.$get( 'crmManagement/item/detail',{id:this.$route.params.id})
          .then( (data) => {
            let item = data.content.project;
            this.date.id = item.id;
            this.data.partner = item.partner;
            this.partner = item.partner_edit ? item.partner_edit : [];      //共同负责人的默认值
            this.date.name = item.name;                                     // 项目名称
            this.date.company = item.client.name;                           // 关联客户
            this.date.client_id = item.client.id;
            this.date.status = item.status.name;                            // 项目状态
            this.stage = item.status.id;
            this.date.origin = item.origin;
            this.date.reason = item.reason.name;
            this.date.intention = item.intention.name;
            this.date.reason_brief = item.reason_brief;
            this.date.reason_time = item.reason_time;                       //流单日期
            this.date.future_price = item.future_price;                     // 项目预算
            this.date.remark = item.remark;                                 // 备注
            this.date.salesman = item.salesman;                             // 负责人
            this.date.code = item.code;                                     // 项目编号
            this.date.department = item.department;                         // 部门
            this.date.expect_sign_time = item.expect_sign_time;
            this.form.id = item.id;
            this.formAll.project_id = item.id;
            this.form.pro_info = item.product;
            if(this.form.pro_info.length != 0){
              for (let i = 0; i < this.form.pro_info.length; i++) {
                this.product_id_num.push(parseInt(this.form.pro_info[i].id));
              }
            }
            this.form.remark = item.remark;
            this.form.future_price = item.future_price;
            this.form.status = item.status.id;
            this.form.name = item.name;
            this.form.client = item.client.name;
            this.form.reason_time = item.reason_time;
            this.form.reason = item.reason.id;
            this.form.reason_brief = item.reason_brief;
            this.form.intention = item.intention.id;
            this.form.expect_sign_time = item.expect_sign_time;
            this.form.origin = item.origin_edit;
            this.status = data.content.state_all;
            this.intention = data.content.intention;
            this.annexData = data.content.attachment;
            this.followData = data.content.follow_list;
            this.add_manage = data.content.add_manage;
            this.product = data.content.product;
            this.reason = data.content.reason;
            this.button_root = data.content.button_root;
            this.formWay = data.content.form_all;
            console.log(this.formWay)
            this.contactlist = data.content.consult_info;
            this.operation = data.content.log;                            // 操作记录
          })
          .catch( () => {})
      },
      // 修改项目
      clientModify () {
        this.$get( 'crmManagement/item/detail',{id:this.$route.params.id})
          .then( (data) => {
            let itemshow = data.content;
            this.state_all = itemshow.state_all;             // 项目状态数组
            this.client = itemshow.client;                   // 关联客户数组
            this.origin = Util.obj2Arr(itemshow.origin);     // 项目来源数组
          })
          .catch( (error) => {

          })
      },
      // 发起售前调用
      onSubmit() {
        this.proposal.id = this.date.id;
        if(!this.proposal.expect){
            this.$message({
              message: '请选择预计调用时间',
              type: 'warning'
            });
        }else if(!this.proposal.call_that){
            this.$message({
              message: '请选择调用类型',
              type: 'warning'
            });
        }else if(!this.proposal.description){
            this.$message({
              message: '调用说明必填且不少于5个字',
              type: 'warning'
            });
        }else if((this.proposal.call_that == '1' || this.proposal.call_that == '6' || this.proposal.call_that == '7' || this.proposal.call_that == '8') && this.proposal.file.length == 0){
            this.$message({
                message: '附件必填，请上传附件信息',
                type: 'warning'
              });
        }else{
           this.$post( 'managePresale/manageProject',this.proposal)
          .then( (data) => {
            if(data.code){
              this.$message({
                message: data.errorMsg,
                type: 'success'
              });
              this.proposal = {};
              this.proposalDialog = false;
              this.$store.commit('removeTag','itemDetail');
              this.$store.commit('closePage','itemDetail');
              this.$router.push({
                name: 'workInfo',
                query: {
                  manage_id: data.content.manage_id,
                  // task_id: data.content.task_id
                  work_type:1
                }
              })
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch( () => {
            this.$message.error('服务器错误，请稍后重试');
          })
        }
      },
      projectManage () {
        this.$get( 'managePresale/projectManage',{id: this.$route.params.id})
          .then ( (data) => {
            if(data.code){
              this.itemProjectData = data.content
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch (() => {
          })
      }
    },
    created(){
      // this.proposal.id = this.$route.params.id;
      this.$store.dispatch('dept',{});
      this.projectManage();
      this.clientAdd();
    }
  }
</script>

<style lang="less">
  .itemDetails{
    .el-card{
      margin-bottom: 15px;
    }
    .item_table {
      margin-left: 23%;
      margin-bottom: 30px;
    }
    .item_btn{
      margin-left: 23%;
    }
    .s_details_title {
      float: left;
      font-size: 20px;
    }
    .el-form-item__label {
      margin-left: 30px;
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
    .s_fuzeman {
      margin-top: 10px !important;
    }
    .s_details_btn {
      float: left;
      margin-top: 10px;

      margin-bottom: 20px;
    }
    .s_item_new {
      float: left;
      width: 400px;
    }
    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }
    .clearfix:after {
      clear: both
    }
    .s_details_basic_intermediate, .s_details_basic_title, .s_details_basic_bottom , .s_details_basic_bottom_btn{
      width: 100%;
      height: 100px;
    }
    .s_details_basic_title div, .s_details_basic_intermediate div, .s_details_basic_bottom div{
      float: left;
    }
    .s_details_basic_name_btn {
      width: 32.5%;
      color: #999999;
      font-size: 14px;
      float: left;
    }
    .s_details_basic_name {
      color: #999999;
      font-size: 14px;
      width: 32.5%;
    }
    .s_details_basic_name_btn span {
      color: #333333;
      font-size: 16px;
      margin-left: 14px;
    }
    .s_details_basic_name span,{
      color: #333333;
      font-size: 16px;
      margin-left: 14px;
    }
    .box-card {
      margin-top: 15px !important;
    }
    .h_new_tion_contents {
      width: 90%;
    }
    .s_item_form{
      width: 220px;
    }
    .s_item_status {
      width: 150px;
      height: 70px;
      float: right;
      margin-right: 100px;
    }
    .s_item_status p {
      font-size: 16px;
    }
    .s_item_el_form {
      width: 350px;
    }
    .el-icon-edit:hover {
      cursor: pointer;
    }
    .s_fuzeman {
      margin-top: 15px !important;
    }
    .el-step {
      flex-basis: 80px !important;
      height: 80px;
    }
  }
</style>
