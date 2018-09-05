<template>
   <v-layout row>
       <v-flex xs12 sm6 offset-sm3>
        <v-toolbar class="white fixed_header cd_fixed_header" dark>
          <v-icon class="cl_white_back padding_14" @click="navigateToSRP">arrow_back</v-icon>
          <v-toolbar-title class="cd_header_white">Review Details</v-toolbar-title>
        </v-toolbar>
       </v-flex>
      </v-layout>
</template>
<script>
  import router from '../../../router'
  export default {
    methods: {
      navigateToSRP () {
        router.push('cabsSRP')
      }
    }
  }
</script>
<style scoped>
   .padding_14{
     padding:0 10px; color: #333333 !important;
   }
   .cl_white_back{
    margin-left: 5px!important;
    font-size:25px;
    color:#616161
  }
  .cd_header_white{
    font-weight:500;
    font-size:18px;
    color:#212121;
    margin-left:0px;
  }
  .fixed_header{
      position:fixed;
      z-index:10;
      width:100%; top: 0;
      
  }
  
  
</style>
