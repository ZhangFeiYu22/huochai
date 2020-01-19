<template>
  <div class="homePage-wrap">
    <el-form :inline="true" :model="searchForm">
      <!-- <el-form-item label="序号">
        <el-input size="small" v-model="searchForm.id$LIKE"></el-input>
      </el-form-item> -->
      <el-form-item label="标题">
        <el-input size="small" v-model="searchForm.title$LIKE"></el-input>
      </el-form-item>
      <el-form-item label="跳转路径">
        <el-input size="small" v-model="searchForm.jumpPath$LIKE"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="showAddActivityType">添加活动分类</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="activityTypeList" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <!-- <el-table-column prop="id" align="center" label="序号"></el-table-column> -->
      <el-table-column prop="title" align="center" label="标题"></el-table-column>
      <el-table-column prop="jumpPath" align="center" label="跳转途径"></el-table-column>
      <!-- <el-table-column prop="pid" align="center" label="父级分类"></el-table-column> -->
      <el-table-column prop="isHome" align="center" label="首页是否显示" :formatter="formatterIsHome"></el-table-column>
      <el-table-column prop="status" align="center" label="状态" :formatter="formatterStatus"></el-table-column>
      <el-table-column prop="sort" align="center" label="排序"></el-table-column>
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
      :title="add_edit_val == 1 ? '添加分类' : '编辑分类'"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal='false'
      center
    >
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input v-model="addForm.title" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="跳转路径" :label-width="formLabelWidth">
          <el-input v-model="addForm.jumpPath" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="是否显示首页" :label-width="formLabelWidth">
          <el-select v-model="addForm.isHome" placeholder="状态">
            <el-option label="显示" :value="1"></el-option>
            <el-option label="不显示" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="addForm.status" placeholder="状态">
            <el-option label="有效" :value="1"></el-option>
            <el-option label="无效" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input v-model="addForm.sort" placeholder="请输入排序号" style="width: 240px"></el-input>
        </el-form-item>
        <!-- <el-form-item label="父级分类" :label-width="formLabelWidth">
          <el-select v-model="addForm.pid" placeholder="父级分类">
            <el-option label="1" value="1"></el-option>
            <el-option label="0" value="0"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveActivityType">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
import { getActivityTypeList, addActivityType, delActivityType, getActivityTypeItem, searchActivityType } from 'api/lww'
import { statusCode } from 'common/js/config'
import { encodeQueryParam } from 'common/js/utils'
export default {
  data () {
    return {
      add_edit_val: 0,   //  1表示增加,2表示编辑
      dialogTableVisible: false,
      addForm: {
        jumpPath: "",
        sort: 0,
        isHome: 0,
        status: 0,
        title: "",
        pid: '0'
      },
      formLabelWidth: '140px',
      currentPage: 1,
      total: 0,
      page: 1,
      pageSize: 10,
      searchForm: {
        id$LIKE: '',
        title$LIKE: '',
        icon$LIKE: '',
        jumpPath$LIKE: ''
      },
      activityTypeList: []
    }
  },
  created () {
    this._getActivityTypeList(0, this.pageSize)
  },
  methods: {
    _getActivityTypeList (pageNow, pageSize) {
      getActivityTypeList(pageNow, pageSize).then((res) => {
        if (res.status === statusCode) {
          this.activityTypeList = res.result.data
          this.pageSize = res.result.pageSize
          this.currentPage = res.result.pageIndex + 1
          this.total = res.result.total
        }
      })
    },
    showAddActivityType () {
      this.dialogTableVisible = true
      this.add_edit_val = 1;
      this.addForm = {
        jumpPath: "",
        sort: '',
        isHome: '',
        status: '',
        title: "",
        pid: '0'
      }
    },
    // 增加
    saveActivityType () {
      let that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {}).then(() => {
            // let params = Object.assign({}, this.addForm)
            this.addForm.sort = parseInt(this.addForm.sort)
            this.addForm.status = parseInt(this.addForm.status)
            this.addForm.isHome = parseInt(this.addForm.isHome)
            let params = this.addForm
            addActivityType(params).then((res) => {
              if (res.status === statusCode) {
                that.$message.success({
                  message: that.add_edit_val == 1 ? '添加成功' : '编辑成功',
                  duration: 2000
                })
                // that.$refs['addForm'].resetFields()
                this._getActivityTypeList(this.currentPage, this.pageSize)
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
        delActivityType(row.id).then((res) => {
          if (res.status === statusCode) {
            that.$message.success({
              message: '删除成功',
              duration: 1500
            })
            that._getActivityTypeList(this.currentPage - 1, this.pageSize)
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
      getActivityTypeItem(row.id).then((res) => {
        let jsonData = JSON.parse(res)
        this.addForm = jsonData.result
      })
    },
    handleCurrentChange (val) {
      this._getActivityTypeList(val - 1, this.pageSize)
    },
    handleSizeChange (pageNum) {
      this._getActivityTypeList(this.currentPage - 1, pageNum)
    },
    search () {
      this.total = 0
      this.page = 1
      this.searchActivityType()
    },
    searchActivityType () {
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
      searchActivityType(queryParams.name, queryParamsPage).then((res) => {
        if (res.status === statusCode) {
          this.activityTypeList = res.result.data
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
    // 状态显示转换
    formatterStatus (row, column) {
      return row.status === 1 ? '有效' : '无效'
    },
    // 状态显示转换
    formatterIsHome (row, column) {
      return row.isHome === 1 ? '显示' : '不显示'
    }

  },
}
</script>

<style>
</style>
