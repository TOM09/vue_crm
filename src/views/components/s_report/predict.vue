<template>
    <div class="predict">
        <div class="writePerformance">
            <p></p>
            <p>预计签约明细</p>
        </div>
        <el-table :data="performanceData" style="width: 100%" :header-row-style="rowClass">
            <el-table-column fixed prop="department" label="部门" width="120"></el-table-column>
            <el-table-column prop="saleman" label="销售人员" width="100"></el-table-column>
            <el-table-column prop="company" label="客户名称" width="150"></el-table-column>
            <el-table-column prop="product_name" label="订购产品"></el-table-column>
            <el-table-column prop="future_price" label="预计签约金额(万元)"></el-table-column>
            <el-table-column prop="expect_sign_time" label="签约时间"></el-table-column>
            <el-table-column prop="text" label="备注"></el-table-column>
        </el-table>
        <el-pagination  v-if="pcount > 10"
            class="writePagination"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :total="pcount">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: 'predict',
        props: ['performanceData','pcount'],
        data () {
            return {
                currentPage: 1,        // 业绩统计表格默认当前页
            }
        },
        methods : {
			// 业绩统计表格第几页
			handleCurrentChange (val) {
                this.$emit('pcurrent',val)
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
    .predict {
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
