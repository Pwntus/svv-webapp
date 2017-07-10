<template lang="pug">
#svv-summary
  md-card
    md-card-header
      .md-title Displaying data from {{ MicThings.length }} road sensors
      .md-subhead
        md-icon access_time
        span Real Time
    md-card-content
      | This application is built on top of the <a href="https://startiot.mic.telenorconnexion.com/" target="_new">Managed IoT Cloud</a> enablement platform provided by Telenor Connexion and is running entierly in the web browser!
      br
      | Click on a thing in the map to explore more about a sensor.
</template>

<script>
export default {
  name: 'Summary'
}
</script>

<style lang="scss">
#svv-summary {
  .md-card {
    box-shadow: none;

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
