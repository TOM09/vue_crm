<!--
<style lang="less">
  @import './own-space.less';
</style>

<template>
  <div>
    <Card style="height: 400px !important;">
      <p slot="title">
        <Icon type="person"></Icon>
        个人信息
      </p>
      <Form
          ref="userForm"
          :model="userForm"
          :label-width="100"
          label-position="right"
          :rules="inforValidate"
      >
        <FormItem label="用户姓名：" prop="name">
          <div style="display:inline-block;width:300px;">
            <Input v-model="userForm.name" ></Input>
          </div>
        </FormItem>
        <FormItem label="用户手机：">
          <div>
            <span>{{ userForm.cellphone }}</span>
          </div>

        </FormItem>
        <FormItem label="公司：">
          <span>{{ userForm.company }}</span>
        </FormItem>
        <FormItem label="部门：">
          <span>{{ userForm.department }}</span>
        </FormItem>
        <FormItem label="登录密码：">
          <Button type="text" size="small" @click="showEditPassword">修改密码</Button>
        </FormItem>
        <div>
          <Button type="text" style="width: 100px;background-color:rgb(230, 224, 224);" @click="cancelEditUserInfor">取消</Button>
          <Button type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit">保存</Button>
        </div>
      </Form>
    </Card>
    <Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500">
      <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
      <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
        <FormItem label="原密码" prop="oldPass" :error="oldPassError">
          <Input v-model="editPasswordForm.oldPass" placeholder="请输入现在使用的密码" ></Input>
        </FormItem>
        <FormItem label="新密码" prop="newPass">
          <Input v-model="editPasswordForm.newPass" placeholder="请输入新密码，至少6位字符" ></Input>
        </FormItem>
        <FormItem label="确认新密码" prop="rePass">
          <Input v-model="editPasswordForm.rePass" placeholder="请再次输入新密码" ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelEditPass">取消</Button>
        <Button type="primary" :loading="savePassLoading" @click="saveEditPass">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import Cookies from 'js-cookie';
  export default {
    name: 'own-space',
    data () {
      const validePhone = (rule, value, callback) => {
        var re = /^1[0-9]{10}$/;
        if (!re.test(value)) {
          callback(new Error('请输入正确格式的手机号'));
        } else {
          callback();
        }
      };
      const valideRePassword = (rule, value, callback) => {
        if (value !== this.editPasswordForm.newPass) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      };
      return {
        userForm: {
          name: '',
          cellphone: '',
          company: '天津艺点意创科技有限公司',
          department: ''
        },
        uid: '',  // 登录用户的userId
        securityCode: '',  // 验证码
        phoneHasChanged: false,  // 是否编辑了手机
        save_loading: false,
        identifyError: '',  // 验证码错误
        editPasswordModal: false, // 修改密码模态框显示
        savePassLoading: false,
        oldPassError: '',
        identifyCodeRight: false,  // 验证码是否正确
        hasGetIdentifyCode: false,  // 是否点了获取验证码
        canGetIdentifyCode: false,  // 是否可点获取验证码
        checkIdentifyCodeLoading: false,
        inforValidate: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          cellphone: [
            { required: true, message: '请输入手机号码' },
            { validator: validePhone }
          ]
        },
        editPasswordForm: {
          oldPass: '',
          newPass: '',
          rePass: ''
        },
        passwordValidate: {
          oldPass: [
            { required: true, message: '请输入原密码', trigger: 'blur' }
          ],
          newPass: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
            { max: 32, message: '最多输入32个字符', trigger: 'blur' }
          ],
          rePass: [
            { required: true, message: '请再次输入新密码', trigger: 'blur' },
            { validator: valideRePassword, trigger: 'blur' }
          ]
        },
        inputCodeVisible: false, // 显示填写验证码box
        initPhone: '',
        gettingIdentifyCodeBtnContent: '获取验证码'  // “获取验证码”按钮的文字
      };
    },
    methods: {
      getIdentifyCode () {
        this.hasGetIdentifyCode = true;
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            this.canGetIdentifyCode = true;
            let timeLast = 60;
            let timer = setInterval(() => {
              if (timeLast >= 0) {
                this.gettingIdentifyCodeBtnContent = timeLast + '秒后重试';
                timeLast -= 1;
              } else {
                clearInterval(timer);
                this.gettingIdentifyCodeBtnContent = '获取验证码';
                this.canGetIdentifyCode = false;
              }
            }, 1000);
            this.inputCodeVisible = true;
            // you can write ajax request here
          }
        });
      },
      showEditPassword () {
        this.editPasswordModal = true;
      },
      cancelEditUserInfor () {
        this.$store.commit('removeTag', 'ownspace_index');
        localStorage.pageOpenedList = JSON.stringify(this.$store.state.pageOpenedList);
        let lastPageName = '';
        if (this.$store.state.pageOpenedList.length > 1) {
          lastPageName = this.$store.state.pageOpenedList[1].name;
        } else {
          lastPageName = this.$store.state.pageOpenedList[0].name;
        }
        this.$router.push({
          name: lastPageName
        });
      },
      saveEdit () {
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            let r_data = {};
            r_data['nickname'] = this.userForm.name;
            r_data['username'] = this.userForm.cellphone;
            this.$put( 'user',r_data)
              .then( (data) => {
                if(data.code){
                  Cookies.set('user',data.content.nickname);
                  Cookies.set('userName',data.content.username);
                  this.$Message.success('保存成功');
                } else {
                  this.$message.error('修改失败');
                }
              })
              .catch( () => {
                this.$message.error('服务器错误，请稍后重试');
              });
          }
        });
      },
      cancelEditPass () {
        this.editPasswordModal = false;
      },
      saveEditPass () {
        this.$refs['editPasswordForm'].validate((valid) => {
          if (valid) {
            this.savePassLoading = true;
            // you can write ajax request here
            let r_data = {};
            r_data['nickname'] = this.userForm.name;
            r_data['username'] = this.userForm.cellphone;
            r_data['old_pass'] = this.editPasswordForm.oldPass;
            r_data['password'] = this.editPasswordForm.newPass;
            this.$put( 'user',r_data)
              .then( (data) => {
                if(data.code){
                  this.$message({
                    message: '密码修改成功',
                    type: 'success'
                  });
                  this.editPasswordForm = {};
                  this.editPasswordModal = false;
                } else {
                  this.$message.error(data);
                }
              })
              .catch( () => {
                this.$message.error('服务器错误，请稍后重试');
              });
          }
          this.savePassLoading = false;
        });
      },
      init () {
        this.userForm.name = Cookies.get('user');
        this.userForm.cellphone = Cookies.get('userName');
        this.initPhone = Cookies.get('password');
        JSON.parse(Cookies.get('department')).forEach((item) => {
          this.userForm.department += '-' + item.name;
        });
      },
      cancelInputCodeBox () {
        this.inputCodeVisible = false;
        this.userForm.cellphone = this.initPhone;
      },
      submitCode () {
        let vm = this;
        vm.checkIdentifyCodeLoading = true;
        if (this.securityCode.length === 0) {
          this.$Message.error('请填写短信验证码');
        } else {
          setTimeout(() => {
            this.$Message.success('验证码正确');
            this.inputCodeVisible = false;
            this.checkIdentifyCodeLoading = false;
          }, 1000);
        }
      },
      hasChangePhone () {
        this.phoneHasChanged = true;
        this.hasGetIdentifyCode = false;
        this.identifyCodeRight = false;
      },
      saveInfoAjax () {
        this.save_loading = true;
        setTimeout(() => {
          this.$Message.success('保存成功');
          this.save_loading = false;
        }, 1000);
      }
    },
    mounted () {
      this.init();
    }
  };
