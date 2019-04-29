<template>
  <div id="app">
    <div id="map" class="map">
      <div v-if="mapLoaded">
        <station-marker
          v-for="s in this.osloStations"
          city="oslo"
          :key="s.station_id"
          v-bind:station="s"
          v-bind:icon="osloIcon"
        />
        <station-marker
          v-for="s in this.bergenStations"
          city="bergen"
          :key="s.station_id"
          :station="s"
          :icon="bergenIcon"
        />
        <station-marker
          v-for="s in this.trondheimStations"
          city="trondheim"
          :key="s.station_id"
          v-bind:station="s"
          v-bind:icon="trondheimIcon"
        />
      </div>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import { GeoSearchControl } from "leaflet-geosearch";
import { KartverketProvider } from "./util";
import {} from "beautifymarker";
import StationMarker from "./components/StationMarker.vue";

const tileURL =
  "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png";

const osloIcon = L.BeautifyIcon.icon({
  icon: "bicycle",
  borderColor: "#005FC9",
  textColor: "#005FC9"
});

const bergenIcon = L.BeautifyIcon.icon({
  icon: "bicycle",
  borderColor: "#008A34",
  textColor: "#008A34"
});

const trondheimIcon = L.BeautifyIcon.icon({
  icon: "bicycle",
  borderColor: "#E02344",
  textColor: "#E02344"
});

export default {
  data() {
    // Data props goes here
    return {
      map: null,
      mapLoaded: false,
      tileLayer: null,
      osloStations: null,
      bergenStations: null,
      trondheimStations: null,
      osloIcon: osloIcon,
      bergenIcon: bergenIcon,
      trondheimIcon: trondheimIcon
    };
  },

  components: {
    StationMarker
  },

  beforeCreate() {
    fetch('/api/stations/oslo').then((res) => {
      res.json().then((data) => {
        this.osloStations = data;
      });
    });
    fetch('/api/stations/bergen').then((res) => {
      res.json().then((data) => {
        this.bergenStations = data;
      })
    })
    fetch('/api/stations/trondheim').then((res) => {
      res.json().then((data) => {
        this.trondheimStations = data;
      });
    });
  },

  mounted() {
    this.initMap();
  },

  methods: {
    initMap() {
      this.map = L.map("map");
      this.map.locate({
        setView: true,
        maxZoom: 14
      });
      this.tileLayer = L.tileLayer(tileURL, {
        maxZoom: 18,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
      });
      const searchControl = new GeoSearchControl({
        provider: new KartverketProvider(),
        style: "bar",
        autoComplete: true,
        showMarker: false,
        autoClose: true,
        zoomLevel: 14,
        searchLabel: "Enter city..."
      });
      this.tileLayer.addTo(this.map);
      searchControl.addTo(this.map);

      this.mapLoaded = true;
    }
  }
};
</script>

<style>

.map {
  height: 100vh;
  width: 100vw;
}

.search {
    position: fixed;
    z-index: 4;
}

</style>