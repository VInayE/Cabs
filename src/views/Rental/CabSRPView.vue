<template>
    <v-app>
      <v-tabs dark style="padding:0px!important" grow>
        <filter-side-nav-view :drawerRight="drawerRight" @closeSideNav="drawerRight = $event" @appliedFilter="filterApplied = $event" ></filter-side-nav-view>
        <v-toolbar class="white fixed_header" dark grow>
           <v-layout row wrap class="layout_header" style="margin:0px;">
           <v-flex xs1 class="header_arrow_back" @click="navigateToSearch">
              <v-icon>arrow_back</v-icon>
           </v-flex>
           <v-flex xs9>
              <v-flex xs12 class="header_title_txt roboto-400">{{searchParams.pickUpCity}}<v-icon class="fa_long_icon_exchange" v-if="getcabsSRPData.travel_type != 'hourly'">swap_horiz</v-icon>{{getcabsSRPData.travel_type != 'hourly'? searchParams.dropCity:''}}</v-flex>
              <v-flex xs12 class="header_subtitle_txt roboto-400" v-if="getcabsSRPData.travel_type !='hourly'"><v-icon class="today">today</v-icon>{{searchParams.pickUpDate}} - {{searchParams.returnDate}}</v-flex>
              <v-flex xs12 class="header_subtitle_txt roboto-400" v-if="getcabsSRPData.travel_type =='hourly'"><v-icon class="today">today</v-icon>{{searchParams.pickUpDate}}</v-flex>
           </v-flex>
           <v-flex xs1>
             <v-toolbar-side-icon  @click.stop="drawerRight = !drawerRight" ></v-toolbar-side-icon>
            <div @click.stop="drawerRight = !drawerRight" class="filterIcon"></div>
           </v-flex>
         </v-layout>
        </v-toolbar>
         <v-tabs-bar class="white fixed_header tp60 srp_toolbar" style="margin-top:-4px;">
              <v-tabs-slider class="bg-color"></v-tabs-slider>
              <v-tabs-item v-for="(item, i) in cabsOption" :key="i" :href="'#tab-' + (i + 1)">
                 {{ item.name }} <br>
            {{item.price.length > 0 ? item.price : ''}}
              </v-tabs-item>
          </v-tabs-bar>
          <v-tabs-items>
            <v-tabs-content v-for="i in cabsOption.length" :key="i" :id="'tab-' + i">
              <home-view v-if="srpData" :srpdata="srpData" :selectedKey="cabsOption[i-1]"></home-view>
            </v-tabs-content>
          </v-tabs-items>
       </v-tabs>
    </v-app>
