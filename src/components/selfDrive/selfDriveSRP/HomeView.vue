<template>
  <v-app class="hv_app">
    <div v-for="(searchDataVendor, index) in srpdata.vendors" :key="index" v-if="Object.keys(tupledata).length>0">
        <div class="hv_list" v-for="(searchData, index1) in tupledata" :key="index1" v-if="searchDataVendor.id == searchData.vendor_plans[0].vendor_id" @click="selectedVehicle = index1" v-bind:class="{active : selectedVehicle == index1}">
          <div>
            <v-layout row wrap @click ="navigateToDetails(index1)">
              <v-flex xs12>
                <v-layout row wrap>
                <v-flex>
                  <div class="hv_cab_name">
                    {{searchData.vehicle.make}} {{searchData.vehicle.model}}
                  </div>
                  <p class="hv_seat_count">
                    {{searchData.vehicle.seat_capacity}} Seats | {{searchData.vehicle.fuel_type}} | {{searchData.vehicle.transmission_type}}
                  </p>
                </v-flex>
                <v-flex>
                  <div class="hv_seat_count txt-r">
                    by {{searchDataVendor.display_name}}
                  </div>
                </v-flex>
                </v-layout>
              </v-flex>
                
              <v-flex xs12 mt15>
                <v-layout row wrap>
                <v-flex xs4>
                  <img :src="searchData.vendor_plans[0].vehicle_image_url" class="hv_image"/>
                </v-flex>
                <v-flex xs5 pl15>
                    <div v-if="searchData.vendor_plans[0].plans[selectedkey].is_fuel_inclusive" class="hv_seat_count">
                    Fuel Included
                  </div>
                  <div v-if="!searchData.vendor_plans[0].plans[selectedkey].is_fuel_inclusive" class="hv_seat_count">
                    Fuel Excluded
                  </div>
                  <!--<div class="hv_seat_count">
                    Doorstep Delievery at &#8377;{{searchData.vendor_plans[0].plans[selectedkey].doorstep_delievery_amount}}
                  </div>-->
                  <div class="hv_seat_count">
                    Extra kms at &#8377;{{searchData.vendor_plans[0].plans[selectedkey].extra_km_charge}}/km
                  </div>
                </v-flex>
                <v-flex xs3>
                  <div class="hv_cab_price">
                    <p class="fs12" v-if="searchData.vendor_plans[0].plans[selectedkey].kms_included != null">{{searchData.vendor_plans[0].plans[selectedkey].kms_included}} kms </p>
                    <p class="fs12" v-if="searchData.vendor_plans[0].plans[selectedkey].kms_included == null">Unlimited Kms</p>  
                      <div class="price" v-if="approxPrice">&#8377;
                        <vue-numeric read-only separator="," v-model="searchData.vendor_plans[0].plans[selectedkey].booking_amount"></vue-numeric>
                      <!--<v-icon @click.stop.prevent="openDialog(index1, $event)" class="hv_info_icon">info_outline</v-icon>-->
                    </div>
                    <div class="price" v-if="isShowMore == index1 && approxPrice==false">&#8377;
                        <vue-numeric read-only separator="," v-model="searchData.vendor_plans[0].plans[selectedkey].booking_amount"></vue-numeric>
                      <!--<v-icon @click.stop.prevent="openDialog(index1, $event)" class="hv_info_icon">info_outline</v-icon>-->
                    </div>
                     <div class="price" v-if="isShowMore != index1 && approxPrice==false">&#8377;<vue-numeric read-only separator="," v-model="searchData.vendor_plans[0].plans[0].booking_amount"></vue-numeric>
                      <!--<v-icon @click.stop.prevent="openDialog(index1, $event)" class="hv_info_icon">info_outline</v-icon>-->
                    </div>
                      <div class="hv_seat_count" v-if="isShowMore == index1">
                      Earn {{searchData.vendor_plans[0].plans[selectedkey].ecash.ecash_earn.display_value}} eCash
                    </div>
                    <div class="hv_seat_count" v-if="isShowMore != index1">
                      Earn {{searchData.vendor_plans[0].plans[0].ecash.ecash_earn.display_value}} eCash
                    </div>
                  </div>
                </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
            <v-layout row v-if="showMore">
              <v-flex class="" v-if="isShowMore !=index1" @click.stop.prevent="isShowMore = index1">
                <p class="hv_show_more">MORE PLANS</p>
              </v-flex>
            </v-layout>
            <v-layout row wrap v-if="isShowMore == index1" >
                <v-flex xs12 hide-block>
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-layout row>
                      <v-flex xs10>By {{searchDataVendor.display_name}}</v-flex>
                      <v-flex xs2> <img :src="searchDataVendor.image_url" class="img-resp"></v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs4 rec-list
                    class="recommendedPlans "
                    v-for="(plansData, index2) in searchData.vendor_plans[0].plans"
                    @click="selectedkey =index2"
                    :key="index2"
                    v-bind:class="{active :isShowMore == index1 && selectedkey == index2 }">
                     <p class="fs12" v-if="plansData.kms_included == 'Unlimited Kms' || plansData.kms_included== null ">
                      Unlimited Kms
                    </p> 
                    <p class="fs12" v-if="plansData.kms_included != null">
                      {{plansData.kms_included}} Kms 
                    </p>

                    <div class="price-14">
                      &#8377;<vue-numeric read-only separator="," v-model="plansData.booking_amount"></vue-numeric>
                    </div>
                  </v-flex>
                </v-layout>
                </v-flex>
              <p v-if="isShowMore == index1" @click="isShowMore = -1" class="hv_show_less"> HIDE </p>
            </v-layout>
          </div>
      </div>
    </div>
    <cab-login-block :openLoginDialog="openLoginDialog" :returnUrl="returnUrl" @closeLoginDialog="openLoginDialog = false"></cab-login-block>
     <loader-view v-if="showLoader"></loader-view>
  </v-app>



