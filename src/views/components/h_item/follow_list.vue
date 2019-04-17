<template>
	<div class="followList">
		<el-table :data="followData" style="width: 100%">
			<el-table-column type="expand">
				<template slot-scope="props">
					<el-form label-position="rigth" inline class="demo-table-expand" label-width="100px">
					<el-form-item label="拜访方式">
						<span>{{ props.row.form.name }}</span>
					</el-form-item>
					<el-form-item label="陪访人">
						<span>{{ props.row.accompany }}</span>
					</el-form-item>
					<el-form-item label="下次拜访时间">
						<span>{{ props.row.next_time }}</span>
					</el-form-item>
					<el-form-item label="拜访结果">
						<span>{{ props.row.result }}</span>
					</el-form-item>
					<el-form-item label="审批人">
						<span>{{ props.row.approver }}</span>
					</el-form-item>
					<el-form-item label="审批意见">
						<span>{{ props.row.approve_opinion }}</span>
					</el-form-item>
					</el-form>
				</template>
			</el-table-column>
			<el-table-column label="编号" prop="code"></el-table-column>
			<el-table-column label="状态" prop="is_approve"></el-table-column>
			<el-table-column label="跟进人" prop="personnel"></el-table-column>
			<el-table-column label="跟进时间" prop="time"></el-table-column>
			<el-table-column label="拜访方式" prop="form.name"></el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button @click.native.prevent="initiateApproval(scope.$index, followData)" type="text" size="small">
						{{ scope.row.commit }}
					</el-button>
					<el-button type="text" size="mini" @click="handleEdit(scope.$index, followData)">
						{{ scope.row.edit }}
					</el-button>
					<el-button @click.native.prevent="deleteRow(scope.$index, followData)" type="text" size="small">
						{{ scope.row.del }}
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog title="编辑跟进记录" :visible.sync="dialogFormVisible" :modal="false">
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
	</div>
</template>

<style lang="less">
.followList{
	.demo-table-expand {
		font-size: 0;
	}
	.demo-table-expand label {
		width: 90px;
		color: #99a9bf;
	}
	.demo-table-expand .el-form-item {
		margin-right: 0;
		margin-bottom: 0;
		width: 50%;
	}
}
</style>

<script>
export default {

	name: 'follow_list',
	props: ['followData', 'formWay'],

	data() {
		return {
			tableData: [],
			dialogFormVisible: false,
			formAll: {
				form: '',
				accompany: '',
				next_time: '',
				result: ''
			},
			follow: false,
			id: 0
		};
	},
	methods: {
		// 编辑跟进记录
		handleEdit(index, row) {
			this.id = row[index].id;
			this.formAll.project_id = this.$route.params.id;
			this.formAll.form = row[index].form.id;
			this.formAll.accompany = row[index].accompany;
			this.formAll.next_time = row[index].next_time;
			this.formAll.result = row[index].result;
			this.dialogFormVisible = true;
		},
		// 发起审批
		initiateApproval (index, row) {
			this.$get( 'crmManagement/follow/approve/' + row[index].id)
				.then( (data) => {
					if(data.result.is_success){
						this.$message({
							message: '审批成功',
							type: 'success'
						});
						this.follow = true;
						this.$emit("followNew",this.follow);
					} else {
						this.$message.error('审批失败');
					}
				})
				.catch( (error) => {
					this.$message.error('服务器发生错误，请稍后重试');
				})
		},
		// 确认更改跟进记录
		formTrue () {
			this.$put( 'crmManagement/follow/' + this.id ,this.formAll)
				.then( (data) => {
					if(data.code != 500) {
						this.$message({
							message: data.errorMsg,
							type: 'success'
						});
						this.dialogFormVisible = false;
					} else {
						this.$message({
							message: data.errorMsg,
							type: 'warning'
						});
					}
				})
				.catch( (error) => {
					this.$message.error('服务器发生错误，请稍后重试');
				})
		},
		// 删除跟进记录
		deleteRow(index, rows) {
			this.$post( 'crmManagement/follow/del',{id: rows[index].id})
				.then ( (data) => {
					if(data.code){
						this.$message({
							message: data.errorMsg,
							type: 'success'
						});
						rows.splice(index, 1);
					} else {
						this.$message.error(data.msg);
					}
				})
				.catch( (data) => {
					this.$message.error('服务器错误，请稍后重试');
				})
		}
	},
	created() {

	},
  }
</script>
