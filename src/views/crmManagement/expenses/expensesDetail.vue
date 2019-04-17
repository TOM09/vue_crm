<template>
    <div class="costDetail">
        <el-card>
        <div class="s_details_company">
            <div class="s_details_title"> {{ cost_code }}</div>
            <div class="s_details_fuze">创建人：{{ nickname }} 创建时间：{{ create_time}}</div>
        </div>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="float: left;color:#333333;font-size:16px;font-weight:800;">基础信息</span>
                <el-button @click="costEdit" icon="el-icon-edit" style="float: left; padding: 3px 0;margin-left: 10px;" type="text"></el-button>
            </div>
            <div class="s_details_basic">
                <div class="s_details_basic_title">
                    <div class="s_details_basic_name">
                        <p><span style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</span>关联订单</p>
                        <p @click="orderTo" class="orderTo">{{order_name}}（{{ order_code }}）</p>
                    </div>
                    <div class="s_details_basic_industry">
                        <p><div style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</div>费用项</p>
                        <p style="height:10px;"></p>
                        <span>{{ cost_type }}</span>
                    </div>
                    <div class="s_details_basic_source">
                        <p><div style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</div>金额</p>
                        <p style="height:10px;"></p>
                        <span>{{ ruleForm.cost_price }}</span>
                    </div>
                </div>
                <div class="s_details_basic_intermediate">
                    <div class="s_details_basic_rank">
                        <p><div style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</div>费用日期</p>
                        <p style="height:10px;"></p>
                        <span>{{ ruleForm.cost_time }}</span>
                    </div>
                    <div class="s_details_basic_scale">
                        <p><div style="color:#409eff;margin-right: 5px;margin-left: 0px;">●</div>备注</p>
                        <p style="height:10px;"></p>
                        <span>{{ruleForm.remarks}}</span>
                    </div>
                </div>
            </div>
        </el-card>
        <el-dialog title="费用信息修改" :visible.sync="dialogTableVisible" :modal="false" width="600px">
            <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm">
                <el-form-item label="关联订单(必填)" prop="name">
                    <el-input v-model="order_code"  placeholder="请选择" disabled class="s_additem_form">
                    </el-input>
                </el-form-item>
                <el-form-item label="费用项(必填)" prop="cost_type">
                    <el-select v-model="ruleForm.cost_type" filterable placeholder="请选择" class="s_additem_form">
                        <el-option
                                v-for="item in type"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="金额(必填)" prop="future_price" >
                    <el-input v-model="ruleForm.cost_price" placeholder="￥(元)" type="number" class="s_additem_form"></el-input>
                </el-form-item>
                <el-form-item label="费用日期(必填)" prop="origin">
                    <el-date-picker
                            style="width: 300px"
                            v-model="ruleForm.cost_time"
                            align="right"
                            type="date"
                            placeholder="选择日期"
                            :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="ruleForm.remarks" type="textarea" placeholder="请输入费用备注信息" class="s_additem_form"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button type="primary" @click="confirmAdd">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </span>
        </el-dialog>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="float: left;color:#333333;font-size:16px;font-weight:800;">操作日志</span>
            </div>
            <el-steps direction="vertical" :active="1" finish-status="success">
                <el-step v-for="item in operate_log" style="height: 100px" :key="item.title" :title="item.title" :description="item.content">
                </el-step>
            </el-steps>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "expensesDetail",
        data(){
            return {
                dialogTableVisible:false,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                order_id:'',
                cost_code:'',
                nickname:'',
                create_time:'',
                order_name:'',
                order_code:'',
                cost_type:'',
                type:[],
                update_root:false,
                operate_log:[],
                ruleForm:{
                    cost_type:'',
                    cost_price:'',
                    cost_time:'',
                    remarks:'',
                    id:'',

                }
            }
        },
        methods:{
            costDetail(){
                this.$get('OrderCost/CostDetails',{id:this.$route.params.id})
                    .then((data) => {
                        if(data.code){
                            let costDetail = data.content.data;
                            this.order_id = costDetail.order_id;
                            this.cost_code = costDetail.cost_code;      // 费用编号
                            this.nickname = costDetail.nickname;        // 创建人
                            this.create_time = costDetail.create_time;  // 创建时间
                            this.order_name = costDetail.order_name;    // 订单名称
                            this.order_code = costDetail.order_code;    // 订单编号
                            this.ruleForm.cost_type = costDetail.cost_type.id;
                            this.ruleForm.cost_price = costDetail.cost_price;
                            this.ruleForm.cost_time = costDetail.cost_time;
                            this.ruleForm.remarks = costDetail.remarks;
                            this.ruleForm.id = this.$route.params.id;
                            this.cost_type = costDetail.cost_type.name;
                            this.cost_time = costDetail.cost_time;
                            this.update_root = costDetail.update_root;
                            this.type = data.content.type;
                            this.operate_log = data.content.operate_log;
                        }else{
                            this.$message.error(data.errorMsg);
                        }
                    })
                    .catch((error) => {
                        this.$message.error('服务器错误，请稍后重试')
                    })
            },
            //取消
            cancel(){
                this.dialogTableVisible = false;
                this.costDetail();
            },
            //编辑
            costEdit(){
                this.dialogTableVisible = true;
            },
            //提交
            confirmAdd(){
                this.$post('OrderCost/CostUpdate',this.ruleForm)
                    .then((data) => {
                        if(data.code){
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.dialogTableVisible = false;
                            this.costDetail();
                        }else{
                            this.$message.error(data.errorMsg);
                        }
                    })
                    .catch((error) => {
                        this.$message.error('服务器错误，请稍后重试')
                    })
            },
            //跳转
            orderTo(){
                this.$router.push({
                    name:'orderDetail',
                    params:{
                        id:this.order_id
                    }
                });
            }

        },
        created(){
            this.costDetail();
        },
        watch: {
        　　'$route' (to, from) {
        　　this.$router.go(0);
        　　}
        }
    }
