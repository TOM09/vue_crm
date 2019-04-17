<template>
	<div class="container">
		<div class="x_box-card">
			<div class="header" :span="24">
				<p class="x_task_count">
					{{form.orderCount}}
				</p>
				<h2 class="x_task">
					待办工单
				</h2>
				<el-button style="float: right; padding: 20px 10px;color: #FFFFFF;" type="text">
					<router-link :to="{ name: 'workOrder'}" class="more">更多</router-link>
				</el-button>
			</div>
			<el-card class="orderCopy" :body-style="{ padding: '0px' }"  v-if="form.orderList.length === 0">
				工单吃鸡去了，没有工单了！
			</el-card>
            <router-link :to="{ name: 'workInfo', query: { manage_id: item.manage_id,work_type: item.task_type,step: item.step,task_id: item.id }}" v-for="(item, index) in form.orderList" :key="item.index" v-if="index<3" class="x_list">
				<p class="portrait">
					<img v-if="item.avatar" :src="item.avatar" alt=""/>
                    <span v-else> {{item.person}}</span>
				</p>
				<div class="x_content">
					<h3 style="line-height: 45px;height:45px;">{{item.title}}</h3>
					<time class="time">{{item.update_time}}</time>
				</div>
			</router-link>
		</div>
		<div class="x_box-card" style="float: right;">
			<div class="header" :span="24">
				<p class="x_task_count">
					{{form.taskCount}}
				</p>
				<h2 class="x_task">
					待办Brief
				</h2>
				<el-button style="float: right; padding: 20px 10px;color: #FFFFFF;" type="text">
					<router-link :to="{ name: 'taskList'}" class="more">更多</router-link>
				</el-button>
			</div>
			<el-card class="orderCopy" :body-style="{ padding: '0px' }" v-if="form.taskList.length === 0">
				没有待办brief，大吉大利，吃鸡去吧！
			</el-card>

			<router-link :to="{ name: 'taskDetail', params: { id: item.id }}" v-for="(item, index) in form.taskList" :key="item.id" v-if="index<3" class="x_box_content">
				<p class="portrait">
					<img v-if="item.avatar"  :src="item.avatar" alt=""/>
					<span v-else> {{item.nickname}}</span>
				</p>
				<div class="x_content" style="position: relative;">
					<h3 style="line-height: 40px;">{{item.title}}</h3>
					<div class="bottom clearfix">
						<time class="time">截至时间：{{item.end_time}}</time>
					</div>
					<div class="bottom clearfix">
						<el-progress :percentage="item.percent" ></el-progress>
					</div>
					<div class="bottom clearfix">
						<p class="x_status" v-if="item.status=='2'" style="color:#fe2d55;">{{item.status_title}}</p>
						<p class="x_status" v-if="item.status=='0'" style="color:#4380ff;">{{item.status_title}}</p>
						<p class="x_status" v-if="item.status=='1'" style="color:#4380ff;">{{item.status_title}}</p>
						<p class="x_status" v-if="item.status=='3'" style="color:#4380ff;">{{item.status_title}}</p>
						<p class="x_status" v-if="item.status=='4'" style="color:#4380ff;">{{item.status_title}}</p>
					</div>
				</div>
			</router-link>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'homeList',
        props:['form'],
		data() {
			return {

			};
		},

		methods: {

		},
        created () {
        }
	}
</script>
<style scoped>
    .container {
        height: 340px;
        clear: both;
    }
    .orderCopy{
        line-height: 270px;
        font-size: 16px;
        height:270px;
        text-align: center;
        color: #b4bccc;
        border:none;
        box-shadow: none;
    }
    a{
        color: #2d2f33;
    }
    a:hover{
        border-bottom: 1px solid #ceddfd85;
        box-shadow:  0px 3px 10px 0px #ceddfd85;
        -background:#f3f3f3;
        cursor: pointer;
        color: #2d2f33;
        margin-bottom: 10px;
    }
    .more{
        color:#fff;
    }
    .more:hover{
		box-shadow: none !important;
        background: none !important;
		border: none !important;
        color:#fff;
    }
	.x_box_content{
        display: block;
		width:100%;
        background: #fff;
		height: 90px;		
	}
	.x_status{
		width:104px;
		height: 72px;
		 text-align: center; 
		 line-height: 60px;
		 position: absolute;
		 top:-2px;
		 right:10px;		 
		 background-image:url("../../../images/status.png");
		 background-size:100%;
	}
	.x_box-card {
		float: left;
		width: 49%;
        height: 327px;
		margin-top: 15px;
		background: #fff;
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;
        box-shadow: 0 2px 12px 0 rgba(67,128,255,.1);
	}
	.header {
		height: 56px;
		line-height: 56px;
		background-color: #4380ff;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		overflow: hidden;
	}
	.x_task_count {
		float: left;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		text-align: center;
		line-height: 20px;
		color: #4380ff;
		background: #fff;
		margin-left: 20px;
		margin-top: 18px;
	}
	.portrait {
		width: 50px;
		height: 50px;
		float: left;
		background-color: #4380ff;
		border-radius: 50%;
		margin-top: 5px;
		line-height: 50px;
		text-align: center;
		font-size: 16px;
		color: #fff;
		margin-left: 8px;
		margin-top: 20px;
	}
	.portrait img {
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}
	.portrait span {
		font-size: 12px;
	}
	.x_task {
		float: left;
		display: inline-block;
		margin-left: 40%;
		color: #fff;
		text-shadow: 0px 0px 5px #023296;
	}
	.image {
		width: 15%;
		float: left;
		border-radius: 50%;
	}
	.x_content {
		float: left;
		width: 80%;
		margin-left: 15px;
		height: 90px;
		overflow: hidden;
	}
	.x_list {
        width:100%;
        background: #fff;
        height: 90px;
		color: #2d2f33;
        display: block;
	}
</style>