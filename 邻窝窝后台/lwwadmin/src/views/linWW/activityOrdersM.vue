<template>
  <div class="homePage-wrap">
    <el-form :inline="true" :model="searchForm">
      <!-- <el-form-item label="序号">
        <el-input size="small" v-model="searchForm.id$LIKE"></el-input>
      </el-form-item>-->
      <el-form-item label="活动订单名称">
        <el-input size="small" v-model="searchForm.title$LIKE"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="showAddOrderActivity"
        >添加活动订单</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="orderActivityList" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <!-- <el-table-column prop="id" align="center" label="序号"></el-table-column> -->
      <el-table-column prop="orderNo" align="center" label="订单号"></el-table-column>
      <el-table-column prop="title" align="center" label="活动名称"></el-table-column>
      <el-table-column prop="contact" align="center" label="联系人"></el-table-column>
      <el-table-column prop="contactPhone" align="center" label="联系人电话"></el-table-column>
      <el-table-column prop="totalPrice" align="center" label="支付金额"></el-table-column>
      <el-table-column prop="actTime" align="center" label="活动时间"></el-table-column>
      <el-table-column prop="actAddress" align="center" label="活动地点"></el-table-column>
      <el-table-column prop="code" align="center" label="核销码"></el-table-column>
      <el-table-column prop="status" align="center" label="状态" :formatter="formatterStatus"></el-table-column>
      <el-table-column prop="createTime" align="center" label="创建时间"></el-table-column>
      <el-table-column prop="action" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="verificationItem(scope.$index,scope.row)"
            type="info"
            plain
          >核销</el-button>
          <el-button
            size="mini"
            @click="editTypeItem(scope.$index,scope.row)"
            type="primary"
            plain
          >编辑</el-button>
          <el-button size="mini" @click="delTypeItem(scope.$index,scope.row)" type="danger" plain>删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top:20px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="[10, 15, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!--添加首页分类页面-->
    <el-dialog
      :title="add_edit_val == 1 ? '添加活动订单' : '编辑活动订单'"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      center
    >
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="订单号" :label-width="formLabelWidth">
          <el-input v-model="addForm.orderNo" auto-complete="off" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.title" auto-complete="off" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth">
          <el-input v-model="addForm.num" auto-complete="off" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="活动ID" :label-width="formLabelWidth">
          <el-input v-model="addForm.activityId" auto-complete="off" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="联系人" :label-width="formLabelWidth">
          <el-input v-model="addForm.contact" auto-complete="off" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="联系人电话" :label-width="formLabelWidth">
          <el-input v-model="addForm.contactPhone" auto-complete="off" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="活动价格" :label-width="formLabelWidth">
          <el-input v-model="addForm.activityPrice" auto-complete="off" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="总支付价格" :label-width="formLabelWidth">
          <el-input v-model="addForm.totalPrice" auto-complete="off" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="活动时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="addForm.actTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width: 320px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="活动地址" :label-width="formLabelWidth">
          <el-input v-model="addForm.actAddress" auto-complete="off" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="核销码" :label-width="formLabelWidth">
          <el-input v-model="addForm.code" auto-complete="off" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="addForm.status" placeholder="状态">
            <el-option label="待付款" :value="3"></el-option>
            <el-option label="可使用" :value="4"></el-option>
            <el-option label="已完成" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="addForm.createTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width: 320px"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveOrderActivity">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
