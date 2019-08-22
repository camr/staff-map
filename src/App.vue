<template>
  <v-app id="staff-map">
    <!--
    <v-navigation-drawer app dark>
      <template v-slot:img>
        <v-img
          src="https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-3.3a54f533.jpg"
          height="100%"
          gradient="to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5)"
        ></v-img>
      </template>

      <v-list nav>
        <v-list-item dark>
          <v-list-item-title>Staff Map</v-list-item-title>
        </v-list-item>

        <v-list-item link dark to="/about">
          <v-list-item-icon>
            <v-icon>mdi-anchor</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/dashboard">
          <v-list-item-icon>
            <v-icon>mdi-anchor</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block>Logout</v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    -->

    <v-app-bar app fixed color="primary" dark fade-image-on-scroll>
      <template v-slot:img>
        <v-img
          src="@/assets/map.jpg"
          height="100%"
          gradient="to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)"
        ></v-img>
      </template>

      <v-toolbar-title>Staff Map</v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-toolbar-items v-if="isUserLoggedIn">
        <v-btn text @click="$router.push('about')" class="d-none d-lg-block">
          About
        </v-btn>

        <v-btn icon @click="$router.push('about')" class="d-block d-lg-none">
          <v-icon>mdi-help</v-icon>
        </v-btn>

        <v-divider vertical></v-divider>

        <v-btn
          text
          @click="$router.push('dashboard')"
          class="d-none d-lg-block"
        >
          Dashboard
        </v-btn>

        <v-btn
          icon
          @click="$router.push('dashboard')"
          class="d-block d-lg-none"
        >
          <v-icon>mdi-view-dashboard</v-icon>
        </v-btn>

        <v-divider vertical></v-divider>
      </v-toolbar-items>

      <v-divider vertical></v-divider>

      <v-menu
        v-model="showAccountMenu"
        :close-on-content-click="false"
        :nudge-width="200"
        left
        bottom
      >
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-avatar>
                <img
                  src="https://cdn.vuetifyjs.com/images/john.jpg"
                  :alt="username"
                />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ username }}</v-list-item-title>
              </v-list-item-content>

              <v-list-item-action></v-list-item-action>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list>
            <v-list-item>
              <v-list-item-action>
                <v-switch color="purple"></v-switch>
              </v-list-item-action>
              <v-list-item-title>Enable messages</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-list-item-action>
                <v-switch color="purple"></v-switch>
              </v-list-item-action>
              <v-list-item-title>Enable hints</v-list-item-title>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-card-actions>
            <div class="flex-grow-1"></div>

            <v-btn text @click="$router.push('logout')">
              Logout
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-content>

    <v-footer app dark padless class="font-weight-medium">
      <v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} &mdash; camr
      </v-col>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import UiStore from "@/store/ui";

@Component
export default class App extends Vue {
  private showAccountMenu: boolean = false;

  private get username() {
    return UiStore.userName;
  }

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
  color: #2c3e50;
}
</style>
