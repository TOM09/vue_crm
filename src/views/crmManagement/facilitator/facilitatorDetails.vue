// 服务商详情页面所有数据
<template>
  <div class="facilitatorDetails">
    <el-card>
      <div style="width: 60%;display: inline-block;">
        <div class="s_details_company">
          <div class="s_details_title">{{ faciliDate.name }} （{{ faciliDate.sn_no }}）</div>
          <div class="s_details_fuze">
            负责人:
            <el-popover trigger="hover" placement="top">
              <p>{{ faciliDate.nickname }}</p>
              <div slot="reference" class="name-wrapper">
                <el-button  size="small" style="border: none !important; background:none !important;">{{ faciliDate.nickname }}
                </el-button>
              </div>
            </el-popover>
          </div>
        </div>
        <div class="s_details_btn">
          <el-button type="primary" @click="newPerson"  v-if="faciliDate.is_opera">转移给他人</el-button>
          <el-button type="primary" @click="deleteItems" v-if="faciliDate.is_opera">删除</el-button>
        </div>
        <div style="clear:both"></div>
      </div>
      <div class='rightSeleF'>
        <p style="text-align:center;font-size:16px;">状态</p>
        <el-select v-model="optionsTypeNum" placeholder="请选择" @change='changeStatus' class='typeStyle'>
          <el-option
            v-for="item in optionsType"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div style="clear:both"></div>

      <!-- 弹窗 -->
      <!-- <el-dialog title="编辑" :visible.sync="dialogFormTime" :modal="false" width='500px'>
        <el-form :model="r_data">
          <el-form-item label="首次成单日期"  class="s_client_item">
            <el-date-picker type="date" placeholder="请选择" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" v-model="r_data.success_time">
						</el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogFormTimeF">确 定</el-button>
          <el-button @click="dialogFormTime = false">取 消</el-button>
        </div>
      </el-dialog> -->

    </el-card>
    <br/>
    <el-card>
      <el-tabs :tab-position="tabPosition" v-model="tabsName"  @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="clientDet">
          <el-card>
            <div slot="header" class="clearfix">
              <span style="float: left;color:#333333;font-size:16px;font-weight:800;">服务商信息</span>
              <el-button @click="dialogOpen" v-if="faciliDate.is_opera" icon="el-icon-edit" style="float: left; padding: 3px 0;margin-left: 10px;" type="text"></el-button>
            </div>
            <div class="s_details_basic">
              <div class="s_details_basic_title">
                <div class="s_details_basic_name">
                  <p><span style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</span>公司名称</p>
                  <p style="height:10px;"></p>
                  <span>{{ faciliDate.name }}</span>
                </div>
                <div class="s_details_basic_industry">
                  <p><div style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</div>类型</p>
                  <p style="height:10px;"></p>
                  <span>{{ faciliDate.type }}</span>
                </div>
                <div class="s_details_basic_source">
                  <p><div style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</div>城市</p>
                  <p style="height:10px;"></p>
                  <span>{{ faciliDate.city }}</span>
                </div>
              </div>
              <div class="s_details_basic_intermediate">
                <div class="s_details_basic_rank ">
                  <p><div style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</div>合作有效期</p>
                  <p style="height:10px;"></p>
                  <span>{{ this.begin_time }} - {{ this.end_time }}</span>
                </div>
                <div class="s_details_basic_scale">
                  <p><div style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</div>从业时间</p>
                  <p style="height:10px;"></p>
                  <span>{{ faciliDate.employment_time}}年</span>
                </div>
                <div class="s_details_basic_scale">
                  <p><div style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</div>服务等级</p>
                  <p style="height:10px;"></p>
                  <span>{{ faciliDate.rank_desc}}</span>
                </div>
              </div>
            </div>

            <div style="margin-bottom:20px">
              <p>
                <div style="display: inline-block;color:#409eff;margin-right: 5px;margin-left: 0px;">●</div>
                <p style='display: inline-block;color: #999;font-size: 14px;'>
                  合作产品
                </p>
              </p>
              <el-table :data="faciliProdS" border style="width: 600px;">
                <el-table-column fixed prop="product_name" label="产品信息"></el-table-column>
                <el-table-column fixed prop="balance_price_desc" label="结算标准"></el-table-column>
                <el-table-column fixed prop="price" label="价格"></el-table-column>
                <el-table-column fixed prop="brife" label="产品备注"></el-table-column>
              </el-table>
            </div>

            <div class="s_details_basic_scale">
              <p><div style="display: inline-block;color:#409eff;margin-right: 5px;margin-left: 0px;">●</div>服务区域</p>
              <span style='line-height: 33px;'>{{ faciliDate.province}}</span>
            </div>

            <div class="s_details_basic_scale">
              <p><div style="display: inline-block;color:#409eff;margin-right: 5px;margin-left: 0px;">●</div>公司介绍</p>
              <span style='line-height: 33px;'>{{ faciliDate.remarks}}</span>
            </div>
            
          </el-card>

          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="float: left;color:#333333;font-size:16px;font-weight:800;">联系信息</span>
              <div><el-button type="primary" @click="dialogTablePeole = true" plain size="mini" style="margin-left: 10px">增加联系人</el-button></div>
            </div>
            <div>
              <el-table :data="contactList" border style="width: 50%" max-height="250">
                <el-table-column  fixed prop="user_name" label="联系人"></el-table-column>
                <el-table-column prop="contact_type" label="联系方式"></el-table-column>
                <el-table-column prop="contact_number" label="联系信息"></el-table-column>
                <el-table-column  fixed="right" label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button
                        @click.native.prevent="deleteRow(scope.$index, contactList)"
                        type="text"
                        size="mini">
                      删除
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
                  :title="item.nickname + item.create_time"
                  :description="item.content"
              >
              </el-step>
            </el-steps>
          </el-card>

        </el-tab-pane>
        <el-tab-pane label="资质信息" name="clientItem">
          <!-- <div><el-button type="primary" v-if="button_transfer" @click="addItems" plain size="mini" style="margin-left: 10px">新增项目</el-button></div> -->
          <div class="zizhiMessage">
            <span style="color:#333333;font-size:16px;font-weight:800;">资质信息</span>
            <el-button type="primary" @click="addQuali" v-if='addBtn == 1' plain size="mini" style="margin-left: 10px">新增资质</el-button>
          </div>
          <br/>
          <el-table border :data="projectData" style="width: 100%">
            <el-table-column prop="quality_type" label="资质类型"></el-table-column>
            <el-table-column label="信息">
              <template slot-scope="scope">
                <div v-html="scope.row.quality_info"></div>
            </template>
            </el-table-column>
            <el-table-column prop="brife" label="备注"></el-table-column>
            <el-table-column prop="file_size" label="大小"></el-table-column>
            <el-table-column prop="create_person" label="创建人"></el-table-column>
            <el-table-column prop="create_time" label="创建时间"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="itemDetail(scope.$index,scope.row)" type="text" size="mini">下载</el-button>
                <el-button @click="delDetail(scope.$index,projectData)" v-if='scope.row.del_button == 1' type="text" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="评估信息" name="clientOrder">
          <div class="zizhiMessage">
            <span style="color:#333333;font-size:16px;font-weight:800;">评估信息</span>
            <el-button type="primary" @click="addSpike" v-if="faciliDate.is_opera" plain size="mini" style="margin-left: 10px">新增评估</el-button>
          </div>
          <br/>
          <el-table  :data="orderData" style="width: 100%">
            <el-table-column prop="manage_number" label="执行单号"></el-table-column>
            <el-table-column prop="order_code" label="订单号"></el-table-column>
            <el-table-column prop="product_name" label="产品"></el-table-column>
            <el-table-column prop="product_brief" label="产品说明"></el-table-column>
            <el-table-column prop="score" label="评估总分"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column prop="nickname" label="创建人"></el-table-column>
            <el-table-column prop="create_time" label="创建时间"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="orderDetail(scope.row)" type="text" size="mini">下载</el-button>
                <el-button @click="delOrderDetail(scope.$index,orderData)" type="text" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="服务商案例" name="clientFile">
          <div class="zizhiMessage">
            <span style="color:#333333;font-size:16px;font-weight:800;">关联案例</span>
            <el-button type="primary" @click="addItems" plain size="mini" style="margin-left: 10px">新增案例</el-button>
          </div>
          <br/>
          <el-row style="margin-top: -15px; overflow: hidden;">
            <div  v-for="(item,index) in caseData" :key="index" class="x_case_img">
              <el-card :body-style="{ padding: '8px' }" style="width: 100%;height: 100%;padding-top: 8px;">
                <!-- <img v-if="item.cover" :src="item.cover.slice(0,item.cover.indexOf('?'))" class="image" @click="clicklist(item)"> -->
                <img :src="item.cover.slice(0,item.cover.indexOf('?'))" class="image" @click="clicklist(item)">
                <div>
                  <p class="case_detail">{{item.name}}</p>
                  <p style="height: 30px;">
                    <span class="tpr">
                    <span class="x_lable x_lable_img" :class="{x_lable_img1:item.is_praise}" style="width:80px;border: none;" @click="pointPraise(item)"><b>{{item.praise}}</b></span>
                    </span>
                    <span class="x_lable" style="text-align: center;">{{item.lable}}</span>
                    <span style="text-align: center;position: absolute;top: 21px;right: -4px;" v-if="item.lable == '精品'">
                      <img src="/src/images/caseIcon.png" style="width: 50px;">
                    </span>
                  </p>
                  <p class="Designer">
                    <span class="publisher" style="float:left;height: 35px;">{{item.producer}}</span>
                    <el-rate
                        :value="item.designer"
                        disabled
                        :max="item.designer"
                        score-template="{value}">
                    </el-rate>
                  </p>
                </div>
              </el-card>
            </div>
          </el-row>
        <el-pagination background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[12, 24, 48, 96]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count">
          </el-pagination>
        </el-tab-pane>

        <el-tab-pane label="合作案例" name="orderFacil">
          <div class="zizhiMessage">
            <span style="color:#333333;font-size:16px;font-weight:800;">关联案例</span>
            <el-button type="primary" @click="addAboatCase" plain size="mini" style="margin-left: 10px">新增案例</el-button>
          </div>
          <br/>
            <el-row style="margin-top: -15px; overflow: hidden;">
            <div  v-for="(item,index) in caseData" :key="index" class="x_case_img">
              <el-card :body-style="{ padding: '8px' }" style="width: 100%;height: 100%;padding-top: 8px;">
                <!-- <img v-if="item.cover" :src="item.cover.slice(0,item.cover.indexOf('?'))" class="image" @click="clicklist(item)"> -->
                <img :src="item.cover.slice(0,item.cover.indexOf('?'))" class="image" @click="clicklist(item)">
                <div>
                  <p class="case_detail">{{item.name}}</p>
                  <p style="height: 30px;">
                    <span class="tpr">
                    <span class="x_lable x_lable_img" :class="{x_lable_img1:item.is_praise}" style="width:80px;border: none;" @click="pointPraise(item)"><b>{{item.praise}}</b></span>
                    </span>
                    <span class="x_lable" style="text-align: center;">{{item.lable}}</span>
                    <span style="text-align: center;position: absolute;top: 21px;right: -4px;" v-if="item.lable == '精品'">
                      <img src="/src/images/caseIcon.png" style="width: 50px;">
                    </span>
                  </p>
                  <p class="Designer">
                    <span class="publisher" style="float:left;height: 35px;">{{item.producer}}</span>
                    <el-rate
                        :value="item.designer"
                        disabled
                        :max="item.designer"
                        score-template="{value}">
                    </el-rate>
                  </p>
                </div>
              </el-card>
            </div>
          </el-row>
            <el-pagination background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[12, 24, 48, 96]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count">
            </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </el-card>

     <el-dialog title="增加产品" :visible.sync="orderBtnDilog" :modal="false" width="700px">
        <span>
          <el-form ref="contactPro" :model="contactPro" label-width="150px">
            <el-form-item label="产品信息" class=' is-required'>
              <el-cascader
                expand-trigger="hover"
                filterable
                :options="product"
                @change="handleChange123"
                v-model="numberShiYan2"
                class="s_client_width">
              </el-cascader>
            </el-form-item>

          <div style="margin:20px 0 50px 0"> 
            <el-form-item>
              <el-radio-group v-model="contactPro.balance_price" size="small"  @change='tabType'>
                <el-radio :label="1" border>固定价格</el-radio>
                <el-radio :label="2" border>分成比例</el-radio>
                <el-radio :label="3" border>询价</el-radio>
              </el-radio-group>
            </el-form-item>

             <el-form-item v-show='contactPro.balance_price == 1' onpaste="alert('请手动输入价格');return false;">
                <!-- <input type="number"  @keydown="handleInput2" class="s_additem_btn s_client_widthInput" v-model="form.products.balance_price" placeholder="请输入"> -->
                <el-input v-model="contactPro.price" class='pricePrepend'>
                  <template slot="prepend">￥</template>
                </el-input>
              </el-form-item>

             <el-form-item v-show='contactPro.balance_price == 2' onpaste="alert('请手动输入价格');return false;">           
                <el-select v-model="contactPro.price_type" placeholder="请选择"  class='priceAppend1'>
                  <el-option
                    v-for="item in price_type"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-input placeholder="请输入" v-model="contactPro.price" class='priceAppend'>
                  <template slot="append">%</template>
                </el-input>

              </el-form-item>
          </div>
            
            <el-form-item label="产品备注">
              <el-input type="textarea" :rows="3" v-model="contactPro.brife" class="s_client_width" placeholder="请输入备注">
              </el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmPrudoct">确 定</el-button>
          <el-button @click="orderBtnDilog = false">取 消</el-button>
        </span>
      </el-dialog>

    <el-dialog title="增加联系人" :visible.sync="dialogTablePeole" :modal="false" width="500px" class='lianxirenAdd'>
          <br/>
      <el-form  label-width="110px" class='lableContent'>
          <el-form-item prop="link_name" label="联系人 ：" class='is-required'>
            <el-input v-model="contact.user_name" autosize placeholder="请输入内容" class="s_client_sel_div" ></el-input>
          </el-form-item>
          <br/>

          <el-form-item prop="company" label="联系方式 ：" class='is-required'>
            <el-select v-model="contact.contact_type" clearable placeholder="请选择联系方式" class='ischeese'>
                  <el-option
                    v-for="item in contacts_type"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
          </el-form-item>
          <br/>
         
          <el-form-item prop="company" label="联系信息 ：" class='is-required'>
            <el-input v-model="contact.contact_number" placeholder="请输入内容" class="s_client_sel_div"></el-input>
          </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmPeople(contact)">确 定</el-button>
        <el-button @click="dialogTablePeole = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="dialogTableVisible" :modal="false" width="1000px" class='dialogcompany2'>
      <el-form ref="form" :model="form" label-position="right" label-width="100px" class='dialogcompany'>
        <el-form-item label="公司名称：" class="rateFacilitabout is-required">
          <el-input v-model="form.name" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="类型" class="rateFacilitabout is-required">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
                v-for="item in rank"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市" class="rateFacilitabout is-required">
          <el-cascader
           :show-all-levels="false"
            expand-trigger="hover"
            filterable
            clearable
            :options="region"
            v-model="form.city"
            >
          </el-cascader>
        </el-form-item>
        <el-form-item label="合作有效期" prop="ask_time" class="rateFacilitabout2 is-required">
          <el-date-picker
            v-model="ratefaciliTime"
            style="overflow: hidden;"
            unlink-panels
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="rabout2child"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item  label="从业时间"  class="rateFacilitabout2 is-required">
          <el-input-number v-model="form.employment_time"></el-input-number>
        </el-form-item>

        <el-form-item prop="rank" label="服务商级别" class="rateFacilitabout2">
          <el-select v-model="form.rank" clearable placeholder="请选择">
            <el-option
              v-show='sp_level'
              v-for="item in sp_level"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="合作产品" prop="pro_info" style="width: 1000px;" class='is-required hezuo'>
          <el-button type="primary" round @click="orderBtn" plain size="small" style="margin-left: 10px">增加产品</el-button>
          <br/>
          <el-table :data="faciliProdS" border style="width: 70%;" class='hezuoTable'>
            <el-table-column fixed prop="product_name" label="产品信息"  width="120"></el-table-column>
            <el-table-column fixed prop="balance_price_desc" label="结算标准"></el-table-column>
            <el-table-column fixed prop="price" label="价格"></el-table-column>
            <el-table-column fixed prop="brife" label="产品备注"></el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button @click.native.prevent="deleteRow2(scope.$index, faciliProdS)" type="text" size="small">
                  移除{{ratefaciliTime}}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

          <el-form-item  prop="remarks" label="公司介绍" class="is-required jieshaoCompont">
            <el-input type="textarea" :rows="3" v-model="form.remarks" placeholder="请输入设备数量或者生产力/设计或开发团队人数/材质说明（制作类）">
            </el-input>
          </el-form-item>
      </el-form>
        <span slot="footer">
            <el-button type="primary" @click="confirmAdd(form)">确 定</el-button>
            <el-button @click="dialogTableVisible = false">取 消</el-button>
        </span>
    </el-dialog>

    <el-dialog title="转移给他人" :visible.sync="dialognewPerson" :modal="false" width="500px">
        <el-form :model="person">
          <el-form-item prop="client" label="新负责人"  class="s_client_item">
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
          <el-button type="primary" @click="transferTrue">确 定</el-button>
          <el-button @click="dialognewPerson = false">取 消</el-button>
        </div>
      </el-dialog>

       <!-- 新增资质窗口 -->
      <el-dialog :visible.sync="qualificationWindow" :modal="false" width="700px">
        <el-form :model="qualification" ref="qualification" label-width="150px">
          <el-form-item label='资质类型'  class="is-required">
            <el-select v-model="qualification.quality_type" placeholder="请选择" class='s_client_width'>
              <el-option
                v-for="item in qualityArr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <div v-if='qualification.quality_type == 1||qualification.quality_type == 2'>
            <el-form-item label='编号' prop="quality_code"  class="is-required"
            >
              <el-input v-model="qualification.quality_code" class='s_client_width' placeholder="请输入编号"></el-input>
            </el-form-item>
              <el-form-item label='有效期' class="is-required"  prop="valid_time" 
              >
                <el-date-picker
                  :disabled='timedisabled'
                  type="daterange"
                  v-model="qualification.valid_time"
                  range-separator="~"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                   class='s_client_width111'
                  >
                </el-date-picker>
                <el-checkbox @change='longTime'>长期</el-checkbox>
            </el-form-item>
          </div>
           
          <div v-else-if='qualification.quality_type == 3||qualification.quality_type == 4'>
            <el-form-item label='开户行' class="is-required" prop="deposit_bank"
            >
                <el-input v-model="qualification.deposit_bank" placeholder="请输入开户行"></el-input>
            </el-form-item>
            <el-form-item label='银行账号' class="is-required" prop="bank_account"
            >
                <el-input v-model="qualification.bank_account" placeholder="请输入银行账号"></el-input>
            </el-form-item>
            <el-form-item label='开户名称' class="is-required" prop="account_name"
            >
                <el-input v-model="qualification.account_name" placeholder="请输入开户名称"></el-input>
            </el-form-item>
          </div>

          <div v-else>
            <el-form-item label='资质名称' class="is-required" prop="quality_name"
            >
                <el-input v-model="qualification.quality_name" placeholder="请输入资质名称"></el-input>
            </el-form-item>
          </div>

            <el-form-item label="附件 :" class='is-required'>
              <upload2 @fileStatus="fileStatus"  ref='fileDel' v-model="qualification.file" @fileTrue="fileTrue" :success="success">
              </upload2> 
            </el-form-item>

            <el-form-item label="备注 :">
              <el-input type="textarea" :rows="5" v-model="qualification.brife" placeholder="请输入内容" class='inputWarn2'></el-input>
            </el-form-item>
            <el-form-item style="margin-left: 300px;">
              <el-button type="primary" @click="qualificationWindowTrue('qualification')">确 定</el-button>
              <el-button @click="resetFormquali('qualification')">取 消</el-button>
            </el-form-item>
          </el-form>    
      </el-dialog>
      <!-- 新增评估 -->
      <el-dialog :visible.sync="speakWindow" :modal="false" width="700px">
       <el-form :model="ruleForm" ref="ruleForm" label-position="right" label-width="180px">
        <el-form-item class="is-required" label="关联执行" prop="project_id">
          <el-input  class="s_client_width" @focus.prevent="dialogFollow" v-model="project_name" placeholder="请选择"></el-input>
        </el-form-item>
        <el-form-item label="评分" prop="third_order_code" class="is-required">
          <el-input v-model="ruleForm.score" class="s_client_width"></el-input>
        </el-form-item>
        <el-form-item label="上传附件" class="is-required">
          <upload @fileStatus="fileStatus"  @fileTrue="fileTrue" :success="success"></upload>
        </el-form-item>
        <el-form-item label="备注" prop="detail">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model="ruleForm.remark"
            class="s_client_width">
          </el-input>
        </el-form-item>
        <el-form-item style="margin-left: 30%">
          <el-button type="primary" @click="approvalForm('ruleForm')">提交</el-button>
          <el-button  @click="speakWindowFalse">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="关联执行" :visible.sync="ProcessVisible" :modal="false" width="1000px">
        <el-form ref="formAdd" :model="formAdd">

          <el-form-item class='searchsome'>
            <el-input v-model="formAdd.manage_number" clearable placeholder="请输入执行编号" class="addInput"></el-input>
          </el-form-item>

          <el-form-item class='searchsome'>          
            <el-input v-model="formAdd.order_code" clearable placeholder="请输入订单编号" class="addInput"></el-input>
          </el-form-item>

          <el-form-item class='searchsome'>          
            <el-input v-model="formAdd.client_name" clearable placeholder="请输入客户名称" class="addInput"></el-input>
          </el-form-item>  
          
          <el-form-item class='searchsome'>          
             <el-cascader
                expand-trigger="hover"
                filterable
                :options="product"
                 placeholder="请选择产品" 
                 :show-all-levels="false"
                 clearable
                @change="handleChange122"
              >
              </el-cascader>
          </el-form-item> 

          <el-form-item class='searchsome searchsome222'> 
            <el-select  v-model="formAdd.log_status" clearable placeholder="请选择执行状态" clearable>
                <el-option
                  v-for="item in itemState"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
            </el-select> 
          </el-form-item>          
          <el-button class='searchsome22' type="primary" @click="dialogFollow('formAdd')">查询</el-button>
        </el-form>
        <el-table :data="tableData" style="width: 100%;padding-top: 30px;" @row-click="handleClick2">
          <el-table-column prop="manage_number" label="工单编号"></el-table-column>
          <el-table-column prop="order_code" label="订单编号"></el-table-column>
          <el-table-column prop="client_name" label="客户名称"></el-table-column>
          <el-table-column prop="product_name" label="产品信息"></el-table-column>
          <el-table-column prop="product_brief" label="产品说明"></el-table-column>
          <el-table-column prop="price" label="产品金额"></el-table-column>
          <el-table-column prop="log_status" label="进度"></el-table-column>
          <el-table-column prop="nickname" label="负责人"></el-table-column>
          <el-table-column prop="provider_name" label="执行人"></el-table-column>
          <el-table-column prop="customerDrive" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="formAdd.currentPage"
                :page-size="formAdd.pageSize"
                layout="sizes, prev, pager, next"
                :total="count">
        </el-pagination>
      </el-dialog>

  </div>
