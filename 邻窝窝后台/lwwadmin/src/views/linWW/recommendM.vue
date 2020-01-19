<template>
  <div class="homePage-wrap">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="名称">
        <el-input size="small" v-model="searchForm.name$LIKE"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="showAddRecommend">添加推荐</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="recommendList" border style="width: 100%" :default-sort = "{prop: 'position', order: 'ascending'}">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="position" align="center" label="推荐位置" :formatter="formatterPosition" sortable></el-table-column>
      <el-table-column prop="name" align="center" label="推荐名称"></el-table-column>
      <el-table-column prop="type" align="center" label="推荐分类" :formatter="formatterType"></el-table-column>
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
      :title="add_edit_val == 1 ? '添加推荐' : '编辑推荐'"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal='false'
      center
    >
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="分类" :label-width="formLabelWidth">
          <el-select v-model="addForm.position" placeholder="类型" @change="selectPosition">
            <el-option label="搜索活动推荐" :value="1"></el-option>
            <el-option label="搜索精选推荐" :value="5"></el-option>
            <el-option label="我的推荐" :value="2"></el-option>
            <el-option label="代金券推荐" :value="3"></el-option>
            <el-option label="代金券套餐推荐" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推荐类型" :label-width="formLabelWidth">
          <el-select v-model="addForm.type" disabled placeholder="推荐类型">
            <el-option label="活动" :value="1"></el-option>
            <el-option label="代金券" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推荐活动名称" :label-width="formLabelWidth" v-if="addForm.type == 1">
          <el-select v-model="addForm.useId" placeholder="推荐内容名称" @change="selectUseId">
            <el-option
              v-for="item in contentList_activity"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推荐代金券名称" :label-width="formLabelWidth" v-else>
          <el-select v-model="addForm.useId" placeholder="推荐代金券名称" @change="selectUseId">
            <el-option
              v-for="item in contentList_voucher"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="推荐内容" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" disabled style="width: 320px"></el-input>
        </el-form-item>-->
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input v-model="addForm.sort" placeholder="请输入排序序号" style="width: 320px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveRecommend">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
import { getRecommendList, getActivityListNoPaging, getCouponListNoPaging, addRecommend, delRecommend, getRecommendItem, searchRecommend } from 'api/lww'
import { statusCode } from 'common/js/config'
import { encodeQueryParam } from 'common/js/utils'
export default {
  data () {
    return {
      add_edit_val: 0,   //  1表示增加,2表示编辑
      dialogTableVisible: false,
      contentList_activity: [],  //活动    代金券选择
      contentList_voucher: [],  //活动    代金券选择
      addForm: {
        id: "",
        name: "",
        position: '',
        sort: '',
        type: '',
        useId: ""
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
      recommendList: []
    }
  },
  created () {
    this.getContentList()
    this._getRecommendList(0, this.pageSize)
  },
  methods: {
    _getRecommendList (pageNow, pageSize) {
      getRecommendList(pageNow, pageSize).then((res) => {
        if (res.status === statusCode) {
          this.recommendList = res.result.data
          this.pageSize = res.result.pageSize
          this.currentPage = res.result.pageIndex + 1
          this.total = res.result.total
        }
      })
    },
    selectPosition (val) {
      this.addForm.useId = '';
      if (val == 1) {
        this.addForm.type = 1
      } else {
        this.addForm.type = 2
      }
    },
    getContentList () {
      getActivityListNoPaging().then(res => {
        if (res.status == 200) {
          this.contentList_activity = res.result
        }
      })
      getCouponListNoPaging().then(res => {
        if (res.status == 200) {
          this.contentList_voucher = res.result
        }
      })
    },
    selectUseId (id) {
      if (this.addForm.type == 1) {
        this.contentList_activity.forEach(element => {
          if (element.id == id) {
            this.addForm.name = element.title;
          }
        });
      } else {
        console.log('123', id)
        this.contentList_voucher.forEach(element => {
          if (element.id == id) {
            this.addForm.name = element.name;
          }
        });
      }
    },
    showAddRecommend () {
      this.dialogTableVisible = true
      this.add_edit_val = 1;
      this.addForm = {
        name: "",
        position: '',
        sort: '',
        type: '',
        useId: ""
      }
    },
    // 增加
    saveRecommend () {
      let that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {}).then(() => {
            // let params = Object.assign({}, this.addForm)
            this.addForm.sort = parseInt(this.addForm.sort)
            this.addForm.position = parseInt(this.addForm.position)
            this.addForm.type = parseInt(this.addForm.type)
            let params = this.addForm
            addRecommend(params).then((res) => {
              if (res.status === statusCode) {
                that.$message.success({
                  message: this.add_edit_val == 1 ? '添加成功' : '编辑成功',
                  duration: 2000
                })
                // that.$refs['addForm'].resetFields()
                this._getRecommendList(this.currentPage, this.pageSize)
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
        delRecommend(row.id).then((res) => {
          if (res.status === statusCode) {
            that.$message.success({
              message: '删除成功',
              duration: 1500
            })
            that._getRecommendList(this.currentPage - 1, this.pageSize)
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
      getRecommendItem(row.id).then((res) => {
        let jsonData = JSON.parse(res)
        this.addForm = jsonData.result

      })
    },
    handleCurrentChange (val) {
      this._getRecommendList(val - 1, this.pageSize)
    },
    handleSizeChange (pageNum) {
      this._getRecommendList(this.currentPage - 1, pageNum)
    },
    search () {
      this.total = 0
      this.page = 1
      this.searchRecommend()
    },
    searchRecommend () {
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
      searchRecommend(queryParams.name, queryParamsPage).then((res) => {
        if (res.status === statusCode) {
          this.recommendList = res.result.data
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
    formatterPosition (row, column) {
      switch (row.position) {
        case 1:
          return '搜索活动推荐'
          break;
        case 2:
          return '我的推荐'
          break;
        case 3:
          return '代金券推荐'
          break;
        case 4:
          return '代金券套餐推荐'
          break;
        case 5:
          return '搜索精选推荐'
          break;
        default:
          return ''
      }
    },
    formatterType (row, column) {
      return row.type == 1 ? '活动' : '代金券'
    }
  },
}
</script>

<style>
</style>