</script>
-->
<template>
  <el-card class="own-space">
    <div slot="header">
      <span style="font-size: 14px;">个人中心</span>
    </div>
    <el-form label-width="100px" style="width: 400px;">
      <el-form-item label="用户姓名：" label-suffix  prop="nickname">
        <el-input v-model="ruleForm.nickname" disabled></el-input>
        <i  class="el-icon-edit el-input__icon" @click="handleClick()"></i>
      </el-form-item>
      <el-form-item label="用户手机：">
        <span style="color: #606266;">{{ruleForm.username}}</span>
      </el-form-item>
      <el-form-item label="所在公司：">
        <span style="color: #606266;">{{company}}</span>
      </el-form-item>
      <el-form-item label="所在部门：">
        <span style="color: #606266;">{{dept}}</span>
      </el-form-item>
      <el-form-item label="登录密码：">
        <el-button type="primary" size="mini" @click="handleOpen()">修改密码</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :append-to-body ="true"
      width="30%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="width: 400px;">
        <el-form-item label="用户姓名：" prop="nickname">
          <el-input v-model="ruleForm.nickname"  placeholder="请输入用户姓名"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleName('ruleForm')">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
        title="提示"
        :visible.sync="dialogFormVisible"
        :append-to-body ="true"
        width="30%">
      <el-form :model="form" :rules="rules_t" ref="form" label-width="100px" style="width: 400px;">
        <el-form-item label="原密码" prop="old_pass">
          <el-input type="password" v-model="form.old_pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="rePass">
          <el-input type="password" v-model="form.rePass" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="handlePwd('form')">确 定</el-button>
  </span>
    </el-dialog>
  </el-card>
