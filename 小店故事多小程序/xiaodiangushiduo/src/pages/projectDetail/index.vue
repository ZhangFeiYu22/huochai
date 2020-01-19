<template>
  <div class="container">
    <div class="topSummary">
      <div class="imgBox">
        <img :src="projectDetailData.coverimgurl" alt />
      </div>
      <div class="wordBox">
        <p class="title">{{projectDetailData.title}}</p>
        <p class="content" :class="isExpand ? 'unellipsis' : 'ellipsis-4'">
          <WxPares :content="projectDetailData.introduction" />
        </p>
        <p
          class="btn-pick-up"
          v-show="projectDetailData.introduction.length>400"
          @click="togglePickUp"
        >
          {{isExpand?'收起':'展开'}}
          <i :class="isExpand ? 'zhankai' : 'shouqi'"></i>
        </p>
      </div>
    </div>
    <!-- 项目照片 -->
    <h3 class="tabName">项目照片</h3>
    <div class="swiperBox">
      <swiper :autoplay="autoplay" :interval="interval" :duration="duration">
        <block v-for="(item,indexp) in photoListData" :key="indexp">
          <swiper-item>
            <div class="imgBox">
              <img :src="item" class="slide-image" />
            </div>
          </swiper-item>
        </block>
      </swiper>
    </div>
    <!-- 加盟条件 -->
    <h3 class="tabName">加盟条件</h3>
    <div class="league">
      <div class="term">
        <WxPares :content="projectDetailData.content" />
        <!-- <p>1. 需要启动资金10万元</p>
        <p>2. 需要营业场所面积大于100平米,沿街合规店铺</p>
        <p>3. 具体一些要求需要面谈</p>-->
      </div>
    </div>
    <!-- 底部固定 -->
    <div class="footFixed clearfix">
      <div class="dz dzfx" @click="thumbsUpChange(projectDetailData.id)">
        <p>
          <i class="iconfont" :class="thumbsUpVal == 'true' ? 'icon-zan_active' : 'icon-zan'"></i>
        </p>
        <p>{{thumbsUpVal == 'true' ? '取消' : '点赞' }}</p>
      </div>
      <div class="star dzfx" @click="starChange(projectDetailData.id)">
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
      <button class="zx" @click="contactPhone">我要咨询</button>
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
      tapTime: '',   //阻止两次点击操作间隔太快
      thumbsUpVal: '',  //判断点赞取消
      starVal: '', //判断收藏
      projectDetailData: '',
      autoplay: false,
      interval: 5000,
      duration: 1000,
      photoListData: [],
      contentC: '宠物咖啡店如今在世界各地遍地开花，人们希望通过与“小萌物”相处来减压。在可爱的动物对着客人的盘中餐卖萌的背后，是一种或许无解的“人道”争议。位于韩国首尔的“猫鼬咖啡店”和其他宠物咖啡店有些不一样。这里没有指定的动物区域，拖着长长尾巴的香猫随意走动，沙袋鼠在椅子之间来回跳，一只北极狐恶作剧般地在客人身后的窗子下乱转，直到挑起一场和沙袋鼠之间的斗争。与此同时，各种各样的猫咪在喂食它们的“金主”桌子上徘徊。 自从20年前在台湾首次亮相之后，宠物咖啡店以星火燎原之势在亚洲蔓延，随后在各大洲遍地开花。如今，“猫咖”已不是什么新鲜事物。在宠物咖啡店的前沿阵地亚洲，这类店铺里只有你想不到、没有你见不到的小动物。 在日本东京涩谷区，兔子咖啡店“Ms Bunny”中饲养了十多只兔子和几只刺猬。兔子大多待在笼子里，但它们在“放风”时不会安静地蹲着，而是十分活泼。来这里的客人大多图个好心情，希望毛茸茸的兔子能让他们的',
      isExpand: false
    }
  },
  mounted () { },
  onLoad: function (options) {
    if (options.isShare) {
      this.shareVal = false
    } else if (wx.getStorageSync('shareVal')) {
      this.shareVal = true
    }
    this.$http.get({
      url: `/effect/projectsDetails/${options.id}`
    }).then(res => {
      this.projectDetailData = res;
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
    // 是否收藏
    this.$http.get({
      url: `collect/get/${options.id}`
    }).then(res => {
      if (res.code == 200) {
        this.starVal = res.message
      }
    });
  },
  onShow () {
    this.isExpand = false;
  },
  methods: {
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
        console.log('阻断')
        return;
      } else {
        this.tapTime = nowTime;
        if (this.thumbsUpVal == 'false') {
          this.$http.get({
            url: `userarticle/add/${pid}`
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
            url: `userarticle/delete/${pid}`
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
    starChange (pid) {
      var nowTime = new Date();
      if (nowTime - this.tapTime < 1000) {
        console.log('阻断')
        return;
      } else {
        this.tapTime = nowTime;
        if (this.starVal == 'false') {
          this.$http.get({
            url: `collect/add/${pid}`
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
            url: `collect/delete/${pid}`
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
      title: `${this.projectDetailData.title}`,
      path: `${urlPath}?id=${this.projectDetailData.id}`,
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
  .topSummary {
    width: 90%;
    margin: 15px auto;
    border-radius: 5px;
    box-shadow: 0 0 4px 2px #e1e1e1;
    overflow: hidden;
    .imgBox {
      height: 200px;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
    .wordBox {
      padding: 15px;
      text-align: justify;
      position: relative;
      padding-bottom: 40px;
      .title {
        font-size: 32rpx;
        font-weight: 600;
        margin-bottom: 10px;
        color: #333;
      }
      .content {
        font-size: 12px;
        color: #999;
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
  .league {
    width: 90%;
    margin: 0 auto;
    .name {
      font-size: 14px;
      font-weight: 600;
      color: #000;
      height: 40px;
      line-height: 40px;
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
    .term {
      box-shadow: 0 0 4px 2px #e1e1e1;
      border-radius: 5px;
      padding: 10px;
      p {
        color: #333;
        font-size: 28rpx;
        height: 25px;
        line-height: 25px;
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
      border-radius: 0;
      padding: 0;
      font-size: 32rpx;
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