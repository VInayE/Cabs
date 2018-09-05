<template>
   <div class="review-cab ">
       <v-layout row wrap class="imgcar br-btm" >
               <v-flex xs3 class="car_img">
                   <img v-bind:src="img_url" class="img-resp"/>
               </v-flex>
               <v-flex xs6 class="head_detail">
                   <div class="car_model">{{vendor.make}}{{vendor.model}}</div>
                    <div class="car_detail">
                        {{vendor.seat_capacity}} seats | {{vendor.fuel_type}} | {{vendor.transmission_type}}
                    </div>
                </v-flex>
                <v-flex xs3>
                  <img v-bind:src="vendorBy.image_url" class="img-resp"/>
                </v-flex>
       </v-layout>
        <div class="sd_detail_bg">
            <div class="date_time_details br-btm ">
              <v-layout>
                <v-flex xs5>
                  Start Date
                 <p> {{toStorePDate}}, {{ searchParams.pickUpTime}} </p>
                </v-flex>
                <v-flex xs2></v-flex>
                <v-flex xs5 class="txt-r">
                  End Date
                  <p > {{toStoreDDate}}, {{ searchParams.dropTime}} </p>
                </v-flex>
              </v-layout>
            </div>
            <!-- <p class="booking_ref_no"> {{booking_ref}} </p>
            <div class="sd_reach">
                <span class="reach_call"> Call </span>
                <span class="reach_email"> Email </span>
                <span class="reach_cancel" @click="navigateToSRP"> Cancel </span>
            </div> -->
        </div>
  </div>
</template>
<script>
import router from '../../../router'
import { mapGetters, mapMutations } from 'vuex'
import * as types from '../../../store/types'
import { adobeAnalyticsPageView } from '../../../helpers/adobeAnalytics'
export default {
    data () {
        return {
            toStorePDate : '',
            toStoreDDate : '',
            booking_ref : '',
            img_url : '',
            vendor: '',
            vendorBy:''
       }
    },
    mounted(){
      adobeAnalyticsPageView("yt:self drive:book ride:start date","self drive","app android/app ios/pwa","business","self drive book a ride","start date","")
    },
    computed: {
      ...mapGetters({
          getSearchParams: types.GET_SD_SEARCH_PARAMS,
          getCabFareDetails: types.GET_SD_FARE_DETAILS,
          getcabsSRPData: types.GET_SD_SRP_DATA
      }),
      searchParams () {
        let strrePDate = this.getSearchParams.pickUpDate
        this.toStorePDate = strrePDate.substr(strrePDate.indexOf(",") + 2)
        let strreDDate = this.getSearchParams.returnDate
        this.toStoreDDate = strreDDate.substr(strreDDate.indexOf(",") + 2)
        return this.getSearchParams
      }
    },
    mounted () {
        this.booking_ref = this.$route.params.option
        this.img_url = this.getCabFareDetails.plan.vendor_plans[0].vehicle_image_url
        this.vendor =  this.getCabFareDetails.plan.vehicle
        this.vendorBy = this.getcabsSRPData.vendors[0]

    },
    methods : {
        navigateToSRP () {
            router.push({name:'SelfDriveSRP'})
        }
    }
}
</script>

<style scoped>
    .date_time_details .car_img {
        width : 100%;
    }
    .review-cab {
      padding: 10px;
      background-color: #fff;

      margin-top: 15px;

    }
    .head_detail{

      padding-left: 15px;
    }
    .head_detail .car_model{
      font-size: 14px;
      font-weight: bold;
    }
    .head_detail .car_detail{
      font-size: 10px;

    }
    .date_time_details{
      font-size: 13px;
      padding: 10px;
}
    .br-btm {
        border-bottom: 1px solid #ccc;
    }
    .car_img {
      position: relative;
      top: -6px;
    }

</style>
