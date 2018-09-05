<template>
    <v-app>
      <v-tabs dark grow>

        <filter-side-nav-view
          :drawerRight="drawerRight"
          :vendorNameId = "vendorNameId"
          @closeSideNav = "drawerRight = $event"
          @appliedFilter = "filterApplied = $event"
          @applySrpIcon = "applyfilterIconsrp($event)">
        </filter-side-nav-view>

        <v-toolbar class="white fixed_header" dark grow>
           <v-layout row wrap class="layout_header">
              <v-flex xs1 class="header_arrow_back" @click="navigateToSearch">
                  <v-icon>arrow_back</v-icon>
              </v-flex>
              <v-flex xs9>
                  <v-flex xs12 class="header_title_txt">
                    {{toStorePDate}}, {{searchParams.pickUpTime}}
                    <v-icon class="fa_long_icon_exchange">swap_horiz</v-icon>
                    {{toStoreDDate}}, {{searchParams.dropTime}}
                  </v-flex>
                  <v-flex xs12 class="header_subtitle_txt roboto-400">
                    {{searchParams.pickUplocationSelf}}
                  </v-flex>
              </v-flex>
              <v-flex xs1>
                  <v-toolbar-side-icon @click.stop="filterClick()" ></v-toolbar-side-icon>
                  <i class="tickIcon ft" v-if=filter_type></i>
                  <div @click.stop="filterClick()" class="filterIcon"></div>
              </v-flex>
           </v-layout>
        </v-toolbar>

        <div class="approxDistance" v-if="Object.keys(tupleData).length>0">
          <p style="" slot="activator" @click.stop="openDistanceInfoDialog">
            Distance you might travel (approx)
            <span>{{approxDistance}} Kms</span>
            <v-icon class="hv_info_icon">info_outline</v-icon>
          </p>
        </div>

        <distance-info-dialog-view
            :DistanceInfoDialog="DistanceInfoDialog"
            @DistanceInfoDialogClose="DistanceInfoDialog=false"
            @DistanceInfoDialogOpen="updateSrpData($event)"
            :approxdistance="approxDistance">
        </distance-info-dialog-view>
        <div class="noRecord" v-if="Object.keys(tupleData).length == 0">No results found for this filter criteria</div>
        <div class="noRecordFilter" @click.stop="drawerRight = !drawerRight" v-if="Object.keys(tupleData).length == 0">Change Filter</div>  
        <v-tabs-items v-if="Object.keys(tupleData).length>0">
           <home-view
            :srpdata = "srpData"
            :tupledata = "tupleData"
            :approxDistance = "parseInt(approxDistance)"
            :vendorNameId = "vendorNameId"
            @currentPlanKms="approxDistance = $event">
          </home-view>
        </v-tabs-items>

       </v-tabs>
    </v-app>
