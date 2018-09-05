<template>
   <v-layout row wrap class="cd_search_dtls cd_vendor_details">
         <v-flex xs12 sm12>
             <v-list-tile-title class="cl_black">Promo Code</v-list-tile-title>
         </v-flex>
         <v-flex xs8 class="inputHeight uppercase">
             <v-text-field
              label="Promo Code"
              v-model = "promoCode"
              class="promo-input"      
            ></v-text-field>
         </v-flex>
         <v-flex xs4 class="btn_apply" @click="validatePromoCode">APPLY</v-flex>
         <v-flex xs12 v-if="errorCondition" class="txt_promoCode">Invalid Promo Code</v-flex>
         <v-flex xs12 v-if="successMessage.length>0" class="txt_promoCode" style="color:rgba(0, 150, 136, 0.99)">{{successMessage}}</v-flex>
         <loader-view v-if="showLoader"></loader-view>
         <promo-both-view :showBothPromoDialog="showBothPromoDialog"
                          :bothPromoBody="bothPromoBody"
                          @closePromoDialog="selectedPromoOption($event)">
         </promo-both-view>
   </v-layout>
</template>
<script>
  import { mapGetters,mapMutations} from 'vuex'
  import * as types from '../../../store/types'
  export default {
    components: {
      LoaderView : () => import('../../common/loader'),
      PromoBothView :() => import('./promoBothView')
    },
    data () {
      return {
        promoCode: '',
        successMessage: '',
        errorCondition: false,
        showLoader: false,
        showBothPromoDialog: false,
        bothPromoBody: {}
      }  
    },
    computed:{
      ...mapGetters({
          getCabFareDetails:types.GET_CAB_FARE_DETAILS,
          getcabsSRPData:types.GET_CABS_SRP_DATA
      }),
      initialTotalCharge () {
        return this.getCabFareDetails.fare_details.price.total_charge.value
      }
    },
    methods: {
      ...mapMutations({
          setPromoCode:types.SET_PROMO_CODE
      }),
      setPromoCodeData (data) {
         let promoInfo = {
           'promoCode': data.promo_code,
           'promoType': data.cash ? 'CASH':'ECASH'
         }
         this.setPromoCode(promoInfo)
      },
      selectedPromoOption (event) {
        self.setPromoCodeData(event)
        this.errorCondition = false
        this.successMessage = event.cash ? event.cash.message : event.ecash.message
        this.showBothPromoDialog = false
        this.bothPromoBody = {}
        this.$emit('promoCodeApplySuccess',event)
      },
      validatePromoCode () {
        Vue.http.headers.common['YT-CHANNEL'] = 'PWACABS'
        Vue.http.headers.common['YT-TENANT-CODE'] = this.getcabsSRPData.travel_type == 'outstation' ? '1782':'1746'
        Vue.http.headers.common['X-YT-APP-VERSION'] = '1'
        Vue.http.options.emulateJSON = false
        Vue.http.headers.common['Content-Type'] = 'application/json'
        let self = this
        let promoCodeBody= {
          "promo_code": this.promoCode.toUpperCase(),
	        "context": "REVIEW",
	        "total_amount": this.initialTotalCharge,
 	        "search_id":this.getcabsSRPData.search_id,
          "vendor_id":this.getCabFareDetails.vendor_category.id
        }
        this.showLoader = true
        this.$http.post('v1/promocodes/validate/partial',promoCodeBody).then(function (response) {
            self.showLoader = false
            if (response.status === 200) {
             if(response.body.ecash && response.body.cash) {
               self.errorCondition = false
               self.showBothPromoDialog = true
               self.bothPromoBody = response.body
             } else {
               self.errorCondition = false
               self.successMessage = response.body.cash ? response.body.cash.message : response.body.ecash.message
               self.setPromoCodeData(reponse.body)
               self.$emit('promoCodeApplySuccess',response.body)
             } 
          } else {
             self.errorCondition = true
             self.successMessage = false
        }
        },function (response) {
            self.showLoader = false
            self.successMessage = false
            self.errorCondition = true
        });
      }  
    }
  }
</script>
<style scoped>
   .txt_promoCode {
     margin-top:-11px;
     color:#F34747;
     font-size: 12px;
   }
   .btn_apply {
      line-height: 5;
      color: rgb(30, 136, 229);
   }
   .cd_search_dtls{
      padding:10px;
      background-color:white;
   }
   .cd_vendor_details{
     margin-top:10px;
   }
   .cl_black{
     color:black;
     font-size:15px;
     white-space: inherit;
   }
    .promo-input {
    padding-bottom: 0;
    }
    .uppercase{
      text-transform: uppercase;
    }
    .uppercase .application--light .input-group input{
          text-transform: uppercase;
    }
</style>