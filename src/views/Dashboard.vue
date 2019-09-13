<template>
  <div class="dashboard">
    <StaffList :staff="staff" />

    <!-- <v-dialog v-model="showEntryForm">
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">Add New Member</v-btn>
      </template>

      <NewStaffEntryForm v-on:close="showEntryForm = false" />
    </v-dialog> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import StaffStore, { StaffMember } from "@/store/staff";

import NewStaffEntryForm from "@/components/NewStaffEntryForm.vue";
import StaffList from "@/components/StaffList.vue";

@Component({
  components: { NewStaffEntryForm, StaffList },
})
export default class Dashboard extends Vue {
  private showEntryForm: boolean = false;

  private get staff(): StaffMember[] {
    return StaffStore.staff;
  }
}
</script>

<style lang="scss" scoped></style>
