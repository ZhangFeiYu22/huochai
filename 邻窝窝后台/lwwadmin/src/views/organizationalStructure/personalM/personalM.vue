<template>
  <div class="chara-wrap">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="姓名">
        <el-input size="small" v-model="searchForm.name$LIKE"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-plus" type="primary" @click="addPerson">新建人员</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      :title="add_edit_val == 1 ? '添加人员' : '编辑人员'"
      :visible.sync="personFormVisible"
      center
    >
      <!-- <el-dialog :title="add_edit_val == 1 ? '添加人员' : '编辑人员'" :visible="true" center> -->
      <div class="headUpload">
        <input
          type="file"
          name="image"
          accept="image/*"
          @change="onchangeImgFun"
          class="upload-input"
        />
        <img alt :src="imgUrlHttp + personForm.photo" class="upload-img" />
        <button class="upload-btn">图片上传</button>
      </div>
      <el-form :model="personForm" ref="personForm">
        <el-form-item label="姓名:" :label-width="formLabelWidth">
          <el-input v-model="personForm.name" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="性别:" :label-width="formLabelWidth">
          <el-radio-group v-model="personForm.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电子邮箱:" :label-width="formLabelWidth">
          <el-input v-model="personForm.email" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="联系电话:" :label-width="formLabelWidth">
          <el-input v-model="personForm.phone" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="备注：" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="personForm.remark"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="4">
            <el-form-item label="关联用户" :label-width="formLabelWidth"></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户名" :label-width="'60px'">
              <el-input
                v-model="personForm.personUser.username"
                auto-complete="off"
                style="width: 200px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="密码" :label-width="'60px'">
              <el-input
                v-model="personForm.personUser.password"
                auto-complete="off"
                type="password"
                style="width: 240px"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="添加岗位信息" :label-width="formLabelWidth">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-cascader
                :options="options_jigou"
                placeholder="请选择机构"
                v-model="jigouDefault"
                :props="{ value: 'id', label: 'name', checkStrictly: true }"
                @change="change_jigou"
              ></el-cascader>
            </el-col>
            <el-col :span="6">
              <el-cascader
                :options="options_bumen"
                placeholder="请选择部门"
                v-model="bumenDefault"
                :props="{ value: 'id', label: 'name',  checkStrictly: true }"
                @change="change_bumen"
              ></el-cascader>
            </el-col>
            <el-col :span="6">
              <el-cascader
                :options="options_zhiwei"
                placeholder="请选择职位"
                v-model="zhiweiDefault"
                :props="{ value: 'id', label: 'name',  checkStrictly: true }"
                @change="change_zhiwei"
              ></el-cascader>
            </el-col>
          </el-row>
        </el-form-item>
        <el-table :data="personSelectData" style="width: 100%">
          <el-table-column type="index" width="50" align="center"></el-table-column>
          <el-table-column prop="jigou" label="机构" width="180" align="center"></el-table-column>
          <el-table-column prop="bumen" label="部门" width="180" align="center"></el-table-column>
          <el-table-column prop="zhiwei" label="职位" align="center"></el-table-column>
          <el-table-column prop="action" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="delPersonSelectData(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="add_edit_val == 2" type="primary" @click="savePersonOne">保存(编辑)</el-button>
        <el-button v-else type="primary" @click="savePerson">保存</el-button>
      </div>
    </el-dialog>

    <el-table :data="persons" highlight-current-row height="500" border style="width: 100%">
      <el-table-column prop="name" label="名称" align="center"></el-table-column>
      <el-table-column prop="sex" label="性别" :formatter="formatterColumnSex" align="center"></el-table-column>
      <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
      <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="formatterColumnStatus" align="center"></el-table-column>
      <el-table-column prop="action" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="showEditPer(scope.$index,scope.row)"
            type="primary"
            plain
          >编辑</el-button>
          <el-button size="mini" @click="delPerson(scope.$index,scope.row)" type="danger" plain>删除</el-button>
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
  </div>
</template>

