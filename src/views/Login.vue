<template>
  <div class="flex">
    <form ref="form" class="w-full mt-2 bg-white rounded-lg">
      <div class="bg-gray-300 font-bold text-lg text-gray-800 p-2 mb-4">
        {{ showRegistration ? "Create Account" : "Welcome Back" }}
      </div>

      <div class=" p-4">
        <template v-if="showRegistration">
          <TextInputField
            v-model="newName"
            :rules="rules.name"
            label="Name"
            type="text"
            autocomplete="name"
            required
          />

          <v-text-field
            v-model="newEmail"
            :rules="rules.email"
            label="Email"
            type="text"
            autocomplete="username email"
            required
          ></v-text-field>

          <v-text-field
            v-model="newPassword"
            :rules="rules.password"
            label="Password"
            type="password"
            autocomplete="new-password"
            required
          ></v-text-field>
        </template>

        <template v-else>
          <TextInputField
            v-model="email"
            :rules="rules.email"
            label="Email"
            type="text"
            autocomplete="username email"
            required
            class="mb-4"
          />

          <TextInputField
            v-model="password"
            label="Password"
            type="password"
            autocomplete="current-password"
            required
          />
        </template>

        <hr class="mb-4" />

        <Button :disabled="!formIsValid" @click="submit">
          {{ showRegistration ? "Sign Up" : "Sign In" }}
        </Button>

        <v-row no-gutters>
          <v-col cols="12" class="text-right">
            <a
              @click="showRegistration = !showRegistration"
              class="caption text-uppercase"
              >{{ showRegistration ? "Sign In" : "Sign Up" }}</a
            >

            <a class="caption text-uppercase ml-8">Forgot Password?</a>
          </v-col>
        </v-row>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";

import firebase from "firebase/app";
import "firebase/auth";

import UiStore from "@/store/ui";

import Button from "@/components/ui/Button.vue";
import TextInputField from "@/components/ui/TextInputField.vue";

type FormRule = (val: any) => boolean | string;
type FormRules = { [key: string]: FormRule[] };

@Component({
  components: { Button, TextInputField },
})
export default class Login extends Vue {
  private showRegistration: boolean = false;

  private newName: string = "";
  private newEmail: string = "";
  private newPassword: string = "";

  private email: string = "";
  private password: string = "";

  private rules: FormRules = {
    name: [(val: string) => (val || "").length > 0 || "This field is required"],

    email: [
      (val: string) =>
        /\S+@\S+\.\S+/.test(val || "") || "Must be a valid email address",
    ],
    password: [
      (val: string) => (val || "").length > 0 || "This field is required",
    ],
  };

  private get formIsValid(): boolean {
    if (this.showRegistration) {
      return (
        this.newName.length > 0 &&
        this.newEmail.length > 0 &&
        this.newPassword.length > 0
      );
    }

    return (
      this.rules.email.map(fn => fn(this.email)).every(Boolean) &&
      this.rules.password.map(fn => fn(this.password)).every(Boolean)
    );
  }

  public submit() {
    if (this.showRegistration) {
      this.register();
    } else {
      this.login();
    }
  }

  public async register() {
    try {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(this.newEmail, this.newPassword);

      const user = firebase.auth().currentUser;
      if (user === null) {
        throw new Error("New user was not immediately accessible");
      }

      await user.updateProfile({
        displayName: this.newName,
      });
    } catch (err) {
      console.error("Error creating user:");
      console.error(err);
    }
  }

  public async login() {
    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password);
    } catch (err) {
      console.error("Error signing user in:");
      console.error(err);
    }
  }
}
</script>
