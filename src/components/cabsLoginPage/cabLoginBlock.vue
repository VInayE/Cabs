<template>
  <v-dialog v-model="loginDialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
       <v-snackbar class="snacktxt" :timeout="timeout" :bottom="y === 'bottom'" v-model="snackbar">
            {{snackbarText}}
        <v-btn flat class="txt-ff" @click.native="snackbar = false">Close</v-btn>
       </v-snackbar>
      <v-card>
        <v-toolbar dark class="white cd_fixed_header">
            <v-btn icon @click.native="closeLoginDialog" dark>
                    <v-icon class="cl_white_back">arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title class="cd_header_white">Login to Yatra</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn dark flat @click.native="closeLoginDialog"></v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-form v-model="valid" ref="form" class="login-view">
            <div class="p20 login">
                <v-text-field label="Email ID" 
                              v-model="emailId" 
                              color ="white" 
                              class="pb0" 
                              ref="loginEmail"
                              required 
                              :rules="submitted ? Email_rules:[]">
               </v-text-field>
                <v-text-field name="input-10-2" 
                              label="Enter your password" 
                              hint="At least 8 characters" 
                              min="8" 
                              ref="loginPassword"
                              :rules="submitted ? password_rules:[]"
                              :append-icon="e3 ? 'visibility_off' : 'visibility'" 
                              :append-icon-cb="() => (e3 = !e3)" :type="e3 ? 'text' : 'password'" v-model="password" required>
               </v-text-field>
                <v-btn class="red loginBtn" @click.stop="submitLogin">Login</v-btn>
            </div>
        </v-form>
        <div class="registerTab">
            <v-layout row wrap>
                <v-flex xs5 class="txt_blue link_register" @click.stop="openRegisterDialog = true">Register</v-flex>
                <v-flex xs7  class="txt_blue txt-r" @click.stop="openForgotpasswordDialog = true">Forgot Password</v-flex>
            </v-layout>
            <cab-register-block 
                :openRegisterDialog="openRegisterDialog" 
                @closeregisterDialog="registerDialog" 
                @paymentRedirect="redirectToPayment">
            </cab-register-block>
        </div>
          
          <div class="forgotDialog">
            <cab-forgot-password-block 
                :openForgotpasswordDialog="openForgotpasswordDialog" @closeForgotDialog="closeForgotPasswordDialog">
            </cab-forgot-password-block>
        </div>

        <cab-linked-user-block 
            :openlinkedDialog="openlinkedDialog" 
            @closeLinkedDialog="loginDialog=true;openlinkedDialog = false" 
            @paymentRedirect="redirectToPayment">
        </cab-linked-user-block>    
        <div class="facebookBlock">
            <cab-facebook-block 
                @openLinkedAccount="openlinkedDialog = true" 
                @paymentRedirect="redirectToPayment"></cab-facebook-block>
        </div>
     </v-card>
     <loader-view v-if="showLoader"></loader-view>  
  </v-dialog>
