<template>
  <div class="h-full w-full">
    <div ref="map" class="h-full w-full"></div>
  </div>
</template>

<script lang="ts">
import * as MarkerClusterer from "@google/markerclusterer";
import {} from "googlemaps";
import { Marked, Renderer } from "marked-ts";
import { Component, Watch, Vue } from "vue-property-decorator";

import StaffStore, { StaffMember } from "@/store/staff";

Marked.setOptions({
  renderer: new Renderer(),
  gfm: true,
});

@Component
export default class Map extends Vue {
  private map?: google.maps.Map;
  private activeInfo?: google.maps.InfoWindow;

  $refs!: {
    map: HTMLElement;
  };

  private get staff(): StaffMember[] {
    return StaffStore.staff;
  }

  @Watch("staff")
  private staffUpdated(newStaff: StaffMember[]) {
    if (this.map) {
      const markers = newStaff.map(s => {
        const icon = {
          url: `${s.avatarUrl}&s=24`,
          size: new google.maps.Size(24, 24),
        };

        const marker = new google.maps.Marker({
          map: this.map,
          position: new google.maps.LatLng(s.latlng[0], s.latlng[1]),
          icon,
          // label: {
          //   fontSize: "0.75rem",
          //   text: `${s.firstName[0]}${s.lastName[0]}`,
          // },
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="info">
              <div class="font-bold">${s.firstName} ${s.lastName}</div>
              <div class="notes">${Marked.parse(s.notes)}</div>
            </div>
          `,
        });

        marker.addListener("click", () => {
          if (this.activeInfo) {
            this.activeInfo.close();
          }

          infoWindow.open(this.map, marker);
          this.activeInfo = infoWindow;
        });

        return marker;
      });

      // const markerCluster = new MarkerClusterer(this.map, markers);
    }
  }

  public mounted() {
    this.map = new google.maps.Map(this.$refs.map, {
      center: { lat: 38, lng: -96 },
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      styles: [],
    });

    this.map.addListener("click", () => {
      if (this.activeInfo) {
        this.activeInfo.close();
      }
    });

    this.staffUpdated(this.staff);
  }
}
</script>

<style lang="postcss">
.info {
  max-height: 100px;
  max-width: 200px;
}
.notes {
  @apply text-gray-700;

  p {
    @apply my-2;
  }

  h1 {
    @apply text-3xl;
  }
  h2 {
    @apply text-2xl;
  }
  h3 {
    @apply text-xl;
  }
  h4 {
    @apply text-lg;
  }

  ul {
    @apply my-4;

    li {
      &:before {
        content: "•";
        margin-right: 0.25rem;
      }
    }

    ul {
      @apply ml-4 my-0;
    }
  }
}
</style>
