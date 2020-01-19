<template>
  <div class="switchShops">
    <TopModule></TopModule>
    <div class="shops">
      <div class="shopsItem" v-for="(item,index) in shopsList" :key="item.id">
        <span class="shopName">{{item.name}}</span>
        <span
          class="select"
          :class="selectNum == index ? 'selected' : ''"
          @click="selectShop(item,index)"
        ></span>
      </div>
    </div>
    <div class="btnChange" @click="sureShop">确认切换</div>

    <div class="dialog" v-show="sureDialog">
      <div class="dialog_mask"></div>
      <div class="dialog_container">
        <div class="dialog_content">
          <div class="dialog_content_top">确认切换店铺吗?</div>
          <div class="dialog_btn">
            <p class="btn cancel" @click="cancel">取消</p>
            <p class="btn sure" @click="sure">确定</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { hotelsList } from '@/api/allApi.js'
import { getToken } from '@/utils/auth.js'
import axios from 'axios'
import TopModule from '../../components/topModule'
export default {
  components: {
    TopModule
  },
  data () {
    return {
      selectNum: 0,
      shopsList: [],
      interimShop: {},
      sureDialog: false
    }
  },
  created () {
    this.getHotelsList();
  },
  methods: {
    getHotelsList () {
      hotelsList().then(res => {
        if (res.data.status == 200) {
          this.shopsList = res.data.result.data;
        }
        console.log('店家列表-----', res)
      })
    },
    selectShop (item, index) {
      this.selectNum = index;
      console.log(item)
      this.interimShop = item
    },
    sureShop () {
      this.sureDialog = true
    },
    cancel () {
      this.sureDialog = false
    },
    sure () {
      console.log('确定切换的店家信息---', this.interimShop)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
.switchShops {
  height: 100%;
  width: 100%;
  background-color: #f1f1f1;
  .shops {
    width: 80%;
    margin: 20% auto 0;
    .shopsItem {
      padding-top: 40px;
      height: 80px;
      line-height: 80px;
      border-bottom: 2px solid #999;
      position: relative;
      .shopName {
        font-size: 30px;
      }
      .select {
        display: inline-block;
        width: 22px;
        height: 22px;
        position: absolute;
        right: 0;
        bottom: 18px;
        border: 8px solid #ccc;
        border-radius: 100%;
        &.selected {
          background-color: #ccc;
          &::after {
            display: block;
            content: "";
            width: 15px;
            height: 30px;
            border-bottom: 3px solid #666;
            border-right: 3px solid #666;
            transform: rotate(45deg) translate(-5px, -15px);
          }
        }
      }
    }
  }
}
.dialog {
  .dialog_mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  .dialog_container {
    background: #fff;
    width: 500px;
    height: 240px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    margin: 0 auto;
    .dialog_content {
      text-align: center;
      padding-top: 50px;
      .dialog_content_top {
        font-size: 30px;
      }
      .dialog_btn {
        display: flex;
        margin-top: 40px;
        justify-content: space-around;
        .btn {
          margin-top: 20px;
          width: 100px;
          height: 50px;
          line-height: 50px;
          font-size: 26px;
          border-radius: 5px;
          color: #fff;
          &.sure {
            background-color: #409eff;
          }
          &.cancel {
            background-color: #909399;
          }
        }
      }
    }
  }
}
</style>
  