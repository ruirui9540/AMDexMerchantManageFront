<template>
  <div class="home-wrap">
    <div class="price-box">
      <span class="coin_txt">￥</span>
      <InputNumber :max="10000" :min="1" :precision="0" v-model="price" placeholder="请输入价格"></InputNumber>
      <div class="close_icon" @click="price=null"><Icon v-show="price" type="ios-close-circle" /></div>
    </div>

    <ul class="money-wrap clearfix">
      <li class="money-col" v-for="(item,index) in moneyList" :key="index" @click="price = item">
        <span class="money-txt">￥</span><span>{{item}}</span>
      </li>
    </ul>

    <CellGroup class="paytype-wrap" @on-click="changeName">
        <Cell :title="item.name" :name="item.value" :class="[item.value + '-cell',{'active':paytype == item.value}]" v-for="(item,index) in payList" :key="index" >
            <i class="cell-icon" slot="icon"></i>
            <div slot="extra">
              <i class="selected_icon"></i>
            </div>
        </Cell>
    </CellGroup>

    <Button type="primary" long class="confirm-btn" @click="makeOrder">确定</Button>

  </div>
</template>

<script>
import md5 from 'js-md5'
import utils from '@/utils/utils'
export default {
  data() {
    return {
      price: null,
      paytype: 'alipay',
      payList: [{'name':'支付宝','value':'alipay'},{'name':'微信','value':'wechat'},{'name':'银行卡','value':'union'}],
      moneyList: [100, 200, 500, 1000, 2000, 5000],
    }
  },
  methods: {
    changeName(name) {
      this.paytype = name;
    },
    makeOrder() {
      if(!this.price) {
        this.$Message.info('请输入价格');
        return;
      }
      let params,key;
      if(process.env.VUE_APP_ENV_ALIAS == 'prod') {
        params = {
          "buySymbol": "USDT",
          "payAccount": "123@qq.com",
          "payAmount": this.price,
          "payChannel": this.paytype,
          "paySymbol": "CNY",
          "requestTime": new Date().getTime(),
          "thirdMerchantId": "2",
          "thirdTradeNo": utils.getThirdNo(),
          "thirdUserId": utils.getThirdNo()
        }
        key = 'DZnEcOtLbvZwIm_j5VUkuyEojeJwjtDko9fAFm0k';
             console.log(utils)
      }else {
        console.log(utils.getThirdNo())
        
        params = {
          "buySymbol": "USDT",
          "payAccount": "123@qq.com",
          "payAmount": this.price,
          "payChannel": this.paytype,
          "paySymbol": "CNY",
          "requestTime": new Date().getTime(),
          "thirdMerchantId": "1",
          "thirdTradeNo": utils.getThirdNo(),
          "thirdUserId": utils.getThirdNo()
        }
        key = 'oZrzWC7DZhrkHpFVqhtH5gRFcRmBBP10dJOb0NCH';
      }
      
      // let _requestSign = md5(JSON.stringify(params) + key);
      // params.requestSign = _requestSign;
      // this.$axios.post('/trade/recharge/prepareRechargeTrade',params).then(res=>{
      //   let respBen = res.data;
      //   if(respBen.status == 0) {
      //     this.$router.push('/payment?thirdMerchantId='+respBen.data.thirdMerchantId+'&thirdTradeNo='+respBen.data.thirdTradeNo)
      //   }else {
      //     this.$Message.warning(respBen.message)
      //   }
      // })
      this.$router.push('/success')
      
    }
  },
  mounted(){
    console.log(utils.toFillZero(5))
     console.log(utils.format(new Date(),'yyyy-mm-ss'))
      console.log(utils.getThirdNo())

  }
}
</script>

<style lang="less">
.home-wrap {
  padding: 0.3rem;

  .price-box {
    height: 1.4rem;
    width: 100%;
    padding: 0.34rem 0.3rem;
    line-height: 0;
    background: #FFFFFF;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.05);
    border-radius: 0.1rem;
    display: flex;

    .coin_txt {
      display: inline-block;
      font-size: 0.68rem;
      line-height: 0.72rem;
      color: #F6BA64;
      vertical-align: top;
    }
    .ivu-input-number {
      flex: 1;
      height: 0.72rem;
      border: none;

      .ivu-input-number-input {
        height: 0.72rem;
        line-height: 0.72rem;
        padding: 0 0.3rem;
        background: #FFFFFF;
        font-size: 0.48rem;
      }
    }
    .close_icon {
      display: inline-block;
      width: 16px;
      .ivu-icon-ios-close-circle {
        color: #bbb;
        margin-top: 0.2rem;
      }
    }
    

  }

  .money-wrap {
    padding-bottom: 0.3rem;
    .money-col {
      float: left;
      width: calc((100% - 0.6rem) / 3);
      height: 1.2rem;
      line-height: 1.2rem;
      background-color: #FFFFFF;
      box-shadow: 0 2px 10px 0 rgba(0,0,0,0.05);
      border-radius: 0.1rem;
      margin-top: 0.3rem;
      text-align: center;
      &:active {
        background-color: rgba(45, 140, 240, 0.7);
      }

      .money-txt {
          display: inline-block;
          width: 0.24rem;
          line-height: 1.3rem;
          margin-right: 0.03rem;
          vertical-align: top;
          font-size: 0.32rem;
          color: rgba(86, 99, 255, 0.5);
      }
      
      span {
        font-size: 0.48rem;
        color: #5663FF;
        font-weight: bold;
      }
      &:active span {
        color: #fff;
      }
    }
    .money-col:not(:nth-child(3n)) {
      margin-right: 0.3rem;
    }
  }

  .paytype-wrap {
    .ivu-cell {
      background: #FFFFFF;
      box-shadow: 0 2px 10px 0 rgba(0,0,0,0.05);
      border-radius: 0.1rem;
      padding: 0.35rem 0.25rem;
      margin-bottom: 0.3rem;
    }
    .cell-icon {
      display: inline-block;
      width: 0.66rem;
      height: 0.5rem;
      vertical-align: top;
    }
    .alipay-cell .cell-icon {
      background: url('../assets/imgs/pay_icon1.png') top left no-repeat;
      background-size: contain;
    }
    .wechat-cell .cell-icon {
      background: url('../assets/imgs/pay_icon4.png') top left no-repeat;
      background-size: contain;
    }
    .union-cell .cell-icon {
      background: url('../assets/imgs/pay_icon7.png') top left no-repeat;
      background-size: contain;
    }
    .selected_icon {
      display: inline-block;
      vertical-align: top;
      width: 0.36rem;
      height: 0.36rem;
      background: url('../assets/imgs/selnot.png') top left no-repeat;
      background-size: contain;
    }
    .ivu-cell.active {
      .selected_icon {
        background: url('../assets/imgs/seled.png') top left no-repeat;
        background-size: contain;
      }
      &.alipay-cell .cell-icon {
        background: url('../assets/imgs/pay_icon2.png') top left no-repeat;
        background-size: contain;
      }
      &.wechat-cell .cell-icon {
        background: url('../assets/imgs/pay_icon5.png') top left no-repeat;
        background-size: contain;
      }
      &.union-cell .cell-icon {
        background: url('../assets/imgs/pay_icon8.png') top left no-repeat;
        background-size: contain;
      }
    }
  }

  .confirm-btn {
    height: 0.9rem;
    font-size: 0.32rem;
    color: #FFFFFF; 
    font-weight: bold;
    margin-top: 0.3rem;
  }
  
}

</style>
