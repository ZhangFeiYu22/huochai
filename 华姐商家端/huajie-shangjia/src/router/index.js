import Vue from 'vue'
import Router from 'vue-router'
import {
  setToken,
  getToken
} from '@/utils/auth.js'
const _import = require('./_import_' + process.env.NODE_ENV);

Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/',
      name: '',
      component: _import('Login/login')
    },
    {
      path: '/home',
      name: 'home',
      meta: {
        title: '详情',
        requireAuth: true //添加改字段,表示进入这个路由是需要登录的
      },
      component: _import('Home/home')
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '详情'
      },
      component: _import('Login/login')
    },
  ]
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  console.log('全局前置守卫')
  if (to.meta.requireAuth) {
    if (getToken()) {
      next();
    } else {
      if (/login/.test(to.path)) {
        next();
      } else {
        next('/login');
      }
    }
  }else{
    next()
  }
});

export default router
