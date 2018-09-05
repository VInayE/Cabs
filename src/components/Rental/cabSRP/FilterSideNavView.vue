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
        Filters</v-flex>
       
        <v-flex xs7 class="text-right">
          <span class="txt_reset" @click="resetFilters">RESET</span>
          <v-btn class="hv_book_btn" light @click="applyFilters">APPLY</v-btn>
        </v-flex>
      </v-layout> 
      <v-layout row wrap>
        <v-flex xs3 class="filter_option_selection">
          <v-layout row wrap @click="selectedFilterOption = 'Payment'" v-bind:class="{ filterOptionSelected: selectedFilterOption == 'Payment'}">
          <p class="center-icon"><i class="payment-icon"></i></p>
          <p class="">Payment</p>
          
          </v-layout>
           <v-layout row wrap @click="selectedFilterOption = 'Vendor'" v-bind:class="{ filterOptionSelected: selectedFilterOption == 'Vendor'}">
           <span class="center-icon"><i class="vender-icon"></i></span>
           Vendor</v-layout>
        </v-flex>
        <v-flex xs9 class="avl_filter_option">
           <v-layout row wrap class="brd-btm pt0 filter_btn" style="padding-bottom:15px;" v-show="selectedFilterOption == 'Payment'">
               <v-radio-group class="rental_packages" v-model="ex5" row>
                <v-layout row wrap>
                 <v-flex xs12 v-for="(adFilter, index) in advanceFilters" :key="index" class="pdl12"  @click="ex5=adFilter._value">
                   <v-layout row wrap>
                     <v-flex xs10 class="lh_4 fs-12">{{adFilter.name}}</v-flex>
                     <v-flex xs2 style="margin-top:5px;">
                        <v-radio class="radio_text right"  :value="adFilter._value" color="primary" ></v-radio>
                     </v-flex>
                  </v-layout>
                </v-flex>
                </v-layout>
             </v-radio-group>
          </v-layout> 
          <v-layout row wrap class="option_advance filter_btn" style="padding-bottom:15px;" v-show="selectedFilterOption == 'Vendor'">
            <v-flex xs12 v-for="(cabVendor, index) in cabsVendor" :key="index" class="pdl12">
              <v-layout row wrap>
                <v-flex xs3>
                  <img class="vendor_img" :src="cabVendor.logo_url"/>
                </v-flex>
                <v-flex xs7 lh_4>{{cabVendor.display_name}}</v-flex>
                <v-flex xs2 class="vender-check"> 
                  <v-checkbox  v-model="ex6" color="primary" :id="cabVendor.display_name" :value="cabVendor.display_name"></v-checkbox>
                </v-flex>
          </v-layout>
        </v-flex>
      </v-layout> 
    </v-flex>
  </v-layout>
     
    </v-navigation-drawer>
</template>
<script>
  import { mapGetters } from 'vuex'
  import * as types from '../../../store/types'
   export default {
     props: ['drawerRight'],
     data () {
       return {
         right: false,
         selectedFilterOption:'Payment',
         ex5: '',
         ex6: [],
         cabsVendor: [],
         advanceFilters: [{'name': 'No Advance', '_value': 'NA', 'isSelected': false}, {'name': 'Partial Advance', '_value': 'PA', 'isSelected': false}, {'name': 'Full Advance', '_value': 'FA', 'isSelected': false}]
       }
     },
     computed:{
        ...mapGetters({
           getSRPFilterOptions:types.GET_SRP_FILTER_OPTIONS,
           getcabsSRPData: types.GET_CABS_SRP_DATA,
        })
     },
     mounted () {
       let filter = !this.getSRPFilterOptions && Object.keys(this.getSRPFilterOptions) ? [] : this.getSRPFilterOptions
       this.ex5 = filter ? Object.keys(filter).length >= 0 && filter.advance ? filter.advance : [] : []
       this.ex6 = filter ? Object.keys(filter).length >= 0 && filter.vendor ? filter.vendor : [] : []
       this.cabsVendor = this.getcabsSRPData.vendors
     },
     methods: {
       closeDrawer(){
         this.right = false
         this.$emit('closeSideNav', false)
       },
       applyFilters () {
         if(this.ex5 == '' && this.ex6.length == 0){
             this.$emit('appliedFilter', {})
         } else{
           let advance = this.ex5 != '' ?  [this.ex5] : undefined
           this.$emit('appliedFilter', {'advance': advance, 'vendor': this.ex6})
         }
         this.right = false
         this.$emit('closeSideNav', false)
       },
       resetFilters () {
         this.ex5 = ''
         this.ex6 = []
       }
     },
     watch: {
       drawerRight () {
         this.right = this.drawerRight
       },
       right () {
         this.$emit('closeSideNav', this.right)
       }
     }
   }
</script>

<style scoped>

   .filterOptionSelected{
     background-color:white; padding-left: 0 !important;
   }
   .avl_filter_option{
    background-color: #fff;
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
	   padding-bottom: 10px;
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
    line-height: 4;
    padding: 3px 0 0 4px;
    font-size:12px;
  }
  .pdl12{
      padding-left:12px;
      height:48px;
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
    padding: 14px 0 0;
  }
  .center-icon{
        width: 100%;
    text-align: center;
    margin: 15% 0 0;
  }
  .brd-btm .pdl12 {
    border-bottom: 1px solid #e0e0e0;
  }
  .pt0 {
    padding-top: 0;
  }
  .rental_packages {
    padding-top: 0;
}
</style>
