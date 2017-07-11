<template lang="pug">
#svv-offline
  svv-card
    md-card-header
      .md-title There are {{ MicUnregThings.length }} inactive sensors
    md-card-content
      md-list
        md-list-item(
          v-for="(thing, index) in MicUnregThings"
          :key="index"
        )
          md-icon portable_wifi_off
          .md-list-text-container
            span ID: {{ thing.id }}
            span Last heard from: {{ reltime(thing.timestamp) }}
    md-card-actions
      md-button.md-accent(
        @click.native="$router.push('/dashboard')"
      ) Back
</template>

<script>
import SvvCard from '@/components/svv/Card'
import moment from 'moment'

export default {
  name: 'Offline',
  components: { SvvCard },
  methods: {
    reltime (timestamp) {
      let date = moment(timestamp)
      return date.isValid() ? date.fromNow() : 'never'
    }
  }
}
</script>

<style lang="scss">
#svv-offline {
  padding: 10px;

  .md-card {
    max-width: 700px;
    margin: 0 auto;
  }
}
</style>
