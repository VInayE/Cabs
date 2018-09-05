<template>
  <v-layout row wrap class="rentalHome">
    <v-flex xs12 class="rentalType">
     <v-radio-group v-model="selectedTripOption" row>
      <v-flex xs4>
          <v-layout row>
            <v-flex xs2>
              <v-radio value="oneway" color="primary"></v-radio>
            </v-flex>
            <v-flex xs10 class="selectionRadio" @click="selectedTripOption = 'oneway'">
              <v-flex xs12 class="fs12" v-bind:class="{ radio_active: selectedTripOption == 'oneway'}">ONE WAY</v-flex>
              <v-flex xs12 class="fs10">OUTSTATION</v-flex>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs4>
          <v-layout row>
            <v-flex xs2>
              <v-radio value="roundtrip" color="primary"></v-radio>
            </v-flex>
            <v-flex xs10 class="selectionRadio" @click="selectedTripOption = 'roundtrip'">
              <v-flex xs12 class="fs12" v-bind:class="{ radio_active: selectedTripOption == 'roundtrip'}">ROUND TRIP</v-flex>
              <v-flex xs12 class="fs10">OUTSTATION</v-flex>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs4>
          <v-layout row>
            <v-flex xs2>
              <v-radio value="local" color="primary"></v-radio>
            </v-flex>
            <v-flex xs10 class="selectionRadio" @click="selectedTripOption = 'local'">
              <v-flex xs12 class="fs12" v-bind:class="{ radio_active: selectedTripOption == 'local'}">LOCAL</v-flex>
              <v-flex xs12 class="fs10">HOURLY BASIS</v-flex>
            </v-flex>
          </v-layout>
        </v-flex>
     </v-radio-group>
     <v-divider></v-divider>
    </v-flex>
    <v-flex xs12 class="rentalType">
       <cab-trip-type :selectedOption="selectedTripOption"></cab-trip-type> 
    </v-flex>
  </v-layout>
</template>
<script>
  import {adobeAnalyticsPageView} from '../../../helpers/adobeAnalytics'
  export default {
    components:{
      CabTripType:()=> import('./cabTripType')
    },
    data () {
      return {
         selectedTripOption:'roundtrip',
         Mandatory: true
      }
    },
    watch:{
      selectedTripOption () {
        adobeAnalyticsPageView(this.selectedTripOption == 'local' ? 'yt:hourly cab:book ride':'yt:outstation cab:book ride',this.selectedTripOption == 'local' ? 'hourly cab':'outstation cab','business',this.selectedTripOption == 'local' ? 'outstation cab book ride':'','','','')
      }
    }
  }
</script>
<style scoped>
  .radio_active{
    font-weight:bold;
  }
  .rentalType{
    background-color:white;
  }
  .fs12{
    font-size:12px;
    color:rgba(0,0,0,.87)
  }
  .fs10{
    font-size:9px;
  }
  .selectionRadio{
    margin-left: 10px;
    margin-top: 0px;
    margin-bottom:10px;
    color:#bdbdbd;  
  }
  .rentalHome {
    padding:10px;
    background-color:white;
  }

</style>