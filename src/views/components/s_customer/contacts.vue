// 新增联系人的组件，目前先这样，不完善
<template>
    <div class="contacts">
        <el-form>
            <el-form-item prop="date" class="s_client_tab">
                <el-table
                    :data="tableData"
                >
                    <el-table-column
                        label="姓名"
                        width="180"
                    >
                        <template slot-scope="scope">
                            <el-input v-model="date.link_name" placeholder="请输入内容"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="联系类型"
                        width="180"
                    >
                        <template slot-scope="scope">
                            <el-select v-model="date.link_type" placeholder="请选择">
                                <el-option
                                    v-for="item in link_type"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="联系方式"
                        width="180"
                    >
                        <template slot-scope="scope">
                            <el-input v-model="date.telephone" placeholder="请输入内容"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="部门"
                        width="180"
                    >
                        <template slot-scope="scope">
                            <el-input v-model="date.department" placeholder="请输入内容"></el-input>
                        </template>
                        
                    </el-table-column>
                    <el-table-column
                        label="职务"
                        width="180"
                    >
                        <template slot-scope="scope">
                            <el-input v-model="date.duty" placeholder="请输入内容"></el-input>
                        </template>
                        
                    </el-table-column>
                    <el-table-column
                        label="备注"
                        width="180"
                    >
                        <template slot-scope="scope">
                            <el-input v-model="date.remarks" placeholder="请输入内容"></el-input>
                        </template>
                        
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="180"
                    >
                         <template slot-scope="scope">
                            <el-button
                                @click.native.prevent="handleEdit(scope.$index, scope.row )"
                                type="text"
                                size="small"
                            >
                                保存
                            </el-button>
                            <el-button
                                @click.native.prevent="deleteRow(scope.$index, tableData)"
                                type="text"
                                size="small"
                            >
                                移除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

export default {
    // 组件的 name 和传值
    name: 'contacts',
    props: [],

    data () {
        return {
            // 联系人的基本信息储蓄
            date: {
                link_name: '',
                link_type: '',
                telephone: '',
                department: '',
                duty: '',
                remarks: '',
            },
            // 联系方式的选择
            link_type: [{
                value: '1',
                label: '电话'
                }, {
                value: '2',
                label: '微信'
                }, {
                value: '3',
                label: 'QQ'
            }],
            // 表格数据
            tableData: [{}],
        }
    },
    methods: {
        // 不完美，填完信息要保存一下再行
        handleEdit() {
            this.$message({
                message: '联系人添加此客户成功，请点击确认添加',
                type: 'warning'
            });
            this.$emit("information",this.date);
            this.$emit("data_list",this.date);
            this.date = {};
        },
        deleteRow(index, rows) {
            if (rows.length > 1) {
                rows.splice(index, 1);
            } else {
                this.$message({
                    message: '必须有一个联系人',
                    type: 'warning'
                });
            }
        }
    },
    created () {
        
    }
}
</script>

<style>

</style>
