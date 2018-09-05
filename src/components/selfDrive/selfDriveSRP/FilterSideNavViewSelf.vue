<template>
  <v-navigation-drawer
    persistent
    v-model="right"
    light
    right
    enable-resize-watcher
    overflow
    absolute
    v-bind:class="{ fullWidth: drawerRight, zeroWidth:!drawerRight }"
    class="filter_side_nav">
      <v-layout row wrap class="filter_btn optn_filter">
        <v-flex xs5 class="txt_filters">
           <span class="icon_arrow_back"><v-icon class="cl_white_back" @click="closeDrawer">arrow_back</v-icon></span>
            Filters
        </v-flex>
        <v-flex xs7 class="text-right">
          <span class="txt_reset" @click="resetFilters">RESET</span>
          <v-btn class="hv_book_btn" light @click="applyFilters">APPLY</v-btn>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs3 class="filter_option_selection">
          <v-layout row wrap @click="selectedFilterOption = 'Fuel'" v-bind:class="{ filterOptionSelected: selectedFilterOption == 'Fuel'}">
            <i class="tickIcon f_tc" v-if="fuel_type"></i>
            <p class="center-icon"><i class="payment-icon"></i></p>
            <p class="">Fuel Type</p>
          </v-layout>
          <v-layout row wrap @click="selectedFilterOption = 'carType'" v-bind:class="{ filterOptionSelected: selectedFilterOption == 'carType'}">
            <i class="tickIcon c_tc" v-if="car_type"></i>
            <span class="center-icon"><i class="vender-icon"></i></span>
            Car Type
          </v-layout>
          <!-- Needs to be handle in Phase 2 -->
          <!-- <v-layout row wrap @click="selectedFilterOption = 'sitePoint'" v-bind:class="{ filterOptionSelected: selectedFilterOption == 'sitePoint'}">
            <span class="center-icon"><i class="vender-icon"></i></span>
            Site Point
          </v-layout> -->
          <v-layout row wrap @click="selectedFilterOption = 'carName'" v-bind:class="{ filterOptionSelected: selectedFilterOption == 'carName'}">
            <i class="tickIcon c_tnc" v-if="car_name"></i>
            <span class="center-icon"><i class="vender-icon"></i></span>
            Car Name
          </v-layout>
          <v-layout row wrap @click="selectedFilterOption = 'vendorName'" v-bind:class="{ filterOptionSelected: selectedFilterOption == 'vendorName'}">
            <i class="tickIcon" v-if="car_vendor"></i>
            <span class="center-icon v_tc"><i class="vender-icon"></i></span>
            Car Vend...
          </v-layout>
        </v-flex>
        <v-flex xs9 class="avl_filter_option">
           <v-layout row wrap class="filter_btn tank-type" v-show="selectedFilterOption == 'Fuel'">
<!--               <v-radio-group class="rental_packages" v-model="ex5" row>-->
<!--
                 <v-flex xs12 v-for="(adFilter, index) in fuelType" :key="index" class="pdl12" @click="ex5=adFilter._value">
                   <v-layout row wrap>
                     <v-flex xs10 class="lh_4 fs-12">{{adFilter.name}}</v-flex>
                     <v-flex xs2>
                        <v-radio class="radio_text right" :value="adFilter._value" color="primary" ></v-radio>
                     </v-flex>
                  </v-layout>
                </v-flex>
-->             
               
               <div class="sub-head">FUEL</div>
               <v-flex xs12 v-for="(adFilterFuel, index) in fuelIncluded" :key="index" class="pl12">
              <v-layout row wrap>
                <v-flex xs10 lh_4>{{adFilterFuel.name}}</v-flex>
                <v-flex xs2 class="vender-check">
                  <v-checkbox v-model="ex10" color="primary" :id="adFilterFuel.name" :value="adFilterFuel._value" v-on:change="fuelTypeValue()"></v-checkbox>
                </v-flex>
              </v-layout>
            </v-flex>
             
             <div class="sub-head">TRANSMISSION</div>
             <v-flex xs12 v-for="(transmission) in transmissionType" class="pl12">
              <v-layout row wrap>
                <v-flex xs10 lh_4>{{transmission.name}}</v-flex>
                <v-flex xs2 class="vender-check">
                  <v-checkbox v-model="ex11" color="primary" :id="transmission.name" :value="transmission._value" v-on:change="fuelTypeValue()"></v-checkbox>
                </v-flex>
              </v-layout>
            </v-flex>  
               
            <div class="sub-head">FUEL TYPE</div>
                <v-flex xs12 v-for="(adFilter) in fuelType" class="pl12">
                  <v-layout row wrap>
                    <v-flex xs10 lh_4>{{adFilter.name}}</v-flex>
                    <v-flex xs2 class="vender-check">
                      <v-checkbox v-model="ex5" color="primary" :id="adFilter.name" :value="adFilter.name" v-on:change="fuelTypeValue()"></v-checkbox>
                    </v-flex>
                  </v-layout>
                </v-flex>       
               
