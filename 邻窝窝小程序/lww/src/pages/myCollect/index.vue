<template>
  <div class="collect">
    <!-- 分类栏 -->
    <div class="typeContent">
      <van-tabs :active="tabActiveNum" color="#707070">
        <hr class="line" />
        <van-tab title="全部">
          <div v-if="collectList_all.length == 0">
            <Nodata :text="'暂无你要的数据'"></Nodata>
          </div>
          <div v-else>
            <div v-for="item in collectList_all" :key="item.id">
              <van-swipe-cell :right-width="65" async-close @close="onClose($event,item)">
                <van-cell-group>
                  <div class="contentBox" @click="goDetail(item)">
                    <div class="left">
                      <img v-if="item.img" :src="imgUrlHttp + item.img" mode="aspectFill" />
                    </div>
                    <div class="right">
                      <h4>{{item.name}}</h4>
                    </div>
                  </div>
                </van-cell-group>
                <view slot="right">取消收藏</view>
              </van-swipe-cell>
            </div>
          </div>
        </van-tab>
        <van-tab title="代金券">
          <div v-if="collectList_voucher.length == 0">
            <Nodata :text="'暂无你要的数据'"></Nodata>
          </div>
          <div v-else>
            <div v-for="item in collectList_voucher" :key="item.id" @click="goDetail(item)">
              <van-swipe-cell :right-width="65" async-close @close="onClose($event,item)">
                <van-cell-group>
                  <div class="contentBox">
                    <div class="left">
                      <img v-if="item.img" :src="imgUrlHttp + item.img" mode="aspectFill" />
                    </div>
                    <div class="right">
                      <h4>{{item.name}}</h4>
                    </div>
                  </div>
                </van-cell-group>
                <view slot="right">取消收藏</view>
              </van-swipe-cell>
            </div>
          </div>
        </van-tab>
        <van-tab title="活动">
          <div v-if="collectList_activity.length == 0">
            <Nodata :text="'暂无你要的数据'"></Nodata>
          </div>
          <div v-else>
            <div v-for="item in collectList_activity" :key="item.id" @click="goDetail(item)">
              <van-swipe-cell :right-width="65" async-close @close="onClose($event,item)">
                <van-cell-group>
                  <div class="contentBox">
                    <div class="left">
                      <img v-if="item.img" :src="imgUrlHttp + item.img" mode="aspectFill" />
                    </div>
                    <div class="right">
                      <h4>{{item.name}}</h4>
                    </div>
                  </div>
                </van-cell-group>
                <view slot="right">取消收藏</view>
              </van-swipe-cell>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import globalStore from '@/utils/store'
import ModuleActivity from '../../components//ModulActivity'
import Nodata from '../../components/Nodata'
import { getCollectList, delCollect } from '@/api/collect'
export default {
  components: {
    ModuleActivity, Nodata
  },
  data () {
    return {
      imgUrlHttp: globalStore.state.imgUrlHttp,
      tabActiveNum: 0,
      collectList_all: [],
      collectList_voucher: [],
      collectList_activity: []
    }
  },
  onLoad () {
    this.fetchCollectList(3)
  },
  methods: {
    async fetchCollectList (type) {
      this.collectList_all = [];
      this.collectList_voucher = [];
      this.collectList_activity = [];
      let data = await getCollectList(type)
      if (data.status == 200) {
        this.collectList_all = data.result
        let result = data.result
        result.forEach(item => {
          if (item.type == 1) {
            this.collectList_voucher.push(item)
          } else if (item.type == 2) {
            this.collectList_activity.push(item)
          }
        });
      }
    },
    goDetail (item) {
      if (item.type == 2) {
        wx.navigateTo({
          url: `/pages/activityDetail/main?activity_id=${item.objectId}`
        })
      } else {
        wx.navigateTo({
          url: `/pages/cashCoupon/main?choice_id=${item.objectId}`
        })
      }
    },
    async delCollectFun (data) {
      let result = await delCollect(data)
      if (result.status == 200) {
        this.isCollect = false
        this.fetchCollectList(3)
        wx.showToast({
          title: '取消收藏',
          icon: 'none',
          duration: 2000
        })
      }
    },
    onClose (event, item) {
      var _this = this;
      let data = {
        objectId: item.objectId,
        type: item.type
      }
      const { position, instance } = event.mp.detail;
      switch (position) {
        case 'left':
        case 'cell':
          instance.close();
          break;
        case 'right':
          wx.showModal({
            title: '提示',
            content: '确定取消收藏吗?',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                _this.delCollectFun(data)
                instance.close();
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          break;
      }
    }
  }
}
</script>

<style lang="less" scoped>
.collect {
  height: 30px;
  line-height: 30px;
  .typeContent {
    /deep/ .van-tab {
      font-size: 13px;
    }
    /deep/ .van-tab--active {
      color: #333;
      font-weight: 600;
      font-size: 14px;
    }
    /deep/ .van-swipe-cell__right {
      display: inline-block;
      width: 65px;
      height: 100%;
      line-height: 25px;
      padding: 20px 10px;
      color: #fff;
      text-align: center;
      background-color: #f44;
      word-wrap: break-word;
      font-size: 16px;
      border-top: 10px solid #fff;
      border-bottom: 5px solid #f1f1f1;
    }
    .line {
      border-bottom: 1px solid #f1f1f1;
    }
    .contentBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-bottom: 5px solid #f6f6f6;
      .left {
        width: 120px;
        height: 80px;
        border-radius: 5px;
        margin-right: 10px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .right {
        flex: 1;
        text-align: justify;
        box-sizing: border-box;
        width: 50%;
        h4 {
          font-size: 15px;
        }
      }
    }
  }
}
</style>
