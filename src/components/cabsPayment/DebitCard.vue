<template>
   <v-dialog v-model="debitDialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-toolbar dark class="white cd_fixed_header">
            <v-btn icon @click.native="closeDebitDialog" dark style="margin-left:0px;">
                    <v-icon class="cl_white_back payment_back">arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title class="cd_header_white header_white">Debit Card</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn dark flat @click.native="closeCreditDialog"></v-btn>
            </v-toolbar-items>
        </v-toolbar>
       <v-container class="p20 paycard bg-white" id="debitcard" v-if="DebitVisible">
            <v-layout row wrap>
                <v-flex xs12 prel>
                  <input id="input1" 
                         v-model="paymentOpt.DebitCardDetails.number" 
                         type="text" 
                         maxlength="30" 
                         autocomplete="off" 
                         name="cc-number" 
                         placeholder="Card Number" 
                         v-on:keypress = "cardSpace($event)"
                         @blur="checkCardDetails"/>
                         <img v-if="cardImg !=''" :src="'/pwa/cabs/cabs/img/icons/'+cardImg+'.png'" class="pabs img-res">
                </v-flex>
                <v-flex xs12 errorMsg v-if="cardNumberErrorMsg">{{cardNumberErrorMsg}}</v-flex>
           </v-layout> 
               <v-layout row wrap> 
                <v-flex xs12>
                    <input id="input2" autocomplete="off" v-model="paymentOpt.DebitCardDetails.name" autocapitalize="none" autocorrect="off" name="name" tabindex="0" placeholder="Name On Card" />
                </v-flex>
                <v-flex xs12 errorMsg v-if="cardHolderErrorMsg">{{cardHolderErrorMsg}}</v-flex>
           </v-layout>
                <v-layout row wrap>
                   <v-flex xs7>

                    <input id="expirationMonth" class="flex-3 br-0" v-model="paymentOpt.DebitCardDetails.mm" maxlength="2" placeholder="MM" autocomplete="cc-exp-month" v-on:keyup="checkMonthLength" v-on:keypress="IsNumberLimit($event)"/>

                    <span class="flex-3 slash">/</span>

                    <input id="expirationYear" class="flex-3 bl-0" ref="expiryYrs" v-model="paymentOpt.DebitCardDetails.yy" maxlength="2" placeholder="YY" autocomplete="cc-exp-year" v-on:keypress="IsNumberLimit($event)" />

                    </v-flex>
                     
                <v-flex xs4 offset-xs1 prel>
                    <input id="cvv"  type="password" v-model="paymentOpt.DebitCardDetails.cvv" placeholder="CVV" autocomplete="cc-exp-year" v-on:keypress="IsNumberLimit($event)" :maxlength="cardMaxLength"/>
                    <img src="/pwa/cabs/cabs/img/icons/cvc_hint.png" class="pabs cvv">
                </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs8 errorMsg v-if="cardExpiryDateErrorMsg">{{cardExpiryDateErrorMsg}}</v-flex>
                  <v-flex xs4 offset-xs8 errorMsg v-if="cardCVVErrorMsg">{{cardCVVErrorMsg}}</v-flex>
                </v-layout>
         </v-container>
         <div class="pricefixed"><button class="btn red"  @click.stop="submitPay">PROCEED TO PAY {{getCabFareDetails.fare_details.price.advance_charge.display_value}}</button></div>
    </v-dialog>
