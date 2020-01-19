<template>
  <div class="auth-wrap">
    <!--添加权限页面-->
    <el-dialog title="添加权限" :visible.sync="dialogFormVisible" center>
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="基本信息" name="first">
          <div>
            <el-form :model="addForm" ref="addForm">
              <el-form-item label="权限标识(ID):" :label-width="formLabelWidth">
                <el-input
                  v-model="addForm.id"
                  placeholder="只能由字母数字下划线组成"
                  auto-complete="off"
                  style="width: 240px"
                ></el-input>
              </el-form-item>
              <el-form-item label="权限名称:" :label-width="formLabelWidth">
                <el-input v-model="addForm.name" auto-complete="off" style="width: 240px"></el-input>
              </el-form-item>
              <el-form-item label="备注：" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="addForm.describe"></el-input>
              </el-form-item>
              <el-form-item label="支持的数据权限控制方式:" :label-width="formLabelWidth">
                <el-select v-model="id" multiple placeholder="请选择">
                  <el-option
                    v-for="item in allSupportDataAccessTypes"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>

            <el-table
              :data="actions"
              highlight-current-row
              @current-change="currentChange"
              height="400"
              border
              style="width: 100%"
            >
              <el-table-column prop="action" label="操作类型" align="center"></el-table-column>
              <el-table-column prop="describe" label="描述" align="center"></el-table-column>
              <el-table-column prop="defaultCheck" label="默认选中" align="center"></el-table-column>
              <el-table-column prop="renderAction" label="操作" align="center">
                <template>
                  <el-tooltip class="item" effect="light" content="添加" placement="bottom-start">
                    <el-button size="mini" type="primary" icon="el-icon-plus"></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="light" content="删除" placement="bottom-start">
                    <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <el-tab-pane label="数据视图" name="second">
          <el-table
            :data="viewData"
            highlight-current-row
            @current-change="currentChange"
            height="500"
            border
            style="width: 100%"
          >
            <el-table-column prop="name" label="字段" align="center"></el-table-column>
            <el-table-column prop="describe" label="描述" align="center"></el-table-column>
            <el-table-column prop="renderAction" label="操作" align="center">
              <template>
                <el-button size="mini" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="savePermiss">保存</el-button>
      </div>
    </el-dialog>

    <!--编辑页面-->
    <el-dialog title="编辑权限" :visible.sync="editFormVisible" center>
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="基本信息" name="first">
          <div>
            <el-form :model="editForm" ref="editForm">
              <el-form-item label="权限标识(ID):" :label-width="formLabelWidth">
                <el-input
                  v-model="editForm.id"
                  placeholder="只能由字母数字下划线组成"
                  auto-complete="off"
                  style="width: 240px"
                ></el-input>
              </el-form-item>
              <el-form-item label="权限名称:" :label-width="formLabelWidth">
                <el-input v-model="editForm.name" auto-complete="off" style="width: 240px"></el-input>
              </el-form-item>
              <el-form-item label="备注：" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="editForm.describe"></el-input>
              </el-form-item>
              <el-form-item label="支持的数据权限控制方式:" :label-width="formLabelWidth">
                <el-select v-model="id" multiple placeholder="请选择">
                  <el-option
                    v-for="item in allSupportDataAccessTypes"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>

            <el-table
              :data="actions"
              highlight-current-row
              @current-change="currentChange"
              height="400"
              border
              style="width: 100%"
            >
              <el-table-column prop="action" label="操作类型" align="center"></el-table-column>
              <el-table-column prop="describe" label="描述" align="center"></el-table-column>
              <el-table-column prop="defaultCheck" label="默认选中" align="center"></el-table-column>
              <el-table-column prop="renderAction" label="操作" align="center">
                <template>
                  <el-tooltip class="item" effect="light" content="添加" placement="bottom-start">
                    <el-button size="mini" type="primary" icon="el-icon-plus"></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="light" content="删除" placement="bottom-start">
                    <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <el-tab-pane label="数据视图" name="second">
          <el-table
            :data="viewData"
            highlight-current-row
            @current-change="currentChange"
            height="500"
            border
            style="width: 100%"
          >
            <el-table-column prop="name" label="字段" align="center"></el-table-column>
            <el-table-column prop="describe" label="描述" align="center"></el-table-column>
            <el-table-column prop="renderAction" label="操作" align="center">
              <template>
                <el-button size="mini" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editPermiss">保存</el-button>
      </div>
    </el-dialog>

    <el-form :inline="true" :model="searchForm">
      <el-form-item label="ID">
        <el-input size="small" v-model="searchForm.id$LIKE"></el-input>
      </el-form-item>
      <el-form-item label="名称">
        <el-input size="small" v-model="searchForm.name$LIKE"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input size="small" v-model="searchForm.describe$LIKE"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="showAndPermiss">添加权限</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="permissions"
      highlight-current-row
      @current-change="currentChange"
      height="500"
      border
      style="width: 100%"
    >
      <el-table-column type="index" align="center"></el-table-column>
      <el-table-column sortable prop="id" label="ID" align="center"></el-table-column>
      <el-table-column sortable prop="name" label="名称" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="formatterColumn" align="center"></el-table-column>
      <el-table-column prop="describe" label="备注" align="center"></el-table-column>
      <el-table-column prop="action" label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="showEditPermiss(scope.$index,scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="delPermiss(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
import { getPermissList, searchPermiss, delPermiss, editPermiss, addPermiss } from 'api/permission'
import { statusCode } from 'common/js/config'
import { encodeQueryParam } from 'common/js/utils'

export default {
  data () {
    return {
      searchForm: {
        id$LIKE: '',
        name$LIKE: '',
        describe$LIKE: ''
      },
      permissions: [],
      // 添加相关数据
      dialogFormVisible: false,
      allSupportDataAccessTypes: [
        {
          id: 'DENY_FIELDS',
          label: '禁止访问字段'
        },
        {
          id: 'ONLY_SELF',
          label: '仅限本人'
        },
        {
          id: 'POSITION_SCOPE',
          label: '仅限本人及下属'
        },
        {
          id: 'DEPARTMENT_SCOPE',
          label: '所在部门'
        },
        {
          id: 'ORG_SCOPE',
          label: '所在机构'
        },
        {
          id: 'CUSTOM_SCOPE_ORG_SCOPE_',
          label: '自定义设置-机构'
        },
        {
          id: 'CUSTOM_SCOPE_DEPARTMENT_SCOPE_',
          label: '自定义设置-部门'
        },
        {
          id: 'CUSTOM_SCOPE_POSITION_SCOPE_',
          label: '自定义设置-岗位'
        }
      ],
      addForm: {
        id: '',
        name: '',
        describe: '',
        optionalFields: [],
        supportDataAccessTypes: [],
        action: []
      },
      addFormRules: {
        id: [{ required: true, message: '请输入权限标识(ID)', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        describe: [{ required: true, message: '备注', trigger: 'blur' }]
      },
      id: [],
      actions: [
        { 'action': 'query', 'describe': '查询列表', defaultCheck: true },
        { 'action': 'get', 'describe': '查询明细', defaultCheck: true },
        { 'action': 'add', 'describe': '新增', defaultCheck: true },
        { 'action': 'update', 'describe': '修改', defaultCheck: true },
        { 'action': 'delete', 'describe': '删除', defaultCheck: false }
      ],
      viewData: [],
      // 编辑相关数据
      editFormVisible: false,   // 编辑页面是否显示
      editFormRules: {
        id: [{ required: true, message: '请输入权限标识(ID)', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        describe: [{ required: true, message: '备注', trigger: 'blur' }]
      },
      editForm: {
        id: '',
        name: '',
        describe: '',
        optionalFields: [],
        supportDataAccessTypes: [],
        actions: []
      },
      currentRow: null,
      total: 0,
      page: 1,
      pageSize: 10,
      formLabelWidth: '183px',
      activeName: 'first',
      currentPage: 1
    }
  },
  created () {
    this._getPermissList(0)
  },
  methods: {
    // 展示权限列表
    _getPermissList (pageNow) {
      getPermissList(pageNow).then((res) => {
        if (res.status === 200) {
          this.permissions = res.result.data
          this.pageSize = res.result.pageSize
          this.currentPage = res.result.pageIndex + 1 
          this.total = res.result.total  
        }
      })
    },
    search () {
      this.total = 0
      this.page = 1
      this.searchPermiss()
    },
    searchPermiss () {
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
      searchPermiss(queryParams.name, queryParamsPage).then((res) => {
        if (res.status === statusCode) {
          that.permissions = res.result.data
          that.pageSize = res.result.pageSize
          that.total = res.result.total  
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
    delPermiss (index, row) {
      let that = this
      this.$confirm('确定删除该权限？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delPermiss(row.id).then((res) => {
          if (res.status === statusCode) {
            that.$message.success({
              message: '删除成功',
              duration: 1500
            })
            that.search()
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
    // 添加
    showAndPermiss () {
      this.dialogFormVisible = true
      this.addForm = {
        id: '',
        name: '',
        describe: '',
        optionalFields: [],
        supportDataAccessTypes: this.id,
        actions: this.actions
      }
    },
    savePermiss () {
      let that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {}).then(() => {
            let params = Object.assign({}, this.addForm)
            addPermiss(params).then((res) => {
              if (res.status === statusCode) {
                that.$message.success({
                  message: '添加权限成功',
                  duration: 2000
                })
                that.$refs['addForm'].resetFields()
                that.dialogFormVisible = false
                this._getPermissList()
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
        }
      })
      this.dialogFormVisible = true
    },
    handleCurrentChange (val) {
      this._getPermissList(val-1)
    },
    // 编辑
    showEditPermiss (index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign(this.editForm, row)
    },
    editPermiss () {
      let that = this
      // debugger
      // console.log(this.$refs.editForm)
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          let params = Object.assign({}, this.editForm)
          editPermiss(params.id, params).then((result) => {
            if (result.status === statusCode) {
              that.$message.success({
                message: '修改成功',
                duration: 2000
              })
              that.$refs['editForm'].resetFields()
              that.editFormVisible = false
              this._getPermissList()
            } else {
              that.$message.error({
                message: '修改失败',
                duration: 2000
              })
            }
          }).catch((error) => {
            console.log(error)
            that.$message.error({
              message: '请求出现异常',
              duration: 2000
            })
          })
        }
      })
    },
    // 状态显示转换
    formatterColumn (row, column) {
      return row.status === 1 ? '正常' : '失效'
    }
  }
}
</script>

<style>
</style>
