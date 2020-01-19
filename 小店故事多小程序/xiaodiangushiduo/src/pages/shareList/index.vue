<template>
  <div class="container">
    <TopBananer :topImgUrl="topImgUrl"></TopBananer>
    <div class="projectList">
      <div
        class="projectItem"
        v-for="item in shareListData"
        :key="item.id"
        @click="goDetail(item.id)"
      >
        <div class="imgBox">
          <img :src="item.coverimgurl" alt />
        </div>
        <div class="summary">
          <p class="name ellipsis-1">{{item.title}}</p>
          <div class="su">
            <p class="auth ellipsis-1">
              <!-- <WxPares :content="item.subtitle" /> -->
              {{item.subtitle}}
              <!-- <span>张小凡</span>
              <span>宠爱咖啡店创始人</span>-->
            </p>
            <p class="view">
              <i class="iconfont icon-iconset0207"></i>
              <span>{{item.num}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <FixedMenu></FixedMenu>
  </div>
</template>

<script>
import TopBananer from '../../components/TopBananer'
import FixedMenu from '../../components/FixedMenu'
import WxPares from 'mpvue-wxparse'
export default {
  components: {
    TopBananer,
    FixedMenu,
    WxPares
  },
  data () {
    return {
      topImgUrl: [],
      shareListData: []
    }
  },
  created () {

  },
  mounted () {
    this.getDataList();
  },
  onShow () {
    // this.getDataList();
  },
  methods: {
    getDataList () {
      this.$http.get({
        url: 'effect/share'
      }).then(res => {
        console.log('分享数据返回--', res)
        this.shareListData = res;
        this.numChangeFun(this.shareListData);
      });
      // 广告位
      this.$http.get({
        url: 'effect/ad/5'
      }).then(res => {
        console.log('图片', res)
        if (res.length == 0) {
          return
        } else {
          this.topImgUrl = res;
        }
      });
    },
    goDetail (sid) {
      console.log(sid)
      wx.navigateTo({
        url: `/pages/shareDetail/main?id=${sid}&isShare=${sid}`
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.container {
  .projectList {
    display: flex;
    flex-direction: column;
    padding: 10px;
    .projectItem {
      position: relative;
      width: 100%;
      margin-bottom: 15px;
      border-radius: 6px;
      box-shadow: 0 2px 4px 2px #e1e1e1;
      overflow: hidden;
      .imgBox {
        height: 150px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .summary {
        padding: 5px 10px 15px;
        .name {
          font-size: 16px;
          color: #333;
          font-weight: 600;
          height: 32px;
          line-height: 32px;
        }
        .su {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          height: 20px;
          line-height: 20px;
          .auth {
            font-size: 28rpx;
            width: 82%;
            // span {
            //   &:first-child::after {
            //     display: inline-block;
            //     content: "";
            //     width: 6px;
            //     height: 10px;
            //     border-right: 1px solid #039a79;
            //     margin: 0 5px;
            //   }
            // }
          }
          .view {
            width: 18%;
            text-align: right;
            font-size: 28rpx;
            color: #039a79;
            i {
              vertical-align: bottom;
              margin-right: 5px;
            }
            span {
              vertical-align: bottom;
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
.wxParse {
  margin: 0;
  font-size: 24rpx;
}
</style>
