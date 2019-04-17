<template>
    <div class="workNewList">
        <div class="export">
            <el-button type="primary" class="s_work_btn" v-if="seen" @click="toggleExport()">导出</el-button>
        </div>
        <div class="s_work_btn_number">
            已选择<span> {{ number }} </span>项　<el-button type="text" @click="toggleSelection()">清空</el-button>
        </div>
        <div class="block">
            <el-card>
                <span class="demonstration">
                    <el-table :data="workListLoad" ref="multipleTable" tooltip-effect="dark" style="width: 100%;"
                    @selection-change="handleSelectionChange" :row-class-name="tableRowClassName">
                        <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column>
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" inline>
                                    <!--<el-form-item label="销售人员：" class="s_work_content">-->
                                        <!--<span>{{ props.row.person }}</span>-->
                                    <!--</el-form-item>-->
                                     <el-form-item label="申请时间：" class="s_work_content">
                                        <span>{{ props.row.manage_time }}</span>
                                    </el-form-item>
                                      <el-form-item label="客服人员：" class="s_work_content">
                                        <span>{{ props.row.ae }}</span>
                                    </el-form-item>
                                     <el-form-item label="服务商：" class="s_work_content">
                                        <span>{{ props.row.service }}</span>
                                    </el-form-item>
                                    <el-form-item label="执行人员：" class="s_work_content">
                                        <span>{{ props.row.executor }}</span>
                                    </el-form-item>
                                    <el-form-item label="外部来源单号：" class="s_work_content">
                                        <span>{{ props.row.third_order_code }}</span>
                                    </el-form-item>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column label="工单编号" prop="manage_number"></el-table-column>
                        <el-table-column label="订单编号" prop="order_code">
                              <template slot-scope="scope">
                                <div style="color:#409eff; cursor:pointer;" @click="transfer(scope.row)">{{ scope.row.order_code}}</div>
                              </template>
                        </el-table-column>
                        <el-table-column label="工单类型" prop="type"></el-table-column>
                        <el-table-column label="客户级别" prop="rank"></el-table-column>
                        <el-table-column label="订单渠道" prop="trench"></el-table-column>
                        <el-table-column label="客户名称" prop="client" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="产品信息" prop="product" :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column label="状态" prop="step_name"></el-table-column>
                        <el-table-column label="申请人" prop="person"></el-table-column>
                        <el-table-column label="下一步操作人" prop="next_executor"></el-table-column>
                        <el-table-column label="更新时间" prop="update_time"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="120">
                            <template slot-scope="scope">
                                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                                <el-button v-if="scope.row.is_del == 1 ? true : false" @click="handleDelete(scope.$index, workListLoad)"  type="text" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </span>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage4"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="count">
                </el-pagination>
            </el-card>
        </div>
    </div>
</template>

<script>

export default {

    name: 'workList',
    props:{
        workListLoad:{
            type:Array
        },
        count:{
            type:Number
        },
        page:{
            type:Number
        },
        searchData:{
            type:Object
        }
    },
    data () {
        return {
            seen: false,
            is_del:true,
            number: 0,
            currentPage4: 1,
            pageSize: 10,
            /*form:{
                currentPage4: 1,
                pageSize: 10,
            }*/
        }
    },
    methods: {
        tableRowClassName({row, rowIndex}){
            if (row.is_warn) {
                return 'warning-row';
            }
        // else if (rowIndex === 3) {
        //         return 'success-row';
        //     }
            return '';
        },
        handleClick(tab) {
            // if(tab.task_type === 1){
            //     this.$router.push({name: 'workInfo', query: {manage_id: tab.manage_id, step: tab.step, task_id: tab.id}});
            // }else{
                this.$router.push({name: 'workInfo', query: {manage_id: tab.manage_id, work_type: tab.task_type}});
            // }
        },
        transfer(tab) {
            this.$router.push({name: 'orderDetail', params: {id: tab.order_id}});
        },
        toggleExport (rows) {
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.pageSizeData();
        },
        handleSelectionChange (val) {
            this.number = val.length;
        },
        handleCurrentChange(val) {
            this.currentPage4 = val;
            this.pageSizeData();
            this.$forceUpdate(); 
        },
        pageSizeData () {
            if(this.page === 0) {
                this.searchData['currentPage'] = this.currentPage4;
                this.searchData['pageSize'] = this.pageSize;
                this.searchData['range'] = "pending";
                this.$get( 'manageNew/manageList',this.searchData)
                    .then ( (data) => {
                        this.$emit("workList",data.content.data)

                    })
                    .catch ( (error) => {
                        this.$message.error('服务器错误，请稍后重试');
                    })
            } else if (this.page === 1) {
                this.searchData['currentPage'] = this.currentPage4;
                this.searchData['pageSize'] = this.pageSize;
                this.searchData['range'] = "all";
                this.$get( 'manageNew/manageList',this.searchData)
                    .then ( (data) => {
                        this.$emit("workListAll",data.content.data)
                    })
                    .catch ( (error) => {
                        this.$message.error('服务器错误，请稍后重试');
                    })
            } else if (this.page === 2) {
                this.searchData['currentPage'] = this.currentPage4;
                this.searchData['pageSize'] = this.pageSize;
                this.searchData['range'] = "mine";
                this.$get( 'manageNew/manageList',this.searchData)
                    .then ( (data) => {
                        this.$emit("myWorkList",data.content.data)
                    })
                    .catch ( (error) => {
                        this.$message.error('服务器错误，请稍后重试');
                    })
            } else {
                this.$message({
                    showClose: true,
                    message: '服务器错误，请稍后重试',
                    type: 'warning'
                });
            }
        },
        toggleSelection (rows) {
            this.$refs.multipleTable.clearSelection();
        },
        handleDelete(index,rows){
            this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // this.$message({
                //     type: 'success',
                //     message: '删除成功!'
                // });
                this.$get( 'manageNew/manageDel',{manage_id :rows[index].manage_id})
                    .then ( (data) => {
                        if(data.code){
                            this.$message({
                                message: data.content,
                                type: 'success'
                            });
                            rows.splice(index, 1);
                        }
                    })
                    .catch (() => {
                        this.$message.error('服务器错误，请稍后重试');
                    })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    },
    created () {
    },
}
</script>

<style lang="less"  scoped>
 .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
    .workNewList{
        .export{
            text-align: left;
        }
        .s_work_btn{
            height: 40px;
            margin-left: 10px;
        }
        .s_work_btn_number{
            width: 100%;
            margin-top: 10px;
            padding-top: 8px;
            background: #e6f7ff;
            border: 1px solid #bae7ff;
            padding-left: 15px;
            padding-bottom: 8px;
            text-align: left;
        }
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
        .el-table__expanded-cell[class*=cell]{
            margin: 0px;
            padding-left: 13%;
        }
        .s_work_content {
            width:30%;
            display: block;
            float: left;
            margin: 0px;
            padding: 0px;
            margin: 0px;
        }
        .el-form--inline .el-form-item__label{
            float: left;
        }
        .el-form-item__label{
            margin: 0px;
        }
        .el-form--inline .el-form-item{
            margin-right: 0px;
        }
        .el-form-item__content{
            float: left;
            margin-left: 0px;
        }
        .el-table td:first-child .cell, .el-table th:first-child .cell{
            text-align: left;
        }
    }
</style>
