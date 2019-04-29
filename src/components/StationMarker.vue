
<script>
import { marker, popup } from "leaflet";

export default {
  props: {
    station: {
      type: Object,
      required: true
    },
    icon: {
      type: Object,
      default: undefined
    },
    city: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      popupOpen: false
    }
  },

  created() {
    this.marker = marker([this.station.lat, this.station.lon], {
      icon: this.icon
    });
    this.popup = popup();

    this.marker.on('click', () => {
      this.popupOpen = !this.popupOpen;
    });
    this.popup.setContent(this.createPopupContent());
    this.marker.addTo(this.$parent.map);
    this.marker.bindPopup(this.popup);

  },

  render() {
    return null;
  },

  destroyed() {
    this.marker.unbindPopup();
    this.marker.remove();
  },

  methods: {
    createPopupContent() {
      return `
      <div id="popup-container" class="popup-container ${this.city}">
        <div id="popup-title" class="popup-top">
          <h1>${this.station.title}</h1>
          <h2>${this.station.subtitle}</h2>
        </div>
        <div id="bikes" class="popup-left">
          <p>${this.station.bikes} <i class="fas fa-bicycle"></i></p>
          </div>
          <div id="locks" class="popup-right">
          <p>${this.station.locks} <i class="fas fa-lock-open"></i></p>
        </div>
      </div>`;
    }
  }

};
</script>

<style>
.popup-container {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    overflow: auto;
    min-width: 14em;
}

.popup-left, .popup-right {
    width: 50%;
    height: 50%;
    margin: auto;
    text-align: center;
    font-size: 16pt;
    padding: 0.5em;
    opacity: 0.9;
}

.popup-left {
    float: left;
}

.popup-right {
    float: right;
}

.popup-top {
    height: 50%;
    margin: 0.5em;
}

.popup-top h1, .popup-top h2 {
    text-align: center;
}

.popup-top h1 {
    font-size: 16pt;
    opacity: 0.9;
}

.popup-top h2 {
    font-size: 12pt;
    opacity: 0.5;
}

.popup-container p {
    margin: 0;
}

.bergen {
    color: #008A34;
}

.trondheim {
    color: #E02344;
}

.oslo {
    color: #005FC9
}

</style>
