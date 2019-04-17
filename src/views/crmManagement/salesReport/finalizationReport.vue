<!--执行明细报表-->
<template>
    <div class="final">
        <el-card>
            <el-form ref="form" :model="form" label-width='110px'>
                <el-form-item prop="order_code" label="订单编号：" class="WHSInput">
                    <el-input v-model="form.order_code" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item prop="manage_number" label="工单编号：" class="WHSInput">
                    <el-input v-model="form.manage_number" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item prop="service_type" label="执行团队：" class="WHSInput">
                    <el-select v-model="form.service_type" filterable clearable>
                        <el-option v-for="(change_result,index) in executive_team" :key="index" :value="change_result.value" :label="change_result.label"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="create_dd_id" label="申请人：" class="WHSInput">
                    <el-select v-model="form.create_dd_id" filterable clearable>
                        <el-option v-for="(change_result,index) in person" :key="index" :value="change_result.dd_id" :label="change_result.nickname"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="ae" label="客服：" class="WHSInput">
                    <el-select v-model="form.ae" filterable clearable>
                        <el-option v-for="(change_result,index) in person" :key="index" :value="change_result.dd_id" :label="change_result.nickname"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="excutor_id" label="执行人：" class="WHSInput">
                    <el-select v-model="form.excutor_id" filterable clearable>
                        <el-option v-for="(change_result,index) in person" :key="index" :value="change_result.dd_id" :label="change_result.nickname"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="leader" label="负责人：" class="WHSInput">
                    <el-select v-model="form.leader" filterable clearable>
                        <el-option v-for="(change_result,index) in person" :key="index" :value="change_result.dd_id" :label="change_result.nickname"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="log_status" label="执行进度：" class="WHSInput">
                    <el-select v-model="form.log_status" filterable clearable>
                        <el-option v-for="(change_result,index) in plans" :key="index" :value="change_result.value" :label="change_result.label"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="confirm_time" label="定稿日期：" class="WHSInput">
                    <el-date-picker
                            v-model="form.confirm_time"
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
                <el-form-item prop="refund_time" label="退款日期：" class="WHSInput">
                    <el-date-picker
                            v-model="form.refund_time"
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
                <el-form-item class="WHSBtn">
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                    <el-button @click="exportWorkInfo">导出</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card style="margin-top: 10px;">
            <el-table :data="tableData" border>
                <el-table-column prop="order_code" width="115" label="订单编号">
                    <template slot-scope="scope">
                        <div style="color:#409eff; cursor:pointer;" @click="transfer(scope.row)">{{ scope.row.order_code}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="manage_number" width="145" label="工单编号">
                    <template slot-scope="scope">
                        <div style="color:#409eff; cursor:pointer;" @click="handleClick(scope.row)">{{ scope.row.manage_number}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="company" width="145" label="客户名称"></el-table-column>
                <el-table-column prop="order_price" label="订单金额"></el-table-column>
                <el-table-column prop="sub_nickname" label="申请人"></el-table-column>
                <el-table-column prop="ae_nickname" label="客服"></el-table-column>
                <el-table-column prop="product" label="产品"></el-table-column>
                <el-table-column prop="product_brief" width="300" label="产品说明"></el-table-column>
                <el-table-column prop="log_status" label="执行进度"></el-table-column>
                <el-table-column prop="price" label="金额"></el-table-column>
                <el-table-column prop="service_type" label="执行团队"></el-table-column>
                <el-table-column prop="leader_nickname" label="负责人"></el-table-column>
                <el-table-column prop="excutor" label="执行人"></el-table-column>
                <el-table-column prop="begin_time" label="初稿时间"></el-table-column>
                <el-table-column prop="confirm_time" label="定稿时间"></el-table-column>
                <el-table-column prop="mod_count" label="修改次数"></el-table-column>
                <el-table-column prop="refund_time" label="退款时间"></el-table-column>
                <el-table-column prop="refund_money" label="退款金额"></el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="form.page"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="form.perPage"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="count" style="text-align:center;margin-top:10px;">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    import Util from '@/libs/util'
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
                form:{
                    order_code:'',   // 订单编号
                    manage_number:'', //工单编号
                    service_type:"",//执行团队
                    create_dd_id:"",
                    ae:"",
                    excutor_id:"",
                    leader:"",
                    log_status:"",
                    confirm_time:[],//定稿时间
                    refund_time:[],//退款日期
                    perPage:10,
                    page:1,
                },
                executive_team:[
                    {
                        "value": 1,
                        "label": "自营团队"
                    },
                    {
                        "value": 2,
                        "label": "服务商团队"
                    }
                ],
                plans:[],
                tableData:[{}],
                count: 0,
            }
        },
        computed: {
            person:{
                get: function(){
                    return this.$store.state.app.commonPerson;
                },
                set: function(){
                }
            }
        },
        methods:{
            // 查询列表
            onSubmit () {
                this.form.perPage = 10;
                this.form.page = 1;
                this.$get( 'report/manageExcutorList',this.form)
                        .then( (data) => {
                            if(data.code){
                                this.tableData = data.content.data;
                                this.count = data.content.count;
                            }
                        })
                        .catch(() => {

                        })
            },
            // 重置查询条件
            resetForm (formName) {
                this.form.pro = '';
                this.$refs[formName].resetFields();
            },
            //导出
            exportWorkInfo () {
                for (let index in this.form) {
                    if (this.form[index] && this.form[index].length !== 0) {
                        let strArgs = Util.makeUrl(this.form);
                        window.open(`${process.env.BASE_API}/report/exportManageExcutor?Authorization=${this.Authorization}${strArgs}`)
                        return false;
                    }
                }
                this.$message({
                    message: '请输入查询条件后方可导出',
                    type: 'warning'
                });
            },
            transfer(tab) {
                this.$router.push({name: 'orderDetail', params: {id: tab.order_id}});
            },
            handleClick(tab) {
                this.$router.push({name: 'workInfo', query: {manage_id: tab.manage_id, work_type: tab.work_type}});
                // }
            },

            // 每页多少条
            handleSizeChange (val) {
                this.form.perPage = val;
                this.followList();
            },
            // 第几页
            handleCurrentChange (val) {
                this.form.page = val;
                this.followList();
            },
            clientShows(){
                let index_show = JSON.parse(localStorage.consultSearch);
                this.person = index_show.person;
            },
            plan(){
                this.$get("manageNew/getFollowUpStatus")
                    .then((res)=>{
                        this.plans = res.content;
                    })
                    .catch(()=>{

                    })
            },
            followList(){
                this.$get( 'report/manageExcutorList',this.form)
                .then( (data) => {
                    this.tableData = data.content.data;
                    this.count = data.content.count;
                })
                .catch(() => {
                    this.$message.error('服务器错误，请稍后重试');
                })
            }
        },
        created(){
            this.clientShows();
            this.plan();
            this.followList();
        }
    }
</script>

<style lang="less">
    .final{
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