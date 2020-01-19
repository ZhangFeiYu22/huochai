<template>
  <div class="head" :style="{height: (headHeight + 46) + 'px',background: headData.bgcolor}">
    <div class="title" :style="{marginTop: headHeight + 'px'}">
      <div class="black" v-show="headData.showBlack" @click="_navBlack">
        <i class="iconfont icon-xiangzuo"></i>
      </div>
      {{headData.title}}
    </div>
  </div>
</template>

<script>
export default {
  props: ['headData'],
  data () {
    return {
      headHeight: ''
    }
  },
  methods: {
    _navBlack () {
      console.log('dianji')
      //改变分享进来的返回按钮值  判断返回
      if (wx.getStorageSync('shareUrlValue')) {
        wx.navigateTo({
          url: '/pages/home/main'
        })
      } else {
        wx.navigateBack()
      }
    }
  },
  created () {
    this.headHeight = this.$store.state.navHeight
  }
}
</script>

<style lang="less" scoped>
.head {
  position: fixed;
  z-index: 1;
  width: 100%;
  top: 0;
  .title {
    height: 46px;
    line-height: 46px;
    font-size: 16px;
    font-weight: 600;
    position: absolute;
    text-align: center;
    width: 100%;
  }
  .black {
    position: absolute;
    width: 6%;
    left: 4%;
  }
}
</style>
