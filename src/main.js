// The root file of the application.
import Vue from 'vue'
import App from './App'

import router from './router'
import VueResource from 'vue-resource'
import Vuetify from 'vuetify'
import { store } from './store/store'
import FBSignInButton from 'vue-facebook-signin-button'
import VueNumeric from 'vue-numeric'

Vue.use(FBSignInButton)
Vue.use(VueResource)
Vue.use(Vuetify)
Vue.use(VueNumeric)
Vue.config.productionTip = true
window.Vue = Vue
var mode = ''

if (process.env.NODE_ENV && process.env.NODE_ENV.toString() === 'production') {
  mode = 'https://www.yatra.com/cabs/'
} else {
  mode = 'http://yatra.com/cabs/'
}

Vue.http.options.root = mode
Vue.config.debug = true



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }   
})


