<template>
  <div>
    <h4>Login</h4>
    <button @click="login">Login</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import UiStore from "@/store/ui";

@Component
export default class Login extends Vue {
  public login() {
    this.$gAuth
      .signIn()
      .then((guser: any) => {
        const profile = guser.getBasicProfile();
        const user = {
          id: guser.getId(),
          name: profile.ig,
          avatarUrl: profile.Paa,
        };

        UiStore.storeAuthCredentials({
          token: guser.getAuthResponse().access_token,
          user,
        });

        this.$emit("loginSuccess");

        if (this.$route.params.next != null) {
          this.$router.replace(this.$route.params.next);
        } else {
          this.$router.replace("/dashboard");
        }
      })
      .catch(() => {
        this.$emit("loginFailed");
      });
  }
}
</script>
