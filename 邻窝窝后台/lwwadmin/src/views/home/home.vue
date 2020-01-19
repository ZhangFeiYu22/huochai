<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="24" class="h-col">
          <el-col
            :span="10"
            class="logo"
            :class="collapsed?'logo-collapse-width':'logo-width'"
          >{{collapsed ? '' : title}}</el-col>
          <el-col :span="10">
            <div class="tools" @click.prevent="collapse">
              <i class="el-icon-arrow-right"></i>
            </div>
          </el-col>

          <el-col :span="4" class="userinfo">
            <span class="nameBox"></span>
            <!-- <span class="handBox" @click="showLoginInfo">登录信息</span> -->
            <!-- <span class="handBox" @click="logout">退出登录</span> -->
            <el-dropdown trigger="hover">
              <span class="el-dropdown-link userinfo-inner">
                <!-- {{userName}} -->
                <!-- <i class="el-icon-setting"></i> -->
                登录信息
              </span>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item @click.native="userInfoClick">个人信息</el-dropdown-item> -->
                <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-col>
      </el-row>
    </el-header>

    <el-dialog title="用户信息" center :visible.sync="userInfoDialogVisible" width="30%" size="mini">
      <el-form :model="userForm">
        <el-form-item label="原密码" label-width="80px">
          <el-input v-model="userForm.oldPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="80px">
          <el-input v-model="userForm.password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userInfoDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureChange">确 定</el-button>
      </div>
    </el-dialog>

    <el-container>
      <el-aside class="aside" :class="{showSidebar:collapse}">
        <!--<div class="menu-toggle" @click.prevent="collapse">
          &lt;!&ndash;<i class="iconfont icon-icon-test" v-show="!collapsed"></i>
          <i class="iconfont icon-icon-zhangjai2" v-show="collapsed"></i>&ndash;&gt;
          <i class="el-icon-caret-left" v-show="!collapsed"></i>
          <i class="el-icon-caret-right" v-show="collapsed"></i>
        </div>-->
        <el-menu
          default-active="0"
          class="el-menu"
          ref="menuCollapsed"
          router
          :collapse="collapsed"
        >
          <template v-for="(item,index) in $router.options.routes" v-if="item.name !== '登录'">
            <el-submenu :index="index+''" v-if="!item.leaf">
              <template slot="title">
                <i :class="item.iconCls"></i>
                <span slot="title">{{item.name}}</span>
              </template>
              <el-menu-item
                v-for="child in item.children"
                :index="child.path"
                :key="child.path"
                v-if="!child.menuShow"
                :class="$route.path==child.path?'is-active':''"
              >{{child.name}}</el-menu-item>
            </el-submenu>
            <el-menu-item
              v-else-if="item.leaf&&item.children&&item.children.length"
              :index="item.children[0].path"
              :class="$route.path==item.children[0].path?'is-avtive':''"
            >
              <i :class="item.iconCls"></i>
              <span slot="title">{{item.children[0].name}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-aside>

      <el-main>
        <bread-crumb></bread-crumb>
        <transition>
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script type="text/ecmascript-6">
import BreadCrumb from "@/components/BreadCrumb";
import { logout, changePassword } from 'api/login'
import { mapState } from 'vuex'

export default {
  components: { BreadCrumb },
  data () {
    return {
      title: '后台管理系统',
      userInfoDialogVisible: false,  //是否显示登录信息
      userName: '',
      collapsed: false,
      userForm: {
        oldPassword: '',
        password: ''
      }
    }
  },
  created () {
    this.$on('setUserName', (text) => {
      this.userName = text
    })
    this.$on('go', (url) => {
      if (url === '/') {
        localStorage.removeItem('access-user')
      }
      this.$router.push(url)
    })
  },
  mounted () {
    var user = localStorage.getItem('access-user')
    if (user) {
      user = JSON.parse(user)
      this.userName = user.username || ''
    }
  },
  methods: {
    // 折叠导航栏
    collapse () {
      this.collapsed = !this.collapsed
    },
    /* showMenu (i, status) {
     this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none'
     }, */
    logout () {
      let that = this
      this.$confirm('确认退出吗？', '提示', {
        confirmButtonClass: 'el-button--warning'
      }).then(() => {
        logout().then((res) => {
          localStorage.removeItem('access-user')
          that.$router.go('/')
        })
      }).catch((error) => {
        console.log(error)
        that.$message({
          message: '已取消',
          duration: 2000
        })
      })
    },
    // 显示登录信息
    userInfoClick () {
      console.log(this.userInfoDialogVisible)
      this.userInfoDialogVisible = true
    },
    sureChange () {
      console.log('1--------', this.userForm)
      changePassword(this.userForm).then(res => {
        console.log('2----------', res)
      })
    }
  }
}
</script>

<style scoped lang="scss">
/*@import "common/iconfont.css";*/

.container {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  border: 1px solid #eee;

  .header {
    background-color: cornflowerblue;
    height: 70px;
    padding: 0px;
    line-height: 70px;

    .logo {
      height: 60px;
      font-size: 22px;
      padding-left: 20px;
      border-color: rgba(238, 241, 146, 0.3);
      color: white;
      .topbar-btn {
        color: #fff;
      }
      img {
        width: 40px;
        float: left;
        margin: 10px 10px 10px 18px;
      }
    }

    .logo-width {
      width: 230px;
    }

    .logo-collapse-width {
      width: 60px;
    }

    .tools {
      padding: 0px 23px;
      width: 14px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
    }

    .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;
      span {
        display: inline-block;
        color: #fff;
        cursor: pointer;
      }
      .userinfo-inner {
        cursor: pointer;
        color: #fff;
      }
    }
  }

  .aside {
    min-width: 50px;
    flex: 0 0 230px;
    width: 230px;
    background-color: rgb(238, 241, 246);
    &::-webkit-scrollbar {
      display: none;
    }

    &.showSidebar {
      overflow-x: hidden;
      overflow-y: auto;
    }

    /*.menu-toggle {
        background: #4A5064;
        text-align: center;
        color: white;
        height: 26px;
        line-height: 30px;
      }*/
    .menu-collapsed {
      flex: 0 0 60px;
      width: 60px;
    }

    .menu-expanded {
      flex: 0 0 230px;
      width: 230px;
    }

    .el-menu {
      height: 100%;
      height: -moz-calc(100% - 80px);
      height: -webkit-calc(100% - 80px);
      height: calc(100% - 80px);
      border-radius: 0px;
      background-color: #eef1f6;
    }

    .el-submenu .el-menu-item {
      min-width: 60px;
    }
    .el-menu {
      width: 230px;
    }
    .el-menu--collapse {
      width: 60px;
    }

    .el-menu .el-menu-item,
    .el-submenu .el-submenu__title {
      height: 46px;
      line-height: 46px;
    }

    .el-menu-item:hover,
    .el-submenu .el-menu-item:hover,
    .el-submenu__title:hover {
      background-color: #7ed2df;
    }
  }
}
</style>
