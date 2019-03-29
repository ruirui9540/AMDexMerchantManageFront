<template>
  <div class="success">恭喜您付款成功了</div>
</template>

<script>
import utils from '@/utils/utils'

export default {
  data(){
    return {
      price: 0,
    
    }
  },
  mounted() {
   
 this.$Message.warning('成功了')
  },
  methods: {
    getCountDown() {
     
    },

 
  },
  beforeDestroy() {
    if(this.timer) {clearInterval(this.timer)}
  }
}
</script>

<style lang="less">


</style>
