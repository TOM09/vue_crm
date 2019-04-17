<template>
    <div class="caseDtailsOrder">
        <el-dialog title="案例详情修改（关联工单）" :visible.sync="dialogShow" :modal="false">
            <el-form ref="form" :model="form" label-position="top" label-width="100px">
                <el-form-item label="案例名称（必填）" class="x_case_width">
                    <el-input v-model="form.name" placeholder="请输入（30个字以内）" class="x_case_search" clearable></el-input>
                </el-form-item>
                <el-form-item label="关联工单（必填）" class="x_case_width">
                    <el-input v-model="form.manage_number" placeholder="请选择" @focus.prevent="workOrder()" class="x_case_search" clearable></el-input>
                </el-form-item>
                <el-form-item label="执行方（必填）" class="x_case_width">
                    <el-select v-model="form.excutor_name" @change="executiveF" placeholder="请选择" filterable class="x_case_search" clearable>
                        <el-option
                            v-for="item in executive"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签（必填）" :disabled="!can_label" class="x_case_width">
                    <el-select v-model="form.lable" placeholder="请选择" class="x_case_search">
                        <el-option
                                v-for="item in label"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类产品（必填）" class="x_case_width">
                    <el-select v-model="form.productName" placeholder="请选择" clearable class="x_case_search" @change="changeProduct">
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
                    <!--{{form.producer}}&#45;&#45;{{producer}}-->
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
                    <el-select v-else-if="executiveF1 == 2" v-model="form.producer" multiple placeholder="请选择" filterable allow-create class="x_case_search">
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
                    <el-switch v-model="form.can_publicity"></el-switch>
                </el-form-item>
                <label class="el-form-item__label" style="display: flex;float: none;">风格</label>
                <el-tag
                        :key="index"
                        v-for="(tag,index) in form.tag_name"
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
                <el-form-item label="封面图" class="x_case_width" style="position: relative;">
                    <img :src="form.cover" alt="" style="float: left;width:100px;height:100px;margin-right: 5px;">
                    <casefile  @fileStatus1="fileStatus1"  @fileTrue="fileTrue" :successes="successes" @filexx="filexx"></casefile>
                </el-form-item>
                <el-form-item label="源文件">
                    <upload @fileStatus="fileStatus" :success="success" @fileTrue="fileTrue"></upload>
                    <el-table border :data="attachment" style="width:80%;margin-top: 10px;">
                        <el-table-column label="文件名" prop="name">
                        </el-table-column>
                        <el-table-column prop="size" label="大小">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button @click.native.prevent="deleteRow(scope.$index,attachment)" type="text" size="small">移除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <div class="clearfix"></div>
                <editorUpload @editup="editup" :xkedit="xkedit" :successful="successful"></editorUpload>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="confirmCancel()">取 消</el-button>
                <el-button type="primary" @click="confirmAdd(form)">确 定</el-button>
            </div>
        </el-dialog>
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
    import editorUpload from '../.././components/x_case/editorUpload'
    export default{
        components: {
            upload,
            casefile,
            editorUpload
        },
        props:["dialogTableVisible1"],
        data(){
            return{
                dialogShow: false,
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
                can_label:false, //能否编辑标签的权限
//                date:{
//                    cover:'',
//                },
                form:{
                    case_id:"",
                    name:"",
                    manage_number:"",
                    manage_id:"",
                    excutor_type:"",
                    excutor_name:"",
                    lable: 0,
                    product_id:[],
                    productName:"",
                    price:"",
                    producer:[],        // 出品人
                    make_time: "",
                    designer:"",
                    view:"",
                    can_publicity: false,    // 外宣
                    tag: [],     //风格
                    tag_name:[],
                    tag_all:[],
                    brief:"",
                    idea:"",
                    cover:'',
                    cover_source:'',
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
                cover_source:'',
                attachment:[],
                xkedit:'',

                workWindow:false,  //工单弹窗
                workTitle:"关联工单",
                formWork:{
                    order_code:"",
                    manage_number:"",
                    client:"",
                    currentPage: 1,
                    pageSize: 10,  //默认每页显示10条
                },
                workTable:[],
                count: 0,
            }
        },
        watch:{
            dialogTableVisible1(val){
                this.dialogShow = val;
                this.dialogOpen();
                console.log(val);
            },
            dialogShow(val){
                this.$emit("dialogOrder",val)
            }
        },
        computed:{
            over(){
                let ossUrl = this.date.cover.indexOf('?');
                return this.date.cover.substring(0,ossUrl);
            },
        },
        methods:{
            //oss
            filexx(data) {
                //封面图上传后随后点击删除 需要让封面图展示默认封面图
                if(data) {
                    this.form.cover_source = this.cover_source;
                }
            },
            editup(data){
                this.form.edit = data;
                console.log(data)
            },
            fileStatus(data) {
                this.form.file = data;
            },
            fileStatus1(data) {
                this.form.cover_source = data[0].path;
            },
            fileTrue(data){
                this.success = data;
            },
            dialogOpen() {
                this.$get('case/editCaseOrderData',{"case_id":this.$route.params.id})
                    .then((data) => {
                        console.log(data.content)
                        if(data.code) {
                            let form = data.content;
                            // 默认值
                            this.form.case_id = form.id;
                            this.form.name = form.name;
                            this.form.manage_number = form.manage_number;
                            this.form.manage_id = form.manage_id;
                            this.form.productName = form.product.name;
                            this.form.product_id = form.product.product_id;
                            this.form.excutor_type = form.excutor.id;
                            this.form.excutor_name = form.excutor.name;
                            this.can_label = form.can_label;
                            this.form.lable = form.lable;
                            this.form.producer = form.producer;

                            this.form.make_time = form.make_time;
                            this.form.designer = form.designer;
                            this.form.view = form.view;
                            this.form.can_publicity = form.can_publicity;
                            this.form.tag_all = form.tag_all;   //风格
                            this.form.tag_name = form.tag_name;   //风格
                            this.form.tag = form.tag;   //风格
                            this.form.brief = form.brief;
                            this.form.idea = form.idea;
                            this.form.cover = form.cover;
                            this.cover_source = form.cover_source;
                            this.attachment = form.attachment;
                            this.xkedit = form.edit;
                            console.log(this.xkedit)
                            if(this.form.excutor_type == ""){
                                this.executiveF1 = 0;
                            }
                            if(this.form.excutor_type == 1){
                                this.executiveF1 = 1;
                            }
                            if(this.form.excutor_type == 2){
                                this.executiveF1 = 2;
                            }
//                            this.executiveF();
                            this.addCase();

                        }else {
                            this.$message.error(data.errorMsg);
                            this.$router.push({name:"caseList"});
                        }
                    })
                    .catch(() => {
                        this.$message.error('服务器错误，请稍后重试');
                    })
            },
            changeProduct(da){
                for(var i = 0; i<this.product.length; i++){
                    if(da == this.product[i].product_id){
                        this.form.price = this.product[i].price;
                    }
                }
            },
            addCase(){
//                console.log(this.form.id)
//                console.log(this.form.excutor_type)
                this.$get('/case/addCaseOrderData',{"manage_id": this.form.manage_id,"excutor_type":this.form.excutor_type})
                    .then((data) => {
                        if(data.code){
//                            console.log(data.content)
                            this.executive = data.content.excutor_type;
                            this.label = data.content.label;
                            this.product = data.content.product;
                            this.producer = data.content.producer;
                            this.producerLevel = data.content.producerLevel;
                            this.formTag = data.content.tag;  //风格标签
                        }
                    })
                    .catch(() => {
                        this.$message.error('服务器错误，请稍后重试');
                    })
            },

//            workOrder1(){
//                this.$get("manageNew/manageList")
//                    .then((data)=>{
//                        this.workTable = data.content.data;
//                        this.count = data.content.count;
//                        console.log(this.workTable.length)
//                        console.log(this.form.manage_id);
//                        for(var i = 0; i< this.workTable.length; i++){
//                            if(this.form.manage_id == this.workTable[i].manage_id){
//                                this.form.manage_number = this.workTable[i].manage_number;
//                                console.log(this.form.manage_number);
//                            }
//                        }
//
//                        console.log(this.form.manage_number);
//                    })
//                    .catch(()=>{
//
//                    })
//            },
            workOrder(){
                this.workWindow = true;  //工单弹窗
                this.$get("manageNew/manageList",this.formWork)
                    .then((data)=>{
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
                this.form.productName = "";
                this.form.price = "";
                this.form.excutor_name = "";
                this.form.producer = "";
                this.form.manage_id = row.manage_id;
                this.form.manage_number = row.manage_number;
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
//                data = this.form.excutor_type;
                console.log(this.form.excutor_type);
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
            handleClose(id) {
                console.log(id);
//                console.log(this.form.tag_all);
//                console.log(this.form.tag_all[index]);
//                console.log(this.form.tag);

                this.form.tag_name.splice(this.form.tag_name.indexOf(id), 1);
//                var arr=this.form.tag_all;
//                console.log(arr)
//                this.form.tag_all = this.form.tag_all.filter(i =>{
//                    console.log(i)
//                    i.id !== id
//                    return this.form.tag_all.splice(i.id,1)
//                })
//                console.log(this.form.tag_all)
//                var index = this.list.findIndex(item =>{
//                    if()
//                })


                /*遍历数组，然后根据选中的状态获取对应的下标，然后进行删除*/
//                for (let i = 0;i<this.form.tag_all.length;i++) {
//                    let obj = this.form.tag_all[i];
//                    console.log(obj)
//                    if (obj.id == id) {
//                        console.log(i);
//                        this.form.tag_all = this.form.tag_all.splice(i, 1);
//                        this.number.splice(i,1);
//                        i--
//                        console.log(this.form.tag_all);
//                    }
//                }
            },
            showInput() {
                if(this.form.tag_name.length >= 2){
                    this.$message({
                        message: '最多可增加2个标签',
                        type: 'warning'
                    });
                }else{
                    this.styleTab = true;
//                    this.inputVisible = true;
//                    this.$nextTick(_ => {
//                        this.$refs.saveTagInput.$refs.input.focus();
//                    });
                }
            },
            handleInputConfirm() {
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
                this.inputVisible = false;
                this.inputValue = '';
//                this.addCase();
            },
            styleOff(){
                this.styleTab = false;
            },
            stylePut(){
                console.log(this.styleTags)

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
                }else if(this.styleTags == this.form.tag_name[0]){
                    this.$message({
                        message: '风格不可以重复',
                        type: 'warning'
                    });
                }else{
                    this.form.tag_name.push(this.styleTags);
                    this.form.tag = this.form.tag_name;
                    console.log(this.form.tag)
                    console.log(this.form.tag_name)

                    this.styleTab = false;
                    this.inputVisible = false;
                }



//                let inputValue = this.styleTag.tag;
//                if(inputValue == this.inputValue1){
//                    this.$message({
//                        message: '风格不可以重复',
//                        type: 'warning'
//                    });
//                }else if (inputValue) {
//                    this.form.tag.push(inputValue);
//                    this.inputValue1 = inputValue;
//                }

            },


            confirmCancel(){
                this.dialogShow = false;
                this.$parent.caseDtail();
            },
            confirmAdd(){
                if(!this.form.edit){
                    this.form.edit = this.xkedit;
                }
                if(!this.form.brief){
                    this.$message({
                        message: '请输入案例介绍',
                        type: 'warning'
                    });
                }else if(!this.form.idea){
                    this.$message({
                        message: '请输入创意思路',
                        type: 'warning'
                    });
                }else if(this.form.file == ""){
                    this.$message({
                        message: '请上传文件',
                        type: 'warning'
                    });
                }else {
                    if(this.form.cover) {
                        this.form.cover = '';
                    }
                    if(!this.form.cover_source) {
                        this.form.cover_source = this.cover_source;
                    }
                    this.$post('case/editCaseOrder',this.form)
                        .then((data) => {
                            if (data.code) {
                                this.$message({
                                    message: '修改成功！',
                                    type: 'success'
                                });
//                                this.dialogTableVisible = false;
                                this.success = true;
                                this.successes = true;
                                this.successful = true;
                                this.form.cover_source = '';
                                // this.$refs[formName].resetFields();
                                this.$parent.caseDtail();
                            } else {
                                this.$message.error(data.errorMsg);
                            }
                        })
                        .catch(() => {
                            this.$message.error('服务器错误，请稍后重试');
                        })
                }
            },
            deleteRow(index, rows){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$delete( 'case/attachment/' + rows[index].id)
                        .then( (data) => {
                            if(data.code) {
                                this.$message({
                                    message: data.errorMsg,
                                    type: 'success'
                                });
                                rows.splice(index, 1);
                            }
                        })
                        .catch(() => {
                            this.$message.error('服务器错误，请稍后重试');
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
        },
    }
</script>

<style lang="less" type="scoped">
    .caseDtailsOrder{
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