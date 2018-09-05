<template>
   <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-body">
             <v-card-text>
               <v-layout row wrap>
                  <v-flex xs12 class="txt_please_wait">{{message}}</v-flex>
                  <v-flex xs12 style="text-align:right;color:#EA2330;font-family:Roboto-500;margin-top:10px" @click="navigateToHome">OK </v-flex>
              </v-layout>
            </v-card-text>
          </div>
        </div>
      </div>
    </div>
   </transition>
</template>
<script>
   import router from '../../../router'
   export default {
     props:['showOrderStatus'],
     methods:{
       navigateToHome(){
          router.push({name:'CabsHomeView',params:{option:'p2p'}})
       },
       showMessage () {
         if(this.showOrderStatus == 'completed')  this.message = 'Your trip has been completed'
          if(this.showOrderStatus == 'driver_cancelled')  this.message = 'Driver has cancelled your ride'
          if(this.showOrderStatus == 'rider_cancelled')  this.message = 'You have cancelled the ride'
          if(this.showOrderStatus == 'cancelled')   this.message = 'Somehow your ride has been cancelled'
       } 
     },
     watch:{
       showOrderStatus () {
          this.showMessage()
       }
     },
     created (){
        this.showMessage()
     },
     data () {
       return {
         message:''  
       }  
     }  
   }
</script>
<style scoped>
  h3 {
    line-height: inherit
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
  padding:10px;
}

.modal-container {
  width: auto;
  margin: 0px auto;
  padding: 10px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
}
.modal-header {
    font-size: 20px;
    font-weight: 500;
    color: black;
    height: 20px;
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

</style>
