<template>
    <div class="approval">
        <img src="../../../images/cancel_btn.png" v-if="cancel == 4" alt="" class="approval_status">
        <img src="../../../images/succes_btn.png" v-if="cancel == 2" alt="" class="approval_status">
        <img src="../../../images/del_btn.png" alt="" v-if="cancel == 3" class="approval_status">
        <div class="order">
            <p class="nick_name">{{nickname}}</p>
            <div class="order_name">
                <p>{{order_name}} </p>
                <p style="color:#ff4545;">￥{{price}}</p>
            </div>
        </div>
        <div style="clear: both"></div>
        <div class="client" style="padding: 8px 6%;">
            <p>客户名称：{{company}}</p>
            <p>成单日期：{{create_time}}</p>
            <p>订单渠道：{{trench}}</p>
            <p>来源单号：{{third_order_code}}</p>
            <p>合同日期：{{service_start_time}} ~ {{service_end_time}}</p>
        </div>
        <div class="product">
            <p class="xtop">产品</p>
            <el-table :data="pro_info"  border style="width: 100%" size="mini" >
                <el-table-column prop="name.name" label="产品" align="center"  style="padding: 0px !important;" ></el-table-column>
                <el-table-column prop="pro_period" label="周期（工作日）" align="center"  ></el-table-column>
                <el-table-column prop="pro_contract_price" label="合同价格" align="center"  ></el-table-column>
                <el-table-column prop="pro_brife" label="备注" align="center"  ></el-table-column>
            </el-table>
            <span v-for="(item,index) in condition" :key="index">
                <p class="condition">
                    {{item.name}}
                    <el-switch disabled active-value="1" inactive-value="0" v-model="item.value" style="display: inline-block; float: right"></el-switch></p>
            </span>
        </div>
        <div class="remarks">
            <p class="xtop">备注：</p>
            <span>{{detail}}</span>
        </div>
        <div class="enclosure">
            <p class="xtop">附件：</p>
            <p v-for="item in file" :key="item.path" style="padding: 3px 0px 8px 0px;">
                {{item.name}}
                <mt-button type="primary" size="small" @click="upload(item.path)" class="upload">下载</mt-button>
            </p>
        </div>
        <div class="Detailed">
            <p class="xtop">审批记录</p>
            <el-steps direction="vertical" :active="1" finish-status="success">
                <el-step
                        v-for="item in approvalData"
                        :key="item.id"
                        :title="item.nickman + item.status"
                        :description="item.time + item.approve_opinion"
                >
                </el-step>
            </el-steps>
        </div>
        <div class="opinion">
            <mt-button type="primary" @click="refuse()" v-if="is_approve"  class="refuse_approval">拒绝</mt-button>
            <mt-button type="primary" @click="agree()"  v-if="is_approve"  class="agree_approval">同意</mt-button>
            <mt-popup style="width: 100%"  v-model="popupVisible" position="bottom">
                <p class="opTitle">审批意见</p>
                <mt-field  type="textarea" class="text_t"  rows="4" v-model="text"></mt-field>
                <mt-button type="primary" @click="agreeT()" v-if="is_show == 2" class="agree_t">同意</mt-button>
                <mt-button type="primary" @click="refuseT()" v-if="is_show == 3" class="agree_t">拒绝</mt-button>
            </mt-popup>
        </div>

    </div>
</template>
<script>
    import Cookies  from 'js-cookie';
    import { Toast } from 'mint-ui';
    export default {
        name: "approval",
        data(){
            return {
                popupVisible:false,
                service_start_time:'',
                third_order_code:'',
                service_end_time:'',
                approvalData:[],    //审批明细
                create_time:'',
                order_name:'',
                nickname:'',
                company:'',
                trench:'',          //渠道
                price:'',
                shop:'',
                pro_info:[],
                condition:[],
                is_approve:'',
                detail:'',
                file:[],
                log_id: Cookies.get('log_id') ? Cookies.get('log_id') : '',
                order_id: Cookies.get('order_id') ? Cookies.get('order_id') : '',
                status:'',
                text:'',
                is_show:'',         //显示按钮
                cancel:'',          //是否是已撤销的订单
            }
        },
        methods:{
            //同意
            agree() {
                this.is_show = 2;
                this.popupVisible = true;
            },
            agreeT(){
                this.status = 2;
                this.$get('crmManagement/order/approve',{log_id:this.log_id,status:this.status,text:this.text})
                    .then((data) => {
                        if(data.code) {
                            this.popupVisible = false;
                            this.text = '';
                            this.order();
                            this.approvalLog();
                            Toast({
                                message: data.errorMsg,
                                duration:3000
                            });
                        }else {
                            this.popupVisible = false;
                            Toast({
                                message: data.errorMsg,
                                duration:3000
                            });
                        }
                    })
                    .catch(() => {
                        this.popupVisible = false;
                    })
            },
            //拒绝
            refuse(){
                this.is_show = 3;
                this.popupVisible = true;
            },
            refuseT() {
                this.status = 3;
                this.$get('crmManagement/order/approve',{log_id:this.log_id,status:this.status,text:this.text})
                    .then((data) => {
                        if(data.code) {
                            this.popupVisible = false;
                            this.order();
                            this.approvalLog();
                            Toast({
                                message: data.errorMsg,
                                duration:3000
                            });
                        }else {
                            this.popupVisible = false;
                            Toast({
                                message: data.errorMsg,
                                duration:3000
                            });
                        }
                    })
                    .catch(() => {
                    })
            },
            upload(rows) {
                window.open(rows);
            },
            order() {
                this.$get('crmManagement/order/orderApproveDetail?time=' + new Date().getTime() ,{order_id:this.order_id,log_id:this.log_id})
                    .then((data) => {
                        if(data.code) {
                            this.nickname = data.content.nickname;
                            this.order_name = data.content.order_name;
                            this.price = data.content.price;
                            this.company = data.content.company;
                            this.create_time = data.content.create_time;
                            this.shop = data.content.shop;
                            this.trench = data.content.trench;
                            this.third_order_code = data.content.third_order_code;
                            this.service_start_time = data.content.service_start_time;
                            this.service_end_time = data.content.service_end_time;
                            this.pro_info = data.content.pro_info;
                            this.condition = data.content.condition;
                            this.detail = data.content.detail;
                            this.file = data.content.file;
                            this.cancel = data.content.cancel;  //是否是已撤销的订单
                            this.is_approve = data.content.is_approve === 1 ? true : false; //权限标识 1开启 2禁用
                        }
                    })
                    .catch(() => {
                    })
            },
            //审批明细
            approvalLog() {
                let order_id = Cookies.get('order_id');
                    this.$get('report/phoneApproveLog?time=' + new Date().getTime(),{order_id:order_id})
                    .then((data) => {
                        if(data.code) {
                            this.approvalData = data.content.log.reverse();
                        }
                    })
                    .catch(() => {

                    })
            },
        },
        created(){
            this.order();
            this.approvalLog();
        }
    }
