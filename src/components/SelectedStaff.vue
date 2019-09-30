<template>
  <div
    class="
    selected-staff
    absolute top-0 left-0
    bg-white
    mt-16 mb-4
    ml-6
    rounded-lg
    shadow-md
    z-40
  "
  >
    <div class="bg-pink-700 rounded-t-lg flex items-center p-1">
      <SVGIcon
        name="search"
        class="
          h-4
          ml-2
          text-pink-300
        "
      />

      <input
        id="location"
        type="text"
        v-model="filterLocation"
        class="
          appearance-none block w-full
          text-white
          placeholder-pink-300
          rounded-t-lg py-3 pl-2
          leading-tight
          focus:outline-none
        "
      />
    </div>

    <div class="flex p-4">
      <div
        class="
          filter-dropdown
          border border-gray-200
          cursor-pointer
          hover:background-gray-200
          hover:shadow-md
          px-2 py-1
          rounded-md
          transition-all
        "
        @click="showDistanceFilter = !showDistanceFilter"
      >
        <span
          class="
            font-sans font-semibold
            text-xs
            select-none
            mr-2
          "
        >
          Distance
        </span>
        <SVGIcon
          name="chevron-down"
          class="w-4 transition-all transition-500"
          :class="{ 'rotate-z-180': showDistanceFilter }"
        />

        <div v-if="showDistanceFilter">
          <input
            type="range"
            min="5"
            max="5000"
            class="w-full"
            v-model="maxDistanceMiles"
          />
          <div class="text-right font-bold text-sm">
            {{ maxDistanceMiles }} mi
          </div>
        </div>
      </div>

      <div
        class="
          filter-dropdown
          border border-gray-200
          cursor-pointer
          hover:background-gray-200
          hover:shadow-md
          px-2 py-1
          ml-2
          rounded-md
          transition-all
        "
      >
        <span
          class="
            font-sans font-semibold
            text-xs
            select-none
            mr-2
          "
        >
          Position
        </span>
        <SVGIcon name="chevron-down" class="w-4" />
      </div>
    </div>

    <div
      class="
        font-sans
        font-normal
        text-gray-700
        text-xs
        tracking-normal
        leading-normal
        pl-2
      "
    >
      Showing
      <span v-if="filteredStaff.length === staff.length">all</span>
      {{ filteredStaff.length }} staff members
    </div>

    <ul class="p-2">
      <li v-for="member of filteredStaff" :key="member.id">
        <span :class="selected && selected.id === member.id ? 'font-bold' : ''">
          {{ member.firstName }} {{ member.lastName }}
          <span v-if="member.id && staffDistances[member.id]">
            ({{ staffDistances[member.id] }} miles)
          </span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {} from "googlemaps";
import { Component, Prop, Watch, Vue } from "vue-property-decorator";

import StaffStore, { StaffMember } from "@/store/staff";

import SVGIcon from "@/components/ui/SVGIcon.vue";
import TextInputField from "@/components/ui/TextInputField.vue";

@Component({
  components: { SVGIcon, TextInputField },
  model: {
    prop: "filteredStaff",
    event: "update",
  },
})
export default class SelectedStaff extends Vue {
  @Prop()
  public selected!: StaffMember | null;

  @Prop()
  public filteredStaff!: StaffMember[];

  private filterLocation: string = "";
  private filterLatLng: google.maps.LatLng | null = null;

  private staffDistances: { [id: string]: number } = {};
  private maxDistanceMiles: number = 500;

  private showDistanceFilter: boolean = false;

  private get staff(): StaffMember[] {
    return StaffStore.staff;
  }

  @Watch("staff")
  private staffChanged(newStaff: StaffMember[]) {
    this.maxDistanceMiles = 500;
    this.filterLocation = "";
    this.filterLatLng = null;

    this.$emit("update", newStaff);
  }

  @Watch("filterLatLng")
  private filterLocationChanged(newLatLng: google.maps.LatLng | null) {
    this.staffDistances = {};
    if (newLatLng) {
      this.staff.forEach((s: StaffMember) => {
        if (!s.latlng || !s.id) {
          return;
        }

        const staffPos = new google.maps.LatLng(s.latlng[0], s.latlng[1]);
        const dist = google.maps.geometry.spherical.computeDistanceBetween(
          newLatLng,
          staffPos
        );

        this.staffDistances[s.id] = Math.floor(dist * 0.000621371); // Meters to miles
        console.log(
          `${s.firstName} ${s.lastName}: ${this.staffDistances[s.id]} mi`
        );
      });
    }

    this.$nextTick(() => {
      this.filterStaff();
    });
  }

  @Watch("maxDistanceMiles")
  private maxDistanceChanged() {
    this.$nextTick(() => {
      this.filterStaff();
    });
  }

  private filterStaff(): void {
    let filtered = this.staff;

    if (this.filterLatLng) {
      filtered = filtered.filter((s: StaffMember) => {
        if (!s.id) {
          return true;
        }

        return this.staffDistances[s.id] <= this.maxDistanceMiles;
      });
    }

    if (this.filterLatLng) {
      filtered.sort((a: StaffMember, b: StaffMember) => {
        if (!a.id) {
          return -1;
        } else if (!b.id) {
          return 1;
        }

        return this.staffDistances[a.id] - this.staffDistances[b.id];
      });
    } else {
      filtered.sort((a: StaffMember, b: StaffMember) => {
        return a.lastName.localeCompare(b.lastName);
      });
    }

    this.$emit("update", filtered);
  }

  public mounted() {
    const autocompleteEl = this.$el.querySelector("#location");
    if (!autocompleteEl) {
      return;
    }

    const autocomplete = new google.maps.places.Autocomplete(
      autocompleteEl as HTMLInputElement,
      { types: ["geocode"] }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place && place.geometry && place.address_components) {
        const ac = place.address_components;

        let city: string | null = null;
        let state: string | null = null;

        let i = 0;
        while ((city === null || state === null) && i < ac.length) {
          if (!city && ac[i].types.includes("locality")) {
            city = ac[i].long_name;
          } else if (!city && ac[i].types.includes("sublocality_level_1")) {
            city = ac[i].long_name;
          }

          if (!state && ac[i].types.includes("administrative_area_level_1")) {
            state = ac[i].short_name;
          }

          i++;
        }

        let display: string = state || "";
        if (city && state) {
          display = `, ${display}`;
        }
        if (city) {
          display = `${city}${display}`;
        }

        this.filterLocation = display;
        this.filterLatLng = place.geometry.location;
      } else {
        console.log("User didn't pick a place");
      }
    });
  }
}
</script>

<style lang="postcss">
.selected-staff {
  height: calc(100vh - 5rem);

  min-width: 350px;
  max-width: 350px;
}
</style>
