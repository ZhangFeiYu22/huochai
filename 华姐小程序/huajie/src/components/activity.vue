<template>
  <div class="activity">
    <activityCom :acticityList='activityListData'></activityCom>
  </div>
</template>

<script>
import activityCom from '@/components/activityComponents'
import { activityList } from '@/utils/api'
export default {
  components: {
    activityCom
  },
  data () {
    return {
      activityListData: []
    }
  },
  onLoad () {
    this.getList();
  },
  methods: {
    async getList () {
      let activityD = await activityList()
      this.activityListData = activityD.activityList;
    }
  }  
}
</script>

<style lang="less" scoped>
.activity {
  width: 94%;
  margin: 30px auto;
}
</style>
