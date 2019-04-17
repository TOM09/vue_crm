 //新增任务
<template>
	<div class="x_addtask">
		<el-card style="padding-bottom: 50px;">
			<div class="s_new_title">Brief信息</div>
			<el-form :model="ruleForm" ref="ruleForm" label-width="200px" class="demo-ruleForm">
				<el-form-item label="初稿|修改（必填）" prop="task_status">
					<el-radio v-model="ruleForm.task_status" label="1">初稿</el-radio>
					<el-radio v-model="ruleForm.task_status" label="2">修改</el-radio>
				</el-form-item>
				<el-form-item label="关联工单（必填）" prop="number">
                    <el-input  v-model="gridData.number" @focus="choiceWorder = true" placeholder="请选择" class="x_client_width"></el-input>
				</el-form-item>
				<el-form-item label="产品信息（必填）" prop="pro_id">
					<el-select v-model="ruleForm.pro_id" placeholder="请选择" class="s_client_width">
						<el-option v-for="item in pro_detail" :key="item.pro_id" :label="item.name" :value="item.pro_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="Brief标题（必填）" prop="title">
					<el-input v-model="ruleForm.title" placeholder="请输入标题" clearable class="x_client_width" style="float: left;width: 300px;"></el-input>
				</el-form-item>
				<el-form-item label="类别（必填）" prop="type_id">
					<el-select v-model="ruleForm.type_id" placeholder="请选择" class="s_client_width">
						<el-option v-for="item in type" :key="item.type_id" :label="item.title" :value="item.type_id">
						</el-option>
						<el-option :value="'其他'">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="" prop="type_title" v-if="ruleForm.type_id=='其他'">
                    <el-input  v-model="ruleForm.type_title" placeholder="请输入或者选择自定义类别" class="x_client_width"></el-input>
				</el-form-item>
				<el-form-item label="Brief详情（必填）" prop="detail">
					<el-input type="textarea" v-model="ruleForm.detail" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="Brief时间（必填）" prop="time">
					<div class="block">
                        <el-date-picker
                            v-model="ruleForm.time"
                            type="datetimerange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
					</div>
				</el-form-item>
				<el-form-item label="执行人（必填）" prop="executor">
					<el-select v-model="ruleForm.admin_ids" multiple placeholder="请选择" class="s_client_width">
						<el-option v-for="item in detail" :key="item.nickname" :label="item.nickname" :value="item.dd_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="附件">
					<upload @fileStatus="fileStatus"  @fileTrue="fileTrue" :success="success"></upload>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
					<el-button @click="resetForm('ruleForm')">重置</el-button>
				</el-form-item>
			</el-form>
            <!--工单列表-->
            <el-dialog title="工单列表" :visible.sync="choiceWorder" :append-to-body="true">
                <el-table :data="gridData">
                    <el-table-column property="number" label="工单编号" width="100" align="center"></el-table-column>
                    <el-table-column property="type" label="工单类型"></el-table-column>
                    <el-table-column property="company" label="客户名称"></el-table-column>
                    <el-table-column property="intro" label="产品信息"></el-table-column>
                    <el-table-column property="status" label="状态"></el-table-column>
                    <el-table-column property="nickname" label="执行人员" width="200" align="center"></el-table-column>
                    <el-table-column property="up_time" label="更新时间"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" @click="handleEdit(scope.row,scope.dialogTableVisible,scope.category)">选择</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
		</el-card>
	</div>
