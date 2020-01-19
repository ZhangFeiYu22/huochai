<template>
  <div class="container">
    <div class="topSummary">
      <div class="imgBox">
        <img :src="shareDetailData.coverimgurl" alt />
      </div>
      <div class="wordBox">
        <div class="title">
          <p class="ti">{{shareDetailData.title}}</p>
          <!-- <p class="view">
            <i class="iconfont icon-iconset0207"></i>
            <span>{{shareDetailData.num}}</span>
          </p>-->
        </div>
        <p class="content">
          <WxPares :content="shareDetailData.content" />
        </p>
      </div>
    </div>
    <div class="swiperBox">
      <swiper :autoplay="autoplay" :interval="interval" :duration="duration">
        <block v-for="item in photoListData" :key="item.id">
          <swiper-item>
            <div class="imgBox">
              <img :src="item" class="slide-image" />
            </div>
          </swiper-item>
        </block>
      </swiper>
    </div>
    <!-- 加盟条件 -->
    <h3 class="tabName">我的项目</h3>
    <div class="myProject">
      <div class="term" @click="goProjectDetail(shareDetailData.articleid)">
        <div class="lr left">
          <img :src="shareDetailData.contenturl" alt />
        </div>
        <div class="lr right">
          <div class="rightTop">
            <h2>{{shareDetailData.title}}</h2>
            <p>{{shareDetailData.subtitle}}</p>
          </div>
          <div class="rightBottom">
            <div>{{shareDetailData.title}}</div>
            <div class="view">
              <i class="iconfont icon-iconset0207"></i>
              <span>{{shareDetailData.num}}</span>
            </div>
            <!-- <div class="view">
              <i class="iconfont icon-star"></i>
              <span>200</span>
            </div>-->
          </div>
        </div>
      </div>
    </div>
    <!-- 底部固定 -->
    <div class="footFixed clearfix">
      <div class="dz dzfx" @click="thumbsUpChange(shareDetailData.id)">
        <p>
          <i class="iconfont" :class="thumbsUpVal == 'true' ? 'icon-zan_active' : 'icon-zan'"></i>
        </p>
        <p>{{thumbsUpVal == 'true' ? '取消' : '点赞' }}</p>
      </div>
      <div class="star dzfx" @click="starChange(shareDetailData.id)">
        <p>
          <i class="iconfont" :class="starVal == 'true' ? 'icon-star_active' : 'icon-star'"></i>
        </p>
        <p>{{starVal == 'true' ? '取消收藏' : '收藏' }}</p>
      </div>
      <button class="fx dzfx" open-type="share">
        <p>
          <i class="iconfont icon-fenxiang"></i>
        </p>
        <p>分享</p>
      </button>
      <div class="zx" @click="contactPhone">我要咨询</div>
    </div>
    <ReturnHome v-if="shareVal"></ReturnHome>
  </div>
</template>

