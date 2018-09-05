import * as types from '../../types'

export const getters = {
  [types.GET_CAB_FARE_DETAILS]: state => {
    return state.cabsFareDetails
  },
  [types.GET_CABS_SRP_DATA]: state => {
    state.cabsSRPData = state.cabsSRPData ? state.cabsSRPData : {}
    return state.cabsSRPData
  },
  [types.GET_SEARCH_PARAMS]: state => {
    state.searchParams = state.searchParams ? state.searchParams : {}
    return state.searchParams
  },
  [types.GET_SRP_FILTER_OPTIONS]: state => {
    state.srpFilterOption = state.srpFilterOption ? state.srpFilterOption : {}
    return state.srpFilterOption
  },
  [types.GET_USER_INFO]: state => {
    state.userInfo = state.userInfo && state.userInfo !== {} ? state.userInfo : {}
    return state.userInfo
  },
  [types.GET_PROMOCODE]: state => {
    state.promoCode = Object.keys(state.promoCode).length > 0 ? state.promoCode : { 'promoCode': null, 'promoType': null }
    return state.promoCode
  },
  [types.GET_GST_DETAILS]: state => {
    return state.gst_details
  }
}

