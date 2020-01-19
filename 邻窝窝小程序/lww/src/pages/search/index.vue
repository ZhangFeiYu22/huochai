<template>
  <div class="search">
    <div class="searchInputBox">
      <icon class="searchIcon" type="search" size="16"></icon>
      <input type="text" v-model="searchValue" @blur="onSearch" placeholder="请输入搜索关键词" />
    </div>
    <!-- 活动推荐 -->
    <div class="recomContent mt10" v-if="noSearchVal">
      <h2 class="recomH2">活动推荐</h2>
      <div v-for="(item,index) in moduleActivityList" :key="item.id">
        <div v-if="index < 4">
          <ModuleActivity :moduleActivityData="item"></ModuleActivity>
        </div>
      </div>
    </div>
    <div v-else>
      <!-- 搜索结果 -->
      <div class="typeList">
        <div
          class="typeItem"
          :class="typeItemNum == index ? 'active' : ''"
          v-for="(item,index) in activityMenuList"
          :key="item.id"
          @click="activityTypeToggle(index,item.id)"
        >{{item.title}}</div>
      </div>
      <div class="mt10">
        <div v-if="typeItemNum == 0">
          <div v-if="moduleActivityList.length==0">
            <Nodata :text="'暂无你要的数据'"></Nodata>
          </div>
          <div v-else>
            <div v-for="item in moduleActivityList" :key="item.id">
              <ModuleActivity :moduleActivityData="item"></ModuleActivity>
            </div>
          </div>
        </div>
        <div v-else>
          <div v-if="moduleVoucherList.length==0">
            <Nodata :text="'暂无你要的数据'"></Nodata>
          </div>
          <div v-else>
            <div v-for="item in moduleVoucherList" :key="item.id">
              <ModuleChoiceness :Choiceness="item"></ModuleChoiceness>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import globalStore from '@/utils/store'
import ModuleActivity from '../../components/ModulActivity'
import ModuleChoiceness from '../../components/Choiceness'
import Nodata from '../../components/Nodata'
import { getRecommend, getActivityDetail, getChoiceDetail, getSearchActivity, getSearchVoucher } from '@/api/common.js'
export default {
  components: {
    ModuleActivity, ModuleChoiceness, Nodata
  },
  data () {
    return {
      noSearchVal: true,
      searchValue: '',
      typeItemNum: 0,
      activityMenuList: [
        { id: 1, title: '活动' },
        { id: 2, title: '精选' }
      ],
      recommendAll: [],
      moduleActivityList: [],
      moduleVoucherList: []
    }
  },
  onLoad () {
    this.fetchRecommend()
  },
  methods: {
    // 获取推荐
    async fetchRecommend () {
      let voucherRecommend = await getRecommend();
      //  1为活动推荐(搜索位置) 5为精选推荐(搜索位置)  2为我的推荐  3为代金券推荐  4为代金券套餐推荐
      if (voucherRecommend.status == 200) {
        let newArr_ac = []
        let newArr_vo = []
        this.recommendAll = voucherRecommend.result.data
        let arr = voucherRecommend.result.data
        let j = 0;
        for (let i in arr) {
          if (arr[i].position == 1) {
            let data = await getActivityDetail(arr[i].useId)
            newArr_ac.push(data.result)
          } else if (arr[i].position == 5) {
            let data = await getChoiceDetail(arr[i].useId)
            newArr_vo.push(data.result)
          }
        }
        this.moduleActivityList = newArr_ac
        console.log('noSearchVal', this.moduleActivityList)
        this.moduleVoucherList = newArr_vo
      }
    },
    activityTypeToggle (index, id) {
      this.typeItemNum = index;
      console.log('searchValue', this.searchValue)
      this.onSearch();
    },
    onSearch () {
      this.noSearchVal = false
      if (this.searchValue) {
        this.searchNameGetData(this.searchValue)
      } else {
        this.fetchRecommend()
      }
    },
    searchNameGetData (inputName) {
      // this.typeItemNum  为0  搜索活动,   为1  搜索精选
      let searchData = {
        name: inputName,
        cid: globalStore.state.globalMerchantId
      }
      if (this.typeItemNum == 0) {
        getSearchActivity(searchData).then(acRes => {
          console.log('活动搜索----', acRes)
          if (acRes.status == 200) {
            this.moduleActivityList = acRes.result
          }
        })
      } else {
        getSearchVoucher(searchData).then(voRes => {
          console.log('精选搜索----', voRes)
          if (voRes.status == 200) {
            this.moduleVoucherList = voRes.result
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  .searchInputBox {
    position: relative;
    height: 36px;
    margin-bottom: 10px;
    .searchIcon {
      position: absolute;
      z-index: 1;
      left: 10px;
      transform: translateX(10px);
      top: 10px;
    }
    input {
      position: absolute;
      z-index: 0;
      width: 95%;
      left: 50%;
      transform: translateX(-50%);
      font-size: 14px;
      box-sizing: border-box;
      height: 36px;
      line-height: 36px;
      padding-left: 35px;
      background-color: #f6f6f6;
      border-radius: 5px;
    }
  }
  .recomContent {
    .recomH2 {
      margin-left: 2.5%;
      font-size: 16px;
      font-weight: 600;
    }
  }
  .typeList {
    height: 40px;
    line-height: 40px;
    border-top: 1px solid #f6f6f6;
    border-bottom: 1px solid #f6f6f6;
    display: flex;
    justify-content: space-around;
    .typeItem {
      padding: 0 5px;
      &.active {
        font-weight: 600;
        border-bottom: 3px solid #666;
      }
    }
  }
}
</style>
