<template>
  <div class="fixMenu" @click="callMethod">
    <i class="iconfont icon-leimupinleifenleileibie"></i>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted () {

  },
  methods: {
    callMethod () {
      wx.navigateTo({
        url: '/pages/records/main'
      })
    }
  }
}
</script>

<style scoped lang="less">
.fixMenu {
  position: fixed;
  bottom: 10px;
  right: 4%;
  width: 80rpx;
  height: 40px;
  line-height: 40px;
  border-radius: 100%;
  border: 1px solid #e1e1e1;
  text-align: center;
  i {
    font-size: 50rpx;
  }
}
</style>
