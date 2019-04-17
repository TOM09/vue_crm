<template>
	<div class="task">
        <div class="box-card">
            <el-row :gutter="30">
                <el-col :span="8">
                    <div class="btn-css">
                        <span class="brief-font">{{not_begin}} 个 Brief</span>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="btn-css1">
                        <span class="brief-font">{{avg_day}} 天</span>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="btn-css2">
                        <span class="brief-font">{{finish_count}} 个 Brief</span>
                    </div>
                </el-col>
            </el-row>
            <div class="btn-cs"><el-button  type="primary" round style="width:250px;">我的待办</el-button></div>
            <div class="btn-cs1"><el-button type="primary" round style="width:250px;">本周Brief平均处理时长</el-button></div>
            <div class="btn-cs2"><el-button type="primary" round style="width:250px;">本周完成Brief数</el-button></div>
        </div>
		<el-tabs class="tab-ss"  type="card" @tab-click="handleClick" style="padding:30px;" value="-1">
            <el-tab-pane label="全部" name="-1">
                <tasklist :list="list,count,name" @x_list="x_list" @Refresh="Refresh" @alist="alist"></tasklist>
            </el-tab-pane>
            <el-tab-pane label="未开始" name="0" style="padding-left:0px !important;">
                <tasklist :list="list,count,name" @x_list="x_list" @Refresh="Refresh" @alist="alist" style="padding-left:0px !important;"></tasklist>
            </el-tab-pane>
            <el-tab-pane label="进行中" name="1">
                <tasklist :list="list,count,name" @Refresh="Refresh" @alist="alist" @x_list="x_list"></tasklist>
            </el-tab-pane>
            <el-tab-pane label="已延期" name="2">
                <tasklist :list="list,count,name" @Refresh="Refresh" @alist="alist" @x_list="x_list"></tasklist>
            </el-tab-pane>
            <el-tab-pane label="已完成" name="3">
                <tasklist :list="list,count,name" @Refresh="Refresh" @alist="alist" @x_list="x_list"></tasklist>
            </el-tab-pane>
            <el-tab-pane label="已取消" name="4"  style="border-radius: 20px 0 0 20px;">
                <tasklist :list="list,count,name" @Refresh="Refresh" @alist="alist" @x_list="x_list"></tasklist>
            </el-tab-pane>
        </el-tabs>
	</div>
</template>
<script>
	import tasklist from '../.././components/x_task/newTask.vue';
	export default {
		name: 'taskList',
		components: {
			tasklist,
		},
		data() {
			return {
				list: [],               // 任务列表
                activeName:-1,
				not_begin: '',          // 代办
				avg_day: '',            // 任务时长
				finish_count: '',       // 完成任务
				count: 0,
				pageSize: 10,
				name:'',
			}
		},
		methods: {
            //分页
            x_list (data) {
                this.list = data;
            },
            //搜索传值
            alist(data){
                this.list = data;
            },
            //刷新列表
            Refresh(data){
                this.handleClick({
                    name: data,
                });
            },
            //任务列表
            handleClick(tab) {
                if(tab.name == -1) {
                    this.$get('task/list')
                        .then((data) => {
                            if(data.code) {
                                let show = data.content;
                                this.not_begin = show.not_begin;
                                this.avg_day = show.avg_day;
                                this.finish_count = show.finish_count;
                                this.list = data.content.detail;
                                this.count = data.content.count;
                                this.name = tab.name;
                            } else {
                                this.$message({
                                    showClose: true,
                                    message: '列表为空！',
                                    type: 'warning'
                                });
                            }
                        })
                        .catch((data) => {
                            this.$message.error('服务器错误，请稍后重试');
                        })
                }else{
                    this.$get('task/list', {
                            status: tab.name
                        })
                        .then((data) => {
                            if(data.code) {
                              this.list = data.content.detail;
                              this.count = data.content.count;
                              this.name = tab.name;
                            }else{
                                this.$message({
                                    showClose: true,
                                    message: '列表为空！',
                                    type: 'warning'
                                });
                            }
                        }).catch((data) => {
                            this.$message.error('服务器错误，请稍后重试');
                        })
                }
            }
		},
		// created() {
		// 	this.handleClick({
         //      name: -1
         //    });
		// },
        created () {
            this.handleClick({
              name: -1
            })
        }
	}
