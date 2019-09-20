<template>
  <div class="staff-list flex flex-col">
    <ul v-if="staff.length > 0" class="w-full">
      <StaffListEntry
        v-for="member in staff"
        v-model="selectedMemberId"
        :member="member"
        :key="member.id"
        class="mb-2"
      />
    </ul>

    <div class="w-auto text-right mt-3">
      <Button @click="addNewMember" :debounce="1000"
        >Add New Staff Member</Button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import StaffStore, { StaffMember } from "@/store/staff";

import Button from "@/components/ui/Button.vue";
import StaffListEntry from "@/components/StaffListEntry.vue";

@Component({
  components: { Button, StaffListEntry },
})
export default class StaffList extends Vue {
  @Prop({ default: [] })
  public readonly staff!: StaffMember[];

  private selectedMemberId?: string;

  public addNewMember() {
    StaffStore.addMember(new StaffMember()).then(member => {
      this.selectedMemberId = member.id;
    });
  }
}
</script>

<style lang="postcss" scoped></style>
