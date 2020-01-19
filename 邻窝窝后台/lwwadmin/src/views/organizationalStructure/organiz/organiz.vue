<template>
  <div class="agency-wrap">
    <!--添加用机构页面-->
    <el-dialog :title="add_edit_val == 1 ? '添加机构':'编辑机构'" :visible.sync="dialogFormVisible" center>
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="机构名称：" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="机构全称：" :label-width="formLabelWidth">
          <el-input v-model="addForm.fullName" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="机构编码：" :label-width="formLabelWidth">
          <el-input v-model="addForm.code" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </el-dialog>
    <!--添加子机构页面-->
    <el-dialog
      :title="add_edit_val == 1 ? '添加子机构':'编辑子机构'"
      :visible.sync="dialogFormVisible2"
      center
    >
      <el-form :model="addForm2" ref="addForm2">
        <el-form-item label="机构名称：" :label-width="formLabelWidth">
          <el-input v-model="addForm2.name" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="机构全称：" :label-width="formLabelWidth">
          <el-input v-model="addForm2.fullName" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="机构编码：" :label-width="formLabelWidth">
          <el-input v-model="addForm2.code" auto-complete="off" style="width: 240px"></el-input>
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
        <el-button type="primary" size="small" @click="showAdd">添加机构</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" size="small" @click="saveAll">保存全部</el-button>
      </el-form-item>
    </el-form>

    <!--<el-table :data="orgs" stripe height="500" border style="width: 100%">
      <el-table-column sortable prop="index" type="index" label="#" align="center" width="100"></el-table-column>
      <el-table-column sortable prop="name" label="机构名称" align="center"></el-table-column>
      <el-table-column sortable prop="fullName" label="机构全称" align="center"></el-table-column>
      <el-table-column prop="code" label="机构编码" align="center"></el-table-column>
      <el-table-column prop="action" label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="showAdd">添加子结构</el-button>
        </template>
      </el-table-column>
    </el-table>-->

    <tree-grid
      :columns="columns"
      :columntype="true"
      :tree-structure="true"
      :content="content"
      :isadd="true"
      :isdel="true"
      :iseditor="true"
      @addMenuSecond="addMenuSecond"
      @delMenu="delMenu"
      @editorMenu="editorMenu"
      @addMenu="showAdd"
      :data-source="orgs"
    ></tree-grid>
  </div>
</template>

<script type="text/ecmascript-6">
import { getOrg, addOrg, searchOrg, addAll, dellOrg } from 'api/organiz'
import { statusCode } from 'common/js/config'
import { queryParam, arrayToTreeArray } from 'common/js/utils'
import TreeGrid from 'base/basetable/TreeGrid'

