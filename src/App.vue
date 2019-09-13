<template>
  <div>
    <nav class="flex items-center justify-between flex-wrap bg-pink-600 p-6">
      <div class="flex items-center flex-shrink-0 text-white mr-6">
        <span class="font-normal text-xl"
          >Staff Map{{ orgName ? ` - ${orgName}` : "" }}</span
        >
      </div>

      <div class="block lg:hidden">
        <button
          class="flex items-center px-3 py-2 border rounded text-pink-200 border-pink-400 hover:text-white hover:border-white"
        >
          <svg
            class="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>

      <div class="w-full block items-end lg:flex lg:w-auto">
        <div class="text-sm lg:flex-grow">
          <a
            href="/about"
            class="block mt-4 lg:inline-block lg:mt-0 text-pink-100 hover:text-white mr-4 select-none"
          >
            About
          </a>

          <a
            href="/dashboard"
            class="block mt-4 lg:inline-block lg:mt-0 text-pink-100 hover:text-white mr-4 select-none"
          >
            Dashboard
          </a>

          <a
            href="/map"
            class="block mt-4 lg:inline-block lg:mt-0 text-pink-100 hover:text-white mr-4 select-none"
          >
            Map
          </a>
        </div>
      </div>
    </nav>

    <div class="flex justify-center p-4">
      <div class="w-full md:w-3/4">
        <router-view />
      </div>
    </div>

    <!-- <v-app-bar app fixed color="primary" dark fade-image-on-scroll>
    <template v-slot:img>
      <v-img
        src="@/assets/images/map.jpg"
        height="100%"
        gradient="to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)"
      ></v-img>
    </template>

    <v-toolbar-title
      >Staff Map{{ orgName ? ` - ${orgName}` : "" }}</v-toolbar-title
    >

    <div class="flex-grow-1"></div>

    <v-toolbar-items v-if="isUserLoggedIn">
      <v-btn text @click="$router.push('about')" class="d-none d-lg-block">
        About
      </v-btn>

      <v-btn icon @click="$router.push('about')" class="d-block d-lg-none">
        <v-icon>mdi-help</v-icon>
      </v-btn>

      <v-divider vertical></v-divider>

      <v-btn text @click="$router.push('dashboard')" class="d-none d-lg-block">
        Dashboard
      </v-btn>

      <v-btn icon @click="$router.push('dashboard')" class="d-block d-lg-none">
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
        <template v-if="isUserLoggedIn">
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
        </template>

        <v-card-actions>
          <div class="flex-grow-1"></div>

          <v-btn
            v-if="isUserLoggedIn"
            text
            @click="
              $router.push('logout');
              showAccountMenu = false;
            "
          >
            Log out
          </v-btn>

          <v-btn
            v-else
            text
            @click="
              $router.push('login');
              showAccountMenu = false;
            "
          >
            Log in
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-app-bar> -->

    <!-- <v-footer app dark padless class="font-weight-medium">
    <v-col class="text-center" cols="12">
      {{ new Date().getFullYear() }} &mdash; camr
    </v-col>
  </v-footer> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import UiStore from "@/store/ui";

@Component
export default class App extends Vue {
  private showAccountMenu: boolean = false;

  private get isUserLoggedIn() {
    return UiStore.isUserLoggedIn;
  }

  private get username() {
    return UiStore.userName;
  }

  private get orgName() {
    return UiStore.currentOrg ? UiStore.currentOrg.name : "";
  }
}
</script>

<style lang="postcss">
@import "assets/styles/base.pcss";
</style>
