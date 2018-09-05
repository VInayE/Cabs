<template>
 <v-layout row wrap class="p2p_review_footer">
 <v-snackbar class="snacktxt" :timeout="timeout" :bottom="y === 'bottom'" v-model="snackbar">
 {{snackbarText}}
 <v-btn flat class="txt_white" @click.native="snackbar = false">Close</v-btn>
 </v-snackbar>
 <v-flex xs12>
 <v-layout row wrap class="review_message" v-if="Object.keys(fareDetails).length >0" v-html="displayMessgae">
 </v-layout>
 <v-layout row wrap class="p2p_cab_option">
 <div @click.stop="seatsBottomSeats = true" class="flex xs4" v-if="getP2PSearchParams.cab_display_name.toLowerCase() == 'uberpool'" style="text-align:center;padding-top:8px;">
 <v-icon style="font-size:20px;margin-right:5px">person</v-icon>
 <span>{{seatCount}} </span><v-icon style="font-size:20px;margin-left:5px">arrow_drop_down</v-icon>
 <v-bottom-sheet v-model="seatsBottomSeats" >
 <v-list>
 <v-radio-group class="rental_packages" v-model="seatCount" style="padding-left:10px;color:black">
 <v-radio value="1" label= "1 Seat"color="primary" ></v-radio><br/>
 <v-radio value="2" label= "2 Seat"color="primary"></v-radio>
 </v-radio-group>
 </v-list>
 </v-bottom-sheet>
 </div>
 <div class="flex p2p_payment" v-if="Object.keys(this.paymentData).length == 0" v-bind:class="{ xs4: getP2PSearchParams.cab_display_name.toLowerCase() == 'uberpool', xs6:getP2PSearchParams.cab_display_name.toLowerCase() != 'uberpool' }">
 <v-progress-circular indeterminate v-bind:size="20" class="primary--text"></v-progress-circular>
 </div>
 <div class="flex p2p_payment" v-else-if="Object.keys(this.paymentData).length >= 0" v-bind:class="{ xs4: getP2PSearchParams.cab_display_name.toLowerCase() == 'uberpool', xs6:getP2PSearchParams.cab_display_name.toLowerCase() != 'uberpool' }">
 <v-layout row wrap @click.stop="paymentBottomSheets = true">
 <div class="" style="display: flex; justify-content: center;width:100%;">
 <span class="pr5" style="font-family:Roboto-400;color:black;font-size:13px;margin-left:5px;"> {{selectedPaymentOption.display_name}} </span>
 <span class="payment_image pr5" style="width:45px"><img :src="selectedPaymentOption.image_url" style="width:80%"/></span>
 <span style="position: relative; top: -2px;margin-left:-5px;" > <v-icon>arrow_drop_down</v-icon></span>
 </div>
 <!-- <v-flex xs4 offset-xs1 style="font-family:Roboto-400;color:black;font-size:13px"> {{selectedPaymentOption.display_name}}</v-flex>
 <v-flex xs4 offset-xs1 class="payment_image">
 <img :src="selectedPaymentOption.image_url"/>
 </v-flex>
 <v-flex xs1 style="margin-right:3px;">
 <v-icon>arrow_drop_down</v-icon>
 </v-flex> -->
 </v-layout> 
 <v-bottom-sheet v-model="paymentBottomSheets">
 <v-list>
 <v-radio-group class="p2p_rental_packages" v-model="userPaymentSelection" row style="padding: 0px 10px;">
 <v-layout row wrap>
 <v-flex xs12 v-for="(payment, index) in paymentData" :key="index" class="pdl12">
 <v-layout row wrap class="block-box">
 <v-flex xs1> <v-radio :value="payment.id" color="primary" ></v-radio></v-flex>
 <v-flex xs10 style="padding-left:10px;" class="box-section">
 <span style="margin-top:-5px;"> {{payment.display_name}} {{payment.description?(payment.description):''}}</span>
 <img :src="payment.image_url" style="width:40px;margin-left:10px;"/>
 </v-flex>
 </v-layout>
 </v-flex>
 </v-layout>
 </v-radio-group>
 </v-list>
 </v-bottom-sheet>
 </div>
 <div @click="OUpromoCode = true" v-if="!fareDetails.isPromoSelected" class="flex p2p_promo" v-bind:class="{ xs4: getP2PSearchParams.cab_display_name.toLowerCase() == 'uberpool', xs6:getP2PSearchParams.cab_display_name.toLowerCase() != 'uberpool' }">
 APPLY PROMO
 </div>
 <div v-if="fareDetails.isPromoSelected" @click="promoCodeBody.can_revoke ? removePromoCode():''" class="flex p2p_promo" v-bind:class="{ xs4: getP2PSearchParams.cab_display_name.toLowerCase() == 'uberpool', xs6:getP2PSearchParams.cab_display_name.toLowerCase() != 'uberpool' }">
 <div class="promoCodeApplied"><span>{{promoCodeBody.promo_code}}</span><span v-if="promoCodeBody.can_revoke"><v-icon class="icon_remove_promocode" >close</v-icon></span> </div>
 </div>
 </v-layout>
 <v-layout row wrap>
 <v-flex xs12 v-if="getP2PSearchParams.cabVendorName !='ola' && Object.keys(fareDetails).length == 0" style="text-align:center;margin-top:10px">
 <v-progress-circular indeterminate v-bind:size="40" class="primary--text"></v-progress-circular>
 </v-flex>
 <v-flex xs12 class="txt_blue" v-else-if="getP2PSearchParams.cabVendorName =='ola' || (Object.keys(fareDetails).length >= 0 && (fareDetails.ecash == null || Object.keys(fareDetails.ecash).length == 0))" style="text-align:center;margin-top:10px">
 <span style="font-size:16px;">{{getP2PSearchParams.cabVendorName == 'ola' ? getP2PSearchParams.cabPrice : fareDetails.display_offer_fare.display_value}}</span><br/>
 <span style="font-size:13px;">{{getP2PSearchParams.cabVendorName == 'ola' ? 'Ride Fare': fareDetails.display_offer_fare.display_name}}</span>
 </v-flex>
 <v-flex xs12 v-else-if="getP2PSearchParams.cabVendorName !='ola' && Object.keys(fareDetails).length >= 0 && (fareDetails.ecash!=null && Object.keys(fareDetails.ecash).length > 0)" style="text-align:center;margin-top:10px">
 <v-layout row wrap>
 <v-flex xs3>
 <span style="font-size:14px;" class="faredetails_txt">{{fareDetails.display_fare.display_value}}</span><br/>
 <span style="font-size:12px;color:grey">{{fareDetails.display_fare.display_name}}</span>
 </v-flex>
 <v-flex xs1 style="line-height:2;font-family:16px;">
 -
 </v-flex>
 <v-flex xs2>
 <span style="font-size:14px;" class="faredetails_txt">{{fareDetails.isEcashSelected ? fareDetails.ecash.redeemable_amount.display_value:'?0.00'}}</span><br/>
 <img class="img_ecash" style="width:40px;" src="../../../../static/img/icons/ecash.svg"/>
 </v-flex>
 <v-flex xs2 style="line-height:2;font-family:16px;">
 =
 </v-flex>
 <v-flex xs2>
 <span style="font-size:14px;" class="faredetails_txt">{{fareDetails.isEcashSelected ? fareDetails.display_offer_fare.display_value : fareDetails.display_fare.display_value}}</span><br/>
 <span style="font-size:12px;color:grey">{{fareDetails.display_offer_fare.display_name}}</span>
 </v-flex>
 <v-flex x1>
 <v-icon @click="showEcashDialog = true">info_outline</v-icon>
 </v-flex>
 </v-layout>
 </v-flex>
 </v-layout>
 <v-layout row wrap>
 <v-btn block secondary class="bg-red" style="height:43px;margin:10px 10px 10px;" @click="bookCabRide">
 REQUEST {{getP2PSearchParams.cab_display_name.toUpperCase()}}
 </v-btn>
 </v-layout>
 <div class="eta_text">ETA {{getP2PSearchParams.eta}}</div>
 <promo-code-view :OUpromoCode="OUpromoCode" :cabFareID="fareDetails.fare_id" @closePromoCodeDialog="OUpromoCode = false" @promoCodeApplies="promoApplied($event)"></promo-code-view>
 <ecash-details-view :showEcashDialog="showEcashDialog" :fareDetailsJSON="fareDetails" @closeEcashDialog="eCashDialog($event)"></ecash-details-view>
 <search-cabs-modal-view :showSearchModalView="showSearchModalView" 
 :createdOrderDetails="createdOrderDetails"
 @cancelOrder = "showSearchModalView = false;createdOrderDetails = {}"
 @cancelError = "showCancelError($event)"
 @searchErrorResponse = "errorResponseForSearch($event)"
 ></search-cabs-modal-view>
 </v-flex>
 </v-layout>
 
