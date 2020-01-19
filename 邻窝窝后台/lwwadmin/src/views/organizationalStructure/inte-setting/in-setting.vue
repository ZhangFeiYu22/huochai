<template>
  <div class="wrap">
    <!--部门   添加编辑-->
    <el-dialog
      v-if="depChild"
      :title="add_edit_val == 1 ? '添加部门' : '编辑部门'"
      :visible.sync="dialogFormVisible"
      center
    >
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="部门名称：" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="所属机构：" :label-width="formLabelWidth">
          <el-input
            v-model="addForm.orgname"
            suffix-icon="el-icon-arrow-down"
            :disabled="true"
            style="width: 235px"
          ></el-input>
        </el-form-item>
        <el-form-item label="上级部门：" :label-width="formLabelWidth">
          <el-input
            v-model="addForm.parentname"
            suffix-icon="el-icon-arrow-down"
            :disabled="true"
            style="width: 235px"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门编码：" :label-width="formLabelWidth">
          <el-input v-model="addForm.code" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="备注：" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveDepartment">保存</el-button>
      </div>
    </el-dialog>

    <!--职位  添加编辑-->
    <el-dialog
      v-if="posChild"
      :title="add_edit_val == 1 ? '添加岗位' : '编辑岗位'"
      :visible.sync="dialogFormVisible"
      center
    >
      <el-form :model="posAddForm" ref="posAddForm">
        <el-form-item label="岗位名称：" :label-width="formLabelWidth">
          <el-input v-model="posAddForm.name" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="所在部门：" :label-width="formLabelWidth">
          <el-input
            v-model="posAddForm.departmentname"
            suffix-icon="el-icon-arrow-down"
            :disabled="true"
            style="width: 235px"
          ></el-input>
        </el-form-item>
        <el-form-item label="上级岗位：" :label-width="formLabelWidth">
          <el-input
            v-model="posAddForm.positionname"
            suffix-icon="el-icon-arrow-down"
            :disabled="true"
            style="width: 235px"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注：" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="posAddForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="add_edit_val == 2" type="primary" @click="savePosiOne">保存1</el-button>
        <el-button v-else type="primary" @click="savePosi">保存</el-button>
      </div>
    </el-dialog>

    <!--人员  添加编辑-->
    <el-dialog
      :title="add_edit_val == 1 ? '添加人员' : '编辑人员'"
      v-if="perChild"
      :visible.sync="personFormVisible"
      center
    >
      <div class="headUpload">
        <input
          type="file"
          name="image"
          accept="image/*"
          @change="onchangeImgFun"
          class="upload-input"
        />
        <img alt :src="$root.imgUrlHttp + personForm.photo" class="upload-img" />
        <button class="upload-btn">图片上传</button>
      </div>
      <el-form :model="personForm" ref="personForm">
        <el-form-item label="姓名:" :label-width="formLabelWidth">
          <el-input v-model="personForm.name" auto-complete="off" style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="性别:" :label-width="formLabelWidth">
          <el-radio-group v-model="personForm.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
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

    <el-container class="container">
      <!-- 机构 -->
      <el-aside class="aside" width="240px">
        <tree-grid
          :columns="columns"
          :columntype="true"
          :tree-structure="true"
          :treeType="false"
          :data-source="orgs"
          @treeGridClick="getDepartment"
        ></tree-grid>
      </el-aside>

      <el-main class="main">
        <div class="top">
          <!-- 部门 -->
          <div class="top-left">
            <div class="buttons">
              <el-button type="primary" @click="showAndDep()">新建部门</el-button>
              <el-button type="success">保存全部</el-button>
            </div>
            <tree-grid
              :columns="columnsDep"
              :columntype="true"
              :tree-structure="true"
              :isadd="true"
              :iseditor="true"
              :isdel="true"
              :data-source="departments"
              @addMenuSecond="addMenuSecond"
              @editorMenu="showEditorDep"
              @delMenu="delDep"
              :content="contentDep"
              @treeGridClick="getPositions($event)"
            ></tree-grid>
          </div>
          <!-- 职位 -->
          <div class="top-right">
            <div class="buttons">
              <el-button type="primary" @click="addEditorPos()">新建职位</el-button>
              <el-button type="success">保存全部</el-button>
            </div>
            <tree-grid
              :columns="columnsPos"
              :columntype="true"
              :tree-structure="true"
              :isadd="true"
              :iseditor="true"
              :isdel="true"
              :data-source="positions"
              :content="contentPos"
              @addMenuSecond="showAndPos"
              @editorMenu="editEditorPos"
              @delMenu="delPos"
              @treeGridClick="getPerson($event)"
            ></tree-grid>
          </div>
        </div>
        <!-- 人员 -->
        <div class="bottom">
          <div class="buttons">
            <el-button type="primary" @click="addPerson">新建人员</el-button>
          </div>
          <el-table :data="persons" border height="80%" style="width: 100%;overflow-y:auto;">
            <el-table-column type="index" label="#" align="center"></el-table-column>
            <el-table-column prop="name" label="姓名" align="center"></el-table-column>
            <el-table-column prop="sex" label="性别" :formatter="formatterColumn" align="center"></el-table-column>
            <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
            <el-table-column prop="action" label="操作" align="center">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="light" content="编辑" placement="bottom-start">
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="showEditPer(scope.$index, scope.row)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="删除" placement="bottom-start">
                  <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="delPerson(scope.$index, scope.row)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script type="text/ecmascript-6">
