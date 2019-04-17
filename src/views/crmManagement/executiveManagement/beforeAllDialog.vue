<template>
	<div>
		<!-- 共用弹窗 -->
		<el-dialog :visible.sync="beforemydialogAll1" :modal="false" @close='cancel' :title="dialogValChildTitle2" width="550px" @open='whenOpen'>
			<div v-if="dialogValChildTitle2 === '提交'">
				<el-form ref='r_data' label-position="right" label-width="120px" :model="r_data">
					<el-form-item label="预计调用日期 :" class='is-required'>
						<el-date-picker type="date" class='elText' placeholder="请选择" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" v-model="r_data.expect">
						</el-date-picker>
					</el-form-item>

					<el-form-item label="调用类型 :" class='is-required'>
						<el-select placeholder="请选择"  class='elText' v-model="r_data.call_that">
							<el-option
							v-for="item in reportData"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="申请说明 :" class='is-required'>
						<el-input v-model="r_data.description"  class='elText' type="textarea" :rows="5">
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

					<!-- <el-form-item label="附件 :">
						<upload @fileStatus="fileStatus"  @fileTrue="fileTrue" :success="success" v-model="r_data.file" ></upload>
						<ul>
							<li v-for='(item,index) in annexData' v-if='annexData.length != 0' :key='index'>{{item.name}}</li>
						</ul>
						<span class='moreName'>支持扩展名：.rar .zip .doc .docx .pdf .jpg...</span>
					</el-form-item>
					
					<el-form-item label="附件备注 :">
						<el-input v-model="r_data.brife" type="textarea" :rows="5"  class='elText'>
						</el-input>
					</el-form-item> -->
				</el-form>
			</div>

			<div v-else-if="dialogValChildTitle2 === '分单'">
				<el-form ref='r_data' label-position="right" label-width="120px" :model="r_data">
					<el-form-item label="销管负责人 :" class='is-required'>
						<el-select class="inputWarn" placeholder="可选择一位执行负责人" v-model="r_data.client_director_id" filterable>
							<el-option
							v-for="item in person"
							:key="item.dd_id"
							:label="item.nickname"
							:value="item.dd_id">
							</el-option>									
                      </el-select>
					</el-form-item>

  <!-- :prop="'excutor_detail.' + index + '.service_type' -->
					<!-- <el-form-item label="执行方 :" class='is-required'>
						<el-radio-group v-model="r_data.service_type">
							<el-radio label=1>自营团队{{r_data.service_type}}</el-radio>
							<el-radio label=2>服务商团队</el-radio>
						</el-radio-group>
					</el-form-item> -->
					<el-form-item label="执行方 :" class='is-required'>
						<!-- <el-checkbox-group v-model='checkBoxMore' @change='changeBox'> -->
							<el-checkbox  v-model='checkBoxMore'  label='自营团队'></el-checkbox>
							<el-checkbox  v-model='checkBoxMore2' label='服务商团队'></el-checkbox>
						<!-- </el-checkbox-group> -->
					</el-form-item>

