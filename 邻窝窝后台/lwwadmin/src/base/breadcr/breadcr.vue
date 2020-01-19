<template>
  <div class="breadcr-wrap">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/' }">{{meName.meNameSeco}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{meName.meNameThir}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    // 当前菜单
    meName: {
      type: Object,
      default: ''
    }
  }
}
</script>

<style>
.breadcr-wrap{
  margin-bottom: 20px;
}
</style>
