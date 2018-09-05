<template>
     <div class="dfb_div">
        <v-layout row wrap class="dfb_header">Fare Details</v-layout>
            <v-layout class="dfb_div_layout" row wrap name="body" v-for="(charges,index) in fareBreakup.price.charges" :key="index">
                <v-flex xs10 sm6  class="txt_terms">
                   {{charges.display_name}}
                </v-flex>
                <v-flex xs2 class="txt_terms text-right">
                   {{charges.display_value}}
                </v-flex>
            </v-layout>
            <v-divider class="dfb_divider" v-if="promoCodeBody &&  Object.keys(promoCodeBody).length>0 && promoCodeBody.cash"></v-divider>
            <v-layout row wrap name="body" class="pd10" v-if="promoCodeBody &&  Object.keys(promoCodeBody).length>0 && promoCodeBody.cash">
                <v-flex xs9 sm6 class="txt_terms">
                   Discount (-)
                </v-flex>
                <v-flex xs3 class="txt_terms text-right">
                  ₹  {{promoCodeBody.cash.discount}}
                </v-flex>
            </v-layout>
            <v-divider class="dfb_divider"></v-divider>
            <v-layout row wrap name="body" class="pd10 fs-xlg">
                <v-flex xs9 sm6 class="txt_terms">
                   {{fareBreakup.price.total_charge.display_name}}
                </v-flex>
                <v-flex xs3 class="txt_terms text-right">
                   {{fareBreakup.price.total_charge.display_value}}
                </v-flex>
            </v-layout>
            <v-divider class="dfb_divider"></v-divider>
            <v-layout row wrap name="body" class="pd10 " v-if="fareBreakup.price.advance_charge">
                <v-flex xs9 sm6 class="txt_terms">
                   {{fareBreakup.price.advance_charge.display_name}}
                </v-flex>
                <v-flex xs3 class="txt_terms text-right">
                   {{fareBreakup.price.advance_charge.display_value}}
                </v-flex>
            </v-layout>
            <v-divider class="dfb_divider" v-if="fareBreakup.price.advance_charge"></v-divider>
            <v-layout row wrap name="body" class="pd10" v-if="fareBreakup.price.ecash && fareBreakup.price.ecash.ecash_earn.value">
                <v-flex xs7 sm6 class="txt_terms">
                   You Earn
                </v-flex>
                <v-flex xs5 class="txt_terms text-right">
                   {{fareBreakup.price.ecash.ecash_earn.display_value}}
                   <img class="img_ecash" src="/pwa/cabs/cabs/img/icons/ecash.svg"/>
                </v-flex>
            </v-layout>
            <v-divider class="dfb_divider"></v-divider>
            <v-layout row wrap name="body" class="pd15 rel" @click.stop="openGSTDetailsForm">
                <v-icon v-if="getGSTDetailsForm.gst_details.number != ''" style="color:green;margin-right:5px;font-size:20px;">done</v-icon>
                <span class="txt_terms gst-text">
                   {{getGSTDetailsForm.gst_details.number!=""? 'Review your GST Details' :'Add your GST Details'}} 
                </span>
                <span class="display_value" v-if="getGSTDetailsForm.gst_details.number == ''">
                   (Optional)  <v-icon class="hv_info_icon" slot="activator" @click.stop="openGSTInfoDialog">info_outline</v-icon>
                </span>
                <span class="pos-rel" >
                  <v-icon class="fs20 mt5">keyboard_arrow_right</v-icon>
                </span>
            </v-layout>
            <v-divider class="dfb_divider">
            </v-divider>
            <gst-info-dialog-view :GSTInfoDialog="GSTInfoDialog" @GSTInfoDialogClose="GSTInfoDialog=false"></gst-info-dialog-view>
            <gst-form-details-view :GSTDetailsForm="GSTDetailsForm" @closeGSTFormDetails="GSTDetailsForm=false"></gst-form-details-view>
          </div>
</template>
<script>
   import { mapGetters,mapMutations } from 'vuex'
   import * as types from '../../../store/types'
   export default {
     props: ['fareBreakup','promoCodeBody'],
     components: {
       GstInfoDialogView: () => import('./GSTInfoDialogView'),
       GstFormDetailsView : () => import('./GSTFormDetailsView')
     },
     computed:{
       ...mapGetters ({
          getCabFareDetails:types.GET_CAB_FARE_DETAILS,
          getGSTDetailsForm:types.GET_GST_DETAILS,
       }),
       initialTotalCharge () {
         return  this.getCabFareDetails.fare_details.price.total_charge.value
       }
     },
     watch : {
       promoCodeBody () {
         if(Object.keys(this.promoCodeBody).length > 0 && this.promoCodeBody.cash) {
            this.fareBreakup.price.total_charge.display_value = '₹ ' + this.promoCodeBody.effective_total_amount.toString()
            this.fareBreakup.price.total_charge.value = this.promoCodeBody.effective_total_amount
            this.setPriceAfterPromo(this.promoCodeBody)
         } else{
            this.fareBreakup.price.total_charge.display_value = '₹ ' + this.initialTotalCharge.toString()
            this.fareBreakup.price.total_charge.value = this.initialTotalCharge
            this.promoCodeBody.effective_total_amount = '₹ ' + this.initialTotalCharge.toString()
            this.promoCodeBody.effective_total_amount = this.initialTotalCharge
            this.setPriceAfterPromo(this.promoCodeBody)
         }
       } 
     },
     data () {
       return {
         GSTInfoDialog: false,
         GSTDetailsForm: false,
       }
     },
     methods: {
        ...mapMutations({
            setPriceAfterPromo:types.SET_PRICE_AFTER_PROMO
       }),
       openGSTInfoDialog () {
         this.GSTInfoDialog = true
       },
       openGSTDetailsForm () {
         this.GSTDetailsForm = true
       }
     }
   }
</script>
<style scoped>
   .img_ecash{
     width: 50px;
    margin-left: 5px;
    margin-top: 5px;
  }
   .lh2{
     line-height:2;
   }
   .fs20{
     font-size:20px;
   }
  .hv_info_icon{
    margin-left:2px;
    color: rgb(30, 136, 229);
    font-size:21px;
  }
  .dfb_gst_header{
    font-size: 15px;
    color: black;
  }
  .dfb_header{
    font-size: 16px;
    color: black;
    border-bottom: 1px solid #ccc; padding: 10px 0 15px;
    margin-bottom: 10px; color: #333;
  }
  .dfb_div{
    width:100%;
    margin-bottom:10px;
  }
  .dfb_div_layout{
    padding:10px 0;
  }
  .dfb_cl_grey{
     font-size: 14px;
     color: rgba(0, 0, 0, 0.55);
  }
  .display_value{
    font-size:14px;
    text-align:left;
    color:rgb(158,158,158); width: 40%;
  }
  .dfb_divider{
    border-bottom:1px solid #e0e0e0;
  }
  .pd7{
    padding:7px;
  }
  .pd15{
    padding: 15px 0px;
    }
  .pd10{
    padding: 15px 0px;
  }
  .gst-text{
    width: auto; margin-right: 5px;
  }
  .rel{
    position : relative;
  }
  .pos-rel{
      position: absolute;
        right: 10px;
  }
  .cd_vendor_details > .dfb_div{
            margin-bottom: 65px;
    }
</style>