<script type="text/ecmascript-6">
import axios from 'axios'
import { searchPerson, getPersonList, getOrgs, getDepartment, getPosition, addPerson, delPerson, getPersonOneDetail, savePersonOne, getOrgsDetails, getDepartmentDetails, getPositionDetails } from 'api/person'
import { statusCode } from 'common/js/config'
import { encodeQueryParam, quParam, quParamDepid, arrayToTreeArray } from 'common/js/utils'

export default {
  data () {
    return {
      imgUrlHttp: process.env.BASE_API,
      add_edit_val: 0,
      personFormVisible: false,
      personForm: {
        departmentId: "",
        email: "",
        name: "",
        orgId: "",
        personUser: { username: "", password: "" },
        phone: "",
        positionId: "",
        positionIds: [],
        photo: '',
        remark: "",
        sex: 0
      },
      personSelectData: [],
      orgsSelectV: {},
      departmentSelectV: {},
      positionsSelectV: {},
      options_jigou: [],
      jigouDefault: '',  //显示值
      options_bumen: [],
      bumenDefault: '',  //显示值
      options_zhiwei: [],
      zhiweiDefault: '',  //显示值
      formLabelWidth: '120px',

      // 搜索数据
      searchForm: {
        id$LIKE: ''
      },

      persons: [],   //人员数据
      total: 0,
      page: 1,
      pageSize: 10,
      currentRow: null,
      currentPage: 1
    }
  },
  created () {
    this._getPersonList(0, this.pageSize)
    this.getOrgList()
  },
  methods: {
    _getPersonList (pageNow, pageSize) {
      getPersonList(pageNow, pageSize).then((res) => {
        if (res.status === statusCode) {
          this.persons = res.result.data
          this.pageSize = res.result.pageSize
          this.currentPage = res.result.pageIndex + 1
          this.total = res.result.total
        }
      })
    },
    search () {
      this.total = 0
      this.page = 1
      this.searchPersonFun()
    },
    searchPersonFun () {
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
      searchPerson(queryParams.name, queryParamsPage).then((res) => {
        if (res.status === statusCode) {
          that.total = res.total
          console.log('搜索查找返回数据---res-', res)
          console.log('搜索查找返回数据----', res.result.data)
          this.persons = res.result.data
        }
      }).catch((error) => {
        console.log(error)
        that.$message.error({
          message: '请求出现异常',
          duration: 2000
        })
      })
    },
    handleCurrentChange (val) {
      this._getPersonList(val - 1, this.pageSize)
    },
    handleSizeChange (pageNum) {
      this._getPersonList(this.currentPage - 1, pageNum)
    },
    // 性别显示转换
    formatterColumnSex (row, column) {
      return row.sex === 1 ? '男' : '女'
    },
    // 状态显示转换
    formatterColumnStatus (row, column) {
      return row.status === 1 ? '在职' : ''
    },
    //选择从所有的里面挑选出当条数据的所有数据信息详情
    getCurrentPart (orgId, items, JG_BM) {
      let result;
      for (var i in items) {
        let item = items[i];
        if (JG_BM == 1) {
          if (item.orgId == orgId) {
            result = item;
            break;
          } else if (item.children) {
            result = this.getCurrentPart(orgId, item.children, 1);
          }
        } else if (JG_BM == 2) {
          if (item.parentId == orgId) {
            result = item;
            break;
          } else if (item.children) {
            result = this.getCurrentPart(orgId, item.children, 2);
          }
        } else {
          if (item.departmentId == orgId) {
            result = item;
            break;
          } else if (item.children) {
            result = this.getCurrentPart(orgId, item.children, 3);
          }
        }

      }
      return result;
    },
    getPersonPart (aim, items, JG_BM) {
      let result;
      for (var i in items) {
        let item = items[i];
        if (JG_BM == 1) {
          if (item.id == aim) {
            result = item;
            break;
          } else if (item.children) {
            result = this.getCurrentPart(aim, item.children, 1);
          }
        } else if (JG_BM == 2) {
          if (item.parentId == aim) {
            result = item;
            break;
          } else if (item.children) {
            result = this.getCurrentPart(aim, item.children, 2);
          }
        } else {
          if (item.departmentId == aim) {
            result = item;
            break;
          } else if (item.children) {
            result = this.getCurrentPart(aim, item.children, 3);
          }
        }
      }
      return result;
    },
    getOrgList () {
      getOrgs().then((res) => {
        if (res.status === statusCode) {
          this.orgs = Array.from(arrayToTreeArray(res.result.data, '-1'))
          this.options_jigou = this.orgs
          console.log('机构信息--22---', this.options_jigou)
        }
      })
    },
    // 获取部门
    getDepartment ($event) {
      console.log('点击机构传的数据--', $event)
      let queryParams = quParam($event.orgId)
      let queryParamsPage = {
        paging: false
      }
      getDepartment(queryParams, queryParamsPage).then((res) => {
        if (res.status === statusCode) {
          this.departments = Array.from(arrayToTreeArray(res.result.data, '-1'))
          this.options_bumen = this.departments
          console.log('调用接口获取部门信息--', this.departments)
        }
      })
    },
    //获取职位
    getPositions ($event) {
      console.log('点击部门传的数据--', $event)
      let queryParams = quParamDepid($event.departmentId)
      let queryParamsPage = {
        paging: false
      }
      getPosition(queryParams, queryParamsPage).then((res) => {
        if (res.status === statusCode) {
          this.positions = Array.from(arrayToTreeArray(res.result.data, '-1'))
          this.options_zhiwei = this.positions
          console.log('调用接口获取职位信息--', this.positions)
        }
      })
    },
    // 联级选择
    change_jigou (val) {
      console.log('选择机构id为---', val)
      this.personForm.orgId = val.slice(-1)[0]
      this.orgsSelectV = this.getPersonPart(val.slice(-1), this.orgs, 1);
      this.getDepartment(this.orgsSelectV)
      this.options_bumen = []  //清空部门
      this.bumenDefault = ''
      this.options_zhiwei = []  //清空职位
      this.zhiweiDefault = ''
    },
    change_bumen (val) {
      console.log('选择部门id为---', val)
      this.personForm.departmentId = val.slice(-1)[0]
      this.departmentSelectV = this.getPersonPart(val.slice(-1), this.departments, 1);
      this.getPositions(this.departmentSelectV)
    },
    change_zhiwei (val) {
      console.log('选择职位id为--', val)
      this.personForm.positionId = val[0]
      this.positionsSelectV = this.getPersonPart(val.slice(-1), this.positions, 1);
      var isExist = this.personForm.positionIds.indexOf(this.personForm.positionId)  //判断是否存在
      if (isExist == -1) {
        let personSelectDataOne = {
          jigou: this.orgsSelectV.name,
          bumen: this.departmentSelectV.name,
          zhiwei: this.positionsSelectV.name
        }
        this.personSelectData.push(personSelectDataOne)
        this.personForm.positionIds.push(this.personForm.positionId)
        console.log('this.personSelectData已经有的数据--222-', this.personSelectData)
      }

    },
    // 新建人员
    addPerson () {
      var that = this
      that.add_edit_val = 1
      that.personFormVisible = true;
      that.personForm = {
        departmentId: '',
        email: "",
        name: "",
        orgId: '',
        personUser: { username: "", password: "" },
        phone: "",
        positionId: '',
        positionIds: [],
        photo: '',
        remark: "",
        sex: 0
      };
      that.personSelectData = []
    },
    // 删除新建人员中选择的职位
    delPersonSelectData (index, row) {
      this.personForm.positionIds.splice(index, 1)   // 删除提交的数据中的数据
      this.personSelectData.splice(index, 1)   // 删除展示的表格
    },
    // 删除人员
    delPerson (index, row) {
      let that = this
      this.$confirm('确定删除该条信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delPerson(row.id).then((res) => {
          if (res.status === statusCode) {
            that.$message.success({
              message: '删除成功',
              duration: 1500
            })
            that._getPersonList(this.currentPage - 1, this.pageSize)
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
    // 保存
    savePerson () {
      let that = this
      console.log('personForm*------', this.personForm)
      this.$refs.personForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {}).then(() => {
            let params = Object.assign({}, this.personForm)
            console.log('保存的数据----', params)
            addPerson(params).then((res) => {
              if (res.status === statusCode) {
                that.$message.success({
                  message: that.add_edit_val == 1 ? '添加成功' : '编辑成功',
                  duration: 2000
                })
                that._getPersonList(this.currentPage - 1, this.pageSize)
                that.personFormVisible = false
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
    // 编辑人员
    showEditPer (index, row) {
      console.log(index, '-------', row)
      var that = this
      that.personSelectData = []
      that.add_edit_val = 2
      that.personFormVisible = true
      getPersonOneDetail(row).then(res => {
        if (res.status === statusCode) {
          console.log('个人详情---', res.result)
          that.personForm = {
            photo: row.photo,
            aimId: row.id,
            departmentId: "",
            email: row.email,
            name: row.name,
            orgId: res.result.orgId,
            personUser: { username: res.result.personUser.username, password: "" },
            phone: row.phone,
            positionId: res.result.positionId,
            positionIds: res.result.positionIds,
            remark: row.remark,
            sex: String(row.sex)
          }
          if (res.result.positionIds.length > 0) {
            console.log('有职位信息----', res.result.positionIds)
            res.result.positionIds.forEach((item, itemIndex) => {
              getPositionDetails(item).then(posRes => {
                if (posRes.status === statusCode) {
                  console.log('职位--', posRes)
                  getDepartmentDetails(posRes.result.departmentId).then(depRes => {
                    if (depRes.status === statusCode) {
                      console.log('部门--', depRes)
                      getOrgsDetails(depRes.result.orgId).then(orgsRes => {
                        if (orgsRes.status === statusCode) {
                          console.log('机构--', orgsRes)
                          let personSelectDataOne = {
                            jigou: orgsRes.result.name,
                            bumen: depRes.result.name,
                            zhiwei: posRes.result.name
                          }
                          this.personSelectData.push(personSelectDataOne)
                        }
                      })
                    }
                  })
                }
              })
            })
            console.log('pp----', this.personSelectData)
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
    //编辑保存单个的人员
    savePersonOne () {
      let that = this
      this.$refs.personForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {}).then(() => {
            let params = Object.assign({}, this.personForm)
            console.log('保存的数据----', params)
            savePersonOne(params).then((res) => {
              if (res.status === statusCode) {
                that.$message.success({
                  message: that.add_edit_val == 1 ? '添加成功' : '编辑成功',
                  duration: 2000
                })
                that._getPersonList(this.currentPage - 1, this.pageSize)
                that.personFormVisible = false
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
    // 图片上传
    onchangeImgFun (e) {
      var _this = this // this指向问题，所以在外面先定义
      var file = e.target.files[0]
      console.log(file)
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
      axios.post(`/file/upload-static`, forData, config)
        .then(response => {
          console.log('axios--', process);
          console.log('request--', window);
          _this.personForm.photo = response.data.result
        })
    }
  }
}
</script>

<style scoped lang="scss">
/* // impUpload */
.headUpload {
  width: 100px;
  height: 120px;
  position: absolute;
  right: 100px;
  display: inline-block;
}
.upload-img {
  width: 100px;
  height: 120px;
  display: inline-block;
  border: 2px dashed #2196f3;
}
.upload-input {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 130px;
  z-index: 2;
  opacity: 0;
  cursor: pointer;
  /* 通过定位把input放在img标签上面，通过不透明度隐藏 */
}
.upload-btn {
  position: absolute;
  top: 130px;
  z-index: 1;
  left: 50%;
  transform: translateX(-50%);
  background: #00b7ee;
  color: #fff;
  border: 0;
  padding: 5px 8px;
  border-radius: 3px;
  cursor: pointer;
}
</style>
