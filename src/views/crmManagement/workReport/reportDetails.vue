<template>
    <div class="reportDetails">
        <el-card>
            <div>
                <span class="reportTitle">{{ weekmonthwork.title }}</span>
                <span class="reportNickname"> 汇报人： {{ weekmonthwork.nickname }}</span>
                <span class="reportNickname"> 汇报时间： {{ weekmonthwork.time }}</span>
            </div>
            <div class="stateApproval">
                <el-button v-if="weekmonthwork.is_approval" @click="approvalT" >审批</el-button>
            </div>
            <div class="reportApproval">
                <p class="reportApprovalP">状态</p>
                <p class="reportApprovalP1">{{ weekmonthwork.approval_text }}</p>
            </div>
        </el-card>
        <el-card style="margin-top: 20px;">
            <div class="reportFeed">
                <p class="reportFeedback">反馈团队</p>
                <p class="reportFeedbackP">{{ weekmonthwork.team_feedback }}</p>
            </div>
            <div class="reportFeed">
                <p class="reportFeedback">目前团队人数</p>
                <p class="reportFeedbackP">{{ weekmonthwork.team_count }}</p>
            </div>
            <writeReportZ :wirteData="wirteData,wcount,price,transfer_price,follow" @wcurrent="wcurrent"></writeReportZ>
			<returned :returnedData="returnedData,rcount" @rcurrent="rcurrent"></returned>
			<predict :performanceData="performanceData,pcount" @pcurrent="pcurrent"></predict>


        </el-card>
        <el-card style="margin-top: 15px;">

            <div>
                <p class="reportSumP">工作总结：</p>
                <p class="reportSumText">{{ weekmonthwork.report_text }}</p>
            </div>
            <div>
                <p class="reportSumP">工作计划：</p>
                <p class="reportSumText">{{ weekmonthwork.plan_text }}</p>
            </div>
        </el-card>
        <el-card style="margin-top: 20px;">
            <div class="rtgu">
                审批记录
            </div>
            <el-steps finish-status="success" :active="1" direction="vertical">
                <el-step
                        style="height: 80px"
                        v-for="(item, index) in weekmonthwork.log"
                        v-bind:key="item.index"
                        :title="item.nickname"
                        :description="item.content"
                >
                </el-step>
            </el-steps>
        </el-card>
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
    import writeReportZ from '../.././components/s_report/writeReportZ'
	import returned from '../.././components/s_report/returnedMoney'
	import predict from '../.././components/s_report/predict'
    import ElCard from "element-ui/packages/card/src/main";
    export default {
        components: {
            ElCard,
            writeReportZ,
            returned,
            predict,
        },
        data () {
            return {
                options: [
                    {id: 2, name: '通过'},
                    {id: 3, name: '不通过'}
                ],
                formData: {
                    is_through: '',
                    opinion: '',
                    work_id: 0,
                },
                dialogVisible: false,
                approval_text: '',
                performanceData: [],
				returnedData: [],
                wirteData: [],
                count: 0,				// 团队人数
				rcount: 0,	            // 回款明细表格条数
				pcount: 0,				// 预计签约明细表格条数
                wcount: 0,				// 业绩统计表格条数
                price: 0,             // 合计签约金额
                transfer_price: 0,    // 合计回款金额
                follow: 0,            // 合计拜访数量
                paybackList: {
                    currentPage: 1,
                    work_id: '',
                },
                weekmonthwork: {},
            }
        },
        methods: {
            detailsReport () {
                this.$get( 'weekmonthwork/detail',{work_id: this.$route.params.id})
                    .then( (data) => {
                        this.weekmonthwork = data.content
                    })
                    .catch( () => {
                        this.$message.error('服务器错误，请稍后重试');
                    })
            },
            dialogVisibleT () {
                this.formData.work_id = this.$route.params.id;
                this.$post( 'weekmonthwork/approve',this.formData)
                    .then( (data) => {
                        if(data.code){
                            this.$message({
                                message: data.errorMsg,
                                type: 'success'
                            });
                            this.formData = {};
                            this.dialogVisible = false;
                            this.detailsReport();
                        } else {
                            this.$message({
                                message: data.errorMsg,
                                type: 'warning'
                            });
                        }
                    })
                    .catch( () => {

                    })
            },
            // 审批
            approvalT () {
                this.dialogVisible = true;
            },
			// 回款明细第几页
			rcurrent (val) {
				this.paybackList.currentPage = val;
				this.rNew();
			},
			// 业绩统计第几页
			wcurrent (val) {
				this.paybackList.currentPage = val;
				this.kNew();
			},
			// 预约签约第几页
			pcurrent (val) {
				this.paybackList.currentPage = val;
				this.cNew();
            },
            rNew () {
				// 回款统计
                this.paybackList.work_id = this.$route.params.id;
				this.$get( 'weekmonthwork/detailpaybackList',this.paybackList)
					.then( (data) => {
                        this.returnedData = data.content.detail;
                        this.rcount = data.content.count;
					})
					.catch( (error) => {

					})
			},
			cNew () {
				// 预计签约
                this.paybackList.work_id = this.$route.params.id;
				this.$get( 'weekmonthwork/detailcontractList',this.paybackList)
					.then( (data) => {
                        this.performanceData = data.content.detail;
                        this.pcount = data.content.count;
					})
					.catch( (error) => {

					})
			},
			kNew () {
				// 业绩统计
                this.paybackList.work_id = this.$route.params.id;
				this.$get( 'weekmonthwork/detailkpiData',this.paybackList)
					.then( (data) => {
                        let detail = data.content;
                        this.wirteData = detail.detail;
                        this.wcount = detail.count;
                        this.price = detail.price;
                        this.transfer_price = detail.transfer_price;
                        this.follow = detail.follow;
					})
					.catch( (error) => {

					})
			},
        },
        created () {
            this.kNew();
			this.cNew();
			this.rNew();
            this.detailsReport();
        }
    }
</script>

<style lang="less" scoped>
    .reportDetails {
        .reportTitle {
            font-size: 18px;
            color: #000;
        }
        .reportNickname {
            margin-left: 50px;
            font-size: 12px;
            color: #666;
        }
        .reportApproval {
            float: right;
            margin-right: 50px;
        }
        .reportApprovalP {
            font-size: 12px;
            text-align: center;
            color: #666;
        }
        .stateApproval {
            margin-top: 15px;
            float: left;
            margin-bottom: 15px;
        }
        .reportApprovalP1 {
            font-size: 16px;
            color: #000;
        }
        .reportFeedback {
            font-size: 16px;
            color: #000;
        }
        .reportFeedbackP {
            font-size: 14px;
            color: #666;
            margin-left: 10px;
            margin-top: 10px;
        }
        .reportFeed {
            display: inline-block;
            width: 45%;
        }
        .reportSumP {
            font-size: 14px;
            color: #000;
            margin-top: 10px;
            margin-bottom: 10px;
            font-weight: 700;
        }
        .reportSumText {
            text-indent: 2em;
            font-size: 14px;
            color: #666;
            min-height: 80px;
            border:1px solid #ccc;
            border-radius:5px;
        }
        .rtgu{
            font-size: 14px;
            color: #000;
            margin-bottom: 10px;
            font-weight: 700;
            margin-bottom: 15px;
        }
    }
</style>
