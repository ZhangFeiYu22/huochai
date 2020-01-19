<template>
  <div class="actCounterfoil">
    <TopModule></TopModule>
    <div class="topHTitle">
      <p class="left">活动票根</p>
    </div>
    <div class="counterfoilType">
      <div
        class="typeItem"
        :class="typeNum == index ? 'active' : ''"
        v-for="(item,index) in choiceTypeList"
        :key="item.id"
        @click="typeChangeFun(index,item.num)"
      >{{item.name}}</div>
    </div>
    <div class="showList">
      <div class="showItem" v-for="item in showList" :key="item.id">
        <div class="itemLine1">{{item.title}}</div>
        <div class="itemLine2">
          共
          <span class="num">{{item.num}}</span>张
        </div>
        <div class="itemLine3">
          总价
          <span class="price">￥ {{item.totalPrice}}</span>
        </div>
        <div class="itemLine4">有效期至: {{item.actTime}}</div>
        <div class="status">{{item.status | statusFilter}}</div>
        <div class="btnBR btnBR1" v-if="item.status == 3">{{item.status | userStatusFilter}}</div>
        <div class="btnBR" v-else-if="item.status == 4">{{item.status | userStatusFilter}}</div>
        <div class="btnBR btnBR2" v-else-if="item.status == 5">{{item.status | userStatusFilter}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { activityOrderList, cancelOrder } from '@/api/allApi.js'
import { getToken } from '@/utils/auth.js'
import axios from 'axios'
import TopModule from '../../components/topModule'
export default {
  components: {
    TopModule
  },
  data () {
    return {
      typeNum: 0,
      choiceTypeList: [
        { num: 1, name: '全部' },
        { num: 3, name: '待付款' },
        { num: 4, name: '待验票' },
        { num: 5, name: '已完成' }
      ],
      list3: [],
      list4: [],
      list5: [],
      showList: [],
      showListAll: []
    }
  },
  created () {
    this.getActivityOrderList();
  },
  methods: {
    getActivityOrderList () {
      this.list3 = [];
      this.list4 = [];
      this.list5 = [];
      activityOrderList().then(res => {
        if (res.data.status == 200) {
          this.showList = res.data.result.data;
          this.showListAll = res.data.result.data;
          this.showList = this.showListAll;
          this.showListAll.forEach(item => {
            if (item.status == 3) {
              this.list3.push(item)
            } else if (item.status == 4) {
              this.list4.push(item)
            } else if (item.status == 5) {
              this.list5.push(item)
            }
          })
        }
        console.log('活动票根列表-----', res)
      })
    },
    typeChangeFun (index, statusNum) {
      this.typeNum = index;
      if (statusNum == 3) {
        this.showList = this.list3
      } else if (statusNum == 4) {
        this.showList = this.list4
      } else if (statusNum == 5) {
        this.showList = this.list5
      } else {
        this.showList = this.showListAll
      }
    }
  },
  filters: {
    statusFilter (val) {
      switch (val) {
        case 3:
          return '待付款'
          break;
        case 4:
          return '可使用'
          break;
        case 5:
          return '已完成'
          break;
        default:
          return
      }
    },
    userStatusFilter (val) {
      switch (val) {
        case 3:
          return '核销'
          break;
        case 4:
          return '核销'
          break;
        case 5:
          return '删除'
          break;
        default:
          return
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
.actCounterfoil {
  height: 100%;
  width: 100%;
  background-color: #f1f1f1;
  .counterfoilType {
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid #ccc;
    .typeItem {
      font-size: 26px;
      height: 60px;
      line-height: 60px;
      &.active {
        color: #000;
        font-size: 30px;
        border-bottom: 4px solid #666;
        font-weight: 600;
      }
    }
  }
  .showList {
    width: 95%;
    margin: 0 auto;
    padding: 15px 0;
    .showItem {
      background-color: #fff;
      padding: 15px;
      border-radius: 10px;
      position: relative;
      margin-bottom: 15px;
      .itemLine1 {
        font-size: 28px;
        font-weight: 600;
        color: #000;
        line-height: 46px;
      }
      .itemLine2 {
        font-size: 20px;
        line-height: 30px;
        .num {
          color: #f00;
          margin: 0 5px;
        }
      }
      .itemLine3 {
        font-size: 20px;
        line-height: 30px;
        .price {
          font-weight: 600;
        }
      }
      .itemLine4 {
        font-size: 18px;
        line-height: 40px;
        color: #999;
      }
      .status {
        width: 120px;
        text-align: center;
        position: absolute;
        right: 40px;
        top: 18px;
        font-size: 28px;
      }
      .btnBR {
        background-color: #e94f36;
        width: 120px;
        height: 42px;
        text-align: center;
        border: none;
        color: #eee;
        font-size: 26px;
        border-radius: 10px;
        box-shadow: 0 6px 0 0 #ff9d8d;
        letter-spacing: 8px;
        position: absolute;
        bottom: 28px;
        right: 40px;
        &.btnBR1 {
          background-color: #a4a4a4;
          box-shadow: 0 6px 0 0 #757575;
        }
        &.btnBR2 {
          background-color: #ffcd9b;
          box-shadow: 0 6px 0 0 #fee3c8;
        }
      }
    }
  }
}
</style>
  