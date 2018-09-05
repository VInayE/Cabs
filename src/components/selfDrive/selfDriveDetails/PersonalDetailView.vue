<template>
      <div class="review-sd">
        <v-dialog xs12 v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
          <div slot="activator" class="btn_div" >Add Mandatory info for Myles Car<span class="pencilIcon"></span>
          <p> This is a Mandatory information and will be forward to Myles Car</p>
          </div>
          <v-card>
            <v-toolbar class="white fixed_header"  grow>
              <v-btn icon @click="navigateToDetail"><v-icon >arrow_back</v-icon></v-btn>
              <v-toolbar-title>Mandatory info for Revv Cars</v-toolbar-title>
            </v-toolbar>
            <v-form class="drivingl" v-model="valid" ref="form">
             <!-- DL -->
              <v-layout fluid>
               <v-flex xs12 class="txt">
                 <v-text-field  id="testing" name="input-1" maxlength=13 v-model="driving_licence" label="Driving License Number"  :rules="DL_rules" :counter="13" required></v-text-field>
                </v-flex>
              </v-layout>
              <!-- Id proof -->
              <v-layout>
               <v-flex xs6><v-subheader class="idhead">ID Proof Type</v-subheader></v-flex>
               <v-flex xs6><v-select class="select" :items="items" v-model="selectbox" label="Select" single-line :rules="[v => !!v || 'Item is required']" required></v-select></v-flex>
              </v-layout>
              <v-layout >
                <v-flex xs12 class="txt">
                  <v-text-field  name="input-1" v-model="selectbox_number" label="Enetr Your Number" required></v-text-field>
                </v-flex>
              </v-layout>
              <v-flex xs12 class="btsave"><v-btn class="bt" @click="saveinfo"  block>Save</v-btn></v-flex>
            </v-form>
          </v-card>
        </v-dialog>
      </div>
    </template>

<script>
import router from "../../../router";
import { adobeAnalyticsPageView } from '../../../helpers/adobeAnalytics'
export default {
  data() {
    return {
      dialog: false,
      valid: false,
      selectbox: "",
      driving_licence: "",
      selectbox_number: "",
      DL_rules: [
        v => !!v || "Driving Licence is Required",
        v => v.length >= 13 || "DL must be 13 characters"
      ],
      items: [
        {
          text: "Passport"
        },
        {
          text: "AdharCard"
        },
        {
          text: "PAN"
        }
      ]
    };
  },

  computed: {
    formIsValid() {
      return {
        if (condition) {

        }
      }
    }
  },

  methods: {
    navigateToDetail() {
      this.dialog = false;
    },
    saveinfo() {
      if (this.$refs.form.validate() && this.$refs.form.value) {
        let userdocument = {
          driving_licencer: this.driving_licence,
          selectbox: this.selectbox,
          selectbox_number: this.selectbox_number
        };
        Vue.http.headers.common["YT-SSO-TOKEN"] =
          "application/x-www-form-urlencoded;charset=utf-8";
        Vue.http.options.emulateJSON = true;
        let self = this;
        this.ajaxLoading = true;
        this.$http.post("/cabs/v1/user/documents", userdocument).then(
          function(response) {
            if (response.body.status == "FAIL") {
              self.ajaxLoading = true;
            } else {

              if (self.selectectedLatitude.cabVendorId == "Auto") {
                self.setP2PSearchParams(self.selectectedLatitude);
                router.push({
                  name: "P2PCabDetails"
                });
              } else {
                self.checkLinkedUser();
              }
            }
          },
          function(response) {
            self.showLoader = false;
          }
        );
      }
    }
  }
};
</script>
<style>
.txt {
  padding-left: 10px;
  padding-right: 10px;
}

.btsave {
  padding-left: 10px;
  padding-right: 10px;
  font-weight: 400px;
  font-size: 14px;
}

.idhead {
  padding-top: 20px;
}

.select{
  padding-right: 10px;
}
.btn_div {
  font-size: 14px;
  font-weight: bold;
  position: relative;
}
.review-sd {
  padding: 10px;
  background-color: #fff;
   margin-top: 15px;
}
.btn_div>p{
  font-size: 9px;
  background-color: #fff;
  border-bottom: 0px;
}

p{
  margin-bottom: 0px;
}
.bt{
  background-color:#EA2330 !important
}


</style>
