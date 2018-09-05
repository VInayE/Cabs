import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  scrollBehavior: () => ({x: 0, y: 0}),
  base: '/pwa/cabs',
  mode: 'history',
  routes: [
    {
      path: '/paySwift',
      name: 'PaySwift',
      component: function (resolve) {
        require(['../views/CabPaySwift'], resolve)
      }
    },
    {
      path: '/cabsHome/:option',
      name: 'CabsHomeView',
      component: function (resolve) {
        require(['../views/CabsHomeView'], resolve)
      }
    },
    {
      path: '/selfDrive/cabsSRP',
      name: 'SelfDriveSRP',
      component: function (resolve) {
        require(['../views/selfDrive/SelfDriveSRPView'], resolve)
      }
    },
    {
      path: '/selfDrive/cabsDetails',
      name: 'SelfDriveDetails',
      component: function (resolve) {
        require(['../views/selfDrive/SelfDriveDetailsView'], resolve)
      }
    },
    {
      path: '/p2p/cabDetails',
      name: 'P2PCabDetails',
      component: function (resolve) {
        require(['../views/P2P/SelectedCabDetails'], resolve)
      }
    },
    {
      path: '/p2p/trackRide/:orderID',
      name: 'P2PConfirmBooking',
      component: function (resolve) {
        require(['../views/P2P/ConfirmationBooking'], resolve)
      }
    },
    {
      path: '/rental/cabsSRP',
      name: 'CabsSRP',
      component: function (resolve) {
        require(['../views/Rental/CabSRPView'], resolve)
      }
    },
    {
      path: '/rental/cabsDetails',
      name: 'CabsDetails',
      component: function (resolve) {
        require(['../views/Rental/CabsDetailsView'], resolve)
      }
    },
    {
      path: '/',
      redirect: '/cabsHome/p2p'
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
