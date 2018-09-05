import Vue from 'vue'

export const eventBus = new Vue({
  methods: {
    homeViewHeaderText (data) {
      this.$emit('homeViewHeaderText', data)
    },
    updatePickupLocation (data) {
      this.$emit('updatePickupLocation', data)
    },
    openDropoffLocation (data) {
      this.$emit('openDropoffLocation', data)
    }
  }
})
