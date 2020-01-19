<template>
  <div class="mainIndex">
    <TopModule></TopModule>
    <!-- <div class="topHTitle">
      <p class="left">今日订单数</p>
      <p class="right">10</p>
    </div>-->
    <div class="menuBox">
      <div class="menuItem">
        <div class="imgBox" @click="searchCancel">
          <img class="menuBg" src="../../../static/images/menuBg.png" alt />
          <img class="menuIcon" src="../../../static/images/menu1.png" alt />
          <p class="itemName">搜索核销</p>
        </div>
      </div>
      <div class="menuItem" @click="goActivityCoun">
        <div class="imgBox">
          <img class="menuBg" src="../../../static/images/menuBg.png" alt />
          <img class="menuIcon" src="../../../static/images/menu2.png" alt />
          <p class="itemName">活动票根</p>
        </div>
      </div>
      <div class="menuItem" @click="goChoiceOrder">
        <div class="imgBox">
          <img class="menuBg" src="../../../static/images/menuBg.png" alt />
          <img class="menuIcon" src="../../../static/images/menu3.png" alt />
          <p class="itemName">精选订单</p>
        </div>
      </div>
      <div class="menuItem" @click="goSetting">
        <div class="imgBox">
          <img class="menuBg" src="../../../static/images/menuBg.png" alt />
          <img class="menuIcon" src="../../../static/images/menu4.png" alt />
          <p class="itemName">账号设置</p>
        </div>
      </div>
    </div>

    <div class="btnChange" @click="signOut">切换账号</div>
  </div>
</template>

<script>
import { searchOrderList, cancelOrder } from '@/api/allApi.js'
import { getToken } from '@/utils/auth.js'
import axios from 'axios'
import TopModule from '../../components/topModule'

export default {
  components: {
    TopModule
  },
  data () {
    return {
      codeUrl: '',
      isShow: true
    }
  },
  mounted () {
  },
  methods: {
    searchCancel () {
      this.$router.push({ name: 'cancelDetail' })
    },
    goActivityCoun () {
      this.$toast('敬请期待', { duration: 1500 });
      // this.$router.push({ name: 'activityCounterfoil' })
    },
    goChoiceOrder () {
      this.$router.push({ name: 'choiceOrder' })
    },
    goSetting () {
      this.$router.push({ name: 'setting' })
    },
    signOut () {
      this.$router.push({ name: 'login' });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
.mainIndex {
  height: 100%;
  width: 100%;
  background-color: #f1f1f1;
  .menuBox {
    margin: 0 auto;
    padding: 5%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    background-color: #fff;
    .menuItem {
      height: 100%;
      width: 50%;
      box-sizing: border-box;
      position: relative;
      display: flex;
      justify-content: space-around;
      padding: 10%;

      &:nth-child(1) {
        border-right: 2px solid #ccc;
        border-bottom: 2px solid #ccc;
      }
      &:nth-child(2) {
        border-bottom: 2px solid #ccc;
      }
      &:nth-child(3) {
        border-right: 2px solid #ccc;
      }
      .imgBox {
        width: 180px;
        height: 180px;
        position: relative;
        .menuBg {
          width: 180px;
          height: 180px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-62%, -46%);
        }
        .menuIcon {
          width: 110px;
          height: 110px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .itemName {
          width: 100%;
          text-align: center;
          font-size: 24px;
          position: absolute;
          bottom: -20%;
        }
      }
    }
  }
}
</style>
  