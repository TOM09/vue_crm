<template>
  <div class="dataList">
    <div class="hitemlistbtn">
      <el-button type="primary" @click="openClick">+新建</el-button>
      <el-button type="primary" v-if="seen">导出</el-button>
    </div>
    <div class="hitemlisttop">
      已选择<span>{{ number }}</span>项 <el-button type="text" @click="toggleSelection()">清空</el-button>
    </div>
    <el-card>
      <div class="hblock">
				<span class="demonstration">
					<el-table ref="multipleTable" :data="itemList" tooltip-effect="dark" @row-click="rowClick" style="width: 100%"
                    @selection-change="handleSelectionChange" align="center">
						<el-table-column type="selection" width="55"></el-table-column>
						<el-table-column fixed prop="code" label="项目编号"></el-table-column>
						<el-table-column prop="name" label="项目名称"></el-table-column>
						<el-table-column prop="client_name" label="客户名称"></el-table-column>
						<el-table-column prop="origin" label="来源"></el-table-column>
						<el-table-column prop="intention" label="意向"></el-table-column>
						<el-table-column prop="salesman" label="销售"></el-table-column>
						<el-table-column prop="partner" label="共同负责人"></el-table-column>
						<el-table-column prop="product_name" label="产品"></el-table-column>
						<el-table-column prop="future_price" label="预算(元)"></el-table-column>
						<el-table-column prop="stage" label="状态"></el-table-column>
						<el-table-column prop="create_time" label="创建日期"></el-table-column>
						<el-table-column fixed="right" label="操作">
							<template slot-scope="scope">
								<el-button type="text" @click="itemDetail(scope.row)" size="small">查看</el-button>
							</template>
						</el-table-column>
					</el-table>
				</span>
        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="form.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="form.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count">
          :style="text-align: center;"
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
  export default {
    props: {
      itemList: Array,
      count: Number,
    },
    data () {
      return {
        seen: false,
        form: {
          pageSize: 10,
          currentPage: 1,
        },
        number: 0,
        selectedOptions:[],
        dd_id: '',
        project: false,
        order: false,
        object: 0,
      }
    },
    methods: {
      openClick () {
        this.$router.push({path: '/addItem'})
      },
      toggleSelection(){
        this.$refs.multipleTable.clearSelection();
      },
      handleSizeChange(val) {
        this.form.pageSize = val;
        this.itemName();
      },
      handleCurrentChange(val) {
        this.form.currentPage = val;
        this.itemName();
      },
      //分页
      itemName () {
        this.$emit("itemPaging",this.form)
      },
      itemDetail(row) {
        this.$router.push({
          name: 'itemDetail',
          params: {id : row.id}
        })
      },
      rowClick(row){
        this.$router.push({
          name: 'itemDetail',
          params: {id : row.id}
        })
      },
      // 列表的选择状态
      handleSelectionChange(val) {
        this.number = val.length;
      },
      info() {
        this.form.pageSize = 10;
        this.form.currentPage = 1;
      }
    },
    created (){

    }
  }
</script>
<style scoped>
  .el-table__row:hover{
    cursor: pointer;
  }
</style>
