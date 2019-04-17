//Brief列表
<template>
	<div class="x_hblock">
	<el-card style="background-color:#fff">
		<el-form >
			<el-form-item>
			<span class="task-font">Brief列表</span>
				<el-input placeholder="请输入Brief标题"  class="input-with-select" @input="handleSelect">
		       </el-input>
			</el-form-item>
		</el-form>
		<span class="demonstration">
        <el-table ref="multipleTable" :data="list" tooltip-effect="dark" style="width: 100%" align="center">
                        <el-table-column
                          prop="status_title"
                          label="状态"
                          align="center">
                        <template slot-scope="scope">
                             <span v-if="scope.row.status=='0'" style="color:#999">• {{scope.row.status_title}}</span>
                             <span v-if="scope.row.status=='1'" style="color:#2d87fd">• {{scope.row.status_title}}</span>
                             <span v-if="scope.row.status=='2'" style="color:#ff2d55">• {{scope.row.status_title}}</span>
                             <span v-if="scope.row.status=='3'" style="color:#0fe09f">• {{scope.row.status_title}}</span>
                             <span v-if="scope.row.status=='4'" style="color:#ccc">• {{scope.row.status_title}}</span>
                        </template>
                        </el-table-column>
                        <el-table-column
                          prop="title"
                          label="Brief标题"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="man"
                          label="执行人"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="end_time"
                          label="要求截止时间"
                        >
                        </el-table-column>
                        <el-table-column
                          prop="percent"
                          label="执行情况"
                        >
                         <template slot-scope="scope">
                        	<el-progress :percentage="scope.row.percent"></el-progress>
                        </template>
                        </el-table-column>
                       <el-table-column
                         fixed="right"
                         label="操作"
                       >
                        <template slot-scope="scope">
                            <el-button type="text" size="small" v-if="scope.row.button=='2'" @click="finishTask(scope.row)">完成Brief</el-button>
                            <el-button type="text" size="small" v-if="scope.row.button=='1'"  @click="startTask(scope.row)">开始Brief</el-button>
                            <el-button type="text" size="small" @click="lookover(scope.row)">查看</el-button>
                        </template>
                      </el-table-column>
        </el-table>
        <el-dialog
            title="添加附件"
            :visible.sync="newAnnexDialog"
            :modal="false">
            <upload @fileStatus="fileStatus" @fileTrue = "fileTrue" :success="success"></upload>
            <div class="demo-input-suffix">
                <span class="s_details_input">备注:</span>
                <el-input
                    style="margin-top: 20px"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入内容"
                    v-model="textarea">
                </el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="newAnnexDialog = false">取 消</el-button>
                <el-button type="primary" @click="newAnnexDialogT">确 定</el-button>
            </span>
        </el-dialog>
        </span>
		<el-pagination
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="currentPage"
			:page-sizes="[10, 20, 50, 100]"
			layout="total, sizes, prev, pager, next, jumper"
            :total="count">
		</el-pagination>
		</el-card>
	</div>
</template>
<script>
import upload from '../.././components/s_customer/fiieDataCe'
	export default {
        components:{ upload },
        name: 'newTask',
        props: ['list','count','name'],
        data() {
            return {
                success:false,
                currentPage: 1,    // 列表的第几页
                pageSize: 10,       // 每页的条数
                task_id:'',
                status:'',
                textarea:'',
                number:-1,
                newAnnexDialog: false,
            }
        },
        created() {

        },
        methods: {
            //搜索
            handleSelect(v) {
                this.$get( 'task/list',{title:v})
                    .then( (data) => {
                        this.$emit('alist',data.content.detail);
                    })
                    .catch ( (error) => {
                        this.$message.error('服务器错误，请稍后重试');
                    })
            },
            //查看
            lookover(row){
                this.$router.push({name:'taskDetail',params:{id:row.task_id}})
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.pageSizeData();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.pageSizeData();
            },
            pageSizeData () {
                this.$get( 'task/list',{currentPage: this.currentPage, pageSize: this.pageSize,status: this.name})
                    .then ( (data) => {
                        this.$emit("x_list",data.content.detail)
                    })
                    .catch ( (error) => {
                        this.$message.error('服务器错误，请稍后重试');
                    })
            },
            //开始Brief
            startTask(row){
                this.$post( 'task/beginEnd',{task_id:row.task_id,status:row.status})
                    .then((data) => {
                        if(data.code){
                            this.$message({
                                message: 'Brief开始！',
                                type: 'success'
                            });
                            this.$emit('Refresh',this.number);
                        }else{
                            this.$message.error(data.errorMsg);
                        }
                    })
                    .catch ((error) => {
                        this.$message.error('服务器错误，请稍后重试');
                    })
            },
            //完成Brief
            finishTask (row) {
                this.newAnnexDialog = true;
                this.task_id = row.task_id;
                this.status = row.status;
            },
            //oss
            fileStatus(data) {
                this.attach = data;
            },
            fileTrue(data){
                this.success = data;
            },
            // 文件上传
            newAnnexDialogT() {
                this.$post( 'task/beginEnd',{task_id:this.task_id,status:this.status,brife: this.textarea,attach:this.attach})
                    .then( (data) => {
                        if(data.code) {
                            this.$message({
                                message: data.errorMsg,
                                type: 'success'
                            });
                            this.textarea = "";
                            this.success = true;
                            this.newAnnexDialog = false;
                            this.$emit('Refresh', this.number);
                        }else{
                            this.$message({
                                message: data.errorMsg,
                                type: 'warning'
                            });

                        }
                    })
                    .catch( (data) => {
                        this.$message.error(data.errorMsg);
                    })
            }
        }
	}
</script>
<style lang='less' scoped>
.x_hblock{
    .input-with-select{
        width: 250px;
        float:right;
        border-radius:30px;
        border-radius:30px;
    }
    .task-font{
        font-size:18px;
        font:Georgia,Serif;
        font-weight:bolder;
    }
    .el-form-item__content {
        line-height: 40px;
        position: relative;
        font-size: 14px;
    }
    .el-pagination{
        padding: 20px;
        text-align: center
    }
}
</style>
