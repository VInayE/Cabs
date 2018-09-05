<template>
   <transition name="modal" v-if="dialog">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-body">
            <v-layout row wrap>
              <v-flex xs12>
                <span>{{fareJSON.display_fare.display_name}}</span>
                <span style="float:right">{{fareJSON.display_fare.display_value}} </span>
              </v-flex>
              <v-flex xs12>
                 <v-layout row wrap>
                    <v-flex xs5>
                      <v-checkbox label="Redeem" v-model="ex8" color="primary"></v-checkbox>
                    </v-flex>
                    <v-flex xs6>
                        <img class="img_ecash" style="width:55px;margin-top:23px" src="../../../../static/img/icons/ecash.svg"/>
                    </v-flex>
                 </v-layout> 
               </v-flex>
               <v-flex xs12 class="ecash_description">{{fareJSON.ecash.description}}</v-flex>
               <v-flex xs12 class="display_fare">
                <span>{{fareJSON.display_offer_fare.display_name}}</span>
                <span style="float:right">{{fareJSON.isEcashSelected ? fareJSON.display_offer_fare.display_value :fareJSON.display_fare.display_value}}</span>
               </v-flex>
               <v-flex xs12 style="margin-top:10px">Learn more about Yatra eCash here on the <a>eCash Terms & Conditions</a> page</v-flex>
               <v-flex xs12 class="disclaimer_text" v-if="fareJSON.disclaimers != null && Object.keys(fareJSON.disclaimers).length>=0 && fareJSON.disclaimers[index] != null" v-for="(text,index) in fareJSON.disclaimers" :key="index"  v-html="fareJSON.disclaimers[index]">
               </v-flex>
               <v-flex xs4 offset-xs8>
                  <v-btn primary @click="closeEcashDialog">GOT IT</v-btn>
               </v-flex>   
            </v-layout>
          </div>
        </div>
      </div>
    </div>
   </transition>
</template>
<script>
   export default {
     props:['showEcashDialog','fareDetailsJSON'],
     watch:{
       showEcashDialog () {
          this.dialog = this.showEcashDialog
          if(this.dialog){
            this.fareJSON = this.fareDetailsJSON  
            this.ex8 = this.fareJSON.isEcashSelected
          }
       },
       ex8 () {
        this.fareJSON.isEcashSelected = this.ex8   
       } 
     },
     methods:{
       closeEcashDialog () {
          this.dialog = false 
          this.$emit('closeEcashDialog',this.fareJSON)  
       }
     },
     data () {
       return {
         dialog : false,
         fareJSON:{},
         ex8:true
       }
     }  
   }
</script>
<style scoped>
  .disclaimer_text{
    font-size: 12px;
    margin-top: 10px;
    font-family: 'Roboto-400';
  }
  .display_fare{
    font-family: 'Roboto-500';
    font-size: 15px;
    margin-top: 5px;
    font-weight:bold;
  }
  .ecash_description{
    font-size: 11px;
    color: grey;
    font-family: 'Roboto-400';
    padding-bottom: 5px;
    border-bottom: 1px solid #bdbdbd;
    margin-top:-15px;
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
