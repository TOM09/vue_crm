<template>
    <div class="addCaseOrder">
        <el-card>
            <div slot="header">
                <span class="headerTitle">案例信息</span>
            </div>
            <el-form ref="form" :model="form">
                <el-form-item label="案例名称（必填）" class="x_case_width">
                    <el-input v-model="form.name" placeholder="请输入（30个字以内）" class="x_case_search" clearable></el-input>
                </el-form-item>
                <el-form-item label="关联工单（必填）" class="x_case_width">
                    <el-input v-model="form.manage_number" placeholder="请选择" @focus.prevent="workOrder()" class="x_case_search" clearable></el-input>
                </el-form-item>
                <el-form-item label="执行方（必填）" class="x_case_width">
                    <el-select v-model="form.excutor_type" @change="executiveF" placeholder="请选择" filterable class="x_case_search" clearable>
                        <el-option
                            v-for="item in executive"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签（必填）" class="x_case_width">
                    <el-select v-model="form.lable" placeholder="请选择" disabled class="x_case_search">
                        <el-option
                            v-for="item in label"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类产品（必填）" class="x_case_width">
                    <el-select v-model="form.product_id" placeholder="请选择" clearable class="x_case_search" @change="changeProduct">
                        <el-option
                            v-for="item in product"
                            :key="item.product_id"
                            :label="item.name"
                            :value="item.product_id">
                            <span style="float: left">{{ item.name }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.product_brief }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="出品人（必填）" class="x_case_width">
                    <el-select v-if="executiveF1 == 0" v-model="form.producer" multiple placeholder="请选择" filterable allow-create class="x_case_search">

                    </el-select>
                    <el-select v-else-if="executiveF1 == 1" v-model="form.producer" multiple placeholder="请选择" filterable allow-create class="x_case_search">
                        <el-option
                                v-for="(item,index) in producer"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-else="executiveF1 == 2" v-model="form.producer" multiple placeholder="请选择" filterable allow-create class="x_case_search">
                        <el-option
                                v-for="(item,index) in producer"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="案例日期（必填）" class="x_case_width">
                    <el-date-picker
                            style="width: 90%;"
                            v-model="form.make_time"
                            type="date"
                            placeholder="选择日期"
                            :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="出品人星级（必填）" class="x_case_width">
                    <el-select v-model="form.designer" placeholder="请选择" class="x_case_search" clearable>
                        <el-option
                            v-for="item in producerLevel"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="浏览量" class="x_case_width">
                    <el-input v-model="form.view" placeholder="请输入浏览次数" class="x_case_search" clearable></el-input>
                </el-form-item>
                <el-form-item label="是否可外宣" class="x_case_width">
                    <el-switch v-model="form.can_publicity" active-value=1 inactive-value=0></el-switch>
                </el-form-item>
                <label class="el-form-item__label" style="display: flex;float: none;">风格</label>
                <el-tag
                    :key="tag"
                    v-for="tag in form.tag"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)">
                    {{tag}}
                </el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 标签</el-button>
                <el-form-item label="案例介绍（必填）"  style="clear: both;float: none;" class='x_case_width2'>
                    <el-input type="textarea" v-model="form.brief" :autosize="{ minRows: 3}" placeholder="请输入" style="width: 40%;"></el-input>
                </el-form-item>
                <el-form-item label="创意思路（必填）"  style="clear: both" class='x_case_width2'>
                    <el-input type="textarea" v-model="form.idea" :autosize="{ minRows: 3}" placeholder="请输入" style="width: 40%;"></el-input>
                </el-form-item>
                <el-form-item  label="封面图（必填）"  class="x_case_width">
                    <casefile @fileStatus1="fileStatus1" @fileTrue1="fileTrue1" :successes="successes"></casefile>
                </el-form-item>
                <el-form-item label="源文件（必填）"  class="x_case_width" style="margin-left: 20px;" >
                    <upload @fileStatus="fileStatus" :success="success" @fileTrue="fileTrue"></upload>
                </el-form-item>
                <addEditorUpload @editup="editup" :successful="successful" @fileTrue2="fileTrue2" style="clear:both;margin-top: 180px;"></addEditorUpload>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('form')">立即创建</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <!--关联工单弹窗-->
        <el-dialog :title="workTitle" :visible.sync="workWindow" :modal="false" width="60%">
            <el-form ref="formWork" :model="formWork" :inline="true">
                <el-form-item>
                    <el-input prefix-icon="el-icon-search" v-model="formWork.order_code" placeholder="请输入订单编号" class="workInput"></el-input>
                    <el-input prefix-icon="el-icon-search" v-model="formWork.manage_number" placeholder="请输入工单编号" class="workInput"></el-input>
                    <el-input prefix-icon="el-icon-search" v-model="formWork.client" placeholder="请输入客户名称" class="workInput"></el-input>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('formWork')">查询</el-button>
                    </el-form-item>
                </el-form-item>
            </el-form>
            <el-table :data="workTable" style="width: 100%;" @row-click="handleClick">
                <el-table-column prop="order_code" label="订单编号" width="180"></el-table-column>
                <el-table-column prop="manage_number" label="工单编号" width="180"></el-table-column>
                <el-table-column prop="order_name" label="订单名称" width="180"></el-table-column>
                <el-table-column prop="client" label="客户名称"></el-table-column>
                <el-table-column prop="product" label="产品信息"></el-table-column>
                <el-table-column prop="step_name" label="状态"></el-table-column>
                <el-table-column prop="person" label="销售"></el-table-column>
                <el-table-column prop="update_time" label="更新时间"></el-table-column>
                <el-table-column label="操作" width="80px">
                    <template slot-scope="scope">
                        <el-button type="text" size="small">选择</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="formWork.currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="formWork.pageSize"
                layout="sizes, prev, pager, next"
                :total="count">
            </el-pagination>
        </el-dialog>
        <!--风格标签弹窗-->
        <el-dialog :title="styleTitle" :visible.sync="styleTab" :modal="false" width="40%" class="styleBody">
            <el-form>
                <el-form-item label="风格">
                    <el-select v-model="styleTags" placeholder="请选择" filterable allow-create>
                        <el-option
                            v-for="item in formTag"
                            :key="item.id"
                            :label="item.name"
                            :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="styleDialog">
                    <el-button @click="styleOff()">取消</el-button>
                    <el-button type="primary" @click="stylePut()">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import casefile from '../.././components/x_case/case_file'
    import upload from '../.././components/s_customer/fiieDataCe'
    import addEditorUpload from '../.././components/x_case/addEditorUpload'
    export default{
        components: {
            upload,
            casefile,
//            quillEditor,
            addEditorUpload
        },
        data(){
            return{
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
                form:{
                    name:"",
                    manage_number:"",
                    manage_id:"",
                    excutor_type:"",
                    lable: 0,
                    product_id:[],
                    price:"",
                    producer:[],        // 出品人
                    make_time: "",
                    designer:"",
                    view:"",
                    can_publicity:0,    // 外宣
                    tag: [],     //风格
                    brief:"",
                    idea:"",
                    cover:'',
                    file:[],
                    edit: '',           // 内容预览
                },
                executive:[],       //自营或者服务商
                label:[],     //标签
                product:[],   //分类
                executiveF1 :0,  //判断自营还是服务商
                producer:[],        // 出品人
                producerLevel:[],

                inputVisible: false,
                inputValue: '',
                styleTitle: "新增标签",
                styleTab: false,
                styleTags:'',
                formTag:[],  //风格标签
                inputValue1:"",
                success: false,  //传文件
                successes:false, //封面图
                successful:false, //改造后的富文本编辑器 的清空默认值
                cover:'',

                workWindow:false,  //工单弹窗
                workTitle:"关联工单",
                formWork:{
                    order_code:"",
                    manage_number:"",
                    client:"",
                    currentPage: 1,
                    pageSize: 10,  //默认每页显示10条
                },
                manage_id:"",
                workTable:[],
                count: 0,
            }
        },
        methods:{
            changeProduct(da){
                for(var i = 0; i<this.product.length; i++){
                    if(da == this.product[i].product_id){
                        this.form.price = this.product[i].price;
                    }
                }
            },
            addCase(){
                this.$get('/case/addCaseOrderData',{"manage_id": this.manage_id,"excutor_type": this.form.excutor_type})
                    .then((data) => {
                        if(data.code){
                            this.executive = data.content.excutor_type;
                            this.label = data.content.label;
                            this.product = data.content.product;
                            this.producer = data.content.producer;
                            this.producerLevel = data.content.producerLevel;
                            this.formTag = data.content.tag;  //风格标签
//                            console.log(data.content)
                        }
                    })
                    .catch(() => {
                        this.$message.error('服务器错误，请稍后重试');
                    })
            },
            workOrder(){
                this.workWindow = true;  //工单弹窗
                this.$get("manageNew/manageList",this.formWork)
                    .then((data)=>{
//                        console.log(data)
                        this.workTable = data.content.data;
                        this.count = data.content.count;
                    })
                    .catch(()=>{

                    })
            },
            onSubmit(){
                this.workWindow = true;
                this.formWork.currentPage = 1;
                this.formWork.pageSize = 10;
                this.$get("manageNew/manageList",this.formWork)
                    .then((data)=>{
                        this.workTable = data.content.data;
                        this.count = data.content.count;
                    })
                    .catch(()=>{})
            },
            handleClick(row){
                this.workWindow = false;
                this.form.product_id = "";
                this.form.price = "";
                this.form.producer = [];
                this.form.manage_id = row.manage_id;
                this.form.manage_number = row.manage_number;
                this.manage_id = row.manage_id;
                this.addCase();
            },
            handleSizeChange(val) {
                this.formWork.pageSize = val;
                this.workOrder();
            //        console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.formWork.currentPage = val;
                this.workOrder();
            //        console.log(`当前页: ${val}`);
            },
            //判断自营还是服务商
            executiveF(data){
                if(data == ""){
                    this.executiveF1 = 0;
                    this.form.producer = [];
                }
                if(data == 1){
                    this.executiveF1 = 1;
                    this.form.producer = [];
                    this.addCase();
                }
                if(data == 2){
                    this.executiveF1 = 2;
                    this.form.producer = [];
                    this.addCase();
                }
            },
            handleClose(tag) {
                this.form.tag.splice(this.form.tag.indexOf(tag), 1);
            },
            showInput() {
                if(this.form.tag.length >= 2){
                    this.$message({
                        message: '最多可增加2个标签',
                        type: 'warning'
                    });
                }else{
                    this.styleTab = true;
                }
            },
            handleInputConfirm() {
                if(this.form.tag.length < 2){
                    let inputValue = this.inputValue;
                    if(inputValue.length > 4){
                        this.$message({
                            message: '字符不得超过4个字',
                            type: 'warning'
                        });
                    };
                    if (inputValue == this.inputValue1 && inputValue != "") {
                        this.$message({
                            message: '风格不可以重复',
                            type: 'warning'
                        });
                    }else if(inputValue && inputValue.length <= 4){
                        this.form.tag.push(inputValue);
                        this.inputValue1 = inputValue;
                    }
                }
                this.inputVisible = false;
                this.inputValue = '';
            },
            styleOff(){
                this.styleTab = false;
            },
            stylePut(){
                if(this.styleTags == false){
                    this.$message({
                        message: '标签内容不能为空',
                        type: 'warning'
                    });
                }else if(this.styleTags.length > 4){
                    this.$message({
                        message: '字符不得超过4个字',
                        type: 'warning'
                    });
                }else if(this.styleTags == this.form.tag[0]){
                    this.$message({
                        message: '风格不可以重复',
                        type: 'warning'
                    });
                }else{
                    this.form.tag.push(this.styleTags);
                    this.styleTab = false;
                    this.inputVisible = false;
                }
            },
            //oss
            editup(data){
                this.form.edit = data;
            },
            fileStatus1(data) {
                this.form.cover = data[0].path;
            },
            fileTrue1(data){
                this.successes = data;
            },
            fileStatus(data) {
                this.form.file = data;
            },
            fileTrue(data){
                this.success = data;
            },
            fileTrue2(data){
                this.successful = data;
            },
            submitForm(formName) {
                console.log(this.form)
                if(!this.form.name){
                    this.$message({
                        message: '请填写案例名称',
                        type: 'warning'
                    });
                }else if(!this.form.manage_id){
                    this.$message({
                        message: '请选择关联工单',
                        type: 'warning'
                    });
                }else if(!this.form.excutor_type){
                    this.$message({
                        message: '请选择执行方',
                        type: 'warning'
                    });
                }else if(this.form.lable.length == 0){
                    this.$message({
                        message: '请选择标签',
                        type: 'warning'
                    });
                }else if(this.form.product_id.length < 1){
                    this.$message({
                        message: '请选择分类产品',
                        type: 'warning'
                    });
                }else if(this.form.producer.length < 1){
                    this.$message({
                        message: '请选择出品人',
                        type: 'warning'
                    });
                }else if(!this.form.make_time){
                    this.$message({
                        message: '请选择案例日期',
                        type: 'warning'
                    });
                }else if(this.form.designer != '0' && this.form.designer === ''){
                    this.$message({
                        message: '请选择出品人星级',
                        type: 'warning'
                    });
                }else if(this.form.tag.length < 1){
                    this.$message({
                        message: '请新增或选择标签',
                        type: 'warning'
                    });
                }else if(!this.form.brief){
                    this.$message({
                        message: '请输入案例介绍',
                        type: 'warning'
                    });
                }else if(!this.form.idea){
                    this.$message({
                        message: '请输入创意思路',
                        type: 'warning'
                    });
                }else if(!this.form.cover){
                    this.$message({
                        message: '请选择封面图',
                        type: 'warning'
                    });
                }else if(this.form.file.length < 1){
                    this.$message({
                        message: '请选择源文件',
                        type: 'warning'
                    });
                }else if(!this.form.edit){
                    this.$message({
                        message: '请填写内容预览',
                        type: 'warning'
                    });
                }else{
                    this.$post('case/addCaseOrder',this.form)
                        .then((data) => {
                            console.log(data.code)
                            console.log(data.content)
                            if(data.code) {
                                this.$message({
                                    message: data.errorMsg,
                                    type: 'success'
                                });
                                this.success = true;
                                this.successes = true;
                                this.successful = true;
                                this.form.file = [];
                                this.form.edit = '';
                                this.form.cover = '';
                                this.$refs[formName].resetFields();
                                this.$router.push({
                                    name: 'caseDetail',
                                    params: {
                                        id: data.content
                                    }
                                })
                            } else {
                                this.$message({
                                    message: data.errorMsg,
                                    type: 'warning'
                                });
                            }
                        })
                        .catch(() => {
                            this.$message.error('服务器错误，请稍后重试');
                        })
                }
            },
        },
        created(){
            this.addCase();
        }
    }
