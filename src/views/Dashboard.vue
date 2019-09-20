<template>
  <div class="dashboard w-full md:w-3/4 my-4">
    <StaffList :staff="staff" />
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
