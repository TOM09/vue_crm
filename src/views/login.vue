<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
          <i class="el-icon-circle-check"></i>
          欢迎登录
        </p>
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="username">
              <Input v-model="form.username" placeholder="请输入用户名">
              <span slot="prepend">
                <Icon :size="16" type="person"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password" placeholder="请输入密码">
              <span slot="prepend">
                <Icon :size="14" type="locked"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
          </Form>
          <p class="login-tip">
            <img src="../images/login_360.png" alt="" style="width:29px;height: 27px;margin:7px 2%;">
            <img src="../images/login_chrome.png" alt="">
            <img src="../images/login_ie.png" alt="">
          </p>
          <p class="login_title">仅支持Microsoft Edge、谷歌、360浏览器</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import Cookies from 'js-cookie';
  export default {
    data () {
      return {
        form: {
          username: '',
          password: '',
        },
        rules: {
          username: [
            { required: true, message: '账号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      handleSubmit () {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            Cookies.set('password', this.form.password);
            Cookies.set('userName', this.form.username);
            this.$get( 'login',this.form)
              .then( (data) => {
                if(data.code){
                  //设置登录菜单权限
                  if(data.content.menu_list.length < 1){
                    this.$message.error('您没有权限登录，请联系管理员授权');
                  }else {
                    let menu_list = data.content.menu_list;
                    Cookies.set('access',menu_list.join(","));
                    Cookies.set('user', data.content.nickname);
                    Cookies.set('access_token', data.content.access_token);
                    Cookies.set('department',data.content.department);
                    Cookies.set('avatar',data.content.avatar);
                    Cookies.set('company_info',data.content.company_info);
                    Cookies.set('company_id',data.content.company_id);
                    this.company_id = data.content.company_id;
                    this.$store.commit('setAvator', data.content.avatar);
                    this.$message({
                      message: "登录成功",
                      type: 'success'
                    });
                    this.$get('consult/search')
                      .then((data) => {
                        localStorage.setItem('consultSearch', JSON.stringify(data.content));
                      })
                      .catch(() => {});
                    this.$store.dispatch('dept',{});
                    /*this.$get('system/allDeptPerson',{company_id: Cookies.get('company_id')})
                      .then((data) => {
                        localStorage.setItem('dept', JSON.stringify(data.content.dept));
                        localStorage.setItem('person',JSON.stringify( data.content.person));
                      })
                      .catch(() => {})*/
                    this.$store.commit('updateMenulist');
                    this.$router.push({
                      name: 'home_index'
                    });
                  }
                } else {
                  this.$message.error(data.errorMsg);
                }
              })
              .catch(() => {
                this.$message.error('服务器错误，请稍后重试');
              })
          }
        });
      },
    },
    created(){
      if(this.$route.query.dd_id && this.$route.query.dist ){
        this.$get( 'login',{dd_id:this.$route.query.dd_id,dist:this.$route.query.dist})
          .then( (data) => {
            if(data.code){
              let menu_list = data.content.menu_list;
              Cookies.set('access',menu_list.join(","));
              Cookies.set('user', data.content.nickname);
              Cookies.set('access_token', data.content.access_token);
              Cookies.set('department',data.content.department);
              Cookies.set('avatar',data.content.avatar);
              Cookies.set('approval','dist');
              Cookies.set('order_id',this.$route.query.order_id);
              Cookies.set('log_id',this.$route.query.log_id);
              this.$router.push({
                path: '/approval'
              });
            } else {
              this.$router.push({
                name: 'login'
              });
            }
          })
          .catch(() => {
            this.$message.error('服务器错误，请稍后重试');
          })
      }
    }
  };
</script>
<style scoped>
  .ivu-card-body{
    padding-bottom: 5px !important;
  }
  .ivu-card{
    height: 315px !important;
  }
</style>
