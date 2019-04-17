<template>
  <div style="line-height: 60px;">
    <el-dropdown @command="handleCommand" trigger="click">
      <span class="el-dropdown-link">
        {{company_name}} - {{userName}}<i class="el-icon-arrow-down el-icon--right" style="color: #4380ff;"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="item in company" :key="item.company_id" :command="item.company_id">
          {{item.company_name}}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import Cookies from 'js-cookie';
  export default {
    name: "switch-organ",
    data () {
      return {
        ruleForm: {
          username: Cookies.get('userName'),
          password: Cookies.get('password'),
          company_id: ''
        },
        company: [],
        company_name: '',
        userName: '',
        avatar: '',
      }
    },
    created () {
      this.init();
    },
    methods: {
      init () {
        this.userName = Cookies.get('user');
        this.avatar = Cookies.get('avatar');
        this.company = JSON.parse(Cookies.get('company_info') ? Cookies.get('company_info') : "");
        this.company_name = this.company.find((ele) => {
          return ele.company_id == Cookies.get('company_id')
        }).company_name
      },
      handleCommand(command) {
        if(command != Cookies.get('company_id')) {
          this.ruleForm.company_id = command;
          this.$get('login',this.ruleForm)
            .then((data) => {
              if(data.code){
                this.$store.commit('clearOpenedSubmenu');
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
                  this.$store.commit('setAvator', data.content.avatar);
                  this.init();
                  this.$message({
                    message: "切换成功",
                    type: 'success'
                  });
                  this.$store.dispatch('dept',{});
                  this.$store.commit('updateMenulist');
                  this.$store.commit('initCachepage');
                  this.$store.commit('clearAllTags');
                  this.$get('consult/search')
                    .then((data) => {
                      localStorage.setItem('consultSearch', JSON.stringify(data.content));
                    }).catch(() => {});
                  if(this.$route.name === 'home_index') {
                    this.$router.go(0);
                  } else {
                    this.$router.push({
                      name: 'home_index'
                    })
                  }
                }
              } else {
                this.$message.error(data.errorMsg);
              }
            })
            .catch(() => {})
        }
      }
    }
  }
</script>

<style scoped>
  .el-dropdown-link {
    cursor: pointer;
    font-size: 12px;
    /*color: rgb(67, 128, 255);*/
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>