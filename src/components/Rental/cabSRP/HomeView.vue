<template>
    <v-app class="hv_app">
      <div class="hv_list" v-for="(searchData, index) in srpdata" :key="index" v-if="selectedkey.price.length > 0 && (selectedkey.name == 'All' || selectedkey.name == searchData.yatra_category.display_name)">
         <v-layout row wrap >
              <v-flex xs4>
                 <img :src="searchData.yatra_category.yatra_category_images.url" class="hv_image"/>
              </v-flex>
              <v-flex xs8 class="pl15">
                <v-list-tile-sub-title class="hv_cab_name">{{searchData.vendor_category.display_name}}</v-list-tile-sub-title>
                <v-list-tile-title class="hv_seat_count">{{searchData.vendor_category.category_info}}</v-list-tile-title>
              </v-flex>
         </v-layout>
         <v-layout row wrap class="">
            <v-flex xs4 partner-logo>
                <img :src="searchData.vendor.logo_url" class="hv_image"/>
            </v-flex>
            <v-flex xs4 class="pl5 mt7">
               <v-list-tile-sub-title class="hv_cab_price">{{searchData.fare_details.price.total_charge.display_value}}  
                  <v-icon @click.stop.prevent="openDialog(index,$event)" class="hv_info_icon">info_outline</v-icon>
               </v-list-tile-sub-title>
               <v-list-tile-title class="hv_ecash" v-if="searchData.fare_details.price.ecash && searchData.fare_details.price.ecash.ecash_earn.value">{{searchData.fare_details.price.ecash.ecash_earn.display_value}} eCash</v-list-tile-title>
           </v-flex>
           <v-flex xs4 text-center>
               <v-list-tile-title class="hv_advance">{{searchData.fare_details.price.advance_percentage ? searchData.fare_details.price.advance_percentage.display_value:'No' }} Advance</v-list-tile-title>
               <v-btn class="red hv_book_btn" @click="navigateToDetails(index)">Book</v-btn>
           </v-flex>
        </v-layout>
      </div>
      <div class="filter_error_msg" v-if="selectedkey.price.length == 0">No matched  found for the applied filter.
      <br/>Modify the filters and try again</div>
      <price-details-view :dialog="dialog" :fareBreakUpDetails="fareBreakUpDetails" @priceDialogClose="dialog = $event"></price-details-view>
    </v-app>
</template>
<script>
    import router from '../../../router'
    import { mapGetters,mapMutations } from 'vuex'
    import * as types from '../../../store/types'
    export default {
      props: ['srpdata', 'selectedKey'],
      components: {
        PriceDetailsView : () => import('./PriceDetailsView')
      },
      data () {
        return {
          dialog: false,
          fareBreakUpDetails: {},
          selectedkey: this.selectedKey
        }
      },
      methods: {
        ...mapMutations({
           setCabFareDetails: types.SET_CAB_FARE_DETAILS,
           setSDCabType:types.SET_SD_CAB_TYPE
        }),
        openDialog (fareDetailsIndex, event) {
          this.$set(this.fareBreakUpDetails, 'breakUp', this.srpdata[fareDetailsIndex].fare_details)
          this.dialog = true
          event.stopPropagation()
        },
        navigateToDetails (index) {
          let storeCabType = {cabType : 'rental'}
          this.setSDCabType(storeCabType) 
          this.setCabFareDetails(this.srpdata[index])
          router.push({name:'CabsDetails'})
        }
      }
    }
</script>

<style scoped>
  .filter_error_msg{
    padding:10px;
    margin-top:100px;
    font-size:16px;
    text-align:center;
  }
  .mt5{
    margin-top:5px;
  }
  .hv_app{
    background-color:#efefef;
    padding-top:1px;
  }
  .hv_list{
    margin:10px;
    background-color:white;
    padding:10px;
    border-radius:5px;
  }
  .hv_image{
    height:auto;
    width:100%;
  }
  .hv_cab_name{
    font-size:14px;
    word-break: break-word;
    white-space: inherit;
    text-overflow: initial;
    color: #212121;
    font-weight: bold;
  }
  .hv_seat_count{
    font-size: 11px;
    color: rgba(44, 62, 80, 0.66);
  }
  .hv_cab_price{
    font-size:16px;
    color:rgb(25, 118, 210);
    font-weight: bold;
  }
  .hv_info_icon{
    margin-left:2px;
    color: rgb(25, 118, 210);
    font-size:17px;
    margin-bottom: 5px;
  }
  .hv_ecash{
    font-size: 11px;
    color: rgba(44, 62, 80, 0.66);
  }
  .hv_advance{
    font-size: 11px;
    text-align: center;
    color: rgba(44, 62, 80, 0.66);
  }
  .hv_book_btn{
    margin:0px!important;
    height: 28px;
    font-size: 12px;
    line-height: 30px;
    color:white!important;
  }
    .pl15 {
        padding-left: 15px;
    }
    .application .theme--dark.tabs .tabs__item {
        color: #fff;
        font-weight: bold;
    }
    .partner-logo > img{
     width: 80px; height: auto;
     margin: 20px 0 0;
    }
    .mt7{
      margin-top: 7px;
    }
    .pl10{
      padding-left: 10px;
    }
    .pl5{
      padding-left: 5px;
    }
    .text-center{
      text-align: center;
    }
</style>
