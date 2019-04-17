<template>
	<div class="writeReport">
		<el-card>
			<el-form ref="addWeekwork" :model="addWeekwork" label-width="100px" style="margin-top: 30px">
				<el-form-item label="选择模板" class="writeSelectT">
					<el-select v-model="addWeekwork.is_week" @change="isWeekN" placeholder="请选择" class="writeSelectP">
						<el-option v-for="item in isWeek" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="请选择周" v-if="addWeekwork.is_week == 1" class="writeSelect">
					<el-date-picker :picker-options="optionss" class="writeSelectP" v-model="weekN" type="week" @change="getTime" format="yyyy 第 WW 周" placeholder="选择周"></el-date-picker>
				</el-form-item>
				<el-form-item label="请选择月" v-if="addWeekwork.is_week == 2" class="writeSelect">
					<el-date-picker class="writeSelectP" v-model="addWeekwork.month" @change="getMonth" type="month" value-format="yyyy-MM" placeholder="选择月"></el-date-picker>
				</el-form-item>
				<el-form-item label="反馈团队" class="writeSelectT">
					<el-input v-model="feedback" :disabled="true" class="writeInput"></el-input>
				</el-form-item>
				<el-form-item label="目前团队人数" class="writeSelect">
					<el-input v-model="count" :disabled="true" class="writeInput"></el-input>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card style="margin-top: 20px;">
			<el-form ref="form" :model="form" label-width="100px" style="margin-top: 30px">
				<el-form-item label="部门" class="writeForm">
					<el-cascader clearable class="writeCascader" change-on-select :options="dept" v-model="form.department" @change="departmentC">
					</el-cascader>
				</el-form-item>
				<el-form-item label="销售人员" class="writeFormP">
					<el-select v-model="form.person" placeholder="请选择" style="width: 300px;" clearable>
						<el-option class="writeCascader" v-for="item in person" :key="item.dd_id" :label="item.nickname" :value="item.dd_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item class="writeButton">
					<el-button @click="filtrate" type="primary">筛选</el-button>
				</el-form-item>
			</el-form>
			<writeReportZ :wirteData="wirteData,wcount,price,transfer_price,follow" @wcurrent="wcurrent"></writeReportZ>
			<returned :returnedData="returnedData,rcount" @rcurrent="rcurrent"></returned>
			<predict :performanceData="performanceData,pcount" @pcurrent="pcurrent"></predict>
		</el-card>
		<el-card style="margin-top: 20px;">
			<div class="writebotton">
				工作总结
			</div>
			<el-input type="textarea" :rows="5" placeholder="请输入工作总结（3000字以内）" v-model="addWeekwork.report_text"> </el-input>
			<div class="writebotton">
				工作计划
			</div>
			<el-input type="textarea" :rows="5" placeholder="请输入工作计划（3000字以内）" v-model="addWeekwork.plan_text"> </el-input>
			<el-button class="writeB" @click="WeekworkPost" type="primary">提交</el-button>
		</el-card>
	</div>
</template>

