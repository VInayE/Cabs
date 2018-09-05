<template>
  <button id="searchCabs" class="btn-search" @click="Create()">SEARCH CABS</button>
</template>

<script>
export default {
  data () {
    return {
      el: "#searchCacbs",
      loading: false,
    }
  },
  methods: {
    Create: function() {
      this.loading = true
      this.$emit('getSRPdetails',false)
    }
  }
}
</script>

<style scoped>
.btn-search {
    background: #EA2330;
    color: #fff;
    font-weight: 400;
    padding: 10px;
    text-align: center;
    width: 100%;
    margin-top:20px;
    bottom: 0;
    margin-bottom: 0;
    font-size: 14px;
    left: 0;
    outline: none;
}
</style>
