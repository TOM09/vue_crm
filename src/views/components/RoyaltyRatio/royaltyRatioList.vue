<template>
    <div class="inquiryListData">
        <div class="orderBtn">
            <el-button type="primary"><router-link to="addRoyaltyRatio" style="color: #fff">+新建</router-link></el-button>
        </div>
        <div class="orderBtn">
            <el-button type="primary"  @click="transferPerformance()">转移业绩</el-button>
        </div>
        <div class="hitemlisttop">
            已选择<span>{{ number }}</span>项 <el-button type="text" @click="toggleSelection()">清空</el-button>
        </div>
        
        <el-card class="box-card">
          <div class="block">
            <span class="demonstration">
              <el-table ref="multipleTable" :data="listdata" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" align="center">
                <el-table-column type="selection" width="55" :selectable="checkboxT">
                    <!-- <template slot-scope="scope">
                        <el-checkbox @click="del_btn(scope.$index,list.data)" v-show='scope.row.is_change' @change='yesFunt' type="text" size="small" style="color: #4380ff;"></el-checkbox>
                    </template> -->
                </el-table-column>
                <el-table-column fixed prop="sn_no" label="提成编号"></el-table-column>
                <el-table-column prop="order_code" label="订单编号"> </el-table-column>
                <el-table-column prop="company" label="客户名称"></el-table-column>
                <el-table-column prop="product" align="center" label="产品"></el-table-column>
                <el-table-column prop="source" label="渠道"></el-table-column>
                <el-table-column prop="department" label="提成部门"></el-table-column>
                <el-table-column prop="dis_nickname" label="提成人员"></el-table-column>
                <el-table-column prop="rate" label="提成占比(%)"></el-table-column>
                <el-table-column prop="nickname" label="创建人"></el-table-column>
                <el-table-column prop="create_time_str" label="创建时间"></el-table-column>
                <el-table-column fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                  <el-button @click="transfer(scope.row)"  type="text" size="small" style="color: #4380ff;">查看</el-button>
                  <el-button @click="transferPerformance2(scope.row,listdata)" v-if="scope.row.is_change" type="text" size="small" style="color: #4380ff;">转移业绩</el-button>
                </template>
                </el-table-column>
              </el-table>
            </span>
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="list.page"
              :page-sizes="[10, 20, 50, 100]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
              :total="list.count">
            </el-pagination>
          </div>
        </el-card>

      <el-dialog title="转移业绩" :visible.sync="transferPerformanceWindow" :modal="false" width="600px">
          <div class='borderBottom'></div>
          <ul class='formRoyatty33'>
              <li>提成人员</li>
              <li>新提成人员</li>
          </ul>
            <el-form :model="res2" ref = 'res2'>
                <div class='royaltyAll123' v-for="(domain,index) in res2.param" :key="domain.key" >
                    <el-form-item class='is-required royaltyBiliFather33' 
                    :prop="'param.' + index + '.b'"
                    >
                        <el-select v-model="domain.b" class="s_additem_form" disabled>
                            <el-option
                                v-for="item in person"
                                :key="item.dd_id"
                                :label="item.nickname"
                                :value="item.dd_id">
                            </el-option>
                        </el-select>
                    </el-form-item>  

                    <el-form-item :prop="'param.' + index + '.dis_dd_id'"  
                    class="royaltyAll2 s_client_item royaltyBiliFather4"
                    :rules="[{ required: true, message: '请选择提成人员',trigger:'blur'}]"                     
                    >
                        <el-select v-model="domain.dis_dd_id" clearable filterable placeholder="请选择" class="s_order_search">
                            <el-option
                                v-for="item in person"
                                :key="item.dd_id"
                                :label="item.nickname"
                                :value="item.dd_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>

                 <div class='borderBottom borderBottom2'></div>
                 <el-form-item style="margin: 20px 0 0 400px;">
                    <el-button type="primary" @click="onSubmit1('res2')">确认</el-button>
                    <el-button @click="transWindow()">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="转移业绩" :visible.sync="transferPerformanceWindow2" :modal="false" width="600px">
          <div class='borderBottom'></div>
          <ul class='formRoyatty33'>
              <li>提成人员</li>
              <li>新提成人员</li>
          </ul>
            <el-form :model="ruleForm" class='inputdata'>
                <el-form-item class='is-required royaltyBiliFather'>
                    <el-input class='royaltyBili2' v-model="input1" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item prop="client" class="s_client_item royaltyBiliFather2">
                    <el-select v-model="paramdis_dd_id" @change="handleChange2" clearable filterable placeholder="请选择" class="s_order_search">
                        <el-option
                                v-for="item in person"
                                :key="item.dd_id"
                                :label="item.nickname"
                                :value="item.dd_id">
                        </el-option>
                    </el-select>
                </el-form-item>
            <div class='borderBottom borderBottom2'></div>
                 <el-form-item style="margin: 20px 0 0 400px;">
                    <el-button type="primary" @click="onSubmit('ruleForm')">确认</el-button>
                    <el-button @click="resetForm()">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    name: 'inquiryListData',
    props:['list','x_form','listdata'],
    data () {
        return {
            testD:1,
            ruleForm:{
                param:[{
                    id:[],
                    dis_dd_id:''
                }]
            },
            paramid:'',
            paramdis_dd_id:'',
            input1:'',
            aded:true,
            res:[],
            res2:{
                param:[]
                // param:[{
                //     id:[],
                //     dis_dd_id:''
                // }]
            },
            selectedOptions:[],
            transferPerformanceWindow:false,
            transferPerformanceWindow2:false,
            count:0,
            dialogVisible:false,
            form:{
                pageSize: 10,
                page: 1,
            },
            number:0,
            options:[
                {
                    value: '2',
                    label: '通过'
                }, {
                    value: '3',
                    label: '不通过'
                }
            ],
            addShow:false,
        }
    },
    methods: {
        transWindow(){
            this.transferPerformanceWindow = false;
            this.res2.param.forEach(e => {
                e.dis_dd_id = '';
            });
        },
        checkboxT(row) {
            // this.toggleSelection()
            return row.is_change
          },
         onSubmit1(res2){
             this.$refs[res2].validate((valid) => {
                if (valid) {
            this.$post( 'orderRoyalty/changeRoyaltyPerson',this.res2)
                .then( (data) => {
                if(data.code){
                    this.$message({
                        message: data.content,
                        type: 'success'
                    });
                    this.transferPerformanceWindow = false;
                    this.res2.param[0].id = [];
                    this.res2.param[0].dis_dd_id = '';

                    this.client_list();

                    // setTimeout(() => {
                    //     location.reload()
                    // }, 100);
                    
                } else {
                    this.$message.error(data.errorMsg);
                }
                })
                .catch(() => {
                this.$message.error('服务器错误，请稍后重试');
                })
                  }
            })
        },
        client_list () {
                //x_form 是为了查询过后的 再点击分页 能让分页
                let x_form = this.x_form;
                // x_form.currentPage = this.currentPage;
                x_form.perPage = this.form.pageSize;
                x_form.page = this.form.currentPage;
                this.$get( 'orderRoyalty/royaltyList',x_form)
                    .then( (data) => {
                        if(data.code){
                            this.$emit("client",[data.content]);
                        }
                    })
                    .catch ( (data) => {
                        this.$message.error('服务器错误1，请稍后重试');
                    })
            },
        onSubmit(){
            this.$post( 'orderRoyalty/changeRoyaltyPerson',this.ruleForm)
                .then( (data) => {
                if(data.code){
                    this.$message({
                        message: data.content,
                        type: 'success'
                    });
                    this.transferPerformanceWindow2 = false;
                    this.ruleForm.param[0].id = [];
                    this.ruleForm.param[0].dis_dd_id = '';
                    this.client_list();
                } else {
                    this.$message.error(data.errorMsg);
                }
                })
                .catch(() => {
                this.$message.error('服务器错误，请稍后重试');
                })
        },
        resetForm(){
            this.transferPerformanceWindow2 = false;
        },
        yesFunt(rows){
        },

        transferPerformance2(rows,data){
            this.paramdis_dd_id = '';
            this.$refs.multipleTable.clearSelection();
                if (rows) {
                    this.$refs.multipleTable.toggleRowSelection(rows,true);
                }

            this.transferPerformanceWindow2 = true;
            this.input1 = rows.dis_nickname
            this.ruleForm.param[0].id.push(rows.id);
        },

        transferPerformance(rows,data){
            if(this.res2.param.length > 0 || rows){
                    this.transferPerformanceWindow = true;
                } else {
                    this.$message.error('这是转移提成人员，请至少选择一个提成数据');
                }
        },
      handleSelectionChange (selection) {
          if(selection.length == 0){
            this.toggleSelection()
          }else if(selection.length > 0){
            this.unique(selection)
            this.number = selection.length;
            this.unique2(this.res)
            this.res2.param = Array.from(
                selection.reduce((dict, item)=> {
                    if (dict.has(item.dis_dd_id)) {
                    dict.get(item.dis_dd_id).push(item.id)
                    } else {
                    dict.set(item.dis_dd_id, [item.id])
                    }
                    return dict
                }, new Map())
            ).map(item => ({id: item[1], b: item[0],dis_dd_id:''}))
        }
      },
    unique(arr){
    　　var arr2 = arr.sort();
    　　this.res = [arr2[0].dis_dd_id];
    　　for(var i=1;i<arr2.length;i++){
    　　　　if(arr2[i].dis_dd_id !== this.res[this.res.length-1].dis_dd_id){
    　　　　　　this.res.push(arr2[i].dis_dd_id);
    　　　　}
    　　}
    　　return this.res;
    },
    unique2(arr){
    　　var arr2 = arr.sort();
    　　this.res = [arr2[0]];
    　　for(var i=1;i<arr2.length;i++){
    　　　　if(arr2[i] !== this.res[this.res.length-1]){
    　　　　　　this.res.push(arr2[i]);
    　　　　}
    　　}
    　　return this.res;
    },
        // 负责人的级联选择
   
    handleChange2(value) {
        this.ruleForm.param[0].dis_dd_id = value
    },
      handleSizeChange(val) {
        this.form.pageSize = val;
        this.inquiryNewData();
      },
      handleCurrentChange(val) {
        this.form.page = val;
        this.inquiryNewData();
      },
      inquiryNewData () {
        this.$emit("inquiryNewData",this.form)
      },
      toggleSelection (rows) {
          this.number = 0;
          this.$refs.multipleTable.clearSelection();
          this.res2.param =[];
      },
      transfer(row) {
          this.$router.push({name: 'royaltyDetail', params: {id: row.sn_no}})
      },
      //删除
      del_btn(index,row) {
          this.$confirm('确认删除该咨询?删除后不可恢复, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              this.$post('consult/delete',{id:row[index].id})
                  .then((data) => {
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
                  .catch(() => { this.$message.error('服务器错误，请稍后重试') })
          }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消删除'
              });
          });
      },
    },
    created(){
      if(this.$route.name == 'RoyaltyRatioList') {
        this.addShow = true;
      }
    },

     computed: {
         testD2(){
            return this.testD+1;
         },
            person () {
                return this.$store.state.app.commonPerson;
            }
        }
  }
