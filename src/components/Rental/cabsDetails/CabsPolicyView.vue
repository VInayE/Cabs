<template>
  <div>
    <v-layout class="cd_search_dtls cd_vendor_details">
         <v-flex xs4 sm4>
            <img :src="categoryImages.url" class="hv_image"/>
         </v-flex>
         <v-flex xs7 sm8 offset-xs1>
            <v-list-tile-title class="cl_black">{{vendorCategory.display_name}}</v-list-tile-title>
            <v-list-tile-sub-title class="cd_search_date cgrey">{{vendorCategory.category_info}}</v-list-tile-sub-title>
         </v-flex>
      </v-layout>
      <v-layout class="cd_search_dtls">
         <v-flex xs4 sm4>
            <img :src="selectedCabVendor.logo_url" class="hv_image"/>
         </v-flex>
         <v-flex xs5 offset-xs1 class="txt_blue" sm3 @click="openRefundPolicy">
             REFUND POLICY
         </v-flex>
      </v-layout>
      <promo-code-view @promoCodeApplySuccess="promoApplySuccess($event)"></promo-code-view>
      <v-layout class="cd_search_dtls cd_vendor_details">
         <v-flex xs12 sm12>
             <v-list-tile-title class="cl_black">Terms and Conditions</v-list-tile-title>
             <v-list-tile-title class="txt_terms">Please read the Terms and Conditions of <span class="txt_blue txt_deco" @click="openYatraPolicy(yatraPolicyUrl)">Yatra.com</span> and <span class="txt_deco txt_blue" @click="openTermsPolicy(selectedCabVendor.terms_url)">{{selectedCabVendor.display_name}}</span></v-list-tile-title>
         </v-flex>
      </v-layout>
      <refund-policy-view :dialog="dialog" :refundPolicy="selectedCabVendor.refund_policy_url" @refundPolicyDialogClose="dialog = $event"></refund-policy-view>
      <vendor-yatra-policy-view :policyDialog="policyDialog" :termsURL="openSelectedUrl" @termsDialogClose="policyDialog = $event"></vendor-yatra-policy-view>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import * as types from '../../../store/types'
  export default {
    props: ['selectedCabVendor', 'vendorCategory', 'categoryImages'],
    components: {
      RefundPolicyView : () => import('./RefundPolicyView'),
      VendorYatraPolicyView : () => import('./VendorYatraPolicyView'),
      PromoCodeView : () => import('./PromoCodeView')
    },
    computed:{
      ...mapGetters({
          getcabsSRPData:types.GET_CABS_SRP_DATA
      })
    },
    data () {
      return {
        dialog: false,
        policyDialog: false,
        openSelectedUrl: ''
      }
    },
    methods: {
      promoApplySuccess (event) {
        this.$emit('promoSuccess',event)
      },
      openTermsPolicy (url) {
        this.openSelectedUrl = url
        this.policyDialog = true
      },
      openYatraPolicy(url){
        window.open(this.getcabsSRPData.yatra_terms_url, '_blank')
      },
      openRefundPolicy () {
        this.dialog = true
      }
    }
  }
</script>
<style scoped>
    
    .txt_deco{
      text-decoration: underline;
    }
   .cl_black{
     color:black;
     font-size:15px;
       white-space: inherit;
   }
  .hv_image{
     width:100%;
     height:auto;
   }
  .cd_vendor_details{
     margin-top:10px;
   }
  .cd_search_dtls{
      padding:10px;
      background-color:white;
   }
    .cgrey {
        color: rgba(0, 0, 0, 0.55)
    }
</style>
