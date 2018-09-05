<template>
    <v-layout row  wrap>
     <v-flex xs12>
       <v-toolbar class="white fixed_header cd_fixed_header toolbar">
         <v-layout row wrap class="layout_header">
           <v-flex xs1 class="header_arrow_back" @click="navigateToHome">
              <v-icon>arrow_back</v-icon>
           </v-flex>
           <v-flex xs9>
              <v-flex xs12 class="header_title_txt">Booking Details</v-flex>
            </v-flex>
         </v-layout>
       </v-toolbar>
     </v-flex>


      <v-flex xs12 class="confirmation" v-if="confirmationData!=null">
      <v-layout row  wrap>
        <v-flex xs12 class="head-section">
            <v-flex xs2 class="fl">
            <img src="/pwa/cabs/cabs/img/icons/success.jpg">
              </v-flex>
            <v-flex xs10 >
              <v-flex xs12> Awaiting cab provider confirmation</v-flex>
              <v-flex xs12>yatra booking Ref No: {{confirmationData.order.id}}</v-flex>
            </v-flex>
        </v-flex>

      </v-layout>
        <v-layout wrap class="confirmation-wrapper">
          <!--  <v-flex xs-12 style="font-family:Roboto-500;padding-bottom:10px">
               Awaiting cab provider confirmation
            </v-flex>
            <v-flex xs-12 yellow-bg style="padding-bottom:10px">
                 yatra booking Ref No: {{confirmationData.order.id}}
            </v-flex> -->

            <v-flex xs-12 v-if="confirmationData.order.payment_description.display_text != null" style="font-family:Roboto-400padding-top:10px;">
                {{confirmationData.order.payment_description.display_text}}
            </v-flex>
            <v-flex xs-12  v-if="confirmationData.order.payment_description.disclaimer != null" brd-btm style="padding-bottom:20px;color:rgb(85,85,85);font-family:Roboto-400">
                {{confirmationData.order.payment_description.disclaimer}}
            </v-flex>
            <v-flex xs-12 brd-btm style="border-top: 1px solid #efefef;padding-top: 20px;padding-bottom:20px;">
                <div style="font-family:Roboto-500;margin-bottom:5px;">Booking details has been sent to:</div>

                <div style="font-family:Roboto-400;margin-bottom:5px;">
                    <span><img src="/pwa/cabs/cabs/img/icons/call-icon.jpg"></span>
                    <span class="pos-rel">{{confirmationData.order.customer.mobile_number}}</span>
                </div>

                <div style="font-family:Roboto-400;">
                    <span><img src="/pwa/cabs/cabs/img/icons/mail-icon.jpg"></span>
                    <span class="pos-rel">{{confirmationData.order.customer.email_id}}</span>
                </div>
            </v-flex>
            <v-layout row brd-btm wrap style="border-top: 1px solid #efefef;padding-top: 20px;padding-bottom:20px;">
                <v-flex xs12 style="padding-bottom:20px;">
                    <img style="width:75px;margin-right:20px" :src="confirmationData.order.vendor.image_url">
                     <span style="font-family:Roboto-500">{{confirmationData.order.vendor.display_name}}</span>
                </v-flex>
                <v-flex xs6>
                    <v-layout row wrap class="txt-lght">Vechicle Details</v-layout>
                    <v-layout row wrap>{{confirmationData.order.vehicle.display_text}}</v-layout>
                </v-flex>
                 <v-flex xs6 class="text-right" v-if="confirmationData.order.drop_city != undefined && confirmationData.order.drop_city != null">
                    <v-layout row wrap class="txt-lght">
                        <v-flex xs12>
                        Dropoff City
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap v-if="confirmationData.order.drop_city != undefined && confirmationData.order.drop_city != null">
                          <v-flex xs12>
                        {{confirmationData.order.drop_city.name}}
                        </v-flex>
                    </v-layout>
                </v-flex>
                 <v-flex xs12 style="margin-top:10px;">
                    <v-layout row wrap class="txt-lght">Pickup City</v-layout>
                    <v-layout row wrap>{{confirmationData.order.pickup_city.name}}</v-layout>
                </v-flex>
                 <v-flex xs12 style="margin-top:10px;">
                    <v-layout row wrap class="txt-lght">Pickup Location</v-layout>
                    <v-layout row wrap>{{confirmationData.order.start.address}}</v-layout>
                </v-flex>

                 <v-flex xs12 style="margin-top:10px;">
                    <v-layout row wrap class="txt-lght">Pickup Date & time</v-layout>
                    <v-layout row wrap> {{pickupDate}}</v-layout>
                </v-flex>

                 <v-flex layout row style="margin-top: 10px;" v-if="confirmationData.order.trip_type != undefined && confirmationData.order.trip_type != null && confirmationData.order.travel_type=='outstation' || confirmationData.order.travel_type=='hourly' ">
                    <v-flex xs4 class="" v-if="confirmationData.order.travel_type != 'hourly'">
                     <v-layout row wrap class="txt-lght">{{confirmationData.order.travel_type}} Type</v-layout>
                     <v-layout row wrap>{{confirmationData.order.trip_type}}</v-layout>
                    </v-flex>
                    <v-flex xs4 class="" v-if="confirmationData.order.travel_type != 'hourly'">
                       <v-layout row wrap class="txt-lght">Duration</v-layout>
                       <v-layout row wrap>{{confirmationData.order.duration.display_text}}</v-layout>
                    </v-flex>
                     <v-flex xs4 class="" v-else-if="confirmationData.order.travel_type == 'hourly'">
                       <v-layout row wrap class="txt-lght">Rental Package</v-layout>
                       <v-layout row wrap>{{confirmationData.order.package.display_text}}</v-layout>
                    </v-flex>
                    <v-flex xs4 class="">
                       <v-layout row wrap class="txt-lght">No of Passengers</v-layout>
                    <v-layout row wrap>{{confirmationData.order.seats}}</v-layout>
                    </v-flex>
                </v-flex>
            </v-layout>
            <v-layout row wrap class="driver-details">
                <v-flex xs12 style="margin-top:10px;">
                    <v-layout row wrap  class="txt-lght">Driver Details</v-layout>
                    <v-layout row wrap>{{confirmationData.order.driver.display_text}}</v-layout>
                </v-flex>
            </v-layout>
            <v-layout row wrap class="suport-block">
               <v-flex xs12 style="margin-top:5px;">
                    <v-layout row wrap class="sub-head">Support</v-layout>
                      <v-flex xs12>
                        <v-layout row wrap class="txt-lght">Email</v-layout>
                        <v-layout row wrap class="txt-lght"><a :href="'mailto:'+ confirmationData.order.vendor.support.email_id" class="link">{{confirmationData.order.vendor.support.email_id}}</a></v-layout>
                     </v-flex>
                      <v-flex xs12 class="mt15">
                          <v-layout row wrap class="txt-lght">Call</v-layout>
                        <v-layout row wrap class="txt-lght"><a :href="'tel:'+confirmationData.order.vendor.support.mobile_number" class="link">{{confirmationData.order.vendor.support.mobile_number}}</a></v-layout>
                    </v-flex>
                </v-flex>
            </v-layout>
        </v-layout>
    </v-flex>
    <loader-view v-if="ajaxLoading"></loader-view>
    <confirmation-error :showConfirmationDialog="showConfirmationDialog" :errorMessage="errorMessage"></confirmation-error>
   </v-layout>