</script>

<style lang="less" scoped>
.inquiryListData{
    .orderBtn{
        margin-top: 20px;
        margin-left: 20px;
        margin-bottom: 20px;
        display: inline-block;
    }
    .el-pagination{
        padding: 20px;
        text-align: center
    }
}
.formRoyatty33{
    overflow: hidden;
    margin: 20px 0 0 20px;
}
.formRoyatty33 li{
    float: left;
    list-style: none;
    width: 130px;
    text-align: center;
    font-size: 16px;
    padding: 20px; 
}
.borderBottom{
    width: 100%;
    border-top: 1px solid #eef2f9;
}
.el-dialog__body{
    border-top: 1px solid #eef2f9;
}
.royaltyBiliFather{
    display: inline-block;
    width: 120px;
    margin: 10px 0 0 20px;
}

.royaltyBiliFather33{
    display: inline-block;
    width: 120px;
    margin: 10px 0 0 20px;
}
.royaltyBiliFather2{
    display: inline-block;
    width: 140px;
    margin: 10px 0 0 20px;
}
.royaltyBiliFather4{
    display: inline-block;
    width: 140px;
    margin: 10px 0 0 20px;
}
.royaltyBiliFather2 .s_order_search{
    width: 100%;
}
.royaltyBili2{
    width: 100%;
}
.borderBottom2{
    margin-top: 50px
}
.royaltyAll123{
    margin-bottom: 15px;
}
</style>
