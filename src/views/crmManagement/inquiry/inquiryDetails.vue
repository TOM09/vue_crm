<!-- 咨询详情页面 -->
<template>
  <div class="inquiryDetails">
    <el-card>

      <div class="x_details_company">

        <div class="x_number">
          <p>咨询编号{{detail.code}}</p>
          <p v-if="detail.nickname">
            <span>负责人：</span>
            <el-popover trigger="hover" placement="top" :content="department">
              <span slot="reference">{{ detail.nickname }}</span>
            </el-popover>
          </p>
          <p v-if="detail.sale_manager_text">
            <span>销售主管：</span>
            <el-popover trigger="hover" placement="top" :content="sale_manager">
              <span slot="reference">{{ detail.sale_manager_text }}</span>
            </el-popover>
          </p>
          <p v-if="detail.sale_text">
            <span>销售负责人：</span>
            <el-popover trigger="hover" placement="top" :content="saleDept">
              <span slot="reference">{{ detail.sale_text }}</span>
            </el-popover>
          </p>
        </div>
        <div class="x_button">
          <el-button @click="dialogFollow(item)" type="primary" v-for="(item,index) in button" :key="index">{{item.name}}</el-button>
        </div>
        <div class="status">
          <p>状态</p>
          <p>{{detail.status_text}}</p>
        </div>
      </div>
    </el-card>
    <el-card>
      <el-tabs  :tab-position="'top'" v-model="activeName" @tab-click="tabsClick">
        <el-tab-pane label="咨询信息" name="tabsItem">
          <el-card >
            <div slot="header" class="s_new_title">
              <span>联系信息</span>
              <el-button v-if="edit_button" @click="editInquiry()" icon="el-icon-edit" type="text"></el-button>
            </div>
            <div class="x_details">
              <div class="x_details_child">
                <p><span>●</span>咨询日期</p>
                <p>{{detail.ask_time}}</p>
              </div>
              <div class="x_details_child">
                <p><span>●</span>咨询类目</p>
                <p>{{detail.pro_id_text}}</p>
              </div>
              <div class="x_details_child">
                <p><span>●</span>客户满意度</p>
                <p>{{detail.client_Intent_text}}</p>
              </div>
              <div class="x_details_child">
                <p><span>●</span>预算</p>
                <p>{{detail.future_price}}</p>
              </div>
              <div class="x_details_child">
                <p><span>●</span>来源</p>
                <p>{{detail.trench_text}}</p>
              </div>
              <div class="x_details_child">
                <p><span>●</span>是否有效</p>
                <p>{{detail.is_valid_text}}</p>
              </div>
              <div class="x_details_child">
                <p><span>●</span>是否可跟进</p>
                <p>{{detail.is_follow_text}}</p>
              </div>
              <div class="x_details_child">
                <p><span>●</span>咨询方式</p>
                <p>{{detail.ask_method_text}}</p>
              </div>
              <div class="x_details_child">
                <p><span>●</span>无效分类</p>
                <p>{{detail.one_invalid_type_text ? detail.one_invalid_type_text : '--' }}</p>
              </div>
              <div class="x_details_child">
                <p><span>●</span>留言页面</p>
                <p>{{detail.message_page}}</p>
              </div>
              <div class="x_details_child">
                <p><span>●</span>跟进反馈</p>
                <p>{{detail.breif}}</p>
              </div>
            </div>
          </el-card>
          <!-- 客服处理信息 -->
          <clientInformation :end_info="end_info" ></clientInformation>
          <!-- 留言信息 -->
          <messageInfo :LeaveWords_info="LeaveWords_info"></messageInfo>
          <el-card>
            <div slot="header" class="s_new_title">操作日志</div>
            <el-steps direction="vertical" :active="1">
              <el-step
                  v-for="item in log_info"
                  v-bind:key="item.id"
                  :title="item.title"
                  :description="item.content"
              >
              </el-step>
            </el-steps>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="客户信息" name="tabsClient">
          <clientInfo></clientInfo>
        </el-tab-pane>
        <el-tab-pane label="销售跟进信息" name="tabsFollow">
          <sfuInfo ref="profile"></sfuInfo>
        </el-tab-pane>
      </el-tabs>
      <el-dialog title="详情修改" :visible.sync="dialogTableVisible" :modal="false" width="1000px">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-position="top">
          <el-form-item label="咨询日期"  clearable prop="ask_time" class="inquiryLeft">
            <el-date-picker
                v-model="ruleForm.ask_time"
                class="optionWidth"
                type="datetime"
                placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="咨询类目"  prop="pro_id" class="inquiryLeft">
            <el-cascader
                class="optionWidth"
                expand-trigger="click"
                filterable
                clearable
                :options="product"
                v-model="ruleForm.pro_id">
            </el-cascader>
          </el-form-item>
          <el-form-item prop="client_Intent" class="inquiryLeft" label="客户意向度">
            <el-select v-model="ruleForm.client_Intent" filterable	clearable placeholder="请选择活动区域" class="optionWidth">
              <el-option
                  v-for="item in inquiry_show.client_Intent"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预算" prop="future_price" class="inquiryLeft">
            <el-input v-model="ruleForm.future_price" class="optionWidth"></el-input>
          </el-form-item>
          <el-form-item label="咨询来源" prop="customer_source" class="inquiryLeft">
            <el-cascader
                class="optionWidth"
                expand-trigger="click"
                filterable
                clearable
                :options="trench"
                v-model="ruleForm.customer_source"
                @change="changeSource" >
            </el-cascader>
          </el-form-item>
          <el-form-item prop="ask_method" label="咨询方式" class="inquiryLeft">
            <el-select v-model="ruleForm.ask_method" :disabled="judge" placeholder="请选择" class="optionWidth">
              <el-option
                  v-for="item in methodsr"
                  :key="item.cost_type"
                  :label="item.label"
                  :value="item.cost_type">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否有效" prop="is_valid" class="inquiryLeft">
            <el-select v-model="ruleForm.is_valid" placeholder="请选择" @change="changeValid" class="optionWidth">
              <el-option
                  v-for="item in isItValid"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="无效分类" prop="invalid_type" class="inquiryLeft">
            <el-select v-model="ruleForm.invalid_type" placeholder="请选择" :disabled="classification" class="optionWidth">
              <el-option
                  v-for="item in inquiry_show.invalid_type"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否可跟进" prop="is_follow" class="inquiryLeft">
            <el-select v-model="ruleForm.is_follow" placeholder="请选择" class="optionWidth">
              <el-option
                  v-for="item in isFollow"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <div style="clear: both"></div>
          <el-form-item label="留言页面">
            <el-input type="textarea" v-model="ruleForm.message_page" style="width: 50%"></el-input>
          </el-form-item>
          <el-form-item prop="breif" label="跟进反馈">
            <el-input type="textarea" v-model="ruleForm.breif" style="width: 50%"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="editForm('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog  :title="flowTitle" :visible.sync="ProcessVisible" :modal="false" width="600px">
        <el-form :model="formAll" :rules="dialogRules" ref="formAll" label-width="110px">
          <!-- 结束咨询 -->
          <span v-if="is_flow === 1">
						<el-form-item prop="follow_count" label="跟进次数">
							<el-input v-model="formAll.follow_count" class="s_item_form" placeholder="请输入" ></el-input>
						</el-form-item>
						<el-form-item prop="end_reason" label="结束原因">
							<el-select v-model="formAll.end_reason" class="s_item_form" placeholder="请选择" >
								<el-option
                    v-for="item in inquiry_show.end_reason"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
								</el-option>
							</el-select>
					  </el-form-item>
					</span>
          <!-- 转销售主管 -->
          <span v-if="is_flow === 2">
            <el-form-item  label="公司：">
              <el-select v-model="sale_manager_company" @change="handleCompany" placeholder="请选择" filterable clearable>
                <el-option
                  v-for="item in company_info"
                  :key="item.company_id"
                  :label="item.name"
                  :value="item.company_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item  prop="sale_manager_id" label="销售主管">
              <el-select filterable clearable  v-model="formAll.sale_manager_id"  placeholder="请选择" >
                <el-option
                  v-for="item in person"
                  :key="item.dd_id"
                  :label="item.nickname"
                  :value="item.dd_id">
                </el-option>
              </el-select>
            </el-form-item>
          </span>
          <!-- 转销售 -->
          <span v-if="is_flow === 3">
            <el-form-item  label="公司：">
              <el-select v-model="soleCompany" @change="handleCompany" placeholder="请选择" filterable clearable>
                <el-option
                    v-for="item in company_info"
                    :key="item.company_id"
                    :label="item.name"
                    :value="item.company_id">
                </el-option>
              </el-select>
            </el-form-item>
						<el-form-item prop="sale_id" label="销售负责人">
							<el-select filterable clearable v-model="formAll.sale_id"  placeholder="请选择" >
								<el-option
                    v-for="item in person"
                    :key="item.dd_id"
                    :label="item.nickname"
                    :value="item.dd_id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="备注" prop="brief">
							<el-input
                  class="s_item_form"
                  type="textarea"
                  :rows="5"
                  placeholder="请输入备注"
                  v-model="formAll.brief">
							</el-input>
						</el-form-item>
					</span>
          <!-- 派单 -->
          <span v-if="is_flow === 4">
						<el-form-item prop="sale_id" label="派单销售">
							<el-select filterable clearable v-model="formAll.sale_id" class="s_item_form" placeholder="请选择" >
								<el-option
                    v-for="item in person"
                    :key="item.dd_id"
                    :label="item.nickname"
                    :value="item.dd_id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="备注" prop="brief">
							<el-input
                  class="s_item_form"
                  type="textarea"
                  :rows="5"
                  placeholder="请输入备注"
                  v-model="formAll.brief">
							</el-input>
						</el-form-item>
					</span>
          <!-- 退回咨询 -->
          <el-form-item prop="back_reason" v-if="is_flow === 5" label="退回原因">
            <el-input
                class="s_item_form"
                type="textarea"
                :rows="5"
                placeholder="请输入备注"
                v-model="formAll.back_reason">
            </el-input>
          </el-form-item>
          <!-- 跟进 -->
          <span v-if="is_flow === 6">
            	<el-form-item label="客户名称" prop="company">
							<el-input v-model="formAll.company" placeholder="请输入客户名称" class="s_item_form">
							</el-input>
						</el-form-item>
						<el-form-item label="项目名称" prop="name">
							<el-input v-model="formAll.name" placeholder="请输入项目名称" class="s_item_form">
							</el-input>
						</el-form-item>
            <!--<el-form-item label="关联客户(必填)" prop="client_id">
                <el-select v-model="formAll.client_id" @change="clientChange" filterable placeholder="请选择" class="s_additem_form">
                    <el-option
                        v-for="item in selectCustomers"
                        :key="item.id"
                        :label="item.company"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>-->

						<el-form-item label="项目意向" prop="origin">
							<el-select v-model="formAll.intention" filterable placeholder="请选择项目状态" class="s_item_form">
								<el-option
                                    v-for="item in intention"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="项目状态" prop="stage">
							<el-select v-model="formAll.stage" @change="itemStatus" filterable placeholder="请选择项目状态" class="s_item_form">
								<el-option
                                    v-for="item in itemState"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id.toString()">
								</el-option>
							</el-select>
						</el-form-item>
                        <el-form-item label="流单日期" v-if="this.formAll.stage == 9" prop="reason_time">
							<el-date-picker
                                    v-model="formAll.reason_time"
                                    type="date"
                                    class="s_item_form"
                                    placeholder="选择日期">
                            </el-date-picker>
						</el-form-item>
						<el-form-item label="流单原因" v-if="this.formAll.stage == 9" prop="reason">
							<el-select v-model="formAll.reason"  filterable placeholder="请选择流单原因" class="s_item_form">
								<el-option
                                    v-for="item in reason"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="流单说明" v-if="this.formAll.stage == 9">
							<el-input
                              class="s_item_form"
                              type="textarea"
                              :rows="3"
                              placeholder="请输入内容"
                              v-model="formAll.reason_brief">
							</el-input>
						</el-form-item>
						<el-form-item label="项目来源" prop="origin">
							<el-cascader
                              class="s_item_form"
                              clearable
                              filterable
                              expand-trigger="hover"
                              :options="trench"
                              v-model="formAll.origin">
							</el-cascader>
						</el-form-item>
						<el-form-item label="项目预算" prop="future_price" >
							<el-input v-model="formAll.future_price" placeholder="￥(元)" type="number" class="s_item_form" @change="priceRuleFun()"></el-input>
						</el-form-item>
						<el-form-item v-for="(domain, index) in formAll.domains"
              label="选择产品"
              :key="domain.key"
              :prop="'domains.' + index + '.value'"
              :rules="{required: true, message: '域名不能为空', trigger: 'change'}">
							<el-cascader
                expand-trigger="hover"
                v-model="domain.value"
                :show-all-levels="false"
                placeholder="请选择"
                :options="product"
                filterable
                @change="handleChangeproduct"
                class="s_item_form">
							</el-cascader>
							<el-button @click.prevent="removeDomain(domain)">删除</el-button>
						</el-form-item>
						<el-form-item>
							<el-button @click="addDomain">新增产品</el-button>
						</el-form-item>

						<el-form-item label="预计签约时间" prop="expect_sign_time" >
							<el-date-picker
                  class="s_item_form"
                  v-model="formAll.expect_sign_time"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd">
							</el-date-picker>
						</el-form-item>

					<el-form-item label="跟进方式" prop="form" class=' is-required'
          :rules="[{ required: true, message: '请选择跟进方式',trigger:'change'}]"
          >
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
          
          <el-form-item label="下次拜访时间" class='is-required'
          :rules="[{required: true, message: '请选择下次拜访时间',trigger:'change'}]"
          >
            <el-date-picker
                class="s_item_form"
                v-model="formAll.next_time"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>

						<el-form-item label="跟进信息" prop="remark" class='is-required'
            :rules="[{required: true, message: '请输入跟进信息',trigger:'blur'}]"
            >
							<el-input v-model="formAll.remark" type="textarea" placeholder="请输入项目备注信息" class="s_item_form"></el-input>
						</el-form-item>
            	<el-form-item label="附件" >
							<upload @fileStatus="fileStatus"  @fileTrue="fileTrue" :success="success"></upload>
						</el-form-item>
					</span>
          <!-- 转单销售 -->
          <span v-if="is_flow === 7">
						<el-form-item prop="sale_id" label="转单销售">
							<el-select filterable clearable v-model="formAll.sale_id" class="s_item_form" placeholder="请选择" >
								<el-option
                    v-for="item in person"
                    :key="item.dd_id"
                    :label="item.nickname"
                    :value="item.dd_id">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="备注" prop="brief">
							<el-input
                  class="s_item_form"
                  type="textarea"
                  :rows="5"
                  placeholder="请输入备注"
                  v-model="formAll.brief">
							</el-input>
						</el-form-item>
					</span>
          <!-- 拒绝 -->
          <el-form-item prop="refuse_reason" v-if="is_flow === 8" label="拒绝原因">
            <el-input
                class="s_item_form"
                type="textarea"
                :rows="5"
                placeholder="请输入备注"
                v-model="formAll.refuse_reason">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="ProcessVisible = false">取 消</el-button>
          <el-button type="primary" @click="endConsult('formAll')">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import clientInformation from '@/views/components/inquiry/clientInformation';
  import clientInfo from '@/views/components/inquiry/clientInfo';
  import messageInfo from '@/views/components/inquiry/messageInfo';
  import sfuInfo from '@/views/components/inquiry/sfuInfo';
  import upload from '../.././components/s_customer/fiieDataCe';
  import Util from '@/libs/util';
  import Cookies from 'js-cookie'
  export default {
    name:'inquiryDetails',
    components:{
      clientInformation, //客服处理信息组件
      messageInfo,   //留言列表组件
      clientInfo,    //客户信息组件
      sfuInfo,       //销售跟进信息组件
      upload,        //oss
      Util
    },
    data () {
      return {
        id:this.$route.params.id,
        dialogTableVisible:false,
        ProcessVisible:false,
        activeName:'tabsItem',
        clientShow:false,
        formWay:[
          {
            id: 0,
            name: "上门"
          },
          {
            id: 1,
            name: "电话"
          },
          {
            id: 2,
            name: "网络"
          }
        ],
        dialogOpen:false,
        judge:true, //咨询方式是否禁用
        classification:true,
        search:{}, //咨询初始化数据
        trench:[],
        product:[],
        client_Intent_text:'',
        inquiry_show:{},
        isItValid:[{
          value: 1,
          label: '是'
        }, {
          value: 2,
          label: '否'
        }],
        isFollow:[{
          value: 1,
          label: '是'
        }, {
          value: 2,
          label: '否'
        }],
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
        detail:{
          code:'',
          nickname_dept:'',
          nickname:'',
          sale_manager_dept:'',
          sale_manager_text:'',
          sale_dept:'',
          sale_text:''
        },
        edit_button:'',
        button:[],
        ruleForm:{
          id:'',
          ask_time:'',
          pro_id:[],
          client_Intent:'',
          future_price:'',
          customer_source:[], //咨询来源 前后台字段不一样
          is_valid:'',
          is_follow:'',
          ask_method:'',
          invalid_type:'',
          message_page:'',
          breif:'',
        },
        formAll:{
          next_time:'',
          form:'',
          follow_count:'', //跟进次数
          end_reason:'',  //结束原因
          sale_manager_id:'',
          sale_id:'',
          brief:'',
          back_reason:'',
          company:'',
          //新增项目(跟进)
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
          reason_time: new Date().getFullYear() + "-" + (new Date().getMonth()+1) + "-" + new Date().getDate(),//流单默认当天日期
          reason:'',
          reason_brief:'',
          consult_id:''
        },

        end_info:[],
        LeaveWords_info:[],
        log_info:[],
        rules: {
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
          ask_method:[],
          invalid_type:[],
          breif:[
            { required: true, message: '请输入', trigger: 'blur' },
          ]
        },
        dialogRules:{
          follow_count:[
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          end_reason:[
            { required: true, message: '请选择', trigger: 'change' }
          ],
          sale_manager_id:[
            { required: true, message: '请选择', trigger: 'change' }
          ],
          sale_id:[
            { required: true, message: '请选择', trigger: 'change' }
          ],
          back_reason:[
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          refuse_reason:[
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          //跟进相关验证
          company:[
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          name:[
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          origin:[
            { required: true, message: '请选择', trigger: 'change' }
          ],
          intention:[
            { required: true, message: '请选择', trigger: 'change' }
          ],
          stage:[
            { required: true, message: '请选择', trigger: 'change' }
          ],
          future_price:[
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          domains:[
            { required: true, message: '请选择', trigger: 'change' }
          ],
          reason:[], //流弹原因
        },
        dept:'',
        sale_manager_dept:'',
        sale_dept:'',
        is_flow:false, // 流程判断
        flowTitle:'', //流程提示文字
        client_id:'', // 客户id

        //新建项目初始化数据
        intention:[],
        itemState:[],
        shop: [],
        reason:[],
        success: false,
        company: {
          company_id: '',
          dept: ''
        },
        soleCompany: JSON.parse(Cookies.get('company_id')),
        sale_manager_company: JSON.parse(Cookies.get('company_id'))
      }
    },
    computed:{
      department () {
        this.dept = this.detail.nickname_dept + this.detail.nickname;
        return this.dept;
      },
      sale_manager () {
        this.sale_manager_dept = this.detail.sale_manager_dept + this.detail.sale_manager_text;
        return this.sale_manager_dept;
      },
      saleDept () {
        this.sale_dept = this.detail.sale_dept + this.detail.sale_text;
        return this.sale_dept;
      },
      company_info () {
        return this.$store.state.app.company_info;
      },
      person () {
        return this.$store.state.app.commonPerson;
      }
    },
    methods:{
      handleCompany (val) {
        this.company.company_id = val;
        this.$store.dispatch('dept', this.company);
      },
      tabsClick(tab){
        this.activeName = tab.name;
      },
      consultDetail () {
        this.$get('consult/clientInfo',{id:this.$route.params.id})
      .then((data) => {
        if(data.code) {
          this.formAll.company = data.content.company;          
        }else {
          this.$message({
            type:'warning',
            message:data.errorMsg
          })
        }
      })
      .catch(() => {});

        this.$get( 'consult/detail',{id:this.$route.params.id})
          .then( (data) => {
            if(data.code) {
              let obj = data.content.consult_info;
              this.detail = obj;
              this.client_Intent_text = obj.client_Intent.name;
              this.edit_button = data.content.edit_button;
              this.button = data.content.button;
              this.pro_id_text = obj.pro_id_text;
              this.end_info = data.content.end_info;
              this.LeaveWords_info = data.content.LeaveWords_info;
              this.log_info = data.content.log_info;
              this.formAll.client_id = obj.client_id;
              this.formAll.consult_id = obj.id;
              this.formAll.origin = obj.trench;
              this.formAll.future_price = obj.future_price;
              this.ruleForm.id = obj.id;
              this.ruleForm.ask_time = obj.ask_time;
              this.ruleForm.pro_id = obj.pro_id.map(Number);
              this.formAll.domains[0].value = this.ruleForm.pro_id;
              this.ruleForm.client_Intent = obj.client_Intent;
              this.ruleForm.future_price = obj.future_price;
              this.ruleForm.customer_source = obj.trench;
              if (obj.trench[0] == 1) {
                this.judge = false;
                this.methodsr = this.options
                this.rules.ask_method = [{
                  required: true, message: '请选择', trigger: 'change'
                }];
                this.ruleForm.ask_method = obj.ask_method;
              } else if (obj.trench[0] === 4) {
                this.judge = false;
                this.methodsr = this.line;
                this.rules.ask_method = [{
                  required: true, message: '请选择', trigger: 'change'
                }];
                this.ruleForm.ask_method = obj.ask_method;
              } else if (obj.trench[0] === 5) {
                this.judge = false;
                this.methodsr = this.linen;
                this.rules.ask_method = [{
                  required: true, message: '请选择', trigger: 'change'
                }];
                this.ruleForm.ask_method = obj.ask_method;
              } else if (obj.trench[0] === 6) {
                  this.judge = false;
                  this.methodsr = this.hm;
                  this.rules.ask_method = [{
                      required: true, message: '请选择', trigger: 'change'
                  }];
                  this.ruleForm.ask_method = obj.ask_method;
              } else {
                this.judge = true;
                this.rules.ask_method = [];
                this.ruleForm.ask_method = '';
              }
              this.ruleForm.is_valid = obj.is_valid;
              if (obj.is_valid == 2) {
                this.classification = false;
                this.rules.invalid_type = [{required: true, message: '请选择', trigger: 'change'}]
              } else {
                this.classification = true;
                this.rules.invalid_type = [];
              }
              this.ruleForm.is_follow = obj.is_follow;
              this.ruleForm.invalid_type = obj.one_invalid_type.id;
              this.ruleForm.message_page = obj.message_page;
              this.ruleForm.breif = obj.breif;
            }else {
              this.$message({
                type:'warning',
                message:data.errorMsg
              });
              this.$store.commit('removeTag','inquiryDetail');
              this.$store.commit('closePage','inquiryDetail');
              this.$router.push({name: 'inquiryList'})
            }
          })
          .catch(() => {})
      },
      //编辑弹窗
      editInquiry () {
        this.dialogTableVisible = true;
      },
      //提交编辑
      editForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$post('consult/edit',this.ruleForm)
              .then((data) => {
                if(data.code) {
                  this.dialogTableVisible = false;
                  this.$message({
                    message: data.errorMsg,
                    type: 'success'
                  });
                  this.$refs[formName].resetFields();
                  this.consultDetail();
                } else {
                  this.$message.error(data.errorMsg);
                }
              })
              .catch(() => {
              })
          } else {
            return false;
          }
        });
      },
      //切换咨询方式
      changeSource (val) {
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
        } else if (val[0] === 5) {
          this.judge = false;
          this.methodsr = this.linen;
          this.rules.ask_method = [{
            required: true, message: '请选择', trigger: 'change'
          }];
        } else if (val[0] === 6) {
            this.judge = false;
            this.methodsr = this.hm;
            this.rules.ask_method = [{
                required: true, message: '请选择', trigger: 'change'
            }];
        } else {
          this.judge = true;
          this.rules.ask_method = [];
          this.ruleForm.ask_method = '';
        }
      },
      changeValid (val) {
        if(val == 2) {
          this.classification = false;
          this.rules.invalid_type = [{ required: true, message: '请选择', trigger: 'change' }]
        }else {
          this.classification = true;
          this.rules.invalid_type = [];
          this.ruleForm.invalid_type = '';
        }
      },
      dialogFollow (item) {
        this.formAll.id = this.ruleForm.id;
        this.formAll.button = item.id;
        this.formAll.button_text = item.name;
        this.is_flow = item.id;
        switch(item.id){
          case 1:
            this.flowTitle = '结束咨询';
            break;
          case 2:
            this.flowTitle = '转销售主管';
            break;
          case 3:
            this.flowTitle = '转销售';
            break;
          case 4:
            this.flowTitle = '派单';
            break;
          case 5:
            this.flowTitle = '退回咨询';
            break;
          case 6:
            this.flowTitle = '跟进';
            this.addItem();
            this.formAll.product_id = [];
            this.formAll.product_id.push(this.formAll.domains[0].value[1]);
            break;
          case 7:
            this.flowTitle = '转单';
            break;
          case 8:
            this.flowTitle = '拒绝';
            break;
        }
        this.ProcessVisible = true;
      },
      //跟进相关函数处理

      //选择客户自动匹配项目来源
      clientChange (val) {
        this.$get('getCliTrench/' + val)
          .then((data) => {
            this.formAll.origin = data;
          })
          .catch(() => {})
      },
      //预算
      priceRuleFun () {
        if(this.formAll.future_price < 0){
          this.$message.error('项目预算输入错误');
          this.formAll.future_price = "";
        }
      },
      //产品处理函数
      handleChangeproduct (value) {
        if(value[value.length-1]){
          this.formAll.product_id.push(value[value.length-1]);
        } else {
          this.formAll.product_id.splice(0,1);
        }
      },
      //删除产品
      removeDomain (item) {
        let index = this.formAll.domains.indexOf(item);
        if (index !== -1) {
          this.formAll.domains.splice(index, 1);
          this.formAll.product_id.splice(index, 1);
        }
      },
      //新增产品
      addDomain () {
        this.formAll.domains.push({
          value: [],
          key: Date.now(),
        });
      },
      //项目状态为流单则 流单原因必填
      itemStatus (val) {
        if (val == 9) {
          this.dialogRules.reason = [{ required: true, message: '请选择', trigger: 'change' }]
        }
      },
      fileStatus (data) {
        this.formAll.file = data;
      },
      fileTrue (data) {
        this.success = data;
      },
      addItem () {
        this.$get('crmManagement/item/addItem')
          .then((data) => {
            this.itemState = data.content.stage;
            this.intention = data.content.intention;
            // this.selectCustomers = data.content.client;
            this.product = data.content.product;
            this.shop = data.content.shop;
            this.reason = data.content.reason;
          })
          .catch((data) => {})
      },
      //咨询
      endConsult (formName) {
        console.log(this.formAll)
        if(this.is_flow === 6) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if(!this.formAll.next_time){
                this.$message({
                      message: '请选择下次拜访时间',
                      type: 'warning'
                  });
              }else{
                this.formAll.id = '';
                this.formAll.button = '';
                this.formAll.button_text = '';
                this.$post('crmManagement/item/addItem',Util.makeArgsObj(this.formAll))
                  .then( (data) => {
                    if(data.code){
                      this.$router.go(0)
                      this.$message({
                        message: data.errorMsg,
                        type: 'success'
                      });
                      this.$store.commit('removeTag','addItem');
                      this.$store.commit('closePage','addItem');
                      this.success = true;
                      this.ProcessVisible = false;
                      this.$refs[formName].resetFields();
                      this.formAll.product_id = [];
                      this.formAll.domains = [{value: []}];
                      this.consultDetail();
                      // this.$router.push({name: 'itemDetail',params:{id:data.content}})
                      this.$router.push({name: 'folowUpList'})                      
                    } else {
                      this.$message.error(data.errorMsg);
                    }
                  })
                  .catch(() => {})
              }
              
            } else {
              this.$message({
                type:'warning',
                message:'请填写必填项！'
              })
            }
          });
        }else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$post('consult/button_edit',this.formAll)
                .then((data) => {
                  if(data.code){
                    this.ProcessVisible = false;
                    this.$message({
                      message: data.errorMsg,
                      type: 'success'
                    });
                    this.$refs[formName].resetFields();
                    this.consultDetail();
                    this.$refs.profile.follow_log_info();
                  } else {
                    this.$message.error(data.errorMsg);
                  }
                })
                .catch(() => {})
            } else {
              return false;
            }
          });
        }
      },
      //初始化数据
      inquiryStorage () {
        this.inquiry_show = JSON.parse(localStorage.consultSearch);
        this.product = this.inquiry_show.product;
        this.trench = Util.obj2Arr(this.inquiry_show.trench);
      }
    },
    created () {
      this.$store.dispatch('dept',{});
      this.inquiryStorage();
      this.consultDetail();
      // number string boolean undefined null object symbol
      // 基本数据类型
      // 数值 字符串 布尔
      // 合成类型
      // 对象 ：  狭义的对象（object） 数组（array） 函数（function）
      // undefined null  特殊值
    }
  }
