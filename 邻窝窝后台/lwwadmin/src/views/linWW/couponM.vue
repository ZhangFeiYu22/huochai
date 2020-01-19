<template>
  <div class="homePage-wrap">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="代金券名称">
        <el-input size="small" v-model="searchForm.name$LIKE"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="showAddCoupon">添加代金券</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="couponList" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="name" align="center" label="代金券名称"></el-table-column>
      <el-table-column prop="subName" align="center" label="代金券副标题"></el-table-column>
      <el-table-column prop="merchantId" align="center" label="所属店家" sortable></el-table-column>
      <el-table-column prop="cid" align="center" label="所属社区"></el-table-column>
      <el-table-column prop="endTime" align="center" label="有效期"></el-table-column>
      <el-table-column prop="useNum" align="center" label="有效次数"></el-table-column>
      <el-table-column prop="type" align="center" label="类型" :formatter="formatterType"></el-table-column>
      <el-table-column prop="status" align="center" label="状态" :formatter="formatterStatus"></el-table-column>
      <el-table-column prop="sort" align="center" label="排序" sortable></el-table-column>
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
      :title="add_edit_val == 1 ? '添加代金券' : '编辑代金券'"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal='false'
      center
      @close="closeChange"
    >
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="代金券名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" placeholder="请输入代金券名称" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="代金券副标题" :label-width="formLabelWidth">
          <el-input v-model="addForm.subName" placeholder="请输入代金券副标题" style="width: 320px"></el-input>
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
        <el-form-item label="图片轮播" :label-width="formLabelWidth">
          <div class="headUpload_lww_moreImg">
            <div class="box" v-loading.lock="fullscreenLoading">
              <input
                type="file"
                ref="pathClear"
                name="image"
                accept="image/*"
                @change="onchangeImgFun3"
                class="upload-input"
              />
              <div class="moreImg" v-loading.lock="fullscreenLoading">
                <div class="imgbox" v-for="(imgItem,index) in mediaMoreImgShow" :key="index">
                  <img :src="$root.imgUrlHttp + imgItem" class="upload-img" mode="aspectFit" />
                  <div class="del" @click="moreImgDel(index)">删除</div>
                </div>
              </div>
              <button class="upload-btn">添加图片</button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="所属店家" :label-width="formLabelWidth">
          <el-select v-model="addForm.merchantId" placeholder="所属店家">
            <el-option
              v-for="item in sellerList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-select v-model="addForm.type" placeholder="类型">
            <el-option label="精选" :value="1"></el-option>
            <el-option label="美食" :value="2"></el-option>
            <el-option label="生活" :value="3"></el-option>
            <el-option label="健康" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效次数" :label-width="formLabelWidth">
          <el-input v-model="addForm.useNum" placeholder="请输入有效次数" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="使用内容" :label-width="formLabelWidth">
          <!-- <el-input v-model="addForm.content" type="textarea" style="width: 320px"></el-input> -->
          <div class="edit_container">
            <myeditor @getContent="fetchContent1" :content="editContent1"></myeditor>
          </div>
        </el-form-item>
        <el-form-item label="有效期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="addForm.endTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width: 320px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="显示价格" :label-width="formLabelWidth">
          <el-input v-model="addForm.showPrice" placeholder="请输入显示价格" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="销售价格" :label-width="formLabelWidth">
          <el-input v-model="addForm.actualPrice" placeholder="请输入销售价格" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="使用时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="addForm.useTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            style="width: 320px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="使用限制" :label-width="formLabelWidth">
          <!-- <el-input v-model="addForm.useLimit" style="width: 320px"></el-input> -->
          <div class="edit_container">
            <myeditor @getContent="fetchContent2" :content="editContent2"></myeditor>
          </div>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth">
          <el-input v-model="addForm.phone" placeholder="请输入联系电话" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="使用规则" :label-width="formLabelWidth">
          <!-- <el-input v-model="addForm.notice" type="textarea" style="width: 320px"></el-input> -->
          <div class="edit_container">
            <myeditor @getContent="fetchContent3" :content="editContent3"></myeditor>
          </div>
        </el-form-item>
        <el-form-item label="显示首页" :label-width="formLabelWidth">
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
          <el-input v-model="addForm.sort" placeholder="请输入排序序号" style="width: 320px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveCoupon">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
