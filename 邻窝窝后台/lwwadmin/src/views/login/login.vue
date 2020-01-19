<template>
  <el-form
    ref="AccountFrom"
    :model="account"
    :rules="rules"
    labelPosition="left"
    labelWidth="0px"
    class="demo-ruleForm login-container"
  >
    <h3 class="title">邻窝窝系统登录</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="account.username" auto-complete="off" placeholder="请输入账号"></el-input>
    </el-form-item>
    <el-form-item prop="pwd">
      <el-input type="password" v-model="account.pwd" auto-complete="off" placeholder="请输入密码"></el-input>
    </el-form-item>
    <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
    <el-form-item style="width:100%;">
      <el-button
        type="primary"
        style="width:100%;"
        @click.native.prevent="handleLogin"
        :logining="logining"
      >登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import { loginByUsername, loginByUsernameMe } from 'api/login'
import globalStore from '@/common/js/store'
// import { statusCode } from 'common/js/config'

export default {
  data () {
    return {
      logining: false,
      account: {
        username: '',
        pwd: ''
      },
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        pwd: [{ required: true, message: '请输入密码', rigger: 'blur' }]
      },
      checked: true
    }
  },
  methods: {
    handleLogin () {
      this.$refs.AccountFrom.validate((valid) => {
        if (valid) {
          this.logining = true
          let loginParams = {
            username: this.account.username,
            password: this.account.pwd
          }
          loginByUsername(loginParams).then((res) => {
            this.logining = false
            //  console.log('登陆成功即将跳转--------',res)
            localStorage.setItem('access-user', JSON.stringify(res))
            this.$message.success({
              message: '登录成功',
              duration: 2000
            })
            //  console.log('登陆成功--------')
            loginByUsernameMe().then((resMe) => {
              let jsRes = JSON.parse(resMe)
              console.log('获取登录人员的信息,名字等---', jsRes.result.user.username)
              globalStore.dispatch('getUser', jsRes.result.user.username)
              // globalStore.commit('changeUserName', JSON.stringify(jsRes))
            })
            this.$router.push({ path: '/home' })
          }).catch((err) => {
            this.$message.error(err)
            this.logining = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 160px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;

  background: -ms-linear-gradient(top, #fff, #6495ed); /* IE 10 */
  background: -moz-linear-gradient(top, #b8c4cb, #f6f6f8); /*火狐*/
  background: -webkit-gradient(
    linear,
    0% 0%,
    0% 100%,
    from(#b8c4cb),
    to(#f6f6f8)
  ); /*谷歌*/
  background: -webkit-gradient(
    linear,
    0% 0%,
    0% 100%,
    from(#fff),
    to(#6495ed)
  ); /* Safari 4-5, Chrome 1-9*/
  background: -webkit-linear-gradient(
    top,
    #fff,
    #6495ed,
    #fff
  ); /*Safari5.1 Chrome 10+*/
  background: -o-linear-gradient(top, #fff, #6495ed); /*Opera 11.10+*/

  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>
