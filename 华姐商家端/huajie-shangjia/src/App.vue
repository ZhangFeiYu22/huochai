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

<style>
#app {
  font-size: 16px; /*px*/
  background-color: #fff;
  height: 100%;
  box-sizing: border-box;
}
input:focus,
button:focus {
  outline: none;
}
.pt106 {
  padding-top: 106px; /*px*/
}
.pt86 {
  padding-top: 86px; /*px*/
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
</style>
