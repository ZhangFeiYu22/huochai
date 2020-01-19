<template>
  <div class="content">
    <div class="voucherCSS" @click="goChoicenessPage">
      <div class="choiceImg" v-if="Choiceness.coverOne">
        <img :src="imgUrlHttp + Choiceness.coverOne" mode="aspectFill" />
      </div>
      <div class="choiceContent">
        <div class="c1">
          <p class="title ellipsis-1">{{Choiceness.name}}</p>
        </div>
        <div class="c2 ellipsis-1">{{Choiceness.subName}}</div>
        <button class="grabNow">马上抢</button>
        <div class="c3">
          <p>
            <span class="now">￥{{Choiceness.actualPrice}}</span>
            <span class="old">￥{{Choiceness.showPrice}}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import globalStore from '@/utils/store'
export default {
  props: ['Choiceness'],
  data () {
    return {
      imgUrlHttp: globalStore.state.imgUrlHttp
    }
  },
  methods: {
    goChoicenessPage(){
      if (wx.getStorageSync('isLogin')) {
        wx.navigateTo({
          url: `/pages/cashCoupon/main?choice_id=${this.Choiceness.id}`
        })
      } else {
        wx.showToast({
          title: '您还未登录,请先登录',
          duration: 2000,
          icon: 'none',
          success: function () {
            setTimeout(function () {
              wx.navigateTo({
                url: '/pages/login/main'
              })
            }, 2000)
          }
        })
      }
    }
  },
}
</script>

<style lang="less" scoped>
</style>
