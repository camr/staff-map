<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import UIStore from "@/store/ui";

@Component
export default class Logout extends Vue {
  public created() {
    this.$gAuth.signOut().then(() => {
      UIStore.removeAuthCredentials();
      this.$router.replace("/");
    });
  }
}
</script>
