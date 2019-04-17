<!--brief的附件列表组件-->
<template>
    <el-table :data="file" ref="multipleTable"  tooltip-effect="dark"style="width: 100%">
        <el-table-column prop="name" label="附件名称"></el-table-column>
        <el-table-column prop="nickname" label="创建人" ></el-table-column>
        <el-table-column prop="create_time" label="执行时间"></el-table-column>
        <el-table-column prop="file_size" label="大小"></el-table-column>
        <el-table-column  prop="brife" label="备注"></el-table-column>
        <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
        <el-button  type="text" size="small"  @click="fileClone(scope.$index,file)">下载</el-button>
        <el-button  type="text" size="small" v-if="scope.row.is_del == 1" @click="deleteRow(scope.$index,file)">删除</el-button>
        </template>
        </el-table-column>
    </el-table>
</template>

<script>
	export default {
		name:'fileList',
		props:['file'],
	    data() {
	      return {

	      }
	    },
	    methods: {
            deleteRow(index, rows) {
                this.$post( 'task/delete',{file_id:rows[index].file_id})
                    .then( (data) => {
                        if(data.code){
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            rows.splice(index, 1);
                        } else {
                            this.$message.error(data.errorMsg);
                        }
                    })
                    .catch( () => {
                        this.$message.error('服务器错误，请稍后重试');
                    })
            },
            fileClone (index, rows) {
                window.open(rows[index].path);
            }
        }
    }
</script>
<style scoped>
</style>
