// 客户列表组件
<template>
    <div class="facilitatorList">
        <div class="btn">
            <div class="s_client_features_btn">
                <el-button type="primary" @click="toNewList">+新建</el-button>
                <el-button type="primary" @click="toggleSelection_all">转移给他人</el-button>
            </div>
            <div clera="both"></div>
                 <!-- 弹窗 -->
      <el-dialog title="转移给他人"  class='fromPerson' :visible.sync="dialogFormVisible" :modal="false" width="500px" :before-close="transferFalse">
        <div class='borderBottom'></div>
         <el-form :model="ruleForm" class='inputdata'>
                <el-form-item prop="client" label="新负责人" label-width="120px"  class="">
                    <el-select v-model="ruleForm.change_dd_id" clearable filterable placeholder="请选择">
                        <el-option
                                v-for="item in person"
                                :key="item.dd_id"
                                :label="item.nickname"
                                :value="item.dd_id">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <div class='borderBottom'></div>
        
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="transferTrue">确 定</el-button>
          <el-button @click="transferFalse">取 消</el-button>
        </div>
      </el-dialog>
      
        </div>


        <div class="hitemlisttop">
            已选择<span>{{ number }}</span>项 <el-button type="text" @click="toggleSelection()">清空</el-button>
        </div>
        
        <el-card class="box-card">
            <div class="block">
                <span class="demonstration demonstrationCaozuo">
                    <el-table ref="multipleTable" :data="clientList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" align="center">
                        <el-table-column type="selection"></el-table-column>

                        <!--判斷權限
                            <el-table-column type="selection" :selectable="checkboxT"></el-table-column> 
                        -->

                        <el-table-column fixed prop="sn_no" label="编号" width="120"></el-table-column>
                        <el-table-column prop="provider_name" label="名称"></el-table-column>
                        <el-table-column prop="products" label="合作产品"></el-table-column>
                        <el-table-column prop="type" label="类型"></el-table-column>
                        <el-table-column prop="city" label="城市"></el-table-column>
                        <el-table-column prop="begin_end_time"  width="110" label="合作有效期"></el-table-column>
                        <el-table-column prop="employment_time" label="从业时间（年）" center></el-table-column>
                        <el-table-column prop="nickname" label="负责人"></el-table-column>
                        <el-table-column prop="status" label="状态"></el-table-column>
                        <el-table-column prop="create_time" width="100" sortable label="创建时间"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="90">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="gotoInfo(scope.row)">查看</el-button>
                                <el-button type="text" size="small" v-if="scope.row.is_opera" @click="gotoform(scope.row)">转移</el-button>
                                 <!-- <el-button @click="del_btn(scope.$index,orderList)"     v-if="scope.row.del_btn == 1"     type="text" size="small" style="color: #4380ff;">删除</el-button> -->
                            </template>
                        </el-table-column>
                    </el-table>
                </span>
                <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="count">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: 'clientListData',
        props: ['clientList','count','x_form','name'],
        data () {
            return {
                person_choice:[],
                getClientsPerson:{
                    client_id:[]
                    },
                currentPage: 1,
                pageSize: 10,
                dialogFormVisible: false,
                client: [],
                number: 0,
                form: {
                    client: '',
                },
                date: {
                    project: false,
                    order: false,
                    id_all:[],
                    new_dd_id: '',
                },
                selectedOptions:[],
                checkedFather:true,
                ruleForm:{
                    provider_id:[],
                    change_dd_id:'',
                },
                newNum: 0,
                selectionAll:[],
                isChack:false,
            }
        },
        computed: {
            person () {
                return this.$store.state.app.commonPerson;
            }
        },
        methods: {
            gotoform(row){
                console.log(row.id)
                    this.dialogFormVisible = true;
                    this.ruleForm.provider_id.push(row.id);
            },
             transferFalse(){
                this.dialogFormVisible = false;
                this.getClientsPerson.client_id = [];
                this.ruleForm.provider_id = [];
                this.ruleForm.change_dd_id = '';
            },
             // 批量客户负责人下拉
      getClientsPersonF(){
        this.$post( 'client/getClientsPerson',this.getClientsPerson)
          .then( (data) => {
            this.person_choice = data.content;
          })
          .catch (() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      },
          checkboxT(row,index) {
            return row.button_transfer
          },
            toggleSelection(row, selected){
                this.$refs.multipleTable.clearSelection();
            },
            // 批量转移客户
            toggleSelection_all(){
                if(this.date.id_all.length > 0){
                    this.getClientsPerson.client_id = this.date.id_all;
                    this.getClientsPersonF()
                    this.dialogFormVisible = true;
                } else {
                    this.$message.error('这是转移多个客户，请选择转移客户');
                }
            },
            // transfer(row) {
            //     // this.toggleSelection;
            //     this.$refs.multipleTable.clearSelection();
            //     if (row) {
            //         this.$refs.multipleTable.toggleRowSelection(row,true);
            //     }

            //     this.getClientsPerson.client_id.push(row.id);
            //     this.getClientsPersonF();
            //     this.dialogFormVisible = true;
            //     this.date.id_all.push(row.id);
            //     this.ruleForm.client_id.push(row.id);
            // },
            gotoInfo(row){
                console.log(row)
                this.$router.push({name: 'facilitator',params:{id:row.id}})
            },
            transferTrue(){

                this.$confirm('是否确认转移', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log(this.ruleForm)
                    this.$post( 'serviceProvider/changePerson',this.ruleForm)
                        .then( (data) => {
                            if(data.code){
                                this.$message({
                                    type: 'success',
                                    message: '转移成功!'
                                });
                                this.dialogFormVisible = false;
                                this.ruleForm.provider_id = [];
                                this.ruleForm.change_dd_id = '';
                                this.client = [];
                                this.client_list();
                            } else {
                                this.$message({
                                    message: data.errorMsg,
                                    type: 'warning'
                                });
                            }
                        })
                        .catch ( (error) => {
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消转移'
                    });
                });
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.client_list();
            },
            handleCurrentChange(val) {
                console.log(val)
                this.currentPage = val;
                this.client_list();
            },
            // 客户列表接口连接
            client_list () {
                //x_form 是为了查询过后的 再点击分页 能让分页
                let x_form = this.x_form;
                x_form.perPage = this.pageSize;
                x_form.page = this.currentPage;
                x_form.range = this.name;
                console.log(x_form)

                this.$get( 'serviceProvider/providerList',x_form)
                    .then( (data) => {
                        if(data.code){
                            this.$emit("client",[data.content.data,data.content.count]);
                        }
                    })
                    .catch ( (data) => {
                        this.$message.error('服务器错误，请稍后重试');
                    })
            },
            // 列表的选择状态
            handleSelectionChange(val) {
                this.date.id_all = [];
                if(val.length > 0){
                    for(let i = 0; i < val.length; i++){
                        this.date.id_all.push(val[i].id);
                        this.date.id_all = Array.from(new Set(this.date.id_all))
                    }
                }else{
                    this.selectionAll = [];
                }
                this.number = val.length;
                this.ruleForm.provider_id = this.date.id_all;
            },
            toNewList() {
                this.$router.push({name: 'addFacilitator'});
            },
        },
        created(){
            if(this.x_form.range == 1){
                this.client_list();
            };
        }
    }
