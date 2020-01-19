<template>
  <div class="navbar custom-class" :style="'height:'+navHeight+'px;background-color:transparent'">
    <div class="navbar-title" :style="'top:'+navTop+'px'">我的</div>
  </div>
</template>

<script>
export default {
  props: {
    showNav: {
      type: Boolean,
      value: true
    },
    showHome: {
      type: Boolean,
      value: true
    }
  },
  data () {
    return {
      navHeight: wx.getStorageSync('navHeight'),
      navTop: wx.getStorageSync('navTop'),
    }
  },
  created () {
  },
  methods: {
    
  }
}
</script>

<style>
.navbar {
  width: 100%;
  overflow: hidden;
  position: relative;
  top: 0;
  left: 0;
  z-index: 10;
  flex-shrink: 0;
}

.navbar-title {
  width: 100%;
  box-sizing: border-box;
  height: 32px;
  line-height: 32px;
  text-align: center;
  position: absolute;
  z-index: 10;
  color: #fff;
  font-size: 16px;
}
</style>
