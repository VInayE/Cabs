<template>
  <v-layout row wrap class="selfHome">
   <v-flex xs12>
    <div class="cab-trip">
      <v-snackbar class="snacktxt" :timeout="timeout" :bottom="y === 'bottom'" v-model="snackbar">
        {{snackbarText}}
        <v-btn flat class="txt_white" @click.native="snackbar = false">Close</v-btn>
      </v-snackbar>
      <v-layout row class="mgr_top_15">
        <v-flex xs12>
          <small class="c-BD">Location</small><br/>
          <input type="text" :value="pickUplocationSelf" @click.stop="openPickUpDialog()" class="text-elps">
        </v-flex>
        <location-search-view v-if="pickUpDialog"
            :pickUpDialog="pickUpDialog"
            :pickUpDialogOption="'rentalTxt'"
            @selectedPlace="getPickupCity($event.city);
                pickUpDialog=false;
                latitude= $event.latitude;
                longitude= $event.longitude;
                pickUplocationSelfSelected=true;
                pickUplocationSelf=$event.address;"
            @closeLocationPopUp="pickUpDialog=false">
        </location-search-view>
      </v-layout>
      <!-- <v-layout row class="mgr_top_15">
        <v-flex xs5>
            <small class="c-BD">City</small><br/>
            <input type="text" @click.stop="cityFill()" placeholder="Enter City" :value="pickupCitySelf.name">
            <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
              <v-card>
                <v-toolbar dark class="white city_header">
                    <v-btn icon @click.native="dialog = false" dark style="padding-left:14px;margin:0px;">
                      <v-icon style="color:#616161;">arrow_back</v-icon>
                    </v-btn>
                </v-toolbar>
                <app-city-list v-if="cityList.length > 0"
                  :selectedCabTripOtion="selectedOption"
                  :selectedtCityOption="'origin'"
                  :displayedCityList="cityList"
                  :focusAttr="dialog"
                  @citySelected="pickupCitySelf = $event; dialog=false">
                </app-city-list>
              </v-card>
            </v-dialog>
        </v-flex>
      </v-layout> -->
      <v-layout row class="mgr_top_15">
        <v-flex xs6>
            <small class="c-BD">Pickup Date</small><br/>
            <v-dialog persistent v-model="model" lazy full-width class="calender">
              <v-text-field slot="activator" label=""  v-model="pickupDate"  @click="adobeAnanlyticsDate()" readonly class="date-field"></v-text-field>
              <v-date-picker v-model="e8" scrollable :allowed-dates="allowedDates" :autosave="true">
                  <template scope="{ save, cancel }">
                  <v-card-actions>
                    <v-btn flat primary @click.native="cancel()">Cancel</v-btn>
                    <v-btn flat primary @click.native="save()">Save</v-btn>
                  </v-card-actions>
                </template>
              </v-date-picker>
            </v-dialog>
        </v-flex>
        <v-flex xs6 class="text-xs-right" brd-right>
            <small class="c-BD">Pickup Time</small><br/>
            <v-dialog  persistent v-model="model3" class="time margin" lazy>
              <v-text-field slot="activator" class="txt-right date-field" label="" v-model="e10" readonly @click="adobeAnanlyticsTime()"></v-text-field>
              <v-time-picker v-model="e10" actions :autosave="true">
                <template scope="{ save, cancel }">
                  <v-card-actions>
                    <v-btn flat primary @click.native="cancel()">Cancel</v-btn>
                    <v-btn flat primary @click.native="save()">Save</v-btn>
                  </v-card-actions>
                </template>
              </v-time-picker>
            </v-dialog>
        </v-flex>
      </v-layout>
      <v-layout row wrap class="mgr_top_15">
        <v-flex xs6 >
          <small class="c-BD">Return Date</small><br/>
          <v-dialog persistent v-model="model2" lazy full-width class="calender">
            <v-text-field slot="activator" label="" v-model="dropDate" readonly class="date-field" @click="adobeAnanlyticsDate()"></v-text-field>
            <v-date-picker v-model="e9" scrollable :allowed-dates="allowedDates" :autosave="true">
              <template scope="{ save, cancel }">
                <v-card-actions>
                  <v-btn flat primary @click.native="cancel()">Cancel</v-btn>
                  <v-btn flat primary @click.native="save()">Save</v-btn>
                </v-card-actions>
              </template>
            </v-date-picker>
          </v-dialog>
        </v-flex>
        <v-flex xs6 class="text-xs-right" brd-right>
            <small class="c-BD">Return Time</small><br/>
            <v-dialog persistent v-model="model5" class="time" lazy>
              <v-text-field slot="activator" label="" v-model="e11" class="txt-right date-field txt-r" readonly  @click="adobeAnanlyticsTime()"></v-text-field>
              <v-time-picker v-model="e11" actions :autosave="true">
                  <template scope="{ save, cancel }">
                  <v-card-actions>
                    <v-btn flat primary @click.native="cancel()">Cancel</v-btn>
                    <v-btn flat primary @click.native="save()">Save</v-btn>
                  </v-card-actions>
                </template>
              </v-time-picker>
            </v-dialog>
        </v-flex>
      </v-layout>
      <loader-view v-if="ajaxLoadingDialog"></loader-view>
      <footer>
        <app-cab-footer @getSRPdetails="getDetails($event)"></app-cab-footer>
      </footer>
    </div>
    </v-flex>
  </v-layout>