</script>

<style lang="less">
  .inquiryDetails{
    .x_details_company{
      position: relative;
      width: 100%;
    }
    .status{
      position: absolute;
      width: 150px;
      height:60px;
      right: 0px;
      top: 20px;
    }
    .status p:nth-child(2){
      font-size: 18px;
    }
    .x_number{
      height: 50px;
      line-height: 50px;
    }
    .x_number p:not(:first-child){
      display: inline-block;
      margin-left: 3%;
    }
    .x_number p:nth-child(1){
      float: left;
      margin-right: 100px;
      font-size: 18px;
      font-weight: 700;
    }
    .x_number span{
      font-size: 14px;
    }
    .x_button{
      line-height: 50px;
      margin:15px 0;
    }
    .el-card__header{
      padding: 9px 20px;
      border-bottom: 1px solid #ebeef5;
      box-sizing: border-box;
    }
    .s_new_title{
      font-size: 16px;
      font-weight: 700;
    }
    .demo-ruleForm{
      position: relative;
    }
    .inquiryLeft{
      width: 300px;
      float: left;
    }
    .optionWidth{
      float: left;
      height: 40px;
      width: 280px;
    }
    .item{
      position: absolute;
      width: 33%;
      left: 0px;
      top: -50px;
      background: #fff;
    }
    .el-card{
      margin-bottom: 15px;
    }
    .satisfied{
      position: absolute;
      left:8px;
      top:0px;
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
      font-size: 14px;
    }
    .s_item_form{
      width: 300px;
    }
    .el-step {
      flex-basis: 80px !important;
      height: 80px;
    }
  }
</style>
