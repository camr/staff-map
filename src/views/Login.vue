<template>
  <div>
    <h4>Login</h4>
    <button @click="login">Login</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import UIStore from "@/store/ui";

@Component
export default class Login extends Vue {
  public login() {
    this.$gAuth
      .signIn()
      .then((user: any) => {
        const profile = user.getBasicProfile();

        UIStore.storeAuthCredentials({
          token: user.getAuthResponse().access_token,
          id: user.getId(),
          name: profile.ig,
          avatarUrl: profile.Paa,
        });

        this.$emit("loginSuccess");

        if (this.$route.params.next != null) {
          this.$router.push(this.$route.params.next);
        } else {
          this.$router.push("/dashboard");
        }
      })
      .catch(() => {
        this.$emit("loginFailed");
      });
  }
}
</script>
