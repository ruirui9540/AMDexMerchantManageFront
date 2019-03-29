<template>
  <div class="payment-wrap">
    <div class="paid-wrap">
        <div class="countdown-wrap">
          <p>等待到账</p>
          <p>正在处理中，请耐心等待，预计5分钟内到账</p>
        </div>

        <div class="wait-wrap">
          <p class="money-txt"><span>￥</span>{{price}}</p>
          <div class="wait-box">
            <i-circle :percent="percent" :stroke-width="9" :trail-width="8" :size="185" stroke-color="#5663FF">
                <span class="circle-inner">{{minutes}}:{{seconds}}</span>
            </i-circle>
          </div>
        </div>

    </div>
      
  </div>
</template>

<script>
import utils from '@/utils/utils'

export default {
  data(){
    return {
      price: 0,
      minutes: '15',
      seconds: '00',
      countdownMinutes: 300, //5分钟300秒
      timer: null,
      orderInfo: null,
    }
  },
  mounted() {
    this.orderInfo = JSON.parse(sessionStorage.getItem('amOrderInfo'));
    this.price = this.orderInfo.payAmount;
    
    this.getCountDown();
  },
  methods: {
    getCountDown() {
      if(this.timer) {clearInterval(this.timer)}
      this.minutes = utils.toFillZero(parseInt(this.countdownMinutes / 60));
      this.seconds = utils.toFillZero(this.countdownMinutes % 60);
      

      this.timer = setInterval(()=>{
        this.countdownMinutes -= 1;
        this.minutes = utils.toFillZero(parseInt(this.countdownMinutes / 60));
        this.seconds = utils.toFillZero(this.countdownMinutes % 60);
        this.percent = this.countdownMinutes/300 * 100;
        if(this.countdownMinutes <= 0) {
          clearInterval(this.timer)
        }
      },1000)
    },

    queryRecharge() {
      let _info = this.orderInfo;
      this.$axios.get('/trade/recharge/queryRechargeTrade?thirdMerchantId=1'+_info.thirdMerchantId+'&thirdTradeNo='+_info.thirdTradeNo).then(res=>{
        let respBen = res.data;
        if(respBen.status == 0) {
          if(respBen.data.tradeStatus != 'complete') {
            setTimeout(()=>{
              this.queryRecharge();
            },30*1000)
          }else {
            this.countdownMinutes = 0;
            if(this.timer) {clearInterval(this.timer)}
            this.payIndex = 2;
          }
        }
      })
      
    }
  },
  beforeDestroy() {
    if(this.timer) {clearInterval(this.timer)}
  }
}
</script>

<style lang="less">
.payment-wrap,.paid-wrap {
  height: 100%;
}
.payment-wrap {
  .countdown-wrap {
    height: 1.8rem;
    background: #FFFFFF;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.05);
    padding: 0.3rem;
    >p:first-child {
      font-size: 0.52rem;
      color: #5663FF;
      font-weight: bold;
    }
    >p:nth-child(2) {
      font-size: 0.28rem;
      color: #9A9A9A;
    }
  }
  .money-txt {
    font-size: 0.8rem;
    color: #5663FF;
    font-weight: bold;
    background: #EEEFFF;
    border-radius: 0.1rem 0.1rem 0 0;
    text-align: center;
    height: 1.4rem;
    line-height: 1.4rem;
    >span:first-child {
      font-size: 0.66rem;
    }
  }


  .paid-wrap {
    .wait-wrap {
      height: calc(100% - 1.8rem);
      padding: 0.3rem;
      .wait-box,.recharge-success {
        height: calc(100% - 1.4rem);
        text-align: center;
        background: #FFFFFF;
        box-shadow: 0 2px 10px 0 rgba(0,0,0,0.05);
        border-radius: 0 0 0.1rem 0.1rem;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .circle-inner {
        font-size: 0.8rem;
        font-weight: bold;
        color: #5663FF;
      }
      .ivu-chart-circle {
        transform: perspective(1000);
      }
      .ivu-chart-circle svg {
        transform: rotateY(180deg);
        -webkit-transform: rotateY(180deg);
      }
      .recharge-success {
        >img {
          width: 6.3rem;
          height: 4.16rem;
        }
        >p {
          font-size: 0.8rem;
          color: #5663FF;
          font-weight: bold;
          height: 2rem;
          line-height: 2rem;
        }
      }
    }
    
    
  }
}



</style>
