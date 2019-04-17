// 客户列表组件
<template>
    <div class="dataList">
        <div class="btn">
            <div class="s_client_features_btn">
                <el-button type="primary" @click="toNewList">+新建</el-button>
                <el-button type="primary" @click="toggleSelection_all">转移</el-button>
            </div>
            <div clera="both"></div>
                 <!-- 弹窗 -->
      <el-dialog title="转移给他人(转移后人员可编辑，查看，操作此客户数据)" :visible.sync="dialogFormVisible" :modal="false" width="800px" :before-close="transferFalse">
        <div class='borderBottom'></div>
          <ul class='formRoyatty'>
              <li>负责人</li>
              <li>新负责人</li>
          </ul>

         <el-form :model="ruleForm" class='inputdata'>
                <el-form-item class='is-required royaltyBiliFather'>
                    <el-select v-model="ruleForm.old_dd_id" clearable filterable placeholder="请选择" class="royaltyBili2">
                        <el-option
                                v-for="item in person_choice"
                                :key="item.dd_id"
                                :label="item.nickname"
                                :value="item.dd_id"
                                :disabled="item.open == 0">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="client" class="s_client_item royaltyBiliFather2">
                    <el-select v-model="ruleForm.new_dd_id" clearable filterable placeholder="请选择" class="s_order_search">
                        <el-option
                                v-for="item in person"
                                :key="item.dd_id"
                                :label="item.nickname"
                                :value="item.dd_id">
                        </el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item prop="client" class="s_client_item royaltyBiliFather3">
                      <el-checkbox label='项目信息' v-model="checkedFather" disabled color='red' class='checkTitl'></el-checkbox>
                        <el-radio-group v-model="ruleForm.project" class='radioGroup'>
                          <el-radio :label="2">转移未成单项目</el-radio>
                          <el-radio :label="1">转移全部项目</el-radio>
                          <el-radio :label="0">不转移</el-radio>
                        </el-radio-group>
                      <el-checkbox label="订单信息" v-model="checkedFather" disabled class='checkTitl'></el-checkbox>
                        <el-radio-group v-model="ruleForm.order" class='radioGroup'>
                          <el-radio :label="2">转移回款未完成订单和业绩比例，提成比例</el-radio>
                          <el-radio :label="1">转移全部订单和业绩比例，提成比例</el-radio>
                          <el-radio :label="0">不转移</el-radio>
                        </el-radio-group>

                </el-form-item>

            </el-form>
            <div class='borderBottom borderBottom2'></div>
        
        <div slot="footer" class="dialog-footer">
          <el-button @click="transferFalse">取 消</el-button>
          <el-button type="primary" @click="transferTrue">确 定</el-button>
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
                        <el-table-column type="selection" :selectable="checkboxT"></el-table-column>
                        <el-table-column fixed prop="code" label="客户编号" width="110"></el-table-column>
                        <el-table-column prop="company" label="客户名称"></el-table-column>
                        <el-table-column prop="location" label="所在地"></el-table-column>
                        <el-table-column prop="rank" label="客户级别"></el-table-column>
                        <el-table-column prop="trench" label="来源方式"></el-table-column>
                        <el-table-column prop="ask_method.name" label="咨询方式"></el-table-column>
                        <el-table-column prop="nickname" label="创建人"></el-table-column>
                        <el-table-column prop="partner" label="跟进人"></el-table-column>
                        <el-table-column prop="project_nums" label="意向项目数" width="70"></el-table-column>
                        <el-table-column prop="order_nums"  label="成单数"></el-table-column>
                         <el-table-column prop="ask_time" label="咨询时间" width="100"></el-table-column>
                        <el-table-column prop="create_time" width="100" sortable label="创建时间"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="90">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="gotoInfo(scope.row)">查看</el-button>
                                <el-button v-if="scope.row.button_transfer" @click="transfer(scope.row)" type="text" size="small">转移</el-button>
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
                    client_id:[],
                    old_dd_id:'',
                    new_dd_id:'',
                    project:2,
                    order:2
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
             transferFalse(){
                this.dialogFormVisible = false;
                this.ruleForm.project = 2;
                this.ruleForm.order = 2;
                this.getClientsPerson.client_id = [];
                this.ruleForm.old_dd_id = '';
                this.ruleForm.new_dd_id = '';
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
            transfer(row) {
                // this.toggleSelection;
                this.$refs.multipleTable.clearSelection();
                if (row) {
                    this.$refs.multipleTable.toggleRowSelection(row,true);
                }

                this.getClientsPerson.client_id.push(row.id);
                this.getClientsPersonF();
                this.dialogFormVisible = true;
                this.date.id_all.push(row.id);
                this.ruleForm.client_id.push(row.id);
            },
            gotoInfo(row){
                this.$router.push({name: 'clientDetail',params:{id:row.id}})
            },
            transferTrue(){
                // this.$confirm('是否确认转移', '提示', {
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //     type: 'warning'
                // }).then(() => {
                    this.$post( 'client/transfer',this.ruleForm)
                        .then( (data) => {
                            if(data.code){
                                this.$message({
                                    type: 'success',
                                    message: '转移成功!'
                                });
                                this.dialogFormVisible = false;
                                this.ruleForm.client_id = '';
                                this.client = [];
                                this.ruleForm.project = 2;
                                this.ruleForm.order = 2;
                                this.client_list();
                                //  setTimeout(() => {
                                //     location.reload()
                                // }, 100);
                                
                            } else {
                                this.$message({
                                    message: data.errorMsg,
                                    type: 'warning'
                                });
                            }
                        })
                        .catch ( (error) => {
                        })
                // }).catch(() => {
                //     this.$message({
                //         type: 'info',
                //         message: '已取消转移'
                //     });
                // });
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.client_list();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.client_list();
            },
            // 客户列表接口连接
            client_list () {
                //x_form 是为了查询过后的 再点击分页 能让分页
                let x_form = this.x_form;
                x_form.pageSize = this.pageSize;
                x_form.currentPage = this.currentPage;
                x_form.range = this.name;
                this.$get( 'client/list',x_form)
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
                this.ruleForm.client_id = this.date.id_all;
            },
            
            // 负责人的级联选择
            handleChange(value) {
                this.date.new_dd_id = value;
            },
            toNewList() {
                this.$router.push({name: 'newClient'});
            },
        },
        created(){
            if(this.x_form.range == 1){
                this.client_list();
            };
        }
    }
</script>
<style scoped>
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
}
.royaltyBiliFather{
    display: inline-block;
    width: 180px;
    margin: 10px 0 0;
}
.royaltyBili2{
    width: 100%;
}
.royaltyBiliFather2{
    display: inline-block;
    width: 180px;
    margin: 10px 0 0;
}

.royaltyBiliFather2 .s_order_search{
    width: 100%;
}
.royaltyBiliFather3{
    display: inline-block;
    float: right;
    width: 44%;
    margin: 10px 0 0;
}
.royaltyBiliFather3 .s_order_search{
    width: 100%;
}
.borderBottom2{
    margin-top: 50px
}
.inputdata{
  overflow: hidden;
  width: 100%
}
.radioGroup .el-radio:nth-child(1){
    margin-left: 30px;
}
.royaltyBiliFather3 .checkTitl{
    display: block;
}
.radioGroup .el-radio{
    /* margin: 10px 0; */
    display: block;
}
    /* .el-table th>.cell{
        text-align: center !important;
    } */
</style>
