<style lang="less">
    @import './styles/menu.less';
</style>

<template>
    <div class="ivu-shrinkable-menu">
        <slot name="top"></slot>
        <div type="primary" class="s_client" v-show="!shrink">
            <Icon type="cube" style="margin-right: 20px;font-size: 30px;color:white;"></Icon>
            <span class="s_btn">个人工作台</span>
        </div>
        <sidebar-menu
            v-show="!shrink"
            :menu-theme="theme"
            :menu-list="menuList"
            :open-names="openNames"
            @on-change="handleChange">

        </sidebar-menu>
        <sidebar-menu-shrink
            v-show="shrink"
            :menu-theme="theme"
            :menu-list="menuList"
            @on-change="handleChange">
        </sidebar-menu-shrink>
    </div>
</template>

<script>
import sidebarMenu from './components/sidebarMenu.vue';
import sidebarMenuShrink from './components/sidebarMenuShrink.vue';
import util from '@/libs/util';
export default {
    name: 'shrinkableMenu',
    components: {
        sidebarMenu,
        sidebarMenuShrink
    },
    props: {
        shrink: {
            type: Boolean,
            default: false
        },
        menuList: {
            type: Array,
            required: true
        },
        theme: {
            type: String,
            default: 'dark',
            validator (val) {
                return util.oneOf(val, ['dark', 'light']);
            }
        },
        beforePush: {
            type: Function
        },
        openNames: {
            type: Array
        }
    },
    computed: {
        bgColor () {
            return this.theme === 'dark' ? '#495060' : '#495060';
        }
    },
    methods: {
        handleChange (name) {
            let willpush = true;
            if (this.beforePush !== undefined) {
                if (!this.beforePush(name)) {
                    willpush = false;
                }
            }
            if (willpush) {
                this.$router.push({
                    name: name
                });
                util.openNewPage(this, name);
            }
            this.$emit('on-change', name);
        }
    }
};
</script>

<style>
    .s_btn{
        position: relative;
        top: -7px;
        color: white;
    }
    .s_client {
        text-align: center;
        width:100%;
        height: 60px;
        line-height: 77px;
        background: -webkit-linear-gradient(left, #f86d68 , #ff2d55);
    }
</style>
