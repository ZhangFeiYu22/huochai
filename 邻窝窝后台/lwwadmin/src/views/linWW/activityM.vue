<template>
  <div class="homePage-wrap">
    <el-form :inline="true" :model="searchForm">
      <!-- <el-form-item label="序号">
        <el-input size="small" v-model="searchForm.id$LIKE"></el-input>
      </el-form-item>-->
      <el-form-item label="标题">
        <el-input size="small" v-model="searchForm.title$LIKE"></el-input>
      </el-form-item>
      <el-form-item label="地点">
        <el-input size="small" v-model="searchForm.actAddress$LIKE"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="showAddActivity">添加活动</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="activityList" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="title" align="center" label="活动名称"></el-table-column>
      <el-table-column prop="cid" align="center" label="所属社区"></el-table-column>
      <el-table-column prop="actTime" align="center" label="活动时间"></el-table-column>
      <el-table-column prop="actAddress" align="center" label="活动地点"></el-table-column>
      <el-table-column prop="actualPrice" align="center" label="实际价格"></el-table-column>
      <el-table-column prop="showPrice" align="center" label="展示价格"></el-table-column>
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

    <!--添加首页活动页面-->
    <el-dialog
      :title="add_edit_val == 1 ? '添加活动' : '编辑活动'"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal='false'
      center
      @close="closeChange"
    >
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.title" placeholder="请输入活动标题名称" style="width: 320px"></el-input>
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
        <el-form-item label="头图" :label-width="formLabelWidth">
          <div class="headUpload_lww">
            <div class="box" v-loading.lock="fullscreenLoading">
              <input
                type="file"
                name="image"
                accept="image/*"
                @change="onchangeImgFun"
                class="upload-input"
              />
              <img alt :src="$root.imgUrlHttp + addForm.cover" class="upload-img" />
              <button class="upload-btn">图片上传</button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="活动分类" :label-width="formLabelWidth">
          <el-select v-model="addForm.classId" placeholder="排序">
            <el-option
              v-for="item in activityTypeList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="addForm.actTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width: 320px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="活动地点" :label-width="formLabelWidth">
          <el-input v-model="addForm.actAddress" placeholder="请输入活动地点" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="实际价格" :label-width="formLabelWidth">
          <el-input v-model="addForm.actualPrice" placeholder="请输入实际价格" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="展示价格" :label-width="formLabelWidth">
          <el-input v-model="addForm.showPrice" placeholder="请输入展示价格" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="活动详情" :label-width="formLabelWidth">
          <div class="edit_container">
            <myeditor @getContent="fetchContent" :content="editContent"></myeditor>
          </div>
        </el-form-item>
        <el-form-item label="活动须知" :label-width="formLabelWidth">
          <!-- <el-input v-model="addForm.notice" type="textarea" style="width: 320px"></el-input> -->
          <div class="edit_container">
            <myeditor @getContent="fetchContent2" :content="editContent2"></myeditor>
          </div>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="addForm.status" placeholder="状态">
            <el-option label="有效" :value="1"></el-option>
            <el-option label="无效" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示首页" :label-width="formLabelWidth">
          <el-select v-model="addForm.isHome" placeholder="状态">
            <el-option label="显示" :value="1"></el-option>
            <el-option label="不显示" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input v-model="addForm.sort" placeholder="请输入排序序号" style="width: 320px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveActivity">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