</template>
<script>
  import Cookies from 'js-cookie'
  export default {
    name: 'own-space',
    data () {
      const validatePass = (rule, value, callback) => {
        if(value === '') {
          callback(new Error('请输入新密码'))
        } else {
          if (this.form.rePass !== '') {
            this.$refs.form.validateField('rePass');
          }
          callback();
        }
      };
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请确认新密码'));
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          nickname: '',
          username: '' //手机号
        },
        form: {
          usermame: '',
          old_pass: '',
          password: '',
        },
        nickname: '',
        dept: '',
        password: '',
        company: '',
        dialogVisible: false,
        dialogFormVisible: false,
        rules: {
          nickname: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]
        },
        rules_t: {
          old_pass: [
            { required: true, message: '请输入原密码', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur' }
          ],
          rePass: [
            { required: true, message: '请确认新的密码', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur' }
          ]
        }

      }
    },
    methods: {
      handleClick () {
        this.dialogVisible = true;
      },
      handleName (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$put('user',this.ruleForm)
              .then((data) => {
                if(data.code) {
                  this.dialogVisible = false;
                  Cookies.set('user',data.content.nickname);
                  Cookies.set('userName',data.content.username);
                  this.$message({
                    type: 'success',
                    message: '更新成功'
                  })
                }
              })
          }
        })
      },
      handleOpen () {
        this.dialogFormVisible = true;
      },
      handlePwd (formName) {
        this.form['nickname'] = this.ruleForm.nickname;
        this.form['username'] = this.ruleForm.username;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$put('user',this.form)
              .then((data) => {
                if(data.code) {
                  this.dialogFormVisible = false;
                  this.$message({
                    type: 'success',
                    message: '修改成功'
                  });
                  this.form = {};
                } else {
                  this.$message.error(data.errorMsg)
                }
              })
          }
        })
      },
      init () {
        this.ruleForm.nickname = Cookies.get('user');
        this.ruleForm.username = Cookies.get('userName');
        this.password = Cookies.get('password');
        JSON.parse(Cookies.get('department')).forEach((item) => {
          item.forEach((key) => {
            this.dept += key.name + '-';
          });
        });
        this.dept = this.dept.substr(0, this.dept.length - 1);
        this.company = JSON.parse(Cookies.get('company_info')).find((ele) => {
          return ele.company_id == Cookies.get('company_id')
        }).company_name
      }
    },
    mounted () {
      this.init()
    }
  }
</script>
<style lang="less">
  .own-space {
    .el-input__inner {
      background: none !important;
      height: 30px;
      line-height: 30px;
    }
    .el-input {
      width: auto;
    }
    .el-icon-edit {
      cursor: pointer;
    }
    .el-dialog {
      border-radius: 10px;
    }
  }
</style>
