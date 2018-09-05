<template>
  <v-app class="cd_bg">

    <v-toolbar class="white fixed_header"  grow>
      <v-layout row wrap class="layout_header" style="margin:0px;">
          <v-toolbar class="white fixed_header"  grow>
              <v-icon  @click="navigateToSRP">arrow_back</v-icon>
              <v-toolbar-title>Review Bookings</v-toolbar-title>
          </v-toolbar>

      <!-- <v-layout>
          <v-flex xs9>
              <v-flex xs12 class="header_title_txt roboto-400">
                {{toStorePDate}}, {{ searchParams.pickUpTime}}
                <v-icon class="fa_long_icon_exchange">swap_horiz</v-icon>{{toStoreDDate}}, {{ searchParams.dropTime}}
              </v-flex>
              <v-flex xs12 class="header_subtitle_txt roboto-400">
                {{searchParams.pickUplocationSelf}}
              </v-flex>
          </v-flex> -->
      </v-layout>
    </v-toolbar>

    <SD-Search-Params></SD-Search-Params>
    <SD-Plan-Details></SD-Plan-Details>
    <PersonalDetailView></PersonalDetailView>
<!--    <promo-code></promo-code>-->
    <SD-Fare-Breakup-View :fareInfoDialog="fareInfoDialog" @fareInfoDialogClose="fareInfoDialog=false"></SD-Fare-Breakup-View>

    <v-layout row wrap name="body" class="pd15 rel bg_white" @click.stop="openGSTDetailsForm">
                <v-icon v-if="getGSTDetailsForm.gst_details.number != ''" >done</v-icon>
                <span class="txt_terms gst-text">
                   {{getGSTDetailsForm.gst_details.number!=""? 'Review your GST Details' :'Add your GST Details'}}
                </span>
                <span class="display_value" v-if="getGSTDetailsForm.gst_details.number == ''">
                   (Optional)  <v-icon class="hv_info_icon" slot="activator" @click.stop="openGSTInfoDialog">info_outline</v-icon>
                </span>
                <span class="pos-rel" >
                  <v-icon class="fs20 mt5">keyboard_arrow_right</v-icon>
                </span>
            </v-layout>
            <v-divider class="dfb_divider">
            </v-divider>
            <gst-info-dialog-view :GSTInfoDialog="GSTInfoDialog" @GSTInfoDialogClose="GSTInfoDialog=false"></gst-info-dialog-view>
            <gst-form-details-view :GSTDetailsForm="GSTDetailsForm" @closeGSTFormDetails="GSTDetailsForm=false"></gst-form-details-view>

            <v-card class="text_head">
              <v-card-text>
                <p class="text-md-center">You're not allowed to take Rev Cars to Leh Laddakh regions.
                  You'll be fully liable for any damages incurred on the vehicle. You're agreed to
                  <a class="policy_revv" @Click="policyDialog = true">Revv Cars</a>
                    and
                  <a class="policy_yatra">Yatra</a> terms and conditions.
                </p>
              </v-card-text>
            </v-card>

    <SD-Policy-view :policyDialog="policyDialog" @termsDialogClose="policyDialog = $event"></SD-Policy-view>

    <div>
      <v-btn block slot="activator" class="btn_paynow"  @click.stop="redirectToPayment"> Proceed </v-btn>
    </div>

    <cab-login-block
      :openLoginDialog="openLoginDialog"
      @closeLoginDialog="openLoginDialog = false">
    </cab-login-block>

    <loader-view
      v-if="showLoader">
    </loader-view>

  </v-app>
