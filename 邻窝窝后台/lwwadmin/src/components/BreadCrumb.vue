<template>
  <div class="navbar">
    <!-- <span class="address">当前位置：</span> -->
    <div class="breadcrumbNav">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item class="is-link" to="/indexPage">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-for="item in levelList" :key="item.path" :to="item.path">{{item.meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>

<script>
export default {
  name: "BreadCrumb",
  data() {
    return {
      levelList: []
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name);
      this.levelList = matched;
    }
  }
};
</script>
<style lang="scss" scoped>
.navbar {
  margin-bottom: 15px;
  height: 14px;
  line-height: 14px;
  .address {
    font-size: 14px;
    vertical-align: top;
  }
  .breadcrumbNav {
    display: inline-block;
  }
}
</style>
