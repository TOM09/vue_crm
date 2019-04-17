<template>
	<div class="index">
		<div class="oss_file">
			<a href="javascript:;" class="file" @click="triggerUpBtn">选择文件
				<input type="file" ref="upBtn" :id="id" @change="doUpload"/>
			</a>
			<ul>
				<li v-for="(u, ind) in file" :key='ind' @mouseover="mouseIn(ind)" @mouseout="mouseOut(ind)" class="url-li-hover">
					<span style="width: 90%; display: inline-block">{{u.name}}</span>
					<span v-if="isHover[ind]" class="el-icon-close" @click="delOssFile(u.path)"></span>
					<span v-else class="el-icon-success" style="color: green"></span>
				</li>
			</ul>
		</div>
		<el-dialog
				title="上传进度"
				custom-class="shiyany"
				:visible.sync="dialogVisible"
				:modal='false'
				width="50%"
				:show-close='false'
				:close-on-click-modal='false'
				:close-on-press-escape='false'
		>
			<span>
				上传进度: {{ percentage == 100 ? '上传完成':'正在上传' }}
				<el-progress :percentage="percentage"></el-progress>
			</span>
		</el-dialog>
	</div>
</template>

<script>
    export default {
        name: 'upload',
        props:['success'],
        data () {
            return {
                region: 'oss-cn-beijing',
                id: 'upload',
                percentage: 0,
                urls:[],
                file: [],
                loading: true,
                fileSuccess: false,
                isHover: [],
                // uploadFile: false,
                dialogVisible: false,
            }
        },
        // 监听函数
        watch: {
            success: function () {
                if(this.success){
                    this.file = [];
                    this.urls = [];
                    this.percentage = 0;
                    // this.uploadFile = false;
                    this.$emit("fileTrue",this.fileSuccess);
                }
            }
        },
        methods:{
            // 随机生成文件名
            random_string(len = 16) {
                var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
                var maxPos = chars.length;
                var pwd = '';
                for (let i = 0; i < len; i++) {
                    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
                }
                let timestamp = new Date().getTime();

                return pwd + '_' + timestamp;
            },
            triggerUpBtn() {
                this.$refs.upBtn.click();
            },
            doUpload () {
                const _this = this;
                _this.$post( 'getSts').then((result) => {
                    const client = new OSS.Wrapper({
                        region: _this.region,
                        accessKeyId: result.AccessKeyId,
                        accessKeySecret: result.AccessKeySecret,
                        stsToken: result.SecurityToken,
                        bucket: result.bucket
                    })
                    _this.percentage = 0;
                    const files = document.getElementById(_this.id);
                    let fileName_v = files.files[0].name.substring(files.files[0].name.lastIndexOf(".") + 1,files.files[0].name.length);
                    if ((files.files[0].name.indexOf('+') == -1) && (files.files[0].name.indexOf(' ') == -1)) {
                        this.dialogVisible = true;
                        const fileLen = document.getElementById(_this.id).files;
                        for (let i = 0; i < fileLen.length; i++) {
                            const file = fileLen[i];
                            // 上传
                            let fileName = this.random_string();
                            client.multipartUpload('crmFiles/' + fileName + '.' + fileName_v, file, {
                                progress: function * (percentage, cpt) {
                                    // 上传进度
                                    let numInt = Math.ceil(percentage * 100);
                                    _this.percentage = numInt;
                                }
                            }).then((results) => {
                                // 上传完成
                                if(results.res.status == 200){
                                    let paths = results.res.requestUrls[0].split("?")[0];
                                    this.file.push({name: file.name,size: file.size,path: paths});
                                    this.$emit("fileStatus",this.file);
                                    _this.urls.push({name:results.name,path:paths});
                                    this.dialogVisible = false;
                                }
                            }).catch(() => {
                            })
                        }
                    }else {
                        this.$message({
                            message: '上传文件的名字不要有空格和加号,请修改后重新上传',
                            type: 'warning',
                            duration:2000
                        });
                    }
                })
            },
            mouseIn(ind) {
                this.$set(this.isHover, ind, true);
            },
            mouseOut(ind) {
                this.$set(this.isHover, ind, false);
            },
            delOssFile(path) {
                this.$get('/delOssFile', {path: path})
                    .then((data) => {
                        if(data.code) {
                            let urls = this.urls;
                            for(let i in urls) {
                                if(urls[i].path === path) {
                                    this.urls.splice(i, 1);
                                    this.file.splice(i, 1);
                                };
                            }
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            });
                            this.percentage = 0;
                            // this.uploadFile = false;
                        }
                    })
                    .catch((data) => {
                        this.$message.error('服务器错误，请稍后重试');
                    })
            }
        }
    }
</script>
<style lang='less'>
	.index{
		.shiyany {
			height: 500px;
		}
		.file {
			border-radius: 10px;
			border: 1px solid #d8dce5;
			display: inline-block;
			line-height: 1;
			white-space: nowrap;
			cursor: pointer;
			background: #fff;
			color: #5a5e66;
			text-align: center;
			box-sizing: border-box;
			outline: 0;
			margin: 0;
			transition: .1s;
			padding: 12px 20px;
			font-size: 14px;
			font-weight: 500;
			font-family: inherit;
			text-transform: none;
			overflow: visible;
			-webkit-tap-highlight-color: transparent;
		}
		.file input {
			display: none;
		}
		.file:hover {
			color: #409eff;
			border-color: #c6e2ff;
			background-color: #ecf5ff;
		}
		.oss_file ul li {
			width: 98%;
		}
		.url-li-hover:hover {
			background: #f5f7fa;
			cursor: pointer;
		}
	}
</style>