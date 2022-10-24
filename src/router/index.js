import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: resolve => require(['@/page/login/index.vue'], resolve),
      meta: {
        auth: true,
        requiresAuth: true
      }
    },
    {
      path: '/',
      name: 'main',
      component: resolve => require(['@/components/Main/index.vue'], resolve),
      children: [
        {
          path: '/pages/home',
          name: 'home',
          component: resolve => require(['@/page/home/index.vue'], resolve)
        },
        {
          path: '/pages/personalCenter',
          name: 'personalCenter',
          component: resolve => require(['@/page/personalCenter/index.vue'], resolve)
        },
        {
          path: '/pages/passwordMod',
          name: 'passwordMod',
          component: resolve => require(['@/page/passwordMod/index.vue'], resolve)
        },
        {
          path: '/pages/units',
          name: 'units',
          component: resolve => require(['@/page/units/index.vue'], resolve)
        },
        {
          path: '/pages/carYard',
          name: 'carYard',
          component: resolve => require(['@/page/carYard/index.vue'], resolve)
        },
        {
          path: '/pages/parking',
          name: 'parking',
          component: resolve => require(['@/page/parking/index.vue'], resolve)
        },
        {
          path: '/pages/rules',
          name: 'rules',
          component: resolve => require(['@/page/rules/index.vue'], resolve)
        },
        {
          path: '/pages/device',
          name: 'device',
          component: resolve => require(['@/page/device/index.vue'], resolve)
        },
        {
          path: '/pages/ticket',
          name: 'ticket',
          component: resolve => require(['@/page/ticket/index.vue'], resolve)
        },
        {
          path: '/pages/feeCollector',
          name: 'feeCollector',
          component: resolve => require(['@/page/feeCollector/index.vue'], resolve)
        },
        {
          path: '/pages/carOwner',
          name: 'carOwner',
          component: resolve => require(['@/page/carOwner/index.vue'], resolve)
        },
        {
          path: '/pages/cashCoupon',
          name: 'cashCoupon',
          component: resolve => require(['@/page/cashCoupon/index.vue'], resolve)
        },
        {
          path: '/pages/monthCard',
          name: 'monthCard',
          component: resolve => require(['@/page/monthCard/index.vue'], resolve)
        },
        {
          path: '/pages/whiteList',
          name: 'whiteList',
          component: resolve => require(['@/page/whiteList/index.vue'], resolve)
        },
        {
          path: '/pages/blackList',
          name: 'blackList',
          component: resolve => require(['@/page/blackList/index.vue'], resolve)
        },
        {
          path: '/pages/receiptsRecord',
          name: 'receiptsRecord',
          component: resolve => require(['@/page/receiptsRecord/index.vue'], resolve)
        },
        {
          path: '/pages/feeCollectorRecord',
          name: 'feeCollectorRecord',
          component: resolve => require(['@/page/feeCollectorRecord/index.vue'], resolve)
        },
        {
          path: '/pages/account',
          name: 'account',
          component: resolve => require(['@/page/account/index.vue'], resolve)
        },
        {
          path: '/pages/realTimePark',
          name: 'realTimePark',
          component: resolve => require(['@/page/realTimePark/index.vue'], resolve)
        },
        {
          path: '/pages/parkingRecord',
          name: 'parkingRecord',
          component: resolve => require(['@/page/parkingRecord/index.vue'], resolve)
        },
        {
          path: '/pages/payAnalysis',
          name: 'payAnalysis',
          component: resolve => require(['@/page/payAnalysis/index.vue'], resolve)
        },
        {
          path: '/pages/userManage',
          name: 'userManage',
          component: resolve => require(['@/page/userManage/index.vue'], resolve)
        },
        {
          path: '/pages/roleManage',
          name: 'roleManage',
          component: resolve => require(['@/page/roleManage/index.vue'], resolve)
        },
        {
          path: '/pages/menuManage',
          name: 'menuManage',
          component: resolve => require(['@/page/menuManage/index.vue'], resolve)
        },
        {
          path: '/pages/messageCenter',
          name: 'messageCenter',
          component: resolve => require(['@/page/messageCenter/index.vue'], resolve)
        },
        {
          path: '/pages/dictionary',
          name: 'dictionary',
          component: resolve => require(['@/page/dictionary/index.vue'], resolve)
        },
        {
          path: '/pages/operationLog',
          name: 'operationLog',
          component: resolve => require(['@/page/operationLog/index.vue'], resolve)
        }
      ]
    },
    {
      path: '/page404',
      name: 'page404',
      component: resolve => require(['@/page/page404/index.vue'], resolve)
    },
    {
      path: '*',
      redirect: {
        name: 'page404'
      }
    }
  ]
})
