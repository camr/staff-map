<template>
  <form
    ref="updateForm"
    class="p-4 mt-2 bg-white cursor-default"
    @click.stop.prevent
  >
    <div class="flex">
      <TextInputField
        class="w-1/2 pr-2"
        label="First Name"
        v-model="member.firstName"
      />

      <TextInputField
        class="w-1/2 pl-2"
        label="Last Name"
        v-model="member.lastName"
      />
    </div>

    <div class="flex">
      <div class="w-1/2 pr-2 flex flex-col">
        <TextInputField class="w-full" label="Email" v-model="member.email" />

        <TextInputField
          class="w-full"
          label="Phone Number"
          v-model="member.phoneNumber"
        />

        <TextInputField
          class="w-full"
          label="Location"
          id="location"
          v-model="member.displayLocation"
        />

        <TextInputField
          class="w-full"
          label="Positions"
          id="position"
          v-model="newPosition"
          v-hotkey="positionHotkeys"
          @blur="addPosition"
        />
        <div class="w-full flex flex-wrap items-center">
          <div
            v-for="pos in member.positions"
            :key="pos"
            class="
              border border-gray-400
              bg-gray-200
              text-xs
              rounded-lg
              px-2 py-1
              mr-2 mb-2
            "
          >
            #{{ pos }}
          </div>
        </div>
      </div>

      <div class="w-1/2 pl-2 flex flex-col">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="notes"
        >
          Notes
        </label>

        <div
          v-show="showMarkdown"
          v-html="markdownNotes"
          @click="focusOnNotes"
          class="
            notes
            w-full h-full rounded
            bg-gray-200 border border-solid border-gray-200
            py-3 px-4
            cursor-text
          "
        ></div>

        <textarea
          v-show="!showMarkdown"
          v-model="member.notes"
          id="notes"
          ref="notes"
          @blur="showMarkdown = true"
          class="
            appearance-none block w-full
            bg-gray-200 text-gray-700
            border border-solid border-gray-200
            h-full w-full
            rounded py-3 px-4
            leading-tight
            resize-none
            focus:outline-none focus:bg-white
            focus:border-gray-300
          "
        />

        <p class="text-red-500 text-xs italic">&nbsp;</p>
      </div>
    </div>

    <div class="flex justify-between mt-4">
      <Button class="danger" @click="remove">Delete</Button>

      <div>
        <Button class="secondary mr-2" @click="cancel">Cancel</Button>
        <Button class="primary" :debounce="1000" @click="update">
          <template v-slot:default>
            Save
          </template>
          <template v-slot:debounced>
            Saved
          </template>
        </Button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import {} from "googlemaps";
import { Component, Prop, Vue } from "vue-property-decorator";

import { Marked, Renderer } from "marked-ts";

import { StaffMember } from "@/store/staff";

import Button from "@/components/ui/Button.vue";
import TextInputField from "@/components/ui/TextInputField.vue";
import SVGIcon from "@/components/ui/SVGIcon.vue";

Marked.setOptions({
  renderer: new Renderer(),
  gfm: true,
});

@Component({
  components: { Button, TextInputField, SVGIcon },
  model: {
    prop: "member",
    event: "update",
  },
})
export default class StaffListEntry extends Vue {
  @Prop()
  public member!: StaffMember;

  private showMarkdown: boolean = true;
  private newPosition: string = "";

  $refs!: {
    notes: HTMLTextAreaElement;
    updateForm: HTMLFormElement;
  };

  private get markdownNotes(): string {
    return Marked.parse(this.member.notes);
  }

  private get positionHotkeys() {
    return {
      enter: this.addPosition,
    };
  }

  private update() {
    // TODO: Validate inputs before updating.
    this.$emit("update", this.member);
  }

  private cancel() {
    this.$emit("cancel");
  }

  private remove() {
    // TODO: Ask for confirmation.
    this.$emit("remove", this.member);
  }

  private addPosition(): void {
    if (this.newPosition.length > 0) {
      this.member.positions.push(this.newPosition);
      this.newPosition = "";
    }
  }

  private focusOnNotes() {
    this.showMarkdown = false;
    this.$nextTick(() => {
      this.$refs.notes.focus();
    });
  }

  public mounted() {
    // const autocompleteEl = this.$el.querySelector("#location");
    // if (!autocompleteEl) {
    //   return;
    // }
    // const autocomplete = new google.maps.places.Autocomplete(
    //   autocompleteEl as HTMLInputElement,
    //   { types: ["geocode"] }
    // );
    // autocomplete.addListener("place_changed", () => {
    //   let place = autocomplete.getPlace();
    //   if (place && place.geometry && place.address_components) {
    //     let ac = place.address_components;
    //     let lat = place.geometry.location.lat();
    //     let lng = place.geometry.location.lng();
    //     let city: string | null = null;
    //     let state: string | null = null;
    //     let i = 0;
    //     while ((city === null || state === null) && i < ac.length) {
    //       if (!city && ac[i].types.includes("locality")) {
    //         city = ac[i].long_name;
    //       } else if (!city && ac[i].types.includes("sublocality_level_1")) {
    //         city = ac[i].long_name;
    //       }
    //       if (!state && ac[i].types.includes("administrative_area_level_1")) {
    //         state = ac[i].short_name;
    //       }
    //       i++;
    //     }
    //     let display: string = state || "";
    //     if (city && state) {
    //       display = `, ${display}`;
    //     }
    //     if (city) {
    //       display = `${city}${display}`;
    //     }
    //     this.member.displayLocation = display;
    //     this.member.latlng = [lat, lng];
    //   } else {
    //     console.log("User didn't pick a place");
    //   }
    // });
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
</style>
