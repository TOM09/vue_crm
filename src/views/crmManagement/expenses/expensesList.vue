<template>
  <div class="x_costList">
    <el-card>
      <el-form :model="ruleForm" ref="ruleForm" label-position="left" label-width='100px'>
        <el-form-item label="订单编号：" prop="order_code" class="cost_input">
          <el-input v-model="ruleForm.order_code" clearable   placeholder="请输入订单编号" class="x_costList_input">
          </el-input>
        </el-form-item>
        <el-form-item prop="cost_type" label="费用项：" class="cost_input">
          <el-select v-model="ruleForm.cost_type" clearable placeholder="请选择" class="x_costList_input">
            <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="cost_time" label="费用日期：" class="cost_input">
          <el-date-picker
              v-model="ruleForm.cost_time"
              clearable
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <div style="clear:both"></div>
        <el-form-item style="float: right;">
          <el-button type="primary" @click="costList">查询</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button @click="exportWorkInfo">导出</el-button>
        </el-form-item>
      </el-form>

    </el-card>
    <div class="dataList">
      <el-card>
        <div class="costlistbtn">
          <el-button type="primary"><router-link :to="{name: 'addExpenses'}" style="color:white;margin-bottom: 10px;">+新建</router-link></el-button>
        </div>
        <div class="hblock">
				<span class="demonstration">
					<el-table ref="multipleTable" :data="costlist" tooltip-effect="dark" style="width: 100%"
                    align="center">
						<el-table-column fixed prop="cost_code" label="费用编号"></el-table-column>
						<el-table-column prop="order_code" label="订单编号"></el-table-column>
						<el-table-column prop="company" label="客户"></el-table-column>
						<el-table-column prop="product" label="产品" width="200"></el-table-column>
						<el-table-column prop="cost_type" label="费用项"></el-table-column>
						<el-table-column prop="cost_price" label="金额(元)"></el-table-column>
						<el-table-column prop="cost_time" label="费用日期"></el-table-column>
                        <el-table-column width="200"  label="备注">
                            <template slot-scope="scope">
                                 <span>{{scope.row.remarks.slice(0,14)}}</span>
                            </template>
                        </el-table-column>
						<el-table-column fixed="right" label="操作">
							<template slot-scope="scope">
								<el-button type="text" @click="costDetail(scope.row)" size="small">查看</el-button>
                                <el-button type="text" @click="deleteDetail(scope.row)" size="small">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</span>
          <el-pagination
              background
              style="text-align: center;margin: 5px auto;"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="ruleForm.currentPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="ruleForm.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="count">
          </el-pagination>
        </div>
      </el-card>
    </div>

  </div>
</template>

<script>
  import Cookies from 'js-cookie';
  import Util from '@/libs/util';
  export default {
    data () {
      return {
        Authorization: Cookies.get('access_token'),
        pickerOptions: {
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
        costlist:[],
        options: [],
        ruleForm:{
          order_code:'',
          cost_type:'',
          cost_time:'',
          currentPage: 1,
          pageSize: 0,
        },
        count:0,
        number: 0,
      }
    },
    methods: {
      // 每页多少条
      handleSizeChange (val) {
        this.ruleForm.pageSize = val;
        this.costList();
      },
      // 第几页
      handleCurrentChange (val) {
        this.ruleForm.currentPage = val;
        this.costList();
      },
      costList () {
        this.$get( 'OrderCost/CostList',this.ruleForm)
          .then( (data) => {
            if(data.code){
              this.options = data.content.cost_type;
              this.costlist = data.content.list.data;
              this.count = data.content.list.count;
            }else{
              this.$message.error(data.errorMsg);
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试')
          })
      },
      costDetail(row) {
        this.$router.push({
          name: 'expensesDetail',
          params: {id: row.id}
        })
      },
      deleteDetail(row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$delete('OrderCost/CostDel/' + row.id)
            .then( (data) => {
              if(data.code){
                this.$message({
                  message: '删除成功',
                  type: 'success'
                });
                this.costList();
              }
            })
            .catch( () => {
              this.$message.error('服务器错误，请稍后重试');
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields();
      },
      // 导出
      exportWorkInfo () {
        let strArgs = Util.makeUrl(this.ruleForm);
        window.open(`${process.env.BASE_API}/report/CostExcel?Authorization=${this.Authorization}${strArgs}`)
      },
    },
//     watch: {
// 　　'$route' (to, from) {
// 　　this.$router.go(0);
// 　　}
// },
    created () {
      this.costList();
    }
  }
</script>

<style lang="less">
  .x_costList{
    .cost_input {
      margin-left: 10px;
      width: 300px;
      display: inline-block;
    }
    .cost_input label{
      text-align: right !important;
    }
    .x_costList_input {
      width: 220px;
    }
    .WHSBtn {
      margin-left: 65%;
    }
    .costlistbtn{
      margin-bottom: 15px;
    }
  }
</style>
