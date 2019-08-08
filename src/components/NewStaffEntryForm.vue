<template>
  <form @submit.prevent="addStaffMember">
    <fieldset>
      <label>
        Name:
        <input type="text" placeholder="Member name" v-model="newMember.name" />
      </label>
    </fieldset>

    <button type="submit">Add to Staff</button>
  </form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import StaffStore, { StaffMember } from "@/store/staff";

@Component
export default class NewStaffEntryForm extends Vue {
  private newMember: StaffMember = new StaffMember();

  public addStaffMember() {
    console.log("Add new staff member:");
    console.log(this.newMember);
    StaffStore.addMember(this.newMember);
    this.newMember = new StaffMember();
  }
}
</script>

<style lang="scss" scoped></style>
