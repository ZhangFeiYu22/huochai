<template>
  <div class="container">
    <topBananer :topImgUrl="topImgUrl"></topBananer>
    <div class="tabBox mt15">
      <p
        :class="navNum == index ? 'active' : ''"
        v-for="(item,index) in navTabList"
        @click="selectNav(index)"
        :key="item.id"
      >{{item.name}}</p>
    </div>
    <div class="tabContent">
      <div class="tabListItem" v-for="(item,index1) in tabListData" :key="item.id">
        <p class="tabName">{{item.name}}</p>
        <scroll-view scroll-x class="scrollXView">
          <div
            class="scrollItem"
            v-for="(itemCont,index2) in item.contentList"
            :key="itemCont.id"
            @click="goDetail(itemCont.id)"
          >
            <div class="showBoxItem">
              <div class="showImg">
                <img :src="itemCont.coverimgurl" mode="aspectFix" alt />
              </div>
              <div class="showTitle">
                <p class="title ellipsis-1">{{itemCont.title}}</p>
                <p class="view">
                  <i class="iconfont icon-iconset0207"></i>
                  <span>{{itemCont.num}}</span>
                </p>
              </div>
            </div>
          </div>
        </scroll-view>
      </div>
    </div>
    <FixedMenu></FixedMenu>
  </div>
</template>

<script>
import TopBananer from '../../components/TopBananer'
import FixedMenu from '../../components/FixedMenu'
export default {
  components: {
    TopBananer,
    FixedMenu
  },
  data () {
    return {
      topImgUrl: [],
      navNum: 0,
      navTabList: [],  //一级栏目
      tabListData: []
    }
  },
  mounted () {
    this.getSelectNav();
    this.getAdData();
  },
  // onShow () {
  //   this.navNum = 0;
  //   this.getSelectNav();
  //   this.getAdData();
  // },
  methods: {
    selectNav (ind) {
      this.navNum = ind;
      this.tabListData = this.navTabList[ind].navTwo
    },
    getAdData () {
      // 广告位
      this.$http.get({
        url: 'effect/ad/3'
      }).then(res => {
        if (res.length == 0) {
          return
        } else {
          this.topImgUrl = res;
        }
      });
    },
    getSelectNav () {
      this.navTabList = wx.getStorageSync('typeList-project');
      this.navTabList.map(item => {
        item.navTwo.map(item2 => {
          item2.contentList = []
          this.$http.get({
            url: `effect/projects/${item2.id}`
          }).then(res => {
            console.log('项目数据--',res)
            this.numChangeFun(res)
            item2.contentList = res;
          });
        })
      })
      this.selectNav(0);
      // this.tabListData= this.navTabList[0].navTwo
    },
    goDetail (prid) {
      wx.navigateTo({
        url: `/pages/projectDetail/main?id=${prid}&isShare=${prid}`
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.container {
  padding-bottom: 50px;
  .tabBox {
    display: flex;
    direction: row;
    justify-content: space-around;
    border-bottom: 1px solid #e1e1e1;
    p {
      font-size: 32rpx;
      color: #666;
      &.active {
        color: #000;
        font-weight: 600;
        padding-bottom: 3px;
        border-bottom: 3px solid #069979;
      }
    }
  }
  .tabContent {
    padding: 10px 0 0 20px;
    .tabListItem {
      .tabName {
        font-size: 30rpx;
        font-weight: 600;
        color: #000;
        height: 40px;
        line-height: 40px;
        &::before {
          display: inline-block;
          content: "";
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #069979;
          margin-right: 6px;
        }
      }
      .scrollXView {
        white-space: nowrap;
        display: flex;
        .scrollItem {
          display: inline-block;
          padding: 10rpx;
          .showBoxItem {
            width: 150px;
            display: inline-block;
            margin-left: 15px;
            border-radius: 5px;
            overflow: hidden;
            box-shadow: 0 0 4px 2px #e1e1e1;
            &:first-child {
              margin-left: 0px;
            }
            .showImg {
              width: 150px;
              height: 120px;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .showTitle {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              height: 40px;
              line-height: 40px;
              padding: 0 10px;
              .title {
                color: #000;
                font-size: 24rpx;
                width: 70%;
              }
              .view {
                width: 30%;
                color: #069979;
                text-align: right;
                i {
                  font-size: 24rpx;
                }
                span {
                  font-size: 24rpx;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style>
@import url("~mpvue-wxparse/src/wxParse.css");
</style>
