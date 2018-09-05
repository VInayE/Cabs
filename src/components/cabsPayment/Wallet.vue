<template>
     <v-dialog v-model="walletDialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-toolbar dark class="white cd_fixed_header">
            <v-btn icon @click.native="closeWalletDialog" dark style="margin-left:0px;">
                    <v-icon class="cl_white_back payment_back">arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title class="cd_header_white header_white">Wallet</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn dark flat @click.native="closeCreditDialog"></v-btn>
            </v-toolbar-items>
        </v-toolbar>
   <v-layout class="wallet bg-white" row wrap>
            <v-flex xs12 p10>
            <div class="tabs" v-for="(item,index) in walletOption.suboptionList">
              <span class="left radio-btn prel">
                <v-radio-group v-model="bankcode" row>
                    <v-radio class="tab-bank"  :value="item.subOption" color="primary" :id="item.subOption"></v-radio>
                </v-radio-group>
                </span>
                 <span class="left w100"><img :src="'/pwa/cabs/cabs/img/icons/'+item.subOption+'.png'" class="img-resp"></span>
            </div>
            </v-flex>
            <v-flex xs12 p20 content>
	          <p>We will redirect you to corresponding wallet page where you can make payment.</p>
	          <p>As per government norms, non-KYC customers can pay a maximum of ₹ 20,000 in a month using wallets.</p>
            </v-flex>
        </v-layout>
         <div class="pricefixed"><button class="btn red" @click.stop="makePayment">PROCEED TO PAY {{this.getCabFareDetails.fare_details.price.advance_charge.display_value}}</button></div>
    </v-dialog>
</template>
<script>
  import { mapGetters} from 'vuex'
  import * as types from '../../store/types'
  import {makePaymentCall} from '../../helpers/payment'
  export default {
      props:['openWalletDialog', 'walletOption'],
      computed:{
        ...mapGetters({
            getCabFareDetails:types.GET_CAB_FARE_DETAILS,
            getcabsSRPData: types.GET_CABS_SRP_DATA,
            getGSTDetailsForm: types.GET_GST_DETAILS,
            getUserInfo: types.GET_USER_INFO,
            getPromoCode:types.GET_PROMOCODE,
            getSearchParams:types.GET_SEARCH_PARAMS,
            getSDCabType: types.GET_SD_CAB_TYPE,
            getCabFareDetails: types.GET_SD_FARE_DETAILS,
            getSDPayAmount: types.GET_SD_PAY_AMOUNT
        }),
      },
      data(){
          return {
              walletDialog: false,
              bankcode: this.walletOption.walletCode
          }
      },
       watch:{
       openWalletDialog(){
           this.walletDialog = this.openWalletDialog;
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
           },
      methods: {
           closeWalletDialog () {
             this.$emit('closeWalletDialog', false)  
           },
           makePayment() {
             this.paySwiftCall();
           },
          paySwiftCall(){
              let self = this
              let createOrderDetails ={
                  'travel_type': this.getcabsSRPData.travel_type,
                  'search_id': this.getcabsSRPData.search_id,
                  'fare_id': this.getCabFareDetails.fare_id,
                  'gst_details':this.getGSTDetailsForm.gst_details.address !=''? this.getGSTDetailsForm.gst_details : null
                }
                Vue.http.headers.common['Content-Type'] = 'application/json';
                Vue.http.headers.common['YT-CHANNEL'] = 'PWA';
                Vue.http.headers.common['YT-TENANT-CODE'] = this.getcabsSRPData.travel_type == 'outstation'? 'pwa_cabs':'pwahourlycabs';
                Vue.http.options.emulateJSON = false;
                var t = this.creditCardOption.cardTypes.findIndex(this.validateCardRegex);
                var payDetails={
                    'patternMatch': new RegExp('^[1-9][0-9]?$'),
                    'paymentModeType':'',
                    'paymentAmount':'',
                    'tdate':this.getSearchParams.completeDropDate,
                    'payOptionType':'mw',
                    'bankcode':this.bankcode,
                    'productCode': this.getcabsSRPData.travel_type == 'outstation'?'pwa_cab_outstation':'pwa_cab_hourly'
                }

                if(typeof(self.getCabFareDetails.fare_details.price.advance_percentage)) {
                    let pt = payDetails.patternMatch.test(self.getCabFareDetails.fare_details.price.advance_percentage.value);
                    payDetails.paymentModeType = pt===true?'PARTIAL':'FULL' ;
                    payDetails.paymentAmount = payDetails.paymentModeType==='FULL'?self.getCabFareDetails.fare_details.price.total_charge.value:
                    self.getCabFareDetails.fare_details.price.advance_charge.value
                }
                this.$http.post('v1/orders',createOrderDetails).then(function (response) {
                    self.showLoader = false                
                    if(response.status == 200) {
                        let payswiftCardParams ={
                            amountDisplayed:payDetails.paymentAmount,
                            appVersion:'1.0',
                            client:'APP',
                            discount:0,
                            discountingStatus:false,
                            email:self.getUserInfo.email,
                            merchant:'yatra',
                            mob:self.getUserInfo.mob,
                            otherDiscountingStatus:false,
                            paymentMode:payDetails.paymentModeType,
                            paymentOptionParameters:'tdate='+payDetails.tdate+'|merchant=yatra|product='+payDetails.productCode
                            +'|payop='+payDetails.payOptionType+'|bankCode='+payDetails.bankcode
                            +'|prBank='+payDetails.bankcode+'|client=APP|uuid='+response.body.order.external_id,
                            product:payDetails.productCode,
                            promoCode:self.getPromoCode.promoCode,
                            promoType:self.getPromoCode.promoType,
                            superPnr:response.body.order.id,
                            ttid:parseInt('11'+response.body.order.id),
                            uuid:response.body.order.external_id,
                            amountToRedeem:0
                        }
                        Vue.http.options.emulateJSON = true;
                        this.$http.post('PaySwift/payNow',payswiftCardParams).then(function (response) {
                            makePaymentCall(response.body)
                        })
                    }
                  }, function (response) {
                      self.showLoader = false
                });
              }
        }
  }
</script>
<style scoped>
     .content{
      padding-top: 0px;
      color: rgb(117, 117, 117);
      font-size: 14px;
      font-family: 'Roboto-400';
      margin-top:-50px
     }
     .pricefixed {
        position: fixed;
        bottom: 0;
        width: 100%;
        text-align: center;
        background-color: rgb(234, 35, 48);
        height: 43px;
        font-size: 14px;
        font-weight: bold;
        font-family: 'Roboto-400';
    }
    .pricefixed .btn{
        font-size:14px;
        margin-top:0px;
    }
    .wallet .tabs {
        width: 50%;
        float: left;
        border: 1px solid #ccc;
        padding: 0 8px;
        height:56px;
}
    .tab-bank {
    padding: 12px 0;
}
    .wallet .w100 {
        width: 100px;
        margin-top: 13px;
        position: relative;
        left: 10px;
    }
    .wallet .w100>img{
       width:inherit;
       height:auto;
    }
    .radio-btn {
        
    }
    .p10 {
        padding: 10px;
    }
    .p20 {
        padding: 20px;
    }
</style>
