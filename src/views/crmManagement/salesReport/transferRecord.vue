<template>
    <div class="transfer">
        <el-card>
            <el-form :model="ruleForm" ref="ruleForm" label-position="right" label-width='110px'>
                <el-form-item prop="order_code" label="订单编号：" class="WHSInput">
                    <el-input v-model="ruleForm.order_code" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item prop="number" label="工单编号：" class="WHSInput">
                    <el-input v-model="ruleForm.number" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item prop="product_id" label="产品：" class="WHSInput">
                            <!-- change-on-select -->
                    <el-cascader
                            expand-trigger="hover"
                            :show-all-levels="false"
                            filterable
                            clearable
                            :options="product"
                            v-model="ruleForm.pro"
                            @change="handleProduct"
                            class="s_client_width"
                    >
                    </el-cascader>
                </el-form-item>
                <el-form-item prop="change_result" label="转单原因：" class="WHSInput">
                    <el-select v-model="ruleForm.change_result" filterable clearable>
                        <el-option v-for="(change_result,index) in change_results" :key="index" :value="change_result.value" :label="change_result.label"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="change_time" label="申请日期：" class="WHSInput">
                    <el-date-picker
                            v-model="ruleForm.change_time"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions2">
                    </el-date-picker>
                </el-form-item>

                <el-form-item prop="change_type" label="类型：" class="WHSInput">
                    <el-select v-model="ruleForm.change_type" filterable clearable>
                        <el-option v-for="(statu,index) in status" :key="index" :value="statu.value" :label="statu.label"
                        >

                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="WHSBtn">
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                    <el-button @click="exportWorkInfo">导出</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card style="margin-top:10px;">
            <el-table :data="tableData" stripe style="width: 100%" ref="tableRef">
                <el-table-column prop="order_code" label="订单编号">
                    <template slot-scope="scope">
                        <div style="color:#409eff; cursor:pointer;" @click="transfer(scope.row)">{{ scope.row.order_code}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="number" label="工单编号">
                    <template slot-scope="scope">
                        <div style="color:#409eff; cursor:pointer;" @click="handleClick(scope.row)">{{ scope.row.number}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="类型"></el-table-column>
                <el-table-column prop="name" label="产品"></el-table-column>
                <el-table-column prop="product_brief" label="产品说明"></el-table-column>
                <el-table-column prop="price" label="产品金额"></el-table-column>
                <el-table-column prop="before_excutor_leading" label="转出负责人"></el-table-column>
                <el-table-column prop="before_excutor" label="转出执行人"></el-table-column>
                <el-table-column prop="after_excutor_leading" label="转入负责人"></el-table-column>
                <el-table-column prop="after_excutor" label="转入执行人"></el-table-column>
                <el-table-column prop="reason" label="转单原因"></el-table-column>
                <el-table-column prop="remark" label="转单说明"></el-table-column>
                <el-table-column prop="change_time" label="转单日期"></el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="ruleForm.page"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="ruleForm.perPage"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="count" style="text-align:center;margin-top:10px;">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    import Util from '@/libs/util';
    import cookies from 'js-cookie'
    export default{
        data(){
            return{
                Authorization: cookies.get('access_token'),
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                ruleForm: {
                    pro:[],
                    order_code:'',   // 订单编号
                    number:'', //工单编号
                    product_id: [],//产品ID
                    change_result:'',//转单原因
                    change_time:"",//转单日期
                    change_type: [],//类型
                    perPage:10,
                    page:1,
                },
                product: [],
                status:[
                    {
                        "value": "1",
                        "label": "换客服"
                    },
                    {
                        "value": "2",
                        "label": "换执行"
                    }
                ],
                change_results:[
                    {
                        "value": 1,
                        "label": "多次修改不满意"
                    },
                    {
                        "value": 2,
                        "label": "设计不满意/沟通不顺畅/客户要求换设计"
                    },
                    {
                        "value": 3,
                        "label": "客户要求不明确/设计师提出换设计"
                    },
                    {
                        "value": 4,
                        "label": "客户长期失联/换对接人/换项目/升级设计"
                    },
                    {
                        "value": 5,
                        "label": "设计师由于其他工作/离职无法继续设计"
                    },
                    {
                        "value": 6,
                        "label": "无法注册"
                    },
                    {
                        "value": 7,
                        "label": "操作有误"
                    },
                    {
                        "value": 8,
                        "label": "其他"
                    }
                ],
                inquireData: {
                    page: 1,
                    perPage: 10,
                },
                tableData: [{}],
                type: [
                    {type: 1, name: '售前调用'},
                    {type: 2, name: '成单执行'},
                ],
                count: 0,
            }
        },
        methods:{
            // 选择产品的id
            handleProduct (value) {
                if(value.length > 1){
                    this.ruleForm.product_id = value[1];
                } else {
                    this.ruleForm.product_id = [];
                }
            },
            // 每页多少条
            handleSizeChange (val) {
                this.ruleForm.perPage = val;
                this.followList();
            },
            // 第几页
            handleCurrentChange (val) {
                this.ruleForm.page = val;
                this.followList();
            },

            // 查询列表
            onSubmit () {
                this.ruleForm.perPage = 10;
                this.ruleForm.page = 1;
                this.$get( 'report/manageChangeRecord',this.ruleForm)
                    .then( (data) => {
                        if(data.code){
                            this.tableData = data.content.list.data;
                            this.count = data.content.list.count;
        //                    this.status = data.content.change_type;
                        }
                    })
                    .catch(() => {

                        })
            },
            // 重置查询条件
            resetForm (formName) {
                this.ruleForm.pro = '';
                this.$refs[formName].resetFields();
            },
            exportWorkInfo () {
                for (let index in this.ruleForm) {
                    if (this.ruleForm[index] && this.ruleForm[index].length !== 0) {
                        let strArgs = Util.makeUrl(this.ruleForm);
                        window.open(`${process.env.BASE_API}/report/exportManageChangeRecord?Authorization=${this.Authorization}${strArgs}`)
                        return false;
                    }
                }
                this.$message({
                    message: '请输入查询条件后方可导出',
                    type: 'warning'
                });
            },
            personChange() {
                if (this.ruleForm.department.length > 0) {
                    this.orderPerson();
                }
            },
            orderPerson() {
                this.$get( 'report/selectData',this.ruleForm)
                    .then( (data) => {
                    this.product = data.content.product;
//                    this.status = data.content.status;
            })
            .catch(() => {})
            },
            transfer(tab) {
                this.$router.push({name: 'orderDetail', params: {id: tab.order_id}});
            },
            handleClick(tab) {
                // if(tab.task_type === 1){
                //     this.$router.push({name: 'workInfo', query: {manage_id: tab.manage_id, step: tab.step, task_id: tab.id}});
                // }else{
                this.$router.push({name: 'workInfo', query: {manage_id: tab.manage_id, work_type: tab.link_type}});
                // }
            },
            followList(){
                this.$get( 'report/manageChangeRecord',this.ruleForm)
                    .then( (data) => {
                        this.tableData = data.content.list.data;
                        this.count = data.content.list.count;
                    })
                    .catch(() => {
                        this.$message.error('服务器错误，请稍后重试');
                    })
            },
        },
        created () {
            this.orderPerson();
            this.followList();
//            this.$store.dispatch('dept',{});
        }
    }
</script>

<style lang="less">
    .transfer {
        .WHSInput {
            width: 32.3%;
            float: left;
            height: 50px;
        }
        .WHSInput .el-date-editor.el-input, .el-date-editor.el-input__inner{
            width: 100%;
        }
        .WHSInput .s_client_width {
            width: 100%;
        }
        .WHSInput .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
             width: 100%;
         }
        .WHSInput .el-cascader{
            width: 100%;
        }
        .WHSInput .el-select{
            width: 100%;
        }
        .WHSBtn {
            float: left;
            margin-left: 65%;
        }
        @media(max-width: 1280px){
            .WHSBtn {
                float: left;
                margin-left: 60%;
            }
        }
    }
</style>