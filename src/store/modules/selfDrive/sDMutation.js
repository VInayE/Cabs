import * as types from '../../types'

export const mutations = {
  // [types.SET_SD_APPLY_FILTER]: (state, payload) => {
  //   state.sdSrpFilterOption = payload
  // },
  [types.SET_SD_SRP_FILTER_OPTIONS]: (state, payload) => {
    state.sdSrpFilterOption = payload
  },
  [types.SET_SD_FARE_DETAILS]: (state, payload) => {
    state.sdFareDetails = payload
  },
  [types.SET_SD_SEARCH_PARAMS]: (state, payload) => {
    state.sdSearchParams = payload
  },
  [types.SET_SD_SRP_DATA]: (state, payload) => {
    state.sdSRPData = payload
  },
  [types.SET_SD_GST_FORM_DETAILS]: (state, payload) => {
    state.sd_gst_details = payload
  },
  [types.SET_SD_USER_INFO]: (state, payload) => {
    state.sdUserInfo = payload
  },
  [types.SET_SD_PRICE_AFTER_PROMO]: (state, payload) => {
    state.sdFareDetails.fare_details.price.total_charge.value = payload.effective_total_amount
    state.sdFareDetails.fare_details.price.total_charge.display_value = '₹ ' + payload.effective_total_amount.toString()
  },
  [types.SET_SD_PROMO_CODE]: (state, payload) => {
    state.sdPromoCode = payload
  },
  [types.SET_SD_CAB_TYPE]: (state, payload) => {
    state.sdCabType = payload
  },
  [types.SET_SD_PAY_AMOUNT]: (state, payload) => {
    state.sdPaymentAmount = payload
  }
}
