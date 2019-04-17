<template>
  <div class="orderDetails">
    <el-card>
      <div style="width: 100%;height: 80px;">
        <div class="s_details_company">
          <div class="s_details_title" style="margin-top: 8px"> {{ date.name }} ( {{ date.order_code }} )</div>
          <div class="s_details_fuze">
            负责人：
            <el-popover trigger="hover" placement="top">
              <p> {{date.department}} - {{ date.salesman }}</p>
              <div slot="reference" class="name-wrapper" style="display: inline; margin:0 5px">
                <el-button  size="small" style="border: none !important; background:none !important;">{{ date.salesman }}<span v-if="manage_percent.is_show"> ( {{manage_percent.manage_percent}}% )</span></el-button>
              </div>
            </el-popover>
          </div>
          <div class="s_details_fuze" :class="{s_fuzeman:fuzeman}" style="margin-top: 12px;">
            共同负责人:
            <el-popover trigger="hover" placement="top"  v-for="item in  data.partner" :key="item.partner">
              <p> {{item.dept}} - {{item.partner}}</p>
              <div slot="reference" class="name-wrapper" style="display: inline; margin:0 5px">
                <el-button  size="mini" style="border: none !important; background:none !important; padding-right: 0px !important;">{{item.partner}}<span v-if="item.is_show"> ( {{item.percent}}% )</span></el-button>
              </div>
            </el-popover>
            <i style="margin-left: 10px" v-if="button_root" @click="charge" class="el-icon-edit"></i>
          </div>
        </div>
        <div class="s_details_btn">
          <el-button type="primary" v-if="submit_btn" round @click="x_submit_btn">提交审批</el-button>
          <el-button type="primary" v-if="approve_btn" round @click="x_approve_btn">审批</el-button>
          <el-button type="primary" v-if="cancel_btn" round @click="x_cancel_btn">撤销审批</el-button>
          <el-button type="primary" v-if="del_btn" round @click="x_del_btn">删除订单</el-button>
          <el-button type="primary" v-if="button_root"  round @click="transferOthers">转移给他人</el-button>
          <el-button type="primary" :disabled="!add_manage" round @click="toggleSelectionAll">发起订单执行工单</el-button>
          <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :append-to-body="true">
            <el-select v-model="adoptState" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <p style="margin: 20px 0px 10px 0px;">审批意见</p>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="textarea">
            </el-input>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="approve_btn_form">确 定</el-button>
            </span>
          </el-dialog>
        </div>
        <div class="s_details_status">
          <p>状态：</p>
          <p>{{date.status}}</p>
        </div>
        <div class="s_details_price">
          <p>金额：<span>￥{{date.price}}</span></p>
          <p>已回款：<span>￥{{date.transfer_price}}</span></p>
        </div>
      </div>
      <el-dialog title="转移给他人" :visible.sync="transferOthersDialog" :modal="false">
        <span>
        <el-select v-model="dd_id" filterable placeholder="请选择">
          <el-option
              v-for="item in person"
              :key="item.dd_id"
              :label="item.nickname"
              :value="item.dd_id">
          </el-option>
        </el-select>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="transferOthersDialog = false">取 消</el-button>
          <el-button type="primary" @click="transferOthersDialogTrue">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog  title="发起订单执行工单" :show-close='false' :close-on-click-modal='false' :close-on-press-escape='false' :visible.sync="dialogFormVisible" :modal="false">
        <el-form ref="orderTo" :model="orderTo" label-width="100px">
          <el-form-item label="是否签订合同">
            <el-switch v-model="orderTo.contract"></el-switch>
          </el-form-item>
          <el-form-item label="申请说明">
            <el-input type="textarea" :rows="3" placeholder="请输入申请说明" v-model="orderTo.description"></el-input>
          </el-form-item>
          <el-form-item label="订单附件">
            <el-table :data="fileListData" border style="width: 100%">
              <el-table-column fixed prop="name" label="附件名称"></el-table-column>
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button @click.native.prevent="deleteFile(scope.$index, fileListData)" type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="新增附件">
            <upload @fileStatus="fileStatus" @fileTrue="fileTrue" :success="success"></upload>
          </el-form-item>
          <el-form-item label="附件备注">
            <el-input type="textarea" :rows="3" placeholder="请输入备注" v-model="orderTo.brife"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleF">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisibleTrue">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
    <el-card style="margin-top:10px">
      <el-tabs :tab-position="tabPosition" @tab-click="paneList" v-model="activeName1">
        <el-tab-pane label="详情" name="info">
          <el-card style="height: 100%;margin-bottom: 15px;">
            <div slot="header" class="clearfix" style="border-bottom: none;">
              <span style="float: left;color:#333333;font-size:16px;font-weight:800;">订单信息</span>
               <!--   -->
              <el-button @click="dialogOpen" v-if="button_root" icon="el-icon-edit" style="float: left; padding: 3px 0;margin-left: 10px;" type="text"></el-button>
              <span  v-if="button_root" style="color:#999;margin-left: 10px;line-height: 25px;">（审批通过的订单，再次编辑后，需要重新进行订单审批）</span>
            </div>
            <div class="s_details_basic">
              <el-col :span="8">
                <p><i style="color: rgb(64, 158, 255); margin-right: 5px; margin-left: 0px;">●</i>关联客户:</p>
                <span @click="clientDetail(date.clientName.id)" style="cursor: pointer;color: #2b85e4;">{{ date.clientName.name }}</span>
              </el-col>
              <el-col :span="8">
                <p>
                  <i style="color: rgb(64, 158, 255); margin-right: 5px; margin-left: 0px;">●</i>关联项目:</p>
                <span @click="itemDetail(date.project.id)" style="cursor: pointer">{{ date.project.name }}</span>
              </el-col>
              <el-col :span="8">
                <p><i style="color: rgb(64, 158, 255); margin-right: 5px; margin-left: 0px;">●</i>订单渠道</p>
                <span>{{ date.trench }}</span>
              </el-col>
              <el-col :span="8">
                <p><i style="color: rgb(64, 158, 255); margin-right: 5px; margin-left: 0px;">●</i>订单名称:</p>
                <span>{{ date.name }}</span>
              </el-col>
              <el-col :span="8">
                <p>
                  <i style="color: rgb(64, 158, 255); margin-right: 5px; margin-left: 0px;">●</i>
                   <!-- v-if="button_root_first == 1" -->
                  成单日期 <i @click="chargeTime"  v-if="button_root_first == 1" class="el-icon-edit"></i>
                </p>
                <span>{{ date.success_time }}</span>
              </el-col>
              <!-- <el-col :span="8">
                <p><i style="color: rgb(64, 158, 255); margin-right: 5px; margin-left: 0px;">●</i>店铺</p>
                <span>{{ date.shop }}</span>
              </el-col> -->
              <el-col :span="8">
                <p><i style="color: rgb(64, 158, 255); margin-right: 5px; margin-left: 0px;">●</i>订单金额</p>
                <span>{{date.price}}</span>
              </el-col>
              <el-col :span="8">
                <p><i style="color: rgb(64, 158, 255); margin-right: 5px; margin-left: 0px;">●</i>合同日期</p>
                <span>{{date.service_start_time }} ~ {{date.service_end_time}}</span>
              </el-col>
              <el-col :span="8">
                <p><i style="color: rgb(64, 158, 255); margin-right: 5px; margin-left: 0px;">●</i>来源订单</p>
                <span>{{ date.third_order_code }}</span>
              </el-col>
              <el-col :span="8">
                <p style="margin-right:5px;margin-bottom:5px;color:#000;"><i style="color: rgb(64, 158, 255); margin-right: 5px;">●</i>是否需要印刷</p>
                <span>{{ date.printing ? '是' : '否' }}</span>
              </el-col>
              <el-col :span="8">
                <p style="margin-bottom:5px;color:#000;"><i style="color: rgb(64, 158, 255); margin-right: 5px; margin-left: 0px;">●</i>是否需要拍摄</p>
                <span>{{ date.photo ? '是' : '否' }}</span>
              </el-col>
              <el-col :span="8">
                <p style="margin-bottom:5px;color:#000;">
                  <i style="color: rgb(64, 158, 255); margin-right: 5px; margin-left: 0px;">●</i>
                  标记 <i @click="chargeMarke"  v-if="button_root_first == 1" class="el-icon-edit"></i>
                </p>
                <el-tag class='spanName' size='mini'  v-if="is_repeat == 1">新购</el-tag>
                <el-tag class='spanName' size='mini'  v-if="is_repeat == 2">复购</el-tag>
              </el-col>
              <div style="clear: both;"></div>
              <el-row class="x_product">
                <span><i style="color: rgb(64, 158, 255); margin-right: 5px; margin-left: 0px;">●</i>产品信息</span>
                <el-table :data="form.pro_info" border style="width: 75%">
                  <el-table-column prop="name.name" label="产品信息"></el-table-column>
                  <el-table-column prop="pro_period" label="周期(工作日)"></el-table-column>
                  <el-table-column prop="pro_std_price" label="标准价格(元)"></el-table-column>
                  <el-table-column prop="pro_contract_price" label="合同价格"></el-table-column>
                  <el-table-column prop="pro_brife" label="备注"></el-table-column>
                </el-table>
              </el-row>
              <el-col :span="8">
                <p><i style="color: rgb(64, 158, 255); margin-right: 5px; margin-left: 0px;">●</i>是否需要开票</p>
                <p><span>{{ date.invoice ? '是' : '否' }}</span></p>
              </el-col>
              <el-col :span="8">
                <p><i style="color: rgb(64, 158, 255); margin-right: 5px; margin-left: 0px;">●</i>发票类型</p>
                <span>{{ date.invoice_type.name}}</span>
              </el-col>
              <el-col :span="8">
                <p><i style="color: rgb(64, 158, 255); margin-right: 5px; margin-left: 0px;">●</i>发票抬头</p>
                <span>{{ date.invoice_title}}</span>
              </el-col>
              <el-col :span="8">
                <p><i style="color: rgb(64, 158, 255); margin-right: 5px; margin-left: 0px;">●</i>纳税人识别号</p>
                <span>{{ date.tax_number }}</span>
              </el-col>
              <el-col :span="8">
                <p><i style="color: rgb(64, 158, 255); margin-right: 5px; margin-left: 0px;">●</i>公司地址</p>
                <span>{{ date.province }} -- {{date.city }}--{{date.address}}</span>
              </el-col>
              <el-col :span="8">
                <p><i style="color: rgb(64, 158, 255); margin-right: 5px; margin-left: 0px;">●</i>公司电话</p>
                <span>{{date.phone}}</span>
              </el-col>
              <el-col :span="8">
                <p><i style="color: rgb(64, 158, 255); margin-right: 5px; margin-left: 0px;">●</i>银行名称</p>
                <span>{{date.bank_name}}</span>
              </el-col>
              <el-col :span="8">
                <p><i style="color: rgb(64, 158, 255); margin-right: 5px; margin-left: 0px;">●</i>银行账号</p>
                <span>{{ date.bank_number}}</span>
              </el-col>
              <span v-for="item in date.condition" :key="item.name">
                <el-col :span="8">
                  <p><i style="color: rgb(64, 158, 255); margin-right: 5px; margin-left: 0px;">●</i>{{item.name}}</p>
                  <span>{{ item.value ? '是' : '否' }}</span>
                </el-col>
              </span>
              <el-col :span="8">
                <p><i style="color: rgb(64, 158, 255); margin-right: 5px; margin-left: 0px;">●</i>审批通过后自动申请执行</p>
                <span>{{ date.auto_manage == 1 ? '是' : '否'}}</span>
              </el-col>
              <el-col :span="8">
                <p><i style="color: rgb(64, 158, 255); margin-right: 5px; margin-left: 0px;">●</i>备注</p>
                <span>{{ date.detail}}</span>
              </el-col>
            </div>
          </el-card>
          <el-card style="margin-top: 15px;">
            <div style="margin-bottom: 15px;font-size: 14px;">操作日志</div>
            <el-steps direction="vertical" :active="1" finish-status="success">
              <el-step
                  v-for="item in log"
                  v-bind:key="item.id"
                  :title="item.title"
                  :description="item.content">
              </el-step>
            </el-steps>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="执行工单">
          <el-table :data="workListData" border style="width: 100%">
            <el-table-column fixed prop="number" label="工单编号"></el-table-column>
            <el-table-column prop="person" label="发起人"></el-table-column>
            <el-table-column prop="link_type" label="工单类型"></el-table-column>
            <el-table-column prop="step" label="状态"></el-table-column>
            <el-table-column prop="next_person" label="下一步操作人"></el-table-column>
            <el-table-column prop="update_time" label="更新日期"></el-table-column>
            <el-table-column prop="create_time" label="创建日期"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="workListSeen(scope.row)" type="text" size="small">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="回款">
          <div>回款计划 <el-button :disabled="!can_add_plan" type="primary" round @click="planNew" plain size="small" style="margin-left: 10px">新增预计回款</el-button></div>
          <el-table :data="plan_list" border style="width: 100%">
            <el-table-column fixed prop="payback_time" label="回款预计时间"></el-table-column>
            <el-table-column prop="money" label="预计金额"></el-table-column>
            <el-table-column prop="type.name" label="回款方式"></el-table-column>
            <el-table-column prop="create_user" label="创建人"></el-table-column>
            <el-table-column prop="create_time" label="创建时间"></el-table-column>
            <el-table-column prop="update_time" label="更新时间"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button :disabled="!scope.row.can_del" @click="planDelete(scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog title="新增预计回款" :visible.sync="planListdialog" :modal="false">
            <span>
              <el-form ref="planData" :model="planData" label-width="100px">
                <el-form-item label="预计回款时间">
                  <el-date-picker
                      v-model="planData.payback_time"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="预计回款金额">
                    <el-input v-model="planData.money" placeholder="￥请输入金额" style="width: 220px;"></el-input>
                </el-form-item>
                <el-form-item label="回款方式">
                  <el-select v-model="planData.type" placeholder="请选择">
                    <el-option
                        v-for="item in typeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="planListdialog = false">取 消</el-button>
              <el-button type="primary" @click="planListdialogTrue">确 定</el-button>
            </span>
          </el-dialog>
          <div style="margin-top: 13px;">实际回款  <el-button :disabled="!can_add_payback" type="primary" round @click="paybackNew" plain size="small" style="margin-left: 10px">新增实际回款</el-button></div>
          <el-table :data="payback_list" border style="width: 100%">
            <el-table-column fixed prop="periods_number.name" label="回款期数"></el-table-column>
            <el-table-column prop="payback_time" label="回款时间"></el-table-column>
            <el-table-column prop="money" label="回款金额"></el-table-column>
            <el-table-column prop="type.name" label="回款方式"></el-table-column>
            <el-table-column prop="create_user" label="创建人"></el-table-column>
            <el-table-column prop="create_time" label="创建时间"></el-table-column>
            <el-table-column prop="brife" label="备注"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button :disabled="!scope.row.can_del" @click="paybackDelete(scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-dialog title="新增实际回款" :visible.sync="paybackListdialog" :modal="false">
            <span>
              <el-form ref="paybackData" :model="paybackData" label-width="100px">
                <el-form-item label="回款时间">
                  <el-date-picker
                    v-model="paybackData.payback_time"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="回款金额">
                  <el-input v-model="paybackData.money" placeholder="￥请输入金额" style="width: 220px;"></el-input>
                </el-form-item>
                <el-form-item label="回款期数">
                  <el-select v-model="paybackData.periods_number" placeholder="请选择第几期">
                    <el-option
                      v-for="item in periodsList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="回款方式">
                  <el-select v-model="paybackData.type" placeholder="请选择">
                    <el-option
                      v-for="item in typeList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="备注">
                    <el-input
                            type="textarea"
                            :rows="5"
                            placeholder="请输入内容"
                            v-model="paybackData.brife"
                            class="s_client_width">
                    </el-input>
                </el-form-item>
              </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="paybackListdialog = false">取 消</el-button>
              <el-button type="primary" @click="paybackListdialogTrue">确 定</el-button>
            </span>
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane label="附件">
          <el-table :data="annexData" style="width: 100%">
            <el-table-column fixed prop="name" label="附件名称"></el-table-column>
            <el-table-column prop="person" label="创建人"></el-table-column>
            <el-table-column prop="size_show" label="大小"></el-table-column>
            <el-table-column prop="brife" label="备注"></el-table-column>
            <el-table-column prop="create_time" label="创建时间"></el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="fileUpload(scope.$index, annexData)">
                  下载
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="审批记录">
          <div style="font-size: 14px;">当前审批人：{{current_approval}}<span style="margin-left: 10px;">未审批人：{{not_approval}}</span></div>
          <el-table :data="approvalData"  style="width: 100%">
            <el-table-column type="index" width="100" label="审批顺序"></el-table-column>
            <el-table-column prop="nickman" label="审批人"></el-table-column>
            <el-table-column prop="status" label="动作"></el-table-column>
            <el-table-column prop="time" label="审批时间"></el-table-column>
            <el-table-column prop="approve_opinion" width="150"  label="审批意见"></el-table-column>
            <el-table-column fixed="right" label="操作" align="center">
              <template slot-scope="scope">
                <el-button v-if="scope.row.button == 1" type="danger" size="small" @click="urge()">
                  催促审批
                </el-button>
                <span style="font-size: 12px;" v-if="scope.row.button == 1">(注：每天仅可催促审批一次)</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog title="订单详情修改" :visible.sync="dialogTableVisible" :modal="false" lock-scroll width="50%">
      <el-dialog title="产品信息" :visible.sync="orderList" :modal="false">
            <span>
                <el-form ref="order" :model="order" label-width="150px">
                    <el-form-item label="产品信息(必填)">
                        <el-cascader
                            expand-trigger="hover"
                            filterable
                            :options="product"
                            v-model="name_list"
                            @change="handleChange"
                            value="12"
                            class="s_order_new"
                        >
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="周期（工作日）">
                        <el-input v-model="order.pro_period" class="s_order_new" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="标准价格（元）">
                        <input  @keydown="handleInput2" onpaste="alert('请手动输入价格');return false;" v-model="order.pro_std_price" type="number" class="s_client_width s_client_widthInput" placeholder="请输入价格">
                    </el-form-item>
                    <el-form-item label="合同价格(元)(必填)">
                        <!-- <el-input v-model="order.pro_contract_price" class="s_order_new" placeholder="请输入价格"></el-input> -->
                        <input @keydown="handleInput2"  onpaste="alert('请手动输入价格');return false;" v-model="order.pro_contract_price" type="number" class="s_client_width s_client_widthInput" placeholder="请输入价格">
                    </el-form-item>
                    <el-form-item label="产品备注">
                        <el-input type="textarea" :rows="3" v-model="order.pro_brife" class="s_order_new" placeholder="请输入备注"></el-input>
                    </el-form-item>
                </el-form>
            </span>
        <span slot="footer" class="dialog-footer">
                <el-button @click="orderList = false">取 消</el-button>
                <el-button type="primary" @click="orderTrue">确 定</el-button>
            </span>
      </el-dialog>
      <el-dialog title="新增附件" :visible.sync="fileNewDialog" :modal="false">
            <span>
                <upload @fileStatus="fileStatus" @fileTrue="fileTrue" :success="success"></upload>
                <div>
                    <span>备注：</span>
                    <el-input v-model="brife" type="textarea" :rows="3" placeholder="请输入内容"></el-input>
                </div>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="fileNewDialog = false">取 消</el-button>
                <el-button type="primary" @click="fileNewDialogTrue">确 定</el-button>
            </span>
      </el-dialog>
      <el-form ref="form" :model="form"  label-position="right" label-width='130px'>
        <el-form-item label="关联项目">
          <el-select v-model="form.project_id" disabled placeholder="请选择" class="s_order_new">
            <el-option
                v-for="item in project"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单渠道">
          <el-cascader
              clearable
              class="s_order_new"
              filterable
              expand-trigger="hover"
              :show-all-levels="false"
              :options="trench"
              v-model="form.trench">
          </el-cascader>
        </el-form-item>
        <el-form-item label="店铺" v-if="form.trench == 1">
          <el-select v-model="form.shop" placeholder="请选择" class="s_order_new">
            <el-option
                v-for="item in shop"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
         <!-- v-if="form.trench != 4" -->
        <el-form-item label="订单编号">
          <el-input v-model="form.third_order_code" placeholder="请输入内容" class="s_order_new"></el-input>
        </el-form-item>
        <el-form-item label="订单名称" prop="name">
          <el-input v-model="form.name" class="s_order_new"></el-input>
        </el-form-item>
        <el-form-item label="合同日期" prop="contract_time">
          <el-date-picker
              class="s_order_new"
              v-model="form.contract_time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="detail">
          <el-input v-model="form.detail" class="s_order_new"></el-input>
        </el-form-item>
    
        <el-button type="text" @click="orderBtn">增加产品</el-button>
        <el-table :data="form.pro_info" border>
          <el-table-column prop="name.name" label="产品信息"></el-table-column>
          <el-table-column prop="pro_period" label="周期(工作日)"></el-table-column>
          <el-table-column prop="pro_std_price" label="标准价格(元)"></el-table-column>
          <el-table-column prop="pro_contract_price" label="合同价格"></el-table-column>
          <el-table-column prop="pro_brife" label="备注"></el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, form.pro_info,scope.row.pro_contract_price)" type="text" size="small">
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item label="订单金额" prop="price" class='priceStyle'>
          <el-input disabled  placeholder="订单金额为合同累加金额" v-model="form.price" class="s_order_new"></el-input>
        </el-form-item>
        <div class='boxPrice'>
          <el-form-item label="是否需要开票" prop="invoice">
            <el-switch v-model="form.invoice"></el-switch>
          </el-form-item>
          <div v-if="form.invoice">
            <el-form-item label="发票类型">
              <el-select v-model="form.invoice_type" placeholder="请选择" class="s_order_new">
                <el-option
                    v-for="item in invoice_type"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发票抬头" prop="invoice_title">
              <el-input v-model="form.invoice_title" class="s_order_new"></el-input>
            </el-form-item>
            <el-form-item label="纳税人识别号" prop="tax_number">
              <el-input v-model="form.tax_number" class="s_order_new"></el-input>
            </el-form-item>
            <div v-if="form.invoice_type == 2">
              <el-form-item label="公司地址">
                <el-select v-model="form.info.province" placeholder="请选择" class="s_order_new">
                  <el-option
                      v-for="item in province"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="详细地址">
                <el-input v-model="form.info.address" autosize placeholder="请输入详细地址" class="s_order_new"></el-input>
              </el-form-item>
              <el-form-item label="公司电话" prop="info.phone">
                <el-input v-model="form.info.phone" class="s_order_new"></el-input>
              </el-form-item>
              <el-form-item label="银行名称" prop="info.bank_name">
                <el-input v-model="form.info.bank_name" class="s_order_new"></el-input>
              </el-form-item>
              <el-form-item label="银行账号" prop="info.bank_number">
                <el-input v-model="form.info.bank_number" class="s_order_new"></el-input>
              </el-form-item>
            </div>
          </div>
          <div v-if='date.condition.length != 0' class='switchSix'> 
            <el-form-item label="是否有第三方"  class='switchSixChild'>
              <el-switch v-model="date.condition[1].value"></el-switch>
            </el-form-item>
            <el-form-item label="是否需要印刷" prop="printing" class='switchSixChild'>
              <el-switch v-model="form.printing"></el-switch>
            </el-form-item>
            <el-form-item label="是否需要拍摄" prop="photo" class='switchSixChild'>
              <el-switch v-model="form.photo"></el-switch>
            </el-form-item>
            <el-form-item label="是否未付款先执行" class='switchSixChild'>
              <el-switch v-model="date.condition[3].value"></el-switch>
            </el-form-item>
            <el-form-item label="特殊折扣" class='switchSixChild'>
              <el-switch v-model="date.condition[0].value"></el-switch>
            </el-form-item>
            <el-form-item label="服务项是否有修改" class='switchSixChild'>
              <el-switch v-model="date.condition[2].value"></el-switch>
            </el-form-item>
          </div>
            
          <!-- <span>
              <div class="approvalN"  v-for="(item,index) in date.condition" :key="index">
                  <el-form-item :label="item.name">
                      <el-switch v-model="item.value" :active-value="true" :inactive-value="false"></el-switch>
                  </el-form-item>
              </div>
          </span> -->
          <div class="approvalN" style="margin-top: 5px;">
            <p style="display: inline-block;margin-right: 5px;">审批通过后自动申请执行</p>
            <el-switch v-model="form.auto_manage" :active-value="1" :inactive-value="0"></el-switch>
          </div>
        </div>
          <!-- <div style="width:100%;height:160px"></div> -->
          <el-button type="text"  @click="fileNew">新增附件</el-button>
          <el-table :data="annexData" style="width: 100%">
            <el-table-column fixed prop="name" label="附件名称"></el-table-column>
            <el-table-column prop="person" label="创建人"></el-table-column>
            <el-table-column prop="size_show" label="大小"></el-table-column>
            <el-table-column prop="brife" label="备注"></el-table-column>
            <el-table-column prop="create_time" label="创建时间"></el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click.native.prevent="deleteFile(scope.$index, annexData)">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        <div style="clear: both"></div>
      </el-form>
      <span slot="footer">
                <el-button @click="dialogTableVisibleFa">取 消</el-button>
                <el-button type="primary" @click="confirmAdd(form)">保存</el-button>
                <el-button type="primary" @click="confirmAddApproval(form)">提交</el-button>
            </span>
    </el-dialog>

    <!-- 成单日期 -->
     <el-dialog title="编辑" :visible.sync="dialogFormTime" :modal="false" width='500px'>
        <el-form :model="r_data">
          <el-form-item label="成单日期"  label-width="80px" class="s_client_item">
            <el-date-picker type="date" class='inputText' placeholder="请选择" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" v-model="r_data.success_time">
						</el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormTime = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormTimeF">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 标记 -->
     <el-dialog title="编辑" :visible.sync="dialogFormMarke" :modal="false" width='500px'>
        <el-form :model="r_data">
          <el-form-item label="标记"  class="s_client_item">
            <el-select v-model="r_data.is_repeat" class='inputText'>
              <el-option label="新购" value="1"></el-option>
              <el-option label="复购" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormMarke = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormMaker">确 定</el-button>
        </div>
      </el-dialog>

    <!-- 编辑共同负责人 -->
    <el-dialog title="编辑共同负责人" :visible.sync="dialogFormVisible1" :modal="false" width="660px">
      <el-form :model="form">
        <el-form :inline="true">
          <el-form-item  class="s_client_item">负责人业绩</el-form-item>
          <el-form-item :label="manage_percent.nickname" class="s_client_item">
            <el-input v-model="manage_percent.manage_percent"  autosize placeholder="两位整数" class="s_client_sel_div">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-form>
        <el-form-item prop="partner" label="共同负责人"  class="s_client_item" label-width='193px'>
          <el-select v-model="partner" multiple  clearable filterable placeholder="请选择" @change="changeClientInfo" style="width:258px;" class="s_order_search">
            <el-option
                v-for="item in person"
                :key="item.dd_id"
                :label="item.nickname"
                :value="item.dd_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form :inline="true">
          <el-form-item  class="s_client_item" style="width: 70px;">业绩占比</el-form-item>
          <div v-for="(item,index) in partner_sel" style="position: relative;top: -60px;left: 85px;" :key='index'>
            <el-form-item   :label="item.partner" class="s_client_item">
              <el-input v-model="item.percent"  autosize placeholder="两位整数" class="s_client_sel_div"  style="width: 100%;">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </div>
        </el-form>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="CoinCharge">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import annexList from '../.././components/s_customer/annexList';
  import upload from '../.././components/s_customer/fiieDataCe';
  import Util from '@/libs/util';
  export default {
    name:'orderDetails',
    components: {
      annexList,
      upload
    },
    data () {
      return {
        dialogFormMarke:false,
        dialogFormTime:false,
        pushpriceArray:[],
        value:true,
        dialogVisible:false,
        options:[
          {
            value: '2',
            label: '通过'
          }, {
            value: '3',
            label: '不通过'
          }
        ],
        adoptState:'',              //审批通过与否
        textarea:'',                //审批意见
        value5:'1',
        dialogFormVisible1:false,
        partner:[],                    //选择共同负责人
        partner_sel:[],
        manage_percent:[],             //主负责人业绩信息
        data:{
          partner:[],
        },
        orderTo: {
          contract: false,               // 发起工单执行是否签订合同
          description: '',
          brife: '',
          id: this.$route.params.id,
          ordeFile: [],
          file: []
        },
        button_root_first:0,
        success: false,
        button_root: false,
        brife: '',
        annexData: [],
        log: [],
        remarks: '',                       // 发起工单执行的备注
        dd_id: '',                         // 个人的dd_id
        transferOthersDialog: false,       // 转移给他人的窗口
        fileListData: [],                  // 发起工单执行的所有附件
        id: '',
        file: [],
        fileNewDialog: false,              // 新增附件的窗口
        planListdialog: false,             // 新增回款计划窗口
        paybackListdialog: false,          // 新增实际回款窗口
        plan_list: [],                     // 预计回款
        payback_list: [],                  // 实际回款
        typeList: [],                      // 回款方式
        workListData: [],                  // 工单数据
        approvalLog:[],                    // 审批明细
        tabPosition: 'top',
        dialogFormVisible: false,          // 发起订单执行窗口
        dialogTableVisible: false,         // 修改详情的窗口
        planData: {                        // 回款计划参数
          order_id: 0,
          payback_time: '',
          money: '',
          type: '',
          is_plan: 1,
        },
        paybackData: {                     // 实际回款参数
          order_id: 0,
          payback_time: '',
          money: '',
          type: '',
          is_plan: 0,
          periods_number:'',
          brife:''
        },
        is_repeat:0,
        date:{                             // 详情修改的参数
          id:'',
          clientName: '',
          third_order_code: '',
          shop: '',
          department: '',
          manager_kpi_percent: '',
          order_code:'',
          salesman:'',
          project:'',
          trench:'',
          name:'',
          service_start_time:'',
          service_end_time:'',
          origin:'',
          price:0,
          printing:'',
          photo:'',
          invoice:'',
          invoice_type:[],
          condition:[
          ],               //审批流参数
          invoice_title:'',     //发票抬头
          tax_number:'',        //纳税人编号
          
          info:{
            id:'',
            order_id:'',
            province:'',
            city:'',
            phone:'',
            bank_name:'',
            bank_number:''
          },
          detail: '',                       //备注
          status:'',      //订单状态
          transfer_price:'', //已回款
        },
        r_data:{
            is_repeat:'1',
            id:this.$route.params.id,
            success_time:''
          },
        project:[],
        trench:[],
        invoice_type:[],
        origin:[],
        product:[],
        province:[],
        form:{
          project_id:'',
          trench:'',
          name:'',
          price:'',
          contract_time:[],
          third_order_code:'',
          printing: false,
          photo: false,
          invoice: false,
          invoice_type:'',
          invoice_title:'',
          detail:'',
          info:{
            bank_name:'',
            bank_number:'',
            phone:'',
            province:'',
            address: '',
          },
          pro_info:[],     // 产品
          shop:'',
          condition:[],    // 审批数组
          auto_manage:1    // 申请后自动执行
        },
        ordeFile: [],
        approvalData:[],     // 审批明细数组
        current_approval:'', // 当前审批人
        not_approval:'',     // 未审批的
        orderList: false,
        order: {},
        name: [],
        orderNewListN: [],
        name_list:[],
        numberShiYan: 0,
        add_manage: false,
        periodsList: [],
        can_add_plan: false,
        can_add_payback: false,
        shop:'',
        activeName1:"info",
        approve_status:'' , //审批状态按钮
        submit_btn:'',
        del_btn:'',
        approve_btn:'',
        cancel_btn:'',
        log_id:'', //有审批的时候才有的id
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
      person () {
        return this.$store.state.app.person;
      }
    },
    methods:{
       dialogFormTimeF(){
        this.$post('crmManagement/order/editSuccessTime',this.r_data)
          .then((data) => {
            if(data.code) {
              this.dialogFormTime = false;
              this.$message({
                message: '修改成功！',
                type:'wraning',
              })
              setTimeout(() => {
                this.r_data = {};
                this.$router.go(0);
              }, 50);
              this.r_data = {};
              this.dialogFormTime = false;
              this.$router.go(0);
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
      dialogFormMaker(){
        this.$post('crmManagement/order/editRepeat',{id:this.r_data.id,is_repeat:this.r_data.is_repeat})
          .then((data) => {
            if(data.code) {
              this.$message({
                message: '修改成功！',
                type:'wraning',
              })
               setTimeout(() => {
                 this.dialogFormMarke = false;
                this.r_data = {};
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
          chargeMarke(){
            this.dialogFormMarke = true;
          },
       handleInput2(e) {
            // 通过正则过滤小数点后两位
          e.target.value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || null
      },
      //弹出共同负责人弹窗
      charge() {
        this.dialogFormVisible1 = true;
      },
      changeClientInfo(val){
        this.$post('crmManagement/order/selectPartner',{'id':this.$route.params.id,'dd_ids':val})
          .then((data) => {
            if(data.code) {
              this.partner_sel = data.content;
            }else {
              this.$message({
                message: data.errorMsg,
                type:'warning',
              })
            }
          })
          .catch(() => {

          })
      },
      //共同负责人
      CoinCharge() {
        let manage_percent = 0;
        let kpi_percent = [];
        //主负责人业绩占比
        manage_percent = parseInt(this.manage_percent.manage_percent);
        let reg = /^\d{1,3}$/;
        if(!reg.test(manage_percent)){
          this.$message({
            message: '业绩必须是3位以内的整数',
            type: 'warning'
          });
          return false;
        }
        let all_percent = manage_percent;
        let bol = true;
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
        this.$put('crmManagement/order/updPartner/' + this.date.id, {
          partner: this.partner,
          kpi_percent: kpi_percent,
          manage_percent: manage_percent
        })
          .then((data) => {
            if (data.code) {
              this.$message({
                message: data.errorMsg,
                type: 'success',
              });
              this.dialogFormVisible1 = false;
              this.partner = [];
              this.orderAdd();
            } else {
              this.$message({
                message: data.errorMsg,
                type: 'warning',
              })
            }
          })
          .catch(() => {

          })
      },
      //详情的下载
      fileUpload(index, rows){
        window.open(rows[index].path);
      },
      // 取消修改
      dialogTableVisibleFa() {
        this.dialogTableVisible = false;
        this.orderAdd();
      },
      // 订单详情的所有数据请求
      orderAdd () {
        this.$get( 'crmManagement/order/detail/' + this.$route.params.id)
          .then( (data) => {
            let order = data.content.order;
            this.date.id = order.id;
            if(order.partner !== null){
              for(let i = 0; i < order.partner.length; i++){
                order.partner[i]['is_show'] = false;
                if(order.partner[i].percent > 0){
                  order.partner[i]['is_show'] = true;
                }
              }
            }
            this.data.partner = order.partner;
            this.partner = order.partner_edit ? order.partner_edit : []; // 共同负责人的默认值
            this.date.clientName = order.client;
            this.date.shop = order.shop;
            this.date.third_order_code = order.third_order_code;
            this.date.department = order.department;
            this.date.order_code = order.order_code;
            this.date.salesman = order.salesman
            this.date.project = order.project;
            this.date.success_time = order.success_time;
            this.r_data.success_time = order.success_time;
            this.button_root_first = order.edit_success_time_btn;

            this.date.trench = order.trench;
            this.date.name = order.name;
            this.date.service_start_time = order.service_start_time;
            this.date.service_end_time = order.service_end_time;
            this.date.origin = order.origin;
            this.date.price = order.price;
            this.date.printing = order.printing; 					// 印刷
            this.date.photo = order.photo;       					// 拍摄
            this.date.invoice = order.invoice;        				// 发票
            this.button_root = data.content.button_root;
            this.date.invoice_type = order.invoice_type;         	// 发票类型
            this.date.invoice_title = order.invoice_title;       	// 发票抬头
            this.date.tax_number = order.tax_number;        		// 纳税人编号
            this.date.info = order.info;                            // 地址
            this.date.phone = order.info.phone;                     // 电话
            this.date.province = order.info.province.name;          // 省份
            this.date.city = order.info.city;
            this.date.address = order.info.address;                 // 详细地址
            this.date.bank_name = order.info.bank_name;             // 银行名称
            this.date.bank_number = order.info.bank_number;         // 银行账号
            this.date.status = order.status;
            this.date.transfer_price = order.transfer_price;        // 已回款
            this.date.price = order.price;                          // 金额
            this.date.condition = order.condition;                  // 审批流
            this.date.auto_manage = order.auto_manage;              // 审批通过后自动申请执行
            this.form.auto_manage = order.auto_manage;              // 审批通过后的默认值
            this.approve_status = order.approve_status;             // 审批状态按钮
            this.date.detail = order.detail;                        // 备注
            this.log = data.content.log; 
            this.is_repeat = order.is_repeat; 
            if(order.is_repeat != null){
              this.r_data.is_repeat = order.is_repeat.toString();
            }

            this.form.pro_info = order.pro_info;                    // 产品
            this.form.project_id = order.project.id;                // 默认
            this.form.shop = data.content.order.shop.id;
            this.form.trench = order.trench_edit;
            this.form.third_order_code = order.third_order_code;
            this.form.invoice_type = order.invoice_type.id;
            this.form.name = order.name;
            this.form.price = order.price;
            var pushprice = parseFloat(order.price)
            this.pushpriceArray.push(pushprice)
            this.form.detail = order.detail;
            if(this.form.contract_time.length == 0) {
              this.form.contract_time.push(order.service_start_time); // 合同日期
            }
            if(this.form.contract_time.length == 1) {
              this.form.contract_time.push(order.service_end_time);
            }
            this.form.printing = order.printing;  					 // 印刷
            this.form.photo = order.photo;   						 // 拍摄
            this.form.invoice = order.invoice; 					     // 开票
            this.form.invoice_title = order.invoice_title;           // 发票抬头
            this.form.tax_number = order.tax_number;  				 // 识别号
            this.form.info.phone = order.info.phone; 			     // 电话
            this.form.info.bank_name = order.info.bank_name; 		 // 银行名称
            this.form.info.bank_number = order.info.bank_number;     // 银行账号
            this.form.info.province = order.info.province.id;        // 地址
            this.form.info.detail = order.info.detail;
            this.project = data.content.project;
            let trench = data.content.trench;
            this.trench = Util.obj2Arr(trench);
            this.invoice_type = data.content.invoice_type;
            this.product = data.content.product;                                // 全部产品
            this.origin = data.content.origin;
            this.province = data.content.province;    
            // 地址
            this.add_manage = data.content.add_manage;
            this.shop = data.content.shop;
            this.submit_btn = data.content.order.submit_btn ? true : false;     // 提交审批
            this.del_btn = data.content.order.del_btn ? true : false;           // 删除订单
            this.approve_btn = data.content.order.approve_btn ? true : false;   // 审批
            this.cancel_btn = data.content.order.cancel_btn ? true : false;     // 撤销
            if(data.content.order.log_id) {
              this.log_id = data.content.order.log_id;
            }
            this.manage_percent = order.manage_percent;
            if(order.manage_percent.manage_percent == 0 || order.manage_percent.manage_percent == ""){
              this.manage_percent['is_show'] = false;
            }else{
              this.manage_percent['is_show'] = true;
            }
            this.partner_sel = order.partner;
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      //oss
      fileTrue(data) {
        this.success = data;
      },
      //oss
      fileStatus(data) {
        this.file = data;
        this.orderTo.file = this.file;      //发起订单执行工单附件。(新传的附件)
      },
      // 打开修改订单信息的弹窗
      dialogOpen () {
        this.orderFile()
        this.dialogTableVisible = true;
      },
      // 跳转客户
      clientDetail (id) {
        this.$router.push({name: 'clientDetail',params: {id: id}});
      },
      // 跳转项目
      itemDetail (id) {
        this.$router.push({name: 'itemDetail',params: {id: id}});
      },
      // 取消执行工单
      dialogFormVisibleF () {
        this.dialogFormVisible = false;
        this.$router.go(0);
      },
      // 订单详情修改(保存)
      confirmAdd() {
        let condition = [];
        for(let i = 0; i < this.date.condition.length; i++) {
          if(this.date.condition[i].value) {
            condition.push(this.date.condition[i].id);
          }
        }
        this.form.condition = condition;
        this.form.btn = 1;

      if((this.form.trench[0] == 0 || this.form.trench[0] == 1 ||this.form.trench[0] == 7)&&this.form.third_order_code === '') {
          this.$message({
            message: '订单来源渠道为网络平台，请填写订单编号',
            type: 'warning'
          })
        }else{
            this.$put( 'crmManagement/order/' + this.$route.params.id, this.form)
          .then( (data) => {
            if(data.code){
              this.$message({
                message: data.errorMsg,
                type: 'success'
              });
              this.dialogTableVisible = false;
              this.orderAdd();
              this.approvalLoga();
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
        }
      
      },
      //订单详情修改（提交按钮）
      confirmAddApproval() {
        let condition = [];
        for(let i = 0; i < this.date.condition.length; i++) {
          if(this.date.condition[i].value) {
            condition.push(this.date.condition[i].id);
          }
        }
        this.form.condition = condition;
        this.form.btn = 2;
        if((this.form.trench[0] == 0 || this.form.trench[0] == 1 ||this.form.trench[0] == 7)&&this.form.third_order_code === '') {
          this.$message({
            message: '订单来源渠道为网络平台，请填写订单编号',
            type: 'warning'
          })
        }else{
        this.$put( 'crmManagement/order/' + this.$route.params.id, this.form)
          .then( (data) => {
            if(data.code){
              this.$message({
                message: data.errorMsg,
                type: 'success'
              });
              this.dialogTableVisible = false;
              this.orderAdd();
              this.approvalLoga();
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
        }
      },
      // 打开发起工单的弹窗
      toggleSelectionAll(){
        this.orderFile();
        this.dialogFormVisible = true;
        this.orderTo.ordeFile = this.ordeFile;
      },
      // 确定发起执行工单
      dialogFormVisibleTrue () {
        this.orderTo.ordeFile = this.fileListData;
        if(this.orderTo.ordeFile.length == 0 && this.orderTo.file.length == 0){
          this.$message({
                message: '附件信息必填，请上传附件',
                type: 'warning'
              });
        }else{
           this.$post( 'manageNew/manageOrder',this.orderTo)
          .then( (data) => {
            if(data.code){
              this.$message({
                message: data.errorMsg,
                type: 'success'
              });
              this.success = true;
              this.dialogFormVisible = false;
              this.orderTo = {};
              this.$router.push({name: 'workInfo', query: {manage_id: data.content.manage_id, work_type:2}})
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch(() => {})
        }
       
      },
      // 删除订单附件
      deleteFile (index , rows) {
        this.$delete( 'crmManagement/order/attachment/' + rows[index].id)
          .then( (data) => {
            if(data.code){
              this.$message({
                message: data.errorMsg,
                type: 'success'
              });
              rows.splice(index, 1);
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch(() => {})
      },
      // 更改产品信息弹窗
      orderBtn(){
        this.order = {
          pro_period: '',
          pro_std_price: '',
          pro_contract_price: '',
          discount: '',
          name:{},
        };
        this.orderList = true;
      },
        accAdd(arg1, arg2) {
          if (isNaN(arg1)) {
              arg1 = 0;
          }
          if (isNaN(arg2)) {
              arg2 = 0;
          }
          arg1 = Number(arg1);
          arg2 = Number(arg2);
          var r1, r2, m, c;
          try {
              r1 = arg1.toString().split(".")[1].length;
          }
          catch (e) {
              r1 = 0;
          }
          try {
              r2 = arg2.toString().split(".")[1].length;
          }
          catch (e) {
              r2 = 0;
          }
          c = Math.abs(r1 - r2);
          m = Math.pow(10, Math.max(r1, r2));
          if (c > 0) {
              var cm = Math.pow(10, c);
              if (r1 > r2) {
                  arg1 = Number(arg1.toString().replace(".", ""));
                  arg2 = Number(arg2.toString().replace(".", "")) * cm;
              } else {
                  arg1 = Number(arg1.toString().replace(".", "")) * cm;
                  arg2 = Number(arg2.toString().replace(".", ""));
              }
          } else {
              arg1 = Number(arg1.toString().replace(".", ""));
              arg2 = Number(arg2.toString().replace(".", ""));
          }
          return (arg1 + arg2) / m;
      },
      accSub(arg1, arg2) {
        if (isNaN(arg1)) {
            arg1 = 0;
        }
        if (isNaN(arg2)) {
            arg2 = 0;
        }
        arg1 = Number(arg1);
        arg2 = Number(arg2);

        var r1, r2, m, n;
        try {
            r1 = arg1.toString().split(".")[1].length;
        }
        catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        }
        catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
        n = (r1 >= r2) ? r1 : r2;
        return ((arg1 * m - arg2 * m) / m).toFixed(n);
    },
      // 确定增加产品
      orderTrue() {
            var pushprice2 = this.order.pro_contract_price;
            this.form.price = this.accAdd(this.form.price,pushprice2);
            // this.pushpriceArray.push(pushprice2)
            // var s = 0;
            // for (var i=this.pushpriceArray.length-1; i>=0; i--) {
            //     s += this.pushpriceArray[i];
            // }
            // this.form.price =s.toFixed(2);
        if(this.name_list.length == 0){
              this.$message({
                message: '请输入产品信息',
                type: 'success'
              });
        }else if(!this.order.pro_contract_price){
              this.$message({
                message: '请输入合同价格',
                type: 'success'
              });
        }else{
            let pro_arr = this.product;
            for(let i = 0; i < pro_arr.length; i++){
              for(let j = 0; j < pro_arr[i]['children'].length; j++){
                  if(pro_arr[i]['children'][j]['value'] == this.numberShiYan){
                    this.order.name.name = pro_arr[i]['children'][j]['label'];
                    this.order.name.id = pro_arr[i]['children'][j]['value']
                  }
              }
            }
            // for(let i = 0; i < pro_arr.length; i++){
            //   for(let j = 0; j < pro_arr[i]['children'].length; j++){
            //     for(let x = 0; x < pro_arr[i]['children'][j]['children'].length; x++){
            //       if(pro_arr[i]['children'][j]['children'][x]['value'] == this.numberShiYan){
            //         this.order.name.name = pro_arr[i]['children'][j]['children'][x]['label'];
            //         this.order.name.id = pro_arr[i]['children'][j]['children'][x]['value']
            //       }
            //     }
            //   }
            // }
            this.form.pro_info.push(this.order);
            this.orderList = false;
        }
      },
      // 选中产品的ID
      handleChange(value) {
        this.numberShiYan = value[1];
      },
      //移除产品信息
      deleteRow(index, rows,obj) {
        // 接昨天：此处打开方式：为销售订单 订单列表 查看 更改订单信息
          // var objNum = this.form.price - obj;
          var objNum = this.accSub(this.form.price,obj)
          if(objNum == 0 && rows.length == 1){
              this.form.price = ''
            }else{
              this.form.price = objNum;
            }
        // if(objNum == 0){
        //   this.form.price = 0;
        //   this.pushpriceArray = [];
        //   if(this.form.price == 0){
        //     this.form.price ='订单金额为产品合同价格之和';
        //   }
        // }else{
        //   this.form.price = objNum.toFixed(2);
        // }
        rows.splice(index, 1);
      },
      // 转移给他人
      transferOthers () {
        this.transferOthersDialog = true;
      },
      // 确定转移给他人
      transferOthersDialogTrue () {
        this.$put( 'crmManagement/order/' + this.$route.params.id + '/' + 'transfer' + '/' + this.dd_id)
          .then( (data) => {
            if(data.code){
              this.$message({
                message: data.errorMsg,
                type: 'success'
              });
              this.transferOthersDialog = false;
              this.dd_id = '';
              this.$router.push({name: 'orderList'})
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch( () => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      // 工单列表
      workList() {
        this.$get( 'manageNew/orderManage',{id: this.$route.params.id})
          .then( (data) => {
            this.workListData = data.content;
          })
          .catch(() => {})
      },
      // 跳转工单详情
      workListSeen(row) {
        this.$router.push({
          name: 'workInfo',
          query: {
            manage_id: row.manage_id,
            // task_id: row.task_id
            work_type:2
          }
        })
      },
      // 回款
      paybackList() {
        this.$get( 'crmManagement/order/paybackList', {order_id: this.$route.params.id})
          .then( (data) => {
            this.payback_list = data.payback_list;
            this.plan_list = data.plan_list;
            this.typeList = data.type;
            this.periodsList = data.periods;
            this.can_add_payback = data.can_add_payback;
            this.can_add_plan = data.can_add_plan;
          })
          .catch(() => {})
      },
      // 删除预计回款计划
      planDelete(row) {
        this.$delete( 'crmManagement/order/payback/' + row.id)
          .then( (data) => {
            if(data.code) {
              this.$message({
                message: data.errorMsg,
                type: 'success'
              });
              this.paybackList();
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      // 删除实际回款
      paybackDelete(row) {
        this.$delete( 'crmManagement/order/payback/' + row.id)
          .then( (data) => {
            if(data.code) {
              this.$message({
                message: data.errorMsg,
                type: 'success'
              });
              this.paybackList();
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      // 新增预计回款计划
      planNew () {
        this.planData.order_id = this.$route.params.id;
        this.planListdialog = true;
      },
      // 新增实际回款
      paybackNew() {
        this.paybackListdialog = true;
        this.paybackData.order_id = this.$route.params.id;
      },
      // 确定预计回款计划
      planListdialogTrue() {
        this.$post( 'crmManagement/order/paybackPlan',this.planData)
          .then( (data) => {
            if(data.code){
              this.$message({
                message: data.errorMsg,
                type: 'success'
              });
              this.paybackList();
              this.planData = {};
              this.planData.is_plan = 1;
              this.planData.order_id = this.$route.params.id;
              this.planListdialog = false;
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      // 确定实际回款
      paybackListdialogTrue() {
        this.$post( 'crmManagement/order/payback',this.paybackData)
          .then( (data) => {
            if(data.code){
              this.$message({
                message: data.errorMsg,
                type: 'success'
              });
              this.paybackList();
              this.paybackData = {};
              this.paybackData.is_plan = 0;
              this.paybackData.order_id = this.$route.params.id;
              this.paybackListdialog = false;
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      // 新增附件
      fileNew () {
        this.fileNewDialog = true;
      },
      // 删除项目附件
      annex (data) {
        this.$delete( 'crmManagement/order/attachment/' + data)
          .then( (data) => {
            if(data.code){
              this.$message({
                message: data.errorMsg,
                type: 'success'
              });
              this.orderFile();
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      // 附件列表
      orderFile() {
        this.$get( 'crmManagement/order/attachment',{order_id: this.$route.params.id})
          .then( (data) => {
            this.annexData = data.content;
            this.fileListData = data.content;
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      // 确定新增附件
      fileNewDialogTrue () {
          this.$post( 'crmManagement/order/attachment',{id: this.$route.params.id, brife: this.brife, file: this.file})
          .then( (data) => {
            if(data.code){
              this.$message({
                message: data.errorMsg,
                type: 'success'
              });
              this.success = true;
              this.fileNewDialog = false;
              this.brife = '';
              this.orderFile();
            } else {
              this.$message.error(data.errorMsg);
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
      paneList(tab) {
        if(tab.index == 1) {
          this.workList();
        } else if (tab.index == 2) {
          this.paybackList();
        } else if (tab.index == 3) {
          this.orderFile();
        }
      },
      //审批明细
      approvalLoga() {
        this.$get('crmManagement/order/approveLog',{order_id:this.$route.params.id})
          .then((data) => {
            if(data.code) {
              this.approvalData = data.content.log;
              this.current_approval = data.content.info.current_approval;
              this.not_approval = data.content.info.not_approval;
            }
          })
          .catch(() => {
            this.$message.error('服务器错误请稍后重试！');
          })
      },
      //催促审批
      urge() {
        this.$get('crmManagement/order/buttonApprove',{order_id:this.date.id})
          .then((data) => {
            if(data.code) {
              this.$message({
                showClose: true,
                message: '恭喜您，催促成功',
                type: 'success'
              })
            }
          })
          .catch(() => {
            this.$message.error('服务器错误请稍后重试！');
          })
      },
      //提交审批
      x_submit_btn(){
        this.$confirm('确认要提交审批吗?, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$get('crmManagement/order/buttonApprove',{order_id:this.date.id})
            .then((data) => {
              if(data.code) {
                this.$message({
                  type: 'success',
                  message:'提交成功'
                });
                this.orderAdd();
                this.approvalLoga();
              }else {
                this.$message({
                  type: 'warning',
                  message: data.errorMsg
                });
              }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消提交'
          });
        });
      },
      //审批
      x_approve_btn(){
        this.dialogVisible = true;
      },
      approve_btn_form(){
        this.$get('crmManagement/order/approve',{log_id:this.log_id,text:this.textarea,status:this.adoptState})
          .then((data) => {
            if(data.code) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.dialogVisible = false;
              this.textarea = '';
              this.adoptState = '';
              this.orderAdd();
              this.approvalLoga();
            } else {
              this.$message({
                type: 'warning',
                message: data.errorMsg
              });
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试')
          })
      },
      //撤销
      x_cancel_btn(){
        this.$confirm('确认撤销正在审批中的申请?, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$get('crmManagement/order/cancelApprove',{order_id:this.date.id})
            .then((data) => {
              if(data.code) {
                this.$message({
                  type: 'success',
                  message: data.errorMsg
                });
                this.orderAdd();
                this.approvalLoga();
              } else {
                this.$message({
                  type: 'warning',
                  message: data.errorMsg
                });
              }
            })
            .catch(() => {
              this.$message.error('服务器错误，请稍后重试')
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消撤销'
          });
        });
      },
      //删除订单
      x_del_btn() {
        this.$confirm('确认删除该订单?删除后不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$get('crmManagement/order/delOrder',{order_id:this.date.id})
            .then((data) => {
              if(data.code) {
                this.$message({
                  type: 'success',
                  message: data.errorMsg
                });
                this.$router.push({
                  name: 'orderList'
                })
              }else {
                this.$message({
                  type: 'warning',
                  message: data.errorMsg
                });
              }
            })
            .catch(() => {
              this.$message.error('服务器错误，请稍后重试')
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
    },
    created(){
      this.$store.dispatch('dept',{});
      this.orderTo.id = this.$route.params.id;
      this.orderAdd();
      this.activeName1 = "info";
      this.approvalLoga();
    }
  }
</script>

<style lang="less" scoped>
  .orderDetails {
    .x_product{
      margin-bottom: 20px;
    }
    .x_product span{
      font-size:16px;
      color: #666;
    }
    .x_printing span{
      float: left;
      margin-left: 13px;
      font-size:14px;
    }
    .x_ticket{
      font-size:16px;
      height: 40px;
    }
    .s_details_title {
      float: left;
      font-size: 20px;
      margin-left: 0px !important;
    }
    .el-form-item__label {
      margin-left: 0px !important;
      width: 55px;
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
      height: 70px;
    }
    .s_details_basic_intermediate {
      width: 100%;
      height: 100px;
    }
    .s_details_basic_title div, .s_details_basic_intermediate div{
      float: left;
    }
    .s_details_basic_ticket{
      line-height: 50px;
      font-size:15px;
      color: #666;
      margin-left: 10px;
    }
    .s_details_basic_name span, .s_details_basic_source span, .s_details_basic_industry span, .s_details_basic_rank span, .s_details_basic_scale span{
      color: #666;
      font-size: 16px;
      margin-left: 10px;
    }
    .s_details_basic_name_link span{
      color: rgb(67, 128, 255);
      font-size: 16px;
      margin-left: 10px;
    }
    .box-card {
      margin-top: 50px;
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
    .s_order_new {
      width: 400px;
    }
    .el-icon-edit:hover {
      cursor: pointer;
    }
    .s_fuzeman {
      margin-top: 15px !important;
    }
    .approvalN{
      width: 309px;
      float: left;
    }
    .s_details_status{
      font-size: 14px;
      float: right;
      margin-right: 200px;
    }
    .s_details_price {
      font-size: 14px;
      float: right;
      margin-right: -200px;
    }
    .s_details_price span {
      color:#ee2a7b;
    }
    .el-step {
      flex-basis: 80px !important;
      height: 80px;
    }
    .el-col span{
      line-height: 45px;
      color: #666;
      font-size: 16px;
      margin-left: 10px;
    }
    .el-col p{
      font-size: 14px;
    }
  }
  .boxPrice{
    overflow: hidden;
    margin-bottom: 20px;
  }
  .priceStyle{
    margin-top: 22px;
  }
  .s_client_widthInput{
      border-radius: 5px;
      background: #eef2f9;
      padding-left: 16px;
      border: 1px solid #dcdfe6; 
      width: 400px;
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
    .spanName{
      border: 1px solid #409eff;
      color:#409eff!important;
      text-align: center;
      line-height: 22px!important;
      font-size: 12px!important;
    }
    .inputText{
      width: 300px!important;
    }
    .switchSix{
      overflow: hidden;
    }
    .switchSixChild{
      width: 33%;
      float: left;
    }
</style>
