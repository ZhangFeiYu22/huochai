<template>
  <div class="container">
    <div class="projectTop">
      <div class="topImg">
        <img :src="activityDetailData.coverimgurl" mode="widthFit" alt />
      </div>
      <div class="topDiv">
        <p class="title">{{activityDetailData.title}}</p>
        <!-- <p class="pp">费用: 100元</p>
        <p class="pp">2019-04-12 10:00 至 16:00</p>
        <p class="pp">
          秦淮区御道街街道金蝶创意园H1栋3楼
          <i></i>
        </p>-->
        <div class="intro">
          <WxPares :content="activityDetailData.introduction" />
        </div>
        <!-- <div class="existing">
          <p class="num">已有8人</p>
          <p class="btn">
            <i class="iconfont icon-dianji"></i>
            <span>报名</span>
          </p>
        </div>-->
      </div>
    </div>
    <p class="name">活动详情</p>
    <div class="projectSummary">
      <div class="imgBox">
        <img :src="activityDetailData.contenturl" mode="widthFix" alt />
      </div>
      <div class="wordBox">
        <p class="content" ref="contentDom">
          <WxPares :content="activityDetailData.content" />
        </p>
        <p
          class="btn-pick-up"
          v-show="contentC.length>400"
          @click.stop="togglePickUp(contentC,$event)"
        >
          {{isExpand?'收起':'展开'}}
          <i :class="isExpand ? 'zhankai' : 'shouqi'"></i>
        </p>
      </div>
    </div>
    <!-- 底部固定 -->
    <div class="footFixed clearfix">
      <div class="dz dzfx" @click="thumbsUpChange(activityDetailData.id)">
        <p>
          <i class="iconfont" :class="thumbsUpVal == 'true' ? 'icon-zan_active' : 'icon-zan'"></i>
        </p>
        <p>{{thumbsUpVal == 'true' ? '取消' : '点赞' }}</p>
      </div>
      <div class="star dzfx" @click="starChange(activityDetailData.id)">
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
      <div class="zx" @click="showModal">我要报名</div>
    </div>
    <!-- 报名弹窗 -->
    <div class="course_dialogBox" v-if="showModalStatus">
      <div class="formBox">
        <p class="closeIcon" @click="hideModal">X</p>
        <img class="bg" src="../../../static/images/formBg.png" mode="widthFit" alt />

        <form class="contentBox" @submit="formSubmit">
          <view class="section">
            <input name="name" type="text" placeholder="姓名" />
          </view>
          <view class="section">
            <input name="phone" type="number" placeholder="手机号" />
          </view>
          <button form-type="submit">完成</button>
        </form>
      </div>
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
      activityDetailData: '',
      contentC: '宠物咖啡店如今在世界各地遍地开花，人们希望通过与“小萌物”相处来减压。在可爱的动物对着客人的盘中餐卖萌的背后，是一种或许无解的“人道”争议。位于韩国首尔的“猫鼬咖啡店”和其他宠物咖啡店有些不一样。这里没有指定的动物区域，拖着长长尾巴的香猫随意走动，沙袋鼠在椅子之间来回跳，一只北',
      isExpand: false,
      showModalStatus: false
    }
  },
  mounted () {},
  onLoad: function (options) {
    if(options.isShare){
      this.shareVal = false
    }else if(wx.getStorageSync('shareVal')){
      this.shareVal = true
    }
    this.$http.get({
      url: `effect/activitysDetails/${options.id}`
    }).then(res => {
      this.activityDetailData = res
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
  onShow () {
    this.showModalStatus = false
  },
  methods: {
    formSubmit (e) {
      console.log('form发生了submit事件，携带数据为：', e.target.value)
      var userName = e.target.value.name;
      var mobile = e.target.value.phone;
      var name = /^[u4E00-u9FA5]+$/;
      if (userName == '') {
        wx.showToast({
          title: '请输入用户名',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
        return false
      } else if (mobile == '') {
        wx.showToast({
          title: '手机号不能为空',
        })
        return false
      }
      else if (mobile.length != 11) {
        wx.showToast({
          title: '手机号长度有误！',
          icon: 'success',
          duration: 1500
        })
        return false;
      }
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if (!myreg.test(mobile)) {
        wx.showToast({
          title: '手机号有误！',
          icon: 'success',
          duration: 1500
        })
        return false;
      }
      this.$http.post({
        url: `order/add`,
        data: {
          articleid: this.activityDetailData.id,
          name: userName,
          phone: mobile,
          num: '1'
        }
      }).then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: '报名成功',
            icon: 'success',
            duration: 1500
          })
          this.showModalStatus = false;
        }
      });
    },
    showModal () {
      this.showModalStatus = true;
    },
    hideModal () {
      this.showModalStatus = false;
    },
    togglePickUp (cont, e) {
      let target = this.$refs.contentDom;//点击后获取盒子节点
      this.isExpand = !this.isExpand;//切换状态
      if (this.isExpand) {
        //true
        //当下全文状态
        // target.style.height = "auto";
        target.style.maxHeight = "1000px";
      } else {
        //false
        // 当下收起状态
        target.style.maxHeight = "80px";//收起状态的容器高度
        //收起状态的高度

      }
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
      title: `${this.activityDetailData.title}`,   
      path: `${urlPath}?id=${this.activityDetailData.id}`,
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
  .projectTop {
    width: 90%;
    margin: 10px auto;
    .topImg {
      height: 150px;
      overflow: hidden;
      border-radius: 5px;
      img {
        width: 100%;
      }
    }
    .topDiv {
      box-shadow: 0 0 4px 2px #e1e1e1;
      padding: 10px;
      margin: 15px 0;
      border-radius: 5px;
      position: relative;
      .intro {
        font-size: 24rpx;
      }
      .title {
        font-size: 16px;
        color: #000;
        font-weight: 600;
        height: 30px;
        line-height: 30px;
      }
      .pp {
        font-size: 10px;
        height: 25px;
        line-height: 25px;
        color: #000;
        &::before {
          display: inline-block;
          content: "";
          width: 8px;
          height: 8px;
          border: 1px solid #707070;
          border-radius: 50%;
          vertical-align: middle;
          margin-right: 5px;
        }
        i {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-top: 1px solid #707070;
          border-right: 1px solid #707070;
          transform: rotate(45deg);
          margin-left: 10px;
        }
      }
      .existing {
        position: absolute;
        top: 15px;
        right: 20px;
        p {
          display: inline-block;
          font-size: 10px;
          font-weight: 600;
          &.num {
            color: #000;
          }
          &.btn {
            color: #fe6434;
            border: 1px solid #fe6434;
            border-radius: 5px;
            padding: 0 2px;
            i {
              font-size: 10px;
              font-weight: 600;
            }
          }
        }
      }
    }
  }
  .name {
    padding-left: 5%;
    font-size: 32rpx;
    font-weight: 600;
    color: #000;
    height: 50px;
    line-height: 50px;
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
  .projectSummary {
    width: 90%;
    margin: 0 auto;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 0 4px 2px #e1e1e1;
    .imgBox {
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
      background-color: #fe6434;
    }
  }
  // 弹窗
  .course_dialogBox {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    .formBox {
      width: 70%;
      border-radius: 10px;
      height: 700rpx;
      position: absolute;
      left: 50%;
      top: 50%;
      background-color: #fff;
      transform: translate(-50%, -50%);
      .bg {
        width: 100%;
      }
      .contentBox {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        padding: 340rpx 40rpx 20rpx;
        position: absolute;
        z-index: 9;
        left: 0;
        .section {
          background-color: #e1e1e1;
          padding: 10rpx 20rpx;
          margin-bottom: 20px;
          font-size: 28rpx;
        }
        button {
          width: 100%;
          background-color: #db3025;
          color: #fff;
          line-height: 36px;
          font-size: 28rpx;
        }
      }
      .closeIcon {
        position: absolute;
        z-index: 10;
        right: 5px;
        top: 5px;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        color: #fff;
      }
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