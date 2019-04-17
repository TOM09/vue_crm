<!--客户，项目 的附件公共组件-->
<template>
   <div class="annexList">
       <el-table :data="annexData" style="width: 100%">
            <el-table-column fixed prop="name" label="附件名称"></el-table-column>
            <el-table-column prop="person" label="创建人"></el-table-column>
            <el-table-column prop="size" label="大小"></el-table-column>
            <el-table-column prop="brife" label="备注"></el-table-column>
            <el-table-column prop="create_time" label="创建时间"></el-table-column>
            <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="fileUpload(scope.$index, annexData)">
                        下载
                    </el-button>
                    <el-button v-if="scope.row.delete" type="text" size="small" @click.native.prevent="deleteRow(scope.$index, annexData)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
   </div>
</template>       
<script>

export default {

    name: 'annexList',
    props: ['annexData'],

    data () {
        return {

       }
    },
    methods: {
        fileUpload(index, rows){
            window.open(rows[index].path);
        },
        deleteRow(index, rows) {
            this.$emit('annex',rows[index].id);
            rows.splice(index, 1);
            }
    },
    created () {
    }
}
</script>

<style>

</style>
