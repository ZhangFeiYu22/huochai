<template>
  <div class="chara-wrap">
    <!--添加角色页面-->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisible" center>
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="角色标识(ID)：" :label-width="formLabelWidth">
          <el-input
            v-model="addForm.id"
            placeholder="只能由字母数字下划线组成"
            auto-complete="off"
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色名称：" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="备注：" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="addForm.describe"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveRole">保存</el-button>
      </div>
    </el-dialog>

    <!--编辑页面-->
    <el-dialog title="编辑用户" :visible.sync="editFormVisible" center>
      <el-form :model="editForm" ref="editForm">
        <el-form-item label="角色标识(ID)：" :label-width="formLabelWidth">
          <el-input v-model="editForm.id" :disabled="true" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" :label-width="formLabelWidth">
          <el-input v-model="editForm.name" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <!-- <el-form-item label="用户名：" :label-width="formLabelWidth">
          <el-input v-model="editForm.username" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="密码：" :label-width="formLabelWidth">
          <el-input v-model="editForm.password" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item> -->
        <el-form-item label="备注：" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="editForm.describe"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editRole">保存</el-button>
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
        <el-button type="primary" icon="el-icon-plus" size="small" @click="showAndRole">添加角色</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="roles"
      highlight-current-row
      @current-change="currentChange"
      height="500"
      border
      style="width: 100%"
    >
      <el-table-column prop="id" label="ID" align="center"></el-table-column>
      <el-table-column prop="name" label="名称" align="center"></el-table-column>
      <el-table-column prop="status" label="是否启用" :formatter="formatterColumn" align="center"></el-table-column>
      <el-table-column prop="describe" label="备注" align="center"></el-table-column>
      <el-table-column prop="action" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="showEditRole(scope.$index,scope.row)" plain>编辑</el-button>
          <!-- <el-button size="mini" icon="el-icon-edit" type="info" plain>用户赋权</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="500"
    ></el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
import { getRoleList, addRole, editRole, searchRole } from 'api/role'
import { statusCode } from 'common/js/config'
import { encodeQueryParam } from 'common/js/utils'

export default {
  data () {
    return {
      // 搜索数据
      searchForm: {
        id$LIKE: '',
        name$LIKE: '',
        describe$LIKE: ''
      },

      // 添加相关数据
      dialogFormVisible: false,  // 添加页面是否显示
      addForm: {
        id: '',
        name: '',
        describe: ''
      },
      addFormRules: {
        id: [{ required: true, message: '请输入id', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        describe: [{ required: true, message: '备注', trigger: 'blur' }]
      },

      // 编辑相关数据
      editFormVisible: false,   // 编辑页面是否显示
      editFormRules: {
        id: [{ required: true, message: '请输入id', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        describe: [{ required: true, message: '备注', trigger: 'blur' }]
      },
      editForm: {
        id: '',
        name: '',
        describe: ''
      },
      roles: [],
      total: 0,
      page: 1,
      pageSize: 10,
      currentRow: null,
      formLabelWidth: '120px',
      currentPage: 1
    }
  },
  created () {
    this._getRoleList()
  },
  methods: {
    _getRoleList () {
      getRoleList().then((res) => {
        if (res.status === statusCode) {
          this.roles = res.result.data
        }
      })
    },
    showAndRole () {
      this.dialogFormVisible = true
      this.addForm = {
        id: '',
        name: '',
        describe: ''
      }
    },
    saveRole () {
      let that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {}).then(() => {
            let roleParams = Object.assign({}, this.addForm)
            addRole(roleParams).then((res) => {
              if (res.status === statusCode) {
                that.$message.success({
                  message: '添加角色成功',
                  duration: 2000
                })
                that.$refs['addForm'].resetFields()
                that.dialogFormVisible = false
                that._getRoleList()
              } else {
                that.$message.error({
                  message: '添加角色失败',
                  duration: 2000
                })
                this._getUerList()
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
    showEditRole (index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign(this.editForm, row)
    },
    editRole () {
      let that = this
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          let roleParams = Object.assign({}, this.editForm)
          editRole(roleParams.id, roleParams).then((result) => {
            if (result.status === statusCode) {
              that.$message.success({
                message: '修改成功',
                duration: 2000
              })
              that.$refs['editForm'].resetFields()
              that.editFormVisible = false
            } else {
              that.$message.error({
                message: '修改失败',
                duration: 2000
              })
              this._getUerList()
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
    search () {
      this.total = 0
      this.page = 1
      this.searchRole()
    },
    searchRole () {
      let that = this
      let queryParams = {
        name: encodeQueryParam(this.searchForm)
      }
      let queryParamsPage = {
        pageIndex: that.page,
        pageSize: that.pageSize,
        sortField: '',
        sortOrder: ''
      }
      searchRole(queryParams.name, queryParamsPage).then((res) => {
        if (res.status === statusCode) {
          that.total = res.total
          this.roles = res.result.data
          // this.roles = that.data
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
    handleCurrentChange (val) {
      this.pageIndex = val
      this.search()
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    // 状态显示转换
    formatterColumn (row, column) {
      return row.status === 1 ? '是' : '否'
    }
  }
}
</script>

<style>
</style>
