<template>
  <div class="topModule">
      <img class="topBg" src="../../static/images/topBg.png" alt />
      <div class="wordBox">
        <div class="left">
          <img class="logImg" src="../../static/images/log.png" alt />
        </div>
        <div class="right">
          <div class="title">鲜天鲜地</div>
          <div class="address">
            <p class="iconBox">
              <img class="icon" src="../../static/images/locationIcon.png" />
            </p><span>扇骨里社区</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
.topModule {
    height: 272px;
    position: relative;
    .topBg {
      width: 100%;
      height: 100%;
    }
    .wordBox {
      height: 100px;
      position: absolute;
      top: 102px;
      display: flex;
      flex-direction: row;
      left: 10%;
      .left {
        width: 104px;
        height: 100px;
        margin-right: 50px;
        .logImg {
          width: 100%;
          height: 100%;
        }
      }
      .right {
        color: #fff;
        .title {
          height: 75px;
          line-height: 75px;
          font-size: 40px;
          margin-top: -10px;
        }
        .address {
          height: 45px;
          line-height: 45px;
          font-size: 20px;
          .iconBox {
            display: inline-block;
            width: 20px;
            height: 20px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          span{
            font-size: 20px;
            letter-spacing: 4px;
          }
        }
      }
    }
  }
</style>
