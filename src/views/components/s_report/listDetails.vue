<template>
    <div class="listDetails">
        <el-table :data="listData" style="width: 100%">
            <el-table-column prop="nickname" label="填写人"></el-table-column>
            <el-table-column prop="feedback" label="反馈团队"></el-table-column>
            <el-table-column prop="is_week" label="报告类型"></el-table-column>
            <el-table-column prop="month_text" label="日期"></el-table-column>
            <el-table-column prop="price" label="签约金额（万元）"></el-table-column>
            <el-table-column prop="transfer_price" label="回款金额（万元）"></el-table-column>
            <el-table-column prop="follow" label="拜访数量"></el-table-column>
            <el-table-column prop="create_time" label="创建时间"></el-table-column>
            <el-table-column prop="check_time" label="审批时间"></el-table-column>
            <el-table-column prop="approval_text" label="状态"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.is_approval" type="text" size="small" @click="approved(scope.row)">审批</el-button>
                    <el-button type="text" size="small" @click="handleClick(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="text-align: center"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count">
        </el-pagination>
        <el-dialog title="审批" :visible.sync="dialogVisible" width="50%" :modal="false">
            <el-form :model="formData" class="demo-form-inline">
                <el-form-item label="审批结果">
                    <el-select v-model="formData.is_through" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="意见">
                    <el-input type="textarea" :rows="5"  placeholder="请输入内容" v-model="formData.opinion"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisibleT">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'listDetails',
        props: ['listData','count'],
        data () {
            return {
                dialogVisible: false,
                currentPage4: 1,
                options: [
                    {id: 2, name: '通过'},
                    {id: 3, name: '不通过'}
                ],
                formData: {
                    is_through: '',
                    opinion: '',
                    work_id: 0,
                }
            }
        },
        methods: {
            handleClick (row) {
                this.$router.push({name: 'reportDtails' ,params: {id: row.work_id}});
            },
            handleSizeChange (val) {
                this.$emit('sizeC',val)
            },
            handleCurrentChange(val) {
                this.$emit('currentC',val)
            },
            approved (row) {
                this.formData.work_id = row.work_id;
                this.dialogVisible = true;
            },
            dialogVisibleT () {
                this.$post( 'weekmonthwork/approve',this.formData)
                    .then( (data) => {
                        if(data.code){
                            this.$message({
                                message: data.errorMsg,
                                type: 'success'
                            });
                            this.formData = {};
                            this.dialogVisible = false;
                            this.$emit('dialogVisible',true)
                        }else {
                            this.$message({
                                message: data.errorMsg,
                                type: 'warning'
                            });
                        }
                    })
                    .catch(() => {
                        this.$message.error('服务器错误，请稍后重试');
                    })
            } 
        },
        created () {
        }
    }
</script>

<style lang="less" scoped>
    .listDetails {
        
    }
</style>
