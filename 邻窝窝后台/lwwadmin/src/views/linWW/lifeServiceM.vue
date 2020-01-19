<template>
  <div class="homePage-wrap">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="序号">
        <el-input size="small" v-model="searchForm.id$LIKE"></el-input>
      </el-form-item>
      <el-form-item label="生活服务名称">
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
          @click="showAddLifeService"
        >添加生活服务</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="lifeServiceList" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <!-- <el-table-column prop="id" align="center" label="序号"></el-table-column> -->
      <el-table-column prop="name" align="center" label="名称"></el-table-column>
      <!-- <el-table-column prop="cover" align="center" label="图片"></el-table-column> -->
      <el-table-column prop="classId" align="center" label="所属分类" :formatter="formatterClassId"></el-table-column>
      <el-table-column prop="price" align="center" label="价格"></el-table-column>
      <el-table-column prop="phone" align="center" label="电话"></el-table-column>
      <el-table-column prop="contacts" align="center" label="联系人"></el-table-column>
      <el-table-column prop="address" align="center" label="地址"></el-table-column>
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
      :title="add_edit_val == 1 ? '添加生活服务' : '编辑生活服务'"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal='false'
      center
    >
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="服务名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" placeholder="请输入服务名称" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth">
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
        <el-form-item label="分类" :label-width="formLabelWidth">
          <!-- <el-select v-model="addForm.classId" placeholder="分类">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
          </el-select>-->
          <el-cascader
            v-model="addForm.classId"
            :options="serviceClassShow"
            :props="{ value: 'id',label: 'name'}"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="联系人" :label-width="formLabelWidth">
          <el-input v-model="addForm.contacts" placeholder="请输入联系人" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth">
          <el-input v-model="addForm.phone" placeholder="请输入联系电话" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth">
          <el-input v-model="addForm.price" placeholder="请输入价格" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="addForm.address" placeholder="请输入正确的地址" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth">
          <el-input v-model="addForm.introduction" type="textarea" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="addForm.status" placeholder="请选择状态">
            <el-option label="有效" :value="1"></el-option>
            <el-option label="无效" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input v-model="addForm.sort" placeholder="请输入排序序号" style="width: 320px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveLifeService">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
import { getLifeServiceList, getServiceClassList2, addLifeService, delLifeService, getLifeServiceItem, searchLifeService } from 'api/lww'
import { statusCode } from 'common/js/config'
import { encodeQueryParam } from 'common/js/utils'
export default {
  data () {
    return {
      fullscreenLoading: false,  //上传等待动画
      add_edit_val: 0,   //  1表示增加,2表示编辑
      dialogTableVisible: false,
      addForm: {
        address: "",   //地址
        classId: "",  //分类id
        contacts: "",  //联系人
        cover: "",  //封面图
        id: "",  //生活服务id
        introduction: "",  //简介
        name: "",  //名称
        phone: "", //联系电话
        price: '',  //价格
        sort: '',
        status: ''
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
      lifeServiceList: [],
      serviceClassListAll: [],
      serviceClassList: [],
      serviceClassShow: []
    }
  },
  created () {
    this._getLifeServiceList(0, this.pageSize)
    this._getServiceClassList2()
  },
  methods: {
    // 不分页
    _getServiceClassList2 () {
      getServiceClassList2().then((res) => {
        if (res.status === statusCode) {
          this.serviceClassListAll = res.result
          let result = []
          for (let item of res.result) {
            if (item.pid == '0') {
              result.push(item)
            }
          }
          this.serviceClassList = result
          var disabledArr = this.run(this.serviceClassList, this.serviceClassListAll)
          // 如果只有一级  禁止选择  加一个disabled值
          for (let item of disabledArr) {
            if (item.children == undefined) {
              item.disabled = 'true'
            }
          }
          this.serviceClassShow = disabledArr
          console.log('5------', this.serviceClassShow)
        }
      })
    },
    run (aimArr, allArr) {
      if (allArr.length !== 0) {
        for (var i = 0; i < aimArr.length; i++) {
          for (var j = 0; j < allArr.length; j++) {
            if (aimArr[i].id == allArr[j].pid) {
              const obj = {
                name: allArr[j].name,
                id: allArr[j].id
              }
              if (!aimArr[i].children) {
                aimArr[i].children = []
              }
              aimArr[i].children.push(obj)
            }
          }
        }
      }
      return aimArr
    },
    handleChange (val) {
      this.addForm.classId = val.slice(-1)[0]
    },
    _getLifeServiceList (pageNow, pageSize) {
      getLifeServiceList(pageNow, pageSize).then((res) => {
        if (res.status === statusCode) {
          this.lifeServiceList = res.result.data
          this.pageSize = res.result.pageSize
          this.currentPage = res.result.pageIndex + 1
          this.total = res.result.total
        }
      })
    },
    showAddLifeService () {
      this.dialogTableVisible = true
      this.add_edit_val = 1;
      this.addForm = {
        address: "",
        classId: "",
        contacts: "",
        cover: "",
        introduction: "",
        name: "",
        phone: "",
        price: '',
        sort: '',
        status: ''
      }
    },
    // 增加
    saveLifeService () {
      let that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {}).then(() => {
            // let params = Object.assign({}, this.addForm)
            this.addForm.sort = parseInt(this.addForm.sort)
            this.addForm.status = parseInt(this.addForm.status)
            this.addForm.type = parseInt(this.addForm.type)
            let params = this.addForm
            addLifeService(params).then((res) => {
              if (res.status === statusCode) {
                that.$message.success({
                  message: this.add_edit_val == 1 ? '添加成功' : '编辑成功',
                  duration: 2000
                })
                // that.$refs['addForm'].resetFields()
                this._getLifeServiceList(this.currentPage - 1, this.pageSize)
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
        delLifeService(row.id).then((res) => {
          if (res.status === statusCode) {
            that.$message.success({
              message: '删除成功',
              duration: 1500
            })
            that._getLifeServiceList(this.currentPage - 1, this.pageSize)
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
      getLifeServiceItem(row.id).then((res) => {
        let jsonData = JSON.parse(res)
        this.addForm = jsonData.result
      })
    },
    handleCurrentChange (val) {
      this._getLifeServiceList(val - 1, this.pageSize)
    },
    handleSizeChange (pageNum) {
      this._getLifeServiceList(this.currentPage - 1, pageNum)
    },
    search () {
      this.total = 0
      this.page = 1
      this.searchLifeService()
    },
    searchLifeService () {
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
      searchLifeService(queryParams.name, queryParamsPage).then((res) => {
        if (res.status === statusCode) {
          this.lifeServiceList = res.result.data
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
            _this.addForm.cover = response.data.result
            _this.fullscreenLoading = false
          }
        })
    },
    // 只有两级可以选择,可以挑选
    formatterClassId (row, column) {
      for (let item of this.serviceClassListAll) {
        if (row.classId == item.id) {
          for (let item2 of this.serviceClassList) {
            if (item2.children) {
              for (let item3 of item2.children) {
                if (row.classId == item3.id) {
                  return item2.name + '/' + item.name
                }
              }
            }
          }
        }
      }
    },
    formatterStatus (row, column) {
      return row.status == 1 ? '有效' : '无效'
    }
  },
}
</script>

<style>
</style>
