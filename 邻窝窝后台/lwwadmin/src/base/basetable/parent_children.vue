<template>
  <div>
  <el-table :data='tableData' border highlight-current-row @current-change="currentChange" style='width: 100%' @expand='rowExpand' v-show="!showData">
    <el-table-column type='expand'>
      <template slot-scope='props'>
        <el-table :data='props.row.children' border highlight-current-row @current-change="currentChange" style='width: 100%'>
          <el-table-column label='图标' prop='icon' align="center"></el-table-column>
          <el-table-column label='权限ID' prop='permissionId' align="center"></el-table-column>
          <el-table-column label='菜单名称' prop='name' align="center"></el-table-column>
          <el-table-column label='URL' prop='url' align="center"></el-table-column>
          <el-table-column label='是否启用' prop='' align="center"></el-table-column>
          <el-table-column label='排序序号' prop='sortIndex' align="center"></el-table-column>
          <el-table-column label='描述' prop='describe' align="center"></el-table-column>
          <el-table-column label='操作' prop='action' align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="light" content="添加子菜单" placement="bottom-start">
                <el-button size="mini" type="primary" icon="el-icon-plus"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="删除菜单" placement="bottom-start">
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="delMenu(scope.$index,scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-table-column>
    <el-table-column label='图标' prop='icon' align="center"></el-table-column>
    <el-table-column label='权限ID' prop='permissionId' align="center"></el-table-column>
    <el-table-column label='菜单名称' prop='name' align="center"></el-table-column>
    <el-table-column label='URL' prop='url' align="center"></el-table-column>
    <el-table-column label='是否启用' prop='' align="center"></el-table-column>
    <el-table-column label='排序序号' prop='sortIndex' align="center"></el-table-column>
    <el-table-column label='描述' prop='describe' align="center"></el-table-column>
    <el-table-column label='操作' prop='action' align="center">
      <template slot-scope="scope">
        <el-tooltip class="item" effect="light" content="添加子菜单" placement="bottom-start">
          <el-button size="mini" type="primary" icon="el-icon-plus"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="删除菜单" placement="bottom-start">
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="delMenu(scope.$index,scope.row)"></el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>

  <el-table :data='customerQueryData' border highlight-current-row @current-change="currentChange" style='width: 100%' v-show="showData">
    <el-table-column label='图标' prop='icon' align="center"></el-table-column>
    <el-table-column label='权限ID' prop='permissionId' align="center"></el-table-column>
    <el-table-column label='菜单名称' prop='name' align="center"></el-table-column>
    <el-table-column label='URL' prop='url' align="center"></el-table-column>
    <el-table-column label='是否启用' prop='' align="center"></el-table-column>
    <el-table-column label='排序序号' prop='sortIndex' align="center"></el-table-column>
    <el-table-column label='描述' prop='describe' align="center"></el-table-column>
    <el-table-column label='操作' prop='action' align="center">
      <template slot-scope="scope">
        <el-tooltip class="item" effect="light" content="添加子菜单" placement="bottom-start">
          <el-button size="mini" type="primary" icon="el-icon-plus"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="删除菜单" placement="bottom-start">
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="delMenu(scope.$index,scope.row)"></el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>

<script type='text/ecmascript-6'>
  import {TableSourePri} from 'common/js/classes'
  import {delMenu} from 'api/menu'
  import {statusCode} from 'common/js/config'

  export default{
    props: {
      showData: {
        type: Boolean,
        default: false
      },
      tableSoureData: Array,
      customerQueryData: Array
    },
    data () {
      return {
        tableData: [],
        child: {
          describe: '',
          icon: '',
          id: '',
          name: '',
          parentId: '',
          path: '',
          permissionId: '',
          sortIndex: '',
          status: '',
          url: '',
          children: []
        },
        currentRow: null
      }
    },
    watch: {
      tableSoureData () {
        for (let item of this.tableSoureData) {
          let tableSourcePri = new TableSourePri(item)
          if (tableSourcePri.sortIndex > 0 && tableSourcePri.sortIndex < 10) {
            this.child.describe = item.describe
            this.child.icon = item.icon
            this.child.id = item.id
            this.child.name = item.name
            this.child.parentId = item.parentId
            this.child.path = item.path
            this.child.permissionId = item.permissionId
            this.child.sortIndex = item.sortIndex
            this.child.status = item.status
            this.child.url = item.url
            for (let tableSource of this.tableSoureData) {
              let tableSourcePri1 = new TableSourePri(tableSource)
              if (tableSourcePri1.sortIndex >= 10) {
               // debugger
                if (tableSource.sortIndex.toString().startsWith(tableSourcePri.sortIndex.toString())) {
                  this.child.children.push(Object.assign({}, tableSource))
                }
              }
            }
            this.tableData.push(Object.assign({}, this.child))
            this.child = {
              describe: '',
              icon: '',
              id: '',
              name: '',
              parentId: '',
              path: '',
              permissionId: '',
              sortIndex: '',
              status: '',
              url: '',
              children: []
            }
          }
        }
      }
    },
    methods: {
      rowExpand: function (row) {
       // this.listChildren = row.children;
       // console.log(row)
      },
      currentChange (val) {
        this.currentRow = val
      },
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
            }
          }).catch((error) => {
            console.log(error)
            that.$message.error({
              message: '请求出现异常',
              duration: 2000
            })
          })
        })
      }
    }
  }
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

</style>
