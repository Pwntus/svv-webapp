<template lang="pug">
.svv-c3
  #chart(ref="chart")
</template>

<script>
import moment from 'moment'
import c3 from 'c3'

export default {
  name: 'SvvC3',
  props: {
    data: {
      type: Array,
      default: () => ([])
    }
  },
  watch: {
    data: {
      handler: 'reload',
      deep: true
    }
  },
  methods: {
    reload () {
      this.$chart.load({
        unload: true,
        columns: [this.data[0], this.data[1]]
      })
    }
  },
  mounted () {
    this.$chart = c3.generate({
      bindto: this.$refs.chart,
      data: {
        x: 'x',
        columns: []
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: (x) => {
              return moment(x).format('D MMM, HH:mm')
            }
          }
        }
      },
      color: { pattern: ['#ff9800'] },
      legend: { show: false },
      point: { show: false }
    })
  }
}
</script>

<style lang="scss">
.svv-c3 {
  .c3 path, .c3 line {
    stroke: #ff9800;
  }
}
</style>
