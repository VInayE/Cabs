<template>
   <transition name="modal" v-if="priceDialog">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
               Fare Details
            </slot>
          </div>
          <div class="modal-body">
            <v-layout row wrap name="body" v-for="(charges,index) in fareBreakUpDetails.breakUp.price.charges" :key="index" class="line_height_30">
                <v-flex xs9 sm6 class="font_roboto_400 font_13">
                   {{charges.display_name}}
                </v-flex>
                <v-flex xs3 class="font_roboto_400 font_13 txt_right">
                   {{charges.display_value}}
                </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout row wrap name="body" class="line_height_30 text-large">
                <v-flex xs9 sm6 class="font_roboto_400 ">
                   {{fareBreakUpDetails.breakUp.price.total_charge.display_name}}
                </v-flex>
                <v-flex xs3 class="font_roboto_400 txt_right">
                   {{fareBreakUpDetails.breakUp.price.total_charge.display_value}}
                </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout row wrap name="body" v-if="fareBreakUpDetails.breakUp.price.advance_charge" class="line_height_30">
                <v-flex xs9 sm6 class="font_roboto_400 font_13 ">
                   {{fareBreakUpDetails.breakUp.price.advance_charge.display_name}}
                </v-flex>
                <v-flex xs3 class="font_roboto_400 font_13 txt_right">
                   {{fareBreakUpDetails.breakUp.price.advance_charge.display_value}}
                </v-flex>
            </v-layout>
            <v-divider v-if="fareBreakUpDetails.breakUp.price.advance_charge"></v-divider>
            <v-layout row wrap name="body" v-if="fareBreakUpDetails.breakUp.price.ecash && fareBreakUpDetails.breakUp.price.ecash.ecash_earn.value" class="line_height_30">
                <v-flex xs7 sm6 class="font_roboto_400 font_13">
                   You Earn
                </v-flex>
                <v-flex xs5 class="font_roboto_400 font_13 txt_right">
                   {{fareBreakUpDetails.breakUp.price.ecash.ecash_earn.display_value}}
                   <img class="img_ecash" src="/pwa/cabs/cabs/img/icons/ecash.svg"/>
                </v-flex>
            </v-layout>
            <v-divider v-if="fareBreakUpDetails.breakUp.price.ecash && fareBreakUpDetails.breakUp.price.ecash.ecash_earn.value"></v-divider>
             <v-layout row wrap name="body" class="" style="margin-top:20px">
                <v-flex v-html="fareBreakUpDetails.breakUp.notes" class="font_roboto_400 font_13"></v-flex>
             </v-layout>
          </div>
          <div class="modal-footer">
            <slot name="footer">
                <a class="txt_blue font-bold darken-2" flat="flat" @click="closeDialog">CLOSE</a>
            </slot>
          </div>
        </div>
          
      </div>
    </div>
   </transition>
</template>
<script>
   export default {
     props: ['dialog', 'fareBreakUpDetails'],
     data: function () {
       return {
         priceDialog: false
       }
     },
     watch: {
       dialog: function () {
         this.priceDialog = this.dialog
       }
     },
     methods: {
       closeDialog () {
         this.priceDialog = false
         this.$emit('priceDialogClose', false)
       }
     }
   }
</script>
<style scoped>
  .line_height_30{
    line-height: 30px;
    color: #333;
  }
  .txt_right{
    text-align:right!important;
  }
  .font_13{
    font-size:13px;
  }
  .img_ecash{
     width: 50px;
    margin-left: 5px;
    margin-top: 5px;
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
  padding: 20px 20px 5px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
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
  height:300px;
  overflow-y:auto;
  overflow-x:hidden;

}
.modal-footer{
    width: 275px;
    margin: 0 auto;
    background: #fff;
    text-align: right;
    padding: 10px 20px 15px 0;
}
.modal-foote button .btn__content{
    font-weight: 600;
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
.text-large{
  font-size: 18px; padding : 10px 0; color: #000;
}
</style>