</template>
<script>
    import upload from '../.././components/s_customer/fiieDataCe';
	export default {
		name: 'addTask',
		components: {
          upload
		},
		props: [],
		data() {
			return {
                success: false,
                choiceWorder:false,
				dialogVisible: false,
				ruleForm: {
					task_status:'1', 	// 初稿或修改
					manage_id:'',		// 工单id
					title:'', 			// 任务标题
					type_id:'', 		// 类别id
					type_title:'', 		// 自定义类别(非必填)
					detail:'', 			// 任务详情
					time:'', 			// 任务时间
					admin_ids:[], 		// 执行人
					pro_id:'',			// 产品信息id
                    attach:[],
                },
                gridData:{
                    number:'',
                },
				type:[], 				//类别
                detail:[], 				//执行人
				pro_detail:[],			//产品信息
                attach:[],
            }
		},
		methods: {
            //附件
            fileStatus(data) {
                this.ruleForm.attach = data;
            },
            fileTrue(data){
                this.success = data;
            },
            //工单列表
            worderList(){
                this.$get('task/add')
                .then((data) => {
                    if(data.code){
                        this.gridData = data.content.detail;
                        this.type = data.content.type;
                    }else {
                        this.$message.error('服务器错误，请稍后再试');
					}
                })
                .catch((error) => {
                    this.$message.error('服务器错误，请稍后再试');
                });
            },
            //选择工单
            handleEdit(row) {
                this.choiceWorder = false;
                this.ruleForm.manage_id = row.manage_id;
                this.gridData.number = row.number;
                this.$get('task/executor', {manage_id:this.ruleForm.manage_id})
					.then((data) => {
						if(data.code){
							this.detail = data.content.detail;
							this.pro_detail = data.content.pro_detail;
						}else{
							this.$message.error(data.msg);
						}
					})
					.catch((error) => {
						this.$message.error('服务器错误，请稍后重试')
					});
            },
			//创建
			submitForm(formName) {
                if(!this.ruleForm.manage_id){
                    this.$message({
                        message: '请选择关联工单',
                        type: 'warning'
                    });
				}else if(!this.ruleForm.pro_id){
                    this.$message({
                        message: '请选择产品',
                        type: 'warning'
                    });
				}else if(!this.ruleForm.title){
                    this.$message({
                        message: '请填写标题',
                        type: 'warning'
                    });
				}else if(this.ruleForm.title.length > 30){
                    this.$message({
                        message: '标题应该小于30字哦',
                        type: 'warning'
                    });
				}else if(!this.ruleForm.type_id){
                    this.$message({
                        message: '请填写类别',
                        type: 'warning'
                    });
				}else if(this.ruleForm.type_id == '其他' && !this.ruleForm.type_title){
                    this.$message({
                        message: '请填写其他类别',
                        type: 'warning',
                    });
				}else if(!this.ruleForm.detail){
                    this.$message({
                        message: '请填写详情',
                        type: 'warning'
                    });
				}else if(!this.ruleForm.time){
                    this.$message({
                        message: '请选择时间',
                        type: 'warning'
                    });
				}else if(!this.ruleForm.admin_ids){
                    this.$message({
                        message: '请选择执行人',
                        type: 'warning'
                    });
				}else {
                    this.$post('task/addTask', this.ruleForm)
                        .then((data) => {
                            if(data.code) {
                                this.$message({
                                    message: data.errorMsg,
                                    type: 'success'
                                });
                                this.success = true;
                                this.ruleForm.admin_ids = [];
                                this.$refs[formName].resetFields();
                                this.$router.push({
                                    name: 'taskDetail',
                                    params: {
                                        id: data.content.task_id
                                    }
                                })
                            } else {
                                this.$message.error(data.errorMsg);
                            }
                        })
				}
			},
			//重置
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
            getParams(){
                let routerParams = this.$route.params.id;
                this.ruleForm.manage_id = routerParams;
            },
		},
        watch:{
            '$route':'getParams'
        },
        created (){
            this.getParams();
            this.worderList();
		}
	}
</script>
<style lang="less">
	.x_addtask {
		width: 100%;
		height: 100%;
		background: #fff;
		.s_new_title {
			width: 100%;
			height: 50px;
			font-size: 19px;
			float: left;
			text-align: left;
			font-weight: 700;
		}
		.x_client_width {
			width: 300px;
		}
		.x_task_status {
			margin-left: 15px;
			margin-bottom: 5px;
		}
		.s_client_width {
			width: 300px;
		}
		.el-form-item__label .rule_class {
			content: "*";
			color: #fa5555;
			margin-right: 4px;
		}
		.el-textarea__inner {
			width: 400px;
            height: 100px;
		}
		.transition-box {
			width: 300px;
		}
	}
</style>