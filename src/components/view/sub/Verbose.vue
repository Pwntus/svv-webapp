<template lang="pug">
#svv-verbose
  md-layout
    md-layout(
      md-flex-xsmall="100"
      md-flex-small="100"
      md-flex-medium="33"
      md-flex-large="33"
      md-flex-xlarge="33"
    )
      md-card
        md-card-content
          md-list
            md-list-item
              md-icon wb_sunny
              .md-list-text-container
                span {{ Math.round(tmp * 100) / 100 }}°C
                span Temperature
              md-button.md-icon-button.md-list-action
                md-icon arrow_forward
            md-list-item
              md-icon blur_on
              .md-list-text-container
                span {{ Math.round(hum * 100) / 100 }}%
                span Humidity
              md-button.md-icon-button.md-list-action
                md-icon arrow_forward
            md-list-item
              md-icon battery_full
              .md-list-text-container
                span {{ Math.round(bat * 100) / 100 }}V
                span Battery Voltage
              md-button.md-icon-button.md-list-action
                md-icon arrow_forward
            md-list-item
              md-icon gps_fixed
              .md-list-text-container
                span {{ pos }}
                span GPS Position
            md-list-item
              md-icon router
              .md-list-text-container
                span {{ id }}
                span Device ID
    md-layout(
      md-flex-xsmall="100"
      md-flex-small="100"
      md-flex-medium="66"
      md-flex-large="66"
      md-flex-xlarge="66"
    )
      md-card
        md-card-header
          .md-subhead Temperature Over Time
</template>

<script>
export default {
  name: 'Verbose',
  computed: {
    thing () {
      let tmp = null
      this.MicThings.forEach(thing => {
        if (thing.id == this.$route.params.id)
          tmp = thing
      })
      return tmp
    },
    id () { return (this.thing) ? this.thing.id : null },
    tmp () { return (this.thing) ? this.thing.tmp : null },
    hum () { return (this.thing) ? this.thing.hum : null },
    bat () { return (this.thing) ? this.thing.bat : null },
    pos () { return (this.thing) ? this.thing.pos : null },
    timestamp () { return (this.thing) ? this.thing.timestamp : null }
  }
}
</script>

<style lang="scss">
#svv-verbose {
  padding: 0 0 10px 10px;

  .md-card {
    width: 100%;
    margin-right: 10px;
    margin-top: 10px;
  }
}
</style>
