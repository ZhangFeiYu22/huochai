<template>
  <div class="activity">
    <div
      class="activityList"
      @click="goActivityDetail(item)"
      v-for="item in acticityList"
      :key="item.id"
    >
      <div class="topImg">
        <img :src="item.conUrl" mode="aspectFill" />
      </div>
      <div class="bottomBox">
        <div class="bottomBoxContent">
          <div class="lineTitle">{{item.title}}</div>
          <div class="lineCome lineAddress">
            <i class="iconfont icon-04"></i>
            <p class="ellipsis-1">{{item.address}}</p>
          </div>
          <div class="lineCome lineTime">
            <i class="iconfont icon-shijian"></i>
            <p>{{item.acttime}}</p>
          </div>
          <div class="lineCome lineMoney">
            <i class="iconfont icon-jinqian"></i>
            <p>材料费 {{item.fee}} ¥/人</p>
          </div>
        </div>
        <div class="info">提醒 : 人数报完即止</div>
      </div>
    </div>
  </div>
</template>

<script>
import { activityList } from '@/utils/api'
export default {
  props: ['acticityList'],
  data () {
    return {
      activityListData: []
    }
  },
  methods: {
    goActivityDetail (data) {
      console.log(data)
      wx.navigateTo({
        url: `/pages/activityDetail/main?activityData=${JSON.stringify(data)}`
      })
    }
  }

}
</script>

<style lang="less" scoped>
.activityList {
  box-shadow: 0 4px 8px #ddd;
  margin-bottom: 20px;
  .topImg {
    height: 168px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .bottomBox {
    padding: 0 10px;
    .bottomBoxContent {
      border-bottom: 1px solid rgba(112, 112, 112, 0.1);
      padding: 10px 0;
      .lineCome {
        height: 25px;
        line-height: 25px;
        font-size: 14px;
        color: #89a0a9;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        i {
          display: inline-block;
          width: 5%;
          margin-right: 2%;
          vertical-align: middle;
        }
        p {
          width: 93%;
          display: inline-block;
          vertical-align: middle;
        }
      }
      .lineTitle {
        font-weight: 600;
        font-size: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .info {
      font-size: 14px;
      color: #89a0a9;
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>
