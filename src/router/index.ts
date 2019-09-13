import Vue from "vue";
import Router, { RouterOptions } from "vue-router";

import About from "@/views/About.vue";
import Dashboard from "@/views/Dashboard.vue";
import Login from "@/views/Login.vue";
import Logout from "@/views/Logout.vue";
import Map from "@/views/Map.vue";

Vue.use(Router);

export const options: RouterOptions = {
  base: process.env.BASE_URL,
  mode: "history",
  routes: [
    {
      path: "/",
      name: "about",
      component: About,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        guest: true,
      },
    },
    {
      path: "/logout",
      name: "logout",
      component: Logout,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/map",
      name: "map",
      component: Map,
      meta: {
        requiresAuth: true,
      },
    },
  ],
};

export default new Router(options);
