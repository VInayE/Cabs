<template>
   <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-body">
            <v-layout row wrap >
              <v-flex class="earned_booking_div">
                 <v-layout row wrap class="promo_description">Payment Method</v-layout>
              </v-flex>
              <v-flex xs12 class="promo_code_title">{{message}}</v-flex>
              <v-flex xs12 class="text_cancel" @click="closeOLAlert">OK</v-flex>
            </v-layout>
          </div>
        </div>
      </div>
    </div>
   </transition>
</template>
<script>
   export default {
     props: ['paymentMessage'],
     data () {
       return {
         message :''  
       }  
     },
     methods : {
       closeOLAlert (){
          this.$emit('OLAAlertInfo', false)
       }
     },
     created (){
        this.message = this.paymentMessage 
     }  
   }
</script>
<style scoped>
  .txt_use_code{
    margin-left: 25px;
    height: 30px;
    background-color: rgb(25, 118, 210);
    padding: 5px;
    color: white;
    margin-top: 7px;
    margin-top:10px;
  }
  .remaining_promo{
    font-family: 'Roboto-500';
    margin-right: 10px;
    font-weight: bold;
    margin-top:10px;
  }
  .promo_description{
    color: rgba(0,,0,0,.9);
    font-size: 20px;
    font-family: 'Roboto-500';
  }
  .discount_text{
    font-family: 'Roboto-500';
    font-size: 13px;
    padding-bottom: 7px;
    border-bottom: 1px solid #bdbdbd;
  }
  .lock_icon_div{
    height: 40px;
    width: 40px;
    border-radius: 50%;
    background-color: rgb(25, 118, 210);
    margin-right: 10px;
  }
  .lock_icon{
    color: white;
    padding-top: 7px;
    padding-left: 9px;
    font-weight: normal;
  }
  .earned_booking_div{
    padding: 10px;
    margin-bottom:5px;
  }
  .promo_code_error{
    color: #EA2330;
    font-size:12px;
    font-family:'Roboto-400' 
  }
  .promo_code_apply{
    padding-top: 4px;
    margin-top: 20px;
    height: 30px;
    width: auto;
    text-align: center;
    margin-left: 10px;
    color: white;
    background-color: rgb(25, 118, 210);
    font-family: 'Roboto-400';
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
  padding-bottom:1px;
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
    font-family:'Roboto-500';
    padding-left:10px;
    margin-bottom:10px;
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