</template>
<script>
  import router from '../../router'
  import LoaderView from '../../components/common/loader'
  import { adobeAnalyticsPageView } from '../helpers/adobeAnalytics'
  var moment = require('moment')
  export default {
    data() {
      return {
        confirmationData : null,
        ajaxLoading:false,
        pickupDate:null,
        showConfirmationDialog:false,
        errorMessage:''
      }
    },
    components:{
      LoaderView,
      confirmationError : () => import('../../components/cabsPayment/ConfirmationError')
    },
    computed:{
    ...mapGetters({
        getcabsSRPData: types.GET_CABS_SRP_DATA
    })
  },
    methods:{
      navigateToHome(){
        router.push({name:'CabsHomeView',params:{option:'rental'}})
      }
    },
    created () {
      let self = this
      var queryReader = {
                            cache: {},
                            get: function (ji, custom) {
                                if (this.cache[ji]) {
                                    return this.cache[ji];
                                };
                                var query = (typeof (custom) == "undefined") ? window.location.search.substring(1) : custom;
                                var hu = query;
                                var gy = hu.split("&");
                                for (let i = 0; i < gy.length; i++) {
                                    var ft = gy[i].split("=");
                                    if (ft[0] == ji) {
                                        var val = decodeURIComponent(ft[1].toString());
                                        this.cache[ji] = val;
                                        return val;
                                    }
                                }
                                return "";
                            }
                        }
      if(queryReader.get("suc")=="true"){
         Vue.http.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
         Vue.http.options.emulateJSON = true;
         this.$http.get(`v1/orders/${queryReader.get("superPnr")}`).then(function (response) {
            var time = new Date(response.data.order.start_time).toLocaleString();
            time=time.split(',')
            time = time[1].split(' ')
            time = time[1].split(':')[0] +':'+ time[1].split(':')[1] + " " +time[2]
            self.pickupDate = time
            self.confirmationData = response.data
            self.ajaxLoading = false
         }).catch(function (error) {
            self.ajaxLoading = false
            this.errorMessage = queryReader.get("errorMessage")
            this.showConfirmationDialog=true
         });
      }else{
        self.ajaxLoading = false
            this.errorMessage = queryReader.get("errorMessage")
            this.showConfirmationDialog=true
            router.push({name:'CabsHomeView',params:{option:'rental'}})
      }
    },
    mounted(){
          if(this.getcabsSRPData.cabType == 'selfDrive'){
            adobeAnalyticsPageView("yt:self drive:checkout:booking success","self drive","app android/app ios/pwa","business","self drive checkout","booking success","","")

          }
    }
  }