import { getOrderActivityList, addOrderActivity, delOrderActivity, getOrderActivityItem, searchOrderActivity, cancelOrder } from 'api/lww'
import { statusCode } from 'common/js/config'
import { encodeQueryParam } from 'common/js/utils'
export default {
  data () {
    return {
      add_edit_val: 0,   //  1表示增加,2表示编辑
      dialogTableVisible: false,
      addForm: {
        actAddress: "",  //活动地址
        actTime: "",  //活动时间
        activityId: "",  //活动id
        activityPrice: 0,  //活动价格
        code: "", //核销码
        contact: "",  //联系人
        contactPhone: "",  //联系电话
        createTime: "",  //创建时间
        id: "",
        num: 0,  //数量
        orderNo: "",  //订单号
        payTime: "",  //支付时间
        status: 0,
        title: "",  //活动名称
        totalPrice: 0,  //总支付价格
        updateTime: ""  //更新时间
      },
      formLabelWidth: '140px',
      currentPage: 1,
      total: 0,
      page: 1,
      pageSize: 10,
      searchForm: {
        id$LIKE: '',
        title$LIKE: ''
      },
      orderActivityList: []
    }
  },
  created () {
    this._getOrderActivityList(0, this.pageSize)
  },
  methods: {
    _getOrderActivityList (pageNow, pageSize) {
      getOrderActivityList(pageNow, pageSize).then((res) => {
        if (res.status === statusCode) {
          this.orderActivityList = res.result.data
          this.pageSize = res.result.pageSize
          this.currentPage = res.result.pageIndex + 1
          console.log('this.currentPage--', this.currentPage)
          this.total = res.result.total
        }
      })
    },
    showAddOrderActivity () {
      this.dialogTableVisible = true
      this.add_edit_val = 1;
      this.addForm = {
        actAddress: "",  //活动地址
        actTime: "",  //活动时间
        activityId: "",  //活动id
        activityPrice: '',  //活动价格
        code: "", //核销码
        contact: "",  //联系人
        contactPhone: "",  //联系电话
        createTime: "",  //创建时间
        num: '',  //数量
        orderNo: "",  //订单号
        payTime: "",  //支付时间
        status: '',
        title: "",  //活动名称
        totalPrice: '',  //总支付价格
        updateTime: ""  //更新时间
      }
    },
    // 增加
    saveOrderActivity () {
      let that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {}).then(() => {
            // let params = Object.assign({}, this.addForm)
            this.addForm.num = parseInt(this.addForm.num)
            this.addForm.activityPrice = parseFloat(this.addForm.activityPrice)
            this.addForm.status = parseInt(this.addForm.status)
            this.addForm.totalPrice = parseFloat(this.addForm.totalPrice)
            let params = this.addForm
            addOrderActivity(params).then((res) => {
              if (res.status === statusCode) {
                that.$message.success({
                  message: '添加成功',
                  duration: 2000
                })
                // that.$refs['addForm'].resetFields()
                this._getOrderActivityList(this.currentPage - 1, this.pageSize)
                that.dialogTableVisible = false
              } else {
                that.$message.error({
                  message: '添加失败',
                  duration: 2000
                })

              }
            }).catch((error) => {
              console.log(error)
              that.$message.error({
                showClose: true,
                message: '请求出现异常',
                duration: 2000
              })
            })
          })
        }
      })
    },
    //删除
    delTypeItem (index, row) {
      let that = this
      this.$confirm('确定删除该条信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delOrderActivity(row.id).then((res) => {
          if (res.status === statusCode) {
            that.$message.success({
              message: '删除成功',
              duration: 1500
            })
            that._getOrderActivityList(this.currentPage - 1, this.pageSize)
          }
        }).catch((error) => {
          console.log(error)
          that.$message.error({
            message: '请求出现异常',
            duration: 2000
          })
        })
      })
    },
    // 编辑
    editTypeItem (index, row) {
      this.dialogTableVisible = true
      this.add_edit_val = 2;
      getOrderActivityItem(row.id).then((res) => {
        let jsonData = JSON.parse(res)
        this.addForm = jsonData.result
      })
    },
    // 核销
    verificationItem (index, row) {
      console.log('核销---', row)
      let that = this
      this.$confirm('确定核销该信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelOrder(row.id, row.code).then((res) => {
          console.log(res)
          if (res.status === statusCode) {
            that.$message.success({
              message: '核销成功',
              duration: 1500
            })
            var paramsData = row
            paramsData.status = 5
            addOrderActivity(paramsData).then((resD) => {
              if (resD.status === statusCode) {
                this._getOrderActivityList(this.currentPage - 1, this.pageSize)
              }
            }).catch((error) => {
              console.log(error)
              that.$message.error({
                showClose: true,
                message: '请求出现异常',
                duration: 2000
              })
            })
          }
        }).catch((error) => {
          console.log(error)
          that.$message.error({
            message: '请求出现异常',
            duration: 2000
          })
        })
      })
    },
    handleCurrentChange (val) {
      this._getOrderActivityList(val - 1, this.pageSize)
    },
    handleSizeChange (pageNum) {
      this._getOrderActivityList(this.currentPage, pageNum)
    },
    search () {
      this.total = 0
      this.page = 1
      this.searchOrderActivity()
    },
    searchOrderActivity () {
      let that = this
      let queryParams = {
        name: encodeQueryParam(that.searchForm)
      }
      let queryParamsPage = {
        pageIndex: that.page,
        pageSize: that.pageSize,
        sortField: '',
        sortOrder: ''
      }
      // 搜索
      searchOrderActivity(queryParams.name, queryParamsPage).then((res) => {
        if (res.status === statusCode) {
          this.orderActivityList = res.result.data
          this.pageSize = res.result.pageSize
          this.currentPage = res.result.pageIndex + 1
          this.total = res.result.total
        }
      }).catch((error) => {
        console.log(error)
        that.$message.error({
          message: '请求出现异常',
          duration: 2000
        })
      })
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
    },
  },
}
</script>

<style>
</style>
