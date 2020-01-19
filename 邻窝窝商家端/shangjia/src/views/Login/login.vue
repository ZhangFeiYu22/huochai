<template>
  <div class="login">
    <div class="imgSign">
      <img src="../../../static/images/log.png" alt />
    </div>
    <div class="loginForm">
      <h2>邻窝窝店家管理后台</h2>
      <input type="text" name="username" v-model="userInfo.username" placeholder="请输入账号/手机号" />
      <input type="password" name="password" v-model="userInfo.password" placeholder="输入密码" />
      <button class="loginBtn" @click="Login">登录</button>
    </div>
  </div>
</template>

<script>
import { loginBy } from '@/api/allApi.js'
import { setToken } from "@/utils/auth";
import axios from 'axios'
export default {
  data () {
    return {
      userInfo: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    Login () {
      loginBy(this.userInfo).then(res => {
        if (res.data.status == 200) {
          console.log(res.data.result)
          setToken(res.data.result)
          this.$toast('登录成功', { duration: 1500 })
          this.$router.push({ name: 'mainIndex' })
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
.login {
  height: 100%;
  width: 100%;
  position: fixed;
  background: url("../../../static/images/loginbg.png") no-repeat;
  background-size: cover;
  top: 0;
  bottom: 0;
  left: 0;
  margin: 0;
  .imgSign {
    width: 206px;
    height: 200px;
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    img {
      width: 100%;
      height: 100%;
    }
  }
  .loginForm {
    width: 70%;
    text-align: center;
    position: absolute;
    top: 28%;
    left: 50%;
    transform: translateX(-50%);
    h2 {
      color: #fff;
      font-size: 46px;
      margin-bottom: 100px;
    }
    input {
      width: 100%;
      background-color: transparent;
      border: none;
      color: #fff;
      font-size: 30px;
      border-bottom: 2px solid #e1e1e1;
      padding: 10px 5px;
      margin-bottom: 100px;
      &:focus {
        outline: none;
      }
      &::-webkit-input-placeholder {
        color: #bbb;
      }
      &::-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: #bbb;
      }
      &::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #bbb;
      }
      &::-ms-input-placeholder {
        /* Internet Explorer 10+ */
        color: #bbb;
      }
    }
    .loginBtn {
      background-color: #e94f36;
      width: 100%;
      height: 80px;
      border-radius: 40px;
      font-size: 32px;
      color: #f1f1f1;
      border: none;
      margin-top: 50px;
    }
  }
}
</style>
