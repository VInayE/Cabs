<template>
  <v-app >
  <v-layout row justify-center>
    <v-dialog  class="placePickupDialog" v-model="dialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
       <div class="place_overlay_cl">
          <v-icon class="place_arrow_back" @click="closeLocationPopup">arrow_back</v-icon>
         <input type="text" class="txtPlaces" v-model="searchedText" :id="pickUpDialogOption" autofocus="true" ref='search' :placeholder="pickUpDialogOption == 'p2pDropSearch' ? 'Enter dropoff location' : 'Enter pickup location'" />
         <v-icon class="place_clear_icon" @click="clearSearchedLocation">close</v-icon>
       </div>
       <v-layout row wrap class="searched_location">
          <v-flex xs12 v-for="(location,index) in searchedLocations" :key="index" class="location_object" v-if="location.place_id">
           <v-layout row wrap>
              <v-flex xs1 @click="selectLocation(location.place_id,location.description)"><v-icon class="icon_location">location_on</v-icon></v-flex>
              <v-flex xs8 @click="selectLocation(location.place_id,location.description)">
                <v-layout row wrap>
                  <v-flex xs12 class="location_primary_search">{{location.structured_formatting.main_text}}</v-flex>
                  <v-flex xs12 class="location_text">{{location.structured_formatting.secondary_text}}</v-flex>
                </v-layout>  
              </v-flex>
              <v-flex xs2 class="txt_blue txt_map" @click="getLatLong(location.place_id,location.description)">Map</v-flex>
           </v-layout>
            
          </v-flex>
       </v-layout>
       <drop-location-map-view v-if="showDropLocationMap" :locationOnMap="locationOnMap" @dropOffLocation="dropOffLocation($event)"></drop-location-map-view>
    </v-dialog>
  </v-layout>
</v-app>
</template>
<script>
  import { adobeAnalyticsPageView } from '../../helpers/adobeAnalytics'
  export default {
    components:{
       DropLocationMapView :()=> import('../P2P/cabsHome/DropLocationMapView')
    },
     props:{
      pickUpDialog:{
        type:Boolean,
        required:true    
      },
      pickUpDialogOption : {
        type: String,
        required: true
      }
     },
      watch: {
        pickUpDialog () {
          this.dialog =this.pickUpDialog
          if(this.dialog){
            navigator.geolocation.getCurrentPosition(this.showPosition)
            adobeAnalyticsPageView('yt:cab:book ride:dropoff location','cab','business','cab book ride','dropoff location','','')
          }
          this.clearSearchedLocation()
        },
        dialog(){
          this.$refs.search.focus()
        },
        searchedText () {
          if(this.searchedText.length >3){
            let self=this;
            var places = new google.maps.places.AutocompleteService(document.getElementById(this.pickUpDialogOption));
            places.getPredictions({ 
              input: self.searchedText,
              location:new google.maps.LatLng(self.currentPosition.currentLatitude,self.currentPosition.currentLongitude),
              radius:50000,
              rankBy: google.maps.places.RankBy.DISTANCE
            }, self.displaySuggestions);  
          } else{
            this.searchedLocations = {}
          }
        }
      },
      data () {
        return {
          dialog: false,
          showDropLocationMap:false,
          searchedText:'',
          searchedLocations:{},
          locationOnMap:{},
          currentPosition:{}
        }
      },
     methods: {
      showPosition(position){
        this.currentPosition.currentLatitude = position.coords.latitude
        this.currentPosition.currentLongitude = position.coords.longitude
      }, 
      selectLocation (placeID,locationName) {
         var geocoder = new google.maps.Geocoder
         let self = this
          geocoder.geocode({'placeId': placeID}, function(results, status) {
            self.locationOnMap = {
              'latitude': results[0].geometry.location.lat(),
              'longitude': results[0].geometry.location.lng(),
              'address':locationName
            }
            self.dropOffLocation(self.locationOnMap)

         });
      },
      getLatLong(placeID,locationName){
         var geocoder = new google.maps.Geocoder
         let self = this
          geocoder.geocode({'placeId': placeID}, function(results, status) {
            self.locationOnMap = {
              'latitude': results[0].geometry.location.lat(),
              'longitude': results[0].geometry.location.lng(),
              'address':locationName
            }
             self.showDropLocationMap = true
             adobeAnalyticsPageView('yt:cab:book ride:dropoff location:choose from map','cab','business','cab book ride','dropoff location','choose from map','')
         });
      },
      dropOffLocation(event){
        this.dialog = false
        this.showDropLocationMap = false
        this.$emit('searchedDropofflocation',event)
      },
      displaySuggestions(predictions, status){
          let i = 0;
          for(i= 0;i< predictions.length;i++) {
            if(predictions[i].types.findIndex(x => x == "administrative_area_level_1")>=0 || predictions[i].types.findIndex(x => x == "country")>=0) {
              predictions.splice(i,1)
              i-=1
            }
          }
          this.searchedLocations = predictions
      },
      closeLocationPopup (){
        this.$emit('closeLocationPopUp',false)
      },
      clearSearchedLocation () {
         this.searchedLocations={}
         this.searchedText = ''
         this.locationOnMap = {}
      }
    },
    mounted () {
       this.dialog =this.pickUpDialog
       navigator.geolocation.getCurrentPosition(this.showPosition)
    }
  }
</script>
<style scoped>
  .location_primary_search{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family:'Roboto-500';
    font-size:12px;
  }
  .icon_location{
    font-size: 20px;
    margin-top:5px;
  }
  .txt_map{
    margin-left:20px;
    text-align:center;
    border-left:1px solid #e0e0e0;
    line-height:2.5;
  }
  .location_text{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 11px;
    color: rgba(97, 97, 97, 0.78);
  }
  .location_object{
    background-color: white;
    padding: 5px;
    margin-bottom: 5px;
    height:45px;
  }
  .searched_location{
    position: fixed;
    width: 100%;
    top: 60px;
    padding:10px;
  }
  .choose_frm_map{
     height: 50px;
    width: 100%;
    margin-top: 10px;
    background-color: white;
    padding: 15px;
    color: grey;
  }
  .place_overlay_cl{
    width: 100%;
    height: 100%;
    background-color: #efefef;
    padding:10px;
    margin:0;
  }
  .txtPlaces{
    width: 100%;
    height: 50px;
    background-color: white;
    padding-left: 45px;
    padding-right:45px;
  }
  .txtPlaces:focus{
    border:0px!important;
    ouline:none!important;
 }
 input{
   outline:none;
 }
  .place_arrow_back{
     position:absolute;
     left:20px;
     width:10px;
     height:10px;
     top:23px; color: #333;
  }
  .place_clear_icon{
     position:absolute;
     right:30px;
     width:10px;
     height:10px;
     top:23px; color: #333;
  }

  .help_icon{
    height: 24px;
    width: 24px;
    display: block;
  }
  .pos-rel8{
    position: relative; top: -8px;
  }
</style>
