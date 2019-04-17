<template>
    <div class="returned">
        <div class="writePerformance">
            <p></p>
			<p>回款明细</p>
        </div>
        <el-table :data="returnedData" style="width: 100%" :header-row-style="rowClass">
            <el-table-column fixed prop="department" label="部门" width="120"></el-table-column>
            <el-table-column prop="saleman" label="销售人员" width="100"></el-table-column>
            <el-table-column prop="company" label="客户名称" width="150"></el-table-column>
            <el-table-column prop="product_name" label="订购产品"></el-table-column>
            <el-table-column prop="price" label="订单金额（万元）"></el-table-column>
            <el-table-column prop="money" label="已收款（万元）"></el-table-column>
            <el-table-column prop="not_transfer_price" label="待收款（万元）"></el-table-column>
            <el-table-column prop="order_plan_price" label="下期回款预计（万元）"></el-table-column>
        </el-table>
        <el-pagination  v-if="rcount > 10"
            class="writePagination"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :total="rcount">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: 'retutned',
        props: ['returnedData','rcount'],
        data () {
            return {
                currentPage: 1,        // 业绩统计表格默认当前页
                count: 0,			   // 业绩统计表格共多少条
            }
        },
        methods : {
			// 业绩统计表格第几页
			handleCurrentChange (val) {
                this.$emit('rcurrent',val)
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
    .returned {
         .writePerformance {
			width: 100%;
			height: 50px;
			color: #000;
			font-size: 14px;
            margin-top: 20px;
            font-weight: 700;
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
        .writePagination {
			text-align: center;
			margin-top: 20px;
			margin-bottom: 10px;
		}
    }
</style>