</template>
<script>
  import router from '../../router'
  import { mapGetters, mapMutations } from 'vuex'
  import * as types from '../../store/types'
  import { adobeAnalyticsPageView } from '../../helpers/adobeAnalytics'

  export default {
    components: {
      HomeView: () => import('../../components/selfDrive/selfDriveSRP/HomeView'),
      FilterSideNavView: () => import('../../components/selfDrive/selfDriveSRP/FilterSideNavViewSelf'),
      DistanceInfoDialogView: () => import('../../components/selfDrive/selfDriveSRP/DistanceInfoDialogView')
    },
    data () {
      return {
        data: [],
        drawerRight: false,
        filterApplied: {},
        toStorePDate: '',
        toStoreDDate: '',
        filter_type: false,
        srpData: [],
        tupleData: [],
        approxDistance: '',
        vendorArr: [],
        vendorNameId: [],
        minDistanceVal: [],
        DistanceInfoDialog: false
      }
    },
    computed: {
      ...mapGetters({
          getSearchParams: types.GET_SD_SEARCH_PARAMS,
          getcabsSRPData: types.GET_SD_SRP_DATA,
          getSRPFilterOptions: types.GET_SD_SRP_FILTER_OPTIONS
      }),
      searchParams () {
        let strrePDate = this.getSearchParams.pickUpDate
        this.toStorePDate = strrePDate.substr(strrePDate.indexOf(",") + 2)
        let strreDDate = this.getSearchParams.returnDate
        this.toStoreDDate = strreDDate.substr(strreDDate.indexOf(",") + 2)
        return this.getSearchParams
      }
    },
    watch: {
      filterApplied () {
        this.applySRPFilter(this.getcabsSRPData, this.filterApplied)
      }

    },
    mounted () {
      var self = this

      // if(self.getSRPFilterOptions) {
      //   self.filterApplied = Object.keys(self.getSRPFilterOptions).length === 0 || !self.getSRPFilterOptions ? {} : self.getSRPFilterOptions
      // }

      // retaining filters on page reload
      if( Object.keys(self.filterApplied).length > 0 ) {
        // calling apply filters function
        self.applySRPFilter(self.getcabsSRPData, self.filterApplied)
      } else {
        // passsing original srpData to HomeView
        self.srpData = self.getcabsSRPData
        self.tupleData = self.getcabsSRPData.vehicle_vendor_plans
      }

      // calculating vendors array
      self.vendorArr = (Object.keys(self.getcabsSRPData).length > 0) ? self.getcabsSRPData.vendors : []
      self.vendorArr.forEach(function (value, index) {
        if(value && value.display_name && value.id) {
          self.vendorNameId.push([value.display_name, value.id])
        }
        else {

        }
      });


      // calculating minDistanceVal
      for(let i = 0; i < self.srpData.vehicle_vendor_plans.length; i++) {
        var minIndex = 0;
        var min = self.srpData.vehicle_vendor_plans[i].vendor_plans[0].plans[0];
        for (let k = 1; k < self.srpData.vehicle_vendor_plans[i].vendor_plans[0].plans.length; k++) {
          if(self.srpData.vehicle_vendor_plans[i].vendor_plans[0].plans[k] != null) {
            if (self.srpData.vehicle_vendor_plans[i].vendor_plans[0].plans[k] < min) {
                min = self.srpData.vehicle_vendor_plans[i].vendor_plans[0].plans[k].kms_included
                minIndex = k
            }
          }
        }
        self.minDistanceVal.push(self.srpData.vehicle_vendor_plans[i].vendor_plans[0].plans[minIndex].kms_included);
        self.approxDistance = Math.min(...self.minDistanceVal)
      }
    },
    methods: {
      ...mapMutations({
        applyFilter: types.SET_SD_SRP_FILTER_OPTIONS
      }),
      navigateToSearch () {
        router.push({name:'CabsHomeView',params:{option:'selfDrive'}})
        adobeAnalyticsPageView (
          "yt:self drive:checkout:srp",
          "self drive",
          "app android/app ios/pwa",
          "business",
          "self drive checkout",
          "srp",
          "")
      },
      filterClick(){
          this.drawerRight = !this.drawerRight
          this.DistanceInfoDialog = false;
      },      
      checking2Darray (value, arr) {
        var a = false
        if ($.inArray(value, $.map(arr, function(v) { return v[0]; })) > -1) {
            a = true
        }
        return a
      },
      checking2D(value, arr){
          var a = false;
       for(var i = 0;i<arr[0][0].length;i++){
           var boolValue = arr[0][0][i]=="false"?false:true;
           if(value==boolValue){
               a = true
           }
       }
          return a;
      },
      applyfilterIconsrp(data){
        this.filter_type = data

      },
      applySRPFilter (data, filter) {
        var self = this
        let filteredData = []
          if(Object.keys(data).length > 0) {
            data.vehicle_vendor_plans.forEach(function(value, index) {
            // Filtering Data
              if ( filter.carname.length > 0 ? self.checking2Darray(value.vehicle.model, filter.carname) : true && filter.cartype.length > 0 ? self.checking2Darray(value.vehicle.category, filter.cartype) : true && filter.fueltype.length > 0 ? self.checking2Darray(value.vehicle.fuel_type, filter.fueltype) : true && filter.vendorname.length > 0 ? self.checking2Darray(value.vendor_plans[0].vendor_id, filter.vendorname) : true &&  filter.fueltypeinc.length > 0 ? self.checking2D(value.vendor_plans[0].plans[0].is_fuel_inclusive, filter.fueltypeinc) : true && filter.transmission.length > 0 ? self.checking2Darray(value.vehicle.transmission_type.toLowerCase(), filter.transmission) : true) {
                filteredData.push(value)
              }
            })
          }
          else {
            return
          }
          self.tupleData = filteredData
          self.srpData = data
      },
      openDistanceInfoDialog () {
        this.DistanceInfoDialog = true
      },
      updateSrpData (value) {
        this.approxDistance = value;
        this.DistanceInfoDialog = false
      }
    },
    beforeDestroy () {
      this.applyFilter(this.filterApplied)
    }
  }