<!--
                <v-layout row wrap>
                 <v-flex xs12 v-for="(adFilterFuel, index) in fuelIncluded" :key="index" class="pdl12" @click="ex5=adFilterFuel._value">
                   <v-layout row wrap>
                     <v-flex xs10 class="lh_4 fs-12">{{adFilterFuel.name}}</v-flex>
                     <v-flex xs2>
                        <v-radio class="radio_text right" :value="adFilterFuel._value" color="primary" ></v-radio>
                     </v-flex>
                  </v-layout>
                </v-flex>
                </v-layout>
-->
<!--             </v-radio-group>-->
          </v-layout>
          <v-layout row wrap class="option_advance filter_btn" v-show="selectedFilterOption == 'carType'">
             <v-layout row wrap class="pdl12">
                <v-flex xs10 lh_4>Select All</v-flex>
                <v-flex xs2 class="vender-check">
                  <v-checkbox v-model="selectCarType" color="primary" v-on:change="carTypeChange()"></v-checkbox>
                </v-flex>
            </v-layout>
            <v-flex xs12 v-for="(carType1, index) in carType" :key="index" class="pdl12">
              <v-layout row wrap>
                <v-flex xs10 lh_4>{{carType1}}</v-flex>
                <v-flex xs2 class="vender-check">
                  <v-checkbox v-model="ex6" color="primary" :id="carType1" :value="carType1" v-on:change="carTypeChangeValue()"></v-checkbox>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <!-- Needs to be handle in Phase 2 -->
          <!-- <v-layout row wrap class="option_advance filter_btn" style="padding-bottom:15px;" v-show="selectedFilterOption == 'sitePoint'">
            <v-radio-group class="rental_packages" v-model="ex7" row>
              <v-layout row wrap>
                <v-flex xs12 v-for="(sitePoints, index) in sitePointName" :key="index" class="pdl12"  @click="ex5=adFilter._value">
                  <v-layout row wrap>
                    <v-flex xs10 class="lh_4 fs-12">{{sitePoints.name}}</v-flex>
                    <v-flex xs2 style="margin-top:5px;">
                      <v-radio class="radio_text right" :value="sitePoints._value" color="primary" ></v-radio>
                    </v-flex>
                </v-layout>
              </v-flex>
              </v-layout>
            </v-radio-group>
          </v-layout> -->
          <div class="scroll-tab">
          <v-layout row wrap class="option_advance filter_btn" v-show="selectedFilterOption == 'carName'">
             <v-layout row wrap class="pdl12">
                <v-flex xs10 lh_4>Select All</v-flex>
                <v-flex xs2 class="vender-check">
                  <v-checkbox v-model="selectCarName" color="primary" v-on:change="carNameChange()"></v-checkbox>
                </v-flex>
            </v-layout>
            <v-flex xs12 v-for="(carName1, index) in carName" :key="index" class="pdl12">
              <v-layout row wrap>
                <v-flex xs10 lh_4>{{carName1}}</v-flex>
                <v-flex xs2 class="vender-check">
                  <v-checkbox  v-model="ex8" color="primary" :id="carName1" :value="carName1" v-on:change="carNameChangeValue()"></v-checkbox>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </div>
          <v-layout row wrap class="option_advance filter_btn" v-show="selectedFilterOption == 'vendorName'">
            <v-flex xs12 v-for="(vendor, index) in vendorNameId" :key="index" class="pdl12">
              <v-layout row wrap>
                <v-flex xs10 lh_4>{{vendor[0]}}</v-flex>
                <v-flex xs2 class="vender-check">
                  <v-checkbox v-model="ex9" color="primary" :id="vendor[0]" :value="vendor[1]"></v-checkbox>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-navigation-drawer>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import * as types from '../../../store/types'
  import { adobeAnalyticsPageView } from '../../../helpers/adobeAnalytics'
   export default {
     props: ['drawerRight', 'vendorNameId'],
     data () {
       return {
         right: false,
         selectedFilterOption: 'Fuel',
         ex5: [],
         ex6: [],
         ex7: '',
         ex8: [],
         ex9: [],
         ex10:[],
         ex11:[],   
         checked:true,
         fuel_type:false,
         car_type:false,
         car_name:false,
         car_vendor:false,
         selectCarType:false,
         selectCarName:false,
         carType: [],
         carName: [],
         //sitePointName: [],
         vendorName: [],
         filterParams: {},
         cabsVendorDetails: [],
         fuelType: [
            {'name': 'Diesel', '_value': 'Diesel', 'isSelected': false},
            {'name': 'Petrol', '_value': 'Petrol', 'isSelected': false}
         ],
         fuelIncluded: [
            {'name': 'Included', '_value': 'true', 'isSelected': false},
            {'name': 'Excluded', '_value': 'false', 'isSelected': false},
         ],
         transmissionType: [
            {'name': 'Automatic', '_value': 'automatic', 'isSelected': false},
            {'name': 'Manual', '_value': 'manual', 'isSelected': false},
         ]  
       }
     },
     computed: {
        ...mapGetters({
           getSRPFilterOptions: types.GET_SD_SRP_FILTER_OPTIONS,
           getcabsSRPData: types.GET_SD_SRP_DATA,
        })
     },
     mounted () {
       var self = this
       self.cabsVendorDetails = self.getcabsSRPData.vendors

       let filter = !self.getSRPFilterOptions && Object.keys(self.getSRPFilterOptions) ? [] : self.getSRPFilterOptions
       self.ex5 = filter ? Object.keys(filter).length >= 0 && filter.advance ? filter.advance : [] : []
       self.ex6 = filter ? Object.keys(filter).length >= 0 && filter.vendor ? filter.vendor : [] : []

       // preparing car vendors names array
       if (self.vendorNameId.length > 0) {
         self.vendorNameId.forEach(function(value, index) {
           self.vendorName.push(value[0])
         })
       }
       else {

       }


       // preparing car names, types and site array
       if(Object.keys(self.getcabsSRPData).length > 0 && self.getcabsSRPData.vehicle_vendor_plans && self.getcabsSRPData.vehicle_vendor_plans.length > 0) {
         self.getcabsSRPData.vehicle_vendor_plans.forEach(function(value, index) {
           self.carName.push(value.vehicle.model)
           //self.sitePointName.push(value.vendor_plans.available_pickup_sites)
           if(self.carType.includes(value.vehicle.category)) {
             // do nothing
           }
           else {
            if(value.vehicle.category != null){
                self.carType.push(value.vehicle.category)
            }

           }
         })
       }
       else {

       }

     },
     methods: {
       ...mapMutations({
         setSRPFilterOptions : types.SET_SD_SRP_FILTER_OPTIONS
       }),
       closeDrawer(){
         this.right = false
         this.$emit('closeSideNav', false)
       },
       applyFilters () {
         this.toCheckSrpFilterIcon()
         if(this.ex5 == '' || this.ex6.length == 0 || this.ex7 == '' || this.ex8.length == 0 || this.ex9.length == 0 || this.ex10.length == 0 || this.ex11.length == 0) {
           let fuelT = this.ex5 != '' ?  [[this.ex5]] : []
           let fuelTypeInEx = this.ex10 != '' ?  [[this.ex10]] : []
           let transmis = this.ex11 != '' ?  [[this.ex11]] : []
           let carT = this.ex6.length > 0 ?  [this.ex6] : []
           let siteP = this.ex7 != '' ?  [this.ex7] : []
           let carN = this.ex8.length > 0 ?  [this.ex8] : []
           let vendorN = this.ex9.length > 0 ?  [this.ex9] : []
           this.filterParams = {'fueltype': fuelT ,'transmission': transmis, 'fueltypeinc': fuelTypeInEx,'cartype': carT, 'sitepoint': siteP, 'carname': carN, 'vendorname': vendorN}
           this.$emit('appliedFilter', this.filterParams)

         } else {
           this.filterParams = {'fueltype': [], 'fueltypeinc': [], 'cartype': [], 'sitepoint': [], 'carname': [], 'vendorname':[],'transmission':[]}

           this.$emit('appliedFilter', this.filterParams)
         }

         this.setSRPFilterOptions(this.filterParams)
         this.right = false
         this.$emit('closeSideNav', false)
       },
       toCheckSrpFilterIcon(){
          if(this.ex5 == '' && this.ex6.length == 0 && this.ex7 == '' && this.ex8.length == 0 && this.ex9.length == 0 && this.ex10.length == 0 && this.ex11.length == 0){
                this.$emit('applySrpIcon',false)
          }
          else{
                this.$emit('applySrpIcon',true)
          }
       },
       resetFilters () {
         this.ex5 = []
         this.ex6 = []
         this.ex7 = ''
         this.ex8 = []
         this.ex9 = []
         this.ex10 = []
         this.ex11 = []   
         this.filterParams = {'fueltype': [], 'cartype': [], 'sitepoint': [], 'carname': [], 'vendorname':[], 'fueltypeinc':[], 'transmission':[]}
         this.$emit('appliedFilter', this.filterParams)
       },
       carTypeChange(){
            if(this.selectCarType){
                for(var i=0;i<this.carType.length ;i++){
                    this.ex6.push(this.carType[i])
                    this.car_type = true
                }
            }
            else{
                this.ex6 = []
            }
       },
       fuelTypeValue(){
           if(this.ex5.length == this.fuelType.length){
              this.selectCarType = true

            }else{
                this.selectCarType = false
                this.fuel_type = true
            }
       },
       carTypeChangeValue(){
           if(this.ex6.length == this.carType.length){
              this.selectCarType = true

            }else{
                this.selectCarType = false
                this.car_type = true
            }
       },
       carNameChange(){
            if(this.selectCarName){
                for(var i=0;i<this.carName.length ;i++){
                this.ex8.push(this.carName[i])
                this.car_name = true
                }
            }else{
                this.ex8 = []
            }
       },
       carNameChangeValue(){
           if(this.ex8.length == this.carName.length){
              this.selectCarName = true
            }else{
                this.selectCarName = false
                this.car_name = true
            }
       }
     },
     watch: {
       drawerRight () {
         this.right = this.drawerRight
          adobeAnalyticsPageView (
          "yt:self drive:checkout:srp:filter",
          "self drive",
          "app android/app ios/pwa",
          "business",
          "self drive checkout",
          "srp",
          "filter")
       },
       right () {
         this.$emit('closeSideNav', this.right)
       },
        ex5(){
         if(this.ex5 == ""){
           this.fuel_type = false
         }
         else{
           this.fuel_type = true
         }
       },
        ex10(){
         if(this.ex10 == ""){
           this.fuel_type = false
         }
         else{
           this.fuel_type = true
         }
       },
        ex11(){
         if(this.ex11 == ""){
           this.fuel_type = false
         }
         else{
           this.fuel_type = true
         }
       },
       ex6(){
         if(this.ex6.length){
           this.car_type = true
         }
         else{
           this.car_type = false
         }
       },
        ex8(){
         if(this.ex8.length){
           this.car_name = true
         }
         else{
           this.car_name = false
         }
       },
        ex9(){
         if(this.ex9.length){
           this.car_vendor = true
         }
         else{
           this.car_vendor = false
         }
       }
     }
   }
