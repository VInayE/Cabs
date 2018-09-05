
<template>

    <div class="review-cab">
      <div class="fare_breakup-wrapper">
        <div class="fare_breakup-container" v-if="fareBreakup">
        <promo-code @promoCodeApplySuccess="appliDiscount($event)"></promo-code>
          <div class="fare_breakup-body bg-white">
               <div class="fare_breakup-header">
            <slot name="header">
               Fare Details
            </slot>
          </div>
            <!-- <v-layout row wrap pd7 name="body" v-for="(charges,index) in fareBreakup.price.charges" :key="index" >
                <v-flex xs9 sm6  class="font_roboto_400 dfb_cl_grey">
                   {{charges.display_name}}
                </v-flex>
                <v-flex xs3  class="font_roboto_400 display_value">
                   {{charges.display_value}}
                </v-flex>
            </v-layout>
            <v-divider></v-divider> -->
            <v-layout row wrap pd7 name="body">
                <v-flex xs7 sm6 dfb_cl_grey>
                  <span class="fs20">Free Kms</span><br>
                  <span class="fs12">Extra Kms at ₹
                      <vue-numeric read-only separator="," v-model="fareBreakup.plan.vendor_plans[0].plans[fareBreakup.selectedPlan].extra_km_charge"></vue-numeric>/km</span>
                </v-flex>
                <v-flex xs5 display_value class="fs20">
                   Unlimited kms
                </v-flex>
            </v-layout>

            <v-layout row wrap pd7 name="body" v-if="fareBreakup">
                <v-flex xs9 sm6 dfb_cl_grey>
                    <span class="fs20">Basic Fare</span><br>
                   <span class="fs12">inclusive of insurace & taxes</span>
                </v-flex>
                <v-flex xs3 display_value>
                   ₹
                    <vue-numeric read-only separator="," v-model="fareBreakup.plan.vendor_plans[0].plans[fareBreakup.selectedPlan].total_amount"></vue-numeric>
                </v-flex>
            </v-layout>

              <v-layout row wrap pd7 name="body" v-if="fareBreakup">
                <v-flex xs9 sm6 dfb_cl_grey>
                    <span class="fs20">Doorstep Delivery & Pickup</span>
                </v-flex>
                <v-flex xs3 display_value>
                   ₹  <vue-numeric read-only separator="," v-model="fareBreakup.plan.vendor_plans[0].plans[fareBreakup.selectedPlan].doorstep_delivery_amount"></vue-numeric> /km
                </v-flex>
            </v-layout>

            <v-layout row wrap pd7 name="body" v-if="fareBreakup">
                <v-flex xs8 sm6 dfb_cl_grey>
                    <span class="fs20">Refundable Security Deposite</span><br>
                   <p> This security is waived off for you</p>
                </v-flex>
                <v-flex xs4 display_value>
                   ₹ <vue-numeric read-only separator="," v-model="fareBreakup.plan.vendor_plans[0].plans[fareBreakup.selectedPlan].security_deposit"></vue-numeric> /km
                </v-flex>
            </v-layout>
              <v-divider class="total" v-if="fareBreakup"></v-divider>
              <v-layout row wrap pd7 name="body" v-if="fareBreakup">
                <v-flex xs7 sm6 dfb_cl_grey>
                    <span class="fs20">Discount</span>
                </v-flex>
                <v-flex xs5 display_value>
                   - ₹ <vue-numeric read-only separator="," v-model="discountAmnt"></vue-numeric> /km
                </v-flex>
            </v-layout>
            <v-divider class="total" v-if="fareBreakup"></v-divider>
             <v-layout row wrap pd7 name="body">
                <v-flex xs7 sm6 dfb_cl_grey>
                    <span class="fs20">Total Amount</span>
                </v-flex>
                <v-flex xs5 display_value>
                   ₹ <vue-numeric read-only separator="," v-model="totalAmount"></vue-numeric> /km
                </v-flex>
            </v-layout>
             <v-divider class="total" v-if="fareBreakup"></v-divider>
          </div>
          </div>
        </div>
    </div>
