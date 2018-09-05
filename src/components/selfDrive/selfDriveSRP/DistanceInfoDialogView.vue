<template>
  <v-layout row justify-center >
    <v-dialog v-model="DistanceInfoDialog" lazy absolute persistent>
      <v-card >

        <v-card-title>
            <div class="headline">Plan Recommendation</div>
        </v-card-title>
        <v-card-text>
            Based on the distance you might travel and some more factors,
            we will help you find the best value plan for each car
            <form>
              <input class="distanceInput" v-model="approxdistanceinput" type="number" />
            </form>
        </v-card-text>
        <v-card-actions >
            <v-spacer></v-spacer>
            <hr>
            <v-btn
              v-bind:class="{ disbaled: ShRec }"
              :disabled="ShRec"

              class="txt_blue font-bold darken-1"
              flat="flat"
              @click.native="DistanceInfoDialogOpen">
              Show Recommendation
            </v-btn>
            <hr>
            <v-btn

              class="txt_blue font-bold darken-1"
              flat="flat"
              @click.native="closeDistanceInfoDialog">
              Cancel
            </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
  export default {
    props: ['DistanceInfoDialog','approxdistance'],
    data () {
      return {
          ShRec: false,
          approxdistanceinput : this.approxdistance
        }
      },
    methods: {
      closeDistanceInfoDialog () {
        this.$emit('DistanceInfoDialogClose', false)
      },
      DistanceInfoDialogOpen (event) {
          this.$emit('DistanceInfoDialogOpen', this.approxdistanceinput)
      }
    },
    watch: {
        approxdistance(){
           this.approxdistanceinput = this.approxdistance
        },
        approxdistanceinput() {
          //console.log(this.approxdistanceinput)
          if(parseInt(this.approxdistanceinput) >= 10 && parseInt(this.approxdistanceinput) <= 9999) {
            this.ShRec = false
          }
          else if(parseInt(this.approxdistanceinput) > 9999) {
            this.approxdistanceinput = this.approxdistanceinput.substr(0,this.approxdistanceinput.length-1)
            this.ShRec = false
          }
          else {
            this.ShRec = true
          }
      }
    }
  }
</script>
<style scoped>
  .card__title{
      padding: 16px 16px 0; font-size: 22px !important;
  }
  .card__text{
     padding: 16px 16px 0;
  }
  .distanceInput{
    margin-top: 14px;
    border: 1px solid grey;
    width: 245px;
    height: 24px;
    }
    .disbaled{
        color: grey !important;
    }
</style>
