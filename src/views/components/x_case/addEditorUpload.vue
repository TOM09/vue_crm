<template>
    <div class="quill_editor">
        <p style="line-height: 40px;font-size: 14px;">内容预览（必填）</p>
        <quill-editor v-model="xkedit" ref="myTextEditor"  :options="editorOption"  @change="onEditorChange($event)">
            <div id="toolbar" slot="toolbar">
                <span class="ql-formats"><button type="button" class="ql-bold"></button></span>
                <span class="ql-formats"><button type="button" class="ql-italic"></button></span>
                <span class="ql-formats"><button type="button" class="ql-underline"></button></span>
                <span class="ql-formats"><button type="button" class="ql-strike"></button></span>
                <span class="ql-formats"><button type="button" class="ql-blockquote"></button></span>
                <span class="ql-formats"><button type="button" class="ql-code-block"></button></span>
                <span class="ql-formats"><button type="button" class="ql-header" value="1"></button></span>
                <span class="ql-formats"><button type="button" class="ql-header" value="2"></button></span>
                <span class="ql-formats"><button type="button" class="ql-list" value="ordered"></button></span>
                <span class="ql-formats"><button type="button" class="ql-list" value="bullet"></button></span>
                <span class="ql-formats"><button type="button" class="ql-script" value="sub"></button></span>
                <span class="ql-formats"><button type="button" class="ql-script" value="super"></button></span>
                <span class="ql-formats"><button type="button" class="ql-indent" value="-1"></button></span>
                <span class="ql-formats"><button type="button" class="ql-indent" value="+1"></button></span>
                <span class="ql-formats"> <button type="button" class="ql-direction" value="rtl"></button></span>
                <span class="ql-formats"><select class="ql-size">
                        <option value="small"></option>
                        <option selected value="large"></option>
                        <option value="huge"></option>
                      </select></span>
                <span class="ql-formats"><select class="ql-header" >
                        <option value="1"></option>
                        <option value="2"></option>
                        <option value="3"></option>
                        <option value="4"></option>
                        <option value="5"></option>
                        <option value="6"></option>
                        <option selected="selected"></option>
                      </select></span>
                <span class="ql-formats"><select class="ql-color">
                        <option selected="selected"></option>
                        <option value="#e60000"></option>
                        <option value="#ff9900"></option>
                        <option value="#ffff00"></option>
                        <option value="#008a00"></option>
                        <option value="#0066cc"></option>
                        <option value="#9933ff"></option>
                        <option value="#ffffff"></option>
                        <option value="#facccc"></option>
                        <option value="#ffebcc"></option>
                        <option value="#ffffcc"></option>
                        <option value="#cce8cc"></option>
                        <option value="#cce0f5"></option>
                        <option value="#ebd6ff"></option>
                        <option value="#bbbbbb"></option>
                        <option value="#f06666"></option>
                        <option value="#ffc266"></option>
                        <option value="#ffff66"></option>
                        <option value="#66b966"></option>
                        <option value="#66a3e0"></option>
                        <option value="#c285ff"></option>
                        <option value="#888888"></option>
                        <option value="#a10000"></option>
                        <option value="#b26b00"></option>
                        <option value="#b2b200"></option>
                        <option value="#006100"></option>
                        <option value="#0047b2"></option>
                        <option value="#6b24b2"></option>
                        <option value="#444444"></option>
                        <option value="#5c0000"></option>
                        <option value="#663d00"></option>
                        <option value="#666600"></option>
                        <option value="#003700"></option>
                        <option value="#002966"></option>
                        <option value="#3d1466"></option>
                      </select></span>
                <span class="ql-formats"> <select class="ql-background">
                        <option value="#000000"></option>
                        <option value="#e60000"></option>
                        <option value="#ff9900"></option>
                        <option value="#ffff00"></option>
                        <option value="#008a00"></option>
                        <option value="#0066cc"></option>
                        <option value="#9933ff"></option>
                        <option selected="selected"></option>
                        <option value="#facccc"></option>
                        <option value="#ffebcc"></option>
                        <option value="#ffffcc"></option>
                        <option value="#cce8cc"></option>
                        <option value="#cce0f5"></option>
                        <option value="#ebd6ff"></option>
                        <option value="#bbbbbb"></option>
                        <option value="#f06666"></option>
                        <option value="#ffc266"></option>
                        <option value="#ffff66"></option>
                        <option value="#66b966"></option>
                        <option value="#66a3e0"></option>
                        <option value="#c285ff"></option>
                        <option value="#888888"></option>
                        <option value="#a10000"></option>
                        <option value="#b26b00"></option>
                        <option value="#b2b200"></option>
                        <option value="#006100"></option>
                        <option value="#0047b2"></option>
                        <option value="#6b24b2"></option>
                        <option value="#444444"></option>
                        <option value="#5c0000"></option>
                        <option value="#663d00"></option>
                        <option value="#666600"></option>
                        <option value="#003700"></option>
                        <option value="#002966"></option>
                        <option value="#3d1466"></option>
                      </select></span>
                <span class="ql-formats"><select class="ql-font">
                        <option selected="selected"></option>
                        <option value="serif"></option>
                        <option value="monospace"></option>
                      </select></span>
                <span class="ql-formats">
                        <select class="ql-align">
                        <option selected="selected"></option>
                        <option value="center"></option>
                        <option value="right"></option>
                        <option value="justify"></option>
                      </select>
                      </span>
                <span class="ql-formats"><button type="button" class="ql-clean"></button></span>
                <span class="ql-formats"><button type="button" class="ql-link"></button></span>
                <!--图片按钮点击事件-->
                <span class="ql-formats">
                            <button type="button" @click="triggerUpBtn">
        <svg viewBox="0 0 18 18"> <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect>
            <circle class="ql-fill" cx="6" cy="7" r="1"></circle>
            <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline>
        </svg>
                                 <input type="file" ref="upBtn" class="custom-input"  :id="id" @change="doUpload" style='display: none !important;'>
      </button>
                        </span>
                <!--<span class="ql-formats"><button type="button" class="ql-video"></button></span>-->

            </div>
        </quill-editor>
    </div>