</template>
<script>
  import { mapGetters,mapMutations } from 'vuex'
  import * as types from '../../store/types'
  export default {
      props:['openDebitDialog','debitCardOption'],
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
      data () {
          return {
              debitDialog: false,
              DebitVisible: true,
              cardMaxLength: '3',
              selectedCardForValidation: false,
              cardCVVErrorMsg:undefined,
              selectedCard: {},
              cardExpiryDateErrorMsg: undefined,
              cardNumberErrorMsg: undefined,
              cardHolderErrorMsg: undefined,
              cardImg: '',
              paymentOpt:{
                DebitCardDetails:{
                  number:'',
                  name:'',        
                  mm:'',
                  yy:'',
                  cvv:'',
                  payop: 'dc'
                }
              }
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
       openDebitDialog(){
           this.debitDialog = this.openDebitDialog;
       }
     },
      methods: {
           checkMonthLength(){
            if(this.paymentOpt.DebitCardDetails.mm.length == 2){
             this.$refs.expiryYrs.focus()
            }
          },
           closeDebitDialog () {
             this.$emit('closeDebitDialog', false)  
           },
           validateCardRegex(cardDetails){
               let pattern = new RegExp(cardDetails.cardValidations.regex)
               return pattern.test(this.paymentOpt.DebitCardDetails.number.replace(/\s/g, ''))
           },
           checkCardDetails () {
              let adFilterCndt =this.debitCardOption.cardTypes.findIndex(this.validateCardRegex)
              if(adFilterCndt>=0){
               this.selectedCard = this.debitCardOption.cardTypes[adFilterCndt].cardValidations
               this.cardMaxLength = this.selectedCard.cvvLength
               this.selectedCardForValidation = true
                  this.cardImg = this.debitCardOption.cardTypes[adFilterCndt].logoURL
             } else {
               this.selectedCardForValidation = false  
               this.cardImg = ''
               this.cardMaxLength = '3'
             }
           },
            validateName () {
              if(this.paymentOpt.DebitCardDetails.name ==''){
                  this.cardHolderErrorMsg = 'Enter Card Holder Name'
                  return false
              }else{
                  this.cardHolderErrorMsg = undefined
                  return true
              }
          },
          validateExpiryDate () {
            this.cardExpiryDateErrorMsg = this.paymentOpt.DebitCardDetails.mm == '' || this.paymentOpt.DebitCardDetails.yy == ''? 'Enter the Expiry Date' : parseInt(this.paymentOpt.DebitCardDetails.yy) > parseInt(new Date().getFullYear().toString().substr(-2)) ? undefined : parseInt(this.paymentOpt.DebitCardDetails.yy) == parseInt(new Date().getFullYear().toString().substr(-2)) && parseInt(this.paymentOpt.DebitCardDetails.mm) > parseInt(("0" + (new Date().getMonth() + 1)).slice(-2))  ? undefined: 'Enter correct Expiry Date'
            if(this.cardExpiryDateErrorMsg == undefined) return true
            else return false                              
          },
          validateCVV () {
            this.cardCVVErrorMsg = this.paymentOpt.DebitCardDetails.cvv == '' ? 'Enter CVV number' : parseInt(this.paymentOpt.DebitCardDetails.cvv)>=0 && this.paymentOpt.DebitCardDetails.cvv.length === parseInt(this.selectedCard.cvvLength)?undefined : 'Enter Correct CVV no' 
            if(this.cardCVVErrorMsg == undefined) return true
            else return false  
          },
           submitPay() {
              if(!this.selectedCardForValidation){
                  this.cardNumberErrorMsg = 'Enter correct card details'
                  return false
              }else{
                  this.cardNumberErrorMsg = undefined
                  if(this.validateName() && this.validateExpiryDate() && this.validateCVV()){
                       this.paySwiftCall();
                  } else{
                      return false
                  }
              }
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
                'cno':this.paymentOpt.DebitCardDetails.number.replace(/\s/g, ''),
                'cardType':this.creditCardOption.cardTypes[t].code,
                'cardHolderName':this.paymentOpt.DebitCardDetails.name,
                'cardHolderNumber':this.paymentOpt.DebitCardDetails.number,
                'cardMM':this.paymentOpt.DebitCardDetails.mm,
                'cardYY':this.paymentOpt.DebitCardDetails.yy,
                'cardCvv':this.paymentOpt.DebitCardDetails.cvv,
                'payOptionType':this.paymentOpt.DebitCardDetails.payop,
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
                        paymentOptionParameters:'tdate='+payDetails.tdate+'|merchant=yatra|product='+payDetails.productCode+'|payop='+payDetails.payOptionType+'|previousPayOp='+payDetails.payOptionType+'|cno='+payDetails.cno
                        +'|ctype='+payDetails.cardType
                        +'|isCardInternational=false|address_check_rdo=Domestic|cardholder_name='+payDetails.cardHolderName
                        +'|cexpy=20'+payDetails.cardYY+'|cexpm='+payDetails.cardMM+'|ccsc='+payDetails.cardCvv+
                        '|client=APP|uuid='+response.body.order.external_id,
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
          },
          cardSpace(evt) {
              evt = (evt) ? evt : window.event;
              var charCode = (evt.which) ? evt.which : evt.keyCode;
              if ((charCode > 31 && (charCode < 48 || charCode > 57)) || this.paymentOpt.DebitCardDetails.number.replace(/\s/g, '').length >=16) {
                evt.preventDefault();
              } else {
                let cardNumber = this.paymentOpt.DebitCardDetails.number.replace(/\s/g, '')
                if(cardNumber.length !=0 && cardNumber.length % 4 == 0) {
                   this.paymentOpt.DebitCardDetails.number +=" "
                }
               return true;
              }
          },
           IsNumberLimit(evt) {
              evt = (evt) ? evt : window.event;
              var charCode = (evt.which) ? evt.which : evt.keyCode;
              if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
                evt.preventDefault();;
              } else {
                return true;
              }
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
    .errorMsg{
      margin-top:-2px;
      margin-bottom:5px;
      color: #f44336;
    }
    .img-res {
        right: 20px;
        top: 10px;
        width: 14%;
        height: auto;
        }
    .cvv {
        width: 25%;
        top: 11px;
        right: 10px;
    }
</style>
