<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
<script type="text/ecmascript-6">

</script>

<style lang="scss">
body {
  padding: 0px;
  margin: 0px auto;
}
/* // headUpload_lww */
.headUpload_lww {
  width: 100px;
  height: 100px;
  position: relative;
  right: 100px;
  display: inline-block;
  .box {
    position: absolute;
    left: 100%;
    .upload-input {
      position: absolute;
      left: 120%;
      top: 50%;
      transform: translateY(-50%);
      z-index: 2;
      opacity: 0;
      cursor: pointer;
      /* 通过定位把input放在img标签上面，通过不透明度隐藏 */
    }
    .upload-img {
      width: 100px;
      height: 100px;
      display: inline-block;
      border: 2px dashed #2196f3;
    }
    .upload-btn {
      position: absolute;
      left: 120%;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1;
      background: #00b7ee;
      color: #fff;
      border: 0;
      padding: 5px 8px;
      border-radius: 3px;
      cursor: pointer;
    }
  }
}
</style>