</template>
<script>
  import router from '../../router'
  import { mapGetters,mapMutations } from 'vuex'
  import * as types from '../../store/types'
  import { adobeAnalyticsPageView } from '../../helpers/adobeAnalytics'

  export default {
    components: {
      HomeView: () => import('../../components/Rental/cabSRP/HomeView'),
      FilterSideNavView: () => import('../../components//Rental/cabSRP/FilterSideNavView')
    },
    data () {
      return {
        data: [],
        selectedKey: 0,
        cabsOption: [{'name': 'All', 'price': ''}],
        drawerRight: false,
        filterApplied: {},
        srpData: []
      }
    },
    watch: {
      filterApplied () {
        this.applySRPFilter(this.getcabsSRPData, this.filterApplied)
      }
    },
    methods: {
     ...mapMutations({
           applyFilter: types.SET_APPLY_FILTER
      }),
      navigateToSearch () {
        router.push({name:'CabsHomeView',params:{option:'rental'}})
      },
      applySRPFilter (data, filter) {
        let srpdata = data.vendor_available_categories
        let filteredSRPData = []
        if (!filter || Object.keys(filter).length === 0) {
          for (let i = 0; i < srpdata.length; i++) {
            let matchedIndex = data.vendors.findIndex(x => x.id === srpdata[i].vendor_id)
            let yatraMatchCtgry = data.yatra_categories.findIndex(x => x.id === srpdata[i].yatra_category_id)
            this.$set(data.vendor_available_categories[i], 'vendor', data.vendors[matchedIndex])
            this.$set(data.vendor_available_categories[i], 'yatra_category', data.yatra_categories[yatraMatchCtgry])
          }
          filteredSRPData = data.vendor_available_categories
        } else {
          for (let i = 0; i < srpdata.length; i++) {
            let adFilterValue = srpdata[i].fare_details.price.advance_percentage ? srpdata[i].fare_details.price.advance_percentage.value < 100 ? 'PA' : 'FA' : 'NA'
            let adFilterCndt = (!filter.advance || filter.advance.length === 0) ? true : filter.advance.findIndex(x => x === adFilterValue) >= 0
            let vendorFilterCndt = (!filter.vendor || filter.vendor.length === 0) ? true : filter.vendor.findIndex(x => x === srpdata[i].vendor.display_name) >= 0
            if (vendorFilterCndt && adFilterCndt) {
              let matchedIndex = data.vendors.findIndex(x => x.id === srpdata[i].vendor_id)
              let yatraMatchCtgry = data.yatra_categories.findIndex(x => x.id === srpdata[i].yatra_category_id)
              this.$set(data.vendor_available_categories[i], 'vendor', data.vendors[matchedIndex])
              this.$set(data.vendor_available_categories[i], 'yatra_category', data.yatra_categories[yatraMatchCtgry])
              filteredSRPData.push(data.vendor_available_categories[i])
            }
          }
        }
        this.cabsOption[0].price = filteredSRPData.length > 0 ? filteredSRPData[0].fare_details.price.total_charge.display_value : ''
        for (let i = 1; i < this.cabsOption.length; i++) {
          let hatchBackPrice = filteredSRPData.length > 0 ? filteredSRPData.findIndex(x => x.yatra_category.display_name === this.cabsOption[i].name) : -1
          this.cabsOption[i].price = hatchBackPrice >= 0 && filteredSRPData ? filteredSRPData[hatchBackPrice].fare_details.price.total_charge.display_value : ''
        }
        this.srpData = filteredSRPData
      }
    },
    mounted () {
      this.filterApplied = Object.keys(this.getSRPFilterOptions).length === 0 || !this.getSRPFilterOptions ? undefined : this.getSRPFilterOptions
      for(let i =0;i<this.getcabsSRPData.yatra_categories.length;i++){
        let vendordata = {
          'name': this.getcabsSRPData.yatra_categories[i].display_name, 
          'price': ''
        }
        this.cabsOption.push(vendordata)
      }
      this.applySRPFilter(this.getcabsSRPData, this.filterApplied)
      adobeAnalyticsPageView(this.getcabsSRPData.travel_type == 'outstation'? 'yt:outstation cab:checkout:srp' : 'yt:hourly cab:checkout:srp',this.getcabsSRPData.travel_type == 'outstation'? 'outstation cab' : 'hourly cab','business',this.getcabsSRPData.travel_type == 'outstation'? 'outstation cab checkout':'hourly cab checkout','srp','','')  
    },
    computed: {
      searchParams () {
        return this.getSearchParams
      },
      ...mapGetters({
           getSearchParams:types.GET_SEARCH_PARAMS,
           getcabsSRPData: types.GET_CABS_SRP_DATA,
           getSRPFilterOptions:types.GET_SRP_FILTER_OPTIONS
        }),
    },
    beforeDestroy () {
      this.applyFilter(this.filterApplied)
    }
  }
</script>

<style scoped>
     .txt_search_city{
       font-size: 17px;
       color: #000000;
       font-weight: 500;
     }
     .tabs{
       padding: 0px!important;
     }
     .fa_long_icon_exchange{
      color: #333!important;
      height: 25px;
      width: 25px;
      margin-left:0px;
      margin-right:0px;
      border: 2px solid white;
      border-radius: 50%;
      font-size: 21px;
   }

   .fa_long_icon{
     color:#616161;
     font-size:20px;
   }
   h2,h3{
    font-size: 16px!important;
    color: rgba(66, 66, 66, 0.82)!important;
    font-weight: bold;
    margin-bottom:0px;
  }
  ul{
    padding-left:0px;
  }
  .tabs__li>a{
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
    font-size:16px;
    font-weight:bold;
    margin-top:0px;
    color:rgba(0, 0, 0, 0.87)
  }

  .header_subtitle_txt{
    font-size:12px!important;
    color:rgb(158, 158, 158)!important;
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
</style>
