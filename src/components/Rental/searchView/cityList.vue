<template>
<div class="wrapper">
  <v-card>
    <input type="text" id="cityInput" ref="cityListSearch" autofocus="true" placeholder="Enter City" v-model="search" @keyup = "searchCity"/>
    <v-icon class="place_clear_icon" v-if="search.length>0" @click.stop="clearCity">close</v-icon>
    <v-layout row wrap>
        <v-flex xs12 style="margin-top:15px;">
          <span class="txt_popular">POPULAR CITIES</span>
          <ul class="txt-left">
              <li v-for="(city,index) in cityListData" :key="index" @click="selectCity(index)">{{city.name}}</li>
          </ul>
          </v-flex>
      </v-layout>
  </v-card>
  </div>
</template>

<script>
 import { adobeAnalyticsPageView } from '../../../helpers/adobeAnalytics'
 export default {
    props: ['displayedCityList','focusAttr','selectedtCityOption','selectedCabTripOtion'],
    data () {
      return {
        search: '',
        cityListData:[]
      }
    },
    watch:{
     focusAttr(){
       if(this.focusAttr){
           this.$refs.cityListSearch.focus()
           if(this.selectedCabTripOtion == 'local'){
               adobeAnalyticsPageView('yt:hourly cab:book ride:origin','hourly cab','business','hourly cab book ride','select origin','','')
           } else {
              adobeAnalyticsPageView(this.selectedtCityOption == 'origin' ? 'yt:outstation cab:book ride:origin' : 'yt:outstation cab:book ride:destination','outstation cab','business','outstation cab book ride',this.selectedtCityOption == 'origin' ? 'select origin' : 'select destination','','')
           }
       }
     }
    },
     methods: {
         clearCity () {
           this.search = ''
           this.ajaxHit(this.search)
         },
         searchCity () {
           this.ajaxHit(this.search)     
         },
         selectCity (index) {
            this.$emit('citySelected',this.cityListData[index]) 
         },
         ajaxHit (search){
           var self = this;      
           this.$http.get('v1.2/cities?q='+search)
            .then(function (response) {
                self.cityListData = response.data.cities
            })
            .catch(function (error) {
            });
        }
     },
  created: function() {
     this.cityListData = this.displayedCityList 
  }
  }
</script>

<style scoped>
     .txt_popular{
      color: #1e88e5;
      text-transform: uppercase;
      font-size: 11px;
      font-weight: normal;
      padding: 12px;
     }
    .place_clear_icon{
     position:absolute;
     right:30px;
     width:10px;
     height:10px;
     top:-40px;
     color:#1e88e5;
  }
    #cityInput{
      position: absolute;
      left: 40px;
      top: -56px;
      height: 56px;
      width: 100%;
      padding: 15px;
    }
    .txt-left {
        text-align: left;
    }
    ul {
        padding: 10px;
    }
    li {
        list-style-type: none;
        border-bottom: 1px solid #ccc;
        width: 100%;
        padding: 10px;
        font-size: 13px;
        color: #000 !important;
        font-weight: normal;
    }
    .search-txt {
        position: absolute;
    top: -82px;
    right: 0;
    }
</style>
