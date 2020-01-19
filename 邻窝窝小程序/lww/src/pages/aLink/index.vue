<template>
  <div class="activity">
    <web-view src="https://mp.weixin.qq.com/s/9Ep74dYbtQxtzRL6G4hvRg"></web-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      link: ''
    }
  },
  onLoad (options) {
    if (options.alinkSrc) {
      this.link = options.alinkSrc
      console.log('this.link', this.link)
    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.activity {
  width: 100%;
  height: 100%;
}
</style>