</template>
<script>
import { mapGetters,mapMutations } from "vuex";
import * as types from "../../../store/types";
import { adobeAnalyticsPageView } from '../../../helpers/adobeAnalytics';
export default {
  props: ["fareInfoDialog"],
  watch: {
    fareInfoDialog() {
      this.fareDialog = this.fareInfoDialog;
    }
  },
  components: {
        PromoCode : () => import('./promoCode.vue'),
  },
  computed: {
    ...mapGetters({
      getCabFareDetails: types.GET_SD_FARE_DETAILS
    })
  },
  data() {
    return {
      fareBreakup: "",
      fareDialog: true,
      totalAmount:0,
      discountAmnt:0,
      promoApplied:false
    };
  },
  mounted() {
    this.promoApplied = false
    this.fareBreakup = this.getCabFareDetails;
    this.totalAmount = (this.fareBreakup.plan.vendor_plans[0].plans[this.fareBreakup.selectedPlan].security_deposit + this.fareBreakup.plan.vendor_plans[0].plans[this.fareBreakup.selectedPlan].doorstep_delivery_amount + this.fareBreakup.plan.vendor_plans[0].plans[this.fareBreakup.selectedPlan].total_amount)
    let storeTotalAmount1 = {
        totalAmount:this.totalAmount
    }
    this.setSDPayAmount(storeTotalAmount1)
    adobeAnalyticsPageView("yt:self drive:checkout:payment","self drive","app android/app ios/pwa","business","self drive checkout","payment","","")
  },
  methods: {
       ...mapMutations({
      setSDPayAmount: types.SET_SD_PAY_AMOUNT
    }),
    closefareInfoDialog() {
      this.fareDialog = false;
      this.$emit("fareInfoDialogClose", false);
      },
      appliDiscount(data){
                this.discountAmnt = parseInt(data.cash)
                this.totalAmount =  (this.fareBreakup.plan.vendor_plans[0].plans[this.fareBreakup.selectedPlan].security_deposit + this.fareBreakup.plan.vendor_plans[0].plans[this.fareBreakup.selectedPlan].doorstep_delivery_amount + this.fareBreakup.plan.vendor_plans[0].plans[this.fareBreakup.selectedPlan].total_amount) - this.discountAmnt

                let storeTotalAmount = {
                totalAmount:this.totalAmount
                }
                this.setSDPayAmount(storeTotalAmount)
//                this.paxData.promoid = data.promoId
//                this.paxData.promoType = data.promoType
//                this.paxData.promocode = data.promoCode
//                this.promoDataPayment.code = data.promoCode
//                this.promoDataPayment.type = data.promoType
            },
     }
   }
</script>
<style scoped>
.fare_breakup-header {
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
}
.img_ecash {
  width: 50px;
  margin-left: 5px;
  margin-top: 5px;
}
.lh2 {
  line-height: 2;
}
.fs20 {
  font-size: 12px;
  font-weight: bolder;
  color: black;
}

.hv_info_icon {
  margin-left: 2px;
  color: #f34747;
  font-size: 20px;
  margin-bottom: 5px;
}
.dfb_gst_header {
  font-size: 15px;
  color: black;
}
.dfb_header {
  font-size: 16px;
  color: black;
  margin-left: 8px;
}
.dfb_div {
  width: 100%;
  margin-bottom: 10px;
}
.dfb_div_layout {
  padding: 7px;
}
.dfb_cl_grey {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.55);
}
.display_value {
  font-size: 14px;
  text-align: right;
}
.dfb_divider {
  border-bottom: 1px solid #e0e0e0;
}
.pd7 {
  padding: 7px !important;
}
.img_ecash {
  width: 50px;
  margin-left: 5px;
  margin-top: 5px;
}
p {
  font-size: 12px;
  margin-bottom: 0px;
}
    .bg-white {
        background: #fff;
        padding: 10px;
    }
</style>
