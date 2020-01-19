<template>
  <div class="lifeService">
    <div class="symbol">
      <p class="p">品质</p>
      <p class="pp">用心服务值得信赖</p>
    </div>
    <scroll-view class="menuNav" :scroll-x="true">
      <div
        class="nav"
        :class="navNum == index ? 'active' : ''"
        v-for="(item,index) in navList"
        :key="item.id"
        @click="clickNav(item,index)"
      >{{item.name}}</div>
    </scroll-view>
    <div class="navItemContent">
      <div class="itemBox" v-for="item in navListItemList" :key="item.id" @click="goLifeService(item)">
        <img :src="imgUrlHttp + item.backdoor" mode="aspectFill" />
        <div class="word">
          <p class="name">{{item.name}}</p>
          <p class="summary">{{item.introduction}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import globalStore from '@/utils/store'
import { getServiceClass } from '@/api/lifeService.js'
export default {
  data () {
    return {
      imgUrlHttp: globalStore.state.imgUrlHttp,
      navNum: 0,
      navList: [],
      navListItemList: [],
    }
  },
  onLoad () {
    this.fetchNavList()
  },
  methods: {
    goLifeService (item) {
      wx.navigateTo({
        url: `/pages/lifeServiceContent/main?classid=${item.id}&classname=${item.name}`
      })
    },
    // 获取推荐
    async fetchNavList () {
      let serviceClass = await getServiceClass();
      //  1为活动推荐(搜索位置) 5为精选推荐(搜索位置)  2为我的推荐  3为代金券推荐  4为代金券套餐推荐
      if (serviceClass.status == 200) {
        // 进行一个排序
        this.navListAll = serviceClass.result.sort(function (a, b) {
          var n1 = Number(a.sort);
          var n2 = Number(b.sort);
          return n1 - n2;
        });
        let newArr = []
        let newArr2 = []
        for (let item of this.navListAll) {
          if (item.pid == '0') {
            newArr.push(item)
          }
        }
        this.navList = newArr;
        // 显示第一个
        this.findItemListFun(newArr[0].id)
      }
    },
    clickNav (item, index) {
      this.navNum = index
      console.log(index, '-----', item)
      this.findItemListFun(item.id)
    },
    findItemListFun (fid) {
      let arr = [];
      for (let item of this.navListAll) {
        if (item.pid == fid) {
          arr.push(item)
        }
      }
      this.navListItemList = arr
    }
  }
}
</script>

<style lang="less" scoped>
.lifeService {
  padding: 10px;
  .symbol {
    .p {
      font-size: 18px;
      font-weight: 600;
      line-height: 26px;
    }
    .pp {
      font-size: 12px;
      color: #999;
      line-height: 20px;
    }
  }
  .menuNav {
    width: auto;
    height: 40px;
    margin: 15px 0 30px 0;
    overflow: hidden;
    white-space: nowrap;
    .nav {
      display: inline-block;
      padding: 0 5px;
      margin: 0 15px;
      height: 40px;
      line-height: 40px;
      font-size: 15px;
      &.active {
        border-bottom: 1px solid #999;
        font-weight: 600;
      }
    }
  }
  .navItemContent {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .itemBox {
      width: 165px;
      height: 100px;
      margin-bottom: 20px;
      position: relative;
      border-radius: 5px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 0;
      }
      .word {
        position: absolute;
        z-index: 1;
        margin-top: 30px;
        margin-left: 20px;
        .name {
          font-size: 16px;
          line-height: 25px;
          font-weight: 600;
        }
        .summary {
          font-size: 12px;
          line-height: 15px;
        }
      }
    }
  }
}
</style>
