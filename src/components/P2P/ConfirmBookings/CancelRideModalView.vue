<template>
   <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
               Cancel Ride
            </slot>
          </div>
          <div class="modal-body" style="height:300px;overflow-y:auto;overflow-x:hidden" >
            <v-radio-group class="rental_packages" v-model="selectectedCancelOption" row v-if="rideOption.user_actions[0].key == 'reason'">
             <v-layout row wrap>
               <v-flex xs12 class="state_data" v-for="(option,index) in rideOption.user_actions[0].options" :key="index">
                 <v-radio :label="option.value" :value="option.id" color="primary"></v-radio>
               </v-flex>
             </v-layout>
            </v-radio-group>
            <textarea v-if="rideOption.user_actions[0].key != 'reason'" v-model="comment">
            </textarea>
            <v-layout row wrap class="cancel_option" v-if="rideOption.display_text">{{rideOption.display_text}}</v-layout>
             <v-layout row wrap v-if="rideOption.display_text" class="cancel_action">
               <v-flex xs6 class="txt_blue" @click="closeModal()">{{rideOption.secondary_action_title}}</v-flex>
               <v-flex xs6 class="txt_blue" @click="setcancelOption()">{{rideOption.primary_action_title}}</v-flex>
              </v-layout>
          </div>
        </div>
      </div>
    </div>
   </transition>
</template>
<script>
   export default {
     props: ['cancelRideOption'],
     data () {
       return {
         rideOption :{},
         selectectedCancelOption :'',
         comment:''
       }  
     },
     created () {
        this.rideOption = this.cancelRideOption 
     },
     methods :{
         
       closeModal (){
         this.$emit('closeOptionModal',false)  
       },
       setcancelOption (){
         if(this.comment !='' || this.selectectedCancelOption != ''){
             if(this.rideOption.user_actions[0].key != 'reason'){
             let selection = {
                 'reason': [
                    {
                     'id': '',
                     'value': ''
                    }
                  ],
               "comment": this.comment
             }
         } else {
             let index = this.rideOption.user_actions[0].options.findIndex(x => x.id === this.selectectedCancelOption)
             let selection = {
                 'reason': [
                    {
                     'id': this.rideOption.user_actions[0].options[index].id,
                     'value': this.rideOption.user_actions[0].options[index].value
                    }
                  ],
               "comment": ''
             }
             this.$emit('cancelCurrentRide',selection)
         } 
         }  
        
       } 
     }
     
   }
</script>
<style scoped>
   .cancel_action{
      padding: 10px;
      border-top: 1px solid #ddd;
     text-align: center;
   }
  .cancel_option{
          background: #eee;
    padding: 5px 10px;
    margin-bottom: 20px;
    font-size: 16px;
  }
  .state_data {
     height: 40px; 
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
  padding: 10px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-header {
    font-size: 20px;
    font-weight: 600;
    color: black;
    margin-left:10px;
}

.modal-body {
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

</style>
