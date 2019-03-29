<template>
  <div class="payment-wrap">
    <div class="notpay-wrap" v-show="payIndex==0">
      <div class="countdown-wrap">
        <p>请付款</p>
        <p>请在{{minutes}}:{{seconds}}内付款，超时将自动取消订单</p>
      </div>

      <div class="paycode-wrap">
        <p class="money-txt"><span>￥</span>{{price}}</p>
        <div class="qrcode-wrap" >
          <div id="qrcode" ref="qrcode" v-if="payType!='union'">
            <img style="width:200px;" :src="orderInfo.receiptQrCode" alt=""></div> 
          <div class="union-box" v-else>
            <p>6114 4914 1935 24513</p>
            <p>{{orderInfo.receiptAccountName}}，民生银行，新罗支行</p>
          </div>
          <p class="remark">如您已向卖家转账付款，请务必点击“标记为已付款”按鈕，否则将会导致延迟到账</p>
        </div>
      </div>

      <div class="pay-bnts">
        <Button type="primary" ghost long class="sign-btn" @click="signPaid">标记为已付款</Button>
        <Button :long="payType=='union'" ghost :class="['cancel-btn',{'long':payType=='union'}]" @click="cancelOrder">取消</Button>
        <Button type="primary" :class="['toPay-btn',payType]" @click="goPay"><i></i>去付款</Button>
      </div>

    </div>

    <div class="paid-wrap" v-show="payIndex!=0">
        <div class="countdown-wrap" v-if="payIndex==1">
          <p>等待到账</p>
          <p>正在处理中，请耐心等待，预计5分钟内到账</p>
        </div>
        <div class="countdown-wrap" v-else-if="payIndex==2">
          <p>充值完成</p>
          <p>请返回游戏查询您的充值结果</p>
        </div>

        <div class="wait-wrap">
          <p class="money-txt"><span>￥</span>{{price}}</p>
          <div class="wait-box" v-if="payIndex==1">
            <i-circle :percent="percent" :stroke-width="9" :trail-width="8" :size="185" stroke-color="#5663FF">
                <span class="circle-inner">{{minutes}}:{{seconds}}</span>
            </i-circle>
          </div>

          <div class="recharge-success" v-else-if="payIndex==2">
            <img src="../assets/imgs/bg.png" alt="">
            <p>充值成功</p>
          </div>
        </div>

    </div>
      
  </div>
</template>

<script>
// import QRCode from 'qrcodejs2';
import utils from '@/utils/utils'
import { setTimeout } from 'timers';

export default {
  name: 'payment',
  data(){
    return {
      price: 100,
      minutes: '15',
      seconds: '00',
      payType: 'alipay',
      payIndex: 0,
      percent: 100,
      countdownMinutes: 900, //15分钟-900秒   5分钟300秒
      timer: null,
      orderInfo: null,
    }
  },
  mounted() {
    if(this.$route.query && JSON.stringify(this.$route.query) != '{}') {
      let _query = this.$route.query;
      this.queryDetail(_query);
    }
    else {
      this.$router.replace('/')
    }
  },
  methods: {
    queryDetail(_info) {
      this.$axios.get('/trade/recharge/queryRechargeTrade?thirdMerchantId='+_info.thirdMerchantId+'&thirdTradeNo='+_info.thirdTradeNo).then(res=>{
        let respBen = res.data;
        if(respBen.status == 0) {
          this.orderInfo = respBen.data;
          if(this.orderInfo.tradeStatus == 'create') {
            this.payIndex = 0;
          }else if(this.orderInfo.tradeStatus == 'paid') {
            this.payIndex = 1;
          }else if(this.orderInfo.tradeStatus = 'complete') {
            this.payIndex = 2;
            this.countdownMinutes = 0;
            if(this.timer) {clearInterval(this.timer)}
            sessionStorage.setItem('amWaitTime','')
          }else { 
            // 已关闭、已取消
            this.$router.replace('/'); 
          }

          this.payType = this.orderInfo.payChannel;
          this.price = this.orderInfo.payAmount;

          if(this.payIndex == 0) {
            this.countdownMinutes = parseInt((new Date(this.orderInfo.requestTime.replace(/-/g,'/')).getTime() + 15*60*1000 - new Date().getTime()) / 1000);
            this.getCountDown();
          }else if(this.payIndex == 1){
            this.countdownMinutes = sessionStorage.getItem('amWaitTime') ? sessionStorage.getItem('amWaitTime') :300;
            this.getCountDown();
            setTimeout(()=>{
              this.queryDetail(this.orderInfo);
            },30000)
          }
        }
      })
    },
    // 去付款
    goPay() {
      this.$Message.info('暂不支持,请扫码支付')
    },
    // 取消订单
    cancelOrder() {
      let _info = this.orderInfo;
      this.$axios.post('/trade/recharge/rechargeTradeCancel?thirdMerchantId='+_info.thirdMerchantId+'&thirdTradeNo='+_info.thirdTradeNo+'&thirdUserId='+_info.thirdUserId).then(res=>{
        let respBen = res.data;
        if(respBen.status == 0) {
          this.$router.replace('/')
        }else {
          this.$Message.warning(respBen.message)
        }
      })
    },
    signPaid() {
      let _info = this.orderInfo;
      this.$axios.post('/trade/recharge/rechargeTradePaid?thirdMerchantId='+_info.thirdMerchantId+'&thirdTradeNo='+_info.thirdTradeNo+'&thirdUserId='+_info.thirdUserId).then(res=>{
        let respBen = res.data;
        if(respBen.status == 0) {
          this.$Message.success('标记成功');
          
          this.payIndex = 1;
          this.countdownMinutes = 300;
          this.getCountDown();
          setTimeout(()=>{this.queryDetail(this.orderInfo)},3000)
        }else {
          this.$Message.warning(respBen.message)
        }
      })
    },
    getCountDown() {
      if(this.timer) {clearInterval(this.timer)}
      if(this.countdownMinutes<=0) {
        return;
      }
      this.minutes = utils.toFillZero(parseInt(this.countdownMinutes / 60));
      this.seconds = utils.toFillZero(this.countdownMinutes % 60);

      this.timer = setInterval(()=>{
        this.countdownMinutes -= 1;
        this.minutes = utils.toFillZero(parseInt(this.countdownMinutes / 60));
        this.seconds = utils.toFillZero(this.countdownMinutes % 60);
        if(this.payIndex == 1) {
          this.percent = this.countdownMinutes/300 * 100;
          sessionStorage.setItem('amWaitTime',this.countdownMinutes)
        }
        if(this.countdownMinutes <= 0) {
          if(this.payIndex == 1) {
            this.countdownMinutes = 300;
          }else {
            clearInterval(this.timer)
          }
        }
      },1000)
    },


  },
  beforeDestroy() {
    if(this.timer) {clearInterval(this.timer)}
  }
}
</script>

