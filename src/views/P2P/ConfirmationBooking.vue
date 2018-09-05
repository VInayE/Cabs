<template>
 <v-app>
   <confirm-booking-header :trackHeaderText="headerText"></confirm-booking-header>
  <div id="confirmMap" style="position:fixed!important;height:100vh;width:100%;"></div>
  <v-layout row wrap  class="trackFooter">
    <v-flex xs12>
      <v-layout row wrap>
         <v-flex xs2 v-if="vehicleDetails.driver" style="padding:5px;">
            <img :src="vehicleDetails.driver.picture_url" style="width:50px"/>
         </v-flex>
         <v-flex xs7 offset-xs1 v-if="vehicleDetails.driver && vehicleDetails.vehicle" style="margin-top:5px;">
            <v-layout row wrap style="font-family:Roboto-500">{{vehicleDetails.driver.name}}</v-layout>
            <v-layout row wrap class="license_plate">{{vehicleDetails.vehicle.license_plate}}</v-layout>
         </v-flex>
         <v-flex xs2 v-if="vehicleDetails.driver && vehicleDetails.vehicle" style="margin-top:5px;">
            <v-layout row wrap style="color:#EA2330;font-family:Roboto-500">{{vehicleDetails.driver.rating}}</v-layout>
            <v-layout row wrap>{{vehicleDetails.vehicle.model}}</v-layout>
         </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs12 style="border-top:1px solid #bdbdbd">
       <v-layout row wrap>
         <v-flex xs4 style="padding-left:9%" v-if="vehicleDetails.driver">
           <a :href="'tel:'+vehicleDetails.driver.mobile_number" style="text-decoration:none">
              <v-layout row wrap><v-icon class="option_icon">phone</v-icon></v-layout>
              <v-layout row wrap class="option_text">Call</v-layout>
           </a> 
         </v-flex>
          <v-flex xs4 style="padding-left:9%">
           <a href="sms:" style="text-decoration:none">
             <v-layout row wrap><v-icon class="option_icon" style="margin-left:8px;">share</v-icon></v-layout>
             <v-layout row wrap class="option_text" >Share</v-layout>
           </a> 
         </v-flex>
          <v-flex xs4 style="padding-left:9%" @click="cancelRide">
            <v-layout row wrap><v-icon class="option_icon" style="margin-left:10px;">cancel</v-icon></v-layout>
            <v-layout row wrap class="option_text">Cancel</v-layout>
         </v-flex>
       </v-layout>
    </v-flex>
  </v-layout>
  <message-modal-view v-if="showOrderStatus !=''" :showOrderStatus="showOrderStatus"></message-modal-view>
  <loader-view v-if="ajaxLoading"></loader-view>
 </v-app>
