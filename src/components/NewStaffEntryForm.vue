<template>
  <v-form ref="form" @submit.prevent="addStaffMember">
    <v-card tile>
      <v-toolbar flat color="blue-grey" dark>
        <v-toolbar-title>Add new member</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-container fluid>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="newMember.firstName"
                :rules="rules.name"
                label="First Name"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="newMember.lastName"
                :rules="rules.name"
                label="Last name"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="newMember.email"
                :rules="rules.name"
                label="Email"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="newMember.phoneNumber"
                label="Phone number"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                id="location"
                ref="autocomplete"
                placeholder="Search"
                onfocus="value = ''"
                type="text"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn text @click="resetForm">Cancel</v-btn>
        <div class="flex-grow-1"></div>
        <v-btn :disabled="!formIsValid" text color="primary" type="submit"
          >Add to Staff</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {} from "googlemaps";

import StaffStore, { StaffMember } from "@/store/staff";

type FormRule = (val: any) => boolean | string;
type FormRules = { [key: string]: FormRule[] };

@Component
export default class NewStaffEntryForm extends Vue {
  private newMember: StaffMember = new StaffMember();

  private rules: FormRules = {
    name: [(val: string) => (val || "").length > 0 || "This field is required"],
  };

  public $refs!: {
    autocomplete: HTMLInputElement;
    form: HTMLFormElement;
  };

  private get formIsValid(): boolean {
    return (
      this.newMember.firstName.length > 0 &&
      this.newMember.lastName.length > 0 &&
      this.newMember.latlng.length > 0
    );
  }

  public mounted() {
    const autocomplete = new google.maps.places.Autocomplete(
      this.$el.querySelector("#location")! as HTMLInputElement,
      { types: ["geocode"] }
    );

    autocomplete.addListener("place_changed", () => {
      let place = autocomplete.getPlace();
      if (place && place.geometry && place.address_components) {
        let ac = place.address_components;
        let lat = place.geometry.location.lat();
        let lng = place.geometry.location.lng();

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

        this.newMember.displayLocation = display;
        this.newMember.latlng = [lat, lng];
      } else {
        console.log("User didn't pick a place");
      }
    });
  }

  private resetForm() {
    // this.$refs.form.reset();
    this.newMember = new StaffMember();

    this.$emit("close");
  }

  public async addStaffMember() {
    console.log("Add new staff member:");
    console.log(this.newMember);

    try {
      StaffStore.addMember(this.newMember);
      this.$refs.form.reset();
      this.newMember = new StaffMember();

      this.$emit("close");
    } catch (err) {
      console.error(err);
    }
  }
}
</script>

<style lang="scss" scoped></style>