<script>
import ReturnHome from '../../components/ReturnHome'
import WxPares from 'mpvue-wxparse'
export default {
  components: {
    ReturnHome,
    WxPares
  },
  data () {
    return {
      shareVal: true,
      autoplay: false,
      interval: 5000,
      duration: 1000,
      shareDetailData: '',
      tapTime: '',   //阻止两次点击操作间隔太快
      thumbsUpVal: '',  //判断点赞取消
      starVal: '', //判断收藏
      photoListData: []
    }
  },
  mounted () { },
  onLoad: function (options) {
    if (options.isShare) {
      this.shareVal = false
    }else if(wx.getStorageSync('shareVal')){
      this.shareVal = true
    }
    this.$http.get({
      url: `effect/shareDetails/${options.id}`
    }).then(res => {
      console.log('分享的详情--', res)
      this.shareDetailData = res;
      this.numChangeFun(this.shareDetailData);
      var arr = res.imgsurl.split(';');
      arr.pop();
      this.photoListData = arr;
    });
    // 浏览量调用
    this.$http.get({
      url: `effect/addnum/${options.id}`
    }).then(res => { });
    // 是否点赞判断
    this.$http.get({
      url: `userarticle/get/${options.id}`
    }).then(res => {
      if (res.code == 200) {
        this.thumbsUpVal = res.message
      }
    });
    // 是否收藏判断
    this.$http.get({
      url: `collect/get/${options.id}`
    }).then(res => {
      if (res.code == 200) {
        this.starVal = res.message
      }
    });
  },
  methods: {
    contactPhone (e) {
      wx.makePhoneCall({
        phoneNumber: '400-828-9717'
      })
    },
    goProjectDetail (prid) {
      wx.navigateTo({
        url: `/pages/projectDetail/main?id=${prid}&isShare=${prid}`
      })
    },
    // 点赞
    thumbsUpChange (aid) {
      var nowTime = new Date();
      if (nowTime - this.tapTime < 1000) {
        console.log('阻断')
        return;
      } else {
        this.tapTime = nowTime;
        if (this.thumbsUpVal == 'false') {
          this.$http.get({
            url: `userarticle/add/${aid}`
          }).then(res => {
            if (res.code == 200) {
              this.thumbsUpVal = 'true';
              wx.showToast({
                title: '点赞成功',
                icon: 'success',
                duration: 2000
              })
            }
          });
        } else {
          this.$http.get({
            url: `userarticle/delete/${aid}`
          }).then(res => {
            if (res.code == 200) {
              this.thumbsUpVal = 'false';
              wx.showToast({
                title: '取消点赞',
                icon: 'success',
                duration: 2000
              })
            }
          });

        }
      }
    },
    // 收藏
    starChange (aid) {
      var nowTime = new Date();
      if (nowTime - this.tapTime < 1000) {
        console.log('阻断')
        return;
      } else {
        this.tapTime = nowTime;
        if (this.starVal == 'false') {
          this.$http.get({
            url: `collect/add/${aid}`
          }).then(res => {
            if (res.code == 200) {
              this.starVal = 'true';
              wx.showToast({
                title: '收藏成功',
                icon: 'success',
                duration: 2000
              })
            }
          });
        } else {
          this.$http.get({
            url: `collect/delete/${aid}`
          }).then(res => {
            if (res.code == 200) {
              this.starVal = 'false';
              wx.showToast({
                title: '取消收藏',
                icon: 'success',
                duration: 2000
              })
            }
          });

        }
      }
    }
  },
  onShareAppMessage: function (ops) {
    var urlPath = '/' + getCurrentPages()[getCurrentPages().length - 1].route;
    if (ops.from === "button") {
      // 来自页面内转发按钮
      console.log(ops.target);
    }
    return {
      title: `${this.shareDetailData.title}`,
      path: `${urlPath}?id=${this.shareDetailData.id}`,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
        var shareTickets = res.shareTickets;
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.container {
  padding-bottom: 100px;
  .tabName {
    padding-left: 3%;
    font-size: 32rpx;
    color: #000;
    height: 50px;
    font-weight: 600;
    line-height: 50px;
    margin-top: 5px;
    &::before {
      display: inline-block;
      content: "";
      width: 8px;
      height: 8px;
      border-radius: 50%;
      border: 1px solid #333;
      margin-right: 6px;
    }
  }
  .topSummary {
    width: 94%;
    margin: 10px auto 0;
    .imgBox {
      height: 200px;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
    .wordBox {
      padding: 10px 0;
      text-align: justify;
      .title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 40px;
        line-height: 40px;
        .ti {
          font-size: 16px;
          font-weight: 600;
          color: #000;
        }
        .view {
          font-size: 14px;
          color: #039a79;
          i {
            vertical-align: middle;
            margin-right: 5px;
          }
          span {
            vertical-align: middle;
          }
        }
      }
      .content {
        font-size: 12px;
        color: #1e1e1e;
        // text-indent: 22px;
      }
    }
  }
  .swiperBox {
    margin-left: 5%;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    overflow: hidden;
    swiper {
      height: 210px;
    }
    swiper-item {
      width: 97% !important;
      img {
        width: 100%;
      }
    }
    .imgBox {
      width: 97%;
      height: 100%;
      border-radius: 10px;
      overflow: hidden;
    }
  }
  .myProject {
    width: 94%;
    margin: 0 auto;
    .term {
      box-shadow: 0 2px 4px 2px #e1e1e1;
      border-radius: 5px;
      overflow: hidden;
      display: flex;
      flex-direction: row;
      .left {
        width: 40%;
        height: 120px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .right {
        width: 60%;
        display: flex;
        flex-direction: column;
        padding: 10px 10px 0;
        .rightTop {
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
          height: 59px;
          padding-bottom: 10px;
          h2 {
            font-size: 16px;
            height: 30px;
            line-height: 30px;
          }
          p {
            font-size: 12px;
            height: 19px;
            line-height: 19px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        .rightBottom {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          height: 50px;
          line-height: 50px;
          .view {
            font-size: 12px;
            color: #039a79;
            i {
              vertical-align: middle;
            }
            span {
              vertical-align: middle;
            }
          }
        }
      }
    }
  }
  .footFixed {
    position: fixed;
    height: 45px;
    width: 100%;
    color: #f1f1f1;
    font-size: 16px;
    text-align: center;
    background-color: #08d1a5;
    bottom: 0;
    letter-spacing: 2px;
    display: flex;
    flex-direction: row;
    .dzfx {
      width: 18%;
      font-size: 12px;
      position: relative;
      p {
        &:first-child {
          margin-top: 4px;
          height: 22px;
          line-height: 22px;
        }
        &:last-child {
          height: 16px;
          line-height: 16px;
          font-size: 10px;
        }
        i {
          font-size: 20px;
        }
      }
    }
    .dz::after,
    .star::after {
      display: block;
      height: 25px;
      border-right: 1px solid #f1f1f1;
      content: "";
      background-color: pink;
      position: absolute;
      right: 0;
      top: 10px;
    }
    .zx {
      width: 46%;
      line-height: 45px;
      font-weight: 600;
      background-color: #039a79;
    }
  }
}
</style>
<style>
@import url("~mpvue-wxparse/src/wxParse.css");
.wxParse {
  font-size: 24rpx;
}
button {
  display: inline-block;
  background-color: transparent;
  color: #fff;
}
button::after {
  border: 1px solid transparent;
}
</style>