import myeditor from "@/components/myeditor.vue";
import { getCommunityListNopage, getActivityTypeListNoPaging, getActivityList, addActivity, delActivity, getActivityItem, searchActivity } from 'api/lww'
import { statusCode } from 'common/js/config'
import { encodeQueryParam } from 'common/js/utils'
export default {
  components: {
    myeditor
  },
  data () {
    return {
      fullscreenLoading: false,  //上传等待动画
      editContent: '',
      editContent2: '',
      activityTypeList: [],
      add_edit_val: 0,   //  1表示增加,2表示编辑
      dialogTableVisible: false,
      addForm: {
        actAddress: "",  //地点
        actTime: "", //时间
        actualPrice: "",  //  实际价格
        cid: "", //社区id
        classId: "", //活动分类id
        isHome: "", //是否显示首页
        content: "",  //  详情
        cover: "",  //  头图
        id: "",   //序号id
        notice: "",  //  须知
        showPrice: "",  //  显示价格
        sort: 0,   //  排序
        status: 0,   //  状态
        title: ""    //标题
      },
      formLabelWidth: '140px',
      currentPage: 1,
      total: 0,
      page: 1,
      pageSize: 10,
      searchForm: {
        id$LIKE: '',
        title$LIKE: '',
        actAddress$LIKE: ''
      },
      activityList: [],   //活动列表
      communityList: []   //社区列表
    }
  },
  created () {
    this.fetchActivityType()
  },
  methods: {
    // 富文本编辑器
    fetchContent (content) {
      this.addForm.content = content;
    },
    fetchContent2 (content) {
      this.addForm.notice = content;
    },
    closeChange () {
      this.editContent = ''
      this.editContent2 = ''
    },
    async fetchCommunityList () {
      let communitys = await getCommunityListNopage()
      if (communitys.status == 200) {
        this.communityList = communitys.result
        for (let ii of this.activityList) {   //  有用到活动列表  所以方法放在获取活动列表里面调用
          for (let iiii of this.communityList) {
            if (ii.cid == iiii.id) {
              ii.cid = iiii.name
            }
          }
        }
      }
    },
    async fetchActivityType () {
      let activityTypeList = await getActivityTypeListNoPaging()
      if (activityTypeList.status == 200) {
        this.activityTypeList = activityTypeList.result
      }
      this._getActivityList(0, this.pageSize)
    },
    _getActivityList (pageNow, pageSize) {
      getActivityList(pageNow, pageSize).then((res) => {
        if (res.status === statusCode) {
          this.activityList = res.result.data
          this.pageSize = res.result.pageSize
          this.currentPage = res.result.pageIndex + 1
          this.total = res.result.total
          this.fetchCommunityList()
        }
      })
    },
    // 添加活动
    showAddActivity () {
      this.dialogTableVisible = true
      this.add_edit_val = 1;
      this.addForm = {
        actAddress: "",  //地点
        actTime: "", //时间
        actualPrice: "",  //  实际价格
        cid: "", //社区id
        classId: "", //活动分类id
        isHome: "", //是否显示首页
        content: "",  //  详情
        cover: "",  //  头图
        notice: "",  //  须知
        showPrice: "",  //  显示价格
        sort: '',   //  排序
        status: '',   //  状态
        title: ""    //标题
      };
      this.addForm.content = '';
      this.editContent = '    ';
      this.editContent2 = '    ';
    },
    // 增加
    saveActivity () {
      let that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {}).then(() => {
            // let params = Object.assign({}, this.addForm)
            this.addForm.sort = parseInt(this.addForm.sort)
            this.addForm.status = parseInt(this.addForm.status)
            this.addForm.actualPrice = parseFloat(this.addForm.actualPrice)
            this.addForm.showPrice = parseFloat(this.addForm.showPrice)
            this.addForm.isHome = parseInt(this.addForm.isHome)
            let params = this.addForm
            addActivity(params).then((res) => {
              if (res.status === statusCode) {
                that.$message.success({
                  message: this.add_edit_val == 1 ? '添加成功' : '编辑成功',
                  duration: 2000
                })
                // that.$refs['addForm'].resetFields()
                this._getActivityList(this.currentPage, this.pageSize)
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
        delActivity(row.id).then((res) => {
          if (res.status === statusCode) {
            that.$message.success({
              message: '删除成功',
              duration: 1500
            })
            that._getActivityList(this.currentPage - 1, this.pageSize)
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
      getActivityItem(row.id).then((res) => {
        this.addForm = res.result
        this.editContent = this.addForm.content
        this.editContent2 = this.addForm.notice
        for (let iiii of this.communityList) {
          if (this.addForm.cid == iiii.name) {
            this.addForm.cid = iiii.id
          }
        }
      })
    },
    handleCurrentChange (val) {
      this._getActivityList(val - 1, this.pageSize)
    },
    handleSizeChange (pageNum) {
      this._getActivityList(this.currentPage - 1, pageNum)
    },
    search () {
      this.total = 0
      this.page = 1
      this.searchActivity()
    },
    searchActivity () {
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
      searchActivity(queryParams.name, queryParamsPage).then((res) => {
        if (res.status === statusCode) {
          this.activityList = res.result.data
          this.pageSize = res.result.pageSize
          this.currentPage = res.result.pageIndex + 1
          this.total = res.result.total
          this.fetchCommunityList()  //转换社区
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
            _this.addForm.cover = response.data.result
            _this.fullscreenLoading = false
          }
        })
    },
    formatterStatus (row, column) {
      return row.status == 1 ? '有效' : '无效'
    }
  },
}
</script>

<style scoped lang="scss">
.edit_container {
  height: 500px;
}
</style>
