<template>
  <div class="login">
    <!-- <div class="imgSign">
      <img src="../../../static/images/sign.png" alt />
    </div> -->
    <div class="loginForm">
      <h2>华姐活动核销系统</h2>
      <input type="text" name="username" v-model="userInfo.username" placeholder="请输入账号/手机号" />
      <input type="password" name="password" v-model="userInfo.password" placeholder="输入密码" />
      <button class="loginBtn" @click="Login">登录</button>
    </div>
  </div>
</template>

<script>
import { setToken } from '@/utils/auth.js'
import { loginBy } from '@/api/allApi.js'
import axios from 'axios'
export default {
  data () {
    return {
      userInfo: {
        username: 'admin',
        password: '111111'
      }
    }
  },
  methods: {
    Login () {
      loginBy(this.userInfo).then(res=>{
        if (res.status == 200) {
          setToken(res.data.token)
          this.$toast('登录成功', { duration: 1500 })
          this.$router.push({ name: 'home' })
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
  // background: #999;
  background-size: cover;
  top: 0;
  bottom: 0;
  left: 0;
  margin: 0;
  .imgSign {
    width: 204px; /*px*/
    height: 204px; /*px*/
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
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
    h2 {
      color: #fff;
      font-size: 46px; /*px*/
      margin-bottom: 100px; /*px*/
    }
    input {
      width: 100%;
      background-color: transparent;
      border: none;
      color: #fff;
      font-size: 30px; /*px*/
      border-bottom: 2px solid #e1e1e1; /*px*/
      padding: 10px 5px;
      margin-bottom: 100px; /*px*/
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
      height: 80px; /*px*/
      border-radius: 40px;
      font-size: 32px; /*px*/
      color: #f1f1f1;
      border: none;
    }
  }
}
</style>
