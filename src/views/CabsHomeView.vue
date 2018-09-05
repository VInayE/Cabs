<template>
   <v-app>
     <v-snackbar class="snacktxt" :timeout="timeout" :bottom="y === 'bottom'" :multi-line="true" v-model="snackbar">
        {{snackbarText}}
        <v-btn flat class="txt-ff" @click.native="snackbar = false">Close</v-btn>
      </v-snackbar>
     <div class="cabsHomeHeader">
       <cabs-home-header></cabs-home-header>
       <cab-type-option></cab-type-option>
     </div>
     <transition name="modal" v-if="authenticatioDialog">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">
              <div class="modal-header">
                <slot name="header">
                  {{callBackConfirmDialog.title}}
                </slot>
              </div>
              <div class="modal-body">
                <v-layout row wrap>
                  <v-flex xs12 style="font-family:Roboto-400;color:rgba(0,0,0,.87)">{{callBackConfirmDialog.content}}</v-flex>
                  <v-layout row wrap style="margin-top:10px;font-family:Roboto-500;font-size:16px;">
                      <v-flex xs2 offset-xs6 class="txt_blue" @click="validateCallback('false')">{{callBackConfirmDialog.secondary_action_title}}</v-flex>
                      <v-flex xs3 offset-xs1 class="txt_blue" @click="validateCallback('true')">{{callBackConfirmDialog.primary_action_title}}</v-flex>
                  </v-layout>
                </v-layout>
              </div>
            </div>
          </div>
        </div>
     </transition>
     <div id="map" style="height:100vh;width:100%;"></div>
     <loader-view v-if="ajaxLoadingDialog"></loader-view>
   </v-app>
</template>
<script>
  import {mapGetters} from 'vuex'
  import * as types from '../store/types'
  import router from '../router'
  export default {
    components: {
      CabsHomeHeader : () => import('../components/common/cabsHomeHeader'),
      CabTypeOption : () => import('../components/common/cabTypeOption'),
      LoaderView: () => import('../components/common/loader')
    },
    computed: {
      ...mapGetters({
           getP2PSearchParams : types.GET_P2P_SEARCH_PARAMS 
      })
    },
    data () {
      return {
        ajaxLoadingDialog: false,
        authenticatioDialog: false,
        callBackConfirmDialog: {},
        timeout: 1000,
        y: 'bottom',
        snackbar: false,
        snackbarText: ''
      }
    },
    methods:{
      validateCallback (option) {
        this.ajaxLoadingDialog = true
        let callBackParams = {
            'vendor_id':this.getP2PSearchParams.vendor_id,
            'vendor_auth_redirect_url':this.getP2PSearchParams.redirectURI+window.location.search+window.location.hash
        }
        let self = this
        this.$http.post('p2p/v1/authorization/callback?confirm='+option,callBackParams).then(function(response){
            self.authenticatioDialog = true
            self.ajaxLoadingDialog = false
            if(option == 'true'){
              router.push({name:'P2PCabDetails'})
            } else{
              self.snackbar = true
              self.snackbarText = response.body.message ? response.body.message : 'Please select proper account'
            }
          }, function(response) {
            self.authenticatioDialog = true
            self.ajaxLoadingDialog = false
        })
      }
    },
    created (){
      if(window.location.search != "" && window.location.search.indexOf('error')<0){
        this.ajaxLoadingDialog = true
        if(window.location.search.indexOf('surge')>=0){
            router.push({name:'P2PCabDetails'})
        } else {
          let callBackParams = {
           'vendor_id':this.getP2PSearchParams.vendor_id,
           'vendor_auth_redirect_url':this.getP2PSearchParams.redirectURI+window.location.search+window.location.hash
          }
          let self = this
          this.$http.post('p2p/v1/authorization/callback',callBackParams).then(function(response){
            self.ajaxLoadingDialog = false
             if(response.body.status != 409) {
               router.push({name:'P2PCabDetails'})
             } else{
             self.callBackConfirmDialog = response.body.payload.dialog_info
             self.authenticatioDialog = true
           }
          }, function(response) {
           self.ajaxLoadingDialog = false
          })
         }
       } else if(window.location.search != "" && window.location.search.indexOf('error') >=0) {
           this.snackbar = true
           this.snackbarText = 'User has denied the authorization'
       }
     }
  }
</script>
<style scoped>
  .cabsHomeHeader{
    position: fixed;
    top: 0px;
    width: 100%;
    z-index: 11;
  }
  
   .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 10px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-header {
    font-size: 20px;
    font-weight: 500;
    color: black;
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
    font-family:'Roboto-500'
}

.modal-body {
  margin: 10px 0;
  height:auto;
  overflow-y:auto;
  overflow-x:hidden;

}

.modal-default-button {
  float: right;
}
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>