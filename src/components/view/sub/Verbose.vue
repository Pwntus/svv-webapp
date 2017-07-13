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
      svv-card
        md-card-content
          md-list
            md-list-item
              md-icon wb_sunny
              .md-list-text-container
                span {{ Math.round(tmp * 100) / 100 }}°C
                span Temperature
              md-button.md-icon-button.md-list-action(
                @click.native="selected = 0"
              )
                md-icon(:class="{ 'md-primary' : selected == 0 }") arrow_forward
            md-list-item
              md-icon grain
              .md-list-text-container
                span {{ Math.round(hum * 100) / 100 }}%
                span Humidity
              md-button.md-icon-button.md-list-action(
                @click.native="selected = 1"
              )
                md-icon(:class="{ 'md-primary' : selected == 1 }") arrow_forward
            md-list-item
              md-icon battery_full
              .md-list-text-container
                span {{ Math.round(bat * 100) / 100 }}V
                span Battery Voltage
              md-button.md-icon-button.md-list-action(
                @click.native="selected = 2"
              )
                md-icon(:class="{ 'md-primary' : selected == 2 }") arrow_forward
            md-list-item
              md-icon gps_fixed
              .md-list-text-container
                span {{ pos }}
                span GPS Position
            md-list-item
              md-icon timelapse
              .md-list-text-container
                span {{ timestamp }}
                span Reported
            md-list-item
              md-icon sim_card
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
      svv-card(:loading="loading")
        md-card-header
          //.md-subhead {{ c3Data[1][0] }}
        md-card-content
          //svv-c3(:data="c3Data")
</template>

<script>
import SvvCard from '@/components/svv/Card'
import SvvC3 from '@/components/svv/C3'
import moment from 'moment'

export default {
  name: 'Verbose',
  components: {
    SvvCard,
    SvvC3
  },
  data () {
    return {
      loading: true,
      selected: 0
    }
  },
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
    timestamp () { return (this.thing) ? moment(this.thing.timestamp).fromNow() : null },
    /*c3Data () {
      let tmp = 'tmp'
      if (this.selected == 0) tmp = 'tmp'
      if (this.selected == 1) tmp = 'hum'
      if (this.selected == 2) tmp = 'bat'

      return [
        this.MicSelected.timestamp,
        this.MicSelected[tmp]
      ]
    }*/
  },
  watch: {
    '$route': 'observe'
  },
  created () {
    this.observe()
  },
  methods: {
    observe () {
      this.loading = true
      this.$store.dispatch('MIC/observe', this.$route.params.id)
        .then(() => { this.loading = false })
    }
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
