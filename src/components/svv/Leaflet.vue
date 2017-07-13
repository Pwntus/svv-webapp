<template lang="pug">
#svv-leaflet
  #thing-map
</template>

<script>
import L from 'leaflet'
import {
  LEAFLET_PACK,
  LEAFLET_API_KEY
} from '@/config'

/* Leaflet marker issue workaround.
 * https://github.com/Leaflet/Leaflet/issues/4968
 */
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('@/assets/marker-icon-2x.png'),
  iconUrl: require('@/assets/marker-icon.png'),
  shadowUrl: require('@/assets/marker-shadow.png')
})

export default {
  name: 'SvvLeaflet',
  data () {
    return {
      map: null,
      marker: []
    }
  },
  computed: {
    getCenter () {
      return new L.LatLng(69.681580, 18.977034)
    },
    getLayer () {
      let url = `https://api.mapbox.com/styles/v1/mapbox/${LEAFLET_PACK}/tiles/256/{z}/{x}/{y}?access_token=${LEAFLET_API_KEY}`
      return new L.TileLayer(url)
    }
  },
  watch: {
    MicRegThings (things) {

      // Extract affected things
      things.forEach(thing => {
        let pos = thing.pos.split(',')
        let newPos = new L.latLng(pos[0], pos[1])

        // New thing, add it to the array and map
        if (!this.marker.hasOwnProperty(thing.id)) {
          let newMarker = new L.Marker(newPos)
          newMarker.bindPopup(`
            <div><b>${thing.id}</b></div>
            <div>${Math.round(thing.tmp * 100) / 100}°C</div>
            <div>${Math.round(thing.hum * 100) / 100}%</div>
            <div>${Math.round(thing.bat * 100) / 100}V</div>
          `, {closeButton: false})
          newMarker.on('click', () => { this.$router.push('/dashboard/' + thing.id) })
          newMarker.addTo(this.map)
          this.marker[thing.id] = newMarker
          return
        }

        let marker = this.marker[thing.id]

        // Thing has a new pos, just move it
        // TODO: add margin of error (see docs)
        if (!marker.getLatLng().equals(newPos))
          marker.setLatLng(newPos)

        // TODO: doesn't work atm
        // Update popup values
        marker.unbindPopup()
        marker.bindPopup(`
          <div><b>${thing.id}</b></div>
          <div>${Math.round(thing.tmp * 100) / 100}°C</div>
          <div>${Math.round(thing.hum * 100) / 100}%</div>
          <div>${Math.round(thing.bat * 100) / 100}V</div>
        `, {closeButton: false})

        // TODO: check alert values & change marker icon
      })

      //let group = new L.featureGroup(this.marker)
      //this.map.fitBounds(group.getBounds())
    }
  },
  mounted () {
    this.map = L.map('thing-map', {
      center: this.getCenter,
      zoom: 13,
      layers: this.getLayer,
      attributionControl: false
    })
    this.map.zoomControl.setPosition('bottomright')
  }
}
</script>

<style lang="scss">
#svv-leaflet {
  width: 100%;
  height: 100%;

  #thing-map {
    width: 100%;
    height: 100%;

    a {
      color: rgba(68, 79, 85, 1) !important;
      
      &:hover {
        text-decoration: none;
      }
    }

    .leaflet-bar {
      border-color: rgba(68, 79, 85, .2);
    }
  }
}
</style>