</template>
<script>
import router from "../../router";
import * as types from "../../store/types";
import { mapGetters, mapMutations } from "vuex";
import { adobeAnalyticsPageView } from "../../helpers/adobeAnalytics";
export default {
  data() {
    return {
      openLoginDialog: false,
      policyDialog: false,
      fareInfoDialog: true,
      showLoader: false,
      toStorePDate: "",
      toStoreDDate: "",
      GSTDetailsForm: false,
      GSTInfoDialog: false
    };
  },
  components: {
    SDPlanDetails: () =>
      import("../../components/selfDrive/selfDriveDetails/SDPlanDetails"),
    PersonalDetailView: () =>
      import("../../components/selfDrive/selfDriveDetails/PersonalDetailView"),
    SDFareBreakupView: () =>
      import("../../components/selfDrive/selfDriveDetails/SDFareBreakupView"),
    SDSearchParams: () =>
      import("../../components/selfDrive/selfDriveDetails/SDSearchParams"),
    SDPolicyView: () =>
      import("../../components/selfDrive/selfDriveDetails/SDPolicyView"),
    CabLoginBlock: () => import("../../components/cabsLoginPage/cabLoginBlock"),
    LoaderView: () => import("../../components/common/loader"),
    CabPaySwift: () => import("../../views/CabPaySwift"),
    GstInfoDialogView: () =>
      import("../../components/selfDrive/selfDriveDetails/GSTInfoDialogView"),
    GstFormDetailsView: () =>
      import("../../components/selfDrive/selfDriveDetails/GSTFormDetailsView")
  },

  computed: {
    ...mapGetters({
      getSearchParams: types.GET_SD_SEARCH_PARAMS,
      getCabFareDetails: types.GET_SD_FARE_DETAILS,
      getcabsSRPData: types.GET_SD_SRP_DATA,
      getGSTDetailsForm: types.GET_GST_DETAILS,
      getUserInfo: types.GET_USER_INFO
    }),
    cabsFareDetails() {
      return this.getCabFareDetails;
    },
    searchParams() {
      let strrePDate = this.getSearchParams.pickUpDate;
      this.toStorePDate = strrePDate.substr(strrePDate.indexOf(",") + 2);
      let strreDDate = this.getSearchParams.returnDate;
      this.toStoreDDate = strreDDate.substr(strreDDate.indexOf(",") + 2);
      return this.getSearchParams;
    }
  },
  created() {
    adobeAnalyticsPageView(
      this.getcabsSRPData.travel_type == "outstation"
        ? "yt:outstation cab:checkout:review"
        : "yt:hourly cab:checkout:review",
      this.getcabsSRPData.travel_type == "outstation"
        ? "outstation cab"
        : "hourly cab",
      "business",
      this.getcabsSRPData.travel_type == "outstation"
        ? "outstation cab checkout"
        : "hourly cab checkout",
      "review",
      "",
      ""
    );

  },
  methods: {
    ...mapMutations({
      setUserInfo: types.SET_USER_INFO
    }),
    navigateToSRP() {
      router.push({ name: "SelfDriveSRP" });
    },
    openGSTDetailsForm() {
      this.GSTDetailsForm = true;
    },
    openGSTInfoDialog() {
      this.GSTInfoDialog = true;
    },
    redirectToPayment(ssoToken) {
      if (
        this.getCabFareDetails.plan.vendor_plans[0].plans[
          this.getCabFareDetails.selectedPlan
        ].total_amount
      ) {
        this.showLoader = false;
        router.push({ name: "PaySwift" });
      } else {
        let createOrderDetails = {
          travel_type: this.getcabsSRPData.travel_type,
          search_id: this.getcabsSRPData.search_id,
          fare_id: this.getCabFareDetails.fare_id,
          gst_details:
            this.getGSTDetailsForm.gst_details.address != ""
              ? this.getGSTDetailsForm.gst_details
              : null
        };
        let self = this;
        Vue.http.headers.common["Content-Type"] = "application/json";
        Vue.http.headers.common["YT-CHANNEL"] = "CABSPWA";
        Vue.http.headers.common["YT-TENANT-CODE"] = "1795";
        Vue.http.options.emulateJSON = false;
        this.$http.post("v1/orders", createOrderDetails).then(
          function(response) {
            self.showLoader = false;
            if (response.status == 200) {
              router.push({ name: "CabsConfirmation" });
            }
          },
          function(response) {
            self.showLoader = false;
          }
        );
      }
    },
    createOrder() {
      let userLoginParams = {
        includeOptionalParams: true,
        channel: "B2C",
        productId: "SDPWA"
      };
      this.showLoader = true;
      let self = this;
      if (Object.keys(this.getUserInfo).length != 0) {
        Vue.http.headers.common["Content-Type"] =
          "application/x-www-form-urlencoded;charset=utf-8";
        Vue.http.options.emulateJSON = true;
        this.$http.post("/social/user/userProfile.htm", userLoginParams).then(
          function(response) {
            if (response.body.status == "FAIL") {
              self.showLoader = false;
              self.openLoginDialog = true;
            } else {
              self.setUserInfo(response.body.responseData.userInfo);
              self.openLoginDialog = false;
              self.redirectToPayment(response.body.ssoToken);
            }
          },
          function(response) {
            self.showLoader = false;
          }
        );
      } else {
        self.redirectToPayment(undefined);
      }
    }
  }
};
</script>

<style scoped>
.btn_paynow {
  padding-left: 15px;
  padding-right: 15px;
  background: #ea2330 !important;
  color: #fff;
  margin-top: 15px;
}
.layout_header {
  margin: 0px;
}
.text_head {
  margin-top: 15px;
}
.pos-rel {
  position: relative;
  right: -50px !important;
}
.bg_white {
  background-color: #fff;
  padding: 10px;
}
</style>
