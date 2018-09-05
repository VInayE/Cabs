<template>
  <div class="cabs_home_footer">
  <slot name="header"></slot>
  <div  v-if="Object.keys(cabOption).length > 0" style="background-color:white">
      <v-snackbar class="snacktxt" :timeout="timeout" :bottom="y === 'bottom'" :multi-line="true" v-model="snackbar">
          {{snackbarText}}
          <v-btn flat class="txt-ff" @click.native="snackbar = false">Close</v-btn>
        </v-snackbar>
     <v-layout row wrap class="p10" v-bind:class="{ box_shadow_cab :cabsDescription == ''}" v-if="!rideStatus">
        <v-flex xs12 class="cabDescription" v-if="cabsDescription != '' ">{{cabsDescription.toUpperCase()}}</v-flex>
        <v-flex xs12 style="padding:0px">
           <v-tabs dark fixed v-model="tabActive">
                <v-tabs-bar class="white cab_vendor_option">
                    <v-tabs-item v-for="(cabVendor,index) in cabOption" :href="'#tab-' + index.toString()" :key="index">
                       {{cabVendor.name}}
                    </v-tabs-item>
                </v-tabs-bar>
                 <v-tabs-items>
                  <v-tabs-content v-for="(cabVendor,index) in cabOption" :id="'tab-' + index.toString()" :key="index">
                     <v-tabs style="padding:0px!important" dark>
                        <v-tabs-bar dark fixed centered class="white cabs_option cab-operator" style="margin-top:10px;">
                           <v-tabs-item  v-for="(cabs,j) in cabVendor.products" :key="j" :href="'#tabcaboption-' + j"  class="cabsProduct" v-if="cabVendor.products.length >0">
                              <div style="font-size:12px;color:#7f7f7f;" @click="cabVendor.selected = j;cabsDescription = cabs.description">{{cabs.display_name}}</div>
                              <div class="img-sec">
                                 <div class="image-mask"  @click="cabVendor.selected = j;cabsDescription = cabs.description" v-bind:class="{ selected_image_mask: j== cabVendor.selected, unselected_image_mask: j != cabVendor.selected}"  :style="{ '-webkit-mask-box-image' : 'url(' + cabs.image_url + ')' }"></div>
                              </div>
                              <div style="font-size:10px;color:rgb(189,189,189);" @click="cabVendor.selected = j;cabsDescription = cabs.description">
                                 {{cabs.unit_price ? cabs.unit_price.text : cabs.price_estimate ? cabs.price_estimate.text : ''}}
                              </div>
                               <div style="font-size:10px;color:rgb(189,189,189);" v-if="cabs.eta" @click="cabVendor.selected = j;cabsDescription = cabs.description">
                                 {{cabs.eta ? cabs.eta.text : ''}}
                              </div>
                              <div v-if="!cabs.eta" class="cabsPriceNotAvailable"></div>
                          </v-tabs-item>
                          <v-tabs-item class="noCabsAvailable" v-if="cabVendor.products.length ==0">
                            <v-flex v-bind:class="{ autoNotAvailable :cabVendor.name.indexOf('Auto')>=0,cabsNotAvailable :cabVendor.name.indexOf('Auto') < 0  }"></v-flex>
                            <v-flex class="text-lght" >{{showCabsNotAvailable(cabVendor.name)}}</v-flex>
                          </v-tabs-item>
                        </v-tabs-bar>
                     </v-tabs>
                  </v-tabs-content>
               </v-tabs-items>
           </v-tabs>
        </v-flex>
       <cab-login-block :openLoginDialog="openLoginDialog" @closeLoginDialog="openLoginDialog = false" :cabsLoginOption="'p2p'" @cabsPPLogin="checkLinkedUser($event);openLoginDialog=false"></cab-login-block>   
       <uber-sign-up-modal :openUberSignUpModal="openUberSignUpModal" 
                           :uberSignUpData="uberSignUpData"
                           @closeAuthenticationModal="openUberSignUpModal=false">
       </uber-sign-up-modal>
        <v-btn :disabled='showRideNowButtonDisable' block secondary class="bg-red bttnsize"  @click="rideCabs">
               RIDE NOW
        </v-btn>
        <loader-view v-if="ajaxLoading"></loader-view>
     </v-layout> 
   </div>
  </div>
  </template>
  
  <script>
    import router from '../../../router'
    import { mapMutations } from 'vuex'
    import * as types from '../../../store/types'
    import {eventBus} from '../../../utils/eventBus'
    export default {
      props:['cabAvailabilyOption','pickupLocation','currentRideSatus'],
      components:{
        UberSignUpModal : () => import('./UberSignUpModal'),
        CabLoginBlock : () => import('../../cabsLoginPage/cabLoginBlock'),
        LoaderView :() => import('../../common/loader')
      },
      data () {
        return {
          openUberSignUpModal:false,
          selectedCabOption:-1,
          selectedtCabIndex:-1,
          uberSignUpData:{},
          showRideNowButtonDisable : true,
          tabActive:'',
          timeout: 1000,
          y: 'bottom',
          openLoginDialog: false,
          snackbar: false,
          snackbarText: '',
          cabOption:{},
          rideNow:false,
          selectedoption: '',
          cabsDescription:'',
          selectectedLatitude:'',
          searchParams:{},
          activeCabs: '',
          ajaxLoading:false,
          selectedAutoIndex:-1,
          rideStatus: false  
        }  
      },
      watch:{
        cabsDescription (){
           let self = this
            setTimeout(function(){ 
               self.cabsDescription = ''
             }, 5000);
        },
        currentRideSatus (){
            if(Object.keys(this.currentRideSatus).length>0){
               this.rideStatus = true 
            } else {
              this.rideStatus = false      
            }  
        },    
        cabAvailabilyOption () {
          if(Object.keys(this.cabAvailabilyOption).length>0){
           this.cabOption = this.cabAvailabilyOption
           this.selectectedLatitude = this.pickupLocation
           if(this.tabActive == ''){
             this.showRideNowButtonDisable = this.cabAvailabilyOption[Object.keys(this.cabAvailabilyOption)[0]].products == 0 ? true : false
           } else {
             this.showRideNowButtonDisable = this.cabAvailabilyOption[this.tabActive.split('tab-')[1]].products && this.cabAvailabilyOption[this.tabActive.split('tab-')[1]].products.length == 0 ? true : false
           }
         } else{
           this.cabOption = {}
         }
        },
        tabActive() {
          this.showRideNowButtonDisable = this.cabOption[this.tabActive.split('tab-')[1]].products.length == 0 ? true : false
        }
      },
      methods:{
        ...mapMutations({
            setP2PSearchParams : types.SET_P2P_SEARCH_PARAMS
        }),
        showCabsNotAvailable (text) {
           return text.indexOf('Auto') >=0 ? 'No vehicles available' : text + ' Cars not available in this area'
        },
        formP2PObjectJSON (){
           console.log(self.selectectedLatitude)
             let selectedCab = this.cabOption[this.tabActive.split('tab-')[1]].selected
             let selectedTabIndex = this.tabActive.split('tab-')[1]
            this.selectectedLatitude.vendor_id = this.cabOption[selectedTabIndex].products[selectedCab].provider_id,
            this.selectectedLatitude.cabVendorName = this.cabOption[selectedTabIndex].name,
            this.selectectedLatitude.cabVendorId = this.cabOption[selectedTabIndex].products[selectedCab].id,
            this.selectectedLatitude.cab_display_name = this.cabOption[selectedTabIndex].products[selectedCab].display_name,
            this.selectectedLatitude.eta = this.cabOption[selectedTabIndex].products[selectedCab].eta ? this.cabOption[selectedTabIndex].products[selectedCab].eta.text : '',
            this.selectectedLatitude.shared = this.cabOption[selectedTabIndex].products[selectedCab].shared
        },
        checkLinkedUser(){
          let self = this
          this.formP2PObjectJSON()
          this.$http.get(`p2p/v1.2/authorization/status?vendor_id=${this.selectectedLatitude.vendor_id}`).then(function (response) {
            if(response.body.auth_status == "unauthorized"){
               self.ajaxLoading = false
               self.selectectedLatitude.redirectURI = response.body.redirect_url
               self.uberSignUpData = response.body
               self.setP2PSearchParams(self.selectectedLatitude)
               self.openUberSignUpModal = true
            } else{
                self.setP2PSearchParams(self.selectectedLatitude)
                self.ajaxLoading = false
                router.push({name:'P2PCabDetails'})
            }
          },function (response) {
            self.showLoader = false
          });
        },
        rideCabs(){
          if(this.selectectedLatitude.dropLongitude.toString() != "" && this.selectectedLatitude.pickupLatitude != this.selectectedLatitude.dropLatitude && this.selectectedLatitude.pickUpLongitude != this.selectectedLatitude.dropLongitude) {
             let userLoginParams = {
               includeOptionalParams:true,
               channel:'B2C',
               productId:'CabsPWA'
           }
            Vue.http.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
            Vue.http.options.emulateJSON = true
            let self = this
            this.ajaxLoading = true
            this.$http.post('/social/user/userProfile.htm',userLoginParams).then(function (response) {
                if(response.body.status == 'FAIL') {
                    self.ajaxLoading = false
                    self.openLoginDialog = true
                } else{
                     self.checkLinkedUser()
                    // if(self.selectectedLatitude.cabVendorId == 'Auto'){
                    //    self.setP2PSearchParams(self.selectectedLatitude)
                    //    router.push({name:'P2PCabDetails'})
                    // } else{
                    //     self.checkLinkedUser()
                    // }
                }
              }, function (response) {
                self.showLoader = false
            });
          } else if(this.selectectedLatitude.dropLongitude.toString() == ""){
            eventBus.openDropoffLocation(true)
          } else{
            this.snackbar = true
            this.snackbarText = 'Pickup and dropoff location cannot be same'
          }
        }
      }
    }
  </script>
  <style scoped>
    .image-mask{
      width:50px;
      height:26px;
      mask: url(#mymask);
    }
    .selected_image_mask{
      background-color: #EA2330; 
    }
    .unselected_image_mask{
      background-color:#7f7f7f;
    }
     .cabDescription{
       height:25px;
       width:100%;
       background-color: rgb(254,234,184);
       text-align:center;
       font-size:13px;
       padding-top:2px;
       box-shadow: 0 -1px 2px rgba(0,0,0,0.4)
     }
     .cab_name{
      font-size: 13px;
      color: rgba(0, 0, 0, 0.87);
     }
     .cabs_img_div{
       border: 1px solid #bdbdbd;
       border-radius: 50%;
     }
     .available_cabs_img{
       height:auto;
       width:100%;
       margin-top:10px;  
     }
     .cabs_home_footer{
        z-index:18;
        position:fixed;
        width:100%;
        bottom:0;
        min-height:50px; 
     }
     .cab_description{
        margin-top:11px; 
     }
     .box_shadow_cab{
       box-shadow: 0 -1px 2px rgba(0,0,0,0.4);
       background-color:white;
     }
      .m10 {
          margin-top: 10px;
      }
      .activecab .cabs_img_div {
       background: rgba(255, 0, 0, 0.09);
          transition: ease out .5;
      }
      .img-sec{
        height: 35px;display: flex;
          align-items: center;
          justify-content: center;
      }
      .operator-name{
        text-transform: capitalize;
      }
      .bttnsize{
          margin:0 10px 10px;
          padding: 10px 0;
      }
  </style>