<template>
  <div class="topBananer">
    <div v-if="topImgUrl.length == 0">
      <image :src="imgDefault" mode="widthFix" alt />
    </div>
    <div v-else>
      <swiper
        :indicator-dots="indicatorDots"
        :autoplay="autoplay"
        :interval="interval"
        :duration="duration"
        circular
      >
        <block v-for="item in topImgUrl" :key="item.id">
          <swiper-item>
            <image :src="item.imgurl" mode="widthFix" />
          </swiper-item>
        </block>
      </swiper>
    </div>
  </div>
</template>

<script>
export default {
  props: ['topImgUrl'],
  data () {
    return {
      indicatorDots: false,
      autoplay: true,
      interval: 5000,
      duration: 1000,
      imgDefault: require('../../static/images/defaultImg.jpg')
    }
  },
  methods: {

  }
}
</script>

<style scoped lang="less">
.topBananer {
  width: 100%;
  height: 163px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
  swiper{
    height: 163px;
  }
}
</style>