</template>
<script>

import router from '../../../router'
import cabFooter from './selfDriveFooter'
import * as types from '../../../store/types'
import { mapGetters,mapMutations } from 'vuex'
import { eventBus } from '../../../utils/eventBus'
import { adobeAnalyticsPageView } from '../../../helpers/adobeAnalytics'

var moment = require('moment')

export default {
  props:['selectedOption'],
  data () {
    return {
      ex8: 'ROUND TRIP',
      snackbar: false,
      snackbarText:'',
      timeout: 3000,
      y: 'bottom',
      rentalPackageId: 1,
      e9: null,
      e8:null,
      e10: null,
      e11: null,
      model: false,
      ajaxLoadingDialog: false,
      pickUpDialog: false,
      model2: false,
      model3: false,
      //model4: false,
      model5: false,
      //dialog: false,
      //dialog1: false,
      //dialog2: false,
      latitude:'',
      longitude:'',
      //validated: 0,
      allowedDates: null,
      pickupCitySelf: {},
      dropCity: '',
      cabSelectedOption: '' ,
      pickUplocationSelf: 'Enter nearby landmarks or address',
      pickUplocationSelfSelected: false,
      rentalPackages:{},
      response:{},
      attached: false,
      address: '',
      cityList:[],
      cityListUrl: 'v1.2/cities',
      getHourlyPackageId: 'v1/hourly/packages',
      txtNearbyLocation: 'Enter nearby landmarks or address',
      txtAjaxError: 'Some error occured please try later',
      txtChoosePickup: 'Please choose pickupup address',
      txtNoCabsAvailable: 'No Car Available for choosen criteria',
      pickupDate:'',
      dropDate:'',
      offDays: function (date) {
        return date.getTime() > Date.now()
      }
    }
  },
  components: {
    appCabFooter: cabFooter,
    LoaderView : () => import('../../common/loader'),
    /* removing as not needed */
    //appCityList : () => import('./selfDriveCityList'),
    LocationSearchView : () => import('../../common/locationSearchView')
  },
  computed: {
    ...mapGetters({
      getSdSearchParams: types.GET_SD_SEARCH_PARAMS
    }),
    hideRound () {
      return {
        hideround: this.attached
      };
    }
  },
  mounted () {
    var self = this
    self.allowedDates = self.offDays
    //allowedDates have function defintion


    if(Object.keys(self.getSdSearchParams).length > 0) {
          self.pickUplocationSelfSelected = true
          self.pickUplocationSelf = self.getSdSearchParams.pickUplocationSelf
          self.pickupCitySelf = self.getSdSearchParams.pickUpcityData
          self.latitude = self.getSdSearchParams.latitude
          self.longitude = self.getSdSearchParams.longitude
    } else{
       if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(self.showPosition,this.showErrorPosition)
    } else {
        self.snackbar = true
        self.snackbarText= "Location can't be loaded"
    }
    }
  },
  created() {
    if( Object.keys(this.getSdSearchParams).length > 0 ) {
        this.e8 = this.getSdSearchParams.completePickupDate
        this.e9 = this.getSdSearchParams.completeDropDate
        this.pickupDate = this.getSdSearchParams.pickUpDate
        this.dropDate = this.getSdSearchParams.returnDate
        this.e10 = this.getSdSearchParams.pickUpTime
        this.e11 = this.getSdSearchParams.dropTime
    } else {
      this.e8= moment().format('YYYY-MM-DD');
      this.e9= moment().add(1, 'days').format('YYYY-MM-DD');
      this.pickupDate = this.formatdate(this.e8)
      this.dropDate = this.formatdate(this.e9)
      this.e10= moment().startOf('hour').add(5, 'hours').format('LT');
      this.e11= moment().startOf('hour').add(5, 'hours').format('LT');
    }
    this.ajaxHit()
    let self = this
    eventBus.$on('updatePickupLocation',(data) => {
      if(this.getSdSearchParams &&  Object.keys(this.getSdSearchParams).length == 0 ){
          self.getFormattedAddress(data.pickupLatitude, data.pickUpLongitude)
      }
    })
  },
  watch: {
    e8(){
      this.e9= moment(this.e8).add(1, 'days').format('YYYY-MM-DD')
      this.pickupDate = this.formatdate(this.e8)
      this.dropDate = this.formatdate(this.e9)
    },
    e9(){
         this.dropDate = this.formatdate(this.e9)
    },
    e10 () {
      if(this.e10!=null && this.e10.split(' ').length==1){
        this.e10 = this.e10.substring(0,this.e10.length-2)+' '+this.e10.substring(this.e10.length-2,this.e10.length).toUpperCase()
      }
    },
    e11 () {
      if(this.e11!=null && this.e11.split(' ').length==1){
        this.e11 =  this.e11.substring(0,this.e11.length-2)+' '+this.e11.substring(this.e11.length-2,this.e11.length).toUpperCase()
      }
    },
    selectedOption () {
      this.cabSelectedOption = this.selectedOption
    }
  },
  methods: {
    ...mapMutations({
        setSdSearchParams: types.SET_SD_SEARCH_PARAMS,
        setSdSRPData: types.SET_SD_SRP_DATA
    }),
     showErrorPosition(errr){
      console.log('error')
    },
    showPosition(position) {
      this.getFormattedAddress(position.coords.latitude,position.coords.longitude)
    },
    //Adobe changes needs to be checked @Ravinder
    adobeAnanlyticsDate () {
      if(this.selectedOption === 'local') {
        adobeAnalyticsPageView('yt:hourly cab:book ride:date','hourly cab','business','hourly cab book ride','select date','','')
      } else {
        adobeAnalyticsPageView('yt:outstation cab:book ride:date','outstation cab','business','outstation cab book ride','select date','','')
      }
    },
    openPickUpDialog () {
      this.pickUpDialog=true
      if(this.selectedOption === 'local'){
          adobeAnalyticsPageView('yt:hourly cab:book ride:pickup location','hourly cab','business','hourly cab book ride','select pickup location','','')
      } else {
          adobeAnalyticsPageView('yt:outstation cab:book ride:pickup location','outstation cab','business','outstation cab book ride','select pickup location','','')
      }
    },
    adobeAnanlyticsTime () {
      if(this.selectedOption === 'local') {
          adobeAnalyticsPageView('yt:hourly cab:book ride:time','hourly cab','business','hourly cab book ride','select time','','')
      } else {
        adobeAnalyticsPageView('yt:outstation cab:book ride:time','outstation cab','business','outstation cab book ride','select time','','')
      }
    },
    cityFill () {
      var self = this
      if(self.pickupCitySelf.name == '' || self.pickupCitySelf.name == undefined) {
        self.snackbar = true
        self.snackbarText= self.txtChoosePickup
      }
      else {
        self.dialog = true
      }
    },
    changeCityLocation () {
      var changeCityIcon = document.getElementById('changeCityIcon')
      changeCityIcon.style.animation="unset"
      let self = this
      setTimeout(function(){
        changeCityIcon.style.webkitAnimation = "rotate 1s";
        changeCityIcon.style.animation = "rotate 1s"
        let temp = self.dropCity
        self.dropCity = self.pickupCitySelf
        self.pickupCitySelf = temp
      },10);
    },
    ajaxHit () {
      var self = this;
      this.$http.get(self.cityListUrl).then(function (response) {
          self.cityList = response.data.cities
          self.dropCity = Object.keys(self.getSdSearchParams).length > 0 ? this.getSdSearchParams.dropCitydata : []
      }).catch(function (error) {
          self.snackbar = true
          self.snackbarText= self.txtAjaxError
      });
      this.$http.get(self.getHourlyPackageId).then(function (response){
          self.rentalPackages = response.body.packages
      }).catch(function(error){
          self.snackbar = true
          self.snackbarText= self.txtAjaxError
      })
    },
    formatdate (date) {
      date = date.replace(/-/g,'/')
      date = new Date(date).toString()
      date = date.split(' ')
      return date[0]+', '+date[1]+' '+date[2]
    },
    getDateDetails (date,time) {
      date = date.replace(/-/g,'/')
      let convertedTime = moment(time , ["h:mm A"]).format("HH:mm")
      let dateTime = new Date(date+' '+convertedTime);
      return Date.parse(dateTime)
    },
    getDetails (event) {
      var self = this
      if (!this.pickUplocationSelfSelected) {
        this.snackbar = true
        this.snackbarText = this.txtChoosePickup
        return false
      }
      if(this.pickupCitySelf == '') {
        this.snackbar = true
        this.snackbarText = 'Choose Pickup city'
        return false
      }
      let searchedData = {
        "query":{
            "start_time": this.getDateDetails(this.e8,this.e10),
            "end_time": this.selectedOption === 'local' ? 0 : this.getDateDetails(this.e9,this.e11),
            "travel_type": 'self_drive',
            "start": {
                "address": this.pickUplocationSelf,
                "city": this.pickupCitySelf.name,
                "latitude": this.latitude, //this.latitude, 12.934343
                "longitude": this.longitude //this.longitude, 77.610761
            }
            //need to remove hardcoding later
        }
      }
      this.ajaxLoadingDialog = true
      Vue.http.headers['content-type'] = 'application/json'
      Vue.http.options.emulateJSON = false
      Vue.http.headers.common['YT-TENANT-CODE'] = '1795'
      Vue.http.headers.common['YT-CHANNEL'] = 'SDPWA'
      // making request
      this.$http.post('v1.2/search',searchedData).then(function (response) {
        if(response.body.vehicle_vendor_plans.length === 0){
          self.snackbar = true
          self.snackbarText = self.txtNoCabsAvailable
          self.ajaxLoadingDialog = false
        }else {
          let searchParams = {
            'pickupCitySelf':self.pickupCitySelf.name,
            'dropCity':self.dropCity.name,
            'pickUpDate':self.pickupDate,
            'returnDate':self.dropDate,
            'pickUplocationSelf':self.pickUplocationSelf,
            'completePickupDate':self.e8,
            'completeDropDate':self.e9,
            'pickUpTime':self.e10,
            'dropTime':self.e11,
            'dropCitydata': self.dropCity,
            'latitude': this.latitude,
            'longitude':this.longitude,
            'pickUpcityData': self.pickupCitySelf,
            'hourly_package_id': self.selectedOption === 'local' ? self.rentalPackages[this.rentalPackageId-1] : ''
          }
          self.setSdSearchParams(searchParams)
          self.setSdSRPData(response.body)
          router.push( {name:'SelfDriveSRP'} )
          self.ajaxLoadingDialog = false
        }
      }, function (response) {
        self.ajaxLoadingDialog = false
        self.snackbar = true
        self.snackbarText =  response.body.message ? response.body.message : 'Some error occured please again later'
      });
    },
    formatTime (time) {
      if(!time.split(' ').length>1){
        return time.substring(0,time.length-2)+' '+time.substring(time.length-2,time.length).toUpperCase()
      } else{
        return time
      }
    },
    getPickupCity (cityName) {
      let self = this
      this.pickUplocationSelfSelected = true
      this.$http.get('v1.2/cities?q='+cityName).then(function (response) {
            if(response.data.cities.length>0){
              self.pickupCitySelf = response.data.cities[0]
            }else{
              self.pickupCitySelf = ''
            }
      }).catch(function (error) {
          self.pickupCitySelf = ''
      });
    },
    getFormattedAddress (latitutde,longitude) {
      this.latitude = latitutde;
      this.longitude = longitude;
      let self = this
      this.searchedLatitude =latitutde.toString()+','+longitude.toString()
      Vue.http.headers.common={}
      this.$http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.searchedLatitude}&sensor=true`).then(function (response) {
            self.pickUplocationSelf = response.body.results[0].formatted_address
            self.getPickupCity(response.body.results[0].address_components[6].long_name)
        }).catch(function (error) {
            self.pickUplocationSelf =  'Enter nearby landmarks or address'
      });
    }
   }
  }
</script>

<style scoped>
 @keyframes rotate {
    from {
        -moz-transform: rotate(0deg);
        -webkit-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    to {
        -moz-transform: rotate(360deg);
        -webkit-transform: rotate(360deg);
        -o-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        transform: rotate(360deg);
    }

}

     .text-xs-right{
       text-align:right
     }
     .mgr_top_15{
       margin-top:15px;
       border-bottom: 1px solid #efefef;
       padding-bottom: 10px;
     }

    .icon_way{
      height: 40px;
      width: 40px;
      cursor: pointer;
      border: 1px solid rgb(30, 136, 229);
      background-color: rgb(255, 255, 255);
      border-radius: 50%;
      padding: 7px;
      margin: 0 auto;
    }

    .icon_way > i {
      color:rgb(30, 136, 229)
    }
    .input-group {
        margin: 0;
    }
    .subheader {
        padding: 0;
        height: 30px;
        font-weight: normal;
    }
    .trip-type {
    height: 70px;
    }
    .brd-right {
        border-left: 1px solid #BDBDBD;
    }
    .from-to,.p15 {
        padding: 10px 0;
    }
    .c-BD {
        color: #BDBDBD;
        font-size: 12px;
        font-weight: 400;
        letter-spacing: 0.011em;
        line-height: 20px;
    }
    .calender , .time{
        height: 20px;
        width: 100%;
    }
    .hideround {
        display: none;
    }
    .input-group {
        padding: 0;
    }
    .txt-right {
        text-align: right;
    }
    .txt_please_wait{
       color: grey;
       line-height: 2;
    }
    .text-elps{
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .selfHome {
    padding:0 10px;
    background-color:white;
  }
  .margin{
    margin-left:-12px;
  }
</style>
