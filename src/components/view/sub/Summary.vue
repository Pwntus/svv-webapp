<template lang="pug">
#svv-summary
  md-layout
    md-layout(
      md-flex-xsmall="100"
      md-flex-small="100"
      md-flex-medium="50"
      md-flex-large="50"
      md-flex-xlarge="50"
    )
      svv-card
        md-card-header
          .md-title Monitoring {{ MicRegThings.length }} road {{ (MicRegThings.length > 1) ? 'sensors' : 'sensor' }}
          .md-subhead
            md-icon access_time
            span Real Time
        md-card-content
          | This application is built on top of the <a href="https://startiot.mic.telenorconnexion.com/" target="_new">Managed IoT Cloud</a> platform provided by Telenor Connexion and is running entierly in the web browser!
          br
          | Click on a thing in the map to explore more about a sensor.
        md-card-actions
          md-button.md-primary(
            href="https://startiot.mic.telenorconnexion.com/"
            target="_new"
          ) Managed IoT Cloud
    md-layout(
      md-flex-xsmall="100"
      md-flex-small="100"
      md-flex-medium="50"
      md-flex-large="50"
      md-flex-xlarge="50"
    )
      svv-card
        md-card-content
          md-list
            md-list-item(
              v-for="(thing, index) in MicRegThings"
              :key="index"
            )
              md-icon.green wifi
              .md-list-text-container
                span ID: {{ thing.id }}
                span Last heard from: {{ reltime(thing.timestamp) }}
</template>

<script>
import SvvCard from '@/components/svv/Card'
import moment from 'moment'

export default {
  name: 'Summary',
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
#svv-summary {
  padding: 0 0 10px 10px;

  .md-card {
    width: 100%;
    margin-right: 10px;
    margin-top: 10px;

    .md-subhead {
      .md-icon {
        $size: 16px;

        width: $size;
        min-width: $size;
        height: $size;
        min-height: $size;
        font-size: $size;
        line-height: $size;
        margin-right: 4px;
      }

      span {
        vertical-align: middle;
      }
    }

    .green {
      color: #4CAF50;
    }
  }
}
</style>
