import * as types from '../../types'

export const getters = {
  [types.GET_P2P_SEARCH_PARAMS]: state => {
    return state.p2pCabSearchParams
  }
}

