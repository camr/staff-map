<template>
  <v-app id="staff-map">
    <v-navigation-drawer
      id="app-drawer"
      app
      dark
      floating
      persistent
      mobile-break-point="991"
      width="260"
    >
      <v-img
        src="https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-3.3a54f533.jpg"
        height="100%"
      >
        <v-layout class="fill-height" tag="v-list" column>
          <v-list-item avatar>
            <v-list-item-avatar color="white">
              <v-img
                src="https://demos.creative-tim.com/vuetify-material-dashboard/img/vuetifylogo.png"
                height="34"
                contain
              />
            </v-list-item-avatar>
            <v-list-item-title class="title">
              Vuetify MD
            </v-list-item-title>
          </v-list-item>
          <v-divider />
          <v-list-item
            to="/dashboard"
            active-class="red"
            avatar
            class="v-list-item"
          >
            <v-list-item-action>
              <v-icon>mdi-anchor</v-icon>
            </v-list-item-action>
            <v-list-item-title text="Dashboard" />
          </v-list-item>
          <v-list-item
            disabled
            active-class="primary"
            class="v-list-item v-list__tile--buy"
            to="/upgrade"
          >
            <v-list-item-action>
              <v-icon>mdi-package-up</v-icon>
            </v-list-item-action>
            <v-list-item-title class="font-weight-light">
              Upgrade To PRO
            </v-list-item-title>
          </v-list-item>
        </v-layout>
      </v-img>
    </v-navigation-drawer>

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

import UiStore from "@/store/ui";

@Component
export default class App extends Vue {
  get isUserLoggedIn() {
    return UiStore.isUserLoggedIn;
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
