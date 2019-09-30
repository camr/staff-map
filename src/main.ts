import firebase from "firebase/app";
import "firebase/app";

import { collection, query, untypedWhereArrayContains } from "typesaurus";

import Vue, { CreateElement } from "vue";

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/dist/vuetify.min.css";

import store from "@/store";
import UiStore, { Org } from "@/store/ui";

import router from "@/router";

import App from "./App.vue";

Vue.config.productionTip = false;

firebase.initializeApp({
  apiKey: process.env.VUE_APP_GOOGLE_PROJECT_API_KEY,
  authDomain: "staff-map-248519.firebaseapp.com",
  databaseURL: "https://staff-map-248519.firebaseio.com",
  projectId: "staff-map-248519",
  storageBucket: "staff-map-248519.appspot.com",
  messagingSenderId: "463595452453",
  appId: "1:463595452453:web:c288396484e42e13"
});

firebase.auth().onAuthStateChanged(async user => {
  let redirect: string | null = null;

  if (user) {
    if (router.currentRoute.meta.guest) {
      redirect = "about";
    }

    const orgCollection = collection<Org>("orgs");
    const orgs = await query(orgCollection, [
      untypedWhereArrayContains("managers", user.uid)
    ]).then(r => r.map(d => ({ id: d.ref.id, ...d.data })));

    if (orgs.length > 0) {
      UiStore.setCurrentOrg(orgs[0]);
    } else {
      throw new Error("User is not associated with any organizations");
    }

    UiStore.storeAuthCredentials({
      token: user.refreshToken,
      user: {
        name: user.displayName,
        email: user.email
      }
    });
  } else {
    if (router.currentRoute.meta.requiresAuth) {
      redirect = "dashboard";
    }

    UiStore.removeAuthCredentials();
  }

  if (redirect) {
    router.replace({ name: redirect });
  }
});

new Vue({
  render: (h: CreateElement) => h(App),
  router,
  store
}).$mount("#app");
