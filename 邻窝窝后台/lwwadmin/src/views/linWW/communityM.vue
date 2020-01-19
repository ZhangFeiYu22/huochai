<template>
  <div class="homePage-wrap">
    <el-form :inline="true" :model="searchForm">
      <!-- <el-form-item label="序号">
        <el-input size="small" v-model="searchForm.id$LIKE"></el-input>
      </el-form-item> -->
      <el-form-item label="社区名称">
        <el-input size="small" v-model="searchForm.name$LIKE"></el-input>
      </el-form-item>
      <el-form-item label="社区负责人">
        <el-input size="small" v-model="searchForm.principal$LIKE"></el-input>
      </el-form-item>
      <el-form-item label="社区负责人电话">
        <el-input size="small" v-model="searchForm.phone$LIKE"></el-input>
      </el-form-item>
      <el-form-item label="社区地址">
        <el-input size="small" v-model="searchForm.address$LIKE"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="showAddCommunity">添加社区</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="communityList" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <!-- <el-table-column prop="id" align="center" label="序号"></el-table-column> -->
      <el-table-column prop="name" align="center" label="社区名称"></el-table-column>
      <el-table-column prop="principal" align="center" label="社区负责人"></el-table-column>
      <el-table-column prop="phone" align="center" label="社区负责人电话"></el-table-column>
      <el-table-column prop="address" align="center" label="社区地址"></el-table-column>
      <el-table-column prop="status" align="center" label="状态" :formatter="formatterStatus"></el-table-column>
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
      :title="add_edit_val == 1 ? '添加社区' : '编辑社区'"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal='false'
      center
    >
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="社区名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="社区负责人" :label-width="formLabelWidth">
          <el-input v-model="addForm.principal" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="社区负责人电话" :label-width="formLabelWidth">
          <el-input v-model="addForm.phone" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="社区位置" :label-width="formLabelWidth">
          <el-input v-model="addForm.coordinate" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="社区地址" :label-width="formLabelWidth">
          <el-input v-model="addForm.address" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="addForm.status" placeholder="状态">
            <el-option label="有效" :value="1"></el-option>
            <el-option label="无效" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveCommunity">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
import { getCommunityList, addCommunity, delCommunity, getCommunityItem, searchCommunity } from 'api/lww'
import { statusCode } from 'common/js/config'
import { encodeQueryParam } from 'common/js/utils'
export default {
  data () {
    return {
      add_edit_val: 0,   //  1表示增加,2表示编辑
      dialogTableVisible: false,
      addForm: {
        address: "",
        coordinate: "",
        id: "",
        name: "",
        phone: "",
        principal: "",
        status: ""
      },
      formLabelWidth: '140px',
      currentPage: 1,
      total: 0,
      page: 1,
      pageSize: 10,
      searchForm: {
        id$LIKE: '',
        name$LIKE: '',
        principal$LIKE: '',
        phone$LIKE: '',
        address$LIKE: ''
      },
      communityList: []
    }
  },
  created () {
    this._getCommunityList(0, this.pageSize)
  },
  methods: {
    _getCommunityList (pageNow, pageSize) {
      getCommunityList(pageNow, pageSize).then((res) => {
        if (res.status === statusCode) {
          this.communityList = res.result.data
          this.pageSize = res.result.pageSize
          this.currentPage = res.result.pageIndex + 1
          this.total = res.result.total
        }
      })
    },
    showAddCommunity () {
      this.dialogTableVisible = true
      this.add_edit_val = 1;
      this.addForm = {
        address: "",
        coordinate: "",
        name: "",
        phone: "",
        principal: "",
        status: ""
      }
    },
    // 增加
    saveCommunity () {
      let that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {}).then(() => {
            // let params = Object.assign({}, this.addForm)
            this.addForm.homePosition = parseInt(this.addForm.homePosition)
            this.addForm.sort = parseInt(this.addForm.sort)
            this.addForm.status = parseInt(this.addForm.status)
            let params = this.addForm
            addCommunity(params).then((res) => {
              if (res.status === statusCode) {
                that.$message.success({
                  message: this.add_edit_val == 1 ? '添加成功' : '编辑成功',
                  duration: 2000
                })
                // that.$refs['addForm'].resetFields()
                that.dialogTableVisible = false
                this._getCommunityList(this.currentPage, this.pageSize)
                
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
        delCommunity(row.id).then((res) => {
          if (res.status === statusCode) {
            that.$message.success({
              message: '删除成功',
              duration: 1500
            })
            that._getCommunityList(this.currentPage - 1, this.pageSize)
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
      getCommunityItem(row.id).then((res) => {
        let jsonData = JSON.parse(res)
        this.addForm = jsonData.result
      })
    },
    handleCurrentChange (val) {
      this._getCommunityList(val - 1, this.pageSize)
    },
    handleSizeChange (pageNum) {
      this._getCommunityList(this.currentPage - 1, pageNum)
    },
    search () {
      this.total = 0
      this.page = 1
      this.searchCommunity()
    },
    searchCommunity () {
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
      searchCommunity(queryParams.name, queryParamsPage).then((res) => {
        if (res.status === statusCode) {
          this.communityList = res.result.data
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
      return row.status == 1 ? '有效' : '无效'
    }
  },
}
</script>

<style>
</style>
