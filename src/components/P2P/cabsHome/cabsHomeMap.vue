<template>
  <div>
    <v-snackbar class="snacktxt" :timeout="timeout" :bottom="y === 'bottom'" :multi-line="true" v-model="snackbar">
      {{snackbarText}}
      <v-btn flat class="txt-ff" @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
    <div class="p2pcabsavailable">
      <pick-up-drop-view :pickupLocation="pickupLocation" @selectedPickUpLocation="updatePickUpMarker($event)"></pick-up-drop-view>
      <drop-view :dropLocation="userDropLocation" :selectedPosition="selectedPosition" @selectedDropOffLocation="selectectedDropLocation($event)">
      </drop-view>
      <cabs-availability-details-view :cabAvailabilyOption="cabAvailabilyOption" :pickupLocation="selectedPosition" :currentRideSatus="currentRideSatus">

        <v-layout row wrap slot="header" v-if="Object.keys(currentRideSatus).length>0" class="trackride_header">
          <v-flex xs6>
            <v-layout row wrap style="font-family:Roboto-500;text-transform:uppercase">{{currentRideSatus.order.vehicle.type}}</v-layout>
            <v-layout row wrap style="font-family:Roboto-400;font-size: 12px;color: #757575;">{{currentRideSatus.order.vehicle.license_plate}} | {{currentRideSatus.order.vehicle.model}}</v-layout>
          </v-flex>
          <v-flex xs3 style="font-family:Roboto-400;font-size: 11px;color: #757575;line-height: 3.5;">{{currentRideSatus.order.eta}} mins away</v-flex>
          <v-flex xs3 @click="navigateToTrackRide(currentRideSatus.order.id)" style="cursor:pointer;text-align:center;line-height: 2.3;background-color: rgb(25, 118, 210);color: white;margin-top: 5px;margin-bottom: 5px;">TRACK</v-flex>

        </v-layout>
      </cabs-availability-details-view>
    </div>

    <v-btn class="icon_center" xs1 offset-xs11 @click="recenterLocation" v-if="selectedPosition.dropLocation == '' || selectedPosition.pickupLatitude == ''"
      style="cursor:pointer; padding: 0;">
      <v-icon class="icon_center_location" @click="recenterLocation" style="cursor:pointer">location_searching</v-icon>
    </v-btn>

  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import * as types from '../../../store/types'
  import router from '../../../router'
  import data from '../../../data/googleMapsStyle'
  import { displayLocationRoute } from '../../../helpers/googleMaps'
  import { setP2PParams, formP2PCabsOption } from '../../../helpers/cabHelper'
  import { eventBus } from '../../../utils/eventBus'
  import { adobeAnalyticsPageView } from '../../../helpers/adobeAnalytics'
  export default {
    components: {
      PickUpDropView: () => import('./PickUpDropView'),
      CabsAvailabilityDetailsView: () => import('./CabsAvailabilityDetailsView'),
      DropView: () => import('./DropView')
    },
    computed: {
      ...mapGetters({
        getP2PSearchParams: types.GET_P2P_SEARCH_PARAMS
      })
    },
    data() {
      return {
        timeout: 3000,
        y: 'bottom',
        snackbar: false,
        snackbarText: '',
        cabAvailabilyOption: [],
        selectedCity: '',
        searchedLatitude: '',
        pickupLocation: 'Choose Pickup Location',
        userDropLocation: 'Choose Dropoff location',
        zoomLevelConstant: 15,
        txtUserDeniedLocation: 'Your location services are turned off. ',
        txtLocationNotAvailable: 'Location information is not available. ',
        txtLocationtimeout: 'We could not fetch location details. Please [Retry]. ',
        txtOtherError: 'Something went wrong. Please [Retry]. ',
        txtManualLocationSelect: 'Please select your location manually. ',
        cabAvailabilityError: 'Cannot find cabs at the moment. Please retry or change your location. ',
        locationUnavailableError: 'This browser doesnot support location permissions. Please select your location manually. ',
        addressDetailsError: 'Some error occured in fetching location details. ',
        selectedInitialPosition: {},
        currentRideSatus: {},
        selectedPosition: {
          'pickupLatitude': '',
          'dropLatitude': '',
          'pickUpLongitude': '',
          'dropLongitude': '',
          'pickUpLocation': '',
          'dropLocation': '',
          'currentLatitude': '',
          'currentLongitude': ''
        }
      }
    },
    methods: {
      navigateToTrackRide(orderid) {
        router.push({ name: 'P2PConfirmBooking', params: { orderID: orderid } })
      },
      selectectedDropLocation(event) {
        this.selectedPosition.dropLocation = event.locationName
        this.selectedPosition.dropLatitude = event.latitude
        this.selectedPosition.dropLongitude = event.longitude
        if (this.selectedPosition.pickUpLongitude != '') {
          displayLocationRoute(this.selectedPosition)
          this.cabsSearch()
        }
      },
      recenterLocation() {
        this.cabAvailabilyOption = []
        if (navigator.geolocation) {
          this.pickupLocation = 'Fetching Location ...'
          navigator.geolocation.getCurrentPosition(this.showPosition, this.showError)
        } else {
          this.snackbar = true
          this.snackbarText = this.locationUnavailableError
        }
      },
      updatePickUpMarker(event) {
        this.selectedPosition.pickUpLocation = event.address
        this.getFormattedAddress(event.latitude, event.longitude)
        if (this.selectedPosition.dropLatitude != '') {
          this.selectedPosition.pickupLatitude = event.latitude
          this.selectedPosition.pickUpLongitude = event.longitude
          displayLocationRoute(this.selectedPosition)
          this.cabsSearch()
        } else {
          this.mapsDisplay(event.latitude, event.longitude, this.zoomLevelConstant)
        }
      },
      getFormattedAddress(latitutde, longitude) {
        let self = this
        this.searchedLatitude = latitutde.toString() + ',' + longitude.toString()
        Vue.http.headers.common = {}
        this.$http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.searchedLatitude}&sensor=true`).then(function (response) {
          self.snackbar = false
          self.snackbarText = ''
          self.pickupLocation = response.body.results[0].formatted_address
          self.selectedPosition.pickUpLocation = self.pickupLocation
        }).catch(function (error) {
          self.snackbar = true
          self.snackbarText = self.addressDetailsError
        });
      },
      showPosition(position) {
        this.selectedInitialPosition = position
        this.selectedPosition.currentLatitude = position.coords.latitude
        this.selectedPosition.currentLongitude = position.coords.longitude
        this.getFormattedAddress(position.coords.latitude, position.coords.longitude)
        this.mapsDisplay(position.coords.latitude, position.coords.longitude, 16)
      },
      showError(error) {
        switch (error.code) {
          case 1:
            this.snackbar = true
            this.snackbarText = this.txtUserDeniedLocation + this.txtManualLocationSelect
            break
          case 2:
            this.snackbar = true
            this.snackbarText = this.txtLocationNotAvailable + this.txtManualLocationSelect
            break
          case 3:
            this.snackbar = true
            this.snackbarText = this.txtLocationtimeout + this.txtManualLocationSelect
            break
          case 4:
            this.snackbar = true
            this.snackbarText = this.txtOtherError + this.txtManualLocationSelect
            break
        }
      },
      mapsDisplay(latitutde, longitude, zoomLevel) {
        var grayStyles = []
        if (zoomLevel != 4) {
          this.getAvailabaleCabs(latitutde, longitude)
          grayStyles = data.grayStyles

        }
        var self = this;
        let myLatlng = new google.maps.LatLng(latitutde, longitude)
        let mapOptions = {
          center: myLatlng,
          zoom: zoomLevel,
          disableDefaultUI: true,
          gestureHandling: 'greedy',
          mapTypeControl: false,
          styles: grayStyles,
          clickableIcons: false
        }
        let map = new google.maps.Map(document.getElementById("map"), mapOptions)
        var innerDiv = document.createElement("div");
        innerDiv.className += " centerMarker";
        var t = map.getDiv();
        t.appendChild(innerDiv)
        map.setOptions({ draggable: true });
        google.maps.event.addListener(map, 'dragend', function () {
          self.getFormattedAddress(this.getCenter().lat(), this.getCenter().lng())
          self.getAvailabaleCabs(this.getCenter().lat(), this.getCenter().lng())
        });
      },
      cabsSearch() {
        let self = this
        this.cabAvailabilyOption = []
        let searchUrl = this.selectedPosition.dropLatitude != '' ? `p2p/v1/products/estimates?start_latitude=${this.selectedPosition.pickupLatitude}&start_longitude=${this.selectedPosition.pickUpLongitude}&end_latitude=${this.selectedPosition.dropLatitude}&end_longitude=${this.selectedPosition.dropLongitude}&provider_group_id=1` : `p2p/v1/products?latitude=${this.selectedPosition.pickupLatitude}&longitude=${this.selectedPosition.pickUpLongitude}&provider_group_id=1`
        this.$http.get(searchUrl).then(function (response) {
          self.cabAvailabilyOption = []
          self.cabAvailabilyOption = formP2PCabsOption(response.body)
        }, response => {
          self.snackbar = true
          self.cabAvailabilyOption = []
          self.snackbarText = this.cabAvailabilityError
        })
      },
      getAvailabaleCabs(latitude, longitude) {
        this.selectedPosition.pickupLatitude = latitude
        this.selectedPosition.pickUpLongitude = longitude
        this.cabsSearch()
        eventBus.updatePickupLocation(this.selectedPosition)
      },
      initMaps() {
        this.mapsDisplay(28.7041, 77.1025, 4)
        adobeAnalyticsPageView('yt:cab:book ride', 'cab', 'business', 'cab book ride', '', '', '')
        if (navigator.geolocation) {
          this.pickupLocation = 'Fetching Location ...'
          navigator.geolocation.getCurrentPosition(this.showPosition, this.showError)
        } else {
          this.snackbar = true
          this.snackbarText = this.locationUnavailableError
        }
      },
      trackRide(orderID) {
        this.$http.get(`p2p/v1/vehicle/track/${orderID}`).then(function (response) {
          this.currentRideSatus = response.body
        }).catch(function (error) {
          this.currentRideSatus = {}
        });
      }
    },
    mounted() {
      if (Object.keys(this.getP2PSearchParams).length > 0) {
        this.pickupLocation = this.getP2PSearchParams.pickUpLocation
        this.userDropLocation = this.getP2PSearchParams.dropLocation
        this.selectedPosition = setP2PParams(this.getP2PSearchParams)
        displayLocationRoute(this.selectedPosition)
        this.cabsSearch()
      } else {
        this.initMaps()
      }
      let self = this
      if (yt_adobe.Utils.getUserInfo().loginStatus != "Guest") {
        this.$http.get('p2p/v1/orders/current').then(function (response) {
          if (response.body.status != 404 && response.body.order.id) {
            self.trackRide(response.body.order.id)
          } else {
            self.currentRideSatus = {}
          }
        }).catch(function (error) {
          self.currentRideSatus = {}
        });
      }
    }
  }
</script>

<style scoped>
  .trackride_header {
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
    background-color: white;
    width: 95%;
    margin: 0px;
    height: 50px;
    padding: 5px;
    border-top: 1px solid #ddd;
    margin-left: 8px;
    margin-bottom: 10px;
  }

  #map {
    height: 100vh;
    width: 100%;
  }

  .gm-style-mtc {
    display: none!important
  }

  .icon_center {
    height: 40px;
    width: 40px;
    z-index: 16;
    background-color: white!important;
    border-radius: 50%;
    position: fixed;
    top: 220px;
    right: 5px;
    min-width: 40px;
  }

  .icon_center>.btn__content:before {
    background-color: white!important;
  }

  .icon_center_location {}
</style>