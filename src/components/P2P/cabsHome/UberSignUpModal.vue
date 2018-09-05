<template>
   <transition name="modal" v-if="openModal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-body">
           <div v-if="signUpData.vendor.display_name.toLowerCase()=='uber'">
              <v-layout row wrap class="uber_signup_body">
                  <v-flex xs12 v-for="(offers,i) in signUpData.authorization_dialog.offers" :key="i" class="uber_offers_dialog">
                  <v-flex xs4 class="uber_offer_badge">{{offers.badge}}</v-flex>
                  <v-flex xs12 v-html="offers.description"></v-flex>
                </v-flex>
                <v-flex xs12 class="uber_primary_action" @click="vendorAuth">{{signUpData.authorization_dialog.dialog_info.primary_action_title}}</v-flex>
                <v-flex xs12 class="uber_secondary_action" @click="signUpModal">{{signUpData.authorization_dialog.dialog_info.secondary_action_title}}</v-flex>
                <v-flex xs12 class="uber_tnc_txt">
                   By clicking on signup, you agree to Uber's <a :href="signUpData.vendor.terms_url" target="/-blank">Terms and Condition</a> and <a :href="signUpData.vendor.privacy_policy_url" target="_blank">Privacy Policy.</a>
                </v-flex>
                <v-flex xs12 class="uber_cancel" @click="closeDialog">CANCEL</v-flex>
              </v-layout>
            </div> 
            <div v-else-if="signUpData.vendor.display_name.toLowerCase()=='ola'">
              <v-layout row wrap>
                 <v-flex xs12 class="ola_title">{{signUpData.confirm_dialog.title}}</v-flex>
                 <v-flex xs12 class="ola_content">{{signUpData.confirm_dialog.content}}</v-flex>
                 <v-flex xs12 class="ola_action">
                    <span xs2 offset-xs5 class="txt_blue" style="margin-right:20px;" @click="closeDialog">
                      CANCEL
                    </span>
                    <span xs3 offset-xs1 class="txt_blue" @click="vendorAuth">
                      {{signUpData.confirm_dialog.primary_action_title.toUpperCase()}}
                    </span>
                 </v-flex>
              </v-layout>
            </div> 
          </div>
        </div>
      </div>
    </div>
    <loader-view v-if="ajaxLoadingDialog"></loader-view>
   </transition>
</template>
<script>
 export default {
    props: ['openUberSignUpModal','uberSignUpData'],
    components:{
      LoaderView : ()=> import('../../common/loader')
    },
    watch:{
       openUberSignUpModal () {
           this.openModal = this.openUberSignUpModal
           if(this.openModal){
               this.signUpData = this.uberSignUpData
           }
       }
    },
    data () {
      return {
        openModal:false,
        signUpData:{},
        ajaxLoadingDialog:false
      }  
    },
    methods:{
      signUpModal (){
        this.ajaxLoadingDialog = true
        window.open(this.signUpData.sign_up_url,'_parent')
      },
      closeDialog(){
        this.openModal = false
        this.$emit('closeAuthenticationModal',false)
      },
      vendorAuth(){
        this.ajaxLoadingDialog = true
        window.open(this.signUpData.vendor_auth_url,'_parent')
    }
  }
}
</script>
<style scoped>
 .uber_cancel{
   text-align:center;
   margin-top:5px;
   font-family:'Roboto-500';
   color:#EA2330
 }
 .uber_tnc_txt{
     padding-top: 5px;
    padding-bottom: 5px;
    font-size: 12px;
    border-top: 1px solid rgba(189, 189, 189, 0.56);
    margin-top: 5px;
    border-bottom: 1px solid rgba(189, 189, 189, 0.56);
 }
 .ola_action{
    text-align: right;
    margin-top: 15px;
    font-family: 'Roboto-500';
 }
 .ola_title{
   font-size: 18px;
   font-family: 'Roboto-500';
 }
 .ola_content{
    margin-top: 5px;
    font-size: 14px;
    color: black;
    font-family:'Roboto-400'
 }
 .uber_primary_action{
    text-align: center;
    height: 40px;
    margin-top: 15px;
    background-color: rgb(25, 118, 210);
    color: white;
    border-radius: 5px;
    line-height: 2.7;
    font-size: 14px;
    font-family: 'Roboto-500';
 }
 .uber_secondary_action{
    color: rgb(25, 118, 210);
    text-align: center;
    margin-top: 15px;
    font-family: 'Roboto-500';
 }
 .uber_offer_badge{
    height: 20px;
    background-color: #EA2330;
    color: white;
    padding: 5px;
    padding-top: 1px;
    margin-left: -4px;
 }
 .uber_offers_dialog{
    background-color: #efefef;
    padding: 4px;
    font-size: 12px;
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
  padding-bottom:1px;
}
.modal-header {
    font-size: 20px;
    font-weight: 500;
    color: black;
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
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
