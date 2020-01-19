<template>
  <div class="container">
    <topBananer :topImgUrl="topImgUrl"></topBananer>
    <div class="personListBox">
      <div
        class="personItem"
        v-for="item in personList"
        :key="item.id"
        @click="goPersonDetail(item.id)"
      >
        <div class="personImg">
          <img :src="item.coverimgurl" alt />
        </div>
        <div class="personName">
          <div class="name ellipsis-1">{{item.title}}</div>
          <div class="viewNum">
            <i class="iconfont icon-iconset0207"></i>
            <span>{{item.num}}</span>
          </div>
        </div>
      </div>
      <!-- 占位让其均匀分布 -->
      <div class="personItem null"></div>
    </div>
    <FixedMenu></FixedMenu>
    <div class="hintBox" v-if="firstHintVal" @click="hideHintChange">
      <img src="../../../static/images/tongtu1.gif" mode="aspectFill" alt />
    </div>
  </div>
</template>

<script>
import TopBananer from '../../components/TopBananer'
import FixedMenu from '../../components/FixedMenu'
import globalStore from '@/store/globalStore'
import { humanListData, adListData, litetypeData } from '@/utils/api'
export default {
  components: {
    TopBananer,
    FixedMenu
  },
  data () {
    return {
      firstHintVal: false,
      topImgUrl: [],
      personList: [],
      personList_num_k: '',
      personList_num_w: ''
    }
  },
  created () {

  },
  mounted () {
    this.liteTypeFun();
    this.getReveice();
  },
  onLoad () {
    wx.setStorageSync('shareVal', false)
    // 判断提示是否已经显示过
    var cache = wx.getStorageSync('firstUse_key');
    console.log('是第一次进吗---', cache)
    if (cache == 'true') {
      this.firstHintVal = true;
      wx.setStorageSync('firstUse_key', 'false');
    } else {
      this.firstHintVal = false;
    }
  },
  onShow () {
    // this.getReveice();
  },
  methods: {
    // 获取人物列表
    async peopleListFun () {
      let res = await humanListData();
      this.personList = res;
      this.numChangeFun(this.personList);
    },
    // 获取广告信
    async adListFun () {
      let res = await adListData();
      this.topImgUrl = res;
    },
    // 获取分类级别名称
    async liteTypeFun () {
      let res = await litetypeData();
      wx.setStorageSync('typeList', res)
      // 筛选项目分类 type=3
      var projectType = res.filter(item => item.type == 3);
      // 筛选项目分类一级菜单
      var projectType_1 = projectType.filter(item => item.pid == 0);
      // 根据一级菜的id 结合所有分类的pid  将二级菜单归属到一级菜单下(修改一级菜单数据,添加新属性navTwo)
      for (var i = 0; i < projectType_1.length; i++) {
        projectType_1[i].navTwo = []
        for (var j = 0; j < projectType.length; j++) {
          if (projectType_1[i].id == projectType[j].pid) {
            projectType_1[i].navTwo.push(projectType[j])
          }
        }
      }
      wx.setStorageSync('typeList-project', projectType_1);
      var typeListActivity = res.filter(item => item.pid == 0 && item.type == 4);
      wx.setStorageSync('typeList-activity', typeListActivity);
    },
    getReveice () {
      this.peopleListFun();
      this.adListFun();
    },
    goPersonDetail (perId) {
      wx.navigateTo({
        url: `/pages/personDetail/main?id=${perId}&isShare=${perId}`
      })
    },
    hideHintChange () {
      this.firstHintVal = false;
      wx.setStorageSync('firstUse_key', 'false');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.container {
  .personListBox {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 10px;
    .personItem {
      width: 32%;
      border-radius: 5px;
      overflow: hidden;
      box-shadow: 0 2px 4px 2px #e1e1e1;
      margin-bottom: 10px;
      .personImg {
        width: 100%;
        height: 180px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .personName {
        padding: 2px 2px 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        line-height: 20px;
        .name {
          width: 55%;
          font-size: 24rpx;
        }
        .viewNum {
          width: 45%;
          text-align: right;
          color: #069979;
          i {
            font-size: 24rpx;
          }
          span {
            font-size: 24rpx;
          }
        }
      }
    }
    .null {
      height: 0;
      box-shadow: none;
    }
  }
  .hintBox {
    position: fixed;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    img {
      position: fixed;
      bottom: 0;
    }
  }
}
</style>
