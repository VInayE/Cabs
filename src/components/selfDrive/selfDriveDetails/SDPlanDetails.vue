<template>
  <div>
      <v-layout class="cd_search_dtls ">
         <v-flex xs12 sm12>
            <v-list-tile-sub-title class="cd_search_date">Pickup Location</v-list-tile-sub-title>
            <v-list-tile-title class="txt_terms">{{searchParams.pickUplocationSelf}}</v-list-tile-title>
            <div id="locationMap"></div> 
         </v-flex>
      </v-layout>
      <!-- <v-layout class="cd_search_dtls" v-if="getCabFareDetails.plan.vendor_plans[0].plans">
         <v-flex xs12 sm12>
            <v-list-tile-sub-title class="cd_search_date">SelfDrive Package</v-list-tile-sub-title>
            <v-list-tile-title class="txt_terms">
                {{getCabFareDetails.plan.vendor_plans[0].plans[getCabFareDetails.selectedPlan].kms_included}},
                {{getCabFareDetails.plan.vendor_plans[0].plans[getCabFareDetails.selectedPlan].security_deposit}}
            </v-list-tile-title>
         </v-flex>

      </v-layout> -->
  </div>
</template>
<script>
   import { mapGetters } from 'vuex'
   import * as types from '../../../store/types'
   import data from '../../../data/googleMapsStyle'    
   export default {
     computed: {
        ...mapGetters({
           getSearchParams: types.GET_SD_SEARCH_PARAMS,
           getCabFareDetails: types.GET_SD_FARE_DETAILS
      }),
       searchParams () {
         return this.getSearchParams
       }
     },
       data() {
        return {
              latitude:'',
              longitude:''
        };
  },
    methods:{
//          getLocation(address) {
//          var geocoder = new google.maps.Geocoder();
//          geocoder.geocode( { 'address': address}, function(results, status) {
//
//          if (status == google.maps.GeocoderStatus.OK) {
//              this.latitude = results[0].geometry.location.lat();
//              this.longitude = results[0].geometry.location.lng();
//              console.log('lat ' ,this.latitude, 'long ' ,this.longitude);
//              } 
//          });
//       },
        mapsDisplay () {  
        var self = this;
        let myLatlng = new google.maps.LatLng(this.getSearchParams.latitude,this.getSearchParams.longitude);
        let mapOptions = {
            center: myLatlng,
            zoom: 15,
            disableDefaultUI: true,
            gestureHandling: 'greedy',
            styles: data.grayStyles
        }
        let map = new google.maps.Map(document.getElementById("locationMap"), mapOptions)
        var innerDiv =document.createElement("div");
        innerDiv.className += " centerMarker";
        var t=map.getDiv();
        t.appendChild(innerDiv)	
        map.addListener('dragend', function () {
          self.getFormattedAddress(this.getCenter().lat(),this.getCenter().lng())
        })
      }   
       },
    mounted(){
          this.mapsDisplay()
   }
//    created(){
//        this.getLocation(this.getSearchParams.pickUplocationSelf)
////        setTimeout(function(){
//            //  this.mapsDisplay()
////          },500);
//        
//    }   
   }
</script>
<style scoped>
    #locationMap{
    height: 20vh;
    width: 100%;
    overflow: hidden;
        margin-top: 20px;
 }
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

