项目介绍
CRM

软件架构
CRM 客户管理系统

安装教程
npm clone https://gitee.com/Aselfimpr/pc_vue.git
npm install
npm run dev
npm run build:dev （测试服编译）
npm run build:prod (正式服编译)
使用说明
xxxx
xxxx
xxxx
功能
登录/登出
模块
客户模块
项目模块
订单模块
工单模块
费用模块
brief模块
案例模块
系统设置
用户管理
角色管理
统计报表
收缩侧边栏
tag标签导航
面包屑导航
全屏/退出全屏
锁屏
个人中心
文件结构
.
├── build  项目构建配置
└── src
    ├── images  图片文件
    ├── libs  工具方法
    ├── router  路由配置
    ├── store  状态管理
    ├── styles  样式文件
    ├── template  模板文件
    ├── vendors  公共库文件
    └── views
        ├── home  首页
        │   ├── components  首页组件
        ├── main_components  Main组件
        │   ├── lockscreen  锁屏
        │   ├── shrinkable-menu  可收缩菜单
        │   └── theme-switch  主题切换
        ├── crmManagement  业务组件
        │   ├── customer  客户模块
        │   ├── item  项目模块
        │   ├── order 订单模块
        │   ├── executiveManamement  工单模块
        │   ├── taskadmin  brief模块
        │   ├── salesReport 统计报表
        │   
        ├── own-space  个人中心
        

#### 码云特技

1. 使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2. 码云官方博客 [blog.gitee.com](https://blog.gitee.com)
3. 你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解码云上的优秀开源项目
4. [GVP](https://gitee.com/gvp) 全称是码云最有价值开源项目，是码云综合评定出的优秀开源项目
5. 码云官方提供的使用手册 [http://git.mydoc.io/](http://git.mydoc.io/)
6. 码云封面人物是一档用来展示码云会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)