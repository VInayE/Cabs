import * as types from '../../types'

export const mutations = {
  [types.SET_P2P_SEARCH_PARAMS]: (state, payload) => {
    state.p2pCabSearchParams = payload
  }
}
