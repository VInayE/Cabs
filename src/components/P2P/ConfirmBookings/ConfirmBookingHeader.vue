<template>
   <v-layout row >
     <v-flex xs12>
       <v-toolbar class="white fixed_header">
         <v-layout row wrap class="layout_header" style="z-index:9;position:fixed;top:0px;width:100%;background-color:white;box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)">
           <v-flex xs1 class="header_arrow_back">
              <v-icon></v-icon>
           </v-flex>
           <v-flex xs9>
              <v-flex xs12 class="header_title_txt roboto-400">{{headerText}}</v-flex>
           </v-flex>
         </v-layout>
       </v-toolbar>
     </v-flex>
   </v-layout>
</template>
<script>
  export default {
    props :['trackHeaderText'],
    data () {
      return {
        headerText:''
      } 
    },
    watch :{
      trackHeaderText (){
        this.headerText = this.trackHeaderText
      }
    },
    created (){
      this.headerText = this.trackHeaderText
    }
  }
</script>
<style scoped>
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
  .header_arrow_back > .icon{
    color:rgb(66, 66, 66)!important;
  }
  .header_title_txt{
    font-size:18px;
    font-weight:bold;
    margin-top:18px;
   
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
    margin-top:0px;
    padding-right:0px!important;
    padding-left:10px!important;
  }
  
</style>