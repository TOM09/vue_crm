<template>
    <div class="writeZ">
        <div class="writePerformance">
			<p></p>
			<p>业绩统计</p>
		</div>
		<div style="margin-top: 20px;margin-bottom: 20px;">
			<span class="writePrice">合计签约金额（万元）：{{ price }}</span>
			<span class="writePrice">合计回款金额（万元）：{{ transfer_price }}</span>
			<span class="writePrice">合计拜访数量：{{ follow }}</span>
		</div>
		<el-table :data="wirteData" style="width: 100%" :header-row-style="rowClass">
			<el-table-column fixed prop="department" label="部门" width="120"></el-table-column>
			<el-table-column prop="name" label="姓名" width="100"></el-table-column>
			<el-table-column prop="position" label="职位" width="150"></el-table-column>
			<el-table-column prop="price" label="签约金额(万元)"></el-table-column>
			<el-table-column prop="transfer_price" label="回款金额(万元)"></el-table-column>
			<el-table-column prop="follow" label="拜访数量(次)"></el-table-column>
		</el-table>
		<el-pagination v-if="wcount > 10"
			class="writePagination"
			@current-change="handleCurrentChange"
			layout="prev, pager, next"
			:total="wcount">
		</el-pagination>
	</div>
</template>

<script>
    export default {
        name: 'writeReportZ',
        props: ['wirteData','wcount','price','transfer_price','follow'],

        data () {
            return {
				currentPage: 1,        // 业绩统计表格默认当前页
				show: false,
            }
        },
        methods : {
			// 业绩统计表格第几页
			handleCurrentChange (val) {
				this.$emit('wcurrent',val)
			},
			rowClass (row, index) {
				return { "color": "#454545"}
			}
        },
        created() {
		}

    }
</script>

<style lang="less" scoped>
    .writeZ {
        .writePerformance {
			width: 100%;
			height: 50px;
			color: #000;
			font-size: 14px;
			margin-top: 20px;
			font-weight: 700;
			padding: 1px;
			border-bottom: 1px solid #ccc;
		}
		.writePerformance p {
			line-height: 24px;
			display: inline-block;
		}
		.writePerformance p:nth-of-type(1) {
			width: 5px;
			height: 24px;
			float: left;
			background: #4380ff;
			margin-right: 10px;
		}
		.writePrice {
			font-size: 14px;
			color: #999;
		}
		.writePrice:nth-of-type(2) {
			margin-left: 30px;
		}
		.writePrice:nth-of-type(3) {
			margin-left: 30px;
		}
		.writePagination {
			text-align: center;
			margin-top: 20px;
			margin-bottom: 10px;
		}
    }
</style>
