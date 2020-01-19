import Vue from 'vue'
import Router from 'vue-router'

import Home from 'views/home/home'
import IndexPage from 'views/workBench/DaskBoard'
import Menu from 'views/systemSetting/menu/menu'
import Datadictionary from 'views/systemSetting/datadictionary/datadictionary'
import Permission from 'views/systemSetting/permission/permission'
import Role from 'views/systemSetting/role/role'
import User from 'views/systemSetting/user/user'
import Organiz from 'views/organizationalStructure/organiz/organiz'
import InSetting from 'views/organizationalStructure/inte-setting/in-setting'
import PersonalM from 'views/organizationalStructure/personalM/personalM'
import Login from 'views/login/login'

import HomePageM from 'views/linWW/homePageM'
import AdM from 'views/linWW/adM'
import ActivityM from 'views/linWW/activityM'
import ActivityKindsM from 'views/linWW/activityKindsM'
import RecommendM from 'views/linWW/recommendM'
import CommunityM from 'views/linWW/communityM'
import HotelM from 'views/linWW/hotelM'
import CouponM from 'views/linWW/couponM'
import ServiceM from 'views/linWW/serviceM'
import LifeServiceM from 'views/linWW/lifeServiceM'
import MemberVipM from 'views/linWW/memberVipM'
import MemberVipCollectM from 'views/linWW/memberVipCollectM'
import ActivityOrdersM from 'views/linWW/activityOrdersM'
import CouponOrdersM from 'views/linWW/couponOrdersM'
import ServicePhotoM from 'views/linWW/servicePhotoM'
import CountData from 'views/linWW/countData'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      name: '首页',
      meta: {
        title: '首页'
      },
      iconCls: 'el-icon-setting',
      children: [
        {
          path: '/indexPage',
          name: '首页面板',
          meta: {
            title: '首页'
          },
          component: IndexPage
        }
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '系统设置',
      meta: {
        title: '系统设置'
      },
      iconCls: 'el-icon-setting',
      children: [
        {
          path: '/datadictionary',
          name: '数据字典',
          meta: {
            title: '数据字典'
          },
          component: Datadictionary
        },
        {
          path: '/menu',
          name: '菜单管理',
          meta: {
            title: '菜单管理'
          },
          component: Menu
        },
        {
          path: '/permission',
          name: '权限管理',
          meta: {
            title: '权限管理'
          },
          component: Permission
        },
        {
          path: '/role',
          name: '角色管理',
          meta: {
            title: '角色管理'
          },
          component: Role
        },
        {
          path: '/user',
          name: '用户管理',
          meta: {
            title: '用户管理'
          },
          component: User,
          children: [
            { path: ':id' }
          ]
        }
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '组织架构',
      meta: {
        title: '组织架构'
      },
      iconCls: 'el-icon-menu',
      children: [
        {
          path: '/organiz',
          name: '机构管理',
          meta: {
            title: '机构管理'
          },
          component: Organiz
        },
        {
          path: '/setting',
          name: '综合设置',
          meta: {
            title: '综合设置'
          },
          component: InSetting
        },
        {
          path: '/personalM',
          name: '人员管理',
          meta: {
            title: '人员管理'
          },
          component: PersonalM
        }

      ]
    },
    {
      path: '/home',
      component: Home,
      name: '邻窝窝',
      meta: {
        title: '邻窝窝'
      },
      iconCls: 'el-icon-menu',
      children: [
        {
          path: '/homePageM',
          name: '首页分类栏',
          meta: {
            title: '首页分类栏'
          },
          component: HomePageM
        },
        {
          path: '/adM',
          name: '广告管理',
          meta: {
            title: '广告管理'
          },
          component: AdM
        },
        {
          path: '/recommendM',
          name: '推荐管理',
          meta: {
            title: '推荐管理'
          },
          component: RecommendM
        },
        {
          path: '/activityKindsM',
          name: '活动分类',
          meta: {
            title: '活动分类'
          },
          component: ActivityKindsM
        },
        {
          path: '/activityM',
          name: '活动管理',
          meta: {
            title: '活动管理'
          },
          component: ActivityM
        },
        {
          path: '/activityOrdersM',
          name: '活动订单',
          meta: {
            title: '活动订单'
          },
          component: ActivityOrdersM
        },

        {
          path: '/communityM',
          name: '社区管理',
          meta: {
            title: '社区管理'
          },
          component: CommunityM
        }, {
          path: '/hotelM',
          name: '店家管理',
          meta: {
            title: '店家管理'
          },
          component: HotelM
        },
        {
          path: '/couponM',
          name: '代金券',
          meta: {
            title: '代金券'
          },
          component: CouponM
        },
        {
          path: '/couponOrdersM',
          name: '代金券订单',
          meta: {
            title: '代金券订单'
          },
          component: CouponOrdersM
        },
        {
          path: '/serviceM',
          name: '服务分类',
          meta: {
            title: '服务分类'
          },
          component: ServiceM
        },
        {
          path: '/lifeServiceM',
          name: '生活服务',
          meta: {
            title: '生活服务'
          },
          component: LifeServiceM
        },
        {
          path: '/memberVipM',
          name: '会员管理',
          meta: {
            title: '会员管理'
          },
          component: MemberVipM
        },
        {
          path: '/countData',
          name: '数据统计',
          meta: {
            title: '数据统计'
          },
          component: CountData
        },
        // {
        //   path: '/memberVipCollectM',
        //   name: '会员收藏',
        //   meta: {
        //     title: '会员收藏'
        //   },
        //   component: MemberVipCollectM
        // },
        // {
        //   path: '/servicePhotoM',
        //   name: '服务拨打电话记录',
        //   meta: {
        //     title: '服务拨打电话记录'
        //   },
        //   component: ServicePhotoM
        // }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/login')) {
    window.localStorage.removeItem('access-user')
    next()
  } else {
    let user = JSON.parse(window.localStorage.getItem('access-user'))
    if (!user) {
      next({ path: '/login' })
    } else {
      next()
    }
  }
})

export default router