export default {
  data () {
    return {
      // 搜索数据
      searchForm: {
        keyword: ''
      },
      // 添加相关数据
      add_edit_val: 0,   //  1表示增加,2表示编辑
      dialogFormVisible: false,  // 添加页面是否显示
      dialogFormVisible2: false,  // 添加页面是否显示
      addForm: {
        name: '',
        fullName: '',
        code: '',
        _state: "added"
      },
      addForm2: {
        name: '',
        fullName: '',
        code: ''
      },
      addFormRules: {
        name: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
        fullName: [{ required: true, message: '请输入机构全名', trigger: 'blur' }],
        code: [{ required: true, message: '请输入机构编码', trigger: 'blur' }]
      },
      formLabelWidth: '80',
      orgs: [],
      orgs_pageSize_length: 0,
      loading: true,
      total: 0,
      pageIndex: 0,
      pageSize: 10,
      columns: [
        {
          text: '机构名称',
          dataIndex: 'name'
        },
        {
          text: '机构全称',
          dataIndex: 'fullName'
        },
        {
          text: '机构编码',
          dataIndex: 'code'
        }
      ],
      content: '添加子机构'
    }
  },
  created () {
    this.getOrgList()
  },
  methods: {
    getOrgList () {
      getOrg().then((res) => {
        if (res.status === statusCode) {
          this.orgs = Array.from(arrayToTreeArray(res.result.data, '-1'))
          this.orgs_pageSize_length = res.result.pageSize
        }
      })
    },
    search () {
      this.total = 0
      this.pageIndex = 0
      this.searchOrg()
    },
    searchOrg () {
      let queryParams = queryParam(this.searchForm.keyword)
      let queryParamsPage = {
        paging: false,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        sortField: '',
        sortOrder: ''
      }
      searchOrg(queryParams, queryParamsPage).then((res) => {
        if (res.status === statusCode) {
          this.total = res.total
          console.log(res.result.data)
          this.orgs = res.result.data
        }
      }).catch((error) => {
        console.log(error)
        this.$message.error({
          message: '请求出现异常',
          duration: 2000
        })
      })
    },
    showAdd () {
      this.dialogFormVisible = true
      this.addForm = {
        name: '',
        fullName: '',
        code: ''
      }
    },
    save () {
      let that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {}).then(() => {
            let params = Object.assign({}, this.addForm)
            addOrg(params).then((res) => {
              if (res.status === statusCode) {
                that.$message.success({
                  message: '添加机构成功',
                  duration: 2000
                })
                that.$refs['addForm'].resetFields()
                that.dialogFormVisible = false
                that.getOrgList()
              } else {
                that.$message.error({
                  message: '添加机构失败',
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
    saveAll () {
      this.$confirm('确认保存全部机构数据？', '提示', {}).then(() => {
        addAll(this.orgs).then((res) => {
          if (res.status === statusCode) {
            this.$message.success({
              message: '保存成功',
              duration: 2000
            })
          }
        })
      })
    },
    //添加子菜单
    addMenuSecond (index, row) {
      this.addForm2 = {
        sortIndex: 1,
        _id: this.orgs_pageSize_length + 1,
        _level: row.level + 1,
        _pid: index + 1,
        _state: "added",
        _uid: this.orgs_pageSize_length + 1,
      }
      this.add_edit_val = 1;
      this.dialogFormVisible2 = true
      this.addForm2.parentId = row.id
    },
    saveMenuSecond () {
      let that = this
      this.$refs.addForm2.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {}).then(() => {
            let params = Object.assign({}, this.addForm2)
            addOrg(params).then((res) => {
              if (res.status === statusCode) {
                that.$message.success({
                  message: that.add_edit_val == 1 ? '添加机构成功' : '编辑机构成功',
                  duration: 2000
                })
                // that.$refs['addForm2'].resetFields()
                that.dialogFormVisible2 = false
                that.getOrgList()
              } else {
                that.$message.error({
                  message: '添加机构失败',
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
      this.$confirm('确定删除该机构吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dellOrg(row.id).then((res) => {
          if (res.status === statusCode) {
            that.$message.success({
              message: '删除成功',
              duration: 1500
            })
            that.getOrgList()
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
    // 编辑机构
    editorMenu (index, row) {
      console.log(row)
      this.add_edit_val = 2;
      if (row.parentId == -1) {
        this.addForm = {
          code: row.code,
          districtIdProperty: row.districtIdProperty,
          fullName: row.fullName,
          id: row.id,
          level: 2,
          name: row.name,
          orgId: row.orgId,
          orgIdProperty: row.orgIdProperty,
          parentId: row.parentId,
          path: row.path,
          sortIndex: 301,
          status: row.status,
          expanded: row._expanded,
          _id: index + 1,
          _level: 1,
          _state: 'modified',
          _uid: index + 1,
        }
        if (row._parent) {
          this.addForm._pid = row._parent.sortIndex
        } else {
          this.addForm._pid = -1
        }
        this.dialogFormVisible = true
        console.log('编辑111--', this.addForm)
      } else {
        this.addForm2 = {
          code: row.code,
          districtIdProperty: row.districtIdProperty,
          fullName: row.fullName,
          id: row.id,
          level: 2,
          name: row.name,
          orgId: row.orgId,
          orgIdProperty: row.orgIdProperty,
          parentId: row.parentId,
          path: row.path,
          sortIndex: 301,
          status: row.status,
          expanded: row._expanded,
          _id: index + 1,
          _level: 1,
          _state: 'modified',
          _uid: index + 1,
        }
        if (row._parent) {
          this.addForm2._pid = row._parent.sortIndex
        } else {
          this.addForm2._pid = -1
        }
        this.dialogFormVisible2 = true
        console.log('编辑222--', this.addForm2)
      }
    },
  },
  components: {
    TreeGrid
  }
}
</script>

<style scoped lang="scss">
.agency-wrap{
  height: 100%;
}
</style>
