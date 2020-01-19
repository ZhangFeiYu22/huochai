<template>
  <div class="homePage-wrap">
    <el-table :data="countDataList"  height="620" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="nickName" align="center" label="用户名"></el-table-column>
      <el-table-column prop="collectnum" align="center" label="收藏"></el-table-column>
      <el-table-column prop="activitynum" align="center" label="活动订单数">
        <template slot-scope="scope">
          <div style="color: #f44; text-decoration: underline" @click="actOrderClick(scope.row)">{{ scope.row.activitynum }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="activityamount" align="center" label="活动订单总额"></el-table-column>
      <el-table-column prop="vouchernum" align="center" label="代金券订单数">
        <template slot-scope="scope">
          <div style="color: #f44; text-decoration: underline" @click="vouOrderClick(scope.row)">{{ scope.row.vouchernum }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="voucheramount" align="center" label="代金券订单总额"></el-table-column>
    </el-table>

    <!-- 活动 -->
    <el-dialog title="活动订单列表" :visible.sync="activityOrderDialog">
      <el-table :data="actList" height="330">
        <el-table-column property="orderNo" label="订单号" width="150"></el-table-column>
        <el-table-column property="title" label="活动名称" width="200"></el-table-column>
        <el-table-column property="totalPrice" label="支付金额"></el-table-column>
        <el-table-column property="status" label="订单状态" :formatter="formatterStatus"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 代金券 -->
    <el-dialog title="代金券订单列表" :visible.sync="voucherOrderDialog">
      <el-table :data="vouList" height="330">
        <el-table-column property="orderNo" label="订单号" width="150"></el-table-column>
        <el-table-column property="title" label="活动名称" width="200"></el-table-column>
        <el-table-column property="totalPrice" label="支付金额"></el-table-column>
        <el-table-column property="status" label="订单状态" :formatter="formatterStatus"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
import { getCountDataList, actSearchList, vouSearchList } from 'api/lww'
import { statusCode } from 'common/js/config'
import { queryParam_count } from 'common/js/utils'
export default {
  data () {
    return {
      activityOrderDialog: false,
      voucherOrderDialog: false,
      addForm: {
        nickName: "",
        collectnum: "",
        activitynum: "",
        activityamount: "",
        vouchernum: "",
        voucheramount: "",
        id: ""
      },
      countDataList: [],
      actList: [],
      vouList: []
    }
  },
  created () {
    this._getCountDataList()
  },
  methods: {
    _getCountDataList () {
      getCountDataList().then((res) => {
        if (res.status === statusCode) {
          this.countDataList = res.result
        }
      })
    },
    actOrderClick (ad) {
      var _this = this;
      if (ad.activitynum !== 0) {
        this.activityOrderDialog = true
        // 列表
        actSearchList(ad.id).then((res) => {
          if (res.status === statusCode) {
            this.actList = res.result
            console.log('1---',res.result)
          }
        }).catch((error) => {
          console.log(error)
          _this.$message.error({
            message: '请求出现异常',
            duration: 2000
          })
        })
      } else {
        _this.$message('暂无订单信息');
      }
    },
    vouOrderClick (vd) {
      var _this = this;
      if (vd.vouchernum !== 0) {
        _this.voucherOrderDialog = true
        // 列表
        vouSearchList(vd.id).then((res) => {
          if (res.status === statusCode) {
            console.log('res------vvvv--', res)
            _this.vouList = res.result
            _this.vouList = _this.vouList.concat(_this.vouList)

          }
        }).catch((error) => {
          console.log(error)
          _this.$message.error({
            message: '请求出现异常',
            duration: 2000
          })
        })
      } else {
        _this.$message('暂无订单信息');
      }
    },
    formatterStatus (row, column) {
      switch (row.status) {
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
          return ''
      }
    }
  }
}
</script>

<style>

</style>
