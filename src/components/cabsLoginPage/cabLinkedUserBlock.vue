<template>
<v-dialog v-model="linkedDialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
   <v-snackbar class="snacktxt" :timeout="timeout" :bottom="y === 'bottom'" v-model="snackbar">
            {{snackbarText}}
        <v-btn flat class="txt-ff" @click.native="snackbar = false">Close</v-btn>
      </v-snackbar>
   <v-layout row wrap>
   <v-flex xs12>
    <v-card>
      <v-toolbar dark class="red">
          <v-btn icon @click.stop="closeLinkedAccountDialog" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Continue Login</v-toolbar-title>
          <v-spacer></v-spacer>
     </v-toolbar>
    </v-card>
      <div class="p20 login">
          <v-text-field
            label="Email Address"
            v-model="emailId"
            color ="white"
            class="pb0"
            required
            ref = "linkedEmail"
            :rules="submitted ? [Email_rules.required,Email_rules.patternValidation]:[]">
            </v-text-field>
            <v-flex xs3 class="">
               <v-text-field label="ISD"
                             v-model="mobileISD"
                             class="pb0"
                             v-on:keypress="telephoneDialog">
               </v-text-field>
            </v-flex>
            <v-flex xs9 class="">
               <v-text-field label="Phone Number"
                             required
                             v-model="mobile"
                             maxlength="10"
                             class="pb0"
                             ref = "linkedMobile"
                              v-on:keypress="isNumber($event)"
                             :rules="submitted ? [Phone_rules.required,Phone_rules.patternValidation]:[]"
                             >
               </v-text-field>
           </v-flex>
                        <div>
              <v-btn class="red loginBtn" @click.stop="submitLogin" :disabled="!formIsValid">Login Now</v-btn>
            </div>
            
        </div>
        </v-flex>
         <loader-view v-if="showLoader"></loader-view>  
          <telephone-list-view :showTelephoneDialog="showTelephoneDialog" @closeTelephoneDialog="selectedTelephone($event)"></telephone-list-view>
        </v-layout>
    </v-dialog>
</template>
<script>
   import { mapMutations } from 'vuex'
   import * as types from '../../store/types' 
   export default {
    props:['openlinkedDialog'],
    watch:{
      openlinkedDialog(){
         this.linkedDialog = this.openlinkedDialog
      }
    }, 
    components: {
        TelephoneListView :() => import('../common/telephoneListView'),
        LoaderView :() => import('../common/loader')
    },  
    data () {
         return {
             snackbar: false,
             snackbarText:'',
             timeout: 3000,
             y: 'bottom',
             showLoader: false,
             emailId: '',
             CabsProductId: 'cabs',
             linkedDialog: false,
             channel: 'b2c',
             productId:'Cabs',
             showTelephoneDialog: false,
             mobile: '',
             mobileISD: '+91',
             submitted: false,
             Email_rules: {
                required: (value) => !!value || 'Email is required',
                patternValidation: (value) => {
                 const pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
                 return  pattern.test(value) || 'Enter valid Email Address'
               }
             },  
             Phone_rules: {
                  required: (value) => !!value || 'Phone Number is required',
                  patternValidation: (value) => {
                    const pattern = /^\d{10}$/
                    return pattern.test(value) || 'Please enter valid phone no'
                  }
             } 
         }
     },
       methods: {
            ...mapMutations({
                       setUserInfo:types.SET_USER_INFO
            }),
           closeLinkedAccountDialog(){
               this.linkedDialog = false
               this.$emit('closeLinkedDialog', false)
           },
           selectedTelephone (event) {
                this.mobileISD =event && event != undefined && Object.keys(event).length >0 ? "+" + event.countryCode: '+91'
                this.showTelephoneDialog = false
                this.telephoneSelected = event
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
            telephoneDialog () {
             this.showTelephoneDialog = true
           },
           submitLogin () {
                  this.submitted = true
                  if(this.Email_rules.patternValidation(this.$refs.linkedEmail.value) === true && this.Phone_rules.patternValidation(this.$refs.linkedMobile.value)===true){
                      let postData = {
                         "emailId": this.emailId,
                         "mobile": this.mobile,
                         "mobileISD": this. mobileISD,
                         "includeOptionalParams": 'true',
                         "channel": this.channel,
                         "productId": this.productId      
                      }
                      Vue.http.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
                      Vue.http.options.emulateJSON = true
                      let self = this
                      this.showLoader = true
                      this.$http.post('https://www.yatra.com/social/user/createUser.htm',postData).then(function (response) {
                        if (response.body.status == "SUCCESS") {
                             let userInfo = {
                              'email': response.body.responseData.userInfo.email,
                              'mob':response.body.responseData.userInfo.mobile,
                              'mobileISD':response.body.responseData.userInfo.mobileISD
                             } 
                            self.setUserInfo(userInfo)
                            self.$emit('paymentRedirect')
                        } else {
                            self.snackbar = true
                            self.snackbarText = response.body.responseMessage
                            self.showLoader = false
                        }
                        }, function (response) {
                            self.snackbar = true
                            self.snackbarText = 'Some Error occured . Try after sometimes'
                            self.showLoader = false
                     });
                  }
           }
       },
       computed: {
         formIsValid () {
           return this.emailId !== '' && this.mobileISD !== '' && this.phoneNumber !== ''
         }
    }
   }
</script>
<style scoped>
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
   
</style>
