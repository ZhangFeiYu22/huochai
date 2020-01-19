<template>
  <div class="return_home" @click="returnHome">
    <i class="iconfont icon-home"></i>
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
    returnHome () {
      wx.switchTab({
        url: '/pages/personList/main'
      })
    }
  }
}
</script>

<style scoped lang="less">
.return_home {
  position: fixed;
  bottom: 57px;
  right: 4%;
  width: 80rpx;
  height: 40px;
  line-height: 40px;
  border-radius: 100%;
  background-color: #f1f1f1;
  border: 1px solid #e1e1e1;
  text-align: center;
  i {
    font-size: 50rpx;
  }
}
</style>