</template>
<script>
 import {mapGetters,mapMutations} from 'vuex'
 import * as types from '../../../store/types'
 export default {
 components:{
 LoaderView : () => import('../../common/loader'),
 PromoCodeView : () => import('./PromoCodeView'),
 EcashDetailsView : () => import('./EcashDetailsView'),
 SearchCabsModalView : () => import('./SearchCabsModalView')
 },
 methods:{
 ...mapMutations({
 setP2PSearchParams : types.SET_P2P_SEARCH_PARAMS
 }),
 errorResponseForSearch(event){
 this.snackbar = true
 this.snackbarText = event ? event : 'Some error occured'
 this.showSearchModalView = false
 this.createdOrderDetails = {}
 },
 removePromoCode () {
 this.fareDetails.isPromoSelected = false
 this.promoCodeBody = {}
 },
 showCancelError(event){
 this.snackbar = true
 this.snackbarText = event.message ? event.message : 'Some error occured please try again'
 },
 promoApplied(data){
 this.snackbar = true
 this.snackbarText = data.message
 this.fareDetails.isPromoSelected = true
 this.promoCodeBody = data
 this.showEcashDialog = false
 this.OUpromoCode = false
 if(this.fareDetails.isEcashSelected){
 this.fareDetails.isEcashSelected = false
 this.displayMessgae = this.fareDetails.messages.promo_applied
 } else if (this.fareDetails.ecash == null || Object.keys(this.fareDetails.ecash).length == 0) {
 this.displayMessgae = this.fareDetails.messages.promo_applied
 }
 },
 eCashDialog(data) {
 this.showEcashDialog = false
 this.fareDetails = data
 if(this.fareDetails.isPromoSelected && this.fareDetails.isEcashSelected) {
 this.fareDetails.isPromoSelected = false
 this.displayMessgae = this.fareDetails.messages.ecash_reenabled_after_promo
 } else if(!this.fareDetails.isEcashSelected) {
 this.displayMessgae = this.fareDetails.messages.ecash_disabled
 } else if(this.fareDetails.isEcashSelected) {
 this.displayMessgae = this.fareDetails.messages.ecash_enabled
 }
 },
 bookCabRide () {
 this.showSearchModalView = true
 let bookRideObject = {
 "vendor_id": this.getP2PSearchParams.vendor_id,
 "fare_id": this.fareDetails.fare_id,
 "vendor_fare_id": this.fareDetails.vendor_fare_id ? this.fareDetails.vendor_fare_id :null,
 "vehicle_class": {
 "id": this.getP2PSearchParams.cabVendorId,
 "image_url": this.getP2PSearchParams.cab_image_url,
 "display_name":this.getP2PSearchParams.cab_display_name,
 "seat_count": this.getP2PSearchParams.cab_display_name.toLowerCase() == "uberpool" ? parseInt(this.seatCount) : null
 },
 "start":{
 "address": this.getP2PSearchParams.pickUpLocation,
 "latitude": this.getP2PSearchParams.pickupLatitude,
 "longitude": this.getP2PSearchParams.pickUpLongitude
 },
 "end": {
 "address": this.getP2PSearchParams.dropLocation,
 "latitude": this.getP2PSearchParams.dropLatitude,
 "longitude": this.getP2PSearchParams.dropLongitude
 },
 "payment_method":{
 "id":this.selectedPaymentOption.id,
 "display_name":this.selectedPaymentOption.display_name,
 "type":this.selectedPaymentOption.type,
 },
 "surge_confirmation_id": this.getP2PSearchParams.surge_confirmation_id ? this.getP2PSearchParams.surge_confirmation_id : null,
 "promo_booking_id": this.fareDetails.isPromoSelected && this.promoCodeBody.promo_booking_id ? this.promoCodeBody.promo_booking_id :null,
 "promo":this.getP2PSearchParams.cabVendorName == 'ola' && this.fareDetails.isPromoSelected ? {"code":this.promoCodeBody.promo_code,"discount_type":"ola_coupon_code","category": "coupon"} : null,
 "ecash": this.fareDetails.isEcashSelected && this.fareDetails.ecash != null && Object.keys(this.fareDetails.ecash).length > 0 ?{"fare_id": this.fareDetails.fare_id,"value":this.fareDetails.ecash.redeemable_amount.value} : null
 }
 Vue.http.headers['content-type'] = 'application/json'
 Vue.http.options.emulateJSON = false
 Vue.http.headers.common['YT-TENANT-CODE'] = '1748'
 Vue.http.headers.common['YT-CHANNEL'] = 'PWACABS'
 let self = this
 this.$http.post('p2p/v1.2/orders',bookRideObject).then(function (response) {
 self.createdOrderDetails = response.body
 }, function (response) {
 self.showSearchModalView = false
 if(response.body.code == 'invalid_fare_id') self.getFareEstimate()
 if(response.body.code == 'surge' && response.body.status == 409){
 self.getP2PSearchParams.surge_confirmation_id = response.body.payload.surge_confirmation.surge_confirmation_id
 self.setP2PSearchParams(self.getP2PSearchParams)
 window.open(response.body.payload.surge_confirmation.href,'_parent')
 }
 self.snackbar = true
 self.snackbarText = response.body.message ? response.body.message :'Some error occured'
 });
 
 },
 getFareEstimate () {
 this.fareDetails = {} 
 Vue.http.headers['content-type'] = 'application/json'
 Vue.http.options.emulateJSON = false
 Vue.http.headers.common['YT-TENANT-CODE'] = '1748'
 Vue.http.headers.common['YT-CHANNEL'] = 'PWACABS' 
 let self = this 
 let requestURL = this.seatSelected !=null ? `p2p/v1.2/estimates/fare?vendor_id=${this.getP2PSearchParams.vendor_id}&vendor_vehicle_class_id=${this.getP2PSearchParams.cabVendorId}&start_latitude=${this.getP2PSearchParams.pickupLatitude}&start_longitude=${this.getP2PSearchParams.pickUpLongitude}&end_latitude=${this.getP2PSearchParams.dropLatitude}&end_longitude=${this.getP2PSearchParams.dropLongitude}&seat_count=${this.seatSelected}&country=India`:`p2p/v1.2/estimates/fare?vendor_id=${this.getP2PSearchParams.vendor_id}&vendor_vehicle_class_id=${this.getP2PSearchParams.cabVendorId}&start_latitude=${this.getP2PSearchParams.pickupLatitude}&start_longitude=${this.getP2PSearchParams.pickUpLongitude}&end_latitude=${this.getP2PSearchParams.dropLatitude}&end_longitude=${this.getP2PSearchParams.dropLongitude}&country=India`
 this.$http.get(requestURL).then(function(response){
 self.fareDetails = response.body
 self.fareDetails.isPromoSelected = false
 self.fareDetails.isEcashSelected = self.fareDetails.ecash != null && Object.keys(self.fareDetails.ecash).length > 0
 self.displayMessgae = self.fareDetails.messages.ecash_enabled ? self.fareDetails.messages.ecash_enabled : self.fareDetails.messages.message
 }, function(response) {
 self.snackbar = true
 self.snackbarText = response.body.message ? response.body.message :'Some error occured in fetching the fare details'
 })
 }
 },
 watch:{
 seatCount(){
 this.seatsBottomSeats = false
 this.seatSelected = this.seatCount
 this.getFareEstimate()
 },
 userPaymentSelection () {
 this.paymentBottomSheets = false
 let index = this.paymentData.findIndex(x => x.id === this.userPaymentSelection)
 this.selectedPaymentOption = this.paymentData[index]
 }
 },
 created(){
 let self = this
 this.$http.get(`p2p/v1/payment_methods?vendor_id=${this.getP2PSearchParams.vendor_id}`).then(function(response){
 self.paymentData = response.body.payment_methods
 self.selectedPaymentOption = response.body.payment_methods[0]
 self.userPaymentSelection = self.selectedPaymentOption.id
 }, function(response) {
 self.snackbar = true
 self.snackbarText = response.body.message ? response.body.message :'Some error occured in fetching the payment methods'
 })
 this.seatSelected = this.getP2PSearchParams.cab_display_name.toLowerCase() == "uberpool" ? 1:null
 if(this.getP2PSearchParams.cabVendorName != 'ola') {
 this.getFareEstimate()
 } else{
 this.fareDetails.isEcashSelected = false
 this.fareDetails.isPromoSelected = false
 }
 },
 computed:{
 ...mapGetters({
 getP2PSearchParams : types.GET_P2P_SEARCH_PARAMS
 }) 
 },
 data () {
 return {
 snackbar: false,
 snackbarText:'',
 timeout: 3000,
 y: 'bottom', 
 paymentData:{},
 showSearchModalView: false,
 createdOrderDetails:{},
 showEcashDialog :false,
 selectedPaymentOption:{},
 seatSelected:0,
 paymentBottomSheets:false,
 userPaymentSelection: '',
 seatsBottomSeats:false,
 seatCount:"1",
 fareDetails:{},
 OUpromoCode:false,
 displayMessgae:'',
 promoCodeBody:{}
 } 
 } 
 }
