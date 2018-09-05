<template>
  <v-dialog v-model="forgotDialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
    <v-card class="bg-light">
      <v-toolbar dark class="white cd_fixed_header">
          <v-btn icon @click.stop="closeForgotDialog" dark>
            <v-icon class="cl_white_back">arrow_back</v-icon>
          </v-btn>
          <v-toolbar-title class="cd_header_white">Forgot Password</v-toolbar-title>
          <v-spacer></v-spacer>
     </v-toolbar>
     <v-flex xs12 style="background: rgb(250,250,250); padding: 20px 0 0;">
        <div class="lock-bg">
            <v-icon class="lock" style="padding: 8px 0 0 8px; color: #fff;">lock</v-icon>
        </div>
    </v-flex>
      <v-form v-model="valid" ref="form" class="forgot-popup">
     <v-container>
        <v-layout row wrap>
           
            <v-flex xs12 style="text-align: center; font-size: 14px; color: rgb(158,158,158); font-weight: 400; line-height: 24px !important; padding-bottom: 20px">
            Get instructions sent to this email that explain how to reset your password.
            </v-flex>
              <v-flex xs12 class="">
                <v-text-field label="Registered Email ID" ref= "registerEmail" v-model="emailId" color ="white"  class="pb0" required :rules="submitted ? Email_rules:[]"></v-text-field>
            </v-flex>
            <v-flex xs12>
                <v-btn class="regbtn" @click.stop="reset">Submit</v-btn>
            </v-flex>
        </v-layout>
    </v-container>
    </v-form>
             
              
               </v-card>
               <loader-view v-if="showLoader"></loader-view>
               </v-dialog>

</template>
<script>
   import router from '../../router'
   import { mapMutations } from 'vuex'
   import * as types from '../../store/types'
   export default {
       props:['openForgotpasswordDialog'],
       components: {
         LoaderView : () => import('../common/loader')
       },
       watch: {
         openForgotpasswordDialog (){
           this.forgotDialog = this.openForgotpasswordDialog
           this.emailId = '',
           this.submitted = false       
         }
       },
       data () {
           return {
               timeout: 3000,
               y: 'bottom',
               valid: false,
               showLoader: false,
               emailId: '',
               submitted:false,
               forgotDialog: false,
               channel: 'b2c',
               productId: this.productType,
               Email_rules:[
                (v) => !!v || 'Email addresss is required',
                (v) => /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})+$/.test(v) || 'Enter correct Email Address'
              ],  
           }
       },
       methods: {
           ...mapMutations({
              setUserInfo:types.SET_USER_INFO
            }),
           isNumber (evt) {
             evt = (evt) ? evt : window.event;
             var charCode = (evt.which) ? evt.which : evt.keyCode;
             if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
                evt.preventDefault();;
             } else {
                return true;
             }
           },
           closeForgotDialog () {
             this.forgotDialog = false
             this.$emit('closeForgotDialog',false)
           },
           formIsValid () {
               var emailPattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
               return this.emailId !== '' && emailPattern.test(this.emailId)
           },
           reset () {
             this.submitted = true
             if(this.$refs.form.validate()  && this.$refs.form.value && this.formIsValid() ) {
                let postData = {
                  email: this.emailId
                }
                Vue.http.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
                Vue.http.options.emulateJSON = true;
                this.showLoader = true
                let self = this
                let url = '/social/user/forgotPassword.htm?emailId='+this.emailId+'&includeOptionalParams=true&channel=B2c&productId=pwa_cab_outstation'
                this.$http.get(url).then(function (response) {
                  if (response.body.status == "SUCCESS") {
                         self.showLoader = false
                         this.forgotDialog = false
                         this.$emit('closeForgotDialog',false)
                         //self.closeForgotDialog();
                  } else {
                    self.snackbar = true
                    self.snackbarText = response.body.responseMessage
                    self.showLoader = false
                 }
                }, function (response) {
                 self.snackbar = true
                 self.snackbarText =response.body.responseMessage ?response.body.responseMessage :  'Some Error occured . Try after sometimes'
                 self.showLoader = false
               });
             }
           }
       }
   }

</script>
<style scoped>
  .txt_already{
      padding-left:22px;
  }
  .cl_white_back{
    margin-left: 5px!important;
    font-size:25px;
    color:#616161!important;
  }
  .cd_header_white{
     font-weight: 500;
    font-size: 18px;
    color:  rgba(0, 0, 0, 0.87) !important;
    margin-left: 0px;
    font-family: 'Roboto-500';
  }
   .p20 {
        padding: 20px;
    }
    .txt-y {
        font-weight: 500;
        font-size: 16px;
    }
    .pb0 {
        padding-bottom: 0;
    }
    .regbtn {
    width: 100%;
    margin: 10px 0;
}
    .regbtn {
       background-color: #EA2330!important;
    color: #fff!important;
    font-family: 'Roboto-500'!important;
    text-transform: capitalize!important;
    height:43px;
    }
    .text_policy{
      font-size: 11px;
      text-align: center;
      padding: 50px;
      margin:40px 0 0;
      bottom: 0px;
      padding-bottom: 20px;
      text-decoration: none;
    }
    .lock-bg{
        width: 40px;
        margin: 0 auto;
        background: rgb(30,136,229);
        border-radius: 100%;
        height: 40px;
        position: relative;
        top:20px;
    }
    .forgot-popup{
        background: #fff;
        padding: 20px 0 0;
        width: 90%;
        margin: 0 5%;
    }
    .bg-light{
        background: rgb(250,250,250);
    }
    ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
    color: #999;
    }
    ::-moz-placeholder { /* Firefox 19+ */
      color: #999;
    }
    :-ms-input-placeholder { /* IE 10+ */
      color: #999;
    }
    :-moz-placeholder { /* Firefox 18- */
      color: #999;
    }
    .application--light .input-group:not(.input-group--error) label{
        color: #333 !important;
    }
</style>
