<template>
   <transition name="modal" v-if="priceDialog">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-body">
             <iframe :src="termsURL" class="iframe_cntn" onload="document.getElementById('spinner').style.display='none';"></iframe>
          </div>
          <div id="spinner">
             <v-progress-circular indeterminate v-bind:size="80" class="spinner_modal primary--text"></v-progress-circular>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn class="cF34747 darken-2" flat="flat" @click.prevent="closeDialog">CLOSE</v-btn>
             </v-card-actions>
            </slot>
          </div>
        </div>
      </div>
    </div>
   </transition>
</template>
<script>
 import router from '../../../router'
 import * as types from '../../../store/types'
 import { mapGetters, mapMutations } from 'vuex'
 import { adobeAnalyticsPageView } from '../../../helpers/adobeAnalytics'
   export default {
     data () {
       return {
         priceDialog: false,
         displayMsg: true,
         termsURL : ''
       }
     },
     computed: {
      ...mapGetters({
          getSDSRPData: types.GET_SD_SRP_DATA
      })
     },
     watch: {
       policyDialog () {
         this.priceDialog = this.policyDialog
       }
     },
     mounted () {
         this.termsURL = this.getSDSRPData.vendors[0].terms_url

     },
     methods: {
       closeDialog () {
         this.priceDialog = false
         this.$emit('termsDialogClose', false)
       }
     }
   }
</script>
<style scoped>
    .spinner_modal{
        position: absolute;
        left: 34%;
        top: 40%;
    }
    .iframe_cntn{
        width:100%;
        border:0px;
        height:450px;
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
        width: 95%;
        padding-top:10px;
        height:480px;;
        margin: 0px auto;
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

    .modal-body {
        height: 530px;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 0px;
        margin: 0px;
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
