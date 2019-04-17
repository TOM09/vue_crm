//执行人列表
<template>
    <div class="excute-card">
        <el-card class="box-card">
            <el-table :data="detailed" ref="multipleTable" tooltip-effect="dark" style="width: 100%">
                <el-table-column prop="nickname" label="执行人" align="center">
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                </el-table-column>
                <el-table-column prop="time" label="执行时间" align="center">
                </el-table-column>
                <el-table-column prop="timer" label="工时（天）" align="center">
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="deleteRow(scope.$index, detailed)" type="text" v-if="scope.row.is_cancel=='1'" size="small">
                            取消任务
                        </el-button>
                        <el-button @click.native.prevent="redo(scope.$index, detailed)" type="text" v-if="scope.row.is_redo=='1'" size="small">
                            重做
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-card class="box-card" v-if="add_excuter_button=='1'">
            <div slot="header" class="clearfix">
                <span style="float: left">添加执行人</span>
                <el-button type="text" @click="dialogVisible = true" icon="el-icon-edit" style="float: left; padding: 3px 0;margin-left: 10px;" ></el-button>
            </div>
        </el-card>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :modal="false">
            <el-select v-model="admin_ids" multiple placeholder="请选择">
                <el-option
                        v-for="item in excutor_all"
                        :key="item.dd_id"
                        :label="item.nickname"
                        :value="item.dd_id">
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleClick()">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'executionDetail',
    props: ['detailed', 'task_id', 'excutor_all','add_excuter_button'],
    data() {
      return {
        dialogVisible: false,
        admin_ids: [],
        number:1,
      }
    },
    methods: {     
        //添加执行人
        handleClick() {
            this.$post('task/addExcutor', {
            task_id: this.task_id,
            admin_ids: this.admin_ids
            })
            .then((data) => {
                if(data.code) {
                    this.$message({
                        message: '添加成功！',
                        type: 'success'
                    });
                    this.dialogVisible = false;
                    this.admin_ids = [];
                    this.$emit('xRefresh', this.number);
                }else{
                  this.$message.error(data.msg);
                }
            })
            .catch((error) => {
                this.$message.error('服务器错误，请稍后重试');
            })
        },
        deleteRow(index,rows) {
            this.$post('task/cancle', {
                excute_id: rows[index].excute_id
            })
            .then((data) => {
                if(data.code){
                    this.$message({
                        message: '已取消！',
                        type: 'success'
                    })
                    this.$emit('xRefresh',this.number);
                }else{
                    this.$message.error(data.msg);
                }
            })
            .catch((error) => {
                this.$message.error('服务器错误，请稍后重试');
            })
        },
        redo(index,rows) {
            this.$post('task/redo', {
                excute_id: rows[index].excute_id
            })
                .then((data) => {
                    if(data.code){
                        this.$message({
                            message: '重做brief成功',
                            type: 'success'
                        })
                        this.$emit('xRefresh',this.number);
                    }else{
                        this.$message.error(data.msg);
                    }
                })
                .catch((error) => {
                    this.$message.error('服务器错误，请稍后重试');
                })
        }

    },
    created(){

    }
}
</script>
<style lang="less">
    .excute-card{
    .box-card {
        margin-top: 50px;
    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
    }
</style>
