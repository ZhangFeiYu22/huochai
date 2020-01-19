<template>
  <div class="setting">
    <TopModule></TopModule>
    <div class="settingList">
      <div class="title">修改密码:</div>
      <form action method="post" enctype="multipart/form-data">
        <div class="add-to">
          <!-- <div class="settingItem">
            <input class="settingName" type="text" placeholder="请输入账号手机号码" v-model="formObj.name" />
            <i class="iconLeft"></i>
          </div>-->
          <div class="settingItem">
            <input
              class="settingName"
              type="password"
              placeholder="请输入原密码"
              v-model="formObj.oldpwd"
            />
            <i class="iconLeft"></i>
          </div>
          <div class="settingItem">
            <input
              class="settingName"
              type="password"
              placeholder="请输入新密码"
              v-model="formObj.newpwd"
            />
            <i class="iconLeft"></i>
          </div>
          <div class="btnChange" @click="onSubmit()">确认修改</div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { changePwd } from '@/api/allApi.js'
import TopModule from '../../components/topModule'
export default {
  components: {
    TopModule
  },
  data () {
    return {
      formObj: {
        oldpwd: '',
        newpwd: ''
      }
    }
  },
  created () {
  },
  methods: {
    onSubmit (event) {
      changePwd(this.formObj).then(res => {
        if (res.data.status == 200) {
          this.$toast('操作成功', { duration: 1500 });
            this.$router.push({ name: 'mainIndex' })
        } else {
          this.$toast('操作失败,请输入正确的原密码', { duration: 1500 });
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
.setting {
  height: 100%;
  width: 100%;
  background-color: #f1f1f1;
  .settingList {
    width: 80%;
    margin: 20% auto 0;
    .title {
      font-size: 36px;
      margin: 20px 0 40px;
      color: #000;
      font-weight: 600;
    }
    .settingItem {
      height: 70px;
      line-height: 70px;
      border-bottom: 2px solid #999;
      position: relative;
      margin-bottom: 50px;
      .settingName {
        font-size: 32px;
        position: absolute;
        left: 10%;
        bottom: 0;
        line-height: 70px;
        border: none;
        background: transparent;
      }
      .iconLeft {
        display: inline-block;
        width: 30px;
        height: 30px;
        position: absolute;
        left: 0;
        bottom: 30%;
        background-color: #ccc;
        border-radius: 100%;
      }
    }
  }
}
</style>
  