</script>
<style scoped>
 .icon_remove_promocode{
 font-size: 18px;
 float: right;
 margin-right: 10px;
 font-weight: bold;
 }
 .promoCodeApplied{
 font-size: 12px;
 font-family: 'Roboto-500';
 text-align: center;
 margin-left: 20px;
 margin-right: 20px;
 width: 70%;
 height: 24px;
 border: 2px solid rgb(25, 118, 210);
 border-top-left-radius: 10px;
 border-top-right-radius: 10px;
 border-bottom-left-radius: 10px;
 border-bottom-right-radius: 10px;
 }
 .faredetails_txt{
 color: rgba(0,0,0,.87);
 font-family: 'Roboto-500';
 }
 .p2p_payment{
 border-left: 1px solid rgba(97, 97, 97, 0.44);
 padding-top: 10px;
 text-align:center;
 height:40px;
 }
 .p2p_cab_option{
 height: 40px;
 border-bottom: 1px solid rgba(97, 97, 97, 0.44);
 }
 .payment_image>img{
 width: 30px;
 padding-top: 1px;
 }
 .eta_text{
 text-align: center;
 padding-bottom: 5px;
 font-family: 'Roboto-400';
 color: grey;
 }
 .p2p_promo{
 text-align:center;
 border-left: 1px solid rgba(97, 97, 97, 0.44);
 font-family:'Roboto-400';
 font-size:12px;
 padding-top:10px;
 }
 .rental_packages>label{
 color:black!important; 
 }
 .block-box{
 margin:5px 0;
 }
 .block-box .input-group.input-group--selection-controls .input-group__input .icon{
 height: auto !important;
 }
 .box-section{
 display: flex;
 align-items: center;
 }
 .review_message{
 color: grey;
 font-size: 10px;
 padding: 5px;
 border-bottom: 1px solid rgba(97, 97, 97, 0.44);
 } 
</style>