import myeditor from "@/components/myeditor.vue";
import { getCommunityListNopage, getMerchantListNoPaging, getCouponList, addCoupon, delCoupon, getCouponItem, searchCoupon } from 'api/lww'
import { statusCode } from 'common/js/config'
import { encodeQueryParam } from 'common/js/utils'
export default {
  components: {
    myeditor
  },
  data () {
    return {
      sellerList: [],  //店家列表
      add_edit_val: 0,   //  1表示增加,2表示编辑
      dialogTableVisible: false,
      addForm: {
        content: "",
        coverFour: "",
        coverOne: "",
        coverThree: "",
        coverTwo: "",
        endTime: "",
        id: "",
        useNum: 1,
        merchantId: "",
        actualPrice: '',
        showPrice: '',
        isHome: '',
        name: "",
        notice: "",
        phone: "",
        sort: 0,
        status: 0,
        subName: '',  //代金券副标题
        type: 0,
        useLimit: "",
        useTime: ""
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
      couponList: [],   //代金券列表
      communityList: [],    //社区列表
      mediaMoreImgShow: [],
      fullscreenLoading: false,  //上传等待动画
      editContent1: '',
      editContent2: '',
      editContent3: ''
    }
  },
  created () {
    this.fetchMerchant();
  },
  methods: {
    // 富文本编辑器
    fetchContent1 (content) {
      this.addForm.content = content;
    },
    fetchContent2 (content) {
      this.addForm.useLimit = content;
    },
    fetchContent3 (content) {
      this.addForm.notice = content;
    },
    closeChange () {
      this.editContent1 = ''
      this.editContent2 = ''
      this.editContent3 = ''
    },
    async fetchCommunityList () {
      let communitys = await getCommunityListNopage()
      if (communitys.status == 200) {
        this.communityList = communitys.result
        for (let ii of this.couponList) {
          for (let iiii of this.communityList) {
            if (ii.cid == iiii.id) {
              ii.cid = iiii.name
            }
          }
        }
      }
    },
    async _getCouponList (pageNow, pageSize) {
      let coupon = await getCouponList(pageNow, pageSize)
      if (coupon.status === statusCode) {
        this.couponList = coupon.result.data
        this.pageSize = coupon.result.pageSize
        this.currentPage = coupon.result.pageIndex
        this.total = coupon.result.total
        //转换店家
        this.couponList.forEach(citem => {
          this.sellerList.forEach(sitem => {
            if (citem.merchantId == sitem.id) {
              citem.merchantId = sitem.name
            }
          })
        })
        this.fetchCommunityList()   //转换社区
      }
    },
    async fetchMerchant () {
      //获取店家列表
      let sellerList = await getMerchantListNoPaging()
      if (sellerList.status == 200) {
        this.sellerList = sellerList.result
      }
      this._getCouponList(0, this.pageSize)
    },
    showAddCoupon () {
      this.dialogTableVisible = true
      this.mediaMoreImgShow = []
      this.add_edit_val = 1;
      this.addForm = {
        content: "",
        coverFour: "",
        coverOne: "",
        coverThree: "",
        coverTwo: "",
        endTime: "",
        merchantId: "",
        actualPrice: '',
        showPrice: '',
        isHome: '',
        name: "",
        useNum: 1,
        notice: "",
        phone: "",
        sort: '',
        status: '',
        subName: '',
        type: '',
        useLimit: "",
        useTime: ""
      }
      this.editContent1 = '';
      this.editContent2 = '';
      this.editContent3 = '';
    },
    // 保存
    saveCoupon () {
      let that = this
      let imgArray = that.mediaMoreImgShow;
      if (imgArray[0]) {
        this.addForm.coverOne = imgArray[0]
      } else {
        this.addForm.coverOne = ''
      }
      if (imgArray[1]) {
        this.addForm.coverTwo = imgArray[1]
      } else {
        this.addForm.coverTwo = ''
      }
      if (imgArray[2]) {
        this.addForm.coverThree = imgArray[2]
      } else {
        this.addForm.coverThree = ''
      }
      if (imgArray[3]) {
        this.addForm.coverFour = imgArray[3]
      } else {
        this.addForm.coverFour = ''
      }
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {}).then(() => {
            // let params = Object.assign({}, this.addForm)
            this.addForm.sort = parseInt(this.addForm.sort)
            this.addForm.status = parseInt(this.addForm.status)
            this.addForm.type = parseInt(this.addForm.type)
            this.addForm.useNum = parseInt(this.addForm.useNum)
            this.addForm.actualPrice = parseFloat(this.addForm.actualPrice)
            this.addForm.showPrice = parseFloat(this.addForm.showPrice)
            this.addForm.isHome = parseInt(this.addForm.isHome)

            let params = this.addForm
            addCoupon(params).then((res) => {
              if (res.status === statusCode) {
                that.$message.success({
                  message: this.add_edit_val == 1 ? '添加成功' : '编辑成功',
                  duration: 2000
                })
                // that.$refs['addForm'].resetFields()
                this._getCouponList(this.currentPage, this.pageSize)
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
        delCoupon(row.id).then((res) => {
          if (res.status === statusCode) {
            that.$message.success({
              message: '删除成功',
              duration: 1500
            })
            that._getCouponList(this.currentPage - 1, this.pageSize)
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
      this.mediaMoreImgShow = []
      getCouponItem(row.id).then((res) => {
        let jsonData = JSON.parse(res)
        this.addForm = jsonData.result;
        this.editContent1 = this.addForm.content
        this.editContent2 = this.addForm.useLimit
        this.editContent3 = this.addForm.notice
        if (jsonData.result.coverOne) {
          this.mediaMoreImgShow.push(jsonData.result.coverOne)
        }
        if (jsonData.result.coverTwo) {
          this.mediaMoreImgShow.push(jsonData.result.coverTwo)
        }
        if (jsonData.result.coverThree) {
          this.mediaMoreImgShow.push(jsonData.result.coverThree)
        }
        if (jsonData.result.coverFour) {
          this.mediaMoreImgShow.push(jsonData.result.coverFour)
        }

        for (let iiii of this.communityList) {
          if (this.addForm.cid == iiii.name) {
            this.addForm.cid = iiii.id
          }
        }
      })
    },
    handleCurrentChange (val) {
      this._getCouponList(val - 1, this.pageSize)
    },
    handleSizeChange (pageNum) {
      this._getCouponList(this.currentPage - 1, pageNum)
    },
    search () {
      this.total = 0
      this.page = 1
      this.searchCoupon()
    },
    searchCoupon () {
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
      searchCoupon(queryParams.name, queryParamsPage).then((res) => {
        if (res.status === statusCode) {
          this.couponList = res.result.data
          this.pageSize = res.result.pageSize
          this.currentPage = res.result.pageIndex + 1
          this.total = res.result.total
          // 转换店家
          this.couponList.forEach(citem => {
            this.sellerList.forEach(sitem => {
              if (citem.merchantId == sitem.id) {
                citem.merchantId = sitem.name
              }
            })
          })
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
    // 轮播图片上传
    onchangeImgFun3 (e) {
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
      if (_this.mediaMoreImgShow.length < 4) {
        _this.fullscreenLoading = true
        this.$axios.post(`/file/upload-static`, forData, config)
          .then(response => {
            if (response.data.status == 200) {
              _this.$refs.pathClear.value = ''
              let imgurl = response.data.result
              _this.mediaMoreImgShow.push(response.data.result)
              _this.fullscreenLoading = false
            }
          })
      } else {
        _this.$message({
          message: '最多可上传四张',
          duration: 2000
        })
      }

    },
    moreImgDel (index) {
      console.log('删除序号---', index)
      this.mediaMoreImgShow.splice(index, 1)
    },
    // 类型转换显示
    formatterType (row, column) {
      switch (row.type) {
        case 1:
          return '精选'
          break;
        case 2:
          return '美食'
          break;
        case 3:
          return '生活'
          break;
        case 4:
          return '健康'
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
.headUpload_lww_moreImg {
  padding-bottom: 60px;
  .box {
    position: relative;
    .moreImg {
      display: flex;
      flex-wrap: wrap;
      .imgbox {
        position: relative;
        margin-right: 5px;
        margin-bottom: 5px;
        &:hover {
          .del {
            bottom: 15px;
            opacity: 1;
          }
        }
        .upload-img {
          width: 100px;
          height: 100px;
        }
        .del {
          position: absolute;
          background-color: rgba(0, 0, 0, 0.4);
          width: 100%;
          height: 30px;
          line-height: 30px;
          text-align: center;
          bottom: -15px;
          color: #eee;
          opacity: 0;
          transition: all 0.2s;
          cursor: pointer;
        }
      }
    }
    input {
      position: absolute;
      z-index: 2;
      bottom: -50px;
      left: 10px;
      background-color: #456;
      height: 40px;
      width: 120px;
      opacity: 0;
      cursor: pointer;
    }
    .upload-btn {
      position: absolute;
      z-index: 1;
      bottom: -45px;
      left: 10px;
      height: 40px;
      width: 120px;
      background-color: #00b7ee;
      border: none;
      color: #fff;
      border-radius: 5px;
    }
  }
}
</style>
