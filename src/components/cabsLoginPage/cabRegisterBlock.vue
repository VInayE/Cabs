<template>
  <v-dialog v-model="registerDialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
     <v-snackbar class="snacktxt" :timeout="timeout" :bottom="y === 'bottom'" v-model="snackbar">
            {{snackbarText}}
        <v-btn flat class="txt-ff" @click.native="snackbar = false">Close</v-btn>
      </v-snackbar>
    <v-card>
      <v-toolbar dark class="white cd_fixed_header">
          <v-btn icon @click.stop="closeRegisterDialog" dark>
            <v-icon class="cl_white_back">arrow_back</v-icon>
          </v-btn>
          <v-toolbar-title class="cd_header_white">Register with Yatra</v-toolbar-title>
          <v-spacer></v-spacer>
     </v-toolbar>
      <v-form v-model="valid" ref="form">
     <v-container>
        <v-layout row wrap>
                <v-flex xs6 class="">
                <v-text-field label="First Name" ref="input" required  v-model="firstName" class="pb0" :rules="submitted ? Firstnames_rule : []"></v-text-field>
                </v-flex>
                <v-flex xs5 offset-xs1 class="">
                <v-text-field label="Last Name" required  v-model="lastName" class="pb0" :rules="submitted ? Lastnames_rule: []"></v-text-field>
                </v-flex>
              
            <v-flex xs4 class="">
                <v-text-field label="ISD Code" v-model="selectedTelephoneCode" class="pb0" @click="telephoneDialog" v-on:keypress="telephoneDialog"></v-text-field>
            </v-flex>
            <v-flex xs7 offset-xs1 class="">
                <v-text-field label="Mobile Number"
                              required
                              v-model="phoneNumber"
                              maxlength="10"
                              class="pb0"
                              v-on:keypress="isNumber($event)"
                              :rules="submitted ? Phone_rules:[]"
                              ref= "registerPhone">
               </v-text-field>
            </v-flex>
              <v-flex xs12 class="">
                <v-text-field label="Email ID" ref= "registerEmail" v-model="emailId" color ="white"  class="pb0" required :rules="submitted ? Email_rules:[]"></v-text-field>
            </v-flex>
             <v-flex xs12 class="">
                <v-text-field label="Password" 
                              ref= "registerPassword" 
                              hint="It should have at least 8 characters length and should have at least 1 letter and 1 digit" 
                              v-model="password" 
                              color ="white"  
                              class="pb0" 
                              :append-icon="e3 ? 'visibility_off' : 'visibility'" 
                              :append-icon-cb="() => (e3 = !e3)" :type="e3 ? 'text' : 'password'"
                              required 
                              :rules="submitted ? Password_rules:[]">
                </v-text-field>
            </v-flex>
            <v-flex xs12>
                <v-btn class="regbtn" @click.stop="register">Register</v-btn>
            </v-flex>
        </v-layout>
    </v-container>
    </v-form>
             
                <v-flex xs12 class="text_policy txt-c p20">
                    By registering with us,you agree to Yatra's <a target="_blank" href="https://www.yatra.com/online/terms-of-service.html?withoutHeader=true" class="txt_blue">Terms and Conditions</a> and <a target="_blank" href="https://www.yatra.com/online/privacy-policy.html?withoutHeader=true" class="txt_blue">Privacy Policy</a>
                </v-flex>
               </v-card>
               <loader-view v-if="showLoader"></loader-view>
                <telephone-list-view :showTelephoneDialog="showTelephoneDialog" @closeTelephoneDialog="selectedTelephone($event)"></telephone-list-view>
               </v-dialog>

</template>
<script>
   import router from '../../router'
   import { mapMutations } from 'vuex'
   import * as types from '../../store/types'
   export default {
       props:['openRegisterDialog'],
       components: {
         LoaderView : () => import('../common/loader'),
         TelephoneListView : () => import('../common/telephoneListView')
       },
       watch: {
         openRegisterDialog (){
           this.registerDialog = this.openRegisterDialog
         }
       },
       data () {
           return {
               showTelephoneDialog: false,
               selectedTelephoneCode: '+91',
               snackbar: false,
               snackbarText:'',
               timeout: 3000,
               e3:false,
               y: 'bottom',
               valid: false,
               showLoader: false,
               firstName: '',
               lastName: '',
               emailId: '',
               registerDialog: false,
               phoneNumber: '',
               password: '',
               e3: false,
               isd: '',
               channel: 'b2c',
               productId: 'Cabs',
               submitted: false,
               Firstnames_rule:[
                (v) => !!v || 'First Name is Required',
               ],
               Lastnames_rule:[
                (v) => !!v || 'Last Name is Required',
               ],
               Email_rules:[
                (v) => !!v || 'Email addresss is required',
                (v) => /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})+$/.test(v) || 'Enter correct Email Address'
              ], 
               Phone_rules:[
                (v) => !!v || 'Phone Number is required',
                (v) => /^\d{10}$/.test(v) || 'Please enter valid phone no'
              ], 
              Password_rules:[
                (v) => !!v || 'Password is required',
                (v) =>  /^(?=^.{8,}$)(?=.*[a-zA-Z])(?=.*[0-9]).+$/.test(v) || 'Please enter valid password'
              ], 
           }
       },
       methods: {
           ...mapMutations({
              setUserInfo:types.SET_USER_INFO
            }),
           selectedTelephone (event) {
            this.selectedTelephoneCode = event && event != undefined && Object.keys(event).length >0 ? "+" + event.countryCode: '+91'
            this.showTelephoneDialog = false
            this.telephoneSelected = event
            },
           telephoneDialog () {
            this.showTelephoneDialog = true
           },
           isNumber (evt) {
             evt = (evt) ? evt : window.event;
             var charCode = (evt.which) ? evt.which : evt.keyCode;
             if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
                evt.preventDefault();;
             } else {
                return true;
             }
           },
           closeRegisterDialog () {
             this.registerDialog = false
             this.$emit('closeregisterDialog',false)
           },
           formIsValid () {
               var emailPattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
               var passwordPatterns =/^(?=^.{8,}$)(?=.*[a-zA-Z])(?=.*[0-9]).+$/
               return this.firstName !== '' && this.lastName !== '' && this.emailId !== '' &&  this.password !== '' && this.phoneNumber !== '' && emailPattern.test(this.emailId) && passwordPatterns.test(this.password)
           },
           register () {
             this.submitted = true
             if(this.$refs.form.validate()  && this.$refs.form.value && this.formIsValid() ) {
                let postData = {
                  email: this.emailId,
                  mobile: this.phoneNumber,
                  mobileISD: this.selectedTelephoneCode,
                  includeOptionalParams: true,
                  channel: this.channel,
                  productId: this.productId,
                  password:this.password
                }
                Vue.http.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
                Vue.http.options.emulateJSON = true;
                this.showLoader = true
                let self = this
                this.$http.post('/social/user/createUser.htm',postData).then(function (response) {
                  if (response.body.status == "SUCCESS") {
                     let userInfo = {
                         'email': response.body.responseData.userInfo.email,
                         'mob':response.body.responseData.userInfo.mobile,
                         'mobileISD':response.body.responseData.userInfo.mobileISD
                     } 
                     self.setUserInfo(userInfo)
                     self.closeRegisterDialog()
                     self.$emit('paymentRedirect')
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
       },
       computed: {
     
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
    color: #212121!important;
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
      position: fixed;
      bottom: 0px;
      padding-bottom: 20px;
      text-decoration: none;
    }
</style>