import axios from 'axios'
import { getOrgs, getDepartment, getPosition, getPerson, addDepartment, addPosition, addPositionOne, editDep, delDep, editPos, delPos, addPerson, getPersonOneDetail, savePersonOne, delPerson, } from 'api/in-setting'
import { statusCode } from 'common/js/config'
import { quParam, quParamDepid, arrayToTreeArray } from 'common/js/utils'
import TreeGrid from 'base/basetable/TreeGrid'

export default {
  components: {
    TreeGrid
  },
  data () {
    return {
      personSelectData: [],
      add_edit_val: 0,
      depChild: false,
      posChild: false,
      perChild: false,
      orgs: [],   //机构列表数据      
      orgsClickVal: false,   //机构点击了 则改变为true  判断是否选择了机构
      orgsCreateV: {},   //点击机构存储当前点击机构,为新建部门提供数据
      departments: [],  //部门列表数据
      departmentClickVal: false,   //部门点击了 则改变为true  判断是否选择了部门
      departmentCreateV: {},   //点击部门存储当前点击部门,为新建职位提供数据
      positions: [],  //职位列表数据
      positionsClickVal: false,   //职位点击了 则改变为true  判断是否选择了职位
      positionsCreateV: {},   //点击职位存储当前点击职位,为新建人员提供数据
      persons: [],   //人员列表数据
      id: '',
      // 添加相关数据
      dialogFormVisible: false,  // 添加页面是否显示
      // 添加子部门数据
      addForm: {
        name: '',
        parentname: '',
        orgname: '',
        code: '',
        parentId: '',
        orgId: '',
        remark: ''
      },
      // 添加子岗位数据
      posAddForm: {
        name: '',
        parentname: '',
        departmentname: '',
        positionname: '',
        parentId: '',
        departmentId: '',
        remark: ''
      },
      personForm: {
        name: [{ required: true, message: '请输入部门姓名', trigger: 'blur' }],
        code: [{ required: true, message: '请输入部门编码', trigger: 'blur' }],
        remark: [{ required: true, message: '备注', trigger: 'blur' }]
      },
      // 编辑相关数据      
      editFormRules: {
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入部门编码', trigger: 'blur' }],
        remark: [{ required: true, message: '备注', trigger: 'blur' }]
      },
      // 人员数据  添加编辑
      personFormVisible: false,   // 人员管理
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
      options_jigou: [],
      jigouDefault: '',  //显示值
      options_bumen: [],
      bumenDefault: '',  //显示值
      options_zhiwei: [],
      zhiweiDefault: '',  //显示值
      formLabelWidth: '120px',
      columns: [
        {
          text: '机构',
          dataIndex: 'name'
        }
      ],
      columnsDep: [
        {
          text: '部门',
          dataIndex: 'name'
        }
      ],
      columnsPos: [
        {
          text: '职位',
          dataIndex: 'name'
        }
      ],
      contentDep: '添加子部门',
      contentPos: '添加子岗位'
    }
  },
  created () {
    this.getOrgList()
  },
  methods: {
    getOrgList () {
      getOrgs().then((res) => {
        if (res.status === statusCode) {
          this.orgs = Array.from(arrayToTreeArray(res.result.data, '-1'))
          this.options_jigou = this.orgs
          console.log('机构信息--22---', this.options_jigou)
        }
      })
    },
    getDepartment ($event) {
      console.log('点击机构传的数据--', $event)
      this.jigouDefault = $event.id  //勾选新建人员里面的机构

      this.departmentClickVal = false
      this.positionsClickVal = false
      this.positions = []  //点击机构的时候,职位清空初始化
      this.persons = []  //人员信息初始化
      this.orgsClickVal = true;   //机构点击选择了  改变为true
      this.orgsCreateV = $event   //存储当前点击的机构,为新建部门提供数据
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
    getPositions ($event) {
      console.log('点击部门传的数据--', $event)
      this.departmentClickVal = true;   //部门点击选择了  改变为true
      this.departmentCreateV = $event   //存储当前点击的部门,为新建职位提供数据
      this.bumenDefault = $event.id  //勾选新建人员里面的部门

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
    getPerson ($event) {
      console.log('点击职位传的数据--', $event)
      this.positionsClickVal = true;   //部门点击选择了  改变为true
      this.positionsCreateV = $event   //存储当前点击的部门,为新建职位提供数据
      this.zhiweiDefault = $event.id  //勾选新建人员里面的职位
      getPerson($event.positionId).then((res) => {
        if (JSON.parse(res).status === statusCode) {
          this.persons = JSON.parse(res).result
          console.log('调用接口获取人员信息--', this.persons)
        }
      })
    },
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
    // --------------------------------------------------------人员------增删改查----Begin---
    change_jigou (val) {
      this.personForm.orgId = val.slice(-1)[0]
      var aimReturn = this.getPersonPart(val.slice(-1), this.orgs, 1);
      this.getDepartment(aimReturn)
      this.options_bumen = []  //清空部门
      this.bumenDefault = ''
      this.options_zhiwei = []  //清空职位
      this.zhiweiDefault = ''
    },
    change_bumen (val) {
      this.personForm.departmentId = val.slice(-1)[0]
      var aimReturn = this.getPersonPart(val.slice(-1), this.departments, 1);
      this.getPositions(aimReturn)
    },
    change_zhiwei (val) {
      this.personForm.positionId = val[0]
      var aimReturn = this.getPersonPart(val.slice(-1), this.positions, 1);
      this.getPerson(aimReturn)
      var isExist = this.personForm.positionIds.indexOf(this.personForm.positionId)  //判断是否存在
      if (isExist == -1) {
        console.log('最终的选择的职位id--', val)
        let personSelectDataOne = {
          jigou: this.orgsCreateV.name,
          bumen: this.departmentCreateV.name,
          zhiwei: this.positionsCreateV.name
        }
        this.personSelectData.push(personSelectDataOne)
        this.personForm.positionIds.push(this.personForm.positionId)
        console.log('this.personSelectData已经有的数据--222-', this.personSelectData)
      }

    },
    // 删除新建人员中选择的职位
    delPersonSelectData (index, row) {
      this.personForm.positionIds.splice(index, 1)   // 删除提交的数据中的数据
      this.personSelectData.splice(index, 1)   // 删除展示的表格
      console.log(this.personSelectData)

    },
    // 新建人员
    addPerson () {
      var that = this
      if (!that.orgsClickVal) {
        that.$message({
          message: '请先选择机构',
          duration: 2000
        })
      } else if (!that.departmentClickVal) {
        that.$message({
          message: '请先选择部门',
          duration: 2000
        })
      } else if (!that.positionsClickVal) {
        that.$message({
          message: '请先选择职位',
          duration: 2000
        })
      } else {
        that.add_edit_val = 1
        that.personFormVisible = true
        that.perChild = true
        that.personForm = {
          departmentId: that.departmentCreateV.id,
          email: "",
          name: "",
          orgId: that.orgsCreateV.id,
          personUser: { username: "", password: "" },
          phone: "",
          positionId: that.positionsCreateV.id,
          positionIds: [],
          photo: '',
          remark: "",
          sex: ''
        };
        that.personSelectData = []
        var isExist = that.personForm.positionIds.indexOf(that.positionsCreateV.id)  //判断是否存在
        if (isExist == -1) {
          let personSelectDataOne = {
            jigou: that.orgsCreateV.name,
            bumen: that.departmentCreateV.name,
            zhiwei: that.positionsCreateV.name
          }
          that.personSelectData.push(personSelectDataOne)
          that.personForm.positionIds.push(that.positionsCreateV.id)
          console.log('that.personSelectData已经有的数据--1111-', that.personSelectData)
        }
      }
    },
    // 保存
    savePerson () {
      let that = this
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
                that.getPerson(that.positionsCreateV)
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
      var resDetail
      var that = this
      that.add_edit_val = 2
      that.personFormVisible = true
      that.perChild = true
      getPersonOneDetail(row).then(res => {
        console.log('个人详情---', res.result)
        resDetail = res.result
        that.personForm = {
          photo: row.photo,
          aimId: row.id,
          departmentId: "",
          email: row.email,
          name: row.name,
          orgId: resDetail.orgId,
          personUser: { username: resDetail.personUser.username, password: "" },
          phone: row.phone,
          positionId: resDetail.positionId,
          positionIds: resDetail.positionIds,
          remark: row.remark,
          sex: row.sex
        }
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
                that.getPerson(that.positionsCreateV)
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
            that.getPerson(that.positionsCreateV)
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
    // --------------------------------------------------------人员------增删改查----end---
    // --------------------------------------------------------部门------增删改查----Begin---
    // 新建部门
    showAndDep () {
      var that = this
      that.addForm = {}
      if (that.orgsClickVal) {
        var partmentsClick = that.orgsCreateV;   //当前点击的机构数据
        var row = that.getCurrentPart(partmentsClick.orgId, that.orgs, 1)   //当前点击的数据,与所有数据的机构查找并赋值
        this.add_edit_val = 1
        that.dialogFormVisible = true
        that.posChild = false
        that.depChild = true
        if (row) {
          if (row.departmentId) {
            that.addForm.parentId = row.departmentId
          } else {
            that.addForm.parentId = '-1'
          }
          that.addForm.parentname = ''
          that.addForm.orgname = row.name
          that.addForm.orgId = row.orgId
        }

      } else {
        this.$message({
          message: '请先选择机构',
          duration: 2000
        })
      }
    },
    // 部门里面添加子部门
    addMenuSecond (index, row) {
      var that = this
      that.addForm = {}
      this.add_edit_val = 1
      that.dialogFormVisible = true
      that.posChild = false
      that.depChild = true
      if (row.departmentId) {
        that.addForm.parentId = row.departmentId
      } else {
        that.addForm.parentId = '-1'
      }
      that.addForm.parentname = row.name
      that.addForm.orgId = row.orgId
      var ccc = that.getCurrentPart(row.orgId, that.orgs, 1)   //当前点击的数据,与所有数据的机构查找并赋值
      that.addForm.orgname = ccc.name
    },
    // 保存
    saveDepartment () {
      let that = this
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {}).then(() => {
            let params = Object.assign({}, this.addForm)
            addDepartment(params).then((res) => {
              if (res.status === statusCode) {
                that.$message.success({
                  message: that.add_edit_val == 1 ? '添加成功' : '编辑成功',
                  duration: 2000
                })
                // let queryParams = quParam(this.addForm.orgId)
                // let queryParamsPage = {
                //   paging: false
                // }
                // getDepartment(queryParams, queryParamsPage).then((res) => {
                //   if (res.status === statusCode) {
                //     this.departments = Array.from(arrayToTreeArray(res.result.data, '-1'))
                //   }
                // })
                that.getDepartment(that.orgsCreateV)
                that.dialogFormVisible = false
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
    // 编辑部门
    showEditorDep ($event, row) {
      var that = this
      this.add_edit_val = 2
      that.dialogFormVisible = true
      that.posChild = false
      that.depChild = true
      if (row.orgId) {
        var ccc = that.getCurrentPart(row.orgId, that.orgs, 1)   //当前点击的数据,与所有数据的机构查找并赋值(所属机构)
        this.addForm.orgname = ccc.name
      }
      if (row.parentId == -1) {
        this.addForm.parentId = ''
        this.addForm.parentname = ''
      } else {
        this.addForm.parentId = row.parentId
        var bbb = that.getCurrentPart(row.parentId, that.departments, 2)   //当前点击的数据,与所有数据的机构查找并赋值(所属机构)
        this.addForm.parentname = bbb.name
      }
      this.addForm.name = row.name
      this.addForm.code = row.code
      this.addForm.orgId = row.orgId
      this.addForm.id = row.id

    },
    // 删除部门
    delDep (index, row) {
      let that = this
      this.$confirm('确定删除该条信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDep(row.id).then((res) => {
          if (res.status === statusCode) {
            that.$message.success({
              message: '删除成功',
              duration: 1500
            })
            that.getDepartment(that.orgsCreateV)
          }
        }).catch((error) => {
          console.log(error)
          that.$message.error({
            message: '请求出现异常,' + error.message,
            duration: 2000
          })
        })
      })
    },
    // --------------------------------------------------------部门------增删改查----end---

    // --------------------------------------------------------职位------增删改查----Begin---
    // 添加职位
    addEditorPos () {
      var that = this
      that.posAddForm = {}
      if (!that.orgsClickVal) {
        this.$message({
          message: '请先选择机构',
          duration: 2000
        })
      } else {
        if (that.departmentClickVal) {
          var partmentsClick = that.departmentCreateV;   //当前点击的部门数据
          var row = that.getCurrentPart(partmentsClick.departmentId, that.departments, 3)   //当前点击的数据,与所有数据的部门查找并赋值
          this.add_edit_val = 1
          that.dialogFormVisible = true
          that.posChild = true
          that.depChild = false
          if (row) {
            if (row.positionId) {
              that.posAddForm.parentId = row.positionId
            } else {
              that.posAddForm.parentId = '-1'
            }
            that.posAddForm.departmentname = row.name
            that.posAddForm.departmentId = row.id
          }

        } else {
          this.$message({
            message: '请先选择部门',
            duration: 2000
          })
        }
      }
    },
    // 编辑职位
    editEditorPos ($event, row) {
      var that = this
      this.add_edit_val = 2
      that.dialogFormVisible = true
      that.posChild = true
      that.depChild = false
      console.log('v----', row)
      if (row.departmentId) {
        var ccc = that.getCurrentPart(row.departmentId, that.departments, 3)   //当前点击的数据,与所有数据的机构查找并赋值(所属机构)
        this.posAddForm.departmentname = ccc.name
      }
      if (row.parentId == -1) {
        this.posAddForm.parentId = -1
        this.posAddForm.parentname = ''
      } else {
        this.posAddForm.parentId = row.parentId
        var bbb = that.getCurrentPart(row.parentId, that.positions, 2)   //当前点击的数据,与所有数据的机构查找并赋值(所属机构)
        this.posAddForm.positionname = bbb.name
      }
      this.posAddForm.remark = row.remark
      this.posAddForm.name = row.name
      this.posAddForm.departmentId = row.departmentId
      that.posAddForm.positionId = row.positionId   //编辑单个保存,  传id保存

    },
    showAndPos (index, row) {
      var that = this
      that.posAddForm = {}
      this.add_edit_val = 1
      that.dialogFormVisible = true
      that.posChild = true
      that.depChild = false
      if (row.positionId) {
        that.posAddForm.parentId = row.positionId
      } else {
        that.posAddForm.parentId = '-1'
      }
      that.posAddForm.departmentId = row.departmentId
      that.posAddForm.positionname = row.name
      var ccc = that.getCurrentPart(row.departmentId, that.departments, 3)   //当前点击的数据,与所有数据的机构查找并赋值
      that.posAddForm.departmentname = ccc.name
    },
    //编辑保存   接口保存不一致  编辑保存传id保存
    savePosiOne () {
      let that = this
      this.$refs.posAddForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {}).then(() => {
            let params = Object.assign({}, this.posAddForm)
            addPositionOne(params).then((res) => {
              if (res.status === statusCode) {
                that.$message.success({
                  message: '添加成功',
                  duration: 2000
                })
                that.dialogFormVisible = false
                this.getPositions(this.departmentCreateV)
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
    savePosi () {
      let that = this
      this.$refs.posAddForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {}).then(() => {
            let params = Object.assign({}, this.posAddForm)
            addPosition(params).then((res) => {
              if (res.status === statusCode) {
                that.$message.success({
                  message: '添加成功',
                  duration: 2000
                })
                that.dialogFormVisible = false
                this.getPositions(this.departmentCreateV)
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
    // 删除职位
    delPos (index, row) {
      let that = this
      this.$confirm('确定删除该条信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delPos(row.id).then((res) => {
          if (res.status === statusCode) {
            that.$message.success({
              message: '删除成功',
              duration: 1500
            })
            this.getPositions(this.departmentCreateV)
          }
        }).catch((error) => {
          console.log(error)
          that.$message.error({
            message: '请求出现异常,' + error.message ,
            duration: 2000
          })
        })
      })
    },
    // --------------------------------------------------------职位------增删改查----End---
    // 性别显示转换
    formatterColumn (row, column) {
      return row.sex == 1 ? '男' : '女'
    },
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
.wrap {
  margin: 0 auto;
  padding: 0px;
  width: 100%;
  // height: 100%;
  height: 94%;

  .container {
    width: 100%;
    height: 100%;
    .eltablecus {
      background: #eff7ff;
    }
    .aside {
      border: 3px solid #96c2f1;
      background: #eff7ff;
    }
  }

  .main {
    // background-color: cornflowerblue;
    padding-top:0;
    padding-bottom: 0;
    .top {
      width: 100%;
      height: 50%;
      box-sizing: border-box;
      -moz-box-sizing: border-box; /* Firefox */
      -webkit-box-sizing: border-box; /* Safari */
      margin-left: 5px;
      //  border: 1px solid #429EFD;
      //  justify-content: space-between;

      .top-left {
        width: 50%;
        height: 100%;
        float: left;
        overflow: hidden;
        box-sizing: border-box;
        -moz-box-sizing: border-box; /* Firefox */
        -webkit-box-sizing: border-box; /* Safari */
        // border: 1px solid #429EFD;
        border-top-width: 5px;
        border-top-style: solid;
        border-top-color: #96c2f1;

        border-right-width: 5px;
        border-right-style: solid;
        border-right-color: #96c2f1;

        border-left-width: 5px;
        border-left-style: solid;
        border-left-color: #96c2f1;

        /*border-left: 0;
          border-top-right-radius: 2px;
          border-bottom-right-radius: 2px;
          -moz-border-radius-topright: 2px;
          -moz-border-radius-bottomright: 2px;
          -webkit-border-top-right-radius: 2px;
          -webkit-border-bottom-right-radius: 2px;*/
        padding: 8px 10px;

        .buttons {
          height: 60px;
        }
      }
      .top-right {
        width: 50%;
        height: 100%;
        float: right;
        box-sizing: border-box;
        -moz-box-sizing: border-box; /* Firefox */
        -webkit-box-sizing: border-box; /* Safari */
        //   border: 1px solid #429EFD;
        //  border-left: 0;
        /*border-top-right-radius: 2px;
          border-bottom-right-radius: 2px;
          -moz-border-radius-topright: 2px;
          -moz-border-radius-bottomright: 2px;
          -webkit-border-top-right-radius: 2px;
          -webkit-border-bottom-right-radius: 2px;*/
        border-top-width: 5px;
        border-top-style: solid;
        border-top-color: #96c2f1;

        border-left-width: 5px;
        border-left-style: solid;
        border-left-color: #96c2f1;

        border-right-width: 5px;
        border-right-style: solid;
        border-right-color: #96c2f1;
        padding: 8px 10px;

        .buttons {
          height: 60px;
        }
      }
    }

    .bottom {
      width: 100%;
      height: 50%;
      box-sizing: border-box;
      -moz-box-sizing: border-box; /* Firefox */
      -webkit-box-sizing: border-box; /* Safari */
      border: 5px solid #96c2f1;
      padding: 8px 10px;
      margin-left: 5px;

      .buttons {
        height: 60px;
      }
    }
  }
}
// impUpload
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
