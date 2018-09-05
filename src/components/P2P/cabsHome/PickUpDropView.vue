<template>
 <div style="width:100%;"> 
  <v-layout row wrap class="pickup_drop_header" v-bind:class="{ p2p_details_pickup: $route.name == 'P2PCabDetails' }" @click.stop="openPickUpDialog">
    <v-flex xs1 class="padding_left_14"> 
       <div class="pickup_icon"></div>
    </v-flex>
    <v-flex xs10 class="padding_left_20">
      <v-layout row wrap class="txt_pickup">
         Pickup Location
      </v-layout>
      <v-layout row wrap class="pickup_location">
        {{pickupLocation}}
      </v-layout>
    </v-flex>
   <location-search-view v-if=" $route.name != 'P2PCabDetails' && pickUpDialog" :pickUpDialog="pickUpDialog"  :pickUpDialogOption="'p2pSearch'"  @selectedPlace="pickupSelected($event)" @closeLocationPopUp="pickUpDialog=false"></location-search-view>
  </v-layout>
 </div> 
</template>
<script>
   import router from '../../../router'
   export default {
     props:{
       pickupLocation:{
         type: String,
         required:true
       }
     },
     components:{
        LocationSearchView : ()=> import('../../common/locationSearchView') 
     },
     data () {
       return {
         dropLocationText: 'Choose dropoff location',
         pickUpDialog: false ,
         selectedLocation:''
       }  
     },
     watch: {
       pickupLocation () {
         this.selectedLocation = this.pickupLocation
       }
     },
     methods:{
       openPickUpDialog () {
           this.pickUpDialog =true;
       },
       pickupSelected (event) {
         this.selectedLocation =event.address
         this.pickUpDialog = false
         this.$emit('selectedPickUpLocation',event)
       } 
     }

   }
</script>
<style scoped>
  .p2p_details_pickup{
    top:55px!important;
  }
  .line{
    height: 45px;
    width: 1px;
    border: 1px dotted grey;
    z-index: 999999;
    left: 20px;
    margin-top: 37px;
    position: sticky;
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
    top: 110px;
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
    border-radius: 50%;
    margin-top: 15px;
    margin-left: 3px;
    background-color: rgb(25, 118, 210);
  }
  .txt_pickup{
     font-size:11px;
     color: rgb(25, 118, 210);
  }
 
</style>