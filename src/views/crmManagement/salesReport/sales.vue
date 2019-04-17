<template>
	<div class="selesReport">
	<el-card>
		<div style="color:#333;font-size: 16px;" class="s_new_title">
			销售报表
		</div>
		<el-date-picker
			v-model="inquireData.time"
			type="daterange"
			align="right"
			unlink-panels
			range-separator="至"
			start-placeholder="开始日期"
			end-placeholder="结束日期"
			:picker-options="pickerOptions"
			format="yyyy 年 MM 月 dd 日"
      		value-format="yyyy-MM-dd">
		</el-date-picker>
		<el-button @click="inquireSales" style="margin-left:10px;" type="primary">查询</el-button>
		<el-button type="primary" @click="downLoadCsv">下载结果集<i class="el-icon-download el-icon--right"></i></el-button>
		<el-card style="margin-top:10px;">
			<el-table :data="tableData" stripe style="width: 100%">
				<el-table-column type="index" width="50" label="序号"></el-table-column>
	    		<el-table-column prop="time" label="本次跟进时间"></el-table-column>
				<el-table-column  prop="department" label="部门"></el-table-column>
				<el-table-column prop="leader" label="部门主管"></el-table-column>
				<el-table-column prop="saleman" label="销售人员"></el-table-column>
        <el-table-column prop="client_sale_man" label="客户负责人"></el-table-column>
        <el-table-column prop="trench" label="渠道"></el-table-column>
				<el-table-column  prop="name" label="联系人"></el-table-column>
				<el-table-column prop="phone" label="联系方式"></el-table-column>
				<el-table-column prop="form" label="跟进方式"></el-table-column>
				<el-table-column  prop="status" label="项目状态"></el-table-column>
				<el-table-column prop="company" label="客户名称"></el-table-column>
        <el-table-column prop="follow_Count" label="跟进次数"></el-table-column>
				<el-table-column prop="product_name" label="订购产品"></el-table-column>
				<el-table-column  prop="price" label="预计金额"></el-table-column>
				<el-table-column prop="detail" label="销售反馈" width="500px"></el-table-column>
				<el-table-column prop="client_time" label="客户创建时间"></el-table-column>
				<el-table-column  prop="first_time" label="首次跟进时间"></el-table-column>
				<el-table-column  prop="approve" label="审批状态"></el-table-column>
			</el-table>
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="inquireData.currentPage"
				:page-sizes="[10, 20, 50, 100]"
				:page-size="inquireData.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="count" style="text-align:center;margin-top:10px;">
			</el-pagination>
		</el-card>
	</el-card>
	</div>
</template>

<script>
import Cookies from 'js-cookie';
export default {
    data () {
		return {
			tableData: [],
			inquireData: {
				time: this.$route.params.time ? this.$route.params.time : "",
				pageSize: 10,
				currentPage: 1,
			},
			count: 0,
			pickerOptions: {
				shortcuts: [{
					text: '最近一周',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: '最近一个月',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: '最近三个月',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
						picker.$emit('pick', [start, end]);
					}
				}]
			},
		}
	},
	methods: {
		handleSizeChange(val) {
			this.inquireData.pageSize = val;
			this.salesData();
		},
		handleCurrentChange(val) {
			this.inquireData.currentPage = val;
			this.salesData();
		},
		inquireSales () {
			this.salesData();
		},
		downLoadCsv(){
			if(this.inquireData.time){
				window.open(`${process.env.BASE_API}/report/export?Authorization=${Cookies.get('access_token')}&time[]=${this.inquireData.time[0]}&time[]=${this.inquireData.time[1]}`);
			}else {
				window.open(`${process.env.BASE_API}/report/export?Authorization=${Cookies.get('access_token')}`)
			}
		},
		salesData () {
			this.$get( 'report/saleInfo',this.inquireData)
				.then( (data) => {
					this.tableData = data.content.detail;
					this.count = data.content.count;
				})
				.catch(() => {})
		},
        // 监听
        getParams(){
            let routerParams = this.$route.params.time;
            this.inquireData.time = routerParams;
        },
	},
    watch:{
        '$route':'getParams'
    },
    // created(){
    //     this.getParams();
    //     this.salesData();
    // },
    created(){
        this.getParams();
        this.salesData();
    }
}
</script>

<style lang="less">

</style>
