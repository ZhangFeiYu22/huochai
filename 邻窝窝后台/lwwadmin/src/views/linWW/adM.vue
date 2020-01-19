<template>
  <div class="homePage-wrap">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="广告标题">
        <el-input size="small" v-model="searchForm.title$LIKE"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="showAddAdvert">添加广告</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="advertList"
      border
      style="width: 100%"
      :default-sort="{prop: 'position', order: 'ascending'}"
    >
      <el-table-column type="index"></el-table-column>
      <!-- <el-table-column prop="id" align="center" label="序号"></el-table-column> -->
      <el-table-column prop="title" align="center" label="广告标题"></el-table-column>
      <el-table-column
        prop="position"
        align="center"
        label="显示位置"
        :formatter="formatterPosition"
        sortable
      ></el-table-column>
      <el-table-column prop="cid" align="center" label="所属社区"></el-table-column>
      <el-table-column prop="content" align="center" label="内容"></el-table-column>
      <el-table-column prop="startTime" align="center" label="开始时间"></el-table-column>
      <el-table-column prop="endTime" align="center" label="结束时间"></el-table-column>
      <el-table-column prop="mediaType" align="center" label="媒体类型" :formatter="formatterMediaType"></el-table-column>
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
      :title="add_edit_val == 1 ? '添加广告' : '编辑广告'"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal='false'
      center
    >
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input v-model="addForm.title" auto-complete="off" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="显示位置" :label-width="formLabelWidth">
          <el-select v-model="addForm.position" placeholder="请选择位置">
            <el-option label="广告1(首页界面)" :value="1"></el-option>
            <el-option label="广告2(首页界面)" :value="2"></el-option>
            <el-option label="轮播一(首页界面)" :value="4"></el-option>
            <el-option label="轮播二(活动界面)" :value="6"></el-option>
            <el-option label="轮播三(精选界面)" :value="7"></el-option>
            <el-option label="广告3(我的界面)" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属社区" :label-width="formLabelWidth">
          <el-select v-model="addForm.cid" placeholder="请选择社区">
            <el-option
              v-for="item in communityList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input
            v-model="addForm.content"
            type="textarea"
            auto-complete="off"
            style="width: 320px"
          ></el-input>
        </el-form-item>
        <el-form-item label="开始时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="addForm.startTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width: 320px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="addForm.endTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width: 320px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="广告媒体类型" :label-width="formLabelWidth">
          <el-select v-model="addForm.mediaType" placeholder="广告媒体类型">
            <el-option label="图片类型" value="1"></el-option>
            <el-option label="视频类型" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片上传" :label-width="formLabelWidth" v-if="addForm.mediaType == 1">
          <div class="headUpload_lww">
            <div class="box" v-loading.lock="fullscreenLoading">
              <input
                type="file"
                name="image"
                accept="image/*"
                @change="onchangeImgFun"
                class="upload-input"
              />
              <img alt :src="$root.imgUrlHttp + mediaImgShow" class="upload-img" />
              <button class="upload-btn">图片上传</button>
              <div class="imgRemark">注:<br>
                &nbsp;&nbsp;&nbsp;&nbsp;1. 轮播图片请按照2:1的比例上传,防止影响展示效果<br>
                &nbsp;&nbsp;&nbsp;&nbsp;2. 广告图片请按照3.5:1的比例上传,防止影响展示效果
                </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="视频上传" :label-width="formLabelWidth" v-if="addForm.mediaType == 2">
          <div class="headUpload_lww headUpload_lww_video">
            <div class="box" v-loading.lock="fullscreenLoading">
              <input
                type="file"
                name="video"
                accept="audio/mp4, video/mp4"
                @change="onchangeImgFun2"
                class="upload-input"
              />
              <video :src="$root.imgUrlHttp + mediaVideoShow" controls class="upload-video"></video>
              <button class="upload-btn">视频上传</button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="addForm.status" placeholder="请选择状态">
            <el-option label="有效" :value="1"></el-option>
            <el-option label="无效" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAdvert">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
