<template>
  <div>
    <transfer
      :transferData_left = "transferData_left"
      :transferData_right = "transferData_right"
      showFlied="name"
      childFlid="children"
      titleleft="列表1"
      titleright="列表2"
      :callback="callback">
      <el-input slot = "search1" placeholder="输入关键字，按回车" icon="search" v-model="search1" :on-icon-click="search1Click"></el-input>
      <el-input slot = "search2" placeholder="输入关键字，按回车" icon="search" v-model="search2" :on-icon-click="search2Click"></el-input>
    </transfer>
  </div>
</template>

<script>
  import transfer from './pro/transferPro'
  export default {
//    beforeMount () {
//      this.transferData_left = this.datafomat
//      console.log('zzz' + this.datafomat)
//    },
    components: {
      transfer
    },
    data () {
      return {
        datafomat: [],
        search1: '',
        search2: '',
        transferData_left: [],
        transferData_right: [],
        // 可以在回调函数中进行提交操作以及数据操作。
        callback: function () {
//          console.log(this.transferData_left)
//          console.log(this.transferData_right)
        }
      }
    },
    props: {
      AuthorizedData: Array
    },
    methods: {
      search1Click () {
      },
      search2Click () {
      },
      // 监听数据
      getTransferEditData (val) {
        console.log(val)
      }
    },
    watch: {
      AuthorizedData () {
        this.transferData_left = this.AuthorizedData
      }
    }
  }
</script>

<style scoped>
</style>
