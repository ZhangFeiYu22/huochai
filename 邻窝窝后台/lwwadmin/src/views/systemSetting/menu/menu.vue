<template>
  <div class="menu-wrap">
    <!--添加菜单页面-->
    <el-dialog :title="add_edit_val == 1 ? '添加菜单':'编辑菜单'" :visible.sync="dialogTableVisible" center>
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="图标：" :label-width="formLabelWidth">
          <el-input v-model="addForm.icon" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="权限ID：" :label-width="formLabelWidth">
          <el-input v-model="addForm.permissionId" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称：" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="URL：" :label-width="formLabelWidth">
          <el-input v-model="addForm.url" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="排序序号：" :label-width="formLabelWidth">
          <el-input v-model="addForm.sortIndex" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="描述：" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="addForm.describe"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveMenu">保存</el-button>
      </div>
    </el-dialog>
    <!--添加子菜单页面-->
    <el-dialog
      :title="add_edit_val == 1 ? '添加子菜单':'编辑子菜单'"
      :visible.sync="dialogTableVisible2"
      center
    >
      <el-form :model="addForm2" ref="addForm2">
        <el-form-item label="图标：" :label-width="formLabelWidth">
          <el-input v-model="addForm2.icon" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="权限ID：" :label-width="formLabelWidth">
          <el-input v-model="addForm2.permissionId" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称：" :label-width="formLabelWidth">
          <el-input v-model="addForm2.name" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="URL：" :label-width="formLabelWidth">
          <el-input v-model="addForm2.url" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="排序序号：" :label-width="formLabelWidth">
          <el-input v-model="addForm2.sortIndex" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="描述：" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="addForm2.describe"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveMenuSecond">保存</el-button>
      </div>
    </el-dialog>

    <el-form :inline="true" :model="searchForm">
      <el-form-item label="关键字">
        <el-input size="small" v-model="searchForm.keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="showAndMenu">添加菜单</el-button>
      </el-form-item>
    </el-form>

    <!-- <parent-children :tableSoureData='tableSoureData' :showData='showData' :customerQueryData='customerQueryData'></parent-children> -->
    <tree-grid
      :columns="columns"
      :tree-structure="true"
      :data-source="dataSource"
      :treeStructure="true"
      :isadd="true"
      :isdel="true"
      :iseditor="true"
      @addMenuSecond="addMenuSecond"
      @delMenu="delMenu"
      @editorMenu="editorMenu"
    ></tree-grid>
  </div>
</template>

<script type='text/ecmascript-6'>
import { getMenuList, addMenu, searchMenu } from 'api/menu'
import { statusCode } from 'common/js/config'
import { delMenu } from 'api/menu'
import { queryParam } from 'common/js/utils'
import ParentChildren from 'base/basetable/parent_children'
import TreeGrid from 'base/basetable/TreeGrid'

