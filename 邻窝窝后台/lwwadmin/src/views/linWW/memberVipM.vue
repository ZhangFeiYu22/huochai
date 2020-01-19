<template>
  <div class="homePage-wrap">
    <el-form :inline="true" :model="searchForm">
      <!-- <el-form-item label="序号">
        <el-input size="small" v-model="searchForm.id$LIKE"></el-input>
      </el-form-item>-->
      <el-form-item label="会员名称">
        <el-input size="small" v-model="searchForm.nickName$LIKE"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="showAddMember">添加会员</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="memberList" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <!-- <el-table-column prop="id" align="center" label="序号"></el-table-column> -->
      <el-table-column prop="nickName" align="center" label="昵称"></el-table-column>
      <el-table-column prop="openid" align="center" label="openid"></el-table-column>
      <el-table-column prop="gender" align="center" label="性别" :formatter="formatterSex"></el-table-column>
      <el-table-column prop="country" align="center" label="国籍"></el-table-column>
      <el-table-column prop="city" align="center" label="城市"></el-table-column>
      <el-table-column prop="province" align="center" label="省"></el-table-column>
      <el-table-column prop="status" align="center" label="状态" :formatter="formatterStatus"></el-table-column>
      <!-- <el-table-column prop="subscribe" align="center" label="是否关注公众号" :formatter="formatterSubscribe"></el-table-column> -->
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
      :title="add_edit_val == 1 ? '添加会员' : '编辑会员'"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal='false'
      center
    >
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="addForm.nickName" auto-complete="off" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="openID" :label-width="formLabelWidth">
          <el-input v-model="addForm.openid" auto-complete="off" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-select v-model="addForm.gender" placeholder="所属店家">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="国籍" :label-width="formLabelWidth">
          <el-input v-model="addForm.country" auto-complete="off" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="省" :label-width="formLabelWidth">
          <el-input v-model="addForm.province" auto-complete="off" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="城市" :label-width="formLabelWidth">
          <el-input v-model="addForm.city" auto-complete="off" style="width: 320px"></el-input>
        </el-form-item>
        <el-form-item label="用户是否关注公众号" :label-width="formLabelWidth">
          <el-select v-model="addForm.subscribe" placeholder="关注状态">
            <el-option label="未关注" :value="0"></el-option>
            <el-option label="已关注" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户最后关注时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="addForm.subscribeTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="timestamp"
          ></el-date-picker>
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
        <el-button type="primary" @click="saveMember">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type='text/ecmascript-6'>
import { getMemberList, addMember, delMember, getMemberItem, searchMember } from 'api/lww'
import { statusCode } from 'common/js/config'
import { encodeQueryParam } from 'common/js/utils'
export default {
  data () {
    return {
      add_edit_val: 0,   //  1表示增加,2表示编辑
      dialogTableVisible: false,
      addForm: {
        city: "",  //城市
        country: "",  //国家(国籍)
        gender: 0, //性别
        id: "",
        nickName: "",  //昵称
        openid: "",  //openID
        province: "",  //省份(区域)
        sort: 0,
        status: 0,
        subscribe: 0,   //用户是否订阅该公纵号标识,0没有关注,1关注
        subscribeTime: 0,   //用户最后关注时间
        unionid: ""   //unionid
      },
      formLabelWidth: '140px',
      currentPage: 1,
      total: 0,
      page: 1,
      pageSize: 10,
      searchForm: {
        id$LIKE: '',
        nickName$LIKE: ''
      },
      memberList: []
    }
  },
  created () {
    this._getMemberList(0, this.pageSize)
  },
  methods: {
    _getMemberList (pageNow, pageSize) {
      getMemberList(pageNow, pageSize).then((res) => {
        if (res.status === statusCode) {
          this.memberList = res.result.data
          this.pageSize = res.result.pageSize
          this.currentPage = res.result.pageIndex + 1
          this.total = res.result.total
        }
      })
    },
    showAddMember () {
      this.dialogTableVisible = true
      this.add_edit_val = 1;
      this.addForm = {
        city: "",  //城市
        country: "",  //国家(国籍)
        gender: 0, //性别
        nickName: "",  //昵称
        openid: "",  //openID
        province: "",  //省份(区域)
        sort: 0,
        status: 0,
        subscribe: 0,   //用户是否订阅该公纵号标识,0没有关注,1关注
        subscribeTime: 0,   //用户最后关注时间
        unionid: ""   //unionid
      }
    },
    // 增加
    saveMember () {
      let that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {}).then(() => {
            // let params = Object.assign({}, this.addForm)
            this.addForm.gender = parseInt(this.addForm.gender)
            this.addForm.sort = parseInt(this.addForm.sort)
            this.addForm.status = parseInt(this.addForm.status)
            this.addForm.subscribe = parseInt(this.addForm.subscribe)
            this.addForm.subscribeTime = parseInt(this.addForm.subscribeTime)
            let params = this.addForm
            addMember(params).then((res) => {
              if (res.status === statusCode) {
                that.$message.success({
                  message: '添加成功',
                  duration: 2000
                })
                // that.$refs['addForm'].resetFields()
                this._getMemberList(this.currentPage, this.pageSize)
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
        delMember(row.id).then((res) => {
          if (res.status === statusCode) {
            that.$message.success({
              message: '删除成功',
              duration: 1500
            })
            that._getMemberList(this.currentPage - 1, this.pageSize)
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
      getMemberItem(row.id).then((res) => {
        let jsonData = JSON.parse(res)
        this.addForm = jsonData.result
      })
    },
    handleCurrentChange (val) {
      this._getMemberList(val - 1, this.pageSize)
    },
    handleSizeChange (pageNum) {
      this._getMemberList(this.currentPage - 1, pageNum)
    },
    search () {
      this.total = 0
      this.page = 1
      this.searchMember()
    },
    searchMember () {
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
      searchMember(queryParams.name, queryParamsPage).then((res) => {
        if (res.status === statusCode) {
          this.memberList = res.result.data
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
    formatterSex (row, column) {
      return row.gender == 1 ? '男' : '女'
    },
    formatterStatus (row, column) {
      return row.status == 1 ? '有效' : '无效'
    },
    formatterSubscribe(row, column){
      return row.subscribe == 1 ? '已关注' : '未关注'
    }
  },
}
</script>

<style>
</style>