</template>
<script>
  var SlidingMarker = require('marker-animate-unobtrusive')
  var map, marker;
	var interval;
	var map_bounds_zoom_interval = '';
	var duration = 3000;
	var heading;
	var start_marker;
	var end_marker;
	var bounds;
	var car = "M83 810 c-38 -15 -46 -74 -38 -273 l8 -179 -22 7 c-24 7 -30 -12 -6 -21 12 -5 15 -29 15 -128 0 -94 4 -127 16 -144 50 -72 238 -72 288 0 12 17 16 50 16 144 0 99 3 123 15 128 8 3 15 10 15 17 0 6 -6 9 -14 6 -19 -8 -26 74 -19 231 7 147 -4 197 -44 213 -30 11 -200 11 -230 -1z m221 -131 c3 -3 2 -18 -2 -33 -8 -28 -8 -28 -100 -29 l-92 -2 -10 29 c-13 36 -13 34 8 40 22 6 189 3 196 -5z m29 -229 c4 -101 3 -111 -9 -85 -14 32 -19 171 -7 201 9 25 11 15 16 -116z m-245 15 c-2 -71 -8 -109 -17 -117 -12 -11 -13 -10 -7 5 3 10 6 63 6 118 0 66 4 99 11 99 8 0 10 -32 7 -105z m162 -85 l50 6 15 -50 c11 -35 12 -53 5 -60 -14 -14 -226 -14 -239 -1 -7 7 -6 26 5 61 l17 50 48 -6 c27 -4 72 -4 99 0z";
	var icon = {
		path: car,
		scale: 0.045,
		strokeWeight: 0.1,
		fillOpacity: 1,
		fillColor: '#404040',
		offset: '100%'
	};
  import router from '../../router'
  import { adobeAnalyticsPageView } from '../../helpers/adobeAnalytics'
  export default {
    components:{
      ConfirmBookingHeader: () => import('../../components/P2P/ConfirmBookings/ConfirmBookingHeader'),
      MessageModalView: () => import('../../components/P2P/ConfirmBookings/MessageModalView'),
      LoaderView: () => import('../../components/common/loader')
    },
    data () {
      return {
        orderID: "",
        vehicleDetails:{},
        showOrderStatus:'',
        ajaxLoading:false,
        headerText: 'Driver En Route'
      }
    },
    methods:{
      cancelRide () {
        let self = this
        this.ajaxLoading = true
         this.$http.post(`p2p/v1/orders/${self.orderID}/cancel`).then(function (response) {
             clearInterval(self.interval)
             self.ajaxLoading = false
             router.push({name:'CabsHomeView',params:{option:'p2p'}})
          }).catch(function (error) {
              self.ajaxLoading = false
              clearInterval(self.interval)
          });
      },
      loadDriverDetails(orderID){
         Vue.http.headers['content-type'] = 'application/json'
         Vue.http.options.emulateJSON = false
         let self = this
         this.$http.get(`p2p/v1/vehicle/track/${orderID}`).then(function (response) {
              self.vehicleDetails = response.body.order
              let driver = response.body.order.driver
              let vehicle = response.body.order.vehicle
              let start = response.body.order.start
              let end = response.body.order.end
              let eta = response.body.order.eta
              let order_status = response.body.order.status
              let rating = driver.rating
              let vehicle_location_obj = response.body.order.vehicle_location
              let initial_map_position
              if (vehicle.model == 'Auto') {
				     	   icon = "/pwa/cabs/cabs/img/icons/auto.png";
				      }
              if (vehicle_location_obj && (vehicle_location_obj.latitude != 0 || vehicle_location_obj.longitude != 0)) {
				       	initial_map_position = new google.maps.LatLng(vehicle_location_obj.latitude, vehicle_location_obj.longitude);
				      } else {
				      	initial_map_position = new google.maps.LatLng(start.latitude, start.longitude);
			      	}
              let myOptions = {
				        	zoom: 15,
					        center: initial_map_position,
			        		mapTypeId: google.maps.MapTypeId.ROADMAP,
					        mapTypeControl: false,
					        streetViewControl: false,
					        zoomControl: false,
                  disableDefaultUI: true,
                  gestureHandling: 'greedy',
                  mapTypeControl: false,
                  clickableIcons: false
				      }

              map = new google.maps.Map(document.getElementById("confirmMap"), myOptions)
              bounds = new google.maps.LatLngBounds()
              marker = new SlidingMarker({
				      	position: initial_map_position,
					      map: map,
					      draggable: false,
					      duration: duration,
					      icon: icon
				      })
              bounds.extend(new google.maps.LatLng(start.latitude, start.longitude))
              start_marker = new google.maps.Marker({
				        	position: new google.maps.LatLng(start.latitude, start.longitude),
					        map: map,
					        title: start.address,
					        icon:{url:"/pwa/cabs/cabs/img/icons/PickupPin.png"}
				      })
              if (end != null) {
				    	end_marker = new google.maps.Marker({
						      position: new google.maps.LatLng(end.latitude, end.longitude),
						      map: map,
						      title: end.address,
						      icon: {url: "/pwa/cabs/cabs/img/icons/DropoffPin.png"}
					    })
              } 
              if(order_status == 'arriving'){
                self.setPopUpWindow(response.body.order.eta,order_status)
              }
              if(order_status == 'in_progress') {
                self.headerText = 'On Trip'
                self.setPopUpWindow(response.body.order.eta,order_status)
              }
              if (order_status == 'completed' || order_status == 'driver_cancelled' || order_status == 'rider_cancelled'|| order_status == 'cancelled') {
                 if(order_status == 'completed') {
                    self.headerText = 'Trip Completed'
                 } 
					       marker.setMap(null)
                 clearInterval(self.interval)
                 self.showOrderStatus = order_status
                 return
				      }
              if (order_status == 'driver_assigned' || order_status == 'arriving') {
					        this.setMapLatLngBounds(vehicle_location_obj.latitude, vehicle_location_obj.longitude);
				      }   
         }, function (response1) {
              console.log('Inside Driver Details failure')   
         });
      },
      setPopUpWindow(eta,order_status){
            var contentString = '<div id="content">'+
                 '<div id="siteNotice">'+
                  '</div>'+
                  '<h1 id="firstHeading" class="firstHeading" style="font-size:14px;font-weight: bold;margin-bottom: 5px;">Arrival</h1>'+
                  '<div id="bodyContent">'+
                  '<p style="margin-bottom:0px;">'+eta+' minutes</p>'+
                  '</div>'+
                  '</div>';
            var infowindow = new google.maps.InfoWindow({
              content: contentString
            });
         if(order_status == 'arriving'){
            infowindow.open(map,start_marker)
         } else{
           infowindow.close()
         }  
         
      },
      setMapLatLngBounds(lat, lng){
        if(lat == 0 || lng == 0){
          return 
        }
        let latLng = new google.maps.LatLng(lat, lng)
        bounds.extend(latLng)
        if (this.bounds == null) {
		    	return
		    }
        google.maps.event.addListenerOnce(map, 'bounds_changed', function(event) {
            if (getZoom() > 15) {
               setZoom(15);
            }
		    })
		    map.fitBounds(bounds)
      },
      loadVehicleLocations (orderID) {
         Vue.http.headers['content-type'] = 'application/json'
         Vue.http.options.emulateJSON = false
         let self = this
         this.$http.get(`p2p/v1/vehicle/track/${orderID}`).then(function (response) {
              self.vehicleDetails = response.body.order
              let order_status = response.body.order.status
			      	let end = response.body.order.end
				      let vehicle = response.body.order.vehicle
				      let vehicle_location_obj = response.body.order.vehicle_location
				      let eta = response.body.order.eta || 0
              let vehicle_type = 'car'
              if (vehicle.model == 'Auto') {
					      vehicle_type = 'Auto'
				      }
              if(order_status == 'in_progress'){
                self.headerText = 'On Trip'
                if (end != null) {
						      bounds.extend(new google.maps.LatLng(end.latitude, end.longitude));
					      }
                self.setMapLatLngBounds(vehicle_location_obj.latitude,vehicle_location_obj.longitude)
              }
               if(order_status == 'arriving'){
                self.setPopUpWindow(response.body.order.eta)
              }
              if (order_status == 'completed' || order_status == 'driver_cancelled' || order_status == 'rider_cancelled' ||order_status == 'cancelled') {
					      if(order_status == 'completed') {
                  self.headerText = 'Trip Completed'
                }
                clearInterval(self.interval)
                self.showOrderStatus = order_status
					      return;
				      }
              self.setMarkerLocation(vehicle_type, vehicle_location_obj.latitude, vehicle_location_obj.longitude)
          }, function (response1) {
              console.log('some error occured')
          });
      },
      setMarkerLocation (vehicle_type, lat, lng) {
         var lat_lng = new google.maps.LatLng(lat, lng);
          if (vehicle_type == 'car') {
            heading = google.maps.geometry.spherical.computeHeading(marker.position, lat_lng);
            icon.rotation = heading;
            marker.setIcon(icon);
          }
          if (lat != 0 && lng != 0) {
            marker.setPosition(lat_lng);
          }
      }
    },
    mounted () {
        this.orderID = this.$route.params.orderID
        this.loadDriverDetails(this.orderID)
        let self = this
        adobeAnalyticsPageView('yt:cab:checkout:booking success','cab','business','cab checkout','booking success','','')
        this.interval = setInterval(function(){
          self.loadVehicleLocations(self.orderID)
        },10000)
    }
  }


</script>
<style scoped>
.trackFooter{
  position: fixed;
  background-color: white;
  width: 97%;
  bottom: 0px;
  margin: 5px;
  box-shadow: 10px 10px 14px 10px rgba(0, 0, 0, 0.44);
}
.license_plate{
    text-align: center;
    margin-bottom: 5px;
    padding-top: 5px;
    height: 30px;
    border: 1px solid;
    width: 100px;
    font-size: 13px;
    padding-left: 5px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}
.option_icon{
  font-size: 20px;
  color: rgb(25, 118, 210);
  margin-top: 3px;
}
.option_text{
  color: rgb(25, 118, 210)
}
</style>
