<template>
  <div class="choiceOrder">
    <TopModule></TopModule>
    <div class="topHTitle">
      <p class="left">精选订单</p>
    </div>
    <div class="choiceType">
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
        <div class="itemLine4">有效期至: {{item.endTime}}</div>
        <div class="status">{{item.status | statusFilter}}</div>
        <div
          class="btnBR"
          :class="item.status == 3 ? 'btnBR1' : (item.status == 5 ? 'btnBR2' : '')"
          @click="verificationClick(item)"
        >{{item.status | userStatusFilter}}</div>
      </div>
    </div>

    <div class="mask" v-if="maskVal">
      <div class="imgBG">
        <div class="maskTitle">
          <p class="pp1">核销该订单</p>
          <p class="pp2">请先核实订单信息是否正确</p>
        </div>
        <button class="cancel" @click="cancelFun">稍后</button>
        <button class="ensure" @click="verFun">立即核销</button>
      </div>
    </div>
  </div>
</template>

<script>
import { choiceOrderList, cancelOrder } from '@/api/allApi.js'
import { getToken } from '@/utils/auth.js'
import axios from 'axios'
import TopModule from '../../components/topModule'
export default {
  components: {
    TopModule
  },
  data () {
    return {
      maskVal: false,
      typeNum: 0,
      choiceTypeList: [
        { num: 1, name: '全部' },
        { num: 3, name: '待付款' },
        { num: 4, name: '可使用' },
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
    this.getChoiceOrderList();
  },
  methods: {
    getChoiceOrderList () {
      this.list3 = []
      this.list4 = []
      this.list5 = []
      choiceOrderList().then(res => {
        if (res.data.status == 200) {
          this.showListAll = res.data.result;
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
    },
    // 核销
    verificationClick (item) {
      if (item.status == 3) {
        console.log('不可点击')
      } else if (item.status == 4) {
        console.log('核销')
        this.maskVal = true;
      } else {
        console.log('删除')
      }

    },
    cancelFun () {
      this.maskVal = false;
    },
    verFun () {
      cancelOrder(this.verId).then(res => {
        if (res.data.code == 200) {
          this.$toast('操作成功', { duration: 1500 });
          this.maskVal = false;
          this.searchList.map((item, index) => {
            if (item.id == this.verId) {
              this.searchList.splice(index, 1)
            }
          })
        }
      })
    },
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
.choiceOrder {
  height: 100%;
  width: 100%;
  background-color: #f1f1f1;
  .choiceType {
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
.mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  .imgBG {
    height: 480px; /*px*/
    width: 588px; /*px*/
    // background: url("../../../static/images/maskbg.png");
    background: url("../../../static/images/maskbg.png");
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .maskTitle {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-35%);
      text-align: center;
      .pp1 {
        font-size: 40px; /*px*/
        color: #333;
        line-height: 100px; /*px*/
        letter-spacing: 3px;
        margin-bottom: 10px;
      }
      .pp2 {
        font-size: 24px;
        color: #999;
        font-weight: 600;
        letter-spacing: 4px;
      }
    }
    .cancel,
    .ensure {
      position: absolute;
      bottom: 0;
      padding: 0;
      width: 50%;
      height: 90px; /*px*/
      background: transparent;
      font-size: 30px; /*px*/
      border: none;
    }
    .cancel {
      left: 5%;
      letter-spacing: 4px;
    }
    .ensure {
      right: 0;
      color: #ff3939;
    }
  }
}
</style>
  