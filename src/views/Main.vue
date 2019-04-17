<style lang="less">
  @import "./main.less";
  .ivu-avatar{
    background: #4380ff !important;
    margin-left: 5px;
  }
  .ivu-avatar-string{
    left: calc(50% - 15px) !important;
  }
</style>
<template>
  <div class="main" :class="{'main-hide-text': shrink}">

    <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
      <shrinkable-menu
          :shrink="shrink"
          @on-change="handleSubmenuChange"
          :theme="menuTheme"
          :before-push="beforePush"
          :open-names="openedSubmenuArr"
          :menu-list="menuList">
        <div slot="top" class="logo-con">
          <img v-show="!shrink"  src="../images/logo.png" key="max-logo" />
          <img v-show="shrink" src="../images/logo-min.png" key="min-logo" />
        </div>
      </shrinkable-menu>
    </div>
    
    <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
      <div class="main-header">
        <div class="navicon-con">
          <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
            <Icon type="navicon" size="32"></Icon>
          </Button>
        </div>
        <div class="header-middle-con">
          <div class="main-breadcrumb">
            <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
          </div>
        </div>
        <div class="header-avator-con">
            <span style="color:#4380ff;font-weight: 600">如有问题，请联系杨秋萍（18519331339）/ 聂宁芳（13821519981）</span>
            <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
            <lock-screen></lock-screen>
            <switch-organ style="display: inline;"></switch-organ>
            <div class="user-dropdown-menu-con" style="display: inline-block">
              <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                  <a href="javascript:void(0)">
                    <Avatar v-if="this.avatar" :src="this.avatar" style="background: #4380ff;"></Avatar>
                    <Avatar v-else>{{ userName[0] }}</Avatar>
                    <Icon type="arrow-down-b"></Icon>
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem name="ownSpace">个人中心</DropdownItem>
                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                  </DropdownMenu>
                </Dropdown>

              </Row>
            </div>
        </div>
      </div>
      <div class="tags-con">
        <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
      </div>
    </div>

    <div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
      <div class="single-page">
        <keep-alive :include="cachePage">
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
  </div>
</template>
<script>
  import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu';
  import tagsPageOpened from './main-components/tags-page-opened'; //关闭所有
  import breadcrumbNav from './main-components/breadcrumb-nav';
  import fullScreen from './main-components/fullscreen';
  import lockScreen from './main-components/lockscreen/lockscreen';
  import switchOrgan from './main-components/switchorgan';
  import Cookies from 'js-cookie';
  import util from '@/libs/util.js';
  export default {
    components: {
      shrinkableMenu,
      tagsPageOpened,
      breadcrumbNav,
      fullScreen,
      lockScreen,
      switchOrgan
    },
    data () {
      return {
        shrink: false,
        userName: '',
        mesCount: 3,
        isFullScreen: false,
        openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
        avatar:"",
      };
    },
    computed: {
      addInquiry () {
        return this.$store.state.app.inquiry;
      },
      menuList () {
        return this.$store.state.app.menuList;        // 导航菜单
      },
      //通过计算属性得到的菜单列表
      pageTagsList () {
        return this.$store.state.app.pageOpenedList;  // 打开的页面的页面对象
      },
      currentPath () {
        return this.$store.state.app.currentPath;  // 当前面包屑数组
      },
      cachePage () {
        // console.log(this.$store.state.app.cachePage);
        return this.$store.state.app.cachePage;
      },
      lang () {
        return this.$store.state.app.lang;
      },
      menuTheme () {
        return this.$store.state.app.menuTheme;
      }
    },
    methods: {
      init () {
        let pathArr = util.setCurrentPath(this, this.$route.name);
        if (pathArr.length >= 2) {
          this.$store.commit('addOpenSubmenu', pathArr[1].name);
        }
        this.userName = Cookies.get('user');
        this.avatar = Cookies.get('avatar');
        let messageCount = 3;
        this.messageCount = messageCount.toString();
        this.checkTag(this.$route.name);
      },
      toggleClick () {
        this.shrink = !this.shrink;
      },
      handleClickUserDropdown (name) {
        if (name === 'ownSpace') {
          util.openNewPage(this, 'ownspace_index');
          this.$router.push({
            name: 'ownspace_index'
          });
        } else if (name === 'loginout') {
          // 退出登录
          this.$message({
            message: "退出登录成功",
            type: 'success'
          });
          this.$store.commit('logout', this);
          this.$store.commit('clearOpenedSubmenu');
          this.$router.push({
            name: 'login'
          });
        }
      },
      checkTag (name) {
        let openpageHasTag = this.pageTagsList.some(item => {
          if (item.name === name) {
            util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
            return true;
          }
        });
        if (!openpageHasTag) {  //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
          util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
        }
      },
      handleSubmenuChange (val) {
        if(val !== 'addInquiry'){
          this.$store.commit('delInquiry','addInquiry');
        }else if(val == 'addInquiry') {
          this.$store.commit('addInquirys','addInquiry');
        }
      },
      beforePush (name) {
        if (name === 'accesstest_index') {
          return false;
        } else {
          return true;
        }
      },
      fullscreenChange (isFullScreen) {
      }
    },
    watch: {
      '$route' (to) {
        this.$store.commit('setCurrentPageName', to.name);
        let pathArr = util.setCurrentPath(this, to.name);
        if (pathArr.length > 2) {
          this.$store.commit('addOpenSubmenu', pathArr[1].name);
        }
        this.checkTag(to.name);
        localStorage.currentPageName = to.name;
      },
      lang () {
        util.setCurrentPath(this, this.$route.name);  // 在切换语言时用于刷新面包屑
      }
    },
    mounted () {
      this.init();
    },
    created () {
      // 显示打开的页面的列表
      this.$store.commit('setOpenedList');
    }
  };
</script>
