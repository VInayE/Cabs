<template>
  <v-app class="cd_bg">
     <v-card>
        <v-toolbar dark class="white cd_fixed_header">
            <v-btn icon @click.native="navigateToDetails" dark style="margin-left:0px;">
                    <v-icon class="cl_white_back payment_back">arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title class="cd_header_white header_white">Make Payment</v-toolbar-title>
        </v-toolbar>
      </v-card>
      <div>
         <v-layout row wrap tprice class="payment_view">
          <v-flex xs12 class="txt-total_price">
              <v-flex xs6 left>Total price</v-flex>
              <v-flex xs6 right>{{getCabFareDetails.fare_details.price.advance_charge.display_value}}
             <v-icon class="hv_info_icon" slot="activator" @click.stop="openfareInfoDialog">info_outline</v-icon>
              </v-flex>
          </v-flex>
      </v-layout>
      <cab-fare-breakup class="payment_view" :fareInfoDialog="fareInfoDialog" @fareInfoDialogClose="fareInfoDialog=false"></cab-fare-breakup>
      <v-layout row wrap sltpay>
          <v-flex xs12>Select Payment Option</v-flex>
      </v-layout>
      <div class="payment-option payment_view">
          <div @click.stop="openCreditDialog = true" class="tabs">Credit Card <v-icon class="right">keyboard_arrow_right</v-icon></div>
          <credit-card v-if="CreditCardData!={}"  :creditCardOption="CreditCardData" 
                       :openCreditDialog="openCreditDialog" 
                       @closeCreditDialog="openCreditDialog = false"
                       @creditCardDetails="creditCard($event)">
           </credit-card>
           <div @click.stop="openDebitDialog = true" class="tabs">Debit Card <v-icon class="right">keyboard_arrow_right</v-icon></div>
          <debit-card v-if="DebitCardOption!={}" :debitCardOption="DebitCardOption"  
                      :openDebitDialog="openDebitDialog" 
                      @closeDebitDialog="openDebitDialog = false"
                      @debitCardDetails="creditCard($event)">
          </debit-card>
          <div @click.stop="openNetDialog = true" class="tabs">Net Banking <v-icon class="right">keyboard_arrow_right</v-icon></div>
          <net-banking v-if="netBankingData!={}" :netBankingOption="netBankingData" 
                       :openNetDialog="openNetDialog" 
                       @closeNetDialog="openNetDialog = false"
                       @selectedNetBanking="selectedNetBanking($event)"></net-banking>
           <!--<div @click.stop="openEmiDialog = true" class="tabs">EMI Options <v-icon class="right">keyboard_arrow_right</v-icon></div>-->
          <!--<emi-options :emiOption="emiData" :openEmiDialog="openEmiDialog" @closeEmiDialog="openEmiDialog = false"></emi-options>-->
           <div @click.stop="openWalletDialog = true" class="tabs">Wallet <v-icon class="right">keyboard_arrow_right</v-icon></div>
          <wallet v-if="walletData!={}" :walletOption="walletData"  
                  :openWalletDialog="openWalletDialog" 
                  @closeWalletDialog="openWalletDialog = false"
                  @selectedWalletCode="selectedWallet($event)"
          ></wallet>
      </div>
      
      </div>
      
    <div class="footerfixed"><img src="/pwa/cabs/cabs/img/icons/img_secure_footer.png" class="footer-img"></div>
  </v-app>
