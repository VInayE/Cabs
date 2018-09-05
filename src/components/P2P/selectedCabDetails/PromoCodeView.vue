<template>
   <transition name="modal" v-if="promoCodeDialog">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-body">
            <v-layout row wrap >
              <v-flex class="earned_booking_div" v-if="earnedBookings.earned_bookings" xs12 v-for="(booking,index) in earnedBookings.earned_bookings" :key="index">
                 <v-layout row wrap>
                     <v-flex xs2 class="lock_icon_div"><v-icon class="lock_icon">lock_open</v-icon></v-flex>
                     <v-flex xs9 class="discount_text">{{booking.message}} {{booking.booking_message}}</v-flex>
                 </v-layout>
                 <v-layout row wrap class="promo_description">{{booking.promo_description}}</v-layout>
                 <v-layout row wrap style="padding-bottom: 10px;border-bottom: 1px solid #bdbdbd;">
                    <v-row xs8 class="remaining_promo">Remaining {{booking.promo_codes_info.available}} out of {{booking.promo_codes_info.total}}</v-row>
                    <v-row xs3 class="txt_use_code" @click="applyEarnedPromo(booking.promo_code,booking.promo_booking_id)">USE CODE</v-row>
                 </v-layout>
                 <v-layout row wrap style="margin-top:10px;color:rgb(109,109,109)">{{booking.promo_codes_info.validity_message}}</v-layout>
              </v-flex>
              <v-flex xs12 class="promo_code_title">Have any promo code? Apply here</v-flex>
              <v-flex xs12>
                 <v-layout row wrap>
                   <v-flex xs8> 
                     <v-text-field class="promoCode_text_field" label="PROMO CODE" v-model="promoCode" autocapitalize="characters"></v-text-field>
                  </v-flex>
                  <v-flex xs3 class="promo_code_apply" @click="applyPromoCode">APPLY</v-flex>      
                 </v-layout>
                 <v-layout v-if="showErrorMessage" row wrap class="promo_code_error">Invalid Promo Code</v-layout>
              </v-flex>
              <v-flex xs12 class="text_cancel" @click="cancelModal">CANCEL</v-flex>
              <loader-view v-if="ajaxLoadingDialog"></loader-view>
            </v-layout>
          </div>
        </div>
      </div>
    </div>
   </transition>
</template>
<script>
   import {mapGetters} from 'vuex'
   import * as types from '../../../store/types'
   export default {
     props: ['OUpromoCode','cabFareID'],
     watch:{
       OUpromoCode () {
         this.promoCode = ''
         this.promoCodeDialog = this.OUpromoCode
         this.fareID = this.cabFareID
         this.showErrorMessage = false
       }
     },
     components:{
        LoaderView : ()=> import('../../common/loader')
     },
     created () {
        let self = this
        this.$http.get(`p2p/v1/earned_bookings?vendor_id=${self.getP2PSearchParams.vendor_id}`).then(function (response) {
            self.earnedBookings = response.body
        }).catch(function (error) {
           
        });
       
     },
     data () {
       return {
         promoCodeDialog: false,
         promoCode: '',
         fareID: '',
         ajaxLoadingDialog:false,
         showErrorMessage:false,
         earnedBookings:{},
         yatraPromo:''
       }
    },
    computed:{
      ...mapGetters({
          getP2PSearchParams : types.GET_P2P_SEARCH_PARAMS
      })  
    },
    methods:{
      applyEarnedPromo (promoText,bookingID){
         this.promoCode = promoText
         this.yatraPromo = bookingID
         this.applyPromoCode()
      },
      cancelModal () {
        this.promoCodeDialog = false
        this.$emit('closePromoCodeDialog', false)  
      },
      applyPromoCode () {
        let promoCodeBody={
          'promo_code':this.promoCode,
          'vendor_id': this.getP2PSearchParams.vendor_id,
          'fare_id':this.fareID,
          'promo_booking_id':this.yatraPromo != '' ? this.yatraPromo : null,
          'promo_source': this.yatraPromo != '' ? 'yatra' : null,
          'start':{
              "address": this.getP2PSearchParams.pickUpLocation,
              "latitude": this.getP2PSearchParams.pickupLatitude,
              "longitude": this.getP2PSearchParams.pickUpLongitude
          },
          "end": {
            "address": this.getP2PSearchParams.dropLocation,
            "latitude": this.getP2PSearchParams.dropLatitude,
            "longitude": this.getP2PSearchParams.dropLongitude
           } 
        }
        this.yatraPromo = ''
        this.ajaxLoadingDialog = true
        let self = this
        Vue.http.headers['content-type'] = 'application/json'
        Vue.http.options.emulateJSON = false
        Vue.http.headers.common['YT-TENANT-CODE'] = '1748'
        Vue.http.headers.common['YT-CHANNEL'] = 'PWACABS' 
        Vue.http.headers.common['X-YT-APP-VERSION'] = '1'
        this.$http.post('p2p/v2/promo_code/apply',promoCodeBody).then(function (response) {
           self.ajaxLoadingDialog = false
           self.showErrorMessage = false  
           self.promoCodeDialog = false
           self.$emit('promoCodeApplies', response.body) 
        }).catch(function (error) {
           self.showErrorMessage = true  
           self.ajaxLoadingDialog = false
        });
      }
    }
 }
</script>
<style scoped>
  .txt_use_code{
    margin-left: 25px;
    height: 30px;
    background-color: rgb(25, 118, 210);
    padding: 5px;
    color: white;
    margin-top: 7px;
    margin-top:10px;
  }
  .remaining_promo{
    font-family: 'Roboto-500';
    margin-right: 10px;
    font-weight: bold;
    margin-top:10px;
  }
  .promo_description{
    margin-top: 7px;
    color: rgb(109,109,109);
    font-size: 12px;
    font-family: 'Roboto-400';
  }
  .discount_text{
    font-family: 'Roboto-500';
    font-size: 13px;
    padding-bottom: 7px;
    border-bottom: 1px solid #bdbdbd;
  }
  .lock_icon_div{
    height: 40px;
    width: 40px;
    border-radius: 50%;
    background-color: rgb(25, 118, 210);
    margin-right: 10px;
  }
  .lock_icon{
    color: white;
    padding-top: 7px;
    padding-left: 9px;
    font-weight: normal;
  }
  .earned_booking_div{
    background-color: rgb(238,238,238);
    padding: 10px;
    margin-bottom:10px;
  }
  .promo_code_error{
    color: #EA2330;
    font-size:12px;
    font-family:'Roboto-400' 
  }
  .promo_code_apply{
    padding-top: 4px;
    margin-top: 20px;
    height: 30px;
    width: auto;
    text-align: center;
    margin-left: 10px;
    color: white;
    background-color: rgb(25, 118, 210);
    font-family: 'Roboto-400';
  }
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 10px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  padding-bottom:1px;
}
.modal-header {
    font-size: 20px;
    font-weight: 500;
    color: black;
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
}

.modal-body {
  margin: 10px 0;
  height:auto;
  overflow-y:auto;
  overflow-x:hidden;

}

.modal-default-button {
  float: right;
}
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.promo_code_title{
    font-family:'Roboto-500'
}
.text_cancel{
    height: 30px;
    padding-top: 10px;
    text-align: center;
    color: #EA2330;
    font-family: 'Roboto-500';
    border-top: 1px solid #bdbdbd;
}

</style>
