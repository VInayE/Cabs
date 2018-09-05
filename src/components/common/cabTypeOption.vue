<template>
  <v-tabs dark fixed centered :scrollable="false" v-model="active" class="cab_type_tab">
    <v-tabs-bar class="white cab_type_tabs" >
      <v-tabs-item href="#tab-p2p">
        POINT TO POINT
      </v-tabs-item>
      	<v-tabs-item href="#tab-rentals">
        	RENTALS
      	</v-tabs-item>
		<v-tabs-item href="#tab-selfDrive">
			SELF DRIVE
		</v-tabs-item>
    </v-tabs-bar>
    <v-tabs-items>
      <v-tabs-content id="tab-p2p">
        <cabs-home-map></cabs-home-map>
      </v-tabs-content>
      <v-tabs-content id="tab-selfDrive">
        <self-cab-search-option :selectedOption="selectedOption"></self-cab-search-option>
      </v-tabs-content>
      <v-tabs-content id="tab-rentals">
       <rental-cab-search-option></rental-cab-search-option>
      </v-tabs-content>
    </v-tabs-items>
  </v-tabs>
</template>
<script>
  import {eventBus} from '../../utils/eventBus'
  import router from '../../router'
  import {adobeAnalyticsPageView} from '../../helpers/adobeAnalytics'
  export default {
    components:{
      CabsHomeMap : () => import('../P2P/cabsHome/cabsHomeMap'),
      RentalCabSearchOption : () => import('../Rental/searchView/rentalCabSearchOption'),
      SelfCabSearchOption : () => import('../selfDrive/searchView/selfDriveCabSearchOption')
    },
    data () {
      return {
        selectedOption : '',
        active:this.$route.params.option == 'p2p'? 'tab-p2p' : this.$route.params.option =='rental'? 'tab-rentals':'tab-selfDrive'
      }
    },
    watch :{
      active () {
       eventBus.homeViewHeaderText(this.active)
       if(this.active == 'tab-p2p') {
          router.push({name:'CabsHomeView',params:{option:'p2p'}})
       } else if(this.active == 'tab-selfDrive') {
          adobeAnalyticsPageView('yt:cab:self drive','cab','business','self drive','','','')
          router.push({name:'CabsHomeView',params:{option:'selfDrive'}})
       }
       else {
          adobeAnalyticsPageView('yt:cab:book ride','cab','business','cab book ride','','','')
          router.push({name:'CabsHomeView',params:{option:'rental'}})
       }
      }
    }
  }  
</script>
<style>
#tab-rentals{
	height: 100vh;
	background: #fff;
}
#tab-selfDrive{
	height: 100vh;
	background: #fff;
}
#tab-p2p{
	height:100vh;
	position:absolute;
	transition:unset!important;
}
</style>
