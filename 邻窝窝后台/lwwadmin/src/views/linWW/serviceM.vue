<template>
  <div class="homePage-wrap">
    <el-form :inline="true" :model="searchForm">
      <!-- <el-form-item label="序号">
        <el-input size="small" v-model="searchForm.id$LIKE"></el-input>
      </el-form-item>-->
      <el-form-item label="服务分类名称">
        <el-input size="small" v-model="searchForm.name$LIKE"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="showFirst">一级服务分类</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="serviceClassList"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      @expand-change="expandSelect"
      border
      style="width: 100%"
    >
      <el-table-column type="expand" v-if="searchIS">
        <template slot-scope="props">
          <el-row style="margin-bottom:10px;">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-plus"
              plain
              @click="showSecond(props.$index,props.row)"
            >二级服务分类</el-button>
          </el-row>
          <el-table border :data="dictionarysItems" style="width: 100%; margin-bottom:50px;">
            <el-table-column prop="name" align="center" label="名称"></el-table-column>
            <!-- <el-table-column prop="backdoor" align="center" label="背景图"></el-table-column> -->
            <el-table-column prop="introduction" align="center" label="简介"></el-table-column>
            <el-table-column prop="status" align="center" label="状态" :formatter="formatterStatus"></el-table-column>
            <el-table-column prop="sort" align="center" label="排序"></el-table-column>
            <el-table-column prop="action" label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="editTypeItem(scope.$index,scope.row)"
                  type="primary"
                  plain
                >编辑</el-button>
                <el-button
                  size="mini"
                  @click="delTypeItem(scope.$index,scope.row)"
                  type="danger"
                  plain
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <!-- <el-table-column prop="id" align="center" label="序号"></el-table-column> -->
      <el-table-column prop="name" align="center" label="名称"></el-table-column>
      <el-table-column prop="introduction" align="center" label="简介"></el-table-column>
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
    <!-- <el-pagination
      style="margin-top:20px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="[5, 10, 15, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>-->

    <!--添加首页分类页面-->
    <el-dialog
      :title="add_edit_val == 1 ? '添加服务分类' : '编辑服务分类'"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal='false'
      center
    >
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="服务分类名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" auto-complete="off" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="背景图" :label-width="formLabelWidth" v-if="!addFirst">
          <div class="headUpload_lww">
            <div class="box" v-loading.lock="fullscreenLoading">
              <input
                type="file"
                name="image"
                accept="image/*"
                @change="onchangeImgFun2"
                class="upload-input"
              />
              <img alt :src="$root.imgUrlHttp + addForm.backdoor" class="upload-img" />
              <button class="upload-btn">图片上传</button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth">
          <el-input
            v-model="addForm.introduction"
            type="textarea"
            auto-complete="off"
            style="width: 320px"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="addForm.status" placeholder="状态">
            <el-option label="有效" value="1"></el-option>
            <el-option label="无效" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input v-model="addForm.sort" placeholder="请输入排序序号" style="width: 320px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveServiceClass">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
import { getServiceClassList, getServiceClassList2, getServiceClassList_nopaging, addServiceClass, delServiceClass, getServiceClassItem, searchServiceClass } from 'api/lww'
import { statusCode } from 'common/js/config'
import { dictionaryQuParam, encodeQueryParam } from 'common/js/utils'
export default {
  data () {
    return {
      searchIS: true,   //如果搜索  不显示多级
      expands: [],
      getRowKeys (row) {
        return row.id
      },
      fullscreenLoading: false,  //上传等待动画
      add_edit_val: 0,   //  1表示增加,2表示编辑
      dialogTableVisible: false,
      addFirst: false,
      addForm: {
        backdoor: "",  //背景图
        icon: "",  //图标
        id: "",
        introduction: "",  //简介
        pid: '',   //父级分类的id
        name: "",  //名称
        sort: '',  //排序
        status: '',  //状态
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
      serviceClassListAll: [],
      serviceClassList: [],
      dictionarysItems: [],
    }
  },
  created () {
    // this._getServiceClassList(0, this.pageSize)
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
        }
      })
    },
    _getServiceClassList (pageNow, pageSize) {
      getServiceClassList(pageNow, pageSize).then((res) => {
        if (res.status === statusCode) {

          // this.pageSize = res.result.pageSize
          // this.currentPage = pageNow ? pageNow : 1
          // this.total = res.result.total
          let result = []
          for (let item of res.result.data) {
            if (item.pid == '0') {
              result.push(item)
            }
          }
          this.serviceClassList = result
          console.log('result---', result)
        }
      })
    },
    // 添加一级菜单
    showFirst () {
      this.addFirst = true
      this.dialogTableVisible = true
      this.add_edit_val = 1;
      this.addForm = {
        backdoor: "",
        icon: "",
        introduction: "",
        name: "",
        pid: 0,
        sort: '',
        status: ''
      }
    },
    // 添加二级菜单
    showSecond (index, item) {
      this.addFirst = false
      this.dialogTableVisible = true
      this.add_edit_val = 1;
      this.addForm = {
        backdoor: "",
        icon: "",
        introduction: "",
        name: "",
        pid: item.id,
        sort: '',
        status: ''
      }
    },
    expandSelect (row, expandedRows) {
      var that = this
      if (expandedRows.length) {
        that.expands = []  //初始化一次
        that.expands.push(row.id)
        that.rowData = row;
        that.listDevelopTable(row.id);   //在这里渲染数据
      } else {
        that.expands = []
      }
    },
    listDevelopTable (rid) {
      this.dictionarysItems = []
      let arr = this.serviceClassListAll
      let newArr = []
      for (let item of arr) {
        if (item.pid == rid) {
          newArr.push(item)
        }
      }
      this.dictionarysItems = newArr
    },
    // 增加
    saveServiceClass () {
      let that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {}).then(() => {
            // let params = Object.assign({}, this.addForm)
            this.addForm.sort = parseInt(this.addForm.sort)
            this.addForm.status = parseInt(this.addForm.status)
            let params = this.addForm
            addServiceClass(params).then((res) => {
              if (res.status === statusCode) {
                that.$message.success({
                  message: this.add_edit_val == 1 ? '添加成功' : '编辑成功',
                  duration: 2000
                })
                // that.$refs['addForm'].resetFields()
                // this._getServiceClassList(this.currentPage, this.pageSize)
                this._getServiceClassList2()
                if (!that.addFirst) {
                  that.dictionarysItems.push(that.addForm)
                }

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
      console.log('index---222-', index, row)
      var ppp = false;   //  通过此值 判断是否是第一级并且是否有子级
      if (row.pid == '0') {
        for (let item of that.serviceClassListAll) {
          if (item.pid == row.id) {
            ppp = true;
          }
        }
        if (ppp) {
          that.$message({
            message: '该父级下有子级,请先删除子级',
            type: 'warning'
          });
        } else {
          that.delServiceClassFun(row.id,row.pid,index)
        }

      } else {
        that.delServiceClassFun(row.id,row.pid,index)
      }
    },
    delServiceClassFun (id,pid,index) {
      var that = this;
      this.$confirm('确定删除该条信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delServiceClass(id).then((res) => {
          if (res.status === statusCode) {
            that.$message.success({
              message: '删除成功',
              duration: 1500
            })
            // that._getServiceClassList(this.currentPage - 1, this.pageSize)
            that._getServiceClassList2()
            if (pid !== '0') {
              that.dictionarysItems.splice(index, 1)
            }
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
      if (row.pid == '0') {
        this.addFirst = true
      } else {
        this.addFirst = false
      }
      this.add_edit_val = 2;
      getServiceClassItem(row.id).then((res) => {
        let jsonData = JSON.parse(res)
        this.addForm = jsonData.result
      })
    },
    handleCurrentChange (val) {
      this._getServiceClassList(val - 1, this.pageSize)
    },
    handleSizeChange (pageNum) {
      this._getServiceClassList(this.currentPage - 1, pageNum)
    },
    search () {
      this.total = 0
      this.page = 1
      this.searchServiceClass()
    },
    searchServiceClass () {
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
      searchServiceClass(queryParams.name, queryParamsPage).then((res) => {
        if (res.status === statusCode) {
          if (this.searchForm.name$LIKE == '') {
            this.searchIS = true
            this.pageSize = res.result.pageSize
            this.currentPage = res.result.pageIndex + 1
            this.total = res.result.total
            this.serviceClassListAll = res.result.data
            let result = []
            for (let item of res.result.data) {
              if (item.pid == '0') {
                result.push(item)
              }
            }
            this.serviceClassList = result
          } else {
            this.searchIS = false
            this.serviceClassList = res.result.data
          }

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
    onchangeImgFun2 (e) {
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
            _this.addForm.backdoor = response.data.result
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
