<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <h5>{{ username }}</h5>

    <ul>
      <li v-for="member in staff" :key="member.name">
        {{ member.name }}
      </li>
    </ul>

    <NewStaffEntryForm />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import StaffStore from "@/store/staff";
import UiStore from "@/store/ui";

import NewStaffEntryForm from "@/components/NewStaffEntryForm.vue";

@Component({
  components: { NewStaffEntryForm },
})
export default class Dashboard extends Vue {
  private get username() {
    return UiStore.userName;
  }

  private get staff() {
    return StaffStore.staff;
  }
}
</script>

<style lang="scss" scoped></style>
