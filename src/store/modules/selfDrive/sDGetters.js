import * as types from '../../types'

export const getters = {
  [types.GET_SD_FARE_DETAILS]: state => {
    return state.sdFareDetails
  },
  [types.GET_SD_SRP_DATA]: state => {
    state.sdSRPData = state.sdSRPData ? state.sdSRPData : {}
    return state.sdSRPData
  },
  [types.GET_SD_SEARCH_PARAMS]: state => {
    state.sdSearchParams = state.sdSearchParams ? state.sdSearchParams : {}
    return state.sdSearchParams
  },
  [types.GET_SD_SRP_FILTER_OPTIONS]: state => {
    state.sdSrpFilterOption = state.sdSrpFilterOption ? state.sdSrpFilterOption : {}
    return state.sdSrpFilterOption
  },
  [types.GET_SD_USER_INFO]: state => {
    state.sdUserInfo = state.sdUserInfo && state.sdUserInfo !== {} ? state.sdUserInfo : {}
    return state.sdUserInfo
  },
  [types.GET_SD_PROMOCODE]: state => {
    state.sdPromoCode = Object.keys(state.sdPromoCode).length > 0 ? state.sdPromoCode : { 'promoCode': null, 'promoType': null }
    return state.sdPromoCode
  },
  [types.GET_SD_GST_DETAILS]: state => {
    return state.sd_gst_details
  },
  [types.GET_SD_CAB_TYPE]: state => {
    return state.sdCabType
  },
   [types.GET_SD_PAY_AMOUNT]: state => {
    return state.sdPaymentAmount
  }   
}