</script>
<style>
    html,body{
        overflow: visible !important;
    }
</style>
<style lang="less">
    .approval{
        background: #f6f6f6;
        width: 100%;
        height: 100%;
        position: relative;
    .approval_status{
        position: absolute;
        top: 1%;
        right: 2%;
        width: 20%;
        z-index: 9999;
    }
    .approval_img{
        display: block;
    }
    .order{
        width: 100%;
        background: #fff;
        margin-top: 10px;
        box-sizing: border-box;
        overflow: hidden;
    }
    .nick_name{
        float: left;
        border-radius: 50%;
        line-height: 42px;
        text-align: center;
        width: 42px;
        height: 42px;
        background: #26a2ff;
        color:#fff;
        margin: 2% 2% 2% 5%;

    }
    .order_name{
        float: left;
        margin-top: 6px;
        font-size: 14px;
        width: calc(93% - 42px);
    }
    .order_name p {
        word-wrap:break-word;
        white-space:normal;

    }
    .client, .product, .remarks, .enclosure, .opinion,.Detailed{
        width: 100%;
        font-size: 14px;
        background: #fff;
        padding:  0 6%;
        box-sizing: border-box;
        color: #999;
        margin-top: 10px;
    }
    .remarks span {
        word-wrap:break-word;
        white-space:normal;
        display: inline-block;
        line-height: 1.5em;
        padding: 2% 0px;
    }
    .enclosure p:nth-child(2){
        line-height: 1.5em;
    }
    .client p  {
        padding: 3px 0px;
        word-wrap:break-word;
        white-space:normal;
    }
    .opinion {
        padding: 15px 6%;
    }
    .condition {
        padding: 10px 0px;
        font-size: 14px;
    }
    .refuse_approval{
        width: 40%;
        background: #fff !important;
        color:#26a2ff;
        border:1px solid #26a2ff;
        border-radius:20px;
    }
    .agree_approval{
        width: 40%;
        float: right;
        border-radius:20px;
    }
    .upload{
        display: inline-block;
        float: right;
        height: 22px;
        padding: 0 4px !important;
        font-size: 12px;
    }
    .opTitle{
        text-align: center;
        width: 100%;
        padding: 10px 0px;
        color:#000;
        font-size: 14px;
    }
    .agree_t{
        width: 90%;
        margin: 0% 5%;
        border-radius:20px;
    }
    .text_t{
        background: #f5f5f5;
        font-size: 14px;
        width: 100%;
    }
    .Detailed .el-step__line {
        width: 1px;
        top: 12px;
        bottom: 0;
        left: 7px;
    }
    .Detailed .el-step__icon{
        width: 15px;
        height: 15px;
    }
    .el-step.is-vertical .el-step__title{
        font-size: 12px;
    }
        .el-step__title.is-success{
            color:#007eff;
        }
        .el-step__description.is-success{
            color:#007eff;
        }
        .el-step__head.is-success{
            color:#007eff;
            border-color:#007eff;
        }
    .el-step__icon {
       font-size: 12px;
        margin-top: 1px;
    }
    .el-step__icon-inner:not(.is-status){
        display: none;
    }
    .el-step__main{
        padding-bottom: 10px;
    }
    .el-steps--vertical{
        margin-top: 5px;
    }
    .el-step.is-vertical .el-step__main{
        padding-left: 0px;
    }
    .xtop{
        padding: 10px 0px 3px 0px;
        color:#000000;
    }
    .el-step {
        flex-basis: 80px !important;
        height: 80px;
    }
    }
</style>
