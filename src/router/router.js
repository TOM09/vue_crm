import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const approvalRouter = {
    path: '/approval',
    name: 'approval',
    meta: {
        title: '审批'
    },
        component: resolve => {
            require(['@/views/crmManagement/approvalMobile/approval.vue'], resolve);
        }
};

export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['@/views/login.vue'], resolve); }
};
export const locking = {
    path: '/locking',
    name: 'locking',
    component: resolve => { require(['@/views/main-components/lockscreen/components/locking-page.vue'], resolve); }
};
// export const locking = {
//     path: '/hellow',
//     name: 'hellow',
//     component: resolve => {
//         require(['@/views/hellow.vue'], resolve);
//     }
// };

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    component: Main,
    children: [
        {
          path: 'home',
          title: '首页',
          name: 'home_index',
          component: resolve => { 
              require(['@/views/home/home.vue'], resolve)
            }
        },
        {
          path: 'ownspace',
          title: '个人中心',
          name: 'ownspace_index',
          component: resolve => { 
              require(['@/views/own-space/own-space.vue'], resolve)
            }
        },
        {
          path: 'clientDetails/:id',
          title: '客户详情',
          name: 'clientDetail',
          component: resolve => { 
              require(['@/views/crmManagement/customer/clientDetails.vue'], resolve)
            }
        },
         {
             path: 'facilitator/:id',
             title: '服务商详情',
             name: 'facilitator',
             component: resolve => {
                 require(['@/views/crmManagement/facilitator/facilitatorDetails.vue'], resolve)
             }
         },
        {
          path: 'itemDetails/:id',
          title: '项目详情',
          name: 'itemDetail',
          component: resolve => { 
              require(['@/views/crmManagement/item/itemDetails.vue'], resolve)
            }
        },
        {
          path: 'order/:id',
          title: '订单详情',
          name: 'orderDetail',
          component: resolve => { 
              require(['@/views/crmManagement/order/orderDetails.vue'], resolve)
            }
        },
        {
          path: 'workInfo',
          title: '工单详情',
          name: 'workInfo',
          component: resolve => { 
              require(['@/views/crmManagement/executiveManagement/workInfo.vue'], resolve)
            }
        },
        {
          path: 'taskDtails/:id',
          title: 'Brief详情',
          name: 'taskDetail',
          component: resolve => { 
              require(['@/views/crmManagement/taskadmin/taskDtails.vue'], resolve)
            }
        },
        {
          path: 'caseDtails/:id',
          title: '案例详情',
          name: 'caseDetail',
          component: resolve => { 
              require(['@/views/crmManagement/case/caseDtails.vue'], resolve)
            }
        },
        {
          path: 'reportDtails/:id',
          title: '报告详情',
          name:'reportDtails',
          component: resolve => { 
              require(['@/views/crmManagement/workReport/reportDetails.vue'], resolve);
            }
        },
        {
          path: 'expensesDetail/:id',
          title: '费用详情',
          name: 'expensesDetail',
          component: resolve => { 
              require(['@/views/crmManagement/expenses/expensesDetail.vue'], resolve);
            }
        },
        {
          path: 'inquiryDetail/:id',
          title: '咨询详情',
          name: 'inquiryDetail',
          component: resolve => { 
              require(['@/views/crmManagement/inquiry/inquiryDetails.vue'], resolve);
            }
        },
        {
            path: 'royaltyDetail/:id',
            title: '提成比例详情',
            name: 'royaltyDetail',
            component: resolve => {
                require(['@/views/crmManagement/royaltyRatio/royaltyDetail.vue'], resolve);
            }
        },
        {
            path: 'userDetails/:id',
            icon: '',
            title: '用户详情',
            name: 'userDetails',
            component: resolve => { 
                require(['@/views/crmManagement/userAdmin/userDetails.vue'], resolve); 
            }
        },
        {
            path: 'rolesDetails/:id',
            icon: '',
            title: '角色详情',
            name: 'rolesDetails',
            component: resolve => { 
                require(['@/views/crmManagement/roles/rolesDetails.vue'], resolve);
            }
        },
        {
            path: 'messageDetails/:id',
            title: '留言详情',
            name: 'messageDetail',
            component: resolve => { 
                require(['@/views/crmManagement/clientMessage/messageDetails.vue'], resolve)
            }
        },
    ]
};
// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
      path: '/inquiryManage',
      icon: 'person-stalker',
      name: 'inquiryManage',
      title: '咨询管理',
      component: Main,
      children: [
        {
          path: 'addInquiry',
          icon: '',
          title: '新增咨询',
          name: 'addInquiry',
          component: resolve => { require(['@/views/crmManagement/inquiry/addInquiry.vue'], resolve); }
        },
        {
          path: 'inquiryList',
          icon: '',
          title: '咨询列表',
          name: 'inquiryList',
          component: resolve => { require(['@/views/crmManagement/inquiry/inquiryList.vue'], resolve); }
        },
        {
          path: 'messageList',
          icon: '',
          title: '留言列表',
          name: 'messageList',
          component: resolve => { require(['@/views/crmManagement/clientMessage/messageList.vue'], resolve); }
        }
        , {
            path: 'messageList2',
            icon: '',
            title: '留言列表2',
            name: 'messageList2',
            component: resolve => {
                require(['@/views/crmManagement/clientMessage/messageList2.vue'], resolve);
            }
        }
      ]
    },
    {
      path: '/clientManage',
      icon: 'person-stalker',
      name: 'client',
      title: '客户管理',
      component: Main,
      children: [
        {
          path: 'newClient',
          icon: '',
          title: '新增客户',
          name: 'newClient',
          component: resolve => { require(['@/views/crmManagement/customer/newClient.vue'], resolve); }
        },

        {
          path: 'clientList',
          icon: '',
          title: '客户列表',
          name: 'clientList',
          component: resolve => { require(['@/views/crmManagement/customer/clientList.vue'], resolve); }
        }
      ]
    },
    {
      path: '/workOrderManage',
      icon: 'ios-compose',
      name: 'carriedManagement',
      title: '执行管理',
      component: Main,
      children: [
        {
          path: 'workOrder',
          icon: '',
          title: '成单执行列表',
          name: 'workOrder',
          component: resolve => { 
              require(['@/views/crmManagement/executiveManagement/workOrderList.vue'], resolve); 
            }
        },
         {
            path: 'PresaleWorkOrderList',
            icon: '',
            title: '售前调用列表',
            name: 'PresaleWorkOrderList',
            component: resolve => {
                require(['@/views/crmManagement/executiveManagement/PresaleWorkOrderList.vue'], resolve);
            }
        }
      ]
    },
    {
      path: '/itemManage',
      icon: 'ios-briefcase',
      name: 'itemManagement',
      title: '项目管理',
      component: Main,
      children: [
        {
          path: 'consultList',
          icon: '',
          title: '咨询分单列表',
          name: 'consultList',
          component: resolve => { require(['@/views/crmManagement/item/consultList.vue'], resolve); }
        },
        {
          path: 'folowUpList',
          icon: '',
          title: '咨询跟进列表',
          name: 'folowUpList',
          component: resolve => { require(['@/views/crmManagement/item/folowUpList.vue'], resolve); }
        },
        {
          path: '/addItem',
          icon: '',
          title: '新增项目',
          name: 'addItem',
          component: resolve => { require(['@/views/crmManagement/item/addItem.vue'], resolve); }
        },
        {
          path: 'itemList',
          icon: '',
          title: '项目列表',
          name: 'itemList',
          component: resolve => { require(['@/views/crmManagement/item/itemList.vue'], resolve); }
        },
      ]
    },
    {
      path: '/orderManage',
      icon: 'ios-bookmarks',
      name: 'order',
      title: '销售订单',
      component: Main,
      children: [
        {
          path: 'addorder',
          icon: '',
          title: '新增订单',
          name: 'addOrder',
          component: resolve => { require(['@/views/crmManagement/order/addorder.vue'], resolve); }
        },
        {
          path: 'orderList',
          icon: '',
          title: '订单列表',
          name: 'orderList',
          component: resolve => { require(['@/views/crmManagement/order/orderList.vue'], resolve); }
        }
      ]
    },
    // 提成比例
   {
    path: '/RoyaltyRatioManage',
    icon: 'ios-bookmarks',
    name: 'RoyaltyRatioManage',
    title: '提成比例',
    component: Main,
    children: [
        {
            path: 'addRoyaltyRatio',
            icon: '',
            title: '新增提成比例',
            name: 'addRoyaltyRatio',
            component: resolve => {
                require(['@/views/crmManagement/royaltyRatio/addRoyaltyRatio.vue'], resolve);
            }
        },
        {
            path: 'RoyaltyRatioList',
            icon: '',
            title: '提成比例列表',
            name: 'RoyaltyRatioList',
            component: resolve => {
                require(['@/views/crmManagement/royaltyRatio/RoyaltyRatio.vue'], resolve);
            }
        }
    ]
    },
    {
        path: '/briefManage',
        icon: 'ios-toggle',
        name: 'crmManagement',
        title: 'Brief管理',
        component: Main,
        children: [
            {
                path: 'addTask',
                icon: '',
                title: '添加Brief',
                name: 'addTask',
                component: resolve => { require(['@/views/crmManagement/taskadmin/addTask.vue'], resolve); }
            },
            {
                path: 'taskList',
                icon: '',
                title: 'Brief列表',
                name: 'taskList',
                component: resolve => { require(['@/views/crmManagement/taskadmin/taskList.vue'], resolve); }
            },
        ]
    },
    {
        path: '/workManage',
        icon: 'ios-compose',
        name: 'workReport',
        title: '工作报告',
        component: Main,
        children: [
            {
                path: 'writeReport',
                icon: '',
                title: '写报告',
                name: 'writeReport',
                component: resolve => { require(['@/views/crmManagement/workReport/writeReport.vue'], resolve); }
            },
            {
                path: 'reportList',
                icon: '',
                title: '报告列表',
                name: 'reportList',
                component: resolve => { require(['@/views/crmManagement/workReport/reportList.vue'], resolve); }
            },
        ]
    },
    {
        path: '/casesManage',
        icon: 'ios-bookmarks',
        name: 'case',
        title: '案例管理',
        component: Main,
        children: [
            {
                path: 'addCase',
                icon: '',
                title: '新增案例',
                name: 'addCase',
                component: resolve => { require(['@/views/crmManagement/case/addCase.vue'], resolve); }
            },
            {
                path: 'addCaseOrder',
                icon: '',
                title: '新增案例（关联工单）',
                name: 'addCaseOrder',
                component: resolve => { require(['@/views/crmManagement/case/addCaseOrder.vue'], resolve); }
            },
            {
                path: 'caseList',
                icon: '',
                title: '案例列表',
                name: 'caseList',
                component: resolve => { require(['@/views/crmManagement/case/caseList.vue'], resolve); }
            },
        ]
      },
     {
         path: '/facilitatorManage',
         icon: 'ios-bookmarks',
         name: 'facilitatorManage',
         title: '服务商管理',
         component: Main,
         children: [{
                 path: 'addFacilitator',
                 icon: '',
                 title: '新增服务商',
                 name: 'addFacilitator',
                 component: resolve => {
                     require(['@/views/crmManagement/facilitator/addFacilitator.vue'], resolve);
                 }
             },
             {
                 path: 'facilitatorList',
                 icon: '',
                 title: '服务商列表',
                 name: 'facilitatorList',
                 component: resolve => {
                     require(['@/views/crmManagement/facilitator/facilitatorList.vue'], resolve);
                 }
             }
         ]
     },
    {
        path: '/expensesManage',
        icon: 'ios-bookmarks',
        name: 'expenses',
        title: '费用管理',
        component: Main,
        children: [
            {
                path: 'addExpenses',
                icon: '',
                title: '新增费用',
                name: 'addExpenses',
                component: resolve => { require(['@/views/crmManagement/expenses/addExpenses.vue'], resolve); }
            },
            {
                path: 'expensesList',
                icon: '',
                title: '费用列表',
                name: 'expensesList',
                component: resolve => { require(['@/views/crmManagement/expenses/expensesList.vue'], resolve); }
            },
        ]
    },
    {
        path: '/salesManage',
        icon: 'ios-toggle',
        name: 'sales',
        title: '报表统计',
        component: Main,
        children: [
            {
                path: 'sales',
                icon: '',
                title: '销售日报',
                name: 'salesDay',
                component: resolve => { require(['@/views/crmManagement/salesReport/sales.vue'], resolve); }
            },
            {
                path: 'working',
                icon: '',
                title: '工时统计报表',
                name: 'workingHS',
                component: resolve => { require(['@/views/crmManagement/salesReport/WHS.vue'], resolve); }
            },
            {
                path: 'repayments',
                icon: '',
                title: '回款统计报表',
                name: 'repaymentsHS',
                component: resolve => { require(['@/views/crmManagement/salesReport/repayments.vue'], resolve); }
            },
            {
                path:'orderIncome',
                icon:'',
                title:'订单收支报表',
                name:'orderIncome',
                component: resolve => { require(['@/views/crmManagement/salesReport/orderIncome.vue'], resolve); }
            },
            {
                path:'PreSale',
                icon:'',
                title:'售前跟进日报',
                name:'PreSale',
                component: resolve => { require(['@/views/crmManagement/salesReport/PreSale.vue'], resolve); }
            },
            {
              path:'consultFollow',
              icon:'',
              title:'咨询跟进报表',
              name:'consultFollow',
              component: resolve => { require(['@/views/crmManagement/salesReport/consultFollow.vue'], resolve); }
            },
            {
                path: 'transferRecord',
                icon: '',
                title: '转单记录报表',
                name: 'transferRecord',
                component: resolve => { require(['@/views/crmManagement/salesReport/transferRecord.vue'], resolve); }
            },
            {
                path: 'finalizationReport',
                icon: '',
                title: '执行明细报表',
                name: 'finalizationReport',
                component: resolve => { require(['@/views/crmManagement/salesReport/finalizationReport.vue'], resolve); }
            }
        ]
    },
    {
        path: '/setupManage',
        icon: 'ios-bookmarks',
        name: 'systemSetup',
        title: '系统设置',
        component: Main,
        children: [
            {
                path: 'rolesDept',
                icon: '',
                title: '部门与角色对应',
                name: 'rolesDept',
                component: resolve => { require(['@/views/crmManagement/systemSetup/roles.vue'], resolve); }
            },
            {
                path: 'organization',
                icon: '',
                title: '组织管理',
                name: 'organization',
                component: resolve => { require(['@/views/crmManagement/systemSetup/organization.vue'], resolve); }
            },
            {
                path: 'saleManageConfig',
                icon: '',
                title: '工单配置',
                name: 'saleManageConfig',
                component: resolve => { require(['@/views/crmManagement/systemSetup/saleManageConfig.vue'], resolve); }
            },
            {
                path: 'loginJournal',
                icon: '',
                title: '登录日志',
                name: 'loginJournal',
                component: resolve => { require(['@/views/crmManagement/systemSetup/loginLog.vue'], resolve); }
            },
        ]
    },
    {
        path: '/usersManage',
        icon: 'ios-bookmarks',
        name: 'userAdmin',
        title: '用户管理',
        component: Main,
        children: [
            {
                path: 'addUser',
                icon: '',
                title: '新建用户',
                name: 'addUser',
                component: resolve => { require(['@/views/crmManagement/userAdmin/addUser.vue'], resolve); }
            },
            {
                path: 'userList',
                icon: '',
                title: '用户列表',
                name: 'userList',
                component: resolve => { require(['@/views/crmManagement/userAdmin/userList.vue'], resolve); }
            },
        ]
    },
    {
        path: '/rolesManage',
        icon: 'ios-bookmarks',
        name: 'roles',
        title: '角色管理',
        component: Main,
        children: [
            {
                path: 'addRoles',
                icon: '',
                title: '新建角色',
                name: 'addRoles',
                component: resolve => { require(['@/views/crmManagement/roles/addRoles.vue'], resolve); }
            },
            {
                path: 'rolesList',
                icon: '',
                title: '角色列表',
                name: 'rolesList',
                component: resolve => { require(['@/views/crmManagement/roles/rolesList.vue'], resolve); }
            },

        ]
    },
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    approvalRouter,
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
];
