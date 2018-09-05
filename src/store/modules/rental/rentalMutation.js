import * as types from '../../types'

export const mutations = {
  [types.SET_APPLY_FILTER]: (state, payload) => {
    state.srpFilterOption = payload
  },
  [types.SET_CAB_FARE_DETAILS]: (state, payload) => {
    state.cabsFareDetails = payload
  },
  [types.SET_SEARCH_PARAMS]: (state, payload) => {
    state.searchParams = payload
  },
  [types.SET_CABS_SRP_DATA]: (state, payload) => {
    state.cabsSRPData = payload
  },
  [types.SET_GST_FORM_DEATILS]: (state, payload) => {
    state.gst_details = payload
  },
  [types.SET_USER_INFO]: (state, payload) => {
    state.userInfo = payload
  },
  [types.SET_PRICE_AFTER_PROMO]: (state, payload) => {
    state.cabsFareDetails.fare_details.price.total_charge.value = payload.effective_total_amount
    state.cabsFareDetails.fare_details.price.total_charge.display_value = '₹ ' + payload.effective_total_amount.toString()
  },
  [types.SET_PROMO_CODE]: (state, payload) => {
    state.promoCode = payload
  }
}
