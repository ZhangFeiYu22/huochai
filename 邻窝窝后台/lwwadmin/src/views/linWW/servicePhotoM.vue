<template>
  <div class="homePage-wrap">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="序号">
        <el-input size="small" v-model="searchForm.id$LIKE"></el-input>
      </el-form-item>
      <el-form-item label="服务电话名称">
        <el-input size="small" v-model="searchForm.name$LIKE"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="showAddServerPhone"
        >添加服务电话</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="serverPhoneList" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="id" align="center" label="序号"></el-table-column>
      <el-table-column prop="memberName" align="center" label="会员昵称"></el-table-column>
      <el-table-column prop="memberId" align="center" label="会员id"></el-table-column>
      <el-table-column prop="serviceName" align="center" label="服务名称"></el-table-column>
      <el-table-column prop="servicePhone" align="center" label="电话号码"></el-table-column>
      <el-table-column prop="dialTime" align="center" label="拨打时间"></el-table-column>
      <el-table-column prop="action" align="center" label="操作">
        <template slot-scope="scope">
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
      :page-sizes="[5, 10, 15, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!--添加首页分类页面-->
    <el-dialog
      :title="add_edit_val == 1 ? '添加服务电话' : '编辑服务电话'"
      :visible.sync="dialogTableVisible"
      center
    >
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="会员名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.memberName" auto-complete="off" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="会员id" :label-width="formLabelWidth">
          <el-input v-model="addForm.memberId" auto-complete="off" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="服务名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.serviceName" auto-complete="off" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="服务电话" :label-width="formLabelWidth">
          <el-input v-model="addForm.servicePhone" auto-complete="off" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="拨打时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="addForm.dialTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width: 320px"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveServerPhone">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
import { getServerPhoneList, addServerPhone, delServerPhone, getServerPhoneItem, searchServerPhone } from 'api/lww'
import { statusCode } from 'common/js/config'
import { encodeQueryParam } from 'common/js/utils'
export default {
  data () {
    return {
      add_edit_val: 0,   //  1表示增加,2表示编辑
      dialogTableVisible: false,
      addForm: {
        id: "",
        memberId: "",  //会员ID
        memberName: "",  //会员名称
        serviceName: "",  //服务名称
        servicePhone: "",  //服务电话
        dialTime: ""  //拨打时间
      },
      formLabelWidth: '140px',
      currentPage: 1,
      total: 0,
      page: 1,
      pageSize: 10,
      searchForm: {
        id$LIKE: '',
        name$LIKE: ''
      },
      serverPhoneList: []
    }
  },
  created () {
    this._getServerPhoneList(0, this.pageSize)
  },
  methods: {
    _getServerPhoneList (pageNow, pageSize) {
      getServerPhoneList(pageNow, pageSize).then((res) => {
        if (res.status === statusCode) {
          this.serverPhoneList = res.result.data
          this.pageSize = res.result.pageSize
          this.currentPage = res.result.pageIndex + 1
          this.total = res.result.total
        }
      })
    },
    showAddServerPhone () {
      this.dialogTableVisible = true
      this.add_edit_val = 1;
      this.addForm = {
        memberId: "",  //会员ID
        memberName: "",  //会员名称
        serviceName: "",  //服务名称
        servicePhone: "",  //服务电话
        dialTime: ""  //拨打时间
      }
    },
    // 增加
    saveServerPhone () {
      let that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {}).then(() => {
            // let params = Object.assign({}, this.addForm)
            let params = this.addForm
            addServerPhone(params).then((res) => {
              if (res.status === statusCode) {
                that.$message.success({
                  message: this.add_edit_val == 1 ? '添加成功' : '编辑成功',
                  duration: 2000
                })
                // that.$refs['addForm'].resetFields()
                this._getServerPhoneList(this.currentPage, this.pageSize)
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
        delServerPhone(row.id).then((res) => {
          if (res.status === statusCode) {
            that.$message.success({
              message: '删除成功',
              duration: 1500
            })
            that._getServerPhoneList(this.currentPage - 1, this.pageSize)
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
      getServerPhoneItem(row.id).then((res) => {
        let jsonData = JSON.parse(res)
        this.addForm = jsonData.result
      })
    },
    handleCurrentChange (val) {
      this._getServerPhoneList(val - 1, this.pageSize)
    },
    handleSizeChange (pageNum) {
      this._getServerPhoneList(this.currentPage - 1, pageNum)
    },
    search () {
      this.total = 0
      this.page = 1
      this.searchServerPhone()
    },
    searchServerPhone () {
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
      searchServerPhone(queryParams.name, queryParamsPage).then((res) => {
        if (res.status === statusCode) {
          this.serverPhoneList = res.result.data
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

  },
}
</script>

<style>
</style>