</script>

<style scoped>
   .filterOptionSelected{
     background-color:white; padding-left: 0 !important;
   }
   .avl_filter_option{
     background-color:#fff;
   }
   .filter_option_selection{
     background-color:rgb(245, 245, 245);
     color:rgb(158, 158, 158);
     height: calc(100vh - 56px);
   }
   .filter_option_selection  > div{
     display: flex;
     align-items: center;
     justify-content: center;
     padding-left: 0%;
     font-size: 12px;
     text-transform: uppercase;
       padding-bottom: 8px;
   }
   .txt_reset{
     font-size: 14px;
     font-weight: 500;
     position: relative;
     top: 8px;
   }
   .txt_filters{
     font-size:18px;
     font-weight:500;
     margin-top:15px;
     font-weight: bold;
     color: #333;
   }
   .optn_filter{
     height: 56px;
     box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
   }
   .icon_arrow_back{
     padding-left:14px;
   }
   .cl_white_back{
     font-size:25px;
     color:#333;
   }
   .filter_side_nav{
     position:fixed!important;
     height:auto!important;
   }
   .vendor_img{
     width:100%;
     height:auto;
     margin-right:0px;
     margin-top:20px;
   }
   .lh_4{
     padding: 3px 0 0 4px;
     font-size:12px;
   }
  .pl12{
     padding-left:20px;
     height:33px;
  }
  .sub-head{
        padding: 5px 0 0 16px;
        font-size: 14px;
    }
  .filter_side_nav{
     z-index:11;
     background-color:#efefef!important;
  }
  .btn_reset_filter{
     color:white!important;
     box-shadow:none;
  }
  .txt_filter{
     line-height:3.5;
  }
  .filter_btn{
     background-color:white;
     margin-bottom: 5px;
  }
  .hv_book_btn{
     background-color: #EA2330!important;
     color: white!important;
     box-shadow: none;
     height: 25px;
     border-radius: 5px;
     margin-top: 16px;
  }
  .fullWidth{
     width:100%!important;
  }
  .zeroWidth{
     width:0%!important;
  }
  .vender-check .input-group{
     padding: 0px 0 0;
  }
  .center-icon{
     width: 100%;
     text-align: center;
     margin: 15% 0 0;
  }
  .scroll-tab {
    overflow:scroll;
  }
  .f_tc{
    left: 60px;
    top: 65px;
  }
  .c_tc{
    left: 60px;
    top: 145px;
  }
  .c_tnc{
    left: 60px;
    top: 215px;
  }
  .v_tc{
    left: 60px;
    top: 280px;
  }

</style>
