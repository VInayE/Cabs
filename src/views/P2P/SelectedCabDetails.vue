<template>
  <v-app>
      <div id="detailsMap" style="position:fixed!important;height:100vh;width:100%;"></div> 
      <cabs-home-header></cabs-home-header>
     
      <pick-up-drop-view :pickupLocation="pickupLocation" @selectedPickUpLocation="updatePickUpMarker($event)"></pick-up-drop-view>
      <drop-view :dropLocation="userDropLocation" 
                 @selectedDropOffLocation="selectectedDropLocation($event)">
      </drop-view>
       <v-footer class="pa-3">
       <review-cab-details-booking></review-cab-details-booking>
      </v-footer>
  </v-app>
</template>
<script>
  import { mapGetters } from 'vuex'
  import * as types from '../../store/types'
  import router from '../../router'
  import { reviewGoogleMaps } from '../../helpers/googleMaps'
  import { adobeAnalyticsPageView } from '../../helpers/adobeAnalytics'
  export default {
    computed:{
      ...mapGetters({
        getP2PSearchParams : types.GET_P2P_SEARCH_PARAMS
      })
    },
    components:{
      CabsHomeHeader : () => import('../../components/common/cabsHomeHeader'),
      PickUpDropView : () => import('../../components/P2P/cabsHome/PickUpDropView'),
      DropView : () => import('../../components/P2P/cabsHome/DropView'),
      ReviewCabDetailsBooking : () => import('../../components/P2P/selectedCabDetails/ReviewCabDetailsBooking')
    },
    data () {
      return {
        userDropLocation:'',
        pickupLocation:''
      }
    },
    mounted () {
      if(Object.keys(this.getP2PSearchParams).length > 0){
        reviewGoogleMaps(this.getP2PSearchParams)
        this.userDropLocation = this.getP2PSearchParams.dropLocation
        this.pickupLocation = this.getP2PSearchParams.pickUpLocation
        adobeAnalyticsPageView('yt:cab:checkout:review','cab','business','cab checkout','review','','')
      } else{
         router.push({name:'CabsHomeView',params:{option:'p2p'}})
      }
      
    }
  }  
</script>
<style scoped>
  .pa-3{
    width: 100%;
    bottom: 0px;
    background-color: white;
    position: fixed;
    padding: 0px!important;
    height:auto;
  }
</style>