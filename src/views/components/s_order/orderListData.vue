<template>
    <div class="orderListData">
        <div class="orderBtn">
            <el-button type="primary"><router-link to="addOrder" style="color: #fff">+新建</router-link></el-button>
            <el-button type="primary" v-if="seen">导出</el-button>
        </div>
        <div class="hitemlisttop">
            已选择<span>{{ number }}</span>项 <el-button type="text" @click="toggleSelection()">清空</el-button>
        </div>
        
        <el-card class="box-card">
            <div class="block">
                <span class="demonstration">
                    <el-table ref="multipleTable" :data="orderList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" align="center">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column fixed prop="order_code" label="订单编号"></el-table-column>

                        <el-table-column prop="is_repeat" label="标记"> 
                            <template slot-scope="scope">
                                <span class="tableGreen" v-if='scope.row.is_repeat === 2'>
                                    复购
                                </span>
                                <span class="tableBlue" v-if="scope.row.is_repeat == 1">
                                    新购
                                </span>
                            </template>
                        </el-table-column>

                        <el-table-column prop="name" label="订单名称"> </el-table-column>
                        <el-table-column prop="client_name" label="客户名称"></el-table-column>
                         <el-table-column prop="order_nums" align="center" label="客户成单数"></el-table-column>
                        <el-table-column prop="trench" label="渠道"></el-table-column>
                        <el-table-column prop="salesman" label="销售"></el-table-column>
                        <el-table-column prop="partner" label="共同负责人"></el-table-column>
                        <el-table-column prop="product_name" label="产品"></el-table-column>
                        <el-table-column prop="approve_status" label="订单状态"></el-table-column>
                        <el-table-column prop="price" label="金额（元）"></el-table-column>
                        <el-table-column prop="status" label="执行状态"></el-table-column>
                        <el-table-column prop="success_time" label="成单日期"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="150">
                            
                        <template slot-scope="scope">
                            <el-button @click="transfer(scope.row)"  type="text" size="small" style="color: #4380ff;">查看</el-button>
                            <el-button @click="submit_btn(scope.row)"  v-if="scope.row.submit_btn == 1"  type="text" size="small" style="color: #4380ff;">提交</el-button>
                            <el-button @click="del_btn(scope.$index,orderList)"     v-if="scope.row.del_btn == 1"     type="text" size="small" style="color: #4380ff;">删除</el-button>
                            <el-button @click="cancel_btn(scope.row)"  v-if="scope.row.cancel_btn == 1"  type="text" size="small" style="color: #4380ff;">撤销</el-button>
                            <el-button @click="approve_btn(scope.row)" v-if="scope.row.approve_btn == 1" type="text" size="small" style="color: #4380ff;">审批</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                </span>
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4"
                    :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                    :total="count">
                </el-pagination>
                <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :append-to-body="true">
                    <el-select v-model="value" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <p style="margin: 20px 0px 10px 0px;">审批意见</p>
                    <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="textarea">
                    </el-input>
                                    <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="approve_btn_form">确 定</el-button>
                  </span>
                </el-dialog>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {

        name: 'orderListData',
        props: ['orderData','orderList','count','x_form','name'],

        data () {
            return {
                dialogVisible:false,
                seen: false,
                currentPage4: 1,
                pageSize: 10,
                number: 0,
                options:[
                    {
                        value: '2',
                        label: '通过'
                    }, {
                        value: '3',
                        label: '不通过'
                    }
                ],
                value:'', //审批通过与否
                textarea:'', //审批意见
                log_id:'',  // 审批的log_id
            }
        },
        methods: {
            handleSelectionChange (selection) {
                this.number = selection.length;
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.orderNewData();
            },
            handleCurrentChange(val) {
                this.currentPage4 = val;
                this.orderNewData();
            },
            orderNewData () {
                    let x_form = this.x_form;
                    x_form.perPage = this.pageSize;
                    x_form.currentPage = this.currentPage4;
                    x_form.range = this.name;
                    this.$get( 'crmManagement/order/index',x_form)
                        .then( (data) => {
                            this.$emit('x_list',[data.content.orderList,data.content.count]);
                        })
                        .catch(() => {
                        })
            },
            toggleSelection () {
                this.$refs.multipleTable.clearSelection();
            },
            transfer(row) {
                this.$router.push({name: 'orderDetail', params: {id: row.id}})
            },
            //提交
            submit_btn(row) {
                this.$confirm('确认提交订单至上级审核?, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$get('crmManagement/order/buttonApprove',{order_id:row.id})
                        .then((data)=> {
                            if(data.code) {
                                this.$message({
                                    type: 'success',
                                    message: '提交成功'
                                });
                                this.orderNewData();
                            }else {
                                this.$message({
                                    type: 'warning',
                                    message: data.errorMsg
                                });
                            }
                        })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消提交'
                    });
                });

            },
            //删除订单
            del_btn(index,row) {
                this.$confirm('确认删除该订单?删除后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$get('crmManagement/order/delOrder',{order_id:row[index].id})
                        .then((data)=> {
                            if(data.code) {
                                row.splice(index, 1);
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                            }else {
                                this.$message({
                                    type: 'warning',
                                    message: data.errorMsg
                                });
                            }
                        })
                        .catch(()=>{
                            this.$message.error('服务器错误，请稍后重试')
                        })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //撤销
            cancel_btn(row){
                this.$confirm('确认撤销正在审批中的申请?, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$get('crmManagement/order/cancelApprove',{order_id:row.id})
                        .then((data)=> {
                            if(data.code) {
                                this.$message({
                                    type: 'success',
                                    message: data.errorMsg
                                });
                                this.orderNewData();
                            } else {
                                this.$message({
                                    type: 'warning',
                                    message: data.errorMsg
                                });
                            }
                        })
                        .catch(()=>{
                            this.$message.error('服务器错误，请稍后重试')
                        })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消撤销'
                    });
                });
            },
            //审批
            approve_btn(row){
                this.dialogVisible = true;
                this.log_id = row.log_id;
            },
            approve_btn_form(){
              this.$get('crmManagement/order/approve',{log_id:this.log_id,text:this.textarea,status:this.value})
                  .then((data) => {
                      if(data.code) {
                            this.$message({
                                type: 'success',
                                message: '操作成功!'
                            })
                            this.dialogVisible =false;
                            this.orderNewData();
                      } else {
                          this.$message({
                              type: 'warning',
                              message: data.errorMsg
                          });
                      }
                  })
                  .catch(()=> {
                      this.$message.error('服务器错误，请稍后重试')
                  })
            },
        },
        created(){

        }
    }
</script>

<style lang="less" type='scoped'>
.orderListData{
  .orderBtn{
      margin-top: 20px;
      margin-left: 20px;
      margin-bottom: 20px;
  }
  .el-pagination{
      padding: 20px;
      text-align: center
  }
 .tableBlue{
    color : #409eff;
    border: 1px solid #409eff;
    border-radius: 4px;
    padding: 2px;
 }
 .tableGreen{
     color : green;
     border: 1px solid green;
     border-radius: 4px;
     padding: 2px;
 }
}

</style>
