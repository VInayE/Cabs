<template>
     <v-dialog v-model="netDialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-toolbar dark class="white cd_fixed_header">
            <v-btn icon @click.native="closeNetDialog" dark style="margin-left:0px;">
                    <v-icon class="cl_white_back payment_back">arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title class="cd_header_white header_white">Net Banking</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn dark flat @click.native="closeCreditDialog"></v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <div class="white">
            <v-layout row wrap class="default-bank">
            <v-snackbar class="snacktxt" :timeout="timeout" :bottom="y === 'bottom'" v-model="snackbar">
            Please Select Your Bank
            <v-btn flat class="txt-ff" @click.native="snackbar = false">Close</v-btn>
            </v-snackbar>
            <v-flex xs12 p010 fb>Select your Bank</v-flex>
            <v-flex xs12 p10>
                <div xs6 class="tabs" v-for="(item,index) in popularBank">
                    <span class="left prel radio-btn">
                      <v-radio-group v-model="bankcode" row>
                            <v-radio class="tab-bank" color="primary" :value="item.name" :id="item.name"></v-radio>
                            <span class="left w100"><img :src="'/pwa/cabs/cabs/img/icons/'+item.url+'.png'" class="img-resp"></span>
                      </v-radio-group>
                      
                    </span> 
                    
                </div>
                </v-flex>
            </v-layout>
            <v-layout row wrap class="net-banking"> 
            <v-flex xs12 p010 fb>Or Choose Another Bank</v-flex>  
               <v-radio-group v-model="bankcode" row>
                   <v-flex xs12>
                     <div class="tabs" v-for="(item,index) in netBankingOption.banks">
                       <v-radio class="tab-bank"  :label="item.displayText"  :value="item.code" color="primary" :id="item.code"></v-radio>
                    </div>
                </v-flex>
               </v-radio-group>
               
            </v-layout>
        </div>
        <div class="pricefixed"><button class="btn red" @click.stop="makePayment">PROCEED TO PAY  {{this.getCabFareDetails.fare_details.price.advance_charge.display_value}}</button></div>
    </v-dialog>
</template>
<script>
  import { mapGetters,mapMutations } from 'vuex'
  import * as types from '../../store/types'
  import {makePaymentCall} from '../../helpers/payment'
  export default {
      props:['openNetDialog','netBankingOption'],
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
              popularBank:[
                  {'name':'HDFC','url':'HDF'},
                  {'name':'ICICI','url':'icicinet'},
                  {'name':'SBI','url':'SBI'},
                  {'name':'AXIS','url':'axis-net'},
                  {'name':'CITI','url':'CIT'},
                  {'name':'KOTAK','url':'162'}
              ],
              netDialog: false,
              bankcode: '',
              snackbar: false,
              snackbarText:'',
              timeout: 3000,
              y: 'bottom',
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
       watch:{
       openNetDialog(){
           this.netDialog = this.openNetDialog;
       }
     },
      methods: {
           makePayment () {
             if(this.bankcode == ''){
                 this.snackbar = true
                 return false
             } else{
                this.paySwiftCall();
             }
           },
           closeNetDialog () {
             this.$emit('closeNetDialog', false)  
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
            var payDetails={
                'patternMatch': new RegExp('^[1-9][0-9]?$'),
                'paymentModeType':'',
                'paymentAmount':'',
                'tdate':this.getSearchParams.completeDropDate,
                'payOptionType':'nb',
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
                        +'|payop='+payDetails.payOptionType+'|bankCode='+payDetails.bankcode+'|prBank='+payDetails.bankcode
                        +'|client=APP|uuid='+response.body.order.external_id,
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
    .radio-btn {
        top: 12px;
    }
    .p20 {
        padding: 20px;
    }
    .tabs {
        border-bottom: 1px solid #ccc;
        padding: 0px 20px;
    }
    .tab-bank label {
    font-size: 14px;
}
    .default-bank .w100 {
        width: 100px;
        margin-top: -12px;
        position: relative;
        left: 5px;
    }
    .default-bank .tabs {
      width: 50%;
      float: left;
      border: 1px solid #e0e0e0;
      padding: 0 8px;
      height: 56px;
    }
    .default-bank .tabs .img-resp{
        width:100%;
    }
    
    .p10 {
        padding: 10px;
    }
    .p010 {
        padding: 10px 10px 0 10px;
    }
    .fb {
       color: rgb(0,0,0);
       font-size: 16px;
       text-transform: capitalize;
       font-weight: 500;
       font-family: 'Roboto-400';
    }
    .white {
        background: #fff;
    }
    .net-banking .tabs {
        padding: 20px;
        padding-top:27px;
    }
</style>