</script>
<style lang='less'>
.facilitatorList{
            .btn{
            margin-top: 15px;
            margin-bottom: 15px;
        }
        .s_client_loading{
            width: 100%;
            height: 50px;
            text-align: left;
            line-height: 50px;
            text-indent:2em;
            background: #e1e1e1;
        }
        .s_client_loading span{
            color: #fff;
            margin-left: 10px;
        }
        .el-pagination{
            padding: 20px;
            text-align: center
        }
        .box-card {
            margin: 0;
        }
    .formRoyatty{
        overflow: hidden;
        margin: 20px  0 0 40px;
    }
    .formRoyatty li{
        float: left;
        list-style: none;
        width: 130px;
        text-align: center;
        font-size: 16px;
        padding: 20px; 
        margin-right: 60px;

    }
    .borderBottom{
        width: 100%;
        border-top: 1px solid #eef2f9;
        margin-bottom: 20px;
    }
    .royaltyBiliFather{
        display: inline-block;
        width: 180px;
        margin: 10px 0 0;
    }
    .royaltyBili2{
        width: 100%;
    }
    .inputdata{
    overflow: hidden;
    width: 100%
    }
    .radioGroup .el-radio:nth-child(1){
        margin-left: 30px;
    }

    .radioGroup .el-radio{
   
        display: block;
    }
    .fromPerson{
        .el-dialog__body{
            padding: 0 !important;
        }
        .inputdata{
            margin: 40px 0;
        }
    }
    
      
}

</style>
