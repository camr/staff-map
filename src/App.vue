<template>
  <div
    class="
        flex flex-col
        h-full w-full
      "
  >
    <nav
      class="
        flex
        w-full
        items-center justify-between
        bg-pink-600 p-4
      "
    >
      <div
        class="
          text-lg text-white
          mr-6
        "
      >
        Staff Map{{ orgName ? ` - ${orgName}` : "" }}
      </div>

      <div class="flex items-center justify-end">
        <a
          href="/about"
          class="
              block
              lg:inline-block lg:mt-0
              text-pink-100 hover:text-pink-300
              mr-4
              select-none
            "
        >
          <span class="hidden lg:block">About</span>
          <SVGIcon name="information-outline" class="block lg:hidden" />
        </a>

        <a
          href="/dashboard"
          class="
              block
              lg:inline-block lg:mt-0
              text-pink-100 hover:text-pink-300
              mr-4
              select-none
            "
        >
          <span class="hidden lg:block">Dashboard</span>
          <SVGIcon name="dashboard" class="block lg:hidden" />
        </a>

        <a
          href="/map"
          class="
              block
              text-pink-100 hover:text-pink-300
              mr-4
              select-none
            "
        >
          <span class="hidden lg:block">Map</span>
          <SVGIcon name="map" class="block lg:hidden" />
        </a>

        <div
          class="
            h-full w-px bg-pink-500 mr-4
          "
          style="height: 80px;"
        ></div>

        <SVGIcon
          name="dots-horizontal-triple"
          class="
            text-pink-100 hover:text-pink-300
          "
        />
      </div>
    </nav>

    <div class="flex align-center justify-center">
      <router-view />
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

import SVGIcon from "@/components/ui/SVGIcon.vue";

@Component({
  components: { SVGIcon },
})
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

nav {
  max-height: 80px;
}
</style>