</template>
<script>
import router from "../../../router";
import * as types from "../../../store/types";
import { mapGetters, mapMutations } from "vuex";
export default {
  props: [
    "srpdata",
    "tupledata",
    "approxDistance",
    "vendorNameId",
    "currentPlanKms"
  ],
  components: {
    PriceDetailsView: () => import("./PriceDetailsView"),
    CabLoginBlock : () => import('../../cabsLoginPage/cabLoginBlock'),
    LoaderView: () => import('../../common/loader')
  },
  data() {
    return {
      openLoginDialog: false,
      dialog: false,
      isShowMore: -1,
      fareBreakUpDetails: {},
      selectedkey: 0,
      srpdataRecommended: [],
      srpdataPrice: [],
      srpdataPickup: [],
      srpdataKMS: [],
      index8: true,
      showLoader: false,
      selectedVehicle: 0,
      showMore: true,
      dummy: 0,
      emailId:'',
      password:'',
      CabsProductId: 'cabs',
      channel: 'b2c',
      isLoggedIn: false,
      returnUrl: '',
      approxPrice:false    
    };
  },

  mounted() {
    let self = this
    self.isLoggedIn = localStorage.getItem('isLoggedIn')
  },
  watch: {
    approxDistance() {
////      this.selectedkey = 0;
////      this.isShowMore = this.selectedkey;
////      this.index1 = this.selectedkey;   
//      let self = this;
//      let i = 0;
//      self.selectedkey = -1;
//      for (i = 0; i < this.tupledata[0].vendor_plans[0].plans.length - 1; i++) {
//        if (
//          self.approxDistance >= this.tupledata[0].vendor_plans[0].plans[i].kms_included &&
//          self.approxDistance < this.tupledata[0].vendor_plans[0].plans[i + 1].kms_included
//        ) {
//          self.selectedkey = i;
//          break;
//        }
//      }
//      if (self.selectedkey == -1) self.selectedkey = this.tupledata[0].vendor_plans[0].plans.length - 1;
//      this.approxPrice = true    
        
        this.distanceCalculations(this.approxDistance)
    }
  },
  methods: {
    ...mapMutations({
      setSDFareDetails: types.SET_SD_FARE_DETAILS,
      setSDCabType:types.SET_SD_CAB_TYPE,
      setUserInfo:types.SET_USER_INFO
    }),
    activeClass(index1, index2) {
      let customClass = [],
        i = 0;
      if (this.isShowMore == index1 && this.selectedkey == index2) {
        customClass.push("active");
      }
      return customClass;
    },
    openDialog(fareDetailsIndex, event) {
      this.$set(
        this.fareBreakUpDetails,
        "breakUp",
        this.tupledata[fareDetailsIndex].fare_details
      );
      this.dialog = true;
      event.stopPropagation();
    },
    updateShowMore(index) {
      //this.selectedVehicle = index
      this.showMore = !this.showMore;
    },
    navigateToDetails(index) {
      // Adding selected plan to VueX and session
      let self = this;
      this.showLoader = true;
      let storeCabType = {cabType : 'selfDrive'}
      this.setSDCabType(storeCabType)
      // setting detail plans to vueX
      let settingSelectedSDDetails = {
        plan: this.srpdata.vehicle_vendor_plans[index],
        selectedPlan: this.selectedkey
      };


        // navigate to login view
        // post data ye to be decided
        let userLoginParams= {
                includeOptionalParams:true,
                channel:'B2C',
                productId:'SDPWA'
            }
                Vue.http.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
                Vue.http.options.emulateJSON = true;
                this.$http.post('/social/user/userProfile.htm',userLoginParams).then(function (response) {
                  if(response.body.status == 'FAIL') {
                      self.showLoader = false
                      self.openLoginDialog = true
                      self.returnUrl = 'SelfDriveDetails'
                      self.setSDFareDetails(settingSelectedSDDetails);
                  } else{
                      self.setUserInfo(response.body.responseData.userInfo)
                      localStorage.setItem('isLoggedIn', true)
                      self.setSDFareDetails(settingSelectedSDDetails);
                      // booking ID need to be discussed with Som
                      let randNo = Math.floor(100000 + Math.random() * 900000);
                      let bookingID = "YTREV" + plan[vendor_plans][vehicle_id] + "~" + id;
                      router.push({ name: "SelfDriveDetails",query: { Id: bookingID }});
                  }
                }, function (response) {
                  self.showLoader = false
              });


    },
        
    distanceCalculations (value){
        this.minDistanceVal = [];
        for(let i=0;i<this.tupledata.length;i++){
            var toStoreDistance = [];
            for(let j=0;j<this.tupledata[i].vendor_plans[0].plans.length;j++)
                {
                    var firstVal  =  parseInt(value); 
                    var secondVal =  parseInt(this.tupledata[i].vendor_plans[0].plans[j].booking_amount);  
                    var thirdVal  =  this.tupledata[i].vendor_plans[0].plans[j].kms_included==null?0:parseInt(this.tupledata[i].vendor_plans[0].plans[j].kms_included);
                    var fourthVal =  parseInt(this.tupledata[i].vehicle.vehicle_running_cost);
                    var fifthVal  =  parseInt(firstVal) - parseInt(thirdVal)>0?parseInt(firstVal) - parseInt(thirdVal):0;
                    var sixtVal   =  parseInt(this.tupledata[i].vendor_plans[0].plans[j].extra_km_charge);
                    var seventh;
                    if(this.tupledata[i].vendor_plans[0].plans[j].is_fuel_inclusive)
                        {
                            seventh = secondVal+fifthVal*sixtVal;
                        }
                    else
                        {
                            seventh = secondVal+fifthVal*sixtVal+firstVal*fourthVal;
                        }
                            toStoreDistance.push(seventh);

                }
                        var min = toStoreDistance[0];
                        var minIndex = 0;
                        for (let k = 1; k < toStoreDistance.length; k++) {
                            if (toStoreDistance[k] < min) {
                                minIndex = k;
                                min = toStoreDistance[k];
                                
                            }
                        }
                     
                     var storeKms = this.tupledata[i].vendor_plans[0].plans[minIndex].kms_included
                     var storePrice = this.tupledata[i].vendor_plans[0].plans[minIndex].booking_amount
                     this.tupledata[i].vendor_plans[0].plans[minIndex].kms_included = this.tupledata[i].vendor_plans[0].plans[0].kms_included
                     this.tupledata[i].vendor_plans[0].plans[minIndex].booking_amount = this.tupledata[i].vendor_plans[0].plans[0].booking_amount
                     this.tupledata[i].vendor_plans[0].plans[0].kms_included = storeKms;
                     this.tupledata[i].vendor_plans[0].plans[0].booking_amount = storePrice;
                     this.selectedkey = 0;
            }
       // this.applySRPFilter(this.getcabsSRPData, this.filterApplied)
        
    },
    updateDetails(searchData) {
      let self = this;
      let i = 0;
      self.selectedkey = -1;
      for (i = 0; i < searchData.length - 1; i++) {
        if (
          self.approxDistance >= searchData[i].kms_included &&
          self.approxDistance < searchData[i + 1].kms_included
        ) {
          self.selectedkey = i;
          break;
        }
      }
      if (self.selectedkey == -1) self.selectedkey = searchData.length - 1;
    }
  }
};
</script>

