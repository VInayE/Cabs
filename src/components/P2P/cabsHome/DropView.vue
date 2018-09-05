<template>
 <div style="width:100%;"> 
  <v-layout row wrap class="pickup_drop_header" v-bind:class="{ p2p_details_drop: $route.name == 'P2PCabDetails' }"  @click.stop="openPickUpDialog">
    <v-flex xs1 class="padding_left_14"> 
       <div class="pickup_icon"></div>
    </v-flex>
    <v-flex xs10 class="padding_left_20">
      <v-layout row wrap class="txt_pickup">
         Dropoff Location
      </v-layout>
      <v-layout row wrap class="pickup_location">
        {{dropLocationText}}
      </v-layout>
    </v-flex>
    <drop-location-search v-if=" $route.name != 'P2PCabDetails' && pickUpDialog " :pickUpDialog="pickUpDialog" 
                          :pickUpDialogOption="'p2pDropSearch'"  
                          @searchedDropofflocation="pickupSelected($event)" 
                          @selectedPlace="pickupSelected($event)"
                          @closeLocationPopUp="pickUpDialog=false">
   </drop-location-search>
   </v-layout>
 </div> 
</template>
<script>
   import router from '../../../router'
   import {eventBus} from '../../../utils/eventBus'
   export default {
     props:{
       dropLocation:{
         type: String,
         required: true
       }
     },
     components:{
        DropLocationSearch : () => import('../../common/DropLocationSearch')
     },
     watch: {
       dropLocation () {
           this.dropLocationText = this.dropLocation
       }
     },
     data () {
       return {
         dropLocationText: this.$route.name != 'P2PCabDetails'? 'Choose dropoff location': this.dropLocation,
         pickUpDialog: false ,
         selectedLocation:'',
         searchedDropLocation:{
          'locationName':'',
          'latitude':'',
          'longitude':''  
        }
       }  
     },
     created () {
       this.dropLocationText = this.dropLocation
       eventBus.$on('openDropoffLocation',(data) => {
        event.stopPropagation()
        this.openPickUpDialog()
      })
     },
     methods:{
       openPickUpDialog () {
           this.pickUpDialog =true;
       },
       pickupSelected (event) {
         this.dropLocationText = event.address  
         this.searchedDropLocation.locationName = event.address
         this.searchedDropLocation.latitude = event.latitude
         this.searchedDropLocation.longitude = event.longitude
         this.pickUpDialog = false
         this.$emit('selectedDropOffLocation',this.searchedDropLocation)
       }  
     }

   }
</script>
<style scoped>
 .p2p_details_drop{
   top:110px!important;
 }
  .pickup_location{
    font-size: 12px;
    color: grey;
    margin-top: 2px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 100%; 
  }
  .pickup_drop_header{
    box-shadow:0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
    position: fixed;
    top: 165px;
    width: 95%;
    background-color: white;
    margin: 0px;
    height:50px;
    padding: 5px;
    border-top:1px solid #ddd;
    margin-left:8px;
  }
  .pickup_icon{
    height: 10px;
    width: 10px;
    border: 2px solid #EA2330;
    border-radius: 50%;
    margin-top: 15px;
    margin-left: 3px;
  }
  .txt_pickup{
     font-size:11px;
     color: #EA2330;
  }
 
</style>