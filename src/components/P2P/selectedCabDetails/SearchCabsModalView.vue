<template>
   <transition name="modal" v-if="showDialog">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" style="padding:0px;">
           Searching Cabs..
          <div class="close_icon_wrapper">
            <div v-if="orderDetails != {} && Object.keys(orderDetails).length > 0" class="close_icon_div" @click="cancelOrder">
              <v-icon class="close_icon_icon">close</v-icon>
            </div>
          </div> 
        </div>
      </div>
    </div>
   </transition>
</template>
<script>
   var pollingInterval;
   import router from '../../../router'
   export default {
     props: ['showSearchModalView','createdOrderDetails'],
     watch: {
       showSearchModalView () {
           this.showDialog = this.showSearchModalView
       },
       createdOrderDetails () {
         this.orderDetails = this.createdOrderDetails
         this.pollingTime = this.orderDetails.status_poll_timeout
         let self = this
         pollingInterval = setInterval(function(){
          self.pollingOrderDetails()
         }, 5000);
       }
     },
     methods:{
       pollingOrderDetails () {
          let self = this 
          if(this.orderDetails.order == null || this.orderDetails.order == undefined || this.orderDetails.order.id == null || this.orderDetails.order.id == undefined) {
            clearInterval(pollingInterval)
            return false
          }
          this.$http.get(`p2p/v1/orders/${self.orderDetails.order.id}/status`).then(function (response) {
              if(response.body.status == 'rider_cancelled' || response.body.status == 'driver_cancelled' || response.body.status == 'no_drivers_available'){
                  clearInterval(pollingInterval)
                  self.showDialog = false
                  self.orderDetails = {}
                  let message = ''
                  if(response.body.status == 'rider_cancelled') message = 'Rider has cancelled the vehicle'
                  if(response.body.status == 'driver_cancelled') message = 'Driver has cancelled the vehicle'
                  if(response.body.status == 'no_drivers_available') message = 'No vehicle is available in your location'
                  self.$emit('searchErrorResponse',message)
              } else if(response.body.status != 'pending' && response.body.status != 'approved'){
                  clearInterval(pollingInterval)
                  router.push({name: 'P2PConfirmBooking', params: { orderID : self.orderDetails.order.id }})
              }
          }).catch(function (error) {
             clearInterval(pollingInterval)
          });
       },
       cancelOrder(){
          let self = this
          this.$http.post(`p2p/v1/orders/${self.orderDetails.order.id}/cancel`).then(function (response) {
            clearInterval(pollingInterval)
            self.showDialog = false
            self.orderDetails = {}
            self.$emit('cancelOrder',false)  
          }).catch(function (error) {
              clearInterval(pollingInterval)
              self.showDialog = false
              self.orderDetails = {}
              self.$emit('cancelError',error)
          });
       }
     },
     data () {
       return {
         showDialog : false,
         orderDetails:{}
       }
     }

 }
</script>
<style scoped>
  .close_icon_wrapper{
    position: fixed;
    bottom: 40px;
    width: 100%;
    display: inline-block;
    left: 0;
  }
  .close_icon_div{
    height: 40px;
    border-radius: 50%;
    border: 2px solid;
    bottom: 30px;
    width: 40px;
    margin: 0 auto;
  }
  .close_icon_icon{
    color:white;
    margin-top:-6px;
  }
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 0px;
  background-color:transparent;
  border-radius: 2px;
  transition: all .3s ease;
  padding-bottom:1px;
  padding: 0px;
  background-color: transparent;
  color: white;
  font-size: 25px;
  text-align: center;
  font-family: 'Roboto-500';
}
.modal-header {
    font-size: 20px;
    font-weight: 500;
    color: black;
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
}

.modal-body {
  margin: 10px 0;
  height:auto;
  overflow-y:auto;
  overflow-x:hidden;

}

.modal-default-button {
  float: right;
}
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.promo_code_title{
    font-family:'Roboto-500'
}
.text_cancel{
    height: 30px;
    padding-top: 10px;
    text-align: center;
    color: #EA2330;
    font-family: 'Roboto-500';
    border-top: 1px solid #bdbdbd;
}

</style>
