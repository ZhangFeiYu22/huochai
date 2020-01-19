<template>
  <div class="homePage-wrap">
    <el-form :inline="true" :model="searchForm">
      <!-- <el-form-item label="序号">
        <el-input size="small" v-model="searchForm.id$LIKE"></el-input>
      </el-form-item>-->
      <el-form-item label="店家名称">
        <el-input size="small" v-model="searchForm.name$LIKE"></el-input>
      </el-form-item>
      <el-form-item label="店家电话">
        <el-input size="small" v-model="searchForm.phone$LIKE"></el-input>
      </el-form-item>
      <el-form-item label="店家地址">
        <el-input size="small" v-model="searchForm.address$LIKE"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="showAddCommunity">添加店家</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="merchantList" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <!-- <el-table-column prop="id" align="center" label="序号"></el-table-column> -->
      <el-table-column prop="name" align="center" label="店家名称"></el-table-column>
      <el-table-column prop="cid" align="center" label="所属社区"></el-table-column>
      <el-table-column prop="account" align="center" label="账号"></el-table-column>
      <el-table-column prop="score" align="center" label="评分"></el-table-column>
      <el-table-column prop="classId" align="center" label="分类"></el-table-column>
      <el-table-column prop="perCapita" align="center" label="人均消费"></el-table-column>
      <el-table-column prop="openHours" align="center" label="营业时间"></el-table-column>
      <el-table-column prop="address" align="center" label="地址"></el-table-column>
      <el-table-column prop="phone" align="center" label="联系电话"></el-table-column>
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
      :title="add_edit_val == 1 ? '添加店家' : '编辑店家'"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal='false'
      center
    >
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="店家名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" style="width: 320px"></el-input>
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
        <el-form-item label="账号" :label-width="formLabelWidth">
          <el-input v-model="addForm.account" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="addForm.password" style="width: 320px"></el-input>
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
        <el-form-item label="评分" :label-width="formLabelWidth">
          <el-input v-model="addForm.score" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="分类" :label-width="formLabelWidth">
          <el-select v-model="addForm.classId" placeholder="请选择分类">
            <el-option label="餐饮" :value="'餐饮'"></el-option>
            <el-option label="茶饮" :value="'茶饮'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人均消费" :label-width="formLabelWidth">
          <el-input v-model="addForm.perCapita" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="营业时间" :label-width="formLabelWidth">
          <el-time-picker
            is-range
            @change="openHoursChangeFun"
            v-model="addFormOpenHoursShow"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            format="HH:mm"
            value-format="HH:mm"
          ></el-time-picker>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="addForm.address" placeholder="请输入地址" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="定位" :label-width="formLabelWidth">
          <el-input v-model="addForm.location" placeholder="请输入定位" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth">
          <el-input v-model="addForm.phone" placeholder="请输入联系电话" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="店家简介" :label-width="formLabelWidth">
          <el-input v-model="addForm.introduction" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="addForm.status" placeholder="状态">
            <el-option label="有效" :value="1"></el-option>
            <el-option label="无效" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input v-model="addForm.sort" placeholder="请输入排序序号" style="width: 320px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveCommunity">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
import { getMerchantListNoPaging, getCommunityListNopage, getMerchantList, addMerchant, delMerchant, getMerchantItem, searchMerchant } from 'api/lww'
import { statusCode } from 'common/js/config'
import { encodeQueryParam } from 'common/js/utils'
export default {
  data () {
    return {
      addFormOpenHoursShow: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      add_edit_val: 0,   //  1表示增加,2表示编辑
      fullscreenLoading: false,  //上传等待动画
      dialogTableVisible: false,
      addForm: {
        account: "",
        address: "",
        cid: "",
        classId: "",
        cover: "",
        id: "",  //商家id
        introduction: "",
        location: "",
        logo: "",
        name: "",
        openHours: "",
        password: "",
        perCapita: 0,
        phone: "",
        score: 0,
        sort: 0,
        status: 0
      },
      formLabelWidth: '140px',
      currentPage: 1,
      total: 0,
      page: 1,
      pageSize: 10,
      searchForm: {
        id$LIKE: '',
        name$LIKE: '',
        phone$LIKE: '',
        address$LIKE: ''
      },
      merchantList: [],  //商家列表
      communityList: []    //社区列表
    }
  },
  created () {
    this._getMerchantList(0, this.pageSize)

  },
  methods: {
    async fetchCommunityList () {
      let communitys = await getCommunityListNopage()
      if (communitys.status == 200) {
        this.communityList = communitys.result
        for (let ii of this.merchantList) {
          for (let iiii of this.communityList) {
            if (ii.cid == iiii.id) {
              ii.cid = iiii.name
            }
          }
        }
      }
    },
    _getMerchantList (pageNow, pageSize) {
      getMerchantList(pageNow, pageSize).then((res) => {
        if (res.status === statusCode) {
          this.merchantList = res.result.data
          this.pageSize = res.result.pageSize
          this.currentPage = res.result.pageIndex + 1
          this.total = res.result.total
          this.fetchCommunityList()  //转换社区
        }
      })
    },
    showAddCommunity () {
      this.dialogTableVisible = true
      this.add_edit_val = 1;
      this.addForm = {
        address: "",
        cid: "",
        classId: "",
        cover: "",
        introduction: "",
        location: "",
        logo: "",
        name: "",
        openHours: "",
        password: "",
        perCapita: '',
        phone: "",
        score: '',
        sort: '',
        status: ''
      }
    },
    // 增加
    saveCommunity () {
      let that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {}).then(() => {
            // let params = Object.assign({}, this.addForm)
            this.addForm.sort = parseInt(this.addForm.sort)
            this.addForm.status = parseInt(this.addForm.status)
            this.addForm.score = parseInt(this.addForm.score)
            this.addForm.perCapita = parseInt(this.addForm.perCapita)
            let params = this.addForm
            addMerchant(params).then((res) => {
              if (res.status === statusCode) {
                that.$message.success({
                  message: this.add_edit_val == 1 ? '添加成功' : '编辑成功',
                  duration: 2000
                })
                // that.$refs['addForm'].resetFields()
                this._getMerchantList(this.currentPage, this.pageSize)
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
        delMerchant(row.id).then((res) => {
          if (res.status === statusCode) {
            that.$message.success({
              message: '删除成功',
              duration: 1500
            })
            that._getMerchantList(this.currentPage - 1, this.pageSize)
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
      getMerchantItem(row.id).then((res) => {
        let jsonData = JSON.parse(res)
        this.addForm = jsonData.result
        this.addFormOpenHoursShow = this.addForm.openHours.split(' - ')
        for (let iiii of this.communityList) {
          if (this.addForm.cid == iiii.name) {
            this.addForm.cid = iiii.id
          }
        }

      })
    },
    handleCurrentChange (val) {
      this._getMerchantList(val - 1, this.pageSize)
    },
    handleSizeChange (pageNum) {
      this._getMerchantList(this.currentPage - 1, pageNum)
    },
    search () {
      this.total = 0
      this.page = 1
      this.searchMerchant()
    },
    searchMerchant () {
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
      searchMerchant(queryParams.name, queryParamsPage).then((res) => {
        if (res.status === statusCode) {
          this.merchantList = res.result.data
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
    openHoursChangeFun (val) {
      console.log('起止时间---', val)
      let str = val[0] + ' - ' + val[1]
      this.addForm.openHours = str
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

<style>
</style>
