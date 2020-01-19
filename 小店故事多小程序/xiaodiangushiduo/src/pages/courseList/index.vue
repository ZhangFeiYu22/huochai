<template>
  <div class="container">
    <TopBananer :topImgUrl="topImgUrl"></TopBananer>
    <div class="sorting">
      <div class="sortLeft">
        排序
        <i class="iconfont icon-xiangxia"></i>
      </div>
      <div class="sortRight" @click="sortChange">
        <i class="iconfont icon-qiehuan1"></i>
      </div>
    </div>
    <div class="projectList_col" v-if="sortVal">
      <div class="projectItem" v-for="item in courseData" :key="item.id" @click="goDetail(item.id)">
        <div class="imgBox">
          <img :src="item.coverimgurl" alt />
        </div>
        <div class="summary">
          <div class="name">
            <p class="title ellipsis-1">{{item.title}}</p>
            <!-- <p class="price">¥&nbsp;{{item.id}}</p> -->
          </div>
          <!-- <div class="su">
            <p class="auth">
              <span>{{item.id}}</span>
              <span>{{item.id}}</span>
            </p>
            <p class="view">
              <i class="iconfont icon-iconset0207"></i>
              <span>{{item.id}}</span>
            </p>
          </div>-->
        </div>
      </div>
    </div>
    <div class="projectList_row" v-else>
      <div class="projectItem" v-for="item in courseData" :key="item.id" @click="goDetail(item.id)">
        <div class="imgBox">
          <img :src="item.coverimgurl" alt />
        </div>
        <div class="summary">
          <div class="name ellipsis-1">{{item.title}}</div>
          <!-- <div class="auth_name">
            <span>{{item.id}}</span>
            <span>{{item.id}}</span>
          </div>-->
          <!-- <div class="su">
            <p class="price">
              <span>¥&nbsp;{{item.id}}</span>
            </p>
            <p class="view">
              <i class="iconfont icon-iconset0207"></i>
              <span>{{item.id}}</span>
            </p>
          </div>-->
        </div>
      </div>
    </div>
    <FixedMenu></FixedMenu>
  </div>
</template>

<script>
import globalStore from '@/store/globalStore'
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
      sortVal: false,
      courseData: []
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
        url: 'effect/course'
      }).then(res => {
        this.courseData = res;
        this.numChangeFun(this.courseData);
      });
      // 广告位
      this.$http.get({
        url: 'effect/ad/2'
      }).then(res => {
        if (res.length == 0) {
          return
        } else {
          this.topImgUrl = res;
        }
      });
    },
    goDetail (cid) {
      wx.navigateTo({
        url: `/pages/courseDetail/main?id=${cid}&isShare=${cid}`
      })
    },
    sortChange () {
      this.sortVal = !this.sortVal
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.container {
  .sorting {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px 10px 0;
    height: 40px;
    line-height: 40px;
    .sortLeft {
      font-weight: 600;
      font-size: 30rpx;
      color: #000;
      i {
        font-size: 24rpx;
        font-weight: 600;
        margin-left: 5px;
      }
    }
    .sortRight {
      i {
        font-size: 44rpx;
        color: #999;
      }
    }
  }
  .projectList_col {
    display: flex;
    flex-direction: column;
    padding: 10px;
    .projectItem {
      position: relative;
      width: 100%;
      margin-bottom: 15px;
      border-radius: 6px;
      box-shadow: 0 0 4px 2px #e1e1e1;
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
          font-size: 32rpx;
          height: 32px;
          line-height: 32px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          p {
            &.title {
              color: #333;
              font-weight: 600;
            }
            &.price {
              color: #ff2222;
              font-weight: 600;
            }
          }
        }
        .su {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          height: 16px;
          line-height: 16px;
          .auth {
            font-size: 28rpx;
            span {
              &:first-child::after {
                display: inline-block;
                content: "";
                width: 6px;
                height: 10px;
                border-right: 1px solid #039a79;
                margin: 0 5px;
              }
            }
          }
          .view {
            font-size: 28rpx;
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
      }
    }
  }
  .projectList_row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 10px;
    .projectItem {
      position: relative;
      width: 48%;
      margin-bottom: 15px;
      border-radius: 6px;
      box-shadow: 0 0 4px 2px #e1e1e1;
      overflow: hidden;
      .imgBox {
        height: 100px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .summary {
        padding: 5px 10px 15px;
        .name {
          font-size: 28rpx;
          color: #333;
          font-weight: 600;
          height: 32px;
          line-height: 32px;
        }
        .auth_name {
          font-size: 20rpx;
          padding-bottom: 5px;
          border-bottom: 1px solid #eee;
          margin-bottom: 5px;
          span {
            vertical-align: middle;
            &:first-child::after {
              display: inline-block;
              content: "";
              width: 6px;
              height: 10px;
              border-right: 1px solid #039a79;
              margin: 0 5px;
              vertical-align: middle;
            }
          }
        }
        .su {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          height: 16px;
          line-height: 16px;
          .price {
            font-size: 28rpx;
            color: #ff2222;
            font-weight: 600;
          }
          .view {
            font-size: 28rpx;
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
      }
    }
  }
}
</style>
