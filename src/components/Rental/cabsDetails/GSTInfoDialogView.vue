<template>
  <v-layout row justify-center style="position: relative;">
    <v-dialog v-model="GSTInfoDialog" lazy absolute>
      <v-card>
        <v-card-title>
          <div class="headline">About GST</div>
        </v-card-title>
        <v-card-text>
          You can claim (If applicable) input credit by providing your GST details.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="txt_blue font-bold darken-1" flat="flat" @click.native="closeGSTInfoDialog">GOT IT</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
  export default {
    props: ['GSTInfoDialog'],
    methods: {
      closeGSTInfoDialog () {
        this.$emit('GSTInfoDialogClose', false)
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
</style>
