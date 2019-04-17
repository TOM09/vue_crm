<template>
	<div>
		<!-- 共用弹窗 -->
		<el-dialog :visible.sync="mydialogAll1" :modal="false" @close='cancel' :title="dialogValChildTitle" width="550px" @open='whenOpen'>

			<div v-if="dialogValChildTitle == '首付款确认'">
					<el-form ref='r_data' label-position="right" label-width="120px" :model="r_data">
						<el-form-item label="是否有首付款 :" >
							<el-switch active-text='是' class='is_firstPrice' inactive-text='否' active-color="#5B7BFA" inactive-color="#dadde5" v-model="r_data.first_pay">
							</el-switch>
						</el-form-item>

						<div v-if="r_data.first_pay">
							<el-form-item label="回款时间 :" class='is-required'>
								<el-date-picker type="date" placeholder="请选择" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" v-model="r_data.pay_time">
								</el-date-picker>
							</el-form-item>

							<el-form-item label="回款期数 :" class='is-required'>
								<el-select placeholder="请选择" v-model="r_data.pay_count" class='el-date-editor'>
									<el-option v-for="item in pay_periods" :key="item.value" :value="item.value" :label='item.label'>
									</el-option>
								</el-select>
							</el-form-item>

							<el-form-item label="回款金额 :" class='is-required'>
								<el-input placeholder="￥请输入" v-model="r_data.pay_price" class='el-date-editor'>
								</el-input>
							</el-form-item>

							<el-form-item label="回款方式 :" class='is-required'>
								<el-select placeholder="请选择" v-model="r_data.pay_type" class='el-date-editor'>
									<el-option v-for="item in paytype" :key="item.value" :value="item.value" :label='item.label'>
									</el-option>
								</el-select>
							</el-form-item>
						</div>	
							<el-form-item label="备注说明 :">
								<el-input v-model="r_data.pay_remarks" type="textarea" :rows="5" class='el-date-editor'>
								</el-input>
							</el-form-item>
					</el-form>
				</div>

        <div v-else-if="dialogValChildTitle === '提交'">
            <div class='spaceBox'></div>
            <el-form label-position='right' label-width="120px" :model="r_data">
              <el-form-item label="合同是否签订 :">
                <el-switch
                  active-text='是'
                  inactive-text = '否'
                  active-color="#5B7BFA"
                  inactive-color="#dadde5"
                  :rows="5"
                  v-model="r_data.contract"
                  >
                </el-switch>
              </el-form-item>

              <el-form-item label="申请说明 :" class='is-required'>
                <el-input    
                  placeholder="请输入"              
                  type="textarea"
                  class="s_item_form elText"
                  :rows="5"
                  v-model="r_data.description" 
                  >
                </el-input>
              </el-form-item>

		<el-dialog title="新增附件" :visible.sync="fileNewDialog" :modal="false" width='500px'>
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

		<el-button type="text"  @click="fileNew">新增附件</el-button>
          <el-table :data="annexData" style="width: 100%">
            <el-table-column fixed prop="name" label="附件名称"></el-table-column>
            <el-table-column prop="person" label="创建人"></el-table-column>
            <el-table-column prop="size" label="大小"></el-table-column>
            <el-table-column prop="brife" label="备注"></el-table-column>
            <el-table-column prop="create_time" label="创建时间"></el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button :disabled="(!scope.row.delete)" type="text" size="small" @click.native.prevent="deleteFile(scope.$index, annexData)">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
              </el-form>  
          </div>
         	<div v-else-if="dialogValChildTitle == '开始执行'">
            	<el-form :model="r_data" >
					<el-form-item label="备注说明 :" label-width="82px">
						<el-input    
								placeholder="请输入"              
								type="textarea"
								:rows="5"
								class="elText"
								v-model="r_data.remarks" 
								>
						</el-input>
					</el-form-item>

						<el-form-item label="附件 :" class='upLoad2'>
							<upload @fileStatus="fileStatus"  @fileTrue="fileTrue" :success="success" v-model="r_data.file" ></upload>
							<span class='moreName'>支持扩展名：.rar .zip .doc .docx .pdf .jpg...</span>
						</el-form-item>

						<el-form-item label="附件备注 :" label-width="82px">
							<el-input    
									class="elText"
									placeholder="请输入"              
									type="textarea"
									:rows="5"
									v-model="r_data.brief" 
									>
						</el-input>
					</el-form-item>
			</el-form>  
          </div>

		<div v-else-if="dialogValChildTitle == '分单'" class='CustomerLeaderAllbox'>
          <el-form label-position="right" label-width="140px" :model="r_data" ref = 'r_data'>
					<!-- :rules="[{ required: true, message: '请选择一位客服负责人',trigger:'blur'}]"  -->
				 <el-form-item label="客服负责人 :" class='is-required' 
				 	prop="customerBoos">
					<el-select class="inputWarn" filterable clearable placeholder="请选择" v-model='r_data.client_director_id'>
						<el-option
							v-for="item in person"
								:key="item.dd_id"
								:label="item.nickname"
								:value="item.dd_id">
						</el-option>
					</el-select>				
				</el-form-item>

				<el-row v-for="(item,index) in r_data.excutor_detail" :key="index" class='executivePartyFather'>
					<div class='deleteWorkBtnFather'>
						<span>执行明细{{index+1}}</span>
				        <el-button  type='text' v-if =" r_data.excutor_detail.length > 1" @click='deleteWork(index)' class='deleteWorkBtn'>删除</el-button>	
					</div>

					<div class="dialogSolid"></div>  												
                  <el-form-item label="执行方 :" class='is-required'  :prop="'excutor_detail.' + index + '.service_type'">
                    <el-radio-group v-model="item.service_type">
                      <el-radio label=1>自营团队</el-radio>
                      <el-radio label=2>服务商团队</el-radio>
                    </el-radio-group>
                  </el-form-item>

                 <el-form-item label="执行负责人 :" class='is-required'  
				 	 :prop="'excutor_detail.' + index + '.excutor_leading'" 
					  :rules="[{ required: true, message: '请选择一位执行负责人',trigger:'blur'}]"
					  v-if="item.service_type == 1">
                    <el-select class="inputWarn" placeholder="可选择一位执行负责人" v-model="item.excutor_leading" filterable clearable>
                        <el-option
                          v-for="item in person"
                          :key="item.dd_id"
                          :label="item.nickname"
                          :value="item.dd_id">
                        </el-option>									
                      </el-select>
                  </el-form-item>

                  <el-form-item label="服务商负责人 :" class='is-required' 
				  	:rules="[{ required: true, message: '请选择一位服务商负责人',trigger:'blur'}]"
				  	:prop="'excutor_detail.' + index + '.excutor_leading'" v-if="item.service_type == 2">
                    <el-select class="inputWarn" placeholder="可选择一位服务商负责人" v-model="item.excutor_leading" filterable clearable>
                        <el-option
                          v-for="item in person"
                          :key="item.dd_id"
                          :label="item.nickname"
                          :value="item.dd_id">
                        </el-option>									
                      </el-select>
                  </el-form-item>
                  <el-form-item label="服务商 :" v-if="item.service_type == 2" :prop="'excutor_detail.' + index + '.provider_id'">                     
                    <el-select class="inputWarn"
						filterable
						clearable
						allow-create
						placeholder="可选择一个服务商"
						v-model="item.provider_id" 
						>
                        <el-option
                          v-for="item in CustomerBudinessMan"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>									
                      </el-select>
                  </el-form-item>

                <el-form-item label="产品信息 :" class='is-required'
				:rules="[{ required: true, message: '请选择产品信息',trigger:'blur'}]"
				 :prop="'excutor_detail.' + index + '.product_id'">
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
				 :prop="'excutor_detail.' + index + '.product_brief'">
                    <el-input    
                        placeholder="请输入"              
                        type="textarea"
                        :rows="3"
                        class="inputWarn"
                        v-model="item.product_brief"
                        >
                    </el-input>
                </el-form-item>

                <el-form-item label="合同价格 :" class='is-required'
					:rules="[{ required: true, message: '请填写合同金额，且拆分的合同金额之和应等于执行工单的金额'},
							{ type: 'number', message: '合同金额必须为数字值'}]"
				 	:prop="'excutor_detail.' + index + '.price'">
                  <el-input-number
                      type="text"
                      placeholder="￥请输入"
                      class="inputWarn"
                      v-model.number="item.price"
                      >
                  </el-input-number>
                </el-form-item>
				
					</el-row>

					<el-button @click='addWork' >新增明细</el-button>
					<div class='spaceBox'></div>
					<el-form-item label="分配说明 :">
						<el-input    
							placeholder="请输入"              
							type="textarea"
							:rows="5"
							class="elText"
							v-model="r_data.remarks" 
							>
						</el-input>
					</el-form-item>

					<el-form-item label="附件 :">
						<upload @fileStatus="fileStatus"  @fileTrue="fileTrue" :success="success" v-model="r_data.file" ></upload>
						<span class='moreName'>支持扩展名：.rar .zip .doc .docx .pdf .jpg...</span>
					</el-form-item>

					<el-form-item label="附件备注 :">
						<el-input    
							placeholder="请输入"              
							type="textarea"
							:rows="5"
							class="elText"
							v-model="r_data.brife" 
							>
						</el-input>
					</el-form-item>
		  </el-form>   
        </div> 
 
		  <!--dialogValChildTitle ==  指派执行人 -->
			<div v-else-if="dialogValChildTitle == '指派执行人'" class='CustomerLeaderAllbox'>
            	<el-form label-position="right" label-width="140px" :model = 'r_data' ref="r_data">
            <!-- 自营团队 -->
					<el-row v-for="(item,index) in r_data.detail" :key="index" class='executivePartyFather'>
						<p class='CustomerLeaderOne'>执行明细{{index+1}}</p>
						<div class="dialogSolid2"></div>
						<el-form-item label="执行方 :" >
							<p v-show='item.service_type == 1'>自营团队</p>
							<p v-show='item.service_type == 2'>服务商团队</p>
						</el-form-item>

						<el-form-item label="产品信息 :">							
							<el-cascader
								expand-trigger="hover"
								filterable
								:disabled="true"
								:options="product"
								v-model="item.product_id" 
								class="elText">
							</el-cascader>									
						</el-form-item>

						<el-form-item label="产品说明 :">							
							<el-input    
								:rows="3"
								type="textarea"
								class="elText"
								v-model="item.product_brief" 
								:disabled="true"
								>
							</el-input>									
						</el-form-item>

						<el-form-item label="合同价格 :">							
							<el-input    
									type="text"
									class="elText"
									v-model="item.price" 
									:disabled="true"
									>
							</el-input>									
						</el-form-item>

