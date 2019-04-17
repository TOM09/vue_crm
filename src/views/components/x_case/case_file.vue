<template>
    <div class="index">
        <div class="x_oss_file">
            <ul style="position: absolute;left: 0px;top: 0px; margin-right: 20px; z-index: 999;background: #fff;">
                <li v-for="(u, ind) in urls" @mouseover="mouseIn(ind)" @mouseout="mouseOut(ind)" style="width: 130px;height: 103px;" class="url-li-hover">

                    <span v-if="isHover[ind]" class="el-icon-close" @click="delOssFile(u.path)" style="display:inline-block;margin-left: 13px;"></span>
                    <span v-else class="el-icon-success" style="color: green;display:inline-block;margin-left: 13px;"></span>
                    <img :src="u.path" alt="" style="width: 100px;height: 100px;float:left;">

                </li>
            </ul>
            <a  href="javascript:;" class="file" :disabled = filex @click="triggerUpBtn">
                <i class="el-icon-plus"></i>
                <input type="file" ref="upBtn" :id="id"  @change="doUpload"/>
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'upload',
        props:['successes'],
        data () {
            return {
                dialogVisible: false,
                region: 'oss-cn-beijing',
                id: 'upload1',
                percentage: 0,
                urls:[],
                file: [],
                loading: true,
                fileSuccess: false,
                isHover: [],
                uploadFile: false,
                filex: false,
                successx:true,

            }
        },
        // 监听函数
        watch: {
            successes: function () {
                if(this.successes){
                    this.file = [];
                    this.urls = [];
                    this.filex = false;
                    this.percentage = 0;
                    this.uploadFile = false;
                    this.$emit("fileTrue1",this.fileSuccess);
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
                    });
                    _this.percentage = 0;
                    const files = document.getElementById(_this.id);
                    let fileName_v = files.value.substring(files.value.lastIndexOf(".") + 1,files.value.length);
                    if (files.value && (files.value.indexOf(' ') == -1)) {
                        this.uploadFile = true;
                        const fileLen = document.getElementById(_this.id).files;
                        for (let i = 0; i < fileLen.length; i++) {
                            const file = fileLen[i];
                            let size = file.size;
                            var reader = new FileReader(),
                                img = new Image();
                            if(file.type.indexOf("image") == 0) {
                                reader.readAsDataURL(file);
                            }
                            reader.onload = function(e) {
                                img.src = e.target.result;
                            };
                            img.onload = function() {
                              if(size > 1024*400) {
                                 _this.$message({
                                  type:'warning',
                                  message:'图片大小要小于400kb'
                                })
                              } else if(this.width >= 800 && this.height >= 800) {
                                    let fileName = _this.random_string();
                                    client.multipartUpload('crmFiles/' + fileName + '.' + fileName_v, file, {
                                        progress: function * (percentage, cpt) {
                                            // 上传进度
                                            let numInt = Math.ceil(percentage * 100)
                                            _this.percentage = numInt;
                                        }
                                    }).then((results) => {
                                        // 上传完成
                                        if(results.res.status == 200){
                                            let paths = results.res.requestUrls[0].split("?")[0];
                                            _this.file.push({name: file.name,size: file.size,path: paths});
                                            _this.$emit("fileStatus1",_this.file);
                                            _this.urls.push({name:results.name,path:paths});
                                            _this.filex = true;
                                            _this.file = [];  //清理缓存
                                        }
                                    }).catch( () => {
                                    })
                                }else {
                                    _this.$message({
                                        message: '封面图需要宽高大于800*800 哦',
                                        type: 'warning'
                                    });
                                }
                            };
                            /*// 上传
                            if(this.size){
                                let fileName = this.random_string();
                                client.multipartUpload('crmFiles/' + fileName + '.' + fileName_v, file, {
                                    progress: function * (percentage, cpt) {
                                        // 上传进度
                                        let numInt = Math.ceil(percentage * 100)
                                        _this.percentage = numInt;
                                    }
                                }).then((results) => {
                                    alert();
                                    // 上传完成
                                    if(results.res.status == 200){
                                        let paths = results.res.requestUrls[0].split("?")[0];
                                        this.file.push({name: file.name,size: file.size,path: paths})
                                        this.$emit("fileStatus1",this.file);
                                        _this.urls.push({name:results.name,path:paths});
                                        this.filex = true;
                                        this.file = [];  //清理缓存
                                    }
                                }).catch( () => {
                                })
                            }*/
                        }
                    } else {
                        this.$message({
                            message: '上传文件的名字不要有空格,请重新上传',
                            type: 'warning'
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
                            this.uploadFile = false;
                            this.filex = false;
                            this.$emit('filexx',this.successx);
                        }
                    })
                    .catch(() => {
                        this.$message.error('服务器错误，请稍后重试');
                    })
            }
        }
    }
</script>
<style lang="less">
    .x_oss_file{
    .file {
        float: left;
        display: block;
        width: 100px;
        height: 100px;
        border:1px solid #ccc;
        border-radius: 10px;
        position: absolute;
        left: 140px;
        top:0px;
        margin-right: 10px;
        z-index: 999;
    }
    .file input {
        display: none;
    }
    .file:hover {
        color: #409eff;
        border-color: #c6e2ff;
        background-color: #ecf5ff;
    }
    .file i{
        line-height: 75px;
    }
    .oss_file ul li {
        width: 98%;
    }
    .url-li-hover:hover {
        background: #f5f7fa;
        height: 100px;
        cursor: pointer;
    }
    .filex{

    }
    }
</style>
