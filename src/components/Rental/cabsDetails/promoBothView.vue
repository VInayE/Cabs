<template>
  <v-layout row justify-center style="position: relative;">
    <v-dialog v-model="promoDialog" v-if="promoDialog" lazy absolute>
      <v-card>
        <v-card-title>
          <div class="headline">Promo code Discount</div>
        </v-card-title>
        <v-card-text>
         <v-layout row wrap>
           <v-flex xs2>
             <v-radio color="red" v-model="selectOption" value="cash"></v-radio>
           </v-flex>
           <v-flex xs10 class="mg15">{{bothPromoBody.cash.message}}</v-flex>
         </v-layout>
         <v-layout row wrap>
            <v-flex xs4 offset-xs1 class="dividerTop"></v-flex>
            <v-flex xs2 class="txtOR">OR</v-flex>
             <v-flex xs4 class="dividerTop"></v-flex>
          </v-layout> 
         <v-layout row wrap>
           <v-flex xs2>
             <v-radio color="red" v-model="selectOption" value="ecash" ></v-radio>
           </v-flex>
           <v-flex xs10 class="mg15">{{bothPromoBody.ecash.message}}</v-flex>
         </v-layout>
         <v-layout row wrap>
           <v-flex xs12 class="dividerTop" style="margin-top:15px;"></v-flex>
           <v-flex xs12 style="text-align:center;margin-top:15px;" @click="closeSelectedPromoCode">Done</v-flex>
         </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
  export default {
    props: ['showBothPromoDialog','bothPromoBody'],
    data () {
       return {
         selectOption: 'cash',
         promoDialog: false
       }
    },
    watch :{
      showBothPromoDialog () {
        this.promoDialog = this.showBothPromoDialog
      }
    },
    methods: {
      closeSelectedPromoCode () {
        if(this.selectOption == 'cash') delete this.bothPromoBody.ecash
        else delete this.bothPromoBody.cash
        this.promoDialog = false
        this.$emit('closePromoDialog', this.bothPromoBody)
      }
    }
  }
</script>
<style scoped>
  .mg15{
    margin-top:15px;
  }
  .dividerTop{
    border-top: 1px solid rgba(128, 128, 128, 0.74);
  }
  .txtOR{
    text-align:center;
    margin-top:-10px;
    color:rgba(128, 128, 128, 0.74);
  }
</style>
