<template>
  <div class="noData">
    <img src="../../static/images/nodata.png" mode="aspectFill" />
    <p>{{text}}</p>
  </div>
</template>

<script>
export default {
  props: ['text']
}
</script>

<style lang="less" scoped>
.noData {
  text-align: center;
  margin: 20px 0;
  img {
    display: inline-block;
    width: 141px;
    height: 122px;
  }
  p {
    color: #999;
  }
}
</style>