<style lang="less">
.payment-wrap,.notpay-wrap,.paid-wrap {
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
  .notpay-wrap {
    .paycode-wrap {
      padding: 0.3rem;
      
      .qrcode-wrap {
        height: calc(100% - 1.4rem);
        background: #FFFFFF;
        box-shadow: 0 2px 10px 0 rgba(0,0,0,0.05);
        border-radius: 0 0 0.1rem 0.1rem;
        padding: 0.3rem;
        .remark {
          margin-top: 0.3rem;
          font-size: 0.28rem;
          color: #9A9A9A;
          padding: 0 0.3rem;
        }
        #qrcode {
          height: calc(100% - 0.84rem);
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            margin: auto;
          }
        }
        .union-box {
          height: calc(100% - 0.84rem);
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex-wrap: wrap;
          >p {
            width: 100%;
            color: #444444;
            text-align: center
          }
          >p:first-child {
            font-size: 0.56rem;
            font-weight: bold;
          }
          >p:nth-child(2) {
            font-size: 0.28rem;
            padding: 0 0.3rem;
          }
        }
      }

      
    }

    .pay-bnts {
      height: 2.4rem;
      padding: 0 0.3rem;
      .sign-btn {
        margin-bottom: 0.3rem;
        height: 0.9rem;
        font-size: 0.32rem;
        font-weight: bold;
        border-width: 0.04rem;
      }
      .cancel-btn,.toPay-btn {
        width: calc((100% - 0.3rem) / 2);
        height: 0.9rem;
        font-weight: bold;
      }
      .cancel-btn {
        border: 0.04rem solid #9A9A9A;
        font-size: 0.32rem;
        color: #9A9A9A;
      }
      .toPay-btn {
        margin-left: 0.3rem;
        font-size: 0.32rem;
        color: #FFFFFF;
        i {
          display: inline-block;
          width: 0.4rem;
          height: 0.3rem;
          margin-right: 0.1rem;
          margin-top: 0.07rem;
          vertical-align: top;
        }
        &.alipay i {
          background: url('../assets/imgs/pay_icon3.png') top left no-repeat;
          background-size: contain;
        }
        &.wechat i {
          background: url('../assets/imgs/pay_icon6.png') top left no-repeat;
          background-size: contain;
        }
        &.union i {
          background: url('../assets/imgs/pay_icon9.png') top left no-repeat;
          background-size: contain;
        }
      }
    }
  }


  .paid-wrap {
    .wait-wrap {
      padding: 0.3rem;
      .wait-box,.recharge-success {
        
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
        margin: 1.4rem 0;
      }
      .ivu-chart-circle svg {
        transform: rotateY(180deg);
        -webkit-transform: rotateY(180deg);
      }
      .recharge-success {
        >img {
          margin: 1rem 0 0.4rem;
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
