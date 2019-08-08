<template>
  <div class="home"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import Firebase from "firebase";

// OAuth Client ID
// 463595452453-832ol4s0c8j112m5v29qmdah3l78s5pm.apps.googleusercontent.com

// OAuth Client Secret
// 3KdSl8vEAHpzJlzR4oVfPSs1

@Component
export default class Home extends Vue {
  public created() {
    Firebase.initializeApp({
      apiKey: "### FIREBASE API KEY ###",
      authDomain: "### FIREBASE AUTH DOMAIN ###",
      projectId: "### CLOUD FIRESTORE PROJECT ID ###",
    });

    var db = Firebase.firestore();
  }
}
</script>

<style lang="scss" scoped></style>