</script>

<style lang="less">
    .costDetail{
        .s_details_title {
            float: left;
            font-size: 20px;
            margin-left: 0px !important;
            margin-top: 5px;
        }
        .el-form-item__label {
            margin-left: 0px !important;
        }
        .s_details_company {
            width: 100%;
            height: 50px;
        }
        .s_details_fuze {
            float: left;
            margin-left: 30px;
            margin-top: 10px;
            font-size: 14px;
            color: gray;
        }
        .s_details_btn {
            float: left;
            margin-top: 10px;
            margin-bottom: 20px;
            margin-left: 0px !important;
        }
        .clearfix:before,
        .clearfix:after {
            display: table;
            content: "";
        }
        .clearfix:after {
            clear: both
        }
        .s_details_basic_title {
            width: 100%;
            height: 100px;
        }
        .s_details_basic_intermediate {
            width: 100%;
            height: 100px;
        }
        .s_details_basic_title div, .s_details_basic_intermediate div{
            float: left;
        }
        .s_details_basic_name, .s_details_basic_source, .s_details_basic_industry, .s_details_basic_rank, .s_details_basic_scale, .s_details_basic_bottom {
            color: #999999;
            font-size: 14px;
            width: 32.5%;
        }
        .s_details_basic_name span, .s_details_basic_source span, .s_details_basic_industry span, .s_details_basic_rank span, .s_details_basic_scale span, .s_details_basic_bottom span {
            color: #333333;
            font-size: 16px;
            margin-left: 14px;
        }
        .s_details_basic_industry, .s_details_basic_source, .s_details_basic_scale {
            margin-left: 0px;
        }
        .box-card {
            margin-top: 20px;
        }
        .s_client_address {
            width: 80%;
            margin-top: 20px;
            margin-left: 26px;
        }
        .s_details_input {
            float: left;
            margin-top: 20px;
        }
        .s_detailForm {
            width: 100%;
            float: left;
        }
        .orderTo{
            width: 30%;
            height: 60px;
            line-height: 30px;
            color:#409eff !important;
        }
        .orderTo:hover{
            cursor: pointer !important;
        }
    }
</style>