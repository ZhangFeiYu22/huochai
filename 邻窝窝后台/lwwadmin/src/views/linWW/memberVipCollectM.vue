<template>
  <div class="homePage-wrap">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="序号">
        <el-input size="small" v-model="searchForm.id$LIKE"></el-input>
      </el-form-item>
      <el-form-item label="收藏名称">
        <el-input size="small" v-model="searchForm.name$LIKE"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="showAddCollect">添加收藏</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="collectList" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="id" align="center" label="序号"></el-table-column>
      <el-table-column prop="type" align="center" label="类型(代金券/活动)"></el-table-column>
      <el-table-column prop="memberId" align="center" label="会员昵称(Id)"></el-table-column>
      <el-table-column prop="objectId" align="center" label="活动名称(Id)"></el-table-column>
      <el-table-column prop="name" align="center" label="活动名称"></el-table-column>
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
      :title="add_edit_val == 1 ? '添加收藏' : '编辑收藏'"
      :visible.sync="dialogTableVisible"
      center
    >
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="会员昵称(Id)" :label-width="formLabelWidth">
          <el-input v-model="addForm.memberId" auto-complete="off" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="活动名称(Id)" :label-width="formLabelWidth">
          <el-input v-model="addForm.objectId" auto-complete="off" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" auto-complete="off" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="类型(代金券/活动)" :label-width="formLabelWidth">
          <el-select v-model="addForm.type" placeholder="类型(代金券/活动)">
            <el-option label="类型1" value="1"></el-option>
            <el-option label="类型2" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveCollect">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
import { getCollectList, addCollect, delCollect, getCollectItem, searchCollect } from 'api/lww'
import { statusCode } from 'common/js/config'
import { encodeQueryParam } from 'common/js/utils'
export default {
  data () {
    return {
      add_edit_val: 0,   //  1表示增加,2表示编辑
      dialogTableVisible: false,
      addForm: {
        id: "",
        memberId: "",
        name: "",
        objectId: "",
        type: 0
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
      collectList: []
    }
  },
  created () {
    this._getCollectList(0, this.pageSize)
  },
  methods: {
    _getCollectList (pageNow, pageSize) {
      getCollectList(pageNow, pageSize).then((res) => {
        if (res.status === statusCode) {
          this.collectList = res.result.data
          this.pageSize = res.result.pageSize
          this.currentPage = res.result.pageIndex + 1
          this.total = res.result.total
        }
      })
    },
    showAddCollect () {
      this.dialogTableVisible = true
      this.add_edit_val = 1;
      this.addForm = {
        memberId: "",
        name: "",
        objectId: "",
        type: 0
      }
    },
    // 增加
    saveCollect () {
      let that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {}).then(() => {
            // let params = Object.assign({}, this.addForm)
            this.addForm.type = parseInt(this.addForm.type)
            let params = this.addForm
            addCollect(params).then((res) => {
              if (res.status === statusCode) {
                that.$message.success({
                  message: '添加成功',
                  duration: 2000
                })
                // that.$refs['addForm'].resetFields()
                this._getCollectList(this.currentPage, this.pageSize)
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
        delCollect(row.id).then((res) => {
          if (res.status === statusCode) {
            that.$message.success({
              message: '删除成功',
              duration: 1500
            })
            that._getCollectList(this.currentPage - 1, this.pageSize)
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
      getCollectItem(row.id).then((res) => {
        let jsonData = JSON.parse(res)
        this.addForm = jsonData.result
      })
    },
    handleCurrentChange (val) {
      this._getCollectList(val - 1, this.pageSize)
    },
    handleSizeChange (pageNum) {
      this._getCollectList(this.currentPage - 1, pageNum)
    },
    search () {
      this.total = 0
      this.page = 1
      this.searchCollect()
    },
    searchCollect () {
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
      searchCollect(queryParams.name, queryParamsPage).then((res) => {
        if (res.status === statusCode) {
          this.collectList = res.result.data
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
