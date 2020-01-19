<template>
  <div class="homePage-wrap">
    <el-form :inline="true" :model="searchForm">
      <!-- <el-form-item label="序号">
        <el-input size="small" v-model="searchForm.id$LIKE"></el-input>
      </el-form-item>-->
      <el-form-item label="标题">
        <el-input size="small" v-model="searchForm.title$LIKE"></el-input>
      </el-form-item>
      <el-form-item label="图片路径">
        <el-input size="small" v-model="searchForm.icon$LIKE"></el-input>
      </el-form-item>
      <el-form-item label="跳转路径">
        <el-input size="small" v-model="searchForm.jumpPath$LIKE"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="showAddHome">添加首页分类</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="homeTypaList" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <!-- <el-table-column prop="id" align="center" label="序号"></el-table-column> -->
      <el-table-column prop="title" align="center" label="标题"></el-table-column>
      <el-table-column prop="icon" align="center" label="图标途径"></el-table-column>
      <el-table-column prop="jumpPath" align="center" label="跳转途径"></el-table-column>
      <el-table-column prop="status" align="center" label="状态" :formatter="formatterStatus"></el-table-column>
      <el-table-column prop="homePosition" align="center" label="首页展示" :formatter="formatterHome"></el-table-column>
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
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.title" placeholder="请输入分类名称" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="跳转路径" :label-width="formLabelWidth">
          <el-select v-model="addForm.jumpPath" placeholder="请选择跳转路径" @change="changeJump">
            <el-option
              v-for="item in jumpPathList"
              :key="item.id"
              :label="item.name"
              :value="item.path"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="自定义跳转路径" :label-width="formLabelWidth" v-if="userDefined">
          <el-input v-model="userDefinedJumpPath" placeholder="请输入自定义跳转路径" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="图标路径" :label-width="formLabelWidth">
          <div class="headUpload_lww">
            <div class="box" v-loading.lock="fullscreenLoading">
              <input
                type="file"
                name="image"
                accept="image/*"
                @change="onchangeImgFun"
                class="upload-input"
              />
              <img alt :src="$root.imgUrlHttp + addForm.icon" class="upload-img" />
              <button class="upload-btn">图片上传</button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="addForm.status" placeholder="状态">
            <el-option label="有效" :value="1"></el-option>
            <el-option label="无效" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input v-model="addForm.sort" placeholder="请输入排序序号" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="首页展示" :label-width="formLabelWidth">
          <el-select v-model="addForm.homePosition" placeholder="首页展示">
            <el-option label="显示" :value="1"></el-option>
            <el-option label="不显示" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveHomeType">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
