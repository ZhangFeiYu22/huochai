<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang='less'>
#app {
  font-size: 16px;
  background-color: #fff;
  height: 100%;
  box-sizing: border-box;
}
input:focus,
button:focus {
  outline: none;
}
.pt106 {
  padding-top: 106px;
}
.pt86 {
  padding-top: 86px;
}
/*一行出现省略号 */

.ellipsis-1 {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/*两行出现省略号 */

.ellipsis-2 {
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  height: auto;
}

.topHTitle {
  height: 80px;
  line-height: 80px;
  margin: 20px 0;
  background-color: #fff;
  padding: 0px 20px;
  display: flex;
  justify-content: space-between;
  .left {
    font-size: 30px;
  }
  .right {
    font-size: 24px;
    font-weight: 600;
  }
}
.btnChange {
  width: 55%;
  height: 80px;
  border-radius: 40px;
  background-color: #000;
  text-align: center;
  line-height: 80px;
  color: #fff;
  font-size: 32px;
  position: fixed;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
}
</style>
