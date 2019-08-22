<template>
  <div class="dashboard">
    <ul>
      <li
        v-for="member in staff"
        :key="
          `${member.lastName.toLowerCase()}-${member.firstName.toLowerCase()}`
        "
      >
        {{ member.firstName }} {{ member.lastName }}
      </li>
    </ul>

    <v-dialog v-model="showEntryForm">
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">Add New Member</v-btn>
      </template>

      <NewStaffEntryForm v-on:cancel="showEntryForm = false" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import StaffStore, { StaffMember } from "@/store/staff";

import NewStaffEntryForm from "@/components/NewStaffEntryForm.vue";

@Component({
  components: { NewStaffEntryForm },
})
export default class Dashboard extends Vue {
  private showEntryForm: boolean = false;

  private get staff(): StaffMember[] {
    return StaffStore.staff;
  }

  public async created() {
    StaffStore.fetchStaff();
  }
}
</script>

<style lang="scss" scoped></style>