</script>
<style lang='less'>
    .task{
        .el-row {
            line-height: 30px;
            text-align: center;
                &:last-child {
                    margin-bottom: 0;
                }
        }
    .brief-font {
        font-family:Microsoft YaHei;
        font-size:18px;
        color:#2d87fd;
        line-height: 33px;
    }
    h4 {
        line-height: 40px;
    }
    .el-col {
        border-radius: 4px;
    }
    .tab-ss .el-tabs__nav{
        border-left:1px solid #2d87fd;
        height:38px;
        .el-tabs__item{
            padding-left: 0px;
            padding-right:0px;
        }
    }
    .tab-ss .el-tabs__item {
        width:64px;
        line-height: 40px;
        text-align: center;
        padding:0;
        float:left;
        color:#999;
        font-size:14px;
        font-family:Microsoft YaHei;
        border-right:1px solid #2d87fd;
        border-top:1px solid #2d87fd;
        border-bottom:3px solid #2d87fd;
        margin:-1px;
    }
    .tab-ss .el-tabs__item.is-active {
        color: #ffff;
        background-color: #2d87fd;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .el-tabs__nav-wrap {
        overflow: hidden;
        margin-bottom: -700px;
        margin-left: 26%;
        position: relative;
        padding-top: 40px;
    }
    .bg-purple {
        background: #fff;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    .el-card{
        background-color:#EEF2F9;
        overflow:inherit;
    }
    .box-card {
        background-image:url("../../.././images/task_list.png");
        background-size:100% 94px;
        margin:34px  auto auto auto;
        height:96px;
        width:100%;
        position:relative;
    }
    .el-button--primary{
        border:none;
    }
        .btn-cs .el-button--primary {
        font-size:15px;
        background: -ms-linear-gradient(left right,#6b85fd,#76caff);        /* IE 10 */
        background:-moz-linear-gradient(left right,#6b85fd,#76caff);/*火狐*/
        background:-webkit-gradient(linear, 100% 0%, 0% 100%,from(#76caff), to(#6b85fd));/*谷歌*/
    }
    .btn-cs1 .el-button--primary{
        font-size:15px;
        background: -ms-linear-gradient(left right,#6b85fd,#76caff);        /* IE 10 */
        background:-moz-linear-gradient(left right,#6b85fd,#76caff);/*火狐*/
        background:-webkit-gradient(linear, 100% 0%, 0% 100%,from(#76caff), to(#6b85fd));/*谷歌*/
    }
    .btn-cs2 .el-button--primary{
        font-size:15px;
        background: -ms-linear-gradient(left right,#6b85fd,#76caff);        /* IE 10 */
        background:-moz-linear-gradient(left right,#6b85fd,#76caff);/*火狐*/
        background:-webkit-gradient(linear, 100% 0%, 0% 100%,from(#76caff), to(#6b85fd));/*谷歌*/
    }
    .btn-cs{
        position:absolute;z-index:2;margin:auto;bottom:-12px;left:10%;
    }
    .btn-cs1{
        position:absolute;z-index:2;margin:auto;bottom:-12px;left:40%;
    }
    .btn-cs2{
        position:absolute;z-index:2;margin:auto;bottom:-12px;right:10%;
    }
    .btn-css{
        position:absolute;z-index:2;margin:auto;top:22px;left:15%;
    }
    @media screen and (max-width: 1920px) {
        .btn-css1{
            position:absolute;z-index:2;margin:auto;top:22px;right:52%;
        }
        .btn-css2{
            position:absolute;z-index:2;margin:auto;top:22px;right:16%;
        }
    }
    @media screen and (max-width: 1366px) {
        .hblock .input-with-select{
            margin-left:0px;
        }
        .btn-css{
            position:absolute;z-index:2;margin:auto;top:22px;left:18%;
        }
        .btn-css1{
            position:absolute;z-index:2;margin:auto;top:22px;right:48%;
        }
        .btn-css2{
            position:absolute;z-index:2;margin:auto;top:22px;right:18%;
        }
        }
    }
</style>