<script>
	import writeReportZ from '../.././components/s_report/writeReportZ'
	import returned from '../.././components/s_report/returnedMoney'
	import predict from '../.././components/s_report/predict'
	export default {
		components: {
			writeReportZ,
			returned,
			predict
		},
		data() {
			return {
				addWeekwork: {
					is_week: 1,
					week: [],
					month: new Date().toJSON().slice(0, 7),
					report_text: '',
					plan_text: '',
				},
				weekN: new Date(),
				month: '',
				optionss: {
					firstDayOfWeek: 1,
				},
				isWeek: [{
					value: 1,
					label: '周报'
				}, {
					value: 2,
					label: '月报'
				}],
				textarea: '',
				// 筛选数据
				form: {
					department: [],
					person: '',
				},
				feedback: '',
				count: 0, // 团队人数
				rcount: 0, // 回款明细表格条数
				pcount: 0, // 预计签约明细表格条数
				wcount: 0, // 业绩统计表格条数
				department: [],
				newDepartment: [],
				performanceData: [],
				returnedData: [],
				wirteData: [],
				price: 0, // 合计签约金额
				transfer_price: 0, // 合计回款金额
				follow: 0, // 合计拜访数量
				paybackList: {
					month: '',
					week: [],
					department: [],
					person: '',
					currentPage: 1,
					is_week: 0,
				},
				company: {
					company_id: '',
					dept: ''
				},
			}
		},
		computed: {
			dept: {
				get: function() {
					return this.$store.state.app.dept;
				},
				set: function() {}
			},
			person: {
				get: function() {
					return this.$store.state.app.commonPerson;
				},
				set: function() {}
			}
		},
		methods: {
			Appendzero(obj) {
				if(obj < 10) {
					return '0' + '' + obj
				} else {
					return obj;
				}
			},
			getTime(data) {
				this.paybackList.is_week = this.addWeekwork.is_week;
				let currentDay = data.getDay();
				if(currentDay == 0) {
					currentDay = 7
				}
				let mondayTime = data.getTime() - (currentDay - 1) * 24 * 60 * 60 * 1000;
				let sundayTime = data.getTime() + (7 - currentDay) * 24 * 60 * 60 * 1000;
				this.addWeekwork.week = [];
				let aDate = new Date(mondayTime).getFullYear() + '/' + this.Appendzero((new Date(mondayTime).getMonth() + 1)) + '/' + this.Appendzero(new Date(mondayTime).getDate());
				let bDate = new Date(sundayTime).getFullYear() + '/' + this.Appendzero((new Date(sundayTime).getMonth() + 1)) + '/' + this.Appendzero(new Date(sundayTime).getDate());
				this.addWeekwork.week.push(aDate, bDate);
				this.paybackList.week = this.addWeekwork.week;
				this.kNew();
				this.cNew();
				this.rNew();
				// console.log("今天是" + data.getDate() + "号，星期" + currentDay + "\r");
				// console.log("周一是" + new Date(mondayTime).getDate() + "号，周日是" + new Date(sundayTime).getDate()+"号")
				// console.log("周一 " + new Date(mondayTime).toLocaleDateString()+ "\n周末 " + new Date(sundayTime).toLocaleDateString()+" "+new Date(mondayTime).toLocaleTimeString())
			},
			// 筛选列表
			filtrate() {
				this.paybackList.department = this.form.department;
				this.paybackList.person = this.form.person;
				this.kNew();
				this.cNew();
				this.rNew();
			},
			writeNew() {
				this.$get('weekmonthwork/selectData', {
						department: this.newDepartment
					})
					.then((data) => {
						this.feedback = data.content.feedback;
						this.count = data.content.count;
						this.department = data.content.department;
						this.person = data.content.person;
					})
					.catch(() => {})
			},
			// 回款明细第几页
			rcurrent(val) {
				this.paybackList.currentPage = val;
				this.rNew();
			},
			// 业绩统计第几页
			wcurrent(val) {
				this.paybackList.currentPage = val;
				this.kNew();
			},
			// 预约签约第几页
			pcurrent(val) {
				this.paybackList.currentPage = val;
				this.cNew();
			},
			// 选择部门以后返回销售人员
			departmentC(value) {
				this.newDepartment = value;
				this.company.dept = value;
				this.$store.dispatch('dept', this.company);
				this.writeNew();
			},
			// 提交新建报告
			WeekworkPost() {
				this.$post('weekmonthwork/addWeekwork', this.addWeekwork)
					.then((data) => {
						if(data.code) {
							this.$message({
								message: data.errorMsg,
								type: 'success'
							});
							this.addWeekwork = {};
							this.addWeekwork.is_week = 1;
							this.addWeekwork.week = [];
							this.$router.push({
								name: 'reportDtails',
								params: {
									id: data.content.work_id
								}
							})
						} else {
							this.$message.error(data.errorMsg);
						}
					})
					.catch(() => {})
			},
			// 周时间
			newWeek() {
				let data = new Date();
				let currentDay = data.getDay();
				if(currentDay == 0) {
					currentDay = 7
				}
				let mondayTime = data.getTime() - (currentDay - 1) * 24 * 60 * 60 * 1000;
				let sundayTime = data.getTime() + (7 - currentDay) * 24 * 60 * 60 * 1000;
				let aDate = new Date(mondayTime).getFullYear() + '/' + this.Appendzero((new Date(mondayTime).getMonth() + 1)) + '/' + this.Appendzero(new Date(mondayTime).getDate());
				let bDate = new Date(sundayTime).getFullYear() + '/' + this.Appendzero((new Date(sundayTime).getMonth() + 1)) + '/' + this.Appendzero(new Date(sundayTime).getDate());
				this.addWeekwork.week.push(aDate, bDate);
				this.paybackList.week = this.addWeekwork.week;
			},
			rNew() {
				// 回款统计
				this.$get('weekmonthwork/paybackList', this.paybackList)
					.then((data) => {
						this.returnedData = data.content.detail;
						this.rcount = data.content.count;
					})
					.catch(() => {})
			},
			cNew() {
				// 预计签约
				this.$get('weekmonthwork/contractList', this.paybackList)
					.then((data) => {
						this.performanceData = data.content.detail;
						this.pcount = data.content.count;
					})
					.catch(() => {})
			},
			kNew() {
				// 业绩统计
				this.$get('weekmonthwork/kpiData', this.paybackList)
					.then((data) => {
						let detail = data.content;
						this.wirteData = detail.detail;
						this.wcount = detail.count;
						this.price = detail.price;
						this.transfer_price = detail.transfer_price;
						this.follow = detail.follow;
					})
					.catch(() => {})
			},
			isWeekN(val) {
				if(val === 2) {
					this.paybackList.month = this.addWeekwork.month;
					this.kNew();
					this.cNew();
					this.rNew();
				} else if(val === 1) {
					this.paybackList.week = this.addWeekwork.week;
					this.kNew();
					this.cNew();
					this.rNew();
				}
			},
			// 选择月份的值
			getMonth() {
				this.paybackList.is_week = this.addWeekwork.is_week;
				this.paybackList.month = this.addWeekwork.month;
				this.kNew();
				this.cNew();
				this.rNew();
			}
		},
		created() {
			this.$store.dispatch('dept', {});
			this.paybackList.month = this.addWeekwork.month;
			this.paybackList.is_week = this.addWeekwork.is_week;
			this.kNew();
			this.cNew();
			this.rNew();
			this.writeNew();
			this.newWeek();
		}
	}
