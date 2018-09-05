<template>
  <v-app>
     <div class="dropAddress"><div class="drop_icon"></div><span class="drop_txt">{{dropLocation}}</span></div>
     <div id="locationMap"></div>
      <button id="searchCabs" class="btn-search" @click="searchedDropoffLocation">SEARCH CABS</button>
  </v-app>
</template>
<script>
   import data from '../../../data/googleMapsStyle'
  export default {
    props:['showDropLocationMap','locationOnMap'],
    watch:{
      showDropLocationMap(){
          this.showMap = this.showDropLocationMap
      }
    },
    data () {
      return {
        dropLocation:'',
        mapDirection:{},
        searchedDropLocation:{
          'address':'',
          'latitude':'',
          'longitude':''  
        }
      }  
    },
    mounted () {
     this.mapDirection = this.locationOnMap
     this.searchedDropLocation.latitude = this.mapDirection.latitude
     this.searchedDropLocation.longitude = this.mapDirection.longitude
     this.searchedDropLocation.address=this.mapDirection.address
     this.dropLocation = this.mapDirection.address
     this.mapsDisplay()
    },
    methods:{
     searchedDropoffLocation () {
       this.$emit('dropOffLocation',this.searchedDropLocation)  
     }, 
     mapsDisplay () {
        var self = this;
        let myLatlng = new google.maps.LatLng(this.mapDirection.latitude,this.mapDirection.longitude)
        let mapOptions = {
            center: myLatlng,
            zoom: 17,
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
      },
      getFormattedAddress (latitutde,longitude) {
         this.searchedDropLocation.latitude = latitutde
         this.searchedDropLocation.longitude = longitude
         let self = this
         this.searchedLatitude =latitutde.toString()+','+longitude.toString()
         Vue.http.headers.common={}
         this.$http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.searchedLatitude}&sensor=true`).then(function (response) {
              self.searchedDropLocation.address = response.body.results[0].formatted_address
              self.dropLocation = response.body.results[0].formatted_address
            }).catch(function (error) {
                self.dropLocation = ''
            });
      },
      showPosition (position) {
        this.selectedInitialPosition = position
        this.getFormattedAddress(position.coords.latitude,position.coords.longitude)
        this.mapsDisplay(position.coords.latitude,position.coords.longitude,16)
      }
      
    }
  }
</script>
<style scoped>
 #locationMap{
    height: 100vh;
    width: 100%;
    z-index: 21;
    top: 0px;
    position: fixed!important;
    overflow: hidden;
 }
 .btn-search{
    position: fixed;
    bottom: 0px;
    width: 93%;
    height: 36px;
    background-color: #EA2330;
    color: white;
    font-size: 14px;
    margin: 10px;
    z-index:22
 }
 .drop_txt{
    margin-left: 28px;
    width: 83%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    line-height: 40px;
 }
 .drop_icon{
    height: 10px;
    width: 10px;
    border: 2px solid #EA2330;
    position: absolute;
    left: 10px;
    border-radius: 50%;
    top: 13px;
 }
 .dropAddress{
    width: 93%;
    height: 40px;
    position: absolute;
    background-color: white;
    z-index: 22;
    top: 10px;
    margin-left: 10px;
 }
 .showMap{
    width:100%;
    height:100%;
    background-color:white;
 }
</style>