</script>

<style scoped="">
    .confirmation-page {
        padding: 10px;
    }
    .yellow-bg {
        background:  rgb(255,242,197);
        font-size: 13px;
        padding: 5px;
    }
    .review_booking_header{
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
  }
  .p2p_details{
    margin-top:10px!important;
  }
  /*.fixed_header {
    box-shadow:none!important;
  }*/
  .layout_header{
    margin:0px!important;
    width:100%;
    position:fixed;top:0px;
    background-color:#fff;
    z-index: 99999;
      padding: 7px 0 0 5px;
  }
  .help_icon{
    color:#333;
    margin-top:10px;
  }
  .header_arrow_back > .icon{
    color:rgb(66, 66, 66)!important;
  }
  .header_title_txt{
    font-size:18px;
    font-weight:500;
    margin-top:10px;

  }

  .header_subtitle_txt{
    font-size:12px!important;
    color:rgb(158, 158, 158)!important;
  }

.header_arrow_back{
    margin-left:0px!important;
    margin-right:12px!important;
    padding:12px!important;
    font-size:24px!important;
    margin-top:-10px;
    padding-right:0px!important;
    padding-left:10px!important;
  }

  .txt-lght{
    color: #666;
    font-size: 12px;
    font-family:Roboto-500;
    text-transform: capitalize;
  }
  .text-right{
    text-align: right;
  }
  .confirmation-wrapper{
      padding: 10px;
      font-family:Roboto-500
  }
  .fl{
    float: left;
  }
  .head-section{
    background: #fffde7;
    padding: 10px;
  }
  .sub-head{
    font-size: 16px; color: #333;
    padding-bottom: 15px;
  }
  .mt15{
    margin-top: 15px;
  }
  .link{
    text-decoration: none;
    color: #333;
    font-size: 14px;
  }
  .link:hover{
    color: #666;
    cursor: pointer;
  }
  .pos-rel{
    position: relative;
    top: -8px;
    left: 10px;
  }
.driver-details{
        border-top:1px solid #efefef;padding-top:20px;padding-bottom:20px
}
.support-block{
    border-top:1px solid #efefef;padding-top:10px;padding-bottom:10px;
}
</style>
