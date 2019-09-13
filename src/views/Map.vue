<template>
  <div ref="map"></div>
</template>

<script lang="ts">
import {} from "googlemaps";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Map extends Vue {
  $refs!: {
    map: HTMLElement;
  };

  public mounted() {
    const map = new google.maps.Map(this.$refs.map, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
  }
}
</script>