</script>

<style lang="less" type="scoped">
    .addCaseOrder{
        .headerTitle{
            font-size: 16px;
            font-weight: 700;
        }
        .x_case_width{
            width: 33%;
            float: left;
            .el-form-item__label{
                width: 100%;
                display: inline!important;
                text-align: left;
            }
        }
        .x_case_search{
            width: 90%;
            /*height: 50px;*/
        }
        .x_case_width{
            width: 33%;
            float: left;
        .el-form-item__label{
            display: inline!important;
        }
        }
        /*工单弹窗*/
        .workInput{
            width: 25%;
            margin-right: 3%;
        }
        /*风格标签*/
        .el-dialog__header{
            padding: 20px 20px 20px;
            border-bottom: 1px solid #ccc;
        }
        .el-tag + .el-tag {
            margin-left: 10px;
        }
        .button-new-tag {
            margin-left: 10px;
            height: 32px;
            line-height: 30px;
            padding-top: 0;
            padding-bottom: 0;
        }
        .input-new-tag {
            width: 90px;
            margin-left: 10px;
            vertical-align: bottom;
        }
        /*风格弹窗*/
        .styleBody .el-dialog__body{
            padding: 30px 0;
        }
        .styleDialog{
            text-align: right;
            border-top: 1px solid #ccc;
            padding-top: 22px;
            padding-right: 50px;
            margin-bottom: 0;
            margin-top: 100px;
        }
        .x_case_width2{
            .el-form-item__label{
                display: inline!important;
                float: none;
            }
        }
    }
</style>