<!-- :rules="[{ required: true, message: '请选择至少一位执行人',trigger:'blur'}]" -->
						<el-form-item label="执行人 :" 
							class='is-required' v-if='item.service_type == 1'
							:prop="'detail[' + index + '].excutor_id'"
							:rules="[{ required: true, message: '请选择至少一位执行人',trigger:'blur'}]"
							>							
									<!-- :value="selectData" -->
							<el-select  
								v-model="item.excutor_id"
									multiple
									filterable 
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


							<!-- <select name="" id="" multiple='true'>
								<option :value="item.dd_id" :label="item.nickname"  v-for="(item,index) in person" :key='index'>

								</option>
							</select> -->
						</el-form-item>

						<el-form-item label="服务商 :" v-if='item.service_type == 2'
						:prop="'detail.' + index + '.provider_id'" 
						:rules="[{ required: true, message: '请选择一位服务商',trigger:'blur'}]"
						 class='is-required'
						 >							
							<el-select  
								allow-create
								filterable
								placeholder="可选择一个服务商"
								v-model="item.provider_id" 
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

						<el-form-item :prop="'detail.' + index + '.id'">							
							<input  type="hidden" v-model="item.id" >
						</el-input>	

						</el-form-item>
					</el-row>
				</el-form> 
			</div> 
											<!-- // '指派AE'-->
			<div v-else-if="dialogValChildTitle == '指派客服'">  
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
			</div>

			
         <div v-else-if="dialogValChildTitle === '完成'">
            <div class='spaceBox'></div>
            <el-form :v-model="r_data">
              <el-form-item label="备注说明 :" label-width="82px">
                  <el-col :span="20">
                    <el-input    
                        placeholder="请输入"              
                        type="textarea"
                        :rows="5"
                        class="elText"
                        v-model="r_data.remarks" 
                        >
                    </el-input>
                  </el-col>
                </el-form-item>

                 <el-form-item label="附件 :" class='upLoad2'>
                    <upload @fileStatus="fileStatus"  @fileTrue="fileTrue" :success="success" v-model="r_data.file"></upload>
                  <span class='moreName'>支持扩展名：.rar .zip .doc .docx .pdf .jpg...</span>
                  </el-form-item>

                  <el-form-item label="附件备注 :" label-width="82px">
                    <el-input    
                        placeholder="请输入"              
                        type="textarea"
                        class="elText"
                        :rows="5"
                        v-model="r_data.brief" 
                        >
                    </el-input>
                </el-form-item>
              </el-form>  
          </div>

			<!-- 终止 驳回 -->
			<div v-else-if="dialogValChildTitle === '驳回'">
				<div class='spaceBox'></div>
				<el-form label-position='right' label-width="90px" :model="r_data">
					<el-form-item label="说明 :" class='is-required'>
						<el-input    
							placeholder="请输入"              
							type="textarea"
							:rows="5"
							class="elText"
							v-model="r_data.remarks" 
							>
						</el-input>
					</el-form-item>
				</el-form>  
			</div>

			<div v-else-if="dialogValChildTitle === '终止'">
				<div class='spaceBox'></div>
				<el-form label-position='right' label-width="90px" :model="r_data">
					<el-form-item label="说明 :"  class='is-required'>
						<el-input    
							placeholder="请输入"              
							type="textarea"
							:rows="5"
							class="elText"
							v-model="r_data.reason" 
							>
						</el-input>
					</el-form-item>
				</el-form>  
			</div>

			<div v-else-if="dialogValChildTitle === '删除'">
				<span>您确定要删除此工单吗？</span>
			</div>
			<div v-else>
				我是通用
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancel">取 消</el-button>
				<el-button type="primary" @click="dialogAllBtn('r_data')">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import upload from "../.././components/s_customer/fiieDataCe";

