import Vue from 'vue'
import Router from 'vue-router'
import {
  setToken,
  getToken
} from '@/utils/auth.js'
const _import = require('./_import_' + process.env.NODE_ENV);

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: '',
      component: _import('Login/login')
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录'
      },
      component: _import('Login/login')
    },
    {
      path: '/mainIndex',
      name: 'mainIndex',
      meta: {
        title: '菜单主页',
        requireAuth: true //添加改字段,表示进入这个路由是需要登录的
      },
      component: _import('Main/mainIndex')
    },
    {
      path: '/switchShops',
      name: 'switchShops',
      meta: {
        title: '切换店铺',
        requireAuth: true //添加改字段,表示进入这个路由是需要登录的
      },
      component: _import('SwitchShops/switchShops')
    },
    {
      path: '/setting',
      name: 'setting',
      meta: {
        title: '账号设置',
        requireAuth: true //添加改字段,表示进入这个路由是需要登录的
      },
      component: _import('Setting/setting')
    },
    {
      path: '/cancelDetail',
      name: 'cancelDetail',
      meta: {
        title: '核销详情',
        requireAuth: true //添加改字段,表示进入这个路由是需要登录的
      },
      component: _import('CancelDetail/cancelDetail')
    },
    {
      path: '/choiceOrder',
      name: 'choiceOrder',
      meta: {
        title: '精选订单',
        requireAuth: true //添加改字段,表示进入这个路由是需要登录的
      },
      component: _import('ChoiceOrder/choiceOrder')
    },
    {
      path: '/activityCounterfoil',
      name: 'activityCounterfoil',
      meta: {
        title: '活动票根',
        requireAuth: true //添加改字段,表示进入这个路由是需要登录的
      },
      component: _import('ActivityCounterfoil/activityCounterfoil')
    }

  ]
})

// 全局前置守卫
// router.beforeEach((to, from, next) => {
//   console.log('全局前置守卫')
//   if (to.meta.requireAuth) {
//     if (getToken()) {
//       next();
//     } else {
//       if (/login/.test(to.path)) {
//         next();
//       } else {
//         next('/login');
//       }
//     }
//   } else {
//     next()
//   }
// });

export default router