</template>

<script>
    import { Loading } from 'element-ui';
    import { quillEditor } from 'vue-quill-editor'
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    export default {
        name: "addEditorUpload",
        components:{
            quillEditor
        },
        data(){
            return{
                xkedit:'',
                region:'oss-cn-beijing',
                id: 'upload3',
                percentage: 0,
                urls:[],
                file: [],
                loading: true,
                fileSuccess: false,
                editorOption: {
                    modules: {
                        toolbar: '#toolbar',
                    }
                },
            }
        },
        // 监听函数
        watch: {
            success: function () {
                if(this.successful){
                    this.file = [];
                    this.urls = [];
                    this.percentage = 0;
                    // this.uploadFile = false;
                    this.$emit("fileTrue2",this.fileSuccess);
                }
            }
        },
        computed: {
            editor() {
                return this.$refs.myTextEditor.quill
            },
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
                    let fileName_v = files.value.substring(files.value.lastIndexOf(".") + 1,files.value.length);
                    if (files.value && (files.value.indexOf(' ') == -1)) {
                        let loadingInstance = Loading.service({text: '拼命上传中'});
                        const fileLen = document.getElementById(_this.id).files;
                        for (let i = 0; i < fileLen.length; i++) {
                            const file = fileLen[i];
                            // 上传
                            let fileName = this.random_string();
                            client.multipartUpload('crmFiles/' + fileName + '.' + fileName_v, file, {
                                progress: function * (percentage, cpt) {
                                    // 上传进度
                                    _this.percentage = percentage
                                }
                            }).then((results) => {
                                // 上传完成
                                if(results.res.status == 200){
                                    let paths = results.res.requestUrls[0].split("?")[0];
                                    _this.editor.insertEmbed(_this.length, 'image',paths);
                                    loadingInstance.close();
                                }
                            }).catch(() => {
                                loadingInstance.close();
                            })
                        }
                    }else {
                        this.$message({
                            message: '上传文件的名字不要有空格,请重新上传',
                            type: 'warning'
                        });
                    }
                })
            },
            onEditorChange(){
                this.$emit('editup',this.xkedit);
            },
        },
        created(){

        }
    }
</script>

<style lang="less">
    .quill-editor {
        height: 380px;
        clear: both;
        .ql-container {
            height: 280px;
        }
    }

    .limit {
        height: 30px;
        border: 1px solid #ccc;
        line-height: 30px;
        text-align: right;

        span {
            color: #ee2a7b;
        }
    }

    .ql-snow .ql-editor img {
        max-width: 80px;
    }
    .ql-clipboard+div{
        position: absolute !important;
        left: 70px !important;
    }
    .ql-editor .ql-video {
        max-width: 80px;
    }
</style>