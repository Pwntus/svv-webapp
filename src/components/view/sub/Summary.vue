<template lang="pug">
#svv-summary
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
      md-button.md-accent(
        href="https://startiot.mic.telenorconnexion.com/"
        target="_new"
      ) Managed IoT Cloud
</template>

<script>
import SvvCard from '@/components/svv/Card'
export default {
  name: 'Summary',
  components: { SvvCard }
}
</script>

<style lang="scss">
#svv-summary {
  padding: 10px;

  .md-card {
    max-width: 700px;
    margin: 0 auto;

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
  }
}
</style>
