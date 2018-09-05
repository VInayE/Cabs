<template>
  <v-app class="cab-sorting">
    <v-layout row wrap class="cab-filter-option">
      <v-flex xs4 @click="sortByRecoomendations" v-bind:class="{ active:isDept,inc:inc1 }"> Recommended <i class="ico-sprite ico-filter"></i></v-flex>
      <v-flex xs4 @click="sortByPrice" v-bind:class="{ active:isDuration ,inc:inc2}"> Price <i class="ico-sprite ico-filter"></i></v-flex>
      <v-flex xs4 @click="sortByDistance" v-bind:class="{ active:isPrice, inc:inc }"> Pickup Distance <i class="ico-sprite ico-filter"></i></v-flex>
      <v-flex xs4 @click="sortByKms" v-bind:class="{ active:isPrice, inc:inc }"> Kms <i class="ico-sprite ico-filter"></i></v-flex>
    </v-layout>
  </v-app>
</template>
<script>
    import router from '../../../router'
    import { mapGetters,mapMutations } from 'vuex'
    import * as types from '../../../store/types'
    export default {
        data () {
            return {
                //will handle in phase 2
            }
        },
        methods: {
            sortByDeparture() {
                this.sortType = this.optionSorted != 'departure' ? 'inc' : this.sortType == 'inc' ? 'desc' : 'inc'
                this.optionSorted ='departure'
                this.isDept=true,
                this.isDuration=false,
                this.isPrice=false
                this.inc1 = !this.inc1
                this.busListData.sort(this.sortDeparture) 
            },
            sortByDuration(){ 
                this.sortType = this.optionSorted != 'duration' ? 'inc' : this.sortType == 'inc' ? 'desc' : 'inc'
                this.optionSorted ='duration'
                this.isDept = false
                this.isDuration = true
                this.isPrice = false
                this.inc2 = !this.inc2
                this.busListData.sort(this.sortDuration)
            },
            sortByPrice(){
                this.sortType = this.optionSorted == null || this.optionSorted != 'price' ? 'inc' : this.sortType == 'inc' ? 'desc' : 'inc' 
                this.optionSorted = 'price'
                this.isDept = false
                this.isDuration = false
                this.isPrice = true
                this.inc = !this.inc
                this.desc = true
                this.busListData.sort(this.sortPrice)  
            },
            sortDeparture(a,b){
                if(this.$options.filters.fullTimeFilter(a.dt) < this.$options.filters.fullTimeFilter(b.dt))
                return  this.sortType == 'inc' ? -1 : 1
                if(this.$options.filters.fullTimeFilter(a.dt) >  this.$options.filters.fullTimeFilter(b.dt))
                    return this.sortType == 'inc' ? 1 :-1
                return 0   
            },
            sortDuration(a,b){
                if(this.$options.filters.durationFilter(a.du) < this.$options.filters.durationFilter(b.du))
                return  this.sortType == 'inc' ? -1 : 1
                if(this.$options.filters.durationFilter(a.du) >  this.$options.filters.durationFilter(b.du))
                    return this.sortType == 'inc' ? 1 :-1
                return 0  
            },
            sortPrice(a,b){
                if(this.$options.filters.srpPriceFilter(a.fare) < this.$options.filters.srpPriceFilter(b.fare))
                return  this.sortType == 'inc' ? -1 : 1
                if(this.$options.filters.srpPriceFilter(a.fare) >  this.$options.filters.srpPriceFilter(b.fare))
                    return this.sortType == 'inc' ? 1 :-1
                return 0 
            }
        }
    }
</script>