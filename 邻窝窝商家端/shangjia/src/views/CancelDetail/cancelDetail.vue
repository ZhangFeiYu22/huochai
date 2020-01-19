<template>
  <div class="cancelDetail">
    <TopModule></TopModule>
    <div class="content">
      <div class="searchBox">
        <input v-model="searchNum" type="text" placeholder="请输入取货码" />
        <button @click="goSearch">搜索</button>
      </div>
      <div class="searchList" v-if="searchList.length != 0 ">
        <div class="listItem" v-for="item in searchList" :key="item.id">
          <div class="left">
            <p class="orderNum">
              订单号:
              <span>{{item.orderNo}}</span>
            </p>
            <p class="orderName">{{item.title}}</p>
            <div class="orderAmount">
              <p>
                共
                <span>{{item.num}}</span>件
              </p>
              <p>
                可用次数：
                <span>{{item.useNum}}</span>
              </p>
            </div>
          </div>
          <div class="right">
            <p class="status">{{item.status | statusFilter}}</p>
            <button
              class="statusBtn"
              :class="item.status == 3 ? 'btnBR1' : (item.status == 5 ? 'btnBR2' : '')"
              @click="hexiaoFun(item)"
            >{{item.status | userStatusFilter}}</button>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="nono">
          <img src="../../../static/images/noorder.png" alt />
        </div>
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
import { searchOrderList, cancelOrder } from '@/api/allApi.js'
import { getToken } from '@/utils/auth.js'
import TopModule from '../../components/topModule'
import axios from 'axios'
export default {
  components: {
    TopModule
  },
  data () {
    return {
      maskVal: false,
      searchNum: '',
      verId: '',
      searchList: []
    }
  },
  created () {
  },
  methods: {
    getSearchList (searchNum) {
      if (searchNum == '') {
        this.$toast('取货码不能为空', { duration: 1500 });
      } else {
        searchOrderList(searchNum).then(res => {
          if (res.status == 200 && res.data.result.length > 0) {
            this.searchList = res.data.result
          } else if (res.status == 200 && res.data.result.length == 0) {
            this.$toast('暂无相关取货码订单', { duration: 1500 });
          } else {
            this.$toast('请输入正确的取货码', { duration: 1500 });
          }
        })
      }
    },
    hexiaoFun (item) {
      console.log(item)
      this.maskVal = true;
      this.verId = item.id;
      this.verCode = item.code;
    },
    cancelFun () {
      this.maskVal = false;
    },
    verFun () {
      cancelOrder(this.verId, this.verCode).then(res => {
        console.log(res)
        if (res.data.status == 200) {
          var useN = res.data.result.useNum
          if(useN>1){
            this.$toast(`还有${useN}次可用`, { duration: 2000 });
          }else{
            this.$toast('操作成功', { duration: 1500 });
          }
          this.maskVal = false;
          this.searchNum = '';
          this.searchList.map((item, index) => {
            if (item.id == this.verId) {
              this.searchList.splice(index, 1)
            }
          })
        }
      })
    },
    goSearch () {
      this.getSearchList(this.searchNum);
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
.cancelDetail {
  width: 100%;
  background-color: #f1f1f1;

  .content {
    width: 90%;
    padding: 40px 0;
    margin: 0 auto;
    .searchBox {
      input {
        display: block;
        width: 80%;
        margin: 0 auto;
        height: 58px; /*px*/
        padding: 10px 0;
        font-size: 30px; /*px*/
        text-align: center;
        border-radius: 50px;
        border: 1px solid #999;
        background-color: transparent;
      }
      button {
        display: block;
        width: 40%;
        margin: 50px auto 30px;
        height: 60px; /*px*/
        background: #e94f36;
        border: none;
        border-radius: 50px;
        color: #eee;
        font-size: 36px; /*px*/
      }
    }
    .searchList {
      .listItem {
        padding: 10px 0 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border-bottom: 12px solid #e8e8e8; /*px*/
        margin-bottom: 30px;
        .left {
          width: 75%;
          .orderNum {
            font-size: 30px; /*px*/
            line-height: 40px;
          }
          .orderName {
            font-size: 34px; /*px*/
            line-height: 70px;
          }
          .orderAmount {
            font-size: 32px; /*px*/
            line-height: 60px;
            display: flex;
            p {
              margin-right: 20px;
              span {
                color: #e94f36;
                margin: 0 10px;
              }
            }
          }
        }
        .right {
          width: 25%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: center;
          .status {
            font-size: 36px; /*px*/
            &.statusED {
              color: #e94f36;
            }
          }
          .statusBtn {
            background-color: #e94f36;
            height: 50px; /*px*/
            border: none;
            color: #eee;
            font-size: 32px;
            border-radius: 10px;
            box-shadow: 0 6px 0 0 #ff9d8d;
            letter-spacing: 8px;
          }
        }
      }
    }
    .nono {
      width: 220px; /*px*/
      height: 220px; /*px*/
      position: absolute;
      left: 50%;
      bottom: 25%;
      transform: translateX(-50%);
      img {
        width: 100%;
        height: 100%;
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
}
</style>
  