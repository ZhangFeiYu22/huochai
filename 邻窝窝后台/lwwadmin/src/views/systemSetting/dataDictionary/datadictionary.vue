<template>
  <div class="auth-wrap">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="ID">
        <el-input size="small" v-model="searchForm.id$LIKE"></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-input size="small" v-model="searchForm.name$LIKE"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="showAndDictionary">添加字典</el-button>
      </el-form-item>
    </el-form>

    <el-table
      border
      :data="dictionarys"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      @expand-change="expandSelect"
      ref="refTable"
      style="width: 100%; margin-bottom:50px;"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row style="margin-bottom:10px;">
            <el-button
              size="small"
              type="primary"
              plain
              @click="showAndDictionary2(props.$index,props.row)"
            >添加选项</el-button>
            <el-button size="small" plain>全部保存</el-button>
          </el-row>
          <el-table border :data="dictionarysItems" style="width: 100%; margin-bottom:50px;">
            <!-- <el-table-column label="拖动排序" prop="sortIndex"></el-table-column> -->
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="Key" prop="value"></el-table-column>
            <el-table-column label="Text" prop="text"></el-table-column>
            <el-table-column label="助记码" prop="searchCode"></el-table-column>
            <el-table-column label="说明" prop="describe"></el-table-column>
            <el-table-column label="识别码" prop="ordinal"></el-table-column>
            <el-table-column label="是否启用" prop="status" :formatter="formatterColumn"></el-table-column>
            <el-table-column prop="action" label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="dictionaryEdit2(scope.$index,scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="delDictionary2(scope.$index,scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="分类" prop="classifiedId"></el-table-column>
      <el-table-column label="备注" prop="describe"></el-table-column>
      <el-table-column prop="action" label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="dictionaryEdit1(scope.$index,scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="delDictionary(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--添加编辑一级数据-->
    <el-dialog
      :title="add_edit_val == 1 ? '添加数据' : '编辑数据'"
      :visible.sync="dialogTableVisible1"
      center
    >
      <el-form :model="addForm1" ref="addForm1">
        <el-form-item label="ID" :label-width="formLabelWidth">
          <el-input
            :disabled="add_edit_val == 1 ? false : true"
            v-model="addForm1.id"
            placeholder="保存后不可修改"
            style="width: 320px"
          ></el-input>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="addForm1.name" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="分类" :label-width="formLabelWidth">
          <el-input v-model="addForm1.classifiedId" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="addForm1.describe" style="width: 320px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dictionarySave1">保存</el-button>
      </div>
    </el-dialog>
    <!--添加编辑二级数据-->
    <el-dialog
      :title="add_edit_val == 1 ? '添加数据' : '编辑数据'"
      :visible.sync="dialogTableVisible2"
      center
    >
      <el-form :model="addForm2" ref="addForm2">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="addForm2.name" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="key" :label-width="formLabelWidth">
          <el-input v-model="addForm2.value" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="Text" :label-width="formLabelWidth">
          <el-input v-model="addForm2.text" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="助记码" :label-width="formLabelWidth">
          <el-input v-model="addForm2.searchCode" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="说明" :label-width="formLabelWidth">
          <el-input v-model="addForm2.describe" style="width: 320px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dictionarySaveItem">保存</el-button>
      </div>
    </el-dialog>

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
  </div>
</template>

<script type="text/ecmascript-6">
import { getPermissList, searchPermiss, editPermiss, addPermiss } from 'api/permission'
import { getDictionaryList, getDictionaryItem, delDictionary, delDictionary2, addDictionary, addDictionaryItem, searchDictionary } from 'api/dataDictionary'
import { statusCode } from 'common/js/config'
import { dictionaryQuParam, arrayToTreeArray, encodeQueryParam } from 'common/js/utils'

export default {
  data () {
    return {
      expands: [],
      getRowKeys (row) {
        return row.id
      },
      searchForm: {
        id$LIKE: '',
        name$LIKE: ''
      },
      dictionarys: [],
      dictionarysItems: [],
      currentRow: null,
      total: 0,  //总条目数
      page: 1,  //
      pageSize: 10,  //每页显示条目个数
      formLabelWidth: '183px',
      activeName: 'first',
      currentPage: 1,  //当前页数
      add_edit_val: 0,   //  1表示增加,2表示编辑
      rowData: null,  //展开的当前行的数据
      dialogTableVisible1: false,
      addForm1: {
        classifiedId: "",
        describe: "",
        id: "",
        name: ""
      },
      dialogTableVisible2: false,
      addForm2: {
        classifiedId: "",
        describe: "",
        value: '',
        text: '',
        searchCode: '',
        id: "",
        name: "",
        ordinal: 0,
      },
      formLabelWidth: '140px'
    }
  },
  created () {
    this._getPermissList(0, this.pageSize)
  },
  methods: {
    // 展示权限列表
    _getPermissList (pageNow, pageSize) {
      getDictionaryList(pageNow, pageSize).then((res) => {
        if (res.status === 200) {
          this.dictionarys = res.result.data
          this.pageSize = res.result.pageSize
          this.total = res.result.total
          this.currentPage = res.result.pageIndex + 1
        }
      })
    },
    listDevelopTable () {
      var _this = this;
      _this.dictionarysItems = [];   //初始化
      // _this.$refs.refTable.toggleRowExpansion(row)   //这是一个转换
      // let queryParams = dictionaryQuParam(row)
      let queryParams = dictionaryQuParam(_this.rowData)
      let queryParamsPage = {
        paging: false
      }
      getDictionaryItem(queryParams, queryParamsPage).then((res) => {
        if (res.status === statusCode) {
          let newArray = Array.from(arrayToTreeArray(res.result, '-1'))
          for (var i = 0; i < newArray.length; i++) {
            _this.$set(_this.dictionarysItems, i, newArray[i])
          }
        }
      })
    },
    expandSelect (row, expandedRows) {
      var that = this
      if (expandedRows.length) {
        that.expands = []  //初始化一次
        that.expands.push(row.id)
        that.rowData = row;
        that.listDevelopTable();   //在这里渲染数据
      } else {
        that.expands = []
      }

    },
    search () {
      this.total = 0
      this.page = 1
      this.searchDictionary()
    },
    searchDictionary () {
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
      searchDictionary(queryParams.name, queryParamsPage).then((res) => {
        if (res.status === statusCode) {
          that.total = res.total
          this.dictionarys = res.result.data
        }
      }).catch((error) => {
        console.log(error)
        that.$message.error({
          message: '请求出现异常',
          duration: 2000
        })
      })
    },
    currentChange (val) {
      this.currentRow = val
    },

    // 添加一级菜单
    showAndDictionary () {
      this.dialogTableVisible1 = true
      this.add_edit_val = 1
      var num = this.dictionarys.length + 1;
      this.addForm1 = {
        status: 1,
        _id: num,
        _state: 'added',
        _uid: num,
      }
    },
    // 编辑一级菜单
    dictionaryEdit1 (index, row) {
      this.dialogTableVisible1 = true
      this.add_edit_val = 2
      this.addForm1 = row
      this.addForm1._id = index + 1
      this.addForm1._state = 'modified'
      this.addForm1._uid = index + 1
    },
    // 添加之后保存一级菜单
    dictionarySave1 () {
      let that = this
      this.$confirm('确定保存吗？', '提示', {}).then(() => {
        let params = that.addForm1
        addDictionary(params).then((res) => {
          if (res.status === statusCode) {
            that.$message.success({
              message: '保存成功',
              duration: 2000
            })
            this.dialogTableVisible1 = false
            this._getPermissList(this.currentPage, this.pageSize)
          } else {
            that.$message.error({
              message: '添加权限失败',
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
    },
    // 删除一级菜单
    delDictionary (index, row) {
      let that = this
      this.$confirm('是否删除此数据字典？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDictionary(row.id).then((res) => {
          if (res.status === statusCode) {
            that.$message.success({
              message: '删除成功',
              duration: 1500
            })
            that._getPermissList(that.currentPage, that.pageSize)
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
    //添加二级菜单内容
    showAndDictionary2 (index, row) {
      this.dialogTableVisible2 = true
      this.add_edit_val = 1
      var num = this.dictionarysItems.length + 1;
      this.addForm2 = {
        describe: "",
        dictId: row.id,
        name: "",
        ordinal: this.dictionarysItems.length + 1,
        searchCode: "",
        sortIndex: this.dictionarysItems.length,
        status: 1,
        text: "",
        value: "",
        _state: "added"
      }
    },
    // 编辑二级菜单
    dictionaryEdit2 (index, row) {
      this.dialogTableVisible2 = true
      this.add_edit_val = 2
      this.addForm2 = row
      this.addForm1._id = index + 1
      this.addForm1._state = 'modified'
      this.addForm1._uid = index + 1
    },
    // 保存二级菜单
    dictionarySaveItem () {
      let that = this
      this.$confirm('确定保存吗？', '提示', {}).then(() => {
        let params = that.addForm2
        addDictionaryItem(params).then((res) => {
          if (res.status === statusCode) {
            that.$message.success({
              message: '保存成功',
              duration: 2000
            })
            this.dialogTableVisible2 = false
            this.listDevelopTable()
          } else {
            that.$message.error({
              message: '添加权限失败',
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
    },
    // 删除二级菜单
    delDictionary2 (index, row) {
      let that = this
      this.$confirm('是否删除此数据字典？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDictionary2(row.id).then((res) => {
          if (res.status === statusCode) {
            that.$message.success({
              message: '删除成功',
              duration: 1500
            })
            this.dialogTableVisible2 = false
            this.listDevelopTable()
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

    // 页码变化
    handleCurrentChange (val) {
      this.pageIndex = val
      this._getPermissList(val - 1, this.pageSize)
    },
    // 每页显示多少条
    handleSizeChange (pageNum) {
      this._getPermissList(this.currentPage - 1, pageNum)
    },
    // 是否启用显示转换
    formatterColumn (row, column) {
      return row.status === 1 ? '启用' : '未启用'
    }
  }
}
</script>

<style>
</style>