import cookies from 'js-cookie';
      
export default {
	components: {
		upload
	},
	props:['dialogAll1','dialogValChildTitle','dialogId','menuId5','message','annexData','product'],
	data() {
		return {	
			fileNewDialog:false,
			excutor_id:[],
			rdataFile:[],
			Authorization:{
				Authorization: cookies.get('access_token'),
			},
			manage_id:0,
			// newWork:{
			// 	"product_id": [
			// 			1,
			// 			27,
			// 			"42"
			// 			],
			// 	"product_brief": "起名",
			// 	 key: Date.now(),
			// 	 'service_type':'1'
			// },
			myMenuId5:false,
			cookisdata:'',
			i:-1,
			activeName:'first',
            CustomerBudinessMan:[],  //所有服务商
			operateLog:{}, // 操作日志数组
			product2:[],
			workOrnder:[],
			CustomerLeader:[],
			paytype:[],
			pay_periods:[],
			mydialogAll1:false,
			success: false,
			excutor_detail:[{}],
			r_data: {
			// 派单需要传送后台的数据
				detail:[
					{
						id:[],
						excutor_id:[]
					}
				],
				manage_id: 0,
				btn_no: this.dialogId,

				first_pay: false,
				pay_time: '',
				pay_count:'',
				pay_price: '',
				pay_type: '',
				pay_remarks: '',
				ae:'',

				//分单所需
				client_director_id:'',
				excutor_detail:[
				// 	{
					// service_type:1,
					// excutor_leading: '',
					// product_id:'',
					// product_brief:'',
					// price:'',
					// provider_id:''
				// },
				// 	{
				// 	service_type:1,
				// 	excutor_leading: '',
				// 	product_id:'',
				// 	product_brief:'',
				// 	price:'',
				// 	provider_id:''
				// },
				// 	{
				// 	service_type:1,
				// 	excutor_leading: '',
				// 	product_id:'',
				// 	product_brief:'',
				// 	price:'',
				// 	provider_id:''
				// }
				],

				remarks:'',//开始执行备注
				file:[],//附件
				brife:'',//附件说明

				detail:[
					
				],
				excutor_id:[],
				pay_abc:'',
				contract:false,
				description:''
			},
			
			r_form: {
				value: "",
				self_support: [],
				service_provider: "",
				remark: "",
				manage_id: "",

				client_director_id:'',
				
				},

			domains: [{
				value:{}
			}],
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
      	}
	},
	
	created () {
		this.r_data.manage_id = this.$route.query.manage_id;
		this.r_form.manage_id = this.$route.query.manage_id;
    	this.manage_id = this.$route.query.manage_id;
	},
	computed:{
		company_info(){
		return this.$store.state.app.company_info;
		},
		person(){
			return this.$store.state.app.person;
		},
		selectData(){
			if(this.value && this.value.split){
				return this.value.split(',')
			}
		}
	},
	watch:{
		dialogAll1(val) {
			this.mydialogAll1 = val;//②监听外部对props属性result的变更，并同步到组件内的data属性myResult中
        },
		mydialogAll1(val){
			this.$emit('dialogall',val)
		},
		dialogId(val){
			this.r_data.btn_no = val;
		},
		menuId5(val){
			this.myMenuId5 = val
		}
	},
	methods: {
		deleteFile(index, rows) {
      this.$delete("manageNew/deleteAttachment/" + rows[index].id)
        .then(data => {
          if (data.code) {
            this.$message({
              message: data.errorMsg,
              type: "success"
            });
            this.$parent.fileListAll();
            this.workOperateLog();
          }
        })
        .catch(() => {});
    },
		fileNewDialogTrue(){
			this.$post( 'manageNew/addAttachment',{manage_id: this.$route.query.manage_id, brife: this.brife, file: this.file})
			.then( (data) => {
				if(data.code){
				this.$message({
					message: data.errorMsg,
					type: 'success'
				});
				this.success = true;
				this.fileNewDialog = false;
				this.brife = '';
				this.file = [];
				this.$parent.fileListAll();
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
		onSuccess(response, file, fileList){
			this.r_data.file = fileList;
		},
		
 		handleRemove(path,path2){
			this.$get('delOssFile', {path: path})
				.then((data) => {
					if(data.code) {
						let urls = this.urls;
						for(let i in urls) {
							if(urls[i].path === path) {
								this.urls.splice(i, 1);
								this.file.splice(i, 1);
							};
						}
						this.$message({
							type: 'success',
							message: '删除成功'
						});
						this.percentage = 0;
						// this.uploadFile = false;
					}
				})
				.catch((data) => {
					this.$message.error('服务器错误，请稍后重试');
				})
		},
		alertaaa(num){
			alert(num)
		},
		addWork(){
			this.r_data.excutor_detail.push({ 
					service_type:'1',
					excutor_leading:'',
					product_id:[],
					product_brief:'',
					price:'',
					provider_id:''
				});
			this.$forceUpdate(); 
		},
		deleteWork(val){
			this.r_data.excutor_detail.splice(val,1);
			this.$forceUpdate(); 
		},
		changeLabel(val){
			var valNum = parseInt(val.index) + 2;
		},
		whenOpen(){
			if(this.dialogValChildTitle === '分单'){
				this.addItem();				
				this.dismantlingSelect();
			}else if(this.dialogValChildTitle === '指派执行人'){ //undefined
				this.addItem2();				
			}else if(this.dialogValChildTitle === '首付款确认'){
				this.payMoneytype();				
			}else if(this.dialogValChildTitle === '提交'){
				this.submitDataChild();				
			}
		},
		
		    // 共用事件中点击确认按钮时调用
		dialogAllBtn(r_data) { 
			if(this.dialogValChildTitle === '驳回'){
				this.workInfoRejectT()
			}else if(this.dialogValChildTitle === '提交'){
				this.referringFirst()
			}else if(this.dialogValChildTitle === '终止'){
				this.workEnd()
			}else if(this.dialogValChildTitle === '首付款确认'){
				this.firstPay()
			}else if(this.dialogValChildTitle === '分单'){
				this.splitList(r_data)		
			} else if(this.dialogValChildTitle === '指派客服'){
				this.assignAe()
			}else if(this.dialogValChildTitle === '指派执行人'){
				this.CustomerLder(r_data)
			}else if(this.dialogValChildTitle === '开始执行'){
				this.CustomerLderStart()
			}else if(this.dialogValChildTitle === '完成'){
				this.allFinsh()
			}else if(this.dialogValChildTitle === '删除'){
				this.deleteWork22()
			}
		},
		submitDataChild(){
			this.r_data.contract = this.message.contract;
			this.r_data.description = this.message.description;
		},
		referringFirst(){
			if (this.annexData.length == 0) {
				this.$message({
					message: '请至少选择一个附件',
					type: 'warning'
				})
			}else{
			this.r_data.file = [];
			this.$post("manageNew/operateBtn", this.r_data)
			.then(data => {
				if (data.code) {
						this.$message({
						message: '提交成功',
						type: "success"
					});
					this.r_data = {};
					this.mydialogAll1 = false;
					this.$router.go(0)
					this.$store.commit("removeTag", "workInfo");
					this.$store.commit("closePage", "workInfo");
					this.workOperateLog();
				}
			}).catch(() => {
				this.$message.error("服务器错误，请稍后重试");
			});
			}
		},
    // 工单终止事件
    workEnd() {
		 if (!this.r_data.reason) {
          this.$message({
            message: '请填写终止说明',
            type: 'warning'
          })
        }else{
			this.$post("manageNew/operateBtn", {
				manage_id: this.r_data.manage_id,
				btn_no:this.r_data.btn_no,
				reason: this.r_data.reason
			})
			.then(data => {
				if (data.code) {
					this.$message({
                      message: '提交成功',
                      type: "success"
                    });
					this.r_data.reason = '';
					this.mydialogAll1 = false;
					this.$router.go(0)
                    this.$store.commit("removeTag", "workInfo");
                    this.$store.commit("closePage", "workInfo");
					this.workOperateLog();
				}else{
					this.$message.error(data.errorMsg);
				}
			}).catch(() => {
				this.$message.error("服务器错误，请稍后重试");
			});
		}
       

      // this.centerDialogEnd = true;
      // this.$confirm('请确定终止?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   this.$get( 'manage/end',{ manage_id:this.$route.query.manage_id})
      //     .then( (data) => {
      //       if(data.code){
      //         this.$message({
      //           message: data.errorMsg,
      //           type: 'success'
      //         });
      //         this.$router.go(0);
      //       } else {
      //         this.$message.error(data.errorMsg);
      //       }
      //     })
      //     .catch(() => {
      //       this.$message.error('服务器错误，请稍后重试');
      //     })
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消终止'
      //   });
      // });
    },
		//产品处理函数
      // handleChangeproduct (value) {
      //   if(value[2]){
      //     this.formAll.product_id.push(value[2]);
      //   } else {
      //     this.formAll.product_id.splice(0,1);
      //   }
      // },
		//选项 产品列表
      addItem(){
					// 服务商
		this.$get("manageNew/provider")
			.then(data => {
			this.CustomerBudinessMan = data.content;
			})
			.catch(() => {
			this.$message.error("服务器错误，请稍后重试");
			});				
		},
	addItem2(){     
		this.$get('manageNew/excutorDetail', {
			manage_id: this.$route.query.manage_id
		})
		.then((data) => {
			this.r_data.detail = data.content;
		})
		.catch((data) => {
			this.$message.error('服务器错误，请稍后重试');
		})

	// 服务商
		this.$get("manageNew/provider")
			.then(data => {
				if(data.code){
				this.CustomerBudinessMan = data.content;
				}else {
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
		 // 订单分配选择产品数组（分单时自带的数据）
		dismantlingSelect(){
			this.$get( 'manageNew/DismantlingSelect', {
			  manage_id: this.manage_id,
		   })
			.then((data) => {
			if(data.code){
				this.workOrnder = data.content;
				this.r_data.excutor_detail = data.content;

				var data_productId	= data.content[0].product_id
				// var dataProductId3 = parseInt(data_productId[2]);
				// var data_productId123 = data_productId.splice(2,1,dataProductId3)
				var data_productId123 = data_productId.splice(1,1,parseInt(data_productId[1]))

				}else {
                 this.$message({
                   message: data.errorMsg,
                   type: "warning"
				 });
				}
			}).catch(() => {
				this.$message.error('服务器错误，请稍后重试');
			})
		},
		//oss 上传控件
		fileStatus(data) {
			this.file = data;
			this.r_data.file = data;
		},
		 fileTrue(data) {
			this.success = data;
		},
		cancel(){
			this.mydialogAll1 = false;
		},
		// 首付款确认前台需要用到数据
		payMoneytype(){
			 this.$get("manageNew/firstPaySelect")
				.then(data => {
					this.paytype = data.content.paytype;
					this.pay_periods = data.content.pay_periods;
				})
				.catch(() => {
					this.$message.error("服务器错误，请稍后重试");
				});
		},

		allFinsh(){
			this.$post("manageNew/operateBtn", {
				manage_id: this.manage_id,
				btn_no:this.r_data.btn_no,
				remarks: this.r_data.remarks,
				file: this.r_data.file,
				brief: this.r_data.brief
			})
				.then(data => {
				if (data.code) {
					this.$message({
					message: data.errorMsg,
					type: "success"
					});
				
					this.mydialogAll1 = false;
					this.r_data = {};
					this.$router.go(0)
					this.$store.commit("removeTag", "workInfo");
					this.$store.commit("closePage", "workInfo");
					this.workOperateLog();
				} else {
					this.$message.error(data.errorMsg);
				}
				})
				.catch(() => {
				this.$message.error("服务器错误，请稍后重试");
				});
		},
		//  开始执行
		CustomerLderStart(){
			this.$post("manageNew/operateBtn", this.r_data)
				.then(data => {
					// if (data.code) {
						this.$message({
							message: data.errorMsg,
							type: "success"
						});
						this.r_data = {};
						this.mydialogAll1 = false;
						this.$store.commit("removeTag", "workInfo");
						this.$store.commit("closePage", "workInfo");
						this.workOperateLog();
						this.$router.go(0)
					// } else {
						// this.$message({
						// 	message: data.errorMsg,
						// 	type: "warning"
						// });
					// }
				})
				.catch(() => {
					this.$message.error("服务器错误，请稍后重试..");
				});
		},
		// 指派执行人
		CustomerLder(r_data){
			 this.$refs[r_data].validate((valid) => {
				if (valid) {
					this.$post("manageNew/operateBtn", this.r_data)
					.then(data => {
						if (data.code) {
							this.$message({
								message: '指派成功！',
								type: "success"
							});
							this.r_data = {};
							this.mydialogAll1 = false;
							this.$router.go(0)
							this.$store.commit("removeTag", "workInfo");
							this.$store.commit("closePage", "workInfo");
							this.workOperateLog();
						}else {
							this.$message({
								message: data.errorMsg,
								type: "warning"
							})
						}
						}).catch(() => {
						this.$message.error("服务器错误，请稍后重试..");
					});
						}else{
						return false;
					}
				})
			},
		// 指派客服
		assignAe(){
			if(!this.r_data.ae){
				this.$message({
					message: '请选择客服',
					type: 'warning'
				});
			}else{
				this.$post("manageNew/operateBtn", this.r_data)
				.then(data => {
						if (data.code) {
							this.$message({
								message: '指派成功!',
								type: "success"
							});
							this.r_data = {};
							this.mydialogAll1 = false;
							this.$store.commit("removeTag", "workInfo");
							this.$store.commit("closePage", "workInfo");
							this.workOperateLog();
							this.$router.go(0)
						}
					}).catch(() => {
						this.$message.error("服务器错误，请稍后重试");
					});
				}
		},
		// 分单
		splitList(r_data){
			 this.$refs[r_data].validate((valid) => {
				if (valid) {
					this.$post("manageNew/operateBtn", this.r_data)
						.then(data => {
							if (data.code) {
								this.$message({
									message: data.errorMsg,
									type: "success"
								});
								this.r_data = {};
							    this.mydialogAll1 = false;
								this.$store.commit("removeTag", "workInfo");
								this.$store.commit("closePage", "workInfo");
								this.workOperateLog();
								// this.$parent.fileListAll();
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
				} else {
					return false;
				}
			});
		},
    // 首付款确认
    		firstPay(){
				if(this.r_data.first_pay){
						if(!this.r_data.pay_time){
						this.$message({
							message: '请填写回款时间',
							type: 'warning'
						});
					}else if (!this.r_data.pay_count) {
						this.$message({
							message: '请填写回款期数',
							type: 'warning'
						});
					}else if (!this.r_data.pay_price) {
						this.$message({
							message: '请填写回款金额',
							type: 'warning'
						});
					}	else if (this.r_data.pay_type === '' && this.r_data.pay_type!=0) {
						this.$message({
							message: '请填写回款方式',
							type: 'warning'
						});
					}else{
						this.$post("manageNew/operateBtn", this.r_data)
						.then(data => {
							if (data.code) {
								this.$message({
									message: '确认成功！',
									type: "success"
								});
								this.mydialogAll1 = false;
								this.$store.commit("removeTag", "workInfo");
								this.$store.commit("closePage", "workInfo");
								this.r_data={};
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
							this.$message.error("服务器错误，请稍后重试");
						});
					}
				}
				else{
					this.$post("manageNew/operateBtn", {manage_id:this.r_data.manage_id,btn_no:this.r_data.btn_no,first_pay:this.r_data.first_pay,pay_remarks:this.r_data.pay_remarks})
						.then(data => {
							if (data.code) {
								this.$message({
									message: '确认成功！',
									type: "success"
								});
								this.mydialogAll1 = false;
								this.$store.commit("removeTag", "workInfo");
								this.$store.commit("closePage", "workInfo");
								this.r_data={};
								this.workOperateLog();
								setTimeout(() => {
									this.$router.go(0)									
								}, 50);
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
					}
    		},
    // 驳回
    workInfoRejectT() {
      this.$post("manageNew/operateBtn", {
        manage_id: this.$route.query.manage_id,
        btn_no:this.r_data.btn_no,
        remarks: this.r_data.remarks
      }).then(data => {
          if (data.code) {
            this.$message({
              message: data.errorMsg,
              type: "success"
			});
			this.$router.go(0)
            this.$store.commit("removeTag", "workInfo");
			this.$store.commit("closePage", "workInfo");
            this.r_data.remarks = "";
            this.mydialogAll1 = false;
            this.workOperateLog();
          } else {
            this.$message.error(data.errorMsg);
          }
        })
        .catch(() => {
          this.$message.error("服务器错误，请稍后重试");
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
	mounted() {
		if (this.dialogAll1) {
		this.mydialogAll1 = true;
		}
	}
}

</script>

<style type="scoped">
.dialogSolid2{
  padding: 10px 0;
  border-top: 1px solid #e4e4e4;
}

.btn_noTitle{
  padding: 0 0 20px 15px;
}

.executivePartyFather{
	position: relative;
	overflow:hidden;
}
.executiveParty{
	position: absolute;
	top: 0;
	left: 0;
}
/* .el-tabs__nav-wrap:after{
	background-color:#fff!important;
	margin-bottom: 10px!important;
} */
.executiveTwo .el-tabs__header .el-tabs__nav{
	/* text-align: center!important; */
	float: none!important;
	padding: 10px 0 10px 120px!important;
}
.executiveTwo .el-tabs__header{
	position: relative;	
}
.workInfo .el-tabs__item.is-active{
	color: #409eff!important;
}
.elText{
	width: 300px;
}
.deleteWorkBtn{
	float:right;
	/* color:#1890FF; */
	text-decoration:underline;
}

.elText2 .el-input input{
	background-color: #fff!important;
}
.deleteWorkBtnFather{
	overflow:hidden;
	line-height:40px;
	height:40px;
}
.is_firstPrice .el-switch__core{
	/* border-color: #409eff !important;
    background-color: #409eff!important; */
}
</style>