</template>
<script>
import router from '../router'
import CreditCard from '../components/cabsPayment/CreditCard'
import { mapGetters } from 'vuex'
import * as types from '../store/types'
import { adobeAnalyticsPageView } from '../helpers/adobeAnalytics'
export default {
  components: {
   CreditCard,
   DebitCard : () => import('../components/cabsPayment/DebitCard'),
   NetBanking : () => import('../components/cabsPayment/NetBanking'),
   Wallet : () => import('../components/cabsPayment/Wallet'),
   CabFareBreakup : () => import('../components/Rental/cabsDetails/CabFareBreakup')
  },
  computed:{
    ...mapGetters({
        getCabFareDetails:types.GET_CAB_FARE_DETAILS,
        getUserInfo:types.GET_USER_INFO,
        getcabsSRPData: types.GET_CABS_SRP_DATA,
        getSDCabType: types.GET_SD_CAB_TYPE,
        getSDPayAmount: types.GET_SD_PAY_AMOUNT
    })
  },
  data () {
   return {
     name: '',  
     openCreditDialog: false,
     openDebitDialog: false,
     openNetDialog: false,
     openEmiDialog: false,
     openWalletDialog: false,
     fareInfoDialog: false,
     netBankingData: {},
     emiData: {},
     walletData: {},
     CreditCardData: {},
     DebitCardOption: {}
   }
  },
    methods: {
     selectedWallet(code){
       alert(code)
     },
     selectedNetBanking(code){
       alert(code)
     },
     creditCard(event){
       console.log(event)
     },
     navigateToDetails(){
         if(this.getSDCabType.cabType == 'selfDrive'){
            router.push({'name':'SelfDriveDetails'})
            }
        else{
            router.push({'name':'CabsDetails'})
            }    
       
     },
     openfareInfoDialog () {
      this.fareInfoDialog = true
      }
    },
    created () {
        if(this.getSDCabType.cabType == 'selfDrive')
            {
        this.getCabFareDetails["fare_details"] = {}
        this.getCabFareDetails.fare_details["price"] = {}
        this.getCabFareDetails.fare_details.price["advance_charge"] = {}
        this.getCabFareDetails.fare_details.price.advance_charge["display_value"] = this.getSDPayAmount.totalAmount
            }
      adobeAnalyticsPageView(this.getcabsSRPData.travel_type == 'outstation' ? 'yt:outstation cab:checkout:payment':'yt:hourly cab:checkout:payment',this.getcabsSRPData.travel_type == 'outstation' ? 'outstation cab' : 'hourly cab','business',this.getcabsSRPData.travel_type == 'outstation' ? 'outstation cab checkout':'hourly cab checkout','payment','','')  
      
      var paymentJonUrl='';  
//      if (process.env.NODE_ENV && process.env.NODE_ENV.toString() === 'production') {
//          paymentJonUrl = 'https://www.yatra.com/pwa/cabs';
//          if(!this.getUserInfo || Object.keys(this.getUserInfo).length == 0){
//            router.push({name:'CabsHomeView',params:{option:'rental'}})
//          }
//      } else {
//        paymentJonUrl = 'http://yatra.com/';
//      }

      let self = this
      let merchant = 'yatra';
      var product= this.getcabsSRPData.travel_type == 'outstation'?'pwa_cab_outstation':'pwa_cab_hourly';
        
      this.$http.get(paymentJonUrl+`/PaySwiftOpt/payment-json-app?product=${product}&merchant=${merchant}`).then(function (response) {
          self.netBankingData = response.data.paymentOptions[2],
          self.emiData = response.data.paymentOptions[4],
          self.walletData =  response.data.paymentOptions[5],
          self.CreditCardData=  response.data.paymentOptions[0],
          self.DebitCardOption = response.data.paymentOptions[1]
       }).catch(function (error) {
          console.log('some error occured')
       });
    }

}
</script>
<style>
  .tab-bank>label{
      color: rgb(0,0,0)!important;
      font-size: 16px;
      text-transform: capitalize;
      font-weight: 500;
      font-family: 'Roboto-400';
    }
  .payment-option{
    padding-top: 15px;
    font-family: Roboto-400;
    font-weight: normal;
  }
  .payment-option>.tabs>i{
    color: rgb(224, 224, 224)!important;
  }
  .txt-total_price{
    font-size: 16px;
    font-weight: 500;
    font-family: 'Roboto-500';
  }
  .payment_view{
      background-color:white;
  }
  .payment_back{
    font-size:24px;
  }
  .cl_white_back{
    margin-left: 5px!important;
    font-size:25px;
    color:#616161!important;
  }
  .cd_header_white{
     font-weight: 500;
    font-size: 20px;
    color: #212121!important;
    margin-left: 0px;
    font-family: 'Roboto-400';
  }
  .header_white{
     font-size: 16px;
    font-family: 'Roboto-500';
    color: rgb(0, 0, 0)!important;
  }
    .footerfixed {
        position: fixed;
        bottom: 0;
        left: 12px;
    }
    .footer-img {
        width: calc(100vw - 30px);
        height: auto;
    }
    .tabs{
        border-bottom: 1px solid #ccc;
        padding: 12px 20px;
        text-transform: capitalize;
        font-weight: 500;
    }
     .paycard .flex-3 {
        float: left;
        width: 33.3%;
        text-align:center
    }
    .paycard input {
      border: 1px solid #e0e0e0;
      width: 100%;
      margin-bottom: 10px;
      padding: 10px;
      outline: none;
      border-radius: 4px;
    }
    #expirationYear{
       border-bottom-left-radius: 0px;
       border-top-left-radius: 0px;
    }
    #expirationMonth{
       border-bottom-right-radius: 0px;
       border-top-right-radius: 0px;
    }
    .p20 {
        padding: 20px;
    }
    .slash {
        border-top: 1px solid #e0e0e0;
    padding: 11.3px;
    border-bottom: 1px solid #e0e0e0;
    }
    .paycard .br-0 {
        border-right: none;
    }
    .paycard .bl-0 {
        border-left: none;
    }
    .tabs:last-child {
    border-bottom: 1px solid #ccc;
}
    .tab-bank div:last-child {
    height: 0;
    min-height: 0;
}
    .tprice {
        padding: 16px;
    }
   .sltpay {
      background: white;
      padding: 12px 20px 8px 20px;
      margin-top: 10px;
      font-size: 13px;
      color: rgb(158, 158, 158);
      font-family: 'Roboto-500';
    }
    .hv_info_icon{
    margin-left:2px;
    color: rgb(30, 136, 229)!important;
    font-size:20px;
    margin-top: -4px;
  }
    
</style>
