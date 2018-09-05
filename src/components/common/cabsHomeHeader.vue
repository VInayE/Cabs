<template>
   <v-layout row >
     <v-flex xs12>
       <v-toolbar class="white fixed_header">
         <v-layout row wrap class="layout_header" style="position:fixed;top:0px;width:100%;background-color:white" v-bind:class="{ review_booking_header: $route.name == 'P2PCabDetails' }">
           <v-flex xs1 class="header_arrow_back" @click="navigateBack">
              <v-icon>arrow_back</v-icon>
           </v-flex>
           <v-flex xs9>
              <v-flex xs12 class="header_title_txt roboto-400" v-bind:class="{ p2p_details: $route.name == 'P2PCabDetails' }">{{$route.name == "P2PCabDetails" ? 'Review Booking':'Book a Cab'}}</v-flex>
              <v-flex xs12 class="header_subtitle_txt roboto-400" v-if="$route.name != 'P2PCabDetails'">{{headerText}}</v-flex>
           </v-flex>
           <v-flex xs1>
             <v-icon class="help_icon" @click="navigateToSupport"></v-icon>
           </v-flex>
         </v-layout>
       </v-toolbar>
     </v-flex>
   </v-layout>
</template>
<script>
  import {eventBus} from '../../utils/eventBus'
  import router from '../../router'
  export default {
    data () {
      return {
        supportURL:'https:www.yatra.com/support#/path/Cabs/Cabs-General-Enquiry/',
        headerText:this.$route.params.option == 'p2p'? 'For point to point instant rides':this.$route.params.option == 'rental'? 'Local or Outstation cab with a driver':'Hire a cab and drive it on your own',
      } 
    },
    methods:{
      navigateBack(){
         if(this.$route.name == 'P2PCabDetails'){
           router.push({name:'CabsHomeView',params:{option:'p2p'}})
         }
      },
      navigateToSupport(){
        window.open(this.supportURL, '_blank')  
      }  
    },
    created (){
      eventBus.$on('homeViewHeaderText',(data) => {
        this.headerText = data == 'tab-p2p' ? 'For point to point instant rides' : data == 'tab-rentals' ? 'Local or Outstation cab with a driver':'Hire a cab and drive it on your own'
      })
    }
  }
</script>
<style scoped>
  .review_booking_header{
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
  }
  .p2p_details{
    margin-top:10px!important;
  }
  .fixed_header {
    box-shadow:none!important;
  }
  .layout_header{
    margin:0px!important;
    width:100%;
  }
  .help_icon{
    color:#333;
    margin-top:10px;
  }
  .header_arrow_back > .icon{
    color:rgb(66, 66, 66)!important;
  }
  .header_title_txt{
    font-size:18px;
    font-weight:bold;
    margin-top:5px;
   
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
</style>