</template>
<script>
   import router from '../../router'
   import { mapGetters,mapMutations } from 'vuex'
   import * as types from '../../store/types'
   import { adobeAnalyticsPageView } from '../../helpers/adobeAnalytics'
   import CabRegisterBlock from './cabRegisterBlock'
   export default {
     props:['openLoginDialog','cabsLoginOption','returnUrl'],
      components:{
        CabLinkedUserBlock :()=> import('./cabLinkedUserBlock'),
        CabRegisterBlock,
        CabFacebookBlock : () => import('./cabFacebookBlock'),
        LoaderView : () => import('../common/loader'),
        CabForgotPasswordBlock :()=> import('./cabForgotPasswordBlock'),
     },
     data () {
         return {
             snackbar: false,
             snackbarText:'',
             timeout: 3000,
             openlinkedDialog: false,
             y: 'bottom',
             showLoader: false,
             e3: false,
             emailId: '',
             valid:false,
             password: '',
             openRegisterDialog: false,
             loginDialog: false,
             openForgotpasswordDialog:false,
             CabsProductId: 'cabs',
             channel: 'b2c',
             dialog1: false,
             submitted: false,
             loginOption: '',
             password_rules:[
               (v) => !!v || 'Password is Required',
             ],
             Email_rules:[
              (v) => !!v || 'Email addresss is required',
              (v) => /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(v) || 'Enter correct Email Address'
            ], 
         }
     },
     watch:{
       openLoginDialog(){
           this.loginDialog = this.openLoginDialog
           this.loginOption = this.cabsLoginOption
           if(this.loginDialog){
             adobeAnalyticsPageView('yt:cab:checkout:login',this.cabsLoginOption == 'p2p' ? 'cab' : '','business','cab checkout','login','','')
           }
       }
     },
     methods: {
         ...mapMutations({
             setUserInfo:types.SET_USER_INFO
         }),
          registerDialog (){
               this.openRegisterDialog = false
               this.loginDialog = true
          },
          closeForgotPasswordDialog (){
            this.openForgotpasswordDialog = false
            this.loginDialog = true  
          },
           closeLoginDialog () {
             this.loginDialog = false
             this.$emit('closeLoginDialog', false)  
           },
           submitLogin () {
                  this.submitted = true
                  if(this.$refs.form.validate() && this.$refs.form.value){
                        let postData = {
                            "emailId": this.emailId,
                            "password": this.password,
                            "includeOptionalParams": 'true',
                            "productId": this.CabsProductId,
                            "channel": this.channel
                        }
                    this.showLoader = true
                    Vue.http.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
                    Vue.http.options.emulateJSON = true;
                    this.showLoader = true
                    let self = this
                    this.$http.post('/social/user/login.htm',postData).then(function (response) {
                    if (response.body.status == "SUCCESS") {
                       let userInfo = {
                         'email': response.body.responseData.userInfo.email,
                         'mob':response.body.responseData.userInfo.mobile,
                         'mobileISD':response.body.responseData.userInfo.mobileISD
                       }
                       self.showLoader = false
                       self.setUserInfo(userInfo)
                       if(self.returnUrl=='SelfDriveDetails'){
                           router.push({name:'SelfDriveDetails'})
					   }else{
                            self.redirectToPayment(response.body.ssoToken)
                        }
                    } else {
                      self.snackbar = true
                      self.snackbarText = response.body.responseMessage
                      self.showLoader = false
                    }
                  }, function (response) {
                      self.snackbar = true
                      self.snackbarText = response.body.responseMessage ? response.body.responseMessage: 'Some Error occured . Try after sometimes'
                      self.showLoader = false
                });
             }
           },
           redirectToPayment(){
              if(this.loginOption == 'p2p'){
                  this.loginDialog = false
                  this.loginOption =''
                  this.showLoader = false
                  this.$emit('cabsPPLogin',{})
              } else {
                 if(this.getCabFareDetails.fare_details.price.advance_charge) {
                   this.showLoader = false
                   router.push({name:'PaySwift'})
                 } else {
                   let createOrderDetails ={
                     'travel_type': this.getcabsSRPData.travel_type,
                     'search_id': this.getcabsSRPData.search_id,
                     'fare_id': this.getCabFareDetails.fare_id,
                     'gst_details':this.getGSTDetailsForm.gst_details.address !=''? this.getGSTDetailsForm.gst_details : {}
                }
                let self = this 
                this.$http.post('cabs/v1/orders',createOrderDetails).then(function (response) {
                    self.showLoader = false
                    if(response.status == 200) {
                        router.push({name: 'CabsConfirmation'})
                    }
                  }, function (response) {
                      self.showLoader = false
                });
              }
              }
         
           }
       },
       computed: {
        ...mapGetters({
           getcabsSRPData:types.GET_CABS_SRP_DATA,
           getCabFareDetails: types.GET_CAB_FARE_DETAILS,
           getGSTDetailsForm:types.GET_GST_DETAILS

        }),
        formIsValid () {
            return this.emailId !== '' && this.password !== ''
        }
    }
   }
</script>
<style scoped>
    .link_register{
       text-align: left;
       font-family: 'Roboto-500';
    }
    .cl_white_back{
    margin-left: 5px!important;
    font-size:25px;
    color:#616161!important;
  }
  .cd_header_white{
     font-weight: 500;
    font-size: 18px;
    color: #212121!important;
    margin-left: 0px;
    font-family: 'Roboto-500';
  }
    .p20 {
        padding: 20px; 
    }
    .pb0 {
        padding-bottom: 0;
    }
    .logintxt {
        color: #fff;
        font-weight: 500;
    }
    .loginBtn {
        color: #fff;
        width: 100%;
        margin: 0;
    }
    .registerTab {
        margin: 0 20px;
        text-align: center;
    }
    .forgotDialog {
        margin: 0 20px;
        text-align: center;
    }
    .application--light .btn--disabled:not(.btn--icon):not(.btn--flat) {
        background-color: #F34747 !important;
        color: #fff;
    }
    .wlogin {
        padding: 20px 20px 0 20px;
    }
    .txt-w {
        font-weight: 500;
        font-size: 16px;
    }
    .facebookBlock {
        padding: 0 20px;
        width: 100%;
        margin-top:20px;
        bottom: 0;
    }
</style>
