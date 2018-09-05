<template>
  <v-app class="cd_bg">
      <cabs-details-header-view></cabs-details-header-view>
      <cabs-details-search-params></cabs-details-search-params>
      <cabs-policy-view :selectedCabVendor="cabsFareDetails.vendor" 
                        :vendorCategory="cabsFareDetails.vendor_category" 
                        :categoryImages="cabsFareDetails.yatra_category.yatra_category_images"
                        @promoSuccess="promoCodeBody = $event"
                       >
      </cabs-policy-view>
      <v-layout class="cd_vendor_details cd_search_dtls">
          <cab-details-fare-breakup-view :fareBreakup="cabsFareDetails.fare_details"
                                         :promoCodeBody="promoCodeBody"></cab-details-fare-breakup-view>
      </v-layout>
      <div class="dock-section">
        <div class="text-section">
          <span class="txt-amount">Total Amount</span>
          <span class="total-amount">{{cabsFareDetails.fare_details.price.advance_charge ? cabsFareDetails.fare_details.price.advance_charge.display_value: ''}} {{cabsFareDetails.fare_details.price.advance_percentage?'('+cabsFareDetails.fare_details.price.advance_percentage.display_value+')':''}}</span>
        </div>
          <div class="btn-proceed">
            <v-btn block secondary class="bg-red" @click.stop="createOrder">
               PROCEED
            </v-btn>
          </div>
      </div>
     
      <cab-login-block :openLoginDialog="openLoginDialog" @closeLoginDialog="openLoginDialog = false"></cab-login-block>   
      <loader-view v-if="showLoader"></loader-view>   
  </v-app>
</template>
<script>
  import router from '../../router'
  import { mapGetters,mapMutations } from 'vuex'
  import * as types from '../../store/types'
  import { adobeAnalyticsPageView } from '../../helpers/adobeAnalytics'
  export default {
    data () {
     return {
       openLoginDialog: false,
         openPaySwiftPannel: true,
         showLoader: false,
         promoCodeBody: {}
       }
    },
    components: {
      CabDetailsFareBreakupView : () => import('../../components/Rental/cabsDetails/CabDetailsFareBreakupView'),
      CabsDetailsSearchParams : () => import('../../components/Rental/cabsDetails/CabsDetailsSearchParams'),
      CabsPolicyView : () => import('../../components/Rental/cabsDetails/CabsPolicyView'),
      CabsDetailsHeaderView : () => import('../../components/Rental/cabsDetails/CabsDetailsHeaderView'),
      CabLoginBlock : () => import('../../components/cabsLoginPage/cabLoginBlock'),
      CabPaySwift : () => import('../../views/CabPaySwift'),
      LoaderView: () => import('../../components/common/loader')
    },
    computed: {
      ...mapGetters({
           getCabFareDetails: types.GET_CAB_FARE_DETAILS,
           getcabsSRPData: types.GET_CABS_SRP_DATA,
           getGSTDetailsForm: types.GET_GST_DETAILS,
           getUserInfo: types.GET_USER_INFO,
      }),
      cabsFareDetails () {
        return this.getCabFareDetails
      }
    },
    created () {
      adobeAnalyticsPageView(this.getcabsSRPData.travel_type == 'outstation'? 'yt:outstation cab:checkout:review' : 'yt:hourly cab:checkout:review',this.getcabsSRPData.travel_type == 'outstation' ? 'outstation cab': 'hourly cab','business', this.getcabsSRPData.travel_type == 'outstation' ? 'outstation cab checkout': 'hourly cab checkout','review','','')  
    },
    methods: {
        ...mapMutations({
           setUserInfo:types.SET_USER_INFO
        }),
        redirectToPayment(ssoToken){
              if(this.getCabFareDetails.fare_details.price.advance_charge) {
                  this.showLoader = false
                  router.push({name:'PaySwift'})
              } else {
                 let createOrderDetails ={
                  'travel_type': this.getcabsSRPData.travel_type,
                  'search_id': this.getcabsSRPData.search_id,
                  'fare_id': this.getCabFareDetails.fare_id,
                  'gst_details':this.getGSTDetailsForm.gst_details.address !=''? this.getGSTDetailsForm.gst_details : null
                }
                let self = this 
                Vue.http.headers.common['Content-Type'] = 'application/json';
                Vue.http.headers.common['YT-CHANNEL'] = 'CABSPWA'
                Vue.http.headers.common['YT-TENANT-CODE'] = this.getcabsSRPData.travel_type == 'outstation' ? '1782':'1746'
                Vue.http.options.emulateJSON = false
                this.$http.post('v1/orders',createOrderDetails).then(function (response) {
                    self.showLoader = false
                    if(response.status == 200) {
                        router.push({name: 'CabsConfirmation'})
                    }
                  }, function (response) {
                      self.showLoader = false
                });
              }
        },
        createOrder() {
            let userLoginParams= {
                includeOptionalParams:true,
                channel:'B2C',
                productId:'CabsPWA'
            }
            this.showLoader = true
            let self = this
            if(Object.keys(this.getUserInfo).length != 0) {
                Vue.http.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
                Vue.http.options.emulateJSON = true;
                this.$http.post('/social/user/userProfile.htm',userLoginParams).then(function (response) {
                  if(response.body.status == 'FAIL') {
                      self.showLoader = false                
                      self.openLoginDialog = true
                  } else{
                      self.setUserInfo(response.body.responseData.userInfo)
                      self.openLoginDialog = false
                      self.redirectToPayment(response.body.ssoToken)
                  }
                }, function (response) {
                  self.showLoader = false
              });
            } else{
              self.redirectToPayment(undefined)
            }
      }
    }
  }
</script>

<style scoped>
    .cd_vendor_details{
      margin-top:10px;
    }
    p{
      margin-bottom:0px!important;
    }
   .cd_search_date{
     font-size: 14px;
     color: rgba(0, 0, 0, 0.55);
   }
   .cd_search_dtls{
      padding:10px;
      background-color:white;
   }
   .cd_bg{
     background-color:#efefef;
   }
    .pay-btn {
    background-color: transparent !important;
    color: #fff !important;
    box-shadow: none;
    height: 20px;
}
.dock-section{
    background: #333; position: fixed; bottom:0;
    padding: 5px 10px; width: 100%;
}
.text-section{
  width: 60%; float: left; padding-top: 5px;
}
.btn-proceed{
  width: 40%; float: left;  text-transform: uppercase;
}
.btn-proceed  .btn--raised{
  height: 45px;
  width: auto;
  float: right;
}
.btn-proceed .btn--raised .btn__content{
  font-size: 16px;
    font-weight: 500;
}
.txt-amount{
  color: #9E9E9E; font-size: 14px;  text-transform: uppercase; display: block; padding-bottom: 5px;
}
.total-amount{
  color: #fff; opacity: 1; font-size: 14px;
}
</style>