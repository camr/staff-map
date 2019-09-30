<template>
  <div class="h-full w-full">
    <div ref="map" class="top-0 left-0 h-full w-full z-10"></div>

    <SelectedStaff :selected="selectedStaffMember" v-model="filteredStaff" />
  </div>
</template>

<script lang="tsx">
// import * as MarkerClusterer from "@google/markerclusterer";
import {} from "googlemaps";
import { Marked, Renderer } from "marked-ts";
import { VNode } from "vue";
import { Component, Watch, Vue } from "vue-property-decorator";

import RenderNode from "@/components/RenderNode.vue";
import SelectedStaff from "@/components/SelectedStaff.vue";

import StaffStore, { StaffMember } from "@/store/staff";

Marked.setOptions({
  renderer: new Renderer(),
  gfm: true,
});

class Popup extends google.maps.OverlayView {
  private position: google.maps.LatLng;
  private container: HTMLElement;

  constructor(position: google.maps.LatLng, content: VNode) {
    super();

    const Renderer = Vue.extend(RenderNode);
    const markup = new Renderer({
      propsData: {
        node: content,
      },
    });
    markup.$mount();

    this.position = position;
    markup.$el.classList.add("popup-bubble");

    const bubbleAnchor = document.createElement("div");
    bubbleAnchor.classList.add("popup-bubble-anchor");
    bubbleAnchor.appendChild(markup.$el);

    this.container = document.createElement("div");
    this.container.style.visibility = "hidden";
    this.container.classList.add("popup-container");
    this.container.appendChild(bubbleAnchor);

    // TODO: Typescript thinks this function doesn't exist...
    // Optionally stop clicks, etc., from bubbling up to the map.
    // google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.container);
  }

  public show() {
    this.container.style.visibility = "visible";
  }

  public hide() {
    this.container.style.visibility = "hidden";
  }

  public onAdd() {
    this.getPanes().floatPane.appendChild(this.container);
  }

  public onRemove() {
    if (this.container.parentElement) {
      this.container.parentElement.removeChild(this.container);
    }
  }

  public draw() {
    const pos = this.getProjection().fromLatLngToDivPixel(this.position);

    const display =
      Math.abs(pos.x) < 4000 && Math.abs(pos.y) < 4000 ? "block" : "none";

    if (display === "block") {
      this.container.style.left = `${pos.x}px`;
      this.container.style.top = `${pos.y - 30}px`;
    }

    if (this.container.style.display !== display) {
      this.container.style.display = display;
    }
  }
}

@Component({
  components: { SelectedStaff },
})
export default class Map extends Vue {
  private map: google.maps.Map | null = null;
  private activePopup?: Popup;

  private markers: google.maps.Marker[] = [];
  private selectedStaffMember: StaffMember | null = null;
  private filteredStaff: StaffMember[] = [];

  $refs!: {
    map: HTMLElement;
  };

  private get staff(): StaffMember[] {
    return StaffStore.staff;
  }

  private get visibleStaff(): StaffMember[] {
    if (!this.map || this.markers.length === 0) {
      return [];
    }

    const bounds = this.map.getBounds();
    if (!bounds) {
      return [];
    }

    return this.markers
      .filter((marker: google.maps.Marker) => {
        const pos = marker.getPosition();
        return pos && bounds.contains(pos);
      })
      .map(m => m.get("staff"))
      .sort((a: StaffMember, b: StaffMember) =>
        a.lastName.localeCompare(b.lastName)
      );
  }

  @Watch("map")
  private mapUpdated(newMap: google.maps.Map | null) {
    this.markers.forEach((m: google.maps.Marker) => {
      m.setMap(newMap);
    });

    // Force a recheck of marker visibility.
    this.$nextTick(() => {
      this.markers = this.markers.slice();
    });
  }