export default {
  data () {
    return {
      searchForm: {
        keyword: ''
      },
      tableSoureData: [],
      customerQueryData: [],
      showData: false,
      // 添加相关数据
      add_edit_val: 0,   //  1表示增加,2表示编辑
      dialogTableVisible: false,
      addForm: {
        icon: '',
        permissionId: '',
        name: '',
        url: '',
        sortIndex: '',
        describe: ''
      },
      dialogTableVisible2: false,
      addForm2: {
        icon: '',
        permissionId: '',
        name: '',
        url: '',
        sortIndex: '',
        describe: ''
      },
      addFormRules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入url', trigger: 'blur' }],
        describe: [{ required: true, message: '备注', trigger: 'blur' }]
      },
      total: 0,
      pageIndex: 0,
      pageSize: 10,
      formLabelWidth: '120px',
      columns: [
        {
          text: '图标',
          dataIndex: 'icon'
        },
        {
          text: '权限ID',
          dataIndex: 'permissionId'
        },
        {
          text: '菜单名称',
          dataIndex: 'name'
        },
        {
          text: 'URL',
          dataIndex: 'url'
        },
        {
          text: '排序序号',
          dataIndex: 'sortIndex'
        },
        {
          text: '描述',
          dataIndex: 'describe'
        }
      ],
      dataSource: []
    }
  },
  created () {
    this._getMenuList()
  },
  methods: {
    _arrayToTreeArray (data, root) {
      let r = []
      let o = []
      data.forEach(a => {
        a.children = o[a.id] && o[a.id].children
        o[a.id] = a
        if (a.parentId === root || typeof (a.parentId) === 'undefined') {
          r.push(a)
          //            a.children = []
        } else {
          o[a.parentId] = o[a.parentId] || []
          o[a.parentId].children = o[a.parentId].children || []
          o[a.parentId].children.push(a)
        }
      })
      return r
    },
    _getMenuList () {
      getMenuList().then((res) => {
        if (res.status === statusCode) {
          this.tableSoureData = Array.from(res.result.data)
          this.dataSource = Array.from(this._arrayToTreeArray(res.result.data, '-1'))
          console.log('1----',this.dataSource)
        }
      })
    },
    // 添加菜单
    showAndMenu () {
      this.add_edit_val = 1;
      this.dialogTableVisible = true
      this.addForm = {
        icon: '',
        permissionId: '',
        name: '',
        url: '',
        sortIndex: '',
        describe: ''
      }
    },
    saveMenu () {
      let that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {}).then(() => {
            let params = Object.assign({}, this.addForm)
            addMenu(params).then((res) => {
              if (res.status === statusCode) {
                that.$message.success({
                  message: '添加菜单成功',
                  duration: 2000
                })
                that.$refs['addForm'].resetFields()
                that.dialogTableVisible = false
                this._getMenuList()
              } else {
                that.$message.error({
                  message: '添加菜单失败',
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
    //添加子菜单
    addMenuSecond (index, row) {
      this.addForm2 = {}
      this.add_edit_val = 1;
      this.dialogTableVisible2 = true
      this.addForm2.parentId = row.id
    },
    saveMenuSecond () {
      let that = this
      this.$refs.addForm2.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {}).then(() => {
            let params = Object.assign({}, this.addForm2)
            addMenu(params).then((res) => {
              if (res.status === statusCode) {
                that.$message.success({
                  message: '添加菜单成功',
                  duration: 2000
                })
                that.$refs['addForm2'].resetFields()
                that.dialogTableVisible2 = false
                this._getMenuList()
              } else {
                that.$message.error({
                  message: '添加菜单失败',
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
    // 删除
    delMenu (index, row) {
      let that = this
      this.$confirm('确定删除该菜单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delMenu(row.id).then((res) => {
          if (res.status === statusCode) {
            that.$message.success({
              message: '删除成功',
              duration: 1500
            })
            this._getMenuList()
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
    // 编辑菜单
    editorMenu (index, row) {
      this.add_edit_val = 2;
      if (row.parentId == -1) {
        this.addForm = {
          expanded: row._expanded,
          icon: row.icon,
          id: row.id,
          name: row.name,
          path: row.path,
          permissionId: row.permissionId,
          sortIndex: row.sortIndex,
          status: row.status,
          url: row.url,
          _state: row.status,
          describe: row.describe
        }
        this.dialogTableVisible = true
      } else {
        this.addForm2 = {
          expanded: row._expanded,
          icon: row.icon,
          id: row.id,
          name: row.name,
          parentId: row.parentId,
          path: row.path,
          permissionId: row.permissionId,
          sortIndex: row.sortIndex,
          status: row.status,
          url: row.url,
          _state: row.status,
          describe: row.describe
        }
        this.dialogTableVisible2 = true
      }
    },
    search () {
      this.total = 0
      this.pageIndex = 0
      this.searchMenu()
    },
    searchMenu () {
      let queryParams = queryParam(this.searchForm.keyword)
      let queryParamsPage = {
        paging: false,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        sortField: '',
        sortOrder: ''
      }
      searchMenu(queryParams, queryParamsPage).then((res) => {
        if (res.status === statusCode) {
          this.total = res.total
          this.customerQueryData = Array.from(res.result.data)
          this.showData = true
        }
      }).catch((error) => {
        console.log(error)
        this.$message.error({
          message: '请求出现异常',
          duration: 2000
        })
      })
    }
  },
  components: {
    ParentChildren,
    TreeGrid
  }
}
</script>

<style>
.menu-wrap{
  height: 100%;
}
</style>