import { getHomeTypeList, addHomeType, delHomeType, getHomeTypeItem, searchHomeType } from 'api/lww'
import { statusCode } from 'common/js/config'
import { encodeQueryParam } from 'common/js/utils'
export default {
  data () {
    return {
      fullscreenLoading: false,  //上传等待动画
      add_edit_val: 0,   //  1表示增加,2表示编辑
      dialogTableVisible: false,
      addForm: {
        homePosition: 0,
        icon: "",
        jumpPath: "",
        sort: '',
        status: '',
        title: ""
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
      homeTypaList: [],
      userDefined: false,
      userDefinedJumpPath: '',
      jumpPathList: [
        { id: 1, path: '/pages/lifeService/main', name: '跳转到生活服务' },
        { id: 2, path: '/pages/activity/main?activeTitle=养老', name: '跳转到养老活动' },
        { id: 3, path: '/pages/activity/main?activeTitle=公益', name: '跳转到公益活动' },
        { id: 4, path: 'pages/personList/main', name: '跳转到小程序' },
        { id: 5, path: '', name: '跳转党建活动' }
      ]
    }
  },
  created () {
    this._getHomeTypeList(0, this.pageSize)
  },
  methods: {
    changeJump (val) {
      if (val == '') {
        this.userDefined = true
      }else {
        this.userDefined = false
        this.userDefinedJumpPath = ''
      }
    },
    _getHomeTypeList (pageNow, pageSize) {
      getHomeTypeList(pageNow, pageSize).then((res) => {
        if (res.status === statusCode) {
          this.homeTypaList = res.result.data
          this.pageSize = res.result.pageSize
          this.currentPage = res.result.pageIndex + 1
          this.total = res.result.total
        }
      })
    },
    showAddHome () {
      this.dialogTableVisible = true
      this.userDefined = false
      this.add_edit_val = 1;
      this.addForm = {
        homePosition: '',
        icon: "",
        jumpPath: null,
        sort: '',
        status: '',
        title: ""
      }
      this.userDefinedJumpPath = ''
    },
    // 增加
    saveHomeType () {
      let that = this
      if (this.userDefined == true && this.userDefinedJumpPath == '') {
        that.$message({
          message: '请输入自定义路径',
          duration: 2000
        })
      } else if (this.userDefinedJumpPath != '') {
        this.addForm.jumpPath = this.userDefinedJumpPath
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确定保存吗？', '提示', {}).then(() => {
              // let params = Object.assign({}, this.addForm)
              this.addForm.homePosition = parseInt(this.addForm.homePosition)
              this.addForm.sort = parseInt(this.addForm.sort)
              this.addForm.status = parseInt(this.addForm.status)
              let params = this.addForm
              addHomeType(params).then((res) => {
                if (res.status === statusCode) {
                  that.$message.success({
                    message: this.add_edit_val == 1 ? '添加成功' : '编辑成功',
                    duration: 2000
                  })
                  // that.$refs['addForm'].resetFields()
                  this._getHomeTypeList(this.currentPage, this.pageSize)
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
      } else {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确定保存吗？', '提示', {}).then(() => {
              // let params = Object.assign({}, this.addForm)
              this.addForm.homePosition = parseInt(this.addForm.homePosition)
              this.addForm.sort = parseInt(this.addForm.sort)
              this.addForm.status = parseInt(this.addForm.status)
              let params = this.addForm
              addHomeType(params).then((res) => {
                if (res.status === statusCode) {
                  that.$message.success({
                    message: this.add_edit_val == 1 ? '添加成功' : '编辑成功',
                    duration: 2000
                  })
                  // that.$refs['addForm'].resetFields()
                  this._getHomeTypeList(this.currentPage, this.pageSize)
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
      }


    },
    //删除
    delTypeItem (index, row) {
      let that = this
      this.$confirm('确定删除该条信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delHomeType(row.id).then((res) => {
          if (res.status === statusCode) {
            that.$message.success({
              message: '删除成功',
              duration: 1500
            })
            that._getHomeTypeList(this.currentPage - 1, this.pageSize)
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
      getHomeTypeItem(row.id).then((res) => {
        this.addForm = res.result
        if(this.addForm.jumpPath.indexOf('http') != -1){
          this.userDefined = true;          
          this.userDefinedJumpPath = res.result.jumpPath;
          this.addForm.jumpPath = '';
        }else{
          this.userDefined = false;
          this.userDefinedJumpPath = ''
        }
      })
    },
    handleCurrentChange (val) {
      this._getHomeTypeList(val - 1, this.pageSize)
    },
    handleSizeChange (pageNum) {
      this._getHomeTypeList(this.currentPage - 1, pageNum)
    },
    search () {
      this.total = 0
      this.page = 1
      this.searchHomeType()
    },
    searchHomeType () {
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
      searchHomeType(queryParams.name, queryParamsPage).then((res) => {
        if (res.status === statusCode) {
          this.homeTypaList = res.result.data
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
    // 图片上传
    onchangeImgFun (e) {
      var _this = this // this指向问题，所以在外面先定义
      var file = e.target.files[0]
      // 开始渲染选择的图片
      let forData = new FormData();
      forData.append('id', file);
      forData.append('name', file.name);
      forData.append('type', file.type);
      forData.append('lastModifiedDate', file.lastModified);
      forData.append('size', file.size);
      forData.append('file', file);
      let config = {
        headers: { 'Content-Type': 'multipart/form-data' } //这里是重点，需要和后台沟通好请求头，Content-Type不一定是这个值
      }; //添加请求头
      this.$axios.post(`/file/upload-static`, forData, config)
        .then(response => {          
          if (response.data.status == 200) {
            _this.addForm.icon = response.data.result
            _this.fullscreenLoading = false
          }
        })
    },
    formatterStatus (row, column) {
      return row.status == 1 ? '有效' : '无效'
    },
    formatterHome (row, column) {
      return row.homePosition == 1 ? '显示' : '不显示'
    }
  },
}
</script>
<style scoped lang="scss">
</style>
