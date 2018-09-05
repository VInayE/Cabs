<template>
   <v-layout row wrap class="promo_head">
       <v-flex xs12>
       <p class="fs20">Promo Code </p>
       </v-flex>
       <v-flex xs12>
            <v-layout row wrap>
        <v-flex xs9 class="fs20">
          <v-text-field
              placeholder="ENTER CODE"
              v-model = "promoCode"
              class="promo-input "
              :disabled= "ApplyText == 'REMOVE'"
          ></v-text-field>
        </v-flex>
        <v-flex xs2 class="btn_apply" @click="validatePromoCode" v-bind:class="{ remove_btn: isApply }"><span>{{ApplyText}}</span></v-flex>
      </v-layout>
       </v-flex>
         <v-flex xs12 v-if="errorCondition" class="txt_promoCode">Invalid Promo Code</v-flex>
         <v-flex xs12 v-if="successMessage.length>0" class="txt_promoCode" style="color:rgba(0, 150, 136, 0.99)">{{successMessage}}</v-flex>

    </v-layout>
  </template>
<script>
import { mapGetters, mapMutations } from "vuex";
import * as types from "../../../store/types";
  export default {
    components: {
    },
    data () {
      return {
        promoCode: '',
        successMessage: '',
        errorCondition: false,
        showLoader: false,
        showBothPromoDialog: false,
        bothPromoBody: {},
        ApplyText: 'APPLY',
        isApply:false,
        promocodeObject:{},
        prmTypeVal:'',
        prmAmount:0,
        effectiveTotal:0
      }
    },
    computed: {
    ...mapGetters({
      getCabFareDetails: types.GET_SD_FARE_DETAILS,
      getcabsSRPData: types.GET_SD_SRP_DATA
    }),
    initialTotalCharge() {
      return (
        this.getCabFareDetails.plan.vendor_plans[0].plans[
          this.getCabFareDetails.selectedPlan
        ].security_deposit +
        this.getCabFareDetails.plan.vendor_plans[0].plans[
          this.getCabFareDetails.selectedPlan
        ].doorstep_delivery_amount +
        this.getCabFareDetails.plan.vendor_plans[0].plans[
          this.getCabFareDetails.selectedPlan
        ].total_amount
      );
    }
  },
    methods: {
      validatePromoCode () {
        if(this.ApplyText === 'APPLY') {
            if(this.promoCode.length == 0)
                return false
            let self = this
            let SPnr = JSON.parse(localStorage.getItem('busReviewRequest'))
            let promoCodeBody= {
              "promo_code": this.promoCode.toUpperCase(),
                "context": "REVIEW",
                "total_amount": this.initialTotalCharge,
                "search_id":this.getcabsSRPData.search_id,
                "vendor_id":this.getCabFareDetails.plan.vendor_plans[0].vendor_id
            }
            this.showLoader = true
            Vue.http.headers.common['Content-Type'] = 'application/json'
            Vue.http.headers.common['YT-CHANNEL'] = 'SDPWA'
            Vue.http.headers.common['YT-TENANT-CODE'] = '1795'
            Vue.http.headers.common['X-YT-APP-VERSION'] = '1'
            this.$http.post('v1/promocodes/validate/partial',promoCodeBody).then(function (response) {
                self.showLoader = false
                if (response.status === 200) {
                    self.ApplyText = 'REMOVE'
                    self.isApply = true
                    self.errorCondition = false
                    if(response.body.cash){
                        self.prmTypeVal = 'cash'
                        self.prmAmount = response.body.cash.discount
                        self.successMessage = response.body.cash.message

                            let tempPromoBody = {
                        'cash':self.prmAmount,
                        'promoCode':self.promoCode,
                        'promoType':self.prmTypeVal,
                        'effectiveTotalAmnt': response.body.effective_total_amount
                    }
                         self.$emit('promoCodeApplySuccess',tempPromoBody)
                    }
                    else if(response.body.ecash){
                             self.prmTypeVal = 'Ecash'
                             self.prmAmount = response.body.ecashValue
                             self.successMessage = response.body.promoMsg
                            }

              } else {
                 self.errorCondition = true
                 self.successMessage = ''
              }
          },
          function(response) {
            self.showLoader = false;
            self.successMessage = "";
            self.errorCondition = true;
          }
        );
      } else {
        this.promoCode = "";
        this.ApplyText = "APPLY";
        this.isApply = false;
        this.successMessage = "";
        let tempPromoBody = {
          cash: 0,
          promoCode: this.promoCode,
          promoId: "",
          promoType: ""
        };
        this.$emit("promoCodeApplySuccess", tempPromoBody);
      }
    }
  }
};
</script>
<style scoped>
.txt_promoCode {
  margin-top: 6px;
  color: #f34747;
  font-size: 12px;
}
.btn_apply span{
    padding: 15px;
    position: relative;
    top: 18px;
    background: #EA2330;
    color: #fff;
}
.cd_search_dtls {
  background-color: white;
}
.cd_vendor_details {
  margin-top: 10px;
}
.cl_black {
  color: black;
  font-size: 16px;
  white-space: inherit;
  margin-bottom: 0;
}
.promo-input {
  padding-bottom: 0;
  padding-top: 5px;

}
.uppercase {
  text-transform: uppercase;
}
.uppercase .application--light .input-group input {
  text-transform: uppercase;
}
.remove_btn {
  color: #f34f4f !important;
}
p {
  margin-bottom: 0 !important;
}
.fs20 {
  font-weight: bolder;
  color: black;
}
.promo_head{
  background: #fff;
  margin: 15px 0;
  padding: 10px;
}
</style>