import { getCommunityListNopage, getAdvertList, addAdvert, delAdvert, getAdvertItem, searchAdvert } from 'api/lww'
import { statusCode } from 'common/js/config'
import { encodeQueryParam } from 'common/js/utils'
export default {
  data () {
    return {
      mediaImgShow: '',
      mediaVideoShow: '',
      fullscreenLoading: false,  //上传等待动画
      add_edit_val: 0,   //  1表示增加,2表示编辑
      dialogTableVisible: false,
      addForm: {
        content: "",  //内容
        endTime: "",  //结束时间
        cid: "",
        id: "",
        mediaType: "3",  //广告媒体类型
        mediaUrl: "",  //广告媒体链接
        position: 0,  //位置
        startTime: "",  //开始时间
        status: 0,  //状态
        title: ""  //标题
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
      advertList: [],   //广告列表
      communityList: []    //社区列表
    }
  },
  created () {
    this._getAdvertList(0, this.pageSize)
  },
  methods: {
    async fetchCommunityList () {
      let communitys = await getCommunityListNopage()
      if (communitys.status == 200) {
        this.communityList = communitys.result
        for (let ii of this.advertList) {
          for (let iiii of this.communityList) {
            if (ii.cid == iiii.id) {
              ii.cid = iiii.name
            }
          }
        }
      }
    },
    _getAdvertList (pageNow, pageSize) {
      getAdvertList(pageNow, pageSize).then((res) => {
        if (res.status === statusCode) {
          this.advertList = res.result.data
          this.pageSize = res.result.pageSize
          this.currentPage = res.result.pageIndex + 1
          this.total = res.result.total
          this.fetchCommunityList()   //转换社区
        }
      })
    },
    showAddAdvert () {
      this.dialogTableVisible = true
      this.mediaImgShow = ''
      this.mediaVideoShow = ''
      this.add_edit_val = 1;
      this.addForm = {
        content: "",  //内容
        cid: "",  //社区id
        endTime: "",  //结束时间
        mediaType: "1",  //广告媒体类型
        mediaUrl: "",  //广告媒体链接
        position: '',  //位置
        startTime: "",  //开始时间
        status: '',  //状态
        title: ""  //标题
      }
    },
    // 增加
    saveAdvert () {
      let that = this
      if (that.addForm.mediaType == 1) {
        that.addForm.mediaUrl = that.mediaImgShow
        console.log('图片地址为------', that.addForm.mediaUrl)
      } else if (that.addForm.mediaType == 2) {
        that.addForm.mediaUrl = that.mediaVideoShow
        console.log('视频地址为------', that.addForm.mediaUrl)
      }
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {}).then(() => {
            // let params = Object.assign({}, this.addForm)
            this.addForm.position = parseInt(this.addForm.position)
            this.addForm.status = parseInt(this.addForm.status)
            let params = this.addForm
            addAdvert(params).then((res) => {
              if (res.status === statusCode) {
                that.$message.success({
                  message: this.add_edit_val == 1 ? '添加成功' : '编辑成功',
                  duration: 2000
                })
                // that.$refs['addForm'].resetFields()
                this._getAdvertList(this.currentPage - 1, this.pageSize)
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
        delAdvert(row.id).then((res) => {
          if (res.status === statusCode) {
            that.$message.success({
              message: '删除成功',
              duration: 1500
            })
            that._getAdvertList(this.currentPage - 1, this.pageSize)
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
      this.mediaImgShow = ''
      this.mediaVideoShow = ''
      this.add_edit_val = 2;
      getAdvertItem(row.id).then((res) => {
        let jsonData = JSON.parse(res)
        this.addForm = jsonData.result
        if (jsonData.result.mediaType == 1) {
          this.mediaImgShow = jsonData.result.mediaUrl
        } else if (jsonData.result.mediaType == 2) {
          this.mediaVideoShow = jsonData.result.mediaUrl
        }
        for (let iiii of this.communityList) {
          if (this.addForm.cid == iiii.name) {
            this.addForm.cid = iiii.id
          }
        }
      })
    },
    handleCurrentChange (val) {
      this._getAdvertList(val - 1, this.pageSize)
    },
    handleSizeChange (pageNum) {
      this._getAdvertList(this.currentPage - 1, pageNum)
    },
    search () {
      this.total = 0
      this.page = 1
      this.searchAdvert()
    },
    searchAdvert () {
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
      searchAdvert(queryParams.name, queryParamsPage).then((res) => {
        if (res.status === statusCode) {
          this.advertList = res.result.data
          this.pageSize = res.result.pageSize
          this.currentPage = res.result.pageIndex + 1
          this.total = res.result.total
          this.fetchCommunityList()   //转换社区
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
      _this.fullscreenLoading = true
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
            _this.mediaImgShow = response.data.result
            _this.fullscreenLoading = false
          }
        })
    },
    // 视频上传
    onchangeImgFun2 (e) {
      var _this = this // this指向问题，所以在外面先定义
      _this.fullscreenLoading = true
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
            _this.mediaVideoShow = response.data.result
            _this.fullscreenLoading = false
          }
        })
    },
    formatterPosition (row, column) {
      switch (row.position) {
        case 1:
          return '首页广告1'
          break;
        case 2:
          return '首页广告2'
          break;
        case 3:
          return '首页广告3'
          break;
        case 4:
          return '首页轮播'
          break;
        case 5:
          return '视频广告'
          break;
        case 6:
          return '活动轮播'
          break;
        case 7:
          return '精选轮播'
          break;
        default:
          return ''
      }
    },
    formatterMediaType (row, column) {
      switch (row.mediaType) {
        case "1":
          return '图片类型'
          break;
        case "2":
          return '视频类型'
          break;
        default:
          return ''
      }
    },
    formatterStatus (row, column) {
      return row.status == 1 ? '有效' : '无效'
    }
  },
}
</script>

<style scoped lang="scss">
.headUpload_lww_video {
  width: 100px;
  height: 100px;
  position: relative;
  right: 100px;
  display: inline-block;
  .box {
    position: absolute;
    left: 100%;
    .upload-input {
      position: absolute;
      left: 120%;
      top: 50%;
      transform: translateY(-50%);
      z-index: 2;
      opacity: 0;
      cursor: pointer;
      /* 通过定位把input放在img标签上面，通过不透明度隐藏 */
    }
    .upload-video {
      width: 180px;
      height: 100px;
      display: inline-block;
      border: 2px dashed #2196f3;
    }
    .upload-btn {
      position: absolute;
      left: 120%;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1;
      background: #00b7ee;
      color: #fff;
      border: 0;
      padding: 5px 8px;
      border-radius: 3px;
    }
  }
}
.imgRemark {
  position: absolute;
  left: 200%;
  top: 0;
  width: 300px;
  line-height: 20px;
  border: 1px dashed #ccc;
  font-size: 12px;
  transform: scale(0.9);
  color: #999;
  padding: 10px;
}
</style>