</template>

<script>
  import contacts from '../.././components/s_customer/contacts';
  import annexList from '../.././components/s_customer/annexList';
  import upload from '../.././components/s_customer/fiieDataCe';
  import upload2 from '../.././components/s_customer/fiieDataCe2';

  import Util from '@/libs/util';

  export default {

    components: { contacts,annexList,upload,upload2 },

    data () {
      return {
        x_form:{

        },
        ProcessVisible:false,
        // 新增资质
        qualificationWindow:false,
        qualification:{
          file:[]
        },
        qualityArr:[],
        timedisabled:false,
        fileShow:true,

        numberShiYan2:[],
        pricetype:[],
        price_type:[],
        contactPro:{
          balance_price:1,
          price_type:1,
          balance_price_desc:'固定价格'
        },
        ratefaciliTime : [],
        optionsTypeNum:'',
        optionsType:[
          {
            id:0,
            name:'无效'
          },
          {
            id:1,
            name:'有效'
          }
        ],
        begin_time:'',
        end_time:'',
        caseData:[],

        ruleForm:{
          provider_id:this.$route.params.id,
          excutor_id:'',
          score:'',
          file:[],
          remark:''
        },
        ruleFormP:'0',
        ruleFormO:'0',
        person_choice:[],
        // dialogFormTime:true,

        success:false,
        button_root: false,
        tabsName: 'clientDet',
        fileList: [],
        partner_person:[], //负责人
        manage_percent:[],
        partner_dept:'',   //部门
        // clild:'',
        // 服务商详情展示的数据
        faciliDate: {
        },
        contacts_type:[],
        // 修改客户数据后台需要的参数
        form : {
          name: '',       // 客户行业
          type: '',         // 客户来源
          city: [],           // 客户级别
          valid_date: [],          // 公司规模
          employment_time: 0,       // 公司省市地址
          rank: '',        // 公司详细地址
          service_region: '',             // 客户id
          remarks:'',      //后加的字段（咨询方式）
          products:[
          ],
          provider_id:this.$route.params.id
        },
        // 新加联系人后台需要的数据
        contact : {
          user_name: '',
          contact_type: '',
          contact_number: '',
          provider_id: this.$route.params.id
        },
        faciliProdS:[],
        radio9:1,
        rank: [],                            // 客户级别的存放数据
        industry: [],                        // 客户行业的存放数据
        source: [],                         // 客户来源的存放数据
        scale: [],                          // 客户公司规模存放数据
        location: [],                       // 客户地址存放数据
        dialogTableVisible: false,          // 客户详情修改弹窗的显示
        dialogTablePeole: false,                 // 添加联系人弹窗的显示
        tabPosition: 'top',
        contactList: [],                    // 联系人列表数据
        selectedOptions:'',                // 转移客户绑定的数组值
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
        orderBtnDilog:false,
        textarea: '',                   // 附件的备注信息

        product:[],

        // 表格数据
        tableData: [{}],
        numberShiYan:'',
        orderData: [],
        projectData: [],
        addBtn:1,
        //附件
        file: [],
        button_transfer:'',
        dialognewPerson:false,
        provider_id:[this.$route.params.id],
        personId:'',
        region:[],
        page:1,
        count:1,
        perPage:1,
        speakWindow:false,
        project_name:'',
        formAdd:{
          perPage:10,
          page:1,
          manage_number:"",
          order_code:'',
          client_name:'',
          product_id: '',
          currentPage: 1,
          log_status:''
        },
        itemState:[
          { id: 1, name: '待启动' },
          { id: 2, name: '进行中' },
          { id: 3, name: '初稿提交' },
          { id: 4, name: '修改中' },
          { id: 5, name: '定稿' },
          { id: 6, name: '已完成' },
          { id: 7, name: '已暂停' },
          { id: 8, name: '已退款' }
        ],
        sp_level:[]
      }
    },
    computed:{
      persons () {
        return this.$store.state.app.commonPerson;
      }
    },
    methods: {
      delDetail(index, row){
        console.log(index,row)
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post('serviceProvider/qualityDel', {quality_id:row[index].quality_id})
                        .then((data) => {
                            if(data.code) {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                row.splice(index, 1);
                            }
                        })
                        .catch(() => {
                            this.$message.error('服务器错误，请稍后重试');
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
      },
      changeStatus(val){
        this.$post( 'serviceProvider/changeStatus',{provider_id:this.$route.params.id,status:val})
              .then( (data) => {
                 if(data.code){
                   this.$message({
                        message: data.content,
                        type: 'warning'
                    });
                 }
              })
              .catch(() => {
                this.$message({
                        message: data.errorMsg,
                        type: 'warning'
                    });
              });
      },
      speakWindowFalse(){
        this.speakWindow = false;
        this.ruleForm = {}
        },
      // 新增评估
      addSpike(){
        this.speakWindow = true;
      },
       approvalForm (ruleForm) {
        this.ruleForm.provider_id = this.$route.params.id;
        if (!this.ruleForm.excutor_id) {
          this.$message({
            message: '请选择关联项目',
            type: 'warning'
          })
        } else if (!this.ruleForm.score) {
          this.$message({
            message: '请填写评分',
            type: 'warning'
          })
        }  else if (this.ruleForm.file.length==0) {
          this.$message({
            message: '请选择附件',
            type: 'warning'
          })
        } else if (this.ruleForm.file.length>1) {
          this.$message({
            message: '只能选择一个附件',
            type: 'warning'
          })
        } else {
          this.$post('serviceProvider/addEvaluate', this.ruleForm)
            .then((data) => {
              if(data.code){
                this.$message({
                  message: '操作成功',
                  type: 'success'
                });
                this.success = true;
                this.ruleForm = {};
                this.speakWindow = false;
                this.tabsName = 'clientOrder';
                this.spikeList();
              }else {
                this.$message.error(data.errorMsg);
              }
            })
            .catch(() => {
              this.$message.error('服务器出错，请稍后重试')
            })
        }
      },
      // 关联执行弹出弹窗
      dialogFollow(){
        this.orderlistClick();
        this.formAdd.provider_id = this.$route.params.id
        this.formAdd.currentPage = 1;
        this.ProcessVisible = true;
        console.log(this.formAdd)
        this.$get("serviceProvider/correlationExecution",this.formAdd)
          .then((data)=>{
            console.log(data)
            this.tableData = data.content.data;
            this.count = data.content.count;
          })
          .catch(()=>{})
      },
      //评估列表
      spikeList(){
          this.$get( 'serviceProvider/evaluateList',{provider_id:this.$route.params.id})
            .then((data) => {
                if(data.code){
                  this.orderData = data.content;
              }else{
                this.$message({
                      message: data.errorMsg,
                      type: 'warning'
                  });
              }
          })
          .catch(() => {})
      },
        // 选择
      handleClick2(row) {
        this.ruleForm.excutor_id = row.excutor_id;
        this.project_name = row.client_name;
        this.ProcessVisible = false;
      },

      // 新增资质
      addQuali(){
         if(this.qualification.file.length > 0){
          this.$refs.fileDel.delOssFile2(this.qualification.file[0].path);
        }
        this.selectDataFunc();
        this.qualification = {
                quality_type:1,
                name:'',
                quality_code:'',
                valid_type:1,
                valid_time:[],
                file:[],
                brife:'',
                deposit_bank:'',
                bank_account:'',
                account_name:'',
                quality_name:''
            }
        this.qualificationWindow = true;

      },
       qualityList(){
        this.$get( 'serviceProvider/qualityList',{providers_id:this.$route.params.id})
          .then((data) => {
              if(data.code){
                console.log(data.content)
                this.projectData = data.content.list;
                this.addBtn = data.content.add_button;
              }else{
                  this.$message({
                        message: data.errorMsg,
                        type: 'warning'
                    });
              }
          })
          .catch(() => {})
      },

      selectDataFunc(){
        this.$get( 'serviceProvider/selectData')
          .then((data) => {
              if(data.code){
                this.qualityArr = data.content;
              }else{
                  this.$message({
                        message: data.errorMsg,
                        type: 'warning'
                    });
              }
          })
          .catch(() => {})
      },
      longTime(data){
        this.qualification.valid_time = [];
        if(data){
         this.timedisabled=true;
        this.qualification.valid_type = 2;
        }else{
         this.timedisabled=false;
        this.qualification.valid_type = 1;
        }
      },
      resetFormquali(){
        this.qualificationWindow = false;
      },
       // 新增资质
      qualificationWindowTrue(){
        console.log(this.qualification)
        this.qualification.providers_id = this.$route.params.id;
         if(!this.qualification.quality_type){
            this.$message({
              message: '请选择资质类型',
              type: 'warning'
            });
          }else if((this.qualification.quality_type == 1||this.qualification.quality_type == 2) && !this.qualification.quality_code){
            this.$message({
              message: '请填写编号',
              type: 'warning'
            });
          }else if((this.qualification.quality_type == 1||this.qualification.quality_type == 2) && this.qualification.valid_time.length == 0 && this.qualification.valid_type==1){
            this.$message({
              message: '请选择有效期',
              type: 'warning'
            });
          }else if((this.qualification.quality_type == 3||this.qualification.quality_type == 4)&&!this.qualification.deposit_bank){
              this.$message({
                message: '请输入开户行',
                type: 'warning'
              });
            }else if((this.qualification.quality_type == 3||this.qualification.quality_type == 4)&&!this.qualification.bank_account){
              this.$message({
                message: '请输入银行账号',
                type: 'warning'
              });
            }else if((this.qualification.quality_type == 3||this.qualification.quality_type == 4)&&!this.qualification.account_name){
              this.$message({
                message: '请输入开户名称',
                type: 'warning'
              });
            }else if((this.qualification.quality_type == 5||this.qualification.quality_type == 6||this.qualification.quality_type == 7) && !this.qualification.quality_name){
           
            this.$message({
              message: '请输入资质名称',
              type: 'warning'
            });
            }else if((this.qualification.quality_type !== 4 || this.qualification.quality_type !== 2) && this.qualification.file.length == 0){
              this.$message({
                message: '请上传相关附件',
                type: 'warning'
              });
           }else if((this.qualification.quality_type !== 4 || this.qualification.quality_type !== 2) && this.qualification.file.length > 1){
              this.$message({
                message: '附件只能上传1个，请删除多余附件',
                type: 'warning'
              });
           }else{
              this.qualificationWindow = false;
              // let pro_arr = this.qualityArr;
              // for (const i in pro_arr) {
              //   if (pro_arr[i].id == this.qualification.quality_type) {
              //     this.qualification.quality_name = pro_arr[i].name;
              //   }
              // }
                this.$post('serviceProvider/addQuality',this.qualification)
                .then((data)=> {
                    if(data.code) {
                        this.$message({
                            type: 'success',
                            message: '添加成功!'
                        });
                        this.qualityList();
                    }else {
                        this.$message({
                            type: 'warning',
                            message: data.errorMsg
                        });
                    }
                    this.tabsName = 'clientItem';
                })
                .catch(()=>{
                    this.$message.error('服务器错误，请稍后重试')
                })
        }
      },

      tabType(data){
        this.contactPro.balance_price = data;
        if(data == 1){
          this.contactPro.balance_price_desc = '固定价格';
        }else if(data == 2){
          this.contactPro.balance_price_desc = '分成比例';
        }else if(data == 3){
          this.contactPro.balance_price_desc = '询价';
        }
      },
        // 产品信息
        orderlistClick(){
          this.$get( 'crmManagement/order/index',this.searchData)
            .then( (data) => {
                this.product = data.content.product;
            })
            .catch(() => {
            });
      },
      orderBtn(){
          this.orderBtnDilog = true;
      },
      deleteItems(){
      //删除订单
        this.$confirm('确认删除该订单?删除后不可恢复, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.$post('serviceProvider/delProvider',{provider_id:this.$route.params.id})
                .then((data)=> {
                    if(data.code) {
                        this.$message({
                            message: data.content,
                            type: 'success'
                        });
                          location.reload()
                          this.$router.push({
                          name: 'facilitatorList'
                        });
                        
                    }else {
                        this.$message({
                            type: 'warning',
                            message: data.errorMsg
                        });
                    }
                })
                .catch(()=>{
                    this.$message.error('服务器错误，请稍后重试')
                })

        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });
        });
      },
      // 转移给他人
      newPerson(){
        this.dialognewPerson = true;
      },
       handleClick(tab, event) {
        //  this.caselist(tab, event)
        console.log(tab, event)
         if(tab.index == 1){
           this.qualityList();
         }else if(tab.index == 2){
           this.spikeList();
         }else if(tab.index == 3){
           console.log(1)
           this.caselist()
         }else if(tab.index == 4){
           this.caselist('2')
         }

      },
      handleSizeChange (val) {
        this.perPage = val;
        this.caselist();
      },
      handleCurrentChange (val) {
        this.page = val;
        this.caselist();
      },
      // 案例点击事件
      clicklist (item) {
        this.$router.push({name:'caseDetail',params:{id:item.id}})
      },
      // 点赞
      //点赞
      pointPraise(item){
        if(!item.is_praise){
          this.$put('case/praise/' + item.id)
            .then((data) => {
              if(data.code){
                this.$message({
                  message:data.errorMsg,
                  type: 'success',
                });
                this.caselist();
              }else{
                this.$message.error(data.errorMsg);
              }
            })
            .catch( () => {
              this.$message.error('服务器错误，请稍后重试');
            })
        }else {
          this.$message({
            message: '您已经点过赞了',
            type: 'warning'
          });
        }
      },
      // 服务商案例
      caselist (typeNum) {
        console.log(typeNum)
        this.x_form.count = this.count;
        this.x_form.provider_id = this.$route.params.id;
        if(typeNum){
            this.x_form.case_type = typeNum;
        }
        console.log(this.x_form)
        this.$get('case',this.x_form)
          .then((data) => {
            console.log(data)
            if(data.code){
              let list = data.content.caseList;
              this.caseData = list.data;
              // this.caseTop = data.content;
              // this.product = data.content.product;
              this.page = list.page;
              this.perPage = list.perPage;
              // this.pageNums = list.pageNums;
              this.count = list.count;
            }else{
              this.$message.error(data.errorMsg);
            }
          })
          .catch( () => {})
      },

      // dialogFormTimeF(){
      //   this.$post('client/editSuccessTime',this.r_data)
      //     .then((data) => {
      //       if(data.code) {
      //         this.$message({
      //           message: '修改成功！',
      //           type:'wraning',
      //         });
      //            this.dialogFormTime = false;
      //         setTimeout(() => {
      //             this.$router.go(0);
      //         }, 50);
      //       }else {
      //         this.$message({
      //           message: data.errorMsg,
      //           type:'wraning',
      //         })
      //       }
      //     })
      //     .catch(() => {

      //     })
      // },
      //oss
      fileStatus(data) {
        this.qualification.file = data;
        this.ruleForm.file = data;
      },
      fileTrue(data) {
        this.success = data;
      },
      // 负责人的级联选择
      handleChange(value) {
        this.personId = value;
      },
      handleChange122(data){
        this.formAdd.product_id = data[1]
      },

      handleChange123(data){
        let pro_arr = this.product;
        this.numberShiYan = data[1];
        this.contactPro.product_id = this.numberShiYan;

            for(let i = 0; i < pro_arr.length; i++){
              for(let j = 0; j < pro_arr[i]['children'].length; j++){
                  if(pro_arr[i]['children'][j]['value'] == this.numberShiYan){
                    this.contactPro.product_name = pro_arr[i]['children'][j]['label'];
                }
              }
            }
      },
      // 资质
      itemDetail (index,row) {
        window.open(row.file_path);
      },
      // 评估
      orderDetail (row) {
        console.log(row)
        window.open(row.file_path);
      },
      delOrderDetail (index,row) {
        console.log(index,row)
        let id = this.$route.params.id
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post('serviceProvider/delEvaluate', {provider_id:id,evaluate_id:row[index].evaluate_id})
                        .then((data) => {
                          console.log(data)
                            if(data.code) {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                row.splice(index, 1);
                            }
                        })
                        .catch(() => {
                            this.$message.error('服务器错误，请稍后重试');
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
      },
      // 转移给他人
      transferTrue(){
        const provArr = []
        provArr.push(this.$route.params.id);
        this.$post( 'serviceProvider/changePerson', {provider_id: provArr, change_dd_id: this.personId})
          .then( (data) => {
            if(data.code){
              // this.$parent.eventFromChild;
                this.$message({
                  type: 'success',
                  message: data.content
                });
                this.change_dd_id = '';
                this.dialognewPerson = false;

                setInterval(() => {
                   this.$router.push({
                      name: 'facilitator'
                    })
                  location.reload()
                }, 100);
               
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
      // 删除联系人
      deleteRow(index, rows) {
        if(rows.length > 1){
          this.$post( 'serviceProvider/delContact',{provider_id :this.$route.params.id,provider_contact_id:rows[index].provider_contact_id})
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
       // 移除产品
      deleteRow2(index, rows) {
        console.log(index,rows)
        if(rows.length > 1){
          rows.splice(index, 1);
          // this.$post( 'serviceProvider/delContact',{provider_id :this.$route.params.id,provider_contact_id:rows[index].provider_contact_id})
          //   .then ( (data) => {
          //     if(data.code){
          //       this.$message({
          //         message: data.errorMsg,
          //         type: 'success'
          //       });
          //       rows.splice(index, 1);
          //       this.clientAdd();
          //     }
          //   })
          //   .catch (() => {
          //     this.$message.error('服务器错误，请稍后重试');
          //   })

        } else {
          this.$message({
            message: '联系人最少有一个',
            type: 'warning'
          });
        }
      },
      // 增加产品
      confirmPrudoct(){
        if(!this.contactPro.product_id && !this.contactPro.product_name){
          this.$message.error('请选择产品信息');
        }else if(this.contactPro.balance_price ==2 && (this.contactPro.price>100)){
            this.$message.error('分成比例不能大于100');
        }else if(this.contactPro.balance_price !=3 && !this.contactPro.price) {
          this.$message.error('请填写价格或分成比例');
        }else{
          if(this.contactPro.balance_price == 2){
            this.contactPro.price = this.contactPro.price + '%'; 
          }
          this.contactPro.provider_product_id = 0;
          this.faciliProdS.push(this.contactPro);
          this.orderBtnDilog = false;
          this.contactPro ={
            balance_price:1,
            price_type:1,
            balance_price_desc:'固定价格'
          },
          this.numberShiYan = '';
          this.numberShiYan2 = [];
        }
      },
      // 确定添加联系人接口
      confirmPeople () {
        if(!this.contact.user_name){
          this.$message.error('联系人姓名不能为空，请输入联系人');
        } else if(!this.contact.contact_type) {
          this.$message.error('联系方式不能为空，请选择联系方式');
        } else if (!this.contact.contact_number){
          this.$message.error('联系信息不能为空，请输入联系信息');
        } else {
          this.$post( 'serviceProvider/addContact',this.contact)
            .then( (data) => {
              if(data.code){
                this.$message({
                  message: data.content,
                  type: 'success'
                });
                this.dialogTablePeole = false;
                this.contact = { 
                  user_name: '',
                  contact_type: '',
                  contact_number: '',
                  provider_id: this.$route.params.id
                };
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
      // 打开修改服务商信息的弹窗
      dialogOpen () {
        this.orderlistClick();
        this.dialogTableVisible = true;
      },
      // 新增订单
      addOrder() {
        this.$router.push({name: 'addOrder'})
      },
      // 保存修改的客户信息
      confirmAdd () {
        console.log(this.form)
        // this.form.provider_id
        this.form.valid_date = this.ratefaciliTime;
        this.form.products = this.faciliProdS;
        if (!this.form.name) {
          this.$message({
            message: '请填写公司名称',
            type: 'warning'
          });
        } else if (!this.form.type) {
          this.$message({
            message: '请选择类型',
            type: 'warning'
          });
        } else if (!this.form.city) {
          this.$message({
            message: '请选择城市',
            type: 'warning'
          });
        } else if (!this.form.valid_date) {
          this.$message({
            message: '请选择合作有效期',
            type: 'warning'
          });
        } else if (!this.form.employment_time) {
          this.$message({
            message: '请填写从业时间',
            type: 'warning'
          });
        } else if (!this.form.remarks) {
          this.$message({
            message: '请填写公司介绍',
            type: 'warning'
          });
        } else {
          this.$post( 'serviceProvider/editBaseInfo',this.form)
            .then( (data) => {
              if(data.code){
                console.log(data)
                this.$message({
                  message: data.content,
                  type: 'success'
                });
                this.dialogTableVisible = false;
                this.clientAdd();
              } else {
                this.$message.error(data.content);
              }
            })
            .catch(() => {
              this.$message.error('服务器错误，请稍后重试');
            })
        }
      },
      // 服务商详情的所有数据请求
      clientAdd () {
        this.$get( 'serviceProvider/baseInfo',{provider_id:this.$route.params.id})
          .then( (data) => {
            if(data.code){
            this.optionsTypeNum = data.content.base_info.status;
            this.faciliDate = data.content.base_info;

            // provider_id和valid_date 最后赋值
            this.form.name = data.content.base_info.name;
            if(data.content.base_info.type == '企业'){
              this.form.type = 1;
            }else if(data.content.base_info.type == '个人'){
              this.form.type = 2;
            }
            this.form.city = data.content.base_info.pro_city_id;
            this.form.employment_time = data.content.base_info.employment_time;
            this.form.rank = data.content.base_info.rank;

            this.form.service_region = data.content.base_info.province_id;
            this.form.remarks = data.content.base_info.remarks;

            this.ratefaciliTime[0] = new Date(data.content.base_info.begin_time*1000);
            this.ratefaciliTime[1] = new Date(data.content.base_info.end_time*1000);
            this.provider_id.push(data.content.base_info.provider_id);
            this.begin_time = this.timestampToTime(data.content.base_info.begin_time);

            this.end_time = this.timestampToTime(data.content.base_info.end_time);
this.ratefaciliTime[0] = this.begin_time;
this.ratefaciliTime[1] = this.begin_time

            console.log(this.begin_time)

            this.operation = data.content.opera_list;
            this.contactList = data.content.contacts;
            this.faciliProdS = data.content.products;
              }
            
          })
          .catch(() => {
            this.$message.error('服务器错误3，请稍后重试');
          })
      },
      // 城市等
       client_show(){
        this.$get( 'serviceProvider/getSelData')
          .then((data) => {
              if(data.code){
                this.price_type = data.content.price_type;
                this.pricetype = data.content.balance_price;
                this.rank = data.content.sp_type;
                let region = data.content.region;
                this.region = Util.obj2Arr(region);
                this.sp_level = data.content.sp_level;

                this.contacts_type = data.content.contacts_type;
              }else{
                  this.$message({
                        message: data.errorMsg,
                        type: 'warning'
                    });
              }
          })
          .catch(() => {})
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
        let id = this.$route.params.id
        this.$router.push({
          name: 'addCase',
          params:{
            excutor_type:2,
            id:id
          }
        })
      },
      addAboatCase(){
        this.$router.push({
          name: 'addCaseOrder',
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
      },
      timestampToTime(timestamp) {
          var date = new Date(parseInt(timestamp) * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
          return date.getFullYear()+ '-' + (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'+date.getDate() + ' ';
      },
    getLocalTime(nS) {     
       return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");      
      } 
    },
    created(){
      this.clientAdd();
      this.client_show();      
      this.personList();
      this.annexUpload();
    }
  }
</script>

<style lang="less">
  .facilitatorDetails{
    .pricePrepend{
      width: 59%;
    }
    .priceAppend1{
      width: 22%;
    }
    .priceAppend{
      width: 36%;
    }
    .typeStyle{
      width: 90%;
      float: right;
    }
    .s_details_title {
      float: left;
      font-size: 20px;
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

    .el-icon-edit:hover {
      cursor: pointer;
    }
    .name-wrapper {
      display: inline !important;
    }
    .el-step {
      flex-basis: 80px !important;
      height: 80px;
    }
    .s_client_sel_div {
      width: 80%;
    }
    .s_order_search2{
      width: 256px;
    }


// 新增服务商
.rightSeleF{
  display: inline-block;
  float: right;
  width: 10%;
}
 .x_case_img{
    width: 24.25%;
    float: left;
    margin: 20px auto;
    margin-right: 1%;
  }
  .x_case_img:nth-child(4n){
    margin-right: 0px;
  }
  .x_case_img:nth-child(4n+1){
    margin-left: 0px;
  }
  .x_case_img p{
    height: 30px;
    line-height: 35px;
    font-size: 14px;
  }
   .x_case_img p span{
    float: right;
    margin-right: 5px;
  }
    .x_lable_img{
    background: url("../../.././images/parse.png") no-repeat;
    background-position: 18px 5px;
  }
  .x_lable_img b{
    margin-left: 35px;
  }
  .x_lable_img:hover{
    cursor: pointer;
  }
    .x_lable_img1{
    background: url("../../.././images/parses.png") no-repeat;
    background-position: 18px 5px;
  }
  .x_lable_img b{
    margin-left: 35px;
    color:#ccc;
  }
  .x_lable_img1 b{
    color:#f92d54;
  }
   .x_lable{
    display: inline-block;
    width: 50px;
    height: 24px;
    border-radius: 15px;
    border: 1px solid #99d4ff;
    font-size: 12px;
    line-height: 24px;
    color:#99d4ff;
  }
   .tpr{
    display: inline-block;
    text-align: center;
    width: 80px;
    height: 24px;
    border-radius: 15px;
    font-size: 12px;
    line-height: 24px;
    background: #f8f8f8;
  }
   .Designer{
    height: 15px !important;
    border-top: 1px solid #eee;
  }
   .publisher{
    display: inline-block;
    width: 24%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .image:hover{
    cursor: pointer;
  }
   .image {
    width: auto;
    display: block;
    height: 186px;
    margin: 0 auto;
    max-width: 100%;
  }
  .rateFacilitabout{
    display:inline-block;
    width:32%;
    .el-form-item__label{
      text-align: left;
    }
    

    .el-form-item__content{
      width:95%;
      margin-left:0 !important; 
      .el-select,.el-cascader{
      width: 100%
     }
    }
  }
  .rateFacilitabout2{
    width:32%;
    display:inline-block;

    .el-form-item__label{
      text-align: left;
    }
     .el-form-item__content{
      width:95%;
      margin-left:0 !important; 

      .rabout2child{
        width: 100%;
      }
      .el-select{
        width: 100%;
      }
    }
    .el-input-number{
      width: 100%;
    }
  }
  .ischeese{
    width:80%;
  }
  .addProdut{
      width:80%;
  }
  .searchsome{
      display: inline-block;
      width: 15%;
  }
.addInput{
      width: 100%;
      margin: 0 2%;
    }
    .searchsome222{
      width: 15%;
      margin: 0 2%!important;
    }
    .tabH3{
      font-size:20px;
    }
    .zizhiMessage{
      
    }
    .solidAll{
      width:100%;
      padding: 10px 0;
      border-top: 1px solid #e4e4e4;
    }
  
  }
    .dialogcompany{
        margin-left: 30px !important;
    }
    .dialogcompany2 .el-dialog__title{
            margin-left: 20px !important;
    } 
    .hezuo{
      .el-form-item__content{
        margin-left: 0px!important;
          }
      .hezuoTable{
        margin: 20px 0;
      }
      .el-form-item__label{
        text-align: left;
      }
    }
    .jieshaoCompont{
      .el-form-item__label{
        text-align: left;
      }
      .el-form-item__content{
        margin-left:0 !important;
      }
      
    }
    .s_client_width111{
        width: 300px!important;
      }
    
</style>
