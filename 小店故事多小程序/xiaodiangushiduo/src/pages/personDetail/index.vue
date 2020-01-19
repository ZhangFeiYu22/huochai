<template>
  <div class="container">
    <div v-if="personDetailInfo !== ''">
      <div class="top">
        <div class="personTitle">
          <p class="title">{{personDetailInfo.title}}:{{personDetailInfo.subtitle}}</p>
          <p class="viewNum">
            <i class="iconfont icon-huo"></i>
            {{personDetailInfo.num}}
          </p>
        </div>
        <div class="imgBox" v-if="personDetailInfo.coverimgurl">
          <image class="br5" :src="personDetailInfo.coverimgurl" mode="widthFix" alt />
        </div>
      </div>
      <!-- 个人简介 -->
      <h3 class="tabName">我的个人简介</h3>
      <div class="preSummary">
        <div class="word" v-if="personDetailInfo.introduction">
          <WxPares :content="personDetailInfo.introduction" />
        </div>
        <div class="word" v-else>暂无数据</div>
      </div>
      <!-- 项目介绍 -->
      <h3 class="tabName">项目介绍</h3>
      <div class="proSummary">
        <div class="imgBox" v-if="personDetailInfo.contenturl">
          <image :src="personDetailInfo.contenturl" mode="aspectFill" alt="项目介绍图片" />
        </div>
        <div class="wordBox">
          <p class="title">{{personDetailInfo.subtitle}}</p>
          <p
            class="content"
            :class="isExpand ? 'unellipsis' : 'ellipsis-4'"
            v-if="personDetailInfo.content"
          >
            <WxPares :content="personDetailInfo.content" />
          </p>
          <p class="content" :class="isExpand ? 'unellipsis' : 'ellipsis-4'" v-else>暂无内容</p>
          <p class="btn-pick-up" v-if="content400" @click.stop="togglePickUp">
            {{isExpand?'收起':'展开'}}
            <i :class="isExpand ? 'zhankai' : 'shouqi'"></i>
          </p>
        </div>
      </div>
      <!-- 我的视频 -->
      <h3 class="tabName">我的视频</h3>
      <div class="myVideo" v-if="personDetailInfo.videourl">
        <video id="video" :controls="isVideoPlaying" :src="personDetailInfo.videourl"></video>
      </div>
      <div class="myVideo" v-else>
        <p class="noVideo">暂无相关视频</p>
      </div>
      <!-- 项目照片 -->
      <h3 class="tabName">我的照片</h3>
      <div class="swiperBox">
        <swiper :autoplay="autoplay" :interval="interval" :duration="duration">
          <block v-for="(item,itemp) in photoListData" :key="itemp">
            <swiper-item>
              <div class="imgBox">
                <image :src="item" mode="aspectFill" class="slide-image" />
              </div>
            </swiper-item>
          </block>
        </swiper>
      </div>
      <!-- 底部固定 -->
      <div class="footFixed clearfix">
        <div class="dz dzfx" @click="thumbsUpChange(personDetailInfo.id)">
          <p>
            <i class="iconfont" :class="thumbsUpVal == 'true' ? 'icon-zan_active' : 'icon-zan'"></i>
          </p>
          <p>{{thumbsUpVal == 'true' ? '取消' : '点赞' }}</p>
        </div>
        <div class="star dzfx" @click="starChange(personDetailInfo.id)">
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
  </div>
</template>

