<template>
  <!-- <v-form ref="form" @submit.prevent="addStaffMember"> -->
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
  <!-- </v-form> -->
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

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
    form: HTMLFormElement;
  };

  private get formIsValid(): boolean {
    return (
      this.newMember.firstName.length > 0 && this.newMember.lastName.length > 0
    );
  }

  private resetForm() {
    // this.$refs.form.reset();
    this.newMember = new StaffMember();

    this.$emit("cancel");
  }

  public addStaffMember() {
    console.log("Add new staff member:");
    console.log(this.newMember);
    StaffStore.addMember(this.newMember);
    this.$refs.form.reset();
    this.newMember = new StaffMember();

    StaffStore.fetchStaff();
  }
}
</script>

<style lang="scss" scoped></style>
