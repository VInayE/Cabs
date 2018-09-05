<template>
  <div style="margin-top:64px;">
     <v-layout class="cd_search_dtls br-btm ">
         <v-flex xs5 sm5>
           <v-list-tile-title class="txt_dt_params">{{searchParams.pickUpCity}}</v-list-tile-title>
           <v-list-tile-sub-title class="cd_search_date">{{searchParams.pickUpDate}}</v-list-tile-sub-title>
         </v-flex>
         <v-flex xs2 class="text-center">
            <v-icon class="fa_long_icon_exchange" v-if="getcabsSRPData.travel_type !='hourly'">swap_horiz</v-icon>
         </v-flex>
         <v-flex xs5 sm5 class="mgl5 txt-r" v-if="getcabsSRPData.travel_type !='hourly'">
           <v-list-tile-title class="txt_dt_params txt-r">{{searchParams.dropCity}}</v-list-tile-title>
            <v-list-tile-sub-title class="cd_search_date">{{searchParams.returnDate}}</v-list-tile-sub-title>
         </v-flex>
      </v-layout>
      <v-layout class="cd_search_dtls br-btm">
         <v-flex xs12 sm12>
            <v-list-tile-sub-title class="cd_search_date">Pickup Location</v-list-tile-sub-title>
            <v-list-tile-title class="txt_terms">{{searchParams.pickupLocation}}</v-list-tile-title>
         </v-flex>
      </v-layout>
      <v-layout class="cd_search_dtls" v-if="getcabsSRPData.travel_type =='hourly'">
         <v-flex xs12 sm12>
            <v-list-tile-sub-title class="cd_search_date">Rental Package</v-list-tile-sub-title>
            <v-list-tile-title class="txt_terms">{{searchParams.hourly_package_id.display_text}}</v-list-tile-title>
         </v-flex>
      </v-layout>
  </div>
</template>
<script>
   import { mapGetters } from 'vuex'
   import * as types from '../../../store/types'
   export default {
     computed: {
        ...mapGetters({
           getSearchParams: types.GET_SEARCH_PARAMS,
           getcabsSRPData: types.GET_CABS_SRP_DATA
      }),
       searchParams () {
         return this.getSearchParams
       }
     }
   }
</script>
<style scoped>
  .txt_dt_params{
     color: black;
    font-size: 16px;
    font-weight: 500;
  }
  .cd_search_dtls{
      padding:10px;
      background-color:white;
   }
   .cd_search_date{
      font-size: 12px;
      color: rgb(158,158,158);
   }
   .cl_black{
     color:black;
   }
   .fa_long_icon_exchange{
      color: #999;
      height: 40px;
      width: 40px;
      border: 2px solid #999;
      border-radius: 50%;
      font-size: 20px;
      padding: 7px 7px 5px;
   }
   .mgl5{
     margin-left:5px;
   }
    .br-btm {
        border-bottom: 1px solid #ccc;
    }
    .txt-r{
      text-align: right;
    }
</style>

