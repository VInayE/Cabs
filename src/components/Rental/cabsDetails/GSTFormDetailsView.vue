<template>
  <v-layout row justify-center style="z-index:20">
    <v-dialog v-model="GSTDetailsForm" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-card>
        <v-form v-model="valid" ref="form">
          <v-toolbar dark class="white cd_fixed_header" >
            <v-btn icon @click.native="closeGSTForm" dark style="margin-left:0px;">
              <v-icon class="cl_white_back padding_left_14">arrow_back</v-icon>
            </v-btn>
            <v-toolbar-title class="cd_header_white">{{updateGST?'Update GST Details':'Add GST Details'}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click.native="clearGSTForm" class="gst_clear_all">Clear All</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-layout row wrap class="gst_form_background">
            <v-flex xs12 class="gst_form_div">
              <v-layout row wrap style="font-family: Roboto-500;font-size:12px;margin-bottom:10px;">
                  Please fill the details as per your GST registration
              </v-layout>
              <v-container fluid>
                  <v-layout row wrap>
                    
                      <v-flex xs12 class="inputHeight">
                        <v-text-field label="GST Number" 
                                      autofocus
                                      ref="gstInput"
                                      required
                                      v-model="gstFormDetails.gst_details.number"
                                      :rules="submitted ? gstNumber_rules: []">
                        </v-text-field>
                      </v-flex>
                      <v-flex xs12 class="inputHeight">
                        <v-text-field label="Name"  
                                      ref="input"
                                      required
                                      v-model="gstFormDetails.gst_details.name" 
                                      :rules="submitted ? names_rule : []">
                        </v-text-field>
                      </v-flex>
                      <v-flex xs12 class="inputHeight">
                        <v-text-field label="Email"
                                      ref="emailInput"
                                      required
                                      v-model="gstFormDetails.gst_details.email" 
                                      :rules="submitted ? gstEmail_rules : []">
                        </v-text-field>
                      </v-flex>
                      <v-flex xs12 class="inputHeight">
                        <v-text-field label="Address" 
                                      required 
                                      v-model="gstFormDetails.gst_details.address"
                                      :rules="submitted ? gstAddress_rules :[]">
                        </v-text-field>
                      </v-flex>
                      <v-flex xs12 class="inputHeight">
                        <v-text-field label="City"
                                        ref="cityInput1"
                                        required
                                        v-model="gstFormDetails.gst_details.city"
                                        :rules="submitted ? gstCity_rules :[] ">
                        </v-text-field>
                      </v-flex>
                      <v-flex xs4 class="inputHeight">
                      <v-text-field label="Pincode" 
                                      type="text" 
                                      ref="pincodeInput"
                                      v-model="gstFormDetails.gst_details.pincode"
                                      required
                                      @keyup = "isPincode"
                                      maxlength="6"
                                      :rules="submitted ? gstPincode_rules :[]">
                        </v-text-field>
                      </v-flex>
                      <v-flex xs8 class="inputHeight">
                        <v-text-field label="State" 
                                      ref="stateListInput"
                                      required
                                      @click="showState"
                                      v-on:keydown="showState"
                                      v-model="gstFormDetails.gst_details.state_code"
                                      :rules="submitted ? gstState_rules: []">
                        </v-text-field>

                      </v-flex>
                      <v-flex xs3 class="inputHeight">
                        <v-text-field label="ISD"
                                      @click="telephoneDialog"
                                      v-on:keyup="telephoneDialog"
                                      v-model="selectedTelephoneCode">
                        </v-text-field>
                      </v-flex>
                      <v-flex xs9 class="inputHeight">
                        <v-text-field label="Phone Number"
                                      type="text"
                                      ref="phoneNumberInput"
                                      required
                                      v-model="gstFormDetails.gst_details.phone"
                                      @keyup="isTelephone"
                                      :maxlength="selectedTelephoneCode == '+91'?10:16"
                                      :minlength="selectedTelephoneCode == '+91'?0:3"
                                      :rules="submitted ? gstPhone_rules : []">
                        </v-text-field>
                      </v-flex>
                  </v-layout>
              </v-container>
                <telephone-list-view :showTelephoneDialog="showTelephoneDialog" :selectedtGSTISD="selectedTelephoneCode.substring(1,selectedTelephoneCode.length)" @closeTelephoneDialog="selectedTelephone($event)"></telephone-list-view>
                <state-list-view :showStateListdialog="showStateListdialog" @closeStateDialog="stateSelected($event)" :selectedGSTStateCode="selectedState.stateCode"></state-list-view>
              <v-layout row wrap style="color: rgb(158,158,158);font-family: Roboto-400;font-size: 11px">
                <v-flex xs12>Please Note:</v-flex>
                <v-flex xs12>Your taxes may get updated post submitting you GST details.Please review the final amount in fare Details</v-flex>
              </v-layout>  
             <v-btn block  @click="saveGSTForm" class="gst-btn" style="color:white">
                {{updateGST?'Update GST Details' : 'Submit GST Details'}}
            </v-btn>
            <v-btn block  @click="removeGST" class="remove-gst-btn" v-if="updateGST">
               Remove GST
            </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card>
    </v-dialog>
   
  </v-layout>
</template>
<script>
  import { mapGetters ,mapMutations } from 'vuex'
  import * as types from '../../../store/types'
  import { adobeAnalyticsPageView } from '../../../helpers/adobeAnalytics'
  export default {
    props: ['GSTDetailsForm'],
    components:{
      StateListView : () => import('./stateList'),
      TelephoneListView :() => import('../../common/telephoneListView')
    },
    watch:{
      GSTDetailsForm () {
        if(this.GSTDetailsForm){
          this.updateGST= this.getGSTDetailsForm.gst_details.number !="" ? true : false
          if(this.updateGST){
            this.gstFormDetails = this.getGSTDetailsForm
          }
          this.selectedState.stateCode = this.gstFormDetails.stateCode
          adobeAnalyticsPageView(this.getcabsSRPData.travel_type == 'outstation'? 'yt:outstation cab:checkout:review:gst': 'yt:hourly cab:checkout:review:gst',this.getcabsSRPData.travel_type == 'outstation'? 'outstation cab':'hourly cab','business',this.getcabsSRPData.travel_type == 'outstation'? 'outstation cab checkout':'hourly cab checkout','review','gst','')  
        }
      }
    },
    methods: {
      ...mapMutations({
          setGstFormDetails:types.SET_GST_FORM_DEATILS
      }),
     isPincode(evt){
       var pattern = /^[a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/
       var pinPattern = pattern.test(this.gstFormDetails.gst_details.pincode);
        if(pinPattern)
          {
              if(evt.keyCode == 222)
                 {
                 this.gstFormDetails.gst_details.pincode = null;
                 }
              
              else
                 {
                this.gstFormDetails.gst_details.pincode = this.gstFormDetails.gst_details.pincode.substring(0,this.gstFormDetails.gst_details.pincode.length-1);
                 }    
           }
      var selection = window.getSelection().toString();
            if ( selection !== '' ) {
                return;
            }
      var input = this.gstFormDetails.gst_details.pincode.replace(/\D/g, "");
      this.gstFormDetails.gst_details.pincode = input === 0  ? "" : input; 
      },
           isTelephone(evt){
       var pattern = /^[a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/
       var phonePattern = pattern.test(this.gstFormDetails.gst_details.phone);
        if(phonePattern)
          {
              if(evt.keyCode == 222)
                 {
                 this.gstFormDetails.gst_details.phone = null;
                 }
              
              else
                 {
                  this.gstFormDetails.gst_details.phone = this.gstFormDetails.gst_details.phone.substring(0,this.gstFormDetails.gst_details.phone.length-1);
                 }    
           }
      var selection = window.getSelection().toString();
            if ( selection !== '' ) {
                return;
            }
      var input = this.gstFormDetails.gst_details.phone.replace(/[\D\s\._\-]+/g, "");
      this.gstFormDetails.gst_details.phone = input === 0  ? "" : input;
  
      },
      showState(){
       this.$refs.stateListInput.blur()
       this.showStateListdialog = true
      },
      clearGSTForm () {
         this.submitted = false
          let gst_details =  {
           'gst_details': {
              'number': '',
              'name': '',
              'address': '',
              'state_code': '',
              'city': '',
              'pincode': '',
              'phone': '',
              'email': ''
          }
        }
         this.selectedState={}
         this.gstFormDetails = gst_details
         this.$refs.gstInput.focus() 
         this.selectedTelephoneCode ='+91'
      },
      selectedTelephone (event) {
         this.selectedTelephoneCode = event && event != undefined && Object.keys(event).length >0 ? "+" + event.countryCode: '+91'
         this.showTelephoneDialog = false
         this.telephoneSelected = event
      },
      telephoneDialog () {
        this.showTelephoneDialog = true
      },
      stateSelected (event) {
        this.selectedState = event
        this.gstFormDetails.gst_details.state_code = this.selectedState.stateName
        this.showStateListdialog = false
      },
      openStateDialog() {
        this.showStateListdialog = true;
      },
      closeGSTForm () {
        this.clearGSTForm ()
        this.$emit('closeGSTFormDetails', false)
      },
      saveGSTForm () {
         this.submitted = true
          if (this.$refs.form.validate()  && this.$refs.form.value && this.formIsValid()) {
           this.gstFormDetails.stateCode = this.selectedState.stateCode 
           this.setGstFormDetails(this.gstFormDetails)
           this.submitted = false
           this.$emit('closeGSTFormDetails', false)
       }
      }, 
     formIsValid () {
        var gstpattern = /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[A-Za-z0-9]{3}$/
        var emailPattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
        var telephoneCodePattern = this.selectedTelephoneCode == '+91'? /^\d{10}$/.test(v) : /^\d{3,16}$/.test(v)
        return  this.gstFormDetails.gst_details.number !== '' && this.gstFormDetails.gst_details.name !== '' && this.gstFormDetails.gst_details.email !== '' && this.gstFormDetails.gst_details.address !== '' && this.gstFormDetails.gst_details.city !== '' && this.gstFormDetails.gst_details.pincode !== '' && this.gstFormDetails.gst_details.phone !== '' && this.gstFormDetails.gst_details.state_code !== '' && emailPattern.test(this.gstFormDetails.gst_details.email) && gstpattern.test(this.gstFormDetails.gst_details.number) && telephoneCodePattern.test(this.gstFormDetails.gst_details.phone)
      },
      removeGST(){
        let gst_details =  {
         'gst_details': {
            'number': '',
            'name': '',
            'address': '',
            'state_code': '',
            'city': '',
            'pincode': '',
            'phone': '',
            'email': ''
          }
        }
        this.selectedState = {}
        this.gstFormDetails = gst_details
        this.setGstFormDetails(gst_details)
        this.submitted = false
        this.$emit('closeGSTFormDetails', false)
      },
      isNumber(evt,option) {
          evt = evt ? evt : window.event
          var charCode = evt.which ? evt.which : evt.keyCode
          if ((evt.keyCode > 31 && (evt.keyCode < 48 || evt.keyCode > 57))) {
            return false
          } else {
            return true;
          }
    }
    },
    created (){
      this.gstFormDetails = this.getGSTDetailsForm
     
    },
    computed: {
      ...mapGetters({
        getGSTDetailsForm:types.GET_GST_DETAILS,
        getcabsSRPData: types.GET_CABS_SRP_DATA
      }),
    
    },
    data () {
      return {
        gstFormDetails: {},
        showStateListdialog: false,
        updateGST:false,
        telephoneSelected: {},
        showTelephoneDialog: false,
        selectedState:{},
        submitted: false,
        selectedTelephoneCode: '+91',
        submitted:false,
        valid: false,
        gstNumber_rules:[
          (v) => !!v  || 'GST No is required',
          (v) => /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[A-Za-z0-9]{3}$/.test(v)   || 'Enter correct GST No'
        ],
        names_rule:[
          (v) => !!v || 'Name is Required',
        ],
        gstEmail_rules:[
           (v) => !!v || 'Email addresss is required',
           (v) => /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(v) || 'Enter correct Email Address'
        ], 
        gstAddress_rules:[
           (v) => !!v || 'Address is Required',
        ],
        gstCity_rules:[
          (v) => !!v || 'City is Required',
          (v) => /^[A-Za-z\s]+$/.test(v) || 'Enter correct City'
        ],
        gstPincode_rules:[
           (v) => !!v || 'Pincode is Required',
           (v) => /^[1-9][0-9]{5}$/.test(v) || 'Enter correct pincode'
        ], 
        gstState_rules:[
            (v) => !!v || 'State name is Required',
        ], 
        gstPhone_rules:[
            (v) => !!v || 'Phone Number is Required',
            (v) => (this.selectedTelephoneCode == '+91'? /^\d{10}$/.test(v) : /^\d{3,16}$/.test(v)) || 'Enter correct telephone number'
        ]
      }
    }
  }
</script>
<style scoped>
  .gst_clear_all{
    color: rgb(234, 35, 48)!important;
    text-transform: capitalize;
  }
  .cd_header_white{
    font-weight:500;
    font-size:17px;
    color:#212121;
    margin-left:0px;
    font-family:'Roboto-500'
  }
  .cl_white_back{
    margin-left: 5px!important;
    font-size:25px;
    color:#616161!important;
  }
  .gst_form_div{
      background-color:white;
      padding:10px;
  }
  .gst_form_background{
      padding:10px;
  }
  .container{
    padding:0px!important;
  }
  .inputHeight{
    height: 70px!important
  }
    .application--light .btn--disabled:not(.btn--icon):not(.btn--flat) {
        background-color: #F34747 !important;
        color: #fff;
    }
    .gst-btn{
      background: #EA2330!important;
      color: #fff;
      font-weight: 400;
      padding: 10px;
      text-align: center;
      width: 100%;
      margin-top:20px;
      bottom: 0;
      margin-bottom: 0;
      font-size: 14px;
      left: 0;
      outline: none;
      font-family:'Roboto-500';
      text-transform:capitalize;
      height:43px;
    }
    .remove-gst-btn{
       background: white!important;
      color: #EA2330;
      border:1px solid #EA2330;
      box-shadow:none!important;
      border-radius:5px;
      font-weight: 400;
      padding: 10px;
      text-align: center;
      width: 100%;
      margin-top:10px;
      bottom: 0;
      margin-bottom: 0;
      font-size: 14px;
      left: 0;
      outline: none;
      font-family:'Roboto-500';
      text-transform:capitalize;
      height:43px;
    }
</style>