<script>
import ReturnHome from '../../components/ReturnHome'
import WxPares from 'mpvue-wxparse'
import { humanDetails, humanView, humanZan, humanZan1, humanZan0, collectGet, collectGet1, collectGet0 } from '@/utils/api'
export default {
  components: {
    ReturnHome,
    WxPares
  },
  data () {
    return {
      shareVal: true,
      content400: false,
      personDetailInfo: '',
      autoplay: false,
      interval: 5000,
      duration: 1000,
      photoListData: [],
      tapTime: '',   //阻止两次点击操作间隔太快
      thumbsUpVal: '',  //判断点赞取消
      starVal: '',  //判断收藏
      isAudioPlaying: false,
      isVideoPlaying: true,
      isExpand: false
    }
  },
  onLoad (options) {
    this.personDetailInfo = '';  //初始化一次   防止下次进来上次页面数据滞留
    if (options.isShare) {
      this.shareVal = false
    } else if (wx.getStorageSync('shareVal')) {
      this.shareVal = true
    }
    this.humanDetailsFun(options.id);
    this.humanViewFun(options.id);
    this.humanZanFun(options.id);
    this.collectGetFun(options.id);
  },
  methods: {
    // 获取人物详情信息
    async humanDetailsFun (pid) {
      let res = await humanDetails(pid);
      this.personDetailInfo = res;
      this.numChangeFun(this.personDetailInfo);
      var arr = res.imgsurl.split(';');
      arr.pop();
      this.photoListData = arr;
      if (this.personDetailInfo.content.length > 400) {
        this.content400 = true
      }else{
        this.content400 = false
      }
    },
    // 浏览量调用
    async humanViewFun (pid) {
      let res = await humanView(pid);
      console.log('浏览量调用')
    },
    // 是否点赞判断
    async humanZanFun (pid) {
      let res = await humanZan(pid);
      console.log('点赞判断', res)
      this.thumbsUpVal = res.message
    },
    // 点赞
    async humanZanFun1 (pid) {
      let res = await humanZan1(pid);
      console.log('点赞', res)
      if (res.code == 200) {
        this.thumbsUpVal = 'true';
        wx.showToast({
          title: '点赞成功',
          icon: 'success',
          duration: 2000
        })
      }
    },
    // 取消点赞
    async humanZanFun0 (pid) {
      let res = await humanZan0(pid);
      console.log('点赞取消', res)
      if (res.code == 200) {
        this.thumbsUpVal = 'false';
        wx.showToast({
          title: '取消点赞',
          icon: 'success',
          duration: 2000
        })
      }
    },
    // 是否收藏判断
    async collectGetFun (pid) {
      let res = await collectGet(pid);
      console.log('收藏判断', res)
      this.starVal = res.message
    },
    // 收藏
    async collectGetFun1 (pid) {
      let res = await collectGet1(pid);
      console.log('收藏', res)
      if (res.code == 200) {
        this.starVal = 'true';
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 2000
        })
      }
    },
    // 取消收藏
    async collectGetFun0 (pid) {
      let res = await collectGet0(pid);
      console.log('收藏取消', res)
      if (res.code == 200) {
        this.starVal = 'false';
        wx.showToast({
          title: '取消收藏',
          icon: 'success',
          duration: 2000
        })
      }
    },
    contactPhone (e) {
      wx.makePhoneCall({
        phoneNumber: '400-828-9717'
      })
    },
    togglePickUp () {
      this.isExpand = !this.isExpand;//切换状态
    },
    // 点赞
    thumbsUpChange (pid) {
      var nowTime = new Date();
      if (nowTime - this.tapTime < 1000) {
        return;
      } else {
        this.tapTime = nowTime;
        if (this.thumbsUpVal == 'false') {
          this.humanZanFun1(pid);
        } else {
          this.humanZanFun0(pid);
        }
      }
    },
    // 收藏
    starChange (pid) {
      var nowTime = new Date();
      if (nowTime - this.tapTime < 1000) {
        console.log('阻断')
        return;
      } else {
        this.tapTime = nowTime;
        if (this.starVal == 'false') {
          this.collectGetFun1(pid)
        } else {
          this.collectGetFun0(pid)

        }
      }
    }
  },
  onShareAppMessage: function (ops) {
    var urlPath = '/' + getCurrentPages()[getCurrentPages().length - 1].route;
    console.log('分享--', getCurrentPages(), '2---', urlPath)
    if (ops.from === "button") {
      // 来自页面内转发按钮
      console.log(ops.target);
    }
    return {
      title: `${this.personDetailInfo.title}${this.personDetailInfo.subtitle}`,
      path: `${urlPath}?id=${this.personDetailInfo.id}`,
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
  .top {
    width: 90%;
    margin: 10px auto;
    .personTitle {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: 5px;
      padding: 5px 0 10px;
      p {
        font-size: 32rpx;
        font-weight: 600;
        color: #000;
        line-height: 20px;
        &.title {
          width: 80%;
        }
        &.viewNum {
          width: 20%;
          text-align: right;
          i {
            color: #e54242;
          }
        }
      }
    }
    .imgBox {
      width: 100%;
      image {
        width: 100%;
      }
    }
  }

  .tabName {
    padding-left: 5%;
    font-size: 32rpx;
    color: #000;
    font-weight: 600;
    height: 50px;
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
  .preSummary {
    width: 90%;
    margin: 0 auto;
    // height: 200px;
    border-radius: 5px;
    box-shadow: 0 0 4px 2px #e1e1e1;
    .audioBox {
      height: 60px;
      position: relative;
      .yuyinBox {
        width: 60%;
        height: 100%;
        color: #4a4646;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        div {
          display: inline-block;
        }
        .iconBox {
          width: 80%;
          height: 28px;
          border: 1px solid #707070;
          margin-top: 16px;
          border-radius: 5px;
          i {
            vertical-align: middle;
            margin-left: 10px;
            font-size: 18px;
          }
        }
        .num {
          margin-left: 10px;
          vertical-align: middle;
          i {
            position: absolute;
            display: block;
            width: 5px;
            height: 5px;
            background-color: #f00;
            border-radius: 50%;
            top: 16px;
            left: 86%;
          }
        }
      }
    }
    .word {
      padding: 10px;
      font-size: 12px;
      text-align: justify;
    }
  }
  .proSummary {
    width: 90%;
    margin: 0 auto;
    border-radius: 5px;
    box-shadow: 0 0 4px 2px #e1e1e1;
    overflow: hidden;
    .imgBox {
      height: 200px;
      overflow: hidden;
      image {
        width: 100%;
      }
    }
    .wordBox {
      padding: 15px;
      text-align: justify;
      position: relative;
      padding-bottom: 40px;
      .title {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 10px;
        color: #333;
      }
      .content {
        font-size: 12px;
        line-height: 20px;
        overflow: hidden;
        transition: all 0.3s;
      }
      p.btn-pick-up {
        width: 100%;
        position: absolute;
        bottom: 10px;
        left: 0;
        text-align: center;
        color: #999;
        i {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-top: 1px solid #999;
          border-right: 1px solid #999;
          margin-left: 5px;
          &.zhankai {
            transform: rotate(-45deg);
          }
          &.shouqi {
            transform: translateY(-4px) rotate(135deg);
          }
        }
      }
    }
  }
  .myVideo {
    background-color: #333;
    width: 90%;
    height: 200px;
    margin: 0 auto;
    border-radius: 5px;
    overflow: hidden;
    position: relative;
    .noVideo {
      line-height: 200px;
      color: #fff;
      text-align: center;
    }
    video {
      width: 100%;
      height: 100%;
      // object-fit:fill;
    }
    .playDiv {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      background-color: rgba(0, 0, 0, 0.5);
      i {
        color: #fff;
        font-size: 40px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
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
      image {
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