  @Watch("staff")
  private staffUpdated(newStaff: StaffMember[]) {
    this.markers.forEach((m: google.maps.Marker) => {
      m.setMap(null);
    });
    this.markers.splice(0);

    this.markers = newStaff.map((s: StaffMember, idx: number) => {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(s.latlng[0], s.latlng[1]),
        animation: google.maps.Animation.DROP,
      });
      marker.set("staff", s);

      marker.addListener("click", () => {
        if (this.activePopup) {
          this.activePopup.hide();
          this.selectedStaffMember = null;
        }

        const html = (
          <div class="member">
            <div class="font-bold">
              {s.firstName} {s.lastName}
            </div>
          </div>
        );

        const pos = marker.getPosition();
        if (this.map && pos) {
          const popup = new Popup(pos, html);
          popup.setMap(this.map);
          popup.show();

          this.activePopup = popup;
          this.selectedStaffMember = s;
        }
      });

      if (this.map) {
        // Delay adding marker to map for less crazy animation
        setTimeout(() => {
          marker.setMap(this.map);
        }, Math.min(idx * 200, 2000));
      }

      return marker;
    });
  }

  @Watch("filteredStaff")
  private filteredStaffUpdated(newFilteredStaff: StaffMember[]) {
    let acc: { [key: string]: boolean } = {};

    const idMap = newFilteredStaff.reduce((acc, s: StaffMember) => {
      if (s.id) {
        acc[s.id] = true;
      }
      return acc;
    }, acc);

    this.markers.forEach((marker: google.maps.Marker) => {
      const member = marker.get("staff");
      if (member.id && idMap[member.id as string]) {
        marker.setMap(this.map);
      } else {
        marker.setMap(null);
      }
    });
  }

  public mounted() {
    this.map = new google.maps.Map(this.$refs.map, {
      center: { lat: 38, lng: -96 },
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [],
    });

    this.map.addListener("click", () => {
      if (this.activePopup) {
        this.activePopup.hide();
        this.selectedStaffMember = null;
      }
    });

    this.map.addListener("clusterclick", cluster => {
      if (this.activePopup) {
        this.activePopup.hide();
        this.activePopup = undefined;
      }

      if (!this.map) {
        return;
      }

      const markers = cluster.getMarkers();

      const html = (
        <ul>
          {markers.map((marker: google.maps.Marker) => {
            const staff = marker.get("staff");
            return (
              <li class="member pb-1">
                <div class="font-bold">
                  {staff.firstName} {staff.lastName}
                </div>
                <hr />
              </li>
            );
          })}
        </ul>
      );

      const popup = new Popup(cluster.getCenter(), html);
      popup.setMap(this.map);
      popup.show();

      this.activePopup = popup;
      this.filteredStaff = markers.map((m: google.maps.Marker) =>
        m.get("staff")
      );
    });

    this.staffUpdated(this.staff);
  }
}
</script>

<style lang="postcss">
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

/* The popup bubble styling. */
.popup-bubble {
  /* Position the bubble centred-above its parent. */
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-50%, -100%);
  /* Style the bubble. */
  background-color: white;
  padding: 5px;
  border-radius: 5px;
  font-family: sans-serif;
  overflow-y: auto;
  max-height: 60px;
  box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.5);
}
/* The parent of the bubble. A zero-height div at the top of the tip. */
.popup-bubble-anchor {
  /* Position the div a fixed distance above the tip. */
  position: absolute;
  width: 100%;
  bottom: /* TIP_HEIGHT= */ 8px;
  left: 0;
}
/* This element draws the tip. */
.popup-bubble-anchor::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  /* Center the tip horizontally. */
  transform: translate(-50%, 0);
  /* The tip is a https://css-tricks.com/snippets/css/css-triangle/ */
  width: 0;
  height: 0;
  /* The tip is 8px high, and 12px wide. */
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: /* TIP_HEIGHT= */ 8px solid white;
}
/* JavaScript will position this div at the bottom of the popup tip. */
.popup-container {
  cursor: auto;
  height: 0;
  position: absolute;
  /* The max width of the info window. */
  width: 200px;
}
</style>