</script>

<style lang="less" scoped>
	.writeReport {
		.writeTitle {
			width: 100%;
			height: 50px;
			color: #000;
			font-size: 14px;
			font-weight: 700;
			border-bottom: 1px solid #ccc;
		}
		.writePrice {
			width: 100%;
			height: 50px;
			font-size: 14px;
			color: #999;
		}
		.writebotton {
			width: 100%;
			height: 50px;
			color: #000;
			font-size: 14px;
			margin-top: 20px;
			font-weight: 700;
			// border-bottom: 1px solid #ccc;
		}
		.writeInput {
			width: 300px;
		}
		.writeForm {
			width: 35%;
			display: inline-block;
		}
		.writeFormP {
			width: 35%;
			margin-left: 50px;
			display: inline-block;
		}
		.writeSelect {
			width: 35%;
			margin-left: 50px;
			display: inline-block;
		}
		.writeSelectT {
			width: 35%;
			display: inline-block;
		}
		.writeSelectP {
			width: 300px;
		}
		.writebottonB {
			font-size: 14px;
			color: #666;
			margin-top: 10px;
			margin-bottom: 10px;
		}
		.writeB {
			margin-left: 90%;
			margin-top: 20px;
		}
		.writeCascader {
			width: 300px;
		}
		.writeButton {
			width: 50px;
			display: inline-block;
		}
	}
</style>