</script>

<style scoped lang="">
   .noRecord{
    margin-top: 200px;
    text-align: center;
    font-weight: 700;    
    }
   .noRecordFilter{
    margin-top: 14px;
    text-align: center;
    font-weight: 700;
    color: skyblue;
    cursor: pointer;
    }
  .txt_search_city {
    font-size: 17px;
    color: #000000;
    font-weight: 500;
  }

  .tabs {
    padding: 0px!important;
  }

  .fa_long_icon_exchange {
    color: #333!important;
    height: 25px;
    width: 25px;
    margin-left:0px;
    margin-right:0px;
    border: 2px solid white;
    border-radius: 50%;
    font-size: 21px;
  }

  .fa_long_icon {
     color:#616161;
     font-size:20px;
  }

  h2,h3 {
    font-size: 16px!important;
    color: rgba(66, 66, 66, 0.82)!important;
    font-weight: bold;
    margin-bottom:0px;
  }

  ul {
    padding-left:0px;
  }

  .tabs__li>a {
     color:white;
  }

  .advance_checkbox {
    background-color: white;
    margin-top: 10px;
    margin-left: 0px;
    padding-left: 15px;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  @media screen and (max-width: 1024px) {
    .mdl-layout__header-row {
      height: 40px;
    }
  }

  a:focus,
  a:hover {
    color: white;
  }

  header span {
    display: block;
    position: relative;
    font-size: 20px;
    line-height: 1;
    letter-spacing: .02em;
    font-weight: 400;
    box-sizing: border-box;
    padding-top: 16px;
  }

  .btn_reset {
    color: white;
    background-color: rgb(244, 67, 54);
    line-height: 2;
    padding: 3px;
    width: auto;
    left: 10px;
    top: 10px;
    padding-left: 15px;
    padding-right: 15px;
  }

  .today {
      color: #bdbdbd;
      margin-right: 5px;
      font-size: 14px;
  }

  .mb5 {
      margin-bottom: 5px;
  }

  .mt98 {
      margin-top: 98px;
  }

  .white.fixed_header.tp60 {
    box-shadow: 0 2px 2px rgba(0,0,0,0.4);
  }

  .header_arrow_back > .icon{
    color:rgb(66, 66, 66)!important;
  }

  .header_title_txt{
    font-size:12px;
    margin-top:0px;
    color:rgba(0, 0, 0, 0.87);
	font-weight: 600;
  }

  .header_subtitle_txt{
    font-size:12px!important;
    color:rgb(158, 158, 158)!important;
    white-space: nowrap;
    width: 60%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .header_arrow_back{
    margin-left:0px!important;
    margin-right:12px!important;
    padding:12px!important;
    font-size:24px!important;
    margin-top:-10px;
    padding-right:0px!important;
    padding-left:10px!important;
  }

  .srp_toolbar>.tabs__wrapper--scrollable>ul{
    background: #333; color: #fff;
  }

  .srp_toolbar>.tabs__wrapper--scrollable>ul li> a{
    color: #fff;
  }

  .approxDistance{
    padding: 10px;
    background-color: #F7F7F7;
  }
	.approxDistance p {
		font-weight: 700;
		font-size: 11px;
		margin-bottom: 0;
	}
	.approxDistance p span {
		color: #2988E6;
		font-size: 14px;
	}
	.approxDistance p i {
		color: #2988E6;
	}
  .cabOption{
    background-color: white;
  }

  .card__title{
    padding: 16px 16px 0; font-size: 22px !important;
  }

  .card__text{
    padding: 16px 16px 0;
  }
  .ft{
    top: 8px;
    right: 2px;
    z-index: 9;
  }
</style>
