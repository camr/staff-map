<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import firebase from "firebase/app";
import "firebase/auth";

import UIStore from "@/store/ui";

@Component
export default class Logout extends Vue {
  public async created() {
    try {
      await firebase.auth().signOut();

      UIStore.removeAuthCredentials();
      this.$router.replace("/");
    } catch (err) {
      console.error(err);
    }
  }
}
</script>