<style scoped>
.filter_error_msg {
  padding: 10px;
  margin-top: 100px;
  font-size: 16px;
  text-align: center;
}

.mt5 {
  margin-top: 5px;
}

.hv_app {
  background-color: #efefef;
  padding-top: 1px;
}

.hv_list {
  margin: 10px;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px 0px rgba(0, 0, 0, 0.7);
}

.hv_image {
  height: auto;
  width: 100%;
  margin-top: -10px;
  background: url("../../../assets/left-tupple.gif") no-repeat center;
}

.hv_cab_name {
  font-size: 16px;
  word-break: break-word;
  white-space: inherit;
  text-overflow: initial;
  color: #212121;
  font-weight: bold;
}

.hv_seat_count {
  font-size: 11px;
  color: rgba(44, 62, 80, 0.66);
  font-weight: normal;
}

.hv_cab_price {
  font-size: 16px;
  font-weight: bold;
  text-align: right;
}

.price {
  color: #2988e6;
  font-size: 20px;
}

.price-14 {
  color: #2988e6;
  font-size: 14px;
}

p {
  margin-bottom: 0;
}

.hv_info_icon {
  margin-left: 2px;
  color: rgb(25, 118, 210);
  font-size: 17px;
  margin-bottom: 5px;
}

.hv_ecash {
  font-size: 11px;
  color: rgba(44, 62, 80, 0.66);
}