<!-- :prop="'excutor_detail.' + index + '.excutor_leading'"  -->
					 <el-form-item label="执行负责人 :" class='is-required'  
						:rules="[{ required: true, message: '请选择一位执行负责人',trigger:'blur'}]"
						v-if="checkBoxMore">
						<el-select 
							multiple
							filterable 
						 	class="inputWarn"
							 value-key="dd_id" 
							 placeholder="可选择多个执行负责人" 
							 v-model="r_data.pre_sale_id">
							<el-option
								v-for="item in person"
								:key="item.dd_id"
								:label="item.nickname"
								:value="item.dd_id">
							</el-option>									
						</el-select>
					</el-form-item>

					 <!-- :prop="'domains.' + index + '.value'" -->
					<el-form-item label="服务商 :" class='is-required'
					v-for="(domain,index) in r_data.domains" :key="index" v-if="checkBoxMore2"  :prop="'domains.' + index + '.value'">
							 <el-select 
								class="inputWarn"
								placeholder="可选择一个服务商"
								v-model="domain.value" 
								filterable
								allow-create
								@change="handleChangeproduct"
								>
							<el-option
								v-for="item in CustomerBudinessMan"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select> 

          				<el-button @click.prevent="removeDomain(domain)">删除</el-button>						
						<!-- <el-button type="text" @click="addDomain">增加</el-button> -->
					</el-form-item>
					<el-form-item>
						<el-button  v-if="checkBoxMore2" @click="addDomain">增加服务商</el-button>
					</el-form-item>

					
					<el-form-item label="附件 :">
						<upload @fileStatus="fileStatus"  @fileTrue="fileTrue" :success="success" v-model="r_data.file" ></upload>
						<span class='moreName'>支持扩展名：.rar .zip .doc .docx .pdf .jpg...</span>
					</el-form-item>

					<el-form-item label="附件备注 :">
						<el-input v-model="r_data.brife" type="textarea" :rows="5"  class='elText'>
						</el-input>
					</el-form-item>

					<el-form-item label="备注 :">
						<el-input v-model="r_data.remarks"  class='elText' type="textarea" :rows="5">
						</el-input>
					</el-form-item>
					
				</el-form>
			</div>

			<div v-else-if="dialogValChildTitle2 === '指派执行人'">
				<el-form ref='r_data' label-position="right" label-width="120px" :model="r_data">
							<!-- :prop="'detail[' + index + '].excutor_id'" -->
					<el-form-item label="执行人 :" 
							class='is-required'
							:rules="[{ required: true, message: '请选择至少一位执行人',trigger:'blur'}]"
							>							
							<el-select  
								v-model="r_data.excutor_id"
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
						</el-form-item>
					
					<el-form-item label="备注 :">
						<el-input v-model="r_data.remarks" type="textarea" :rows="5"  class='elText'>
						</el-input>
					</el-form-item>
				</el-form>
			</div>

			<div v-else-if="dialogValChildTitle2 === '指派销管'">
				<el-form ref='r_data2' label-position="right" label-width="120px" :model="r_data2">
					<el-form-item label="执行人 :" 
							class='is-required'
							:rules="[{ required: true, message: '请选择执行人（仅一个）',trigger:'blur'}]"
							>							
							<el-select  
								v-model="r_data2.excutor_id"
									filterable 
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
					
					<el-form-item label="备注 :">
						<el-input v-model="r_data2.remark" type="textarea" :rows="5"  class='elText'>
						</el-input>
					</el-form-item>
				</el-form>
			</div>
			<div v-else-if="dialogValChildTitle2 === '售前完成'">
				<el-form ref='r_data' label-position="right" label-width="120px" :model="r_data">
					<el-form-item label="售前结果 :" class='is-required'>
						<el-select placeholder="请选择"  class='elText' v-model="r_data.result">
							<el-option
									v-for="item in beforeResult"
									:key="item.id"
									:label="item.value"
									:value="item.id">
								</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="结案总结 :" class='is-required'>
						<el-input v-model="r_data.summary"  class='elText' type="textarea" :rows="5">
						</el-input>
					</el-form-item>

					<el-form-item label="附件 :">
						<upload @fileStatus="fileStatus"  @fileTrue="fileTrue" :success="success" v-model="r_data.file" ></upload>
						<span class='moreName'>支持扩展名：.rar .zip .doc .docx .pdf .jpg...</span>
					</el-form-item>
					
					<el-form-item label="附件备注 :">
						<el-input v-model="r_data.brief" type="textarea" :rows="5"  class='elText'>
						</el-input>
					</el-form-item>
				</el-form>
			</div>
			
			<!-- 终止 驳回 -->
			<div v-else-if="dialogValChildTitle2 === '驳回'">
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

			<div v-else-if="dialogValChildTitle2 === '终止'">
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
	props:['dialogValChildTitle2','beforeDialogAll1','message','dialogId','annexData'],
	data() {
		return {
			fileNewDialog:false,
			rdataFile:[],
			reportData:[],
			beforeResult:[{id:1,value:'成功'},{id:2,value:'失败'}],
            CustomerBudinessMan:[],  //所有服务商
			checkBoxMore:false,
			checkBoxMore2:false,
			beforemydialogAll1:false,
			excutor_id:[],
			file:[],
			brife:'',
			r_data:{
				summary:'',
				result:'',
				description:'',
				manage_id:0,
				btn_no: this.dialogId,
				brife:'',
				excutor_id:[],
				remark:'',
				expect:'',
				call_that:'',
				remarks:'',
				file:[],
				service_type:'1',
				pre_sale_id:[],
				provider_id:[],
				domains: [{
					value:[]
				}],
			},
			r_data2:{
				manage_id:0,
				btn_no: this.dialogId,
				excutor_id:'',
				remark:''
			},
			success:false
      	}
	},
	created () {
		this.r_data.manage_id = this.$route.query.manage_id;
		this.r_data2.manage_id = this.$route.query.manage_id;
	},
	computed:{
		company_info(){
		return this.$store.state.app.company_info;
		},
		person(){
			return this.$store.state.app.person;
		}
	},
	watch:{
		beforeDialogAll1(val) {
			this.beforemydialogAll1 = val;//②监听外部对props属性result的变更，并同步到组件内的data属性myResult中
        },
		beforemydialogAll1(val){
			this.$emit('beforedialogall',val)
		},
		dialogId(val){
			this.r_data.btn_no = val;
			this.r_data2.btn_no = val;
		},
		menuId5(val){
			// this.myMenuId5 = val
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
		 removeDomain(item) {
			let index = this.r_data.domains.indexOf(item);
		if (index !== -1) {
			this.r_data.domains.splice(index, 1);
			this.r_data.provider_id.splice(index, 1);
			}
		},
		handleChangeproduct(value){
			this.r_data.provider_id.push(value);
		},
		referringFirst(){
			if (!this.r_data.expect){
			this.$message({	
				message: '请选择预计调用日期',
				type: 'warning'
			})
			}else if (!this.r_data.call_that){
			this.$message({	
				message: '请选择调用类型',
				type: 'warning'
			})
			}else if (!this.r_data.description){
			this.$message({	
				message: '请填写申请说明',
				type: 'warning'
			})
			}else if((this.r_data.call_that == 1 || this.r_data.call_that == 6 || this.r_data.call_that == 7 || this.r_data.call_that == 8) && this.annexData.length == 0){
				this.$message({
					message: '请至少选择一个附件',
					type: "warning"
				});
			}else{
				this.r_data.file = [];
				this.$post("managePresale/operateBtn", this.r_data)
				.then(data => {
					if (data.code) {
							this.$message({
							message: '提交成功！',
							type: "success"
						});
						this.r_data = '';
						this.beforemydialogAll1 = false;
						this.$store.commit("removeTag", "workInfo");
						this.$store.commit("closePage", "workInfo");
						this.workOperateLog();
						setTimeout(() => {
							this.$router.go(0)
						}, 400);
						
					}
				}).catch(() => {
					this.$message.error("服务器错误，请稍后重试");
				});
			}
		},
		addDomain(){
			this.r_data.domains.push({
				value: [],
				key: Date.now(),
				});
		},
		whenOpen(){
			if(this.dialogValChildTitle2 === '分单'){
				this.addItem();				
				// this.dismantlingSelect();
			}else if(this.dialogValChildTitle2 === '首付款确认'){
				// this.payMoneytype();				
			}else if(this.dialogValChildTitle2 === '提交'){
				this.submitDataChild();				
			}
		},
		dialogAllBtn(){
			if(this.dialogValChildTitle2 === '驳回'){
				this.workInfoRejectT()
			}else if(this.dialogValChildTitle2 === '提交'){
				this.referringFirst()
			}else if(this.dialogValChildTitle2 === '终止'){
				this.workEnd()
			}else if(this.dialogValChildTitle2 === '售前完成'){
				this.PreSalesFinish()
			}else if(this.dialogValChildTitle2 === '分单'){
				this.splitList()		
			} else if(this.dialogValChildTitle2 === '指派销管'){
				this.assignAe()
			}else if(this.dialogValChildTitle === '开始执行'){
				this.CustomerLderStart()
			}else if(this.dialogValChildTitle === '完成'){
				this.allFinsh()
			}
		},
		workEnd(){
     this.$post("managePresale/operateBtn", {
        manage_id: this.r_data.manage_id,
        btn_no:this.r_data.btn_no,
        reason: this.r_data.reason
      }).then(data => {
          if (data.code) {
            this.$message({
              message: '终止成功！',
              type: "success"
			});
            this.$store.commit("removeTag", "workInfo");
			this.$store.commit("closePage", "workInfo");
            this.r_data = {};
            this.beforemydialogAll1 = false;
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
		PreSalesFinish(){
			if (!this.r_data.result){
				this.$message({
					message: '请选择售前结果',
					type: 'warning'
				});
        	}else if (!this.r_data.summary){
				this.$message({
					message: '请填写结案总结',
					type: 'warning'
				});
        	} else {
			this.$post( 'managePresale/operateBtn',this.r_data)
				.then( (data) => {
				if(data.code){
					this.$message({
						message: '提交成功！',
						type: 'success'
					});
					this.$store.commit('removeTag','workInfo');
					this.$store.commit('closePage','workInfo');
					this.r_data = {};
					// this.success = true;
					this.$router.go(0)				
					// this.$router.push({name: 'itemDetail',params:{id:data.content}})
				} else {
					this.$message.error(data.errorMsg);
				}
				})
				.catch(() => {
				this.$message.error('服务器错误，请稍后重试');
				})
        	}
		},
		assignAe(){
			if (!this.r_data2.excutor_id){
				this.$message({
					message: '请选择执行人',
					type: 'warning'
				});
        	} else {
			this.$post( 'managePresale/operateBtn',this.r_data2)
				.then( (data) => {
				if(data.code){
					this.$message({
					message: '指派成功！',
					type: 'success'
					});
					this.$store.commit('removeTag','workInfo');
					this.$store.commit('closePage','workInfo');
					this.r_data2 = {};
					this.success = true;
					this.r_data2.excutor_id = [];
					this.r_data2.remark = '';
					this.$router.go(0)				
					// this.$router.push({name: 'itemDetail',params:{id:data.content}})
				} else {
					this.$message.error(data.errorMsg);
				}
				})
				.catch(() => {
				this.$message.error('服务器错误，请稍后重试');
				})
        	}
		},
		splitList(){
			if (!this.r_data.client_director_id){
          this.$message({
            message: '请填写销管负责人',
            type: 'warning'
          });
        }else if (!this.checkBoxMore && !this.checkBoxMore2) {
          this.$message({
            message: '请选择至少一个执行方',
            type: 'warning'
          });
        } else if (this.checkBoxMore && this.r_data.pre_sale_id.length == 0) {
          this.$message({
            message: '请选择至少一个执行负责人',
            type: 'warning'
          });
        } else if (this.checkBoxMore2 && this.r_data.provider_id.length == 0){
          this.$message({
            message: '请选择至少一个服务商',
            type: 'warning'
          });
        } else {
		   this.$post( 'managePresale/operateBtn',this.r_data)
            .then( (data) => {
              if(data.code){
                this.$message({
                  message: data.errorMsg,
                  type: 'success'
                });
                this.$store.commit('removeTag','workInfo');
                this.$store.commit('closePage','workInfo');
                this.r_data = {};
                this.success = true;
                this.r_data.provider_id = [];
				this.r_data.domains = [{value: []}];
				this.$router.go(0)				
                // this.$router.push({name: 'itemDetail',params:{id:data.content}})
              } else {
                this.$message.error(data.errorMsg);
              }
            })
            .catch(() => {
              this.$message.error('服务器错误，请稍后重试');
            })
        }
		},
		//分单调用
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
		// 驳回后的提交
		submitDataChild(){
			this.r_data.expect = this.message.expect_time;
			// this.r_data.call_that = this.message.call_that;
					
			this.$get("managePresale/callThat")
			.then(data => {
				this.reportData = data.content;

				for (let i = 0; i < this.reportData.length; i++) {
					if(this.message.call_that == this.reportData[i].label){
						this.r_data.call_that = this.reportData[i].value
					}
				}	

			})
			.catch(() => {
				this.$message.error("服务器错误，请稍后重试");
			});	

			this.r_data.description = this.message.description;
		},
		 // 驳回
    workInfoRejectT() {
      this.$post("managePresale/operateBtn", {
        manage_id: this.r_data.manage_id,
        btn_no:this.r_data.btn_no,
        remarks: this.r_data.remarks
      }).then(data => {
          if (data.code) {
            this.$message({
              message: '驳回成功！',
              type: "success"
			});
            this.$store.commit("removeTag", "workInfo");
			this.$store.commit("closePage", "workInfo");
            this.r_data.remarks = "";
            this.beforemydialogAll1 = false;
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
	fileNew () {
			this.fileNewDialog = true;
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
			this.beforemydialogAll1 = false;
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
		// this.mydialogAll1 = true;
		}
	}
}

</script>

<style type="scoped">
.elText{
	width: 300px!important;
}
</style>

