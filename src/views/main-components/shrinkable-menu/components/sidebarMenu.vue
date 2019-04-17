<style lang="less">
  @import '../styles/menu.less';
  .ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-vertical .ivu-menu-submenu-title:hover{
    background: #fff !important;
  }
  .ivu-menu-vertical .ivu-menu-submenu-title-icon{
    color:#ff2d55;
  }
  .menuTheme{
    color: #657180;
  }
  .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
    color: rgb(255, 44, 85) !important;
    z-index: 2 !important;
    box-shadow: rgba(248, 109, 104, 0.23) 0px 4px 20px -3px !important;
    border-right: 2px solid rgb(255, 255, 255) !important;
  }
</style>

<template>
  <Menu ref="sideMenu" :active-name="$route.name" :open-names="openNames" class="menuTheme" width="auto" @on-select="changeMenu">
    <template v-for="item in menuList">
      <!-- <MenuItem v-if="item.children.length<=1" :name="item.children[0].name" :key="'menu_' + item.path">
          <Icon :type="item.icon" :size="iconSize" :key="'menuIcon_' + item.path" color="#ff2d55"></Icon>
          <span class="layout-text" :key="'menuSpan_' + item.path">{{ itemTitle(item) }}</span>
      </MenuItem> -->
      <Submenu  :name="item.name" :key="item.path">
        <template slot="title">
          <Icon :type="item.icon" :size="iconSize" color="#ff2d55"></Icon>
          <span class="layout-text">{{item.title}}</span>
        </template>
        <template v-for="child in item.children">
          <MenuItem :name="child.name" :key="'submenu_' + child.name">
            <Icon :type="child.icon" :size="iconSize" :key="'submenuIcon_' + child.name" color="#ff2d55"></Icon>
            <span class="layout-text" :key="'submenuSpan_' + child.name">{{ child.title }}</span>
          </MenuItem>
        </template>
      </Submenu>
    </template>
  </Menu>
</template>

<script>
  export default {
    name: 'sidebarMenu',
    props: {
      menuList: Array,
      iconSize: Number,
      openNames: {
        type: Array
      }
    },
    methods: {
      /*handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },*/
      changeMenu (active) {
        //子组件向父组件传递东西
        this.$emit('on-change', active);
      },
      /*itemTitle (item) {
        if (typeof item.title === 'object') {
          return this.$t(item.title);
        } else {
          return item.title;
        }
      }*/
    },
    updated () {
      this.$nextTick(() => {
        if (this.$refs.sideMenu) {
          this.$refs.sideMenu.updateOpened();
        }
      });
    },
  };
</script>
