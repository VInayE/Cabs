<template>
  <v-app class="cd_bg">
      <div id="trackMap" style=""></div>
      
      <v-layout row wrap class="p10">
          <div class="DriverImage">
             <img id="driverPic" src=""/>
          </div>
          <div class="DriverDetail">
              <span id="DriverName"></span>
              <span id="DriverMobile"></span>
              <span id="DriverRating"></span>
              <span id="DriverCabModel"></span>
          </div>      
      <v-flex xs12 style="padding:0px">
        <v-btn>
            call
        </v-btn>
      </v-flex>
          
      
   </v-layout> 
  </v-app>
</template>
<script>
export default {
    components:{
    },
    data () {
      return {
         map:'',
         marker:'', 
         interval:'',
         map_bounds_zoom_interval:'',
         duration : 3000,
         heading:'',
         start_marker:'',
         end_marker:'',
         bounds:'',
         track_url : '<%= YatraClient::ServicesUrl.yatra_gateway_service_url %>',
         car : 'M83 810 c-38 -15 -46 -74 -38 -273 l8 -179 -22 7 c-24 7 -30 -12 -6 -21 12 -5 15 -29 15 -128 0 -94 4 -127 16 -144 50 -72 238 -72 288 0 12 17 16 50 16 144 0 99 3 123 15 128 8 3 15 10 15 17 0 6 -6 9 -14 6 -19 -8 -26 74 -19 231 7 147 -4 197 -44 213 -30 11 -200 11 -230 -1z m221 -131 c3 -3 2 -18 -2 -33 -8 -28 -8 -28 -100 -29 l-92 -2 -10 29 c-13 36 -13 34 8 40 22 6 189 3 196 -5z m29 -229 c4 -101 3 -111 -9 -85 -14 32 -19 171 -7 201 9 25 11 15 16 -116z m-245 15 c-2 -71 -8 -109 -17 -117 -12 -11 -13 -10 -7 5 3 10 6 63 6 118 0 66 4 99 11 99 8 0 10 -32 7 -105z m162 -85 l50 6 15 -50 c11 -35 12 -53 5 -60 -14 -14 -226 -14 -239 -1 -7 7 -6 26 5 61 l17 50 48 -6 c27 -4 72 -4 99 0z',
	    icon : {
		path: 'M83 810 c-38 -15 -46 -74 -38 -273 l8 -179 -22 7 c-24 7 -30 -12 -6 -21 12 -5 15 -29 15 -128 0 -94 4 -127 16 -144 50 -72 238 -72 288 0 12 17 16 50 16 144 0 99 3 123 15 128 8 3 15 10 15 17 0 6 -6 9 -14 6 -19 -8 -26 74 -19 231 7 147 -4 197 -44 213 -30 11 -200 11 -230 -1z m221 -131 c3 -3 2 -18 -2 -33 -8 -28 -8 -28 -100 -29 l-92 -2 -10 29 c-13 36 -13 34 8 40 22 6 189 3 196 -5z m29 -229 c4 -101 3 -111 -9 -85 -14 32 -19 171 -7 201 9 25 11 15 16 -116z m-245 15 c-2 -71 -8 -109 -17 -117 -12 -11 -13 -10 -7 5 3 10 6 63 6 118 0 66 4 99 11 99 8 0 10 -32 7 -105z m162 -85 l50 6 15 -50 c11 -35 12 -53 5 -60 -14 -14 -226 -14 -239 -1 -7 7 -6 26 5 61 l17 50 48 -6 c27 -4 72 -4 99 0z',
		scale: 0.045,
		strokeWeight: 0.1,
		fillOpacity: 1,
		fillColor: '#404040',
		offset: '100%'
	    }

      }
    },
    methods: {
        loadDriverDetails(order_id) {
//		$.ajax({
//			url: this.track_url + '/cabs/p2p/v1/vehicle/track/' + order_id,
//			type: "GET",
//			dataType: 'json',
//			success: function(response) {
        var response={
            "order": {
                "start_time": 1505730281000,
                "fare_details": null,
                "vehicle_class": {
                    "id": "c8170d76-b67c-44b1-8c26-5f45541434d2",
                    "display_name": "UberGo",
                    "image_url": "https://ns.yatracdn.com/common/images/cabs/go@3x.png"
                },
                "vehicle": {
                    "license_plate": "UBER-PLATE",
                    "model": "Prius",
                    "picture_url": "https://d1a3f4spazzrp4.cloudfront.net/uberex-sandbox/images/prius.jpg",
                    "type": "cab"
                },
                "payment_method": {
                    "display_name": "Cash",
                    "type": "cash"
                },
                "id": "1809717177069",
                "driver": {
                    "name": "John",
                    "mobile_number": "(555)555-5555",
                    "picture_url": "https://d1a3f4spazzrp4.cloudfront.net/uberex-sandbox/images/driver.jpg",
                    "rating": 4.9
                },
                "status": "driver_assigned",
                "end": {
                    "address": "Huda Metro Station, Delhi, India",
                    "latitude": 28.45926856994629,
                    "longitude": 77.07241821289062,
                    "source": null
                },
                "vendor": {
                    "support": null,
                    "image_url": "https://ns.yatracdn.com/common/images/cabs/uber_logo.png",
                    "display_name": "Uber",
                    "id": "71ff8231-77b1-42ad-94cc-f7090bdd0327",
                    "refund_policy_url": "",
                    "terms_url": ""
                },
                "start": {
                    "address": "Yatra.com, Gurugram, Haryana, India",
                    "latitude": 28.443437576293945,
                    "longitude": 77.05522918701172,
                    "source": null
                }
            }
        }        
				let driver = response.order.driver;
				let vehicle = response.order.vehicle;
				let start = response.order.start;
				let end = response.order.end;
				let order_status = response.order.status;
				let initial_map_position;
                let vehicle_location_obj = response.order.vehicle_location;
				if (vehicle.model == 'Auto') {
					this.icon = "<%= image_url digest_path1('AutoPNG.png') %>";
				}
                document.getElementById('driverPic').src=driver.picture_url;
                document.getElementById('DriverName').innerHTML=driver.name;
                document.getElementById('DriverMobile').innerHTML=driver.mobile_number;
                document.getElementById('DriverRating').innerHTML=driver.rating;
                document.getElementById('DriverCabModel').innerHTML=vehicle.model;
				// Initialize map and marker
					if (vehicle_location_obj && (vehicle_location_obj.latitude != 0 || vehicle_location_obj.longitude != 0)) {
					initial_map_position = new google.maps.LatLng(vehicle_location_obj.latitude, vehicle_location_obj.longitude);
				} else {
					initial_map_position = new google.maps.LatLng(start.latitude, start.longitude);
				}

				
				var myOptions = {
					zoom: 15,
					center: initial_map_position,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					mapTypeControl: false,
					streetViewControl: false,
					zoomControl: false
				};

				this.map = new google.maps.Map(document.getElementById("trackMap"), myOptions);
				this.bounds = new google.maps.LatLngBounds();
				this.marker = new google.maps.Marker({
					position: initial_map_position,
					map: this.map,
					draggable: false,
					duration: this.duration,
					icon: this.icon
				});


				this.bounds.extend(new google.maps.LatLng(start.latitude, start.longitude));
                
				this.start_marker = new google.maps.Marker({
					position: new google.maps.LatLng(start.latitude, start.longitude),
					map: this.map,
					title: start.address,
					icon: {url: "../../../static/img/icons/PickupPin.png" }
				});

				if (end != null) {
					this.end_marker = new google.maps.Marker({
						position: new google.maps.LatLng(end.latitude, end.longitude),
						map: this.map,
						title: end.address,
						icon: {url: "../../../static/img/icons/DropoffPin.png" }
					});
				}
 //       ,
//			error: function(xhr) {
//				console.log("Inside Driver Details failure");
//			}
//		});
	},
        
        
	loadVehicleLocations(order_id) {
//		$.ajax({
//			url: track_url + '/cabs/p2p/v1/vehicle/track/' + order_id,
//			type: "GET",
//			dataType: 'json',
//			success: function(response) {
        
        
         var response={
            "order": {
                "start_time": 1505730281000,
                "fare_details": null,
                "vehicle_class": {
                    "id": "c8170d76-b67c-44b1-8c26-5f45541434d2",
                    "display_name": "UberGo",
                    "image_url": "https://ns.yatracdn.com/common/images/cabs/go@3x.png"
                },
                "vehicle": {
                    "license_plate": "UBER-PLATE",
                    "model": "Prius",
                    "picture_url": "https://d1a3f4spazzrp4.cloudfront.net/uberex-sandbox/images/prius.jpg",
                    "type": "cab"
                },
                "payment_method": {
                    "display_name": "Cash",
                    "type": "cash"
                },
                "id": "1809717177069",
                "driver": {
                    "name": "John",
                    "mobile_number": "(555)555-5555",
                    "picture_url": "https://d1a3f4spazzrp4.cloudfront.net/uberex-sandbox/images/driver.jpg",
                    "rating": 4.9
                },
                "status": "in_progress",
                "end": {
                    "address": "Huda Metro Station, Delhi, India",
                    "latitude": 28.45926856994625,
                    "longitude": 77.07241821289065,
                    "source": null
                },
                "vendor": {
                    "support": null,
                    "image_url": "https://ns.yatracdn.com/common/images/cabs/uber_logo.png",
                    "display_name": "Uber",
                    "id": "71ff8231-77b1-42ad-94cc-f7090bdd0327",
                    "refund_policy_url": "",
                    "terms_url": ""
                },
                "start": {
                    "address": "Yatra.com, Gurugram, Haryana, India",
                    "latitude": 28.443437576293950,
                    "longitude": 77.05522918701180,
                    "source": null
                }
            }
        } 
				var order_status = response.order.status;
				var end = response.order.end;
                var start = response.order.start;
				var vehicle = response.order.vehicle;
				var vehicle_location_obj = {};
				var eta = response.order.eta || 0;
                vehicle_location_obj.latitude = 28.481216;
                vehicle_location_obj.longitude = 77.019135;

				var vehicle_type = 'car';
				if (vehicle.model == 'Auto') {
					vehicle_type = 'Auto'
				}

//				if (order_status == 'driver_assigned' || order_status == 'arriving') {
//					$('.DriverEtaNumber').text(eta);
//				}

				if (order_status == 'in_progress') {
//					$('.DriverEta').hide();
					if (end != null) {
						this.bounds.extend(new google.maps.LatLng(end.latitude, end.longitude));
					}
					this.setMapLatLngBounds(vehicle_location_obj.latitude,vehicle_location_obj.longitude);
				}

				if (order_status == 'completed' || order_status == 'driver_cancelled' || order_status == 'rider_cancelled' ||
						order_status == 'cancelled') {
					clearInterval(this.interval);
					return;
				}
				this.setMarkerLocation(vehicle_type, vehicle_location_obj.latitude ,vehicle_location_obj.longitude);
//			},
//			error: function(xhr) {
//				console.log("Inside Vehicle Locaitons failure");
//			}
//		});
	},
        
    setMarkerLocation(vehicle_type, lat, lng){
		var lat_lng = new google.maps.LatLng(lat, lng);
		if (vehicle_type == 'car') {
			//this.heading = google.maps.geometry.spherical.computeHeading(this.marker.position, lat_lng);
			//icon.rotation = this.heading;
			this.marker.setIcon(this.icon);
		}
		if (lat != 0 && lng != 0) {
			this.marker.setPosition(lat_lng);
		}
	},

	setMapLatLngBounds(lat, lng){
		if (lat == 0 || lng == 0 ) {
			return;
		}
		var latLng = new google.maps.LatLng(lat, lng);
		this.bounds.extend(latLng);
		if (this.bounds == null) {
			return;
		}
		google.maps.event.addListenerOnce(this.map, 'bounds_changed', function(event) {
			if (this.getZoom() > 15) {
				this.setZoom(15);
			}
		});
		this.map.fitBounds(this.bounds);
	},
        
    initMaps () {
          
        let order_id = "<%= params[:id] %>";
		this.loadDriverDetails();
        this.loadVehicleLocations();
		//this.interval = setInterval(function(){loadVehicleLocations(order_id)}, 10000);
      }
    },
    mounted () {
        this.initMaps()
      }
    }
</script>
<style>
    
    #trackMap{
        height:100vh;
        width:100%;
        position:fixed;
        top:0px;
    }
    .DriverImage>img{
        height: 50px;
        margin-left: 8px;
    }
    
    .DriverDetail{
        position: relative;
        width: 60%;
    }
    
    #DriverName{
        font-size:14px;
        margin-top:5px;
        position:absolute;
    }
    #DriverMobile{
        font-size:14px;
        margin-top:30px;
        position:absolute;
    }
    
    #DriverRating{
        font-size:14px;
        margin-top:5px;
        position:absolute;
        left:120%;
    }
    #DriverCabModel{
        font-size:14px;
        margin-top:30px;
        position:absolute;
        left:120%;
    }
</style>
