<template>
  <v-app id="staff-map">
    <v-content>
      <div id="nav">
        <router-link to="/">About</router-link> |

        <template v-if="isUserLoggedIn">
          <router-link to="/dashboard">Dashboard</router-link> |
          <router-link to="/logout">Logout</router-link>
        </template>
        <template v-else>
          <router-link to="/login">Login</router-link> |
          <router-link to="/register">Register</router-link>
        </template>
      </div>

      <router-view />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import UIStore from "@/store/ui";

@Component
export default class App extends Vue {
  get isUserLoggedIn() {
    return UIStore.isUserLoggedIn;
  }
}
</script>

<style lang="scss" scoped>
#staff-map {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