.hv_advance {
  font-size: 11px;
  text-align: center;
  color: rgba(44, 62, 80, 0.66);
}

.hv_book_btn {
  margin: 0px !important;
  height: 28px;
  font-size: 12px;
  line-height: 30px;
  color: white !important;
}

.pl15 {
  padding-left: 15px;
}

.application .theme--dark.tabs .tabs__item {
  color: #fff;
  font-weight: bold;
}

.partner-logo > img {
  width: 80px;
  width: 80px;
  height: auto;
  margin: 20px 0 0;
}

.mt7 {
  margin-top: 7px;
}

.pl10 {
  padding-left: 10px;
}

.pl5 {
  padding-left: 5px;
}

.text-center {
  text-align: center;
}

.hv_show_more {
  text-align: center;
  border-top: 1px solid #dcdcdc;
  margin-top: 10px;
  padding-top: 10px;
  color: #2988e6;
}

.recommendedPlans.active {
  background: #e8f4ff;
}

.isActivePlan {
  background-color: green !important;
}

.pl10 {
  padding-left: 10px;
}

.hv_show_less {
  width: 100%;
  margin-top: 15px;
  text-align: center;
  color: #2988e6;
}

.hide-block {
  border: 1px solid #dcdcdc;
  padding: 5px;
  margin-top: 10px;
}

.recommendedPlans {
  background: #f6f6f6;
  text-align: center;
  padding: 5px;
  margin-right: 10px;
}

.recommendedPlans:last-child {
  margin-right: 0;
}
.rec-list.xs4 {
    flex-basis: 30.333333%;
    max-width: 31.333333%;
}
</style>
