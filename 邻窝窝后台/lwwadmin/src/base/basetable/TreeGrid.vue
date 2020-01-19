<template>
  <el-table
    :data="data"
    height="80%"
    border
    style="width: 100%"
    :row-style="showTr"
    @row-click="treeGridClick($event)"
  >
    <!-- <el-table-column v-show="columntype" type="index" label="#" align="center"></el-table-column> -->
    <el-table-column
      v-for="(column, index) in columns"
      :key="index"
      :prop="column.dataIndex"
      :label="column.text"
    >
      <template slot-scope="scope">
        <span v-if="spaceIconShow(index)">
          <span
            v-for="(space, levelIndex) in scope.row._level"
            :key="levelIndex"
            class="ms-tree-space"
          >&nbsp;&nbsp;&nbsp;&nbsp;</span>          
        </span>
        <span v-if="spaceIconShow(index)">
          <span
            v-for="(space, levelIndex) in scope.row._level"
            :key="levelIndex"
            class="ms-tree-space"
          >--</span>          
        </span>
        <!-- <el-button
          type="primary"
          size="mini"
          v-if="toggleIconShow(index,scope.row)"
          @click="toggle(scope.$index)"
        >
          <i v-if="!scope.row._expanded" class="el-icon-arrow-down" aria-hidden="true"></i>
          <i v-if="scope.row._expanded" class="el-icon-arrow-up" aria-hidden="true"></i>
        </el-button>
        <span v-else-if="index===0" class="ms-tree-space"></span>-->
        {{scope.row[column.dataIndex]}}
      </template>
    </el-table-column>
    <el-table-column label="操作" v-if="treeType" align="center" width="260">
      <template slot-scope="scope">
        <el-tooltip
          v-show="isadd"
          class="item"
          effect="light"
          :content="content"
          placement="bottom-start"
        >
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="addMenu(scope.$index,scope.row)"
          ></el-button>
        </el-tooltip>
        <el-tooltip
          v-show="iseditor"
          class="item"
          effect="light"
          content="编辑"
          placement="bottom-start"
        >
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="editorMenu(scope.$index,scope.row)"
          ></el-button>
        </el-tooltip>
        <el-tooltip
          v-show="isdel"
          class="item"
          effect="light"
          content="删除"
          placement="bottom-start"
        >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="delMenu(scope.$index,scope.row)"
          ></el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>
<script type='text/ecmascript-6'>
import Utils from 'common/js/treetable/index'

import { statusCode } from 'common/js/config'

export default {
  name: 'tree-grid',
  props: {
    // 添加按钮的名称
    content: {
      type: String,
      default: '添加子菜单'
    },
    columntype: {
      type: Boolean,
      default: false
    },
    // 是否显示添加按钮
    isadd: {
      type: Boolean,
      default: false
    },
    // 是否显示删除按钮
    isdel: {
      type: Boolean,
      default: false
    },
    // 是否显示编辑按钮
    iseditor: {
      type: Boolean,
      default: false
    },
    // 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
    treeStructure: {
      type: Boolean,
      default: false
    },
    // 这是相应的字段展示
    columns: {
      type: Array,
      default: []
    },
    // 这是数据源
    dataSource: {
      type: Array,
      default: []
    },
    // 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
    requestUrl: {
      type: String,
      default: ''
    },
    // 这个是是否展示操作列
    treeType: {
      type: Boolean,
      default: true
    },
    // 是否默认展开所有树
    defaultExpandAll: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  computed: {
    // 格式化数据源
    data () {
      let me = this
      if (me.treeStructure) {
        let data = Utils.MSDataTransfer.treeToArray(me.dataSource, null, null, me.defaultExpandAll)
        return data
      }
      return me.dataSource
    }
  },
  // watch:{
  //   dataSource: {
  //     immediate: true,
  //     handler (val){
  //       console.log('dataSource数据变化',this.dataSource)
  //     }
  //   }
  // },
  methods: {
    // 行点击事件
    treeGridClick ($event) {
      this.$emit('treeGridClick', $event)
    },
    // 显示行
    showTr (row, index) {
      let show = (row.row._parent ? (row.row._parent._expanded && row.row._parent._show) : true)
      row.row._show = show
      return show ? 'background-color:#EAEAEA;' : 'display:none;'
    },
    // 展开下级
    toggle (trIndex) {
      console.log(trIndex)
      let me = this
      let record = me.data[trIndex]
      // record._expanded = !record._expanded   //禁止展开  图标不变
    },
    // 显示层级关系的空格和图标
    spaceIconShow (index) {
      let me = this
      if (me.treeStructure && index === 0) {
        return true
      }
      return false
    },
    // 点击展开和关闭的时候，图标的切换
    toggleIconShow (index, record) {
      let me = this
      if (me.treeStructure && index === 0 && record.children && record.children.length > 0) {
        return true
      }
      return false
    },
    editorMenu (index, row) {
      let that = this
      that.$emit('editorMenu', index, row)
    },
    addMenu (index, row) {
      let that = this
      that.$emit('addMenuSecond', index, row)
    },
    delMenu (index, row) {
      let that = this
      that.$emit('delMenu', index, row)
    }
  }
}
</script>
<style scoped>
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-family: "Glyphicons Halflings";
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: auto;
  height: 14px;
}

.ms-tree-space::before {
  content: "";
}

table td {
  line-height: 26px;
}
</style>
