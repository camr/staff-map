import Vue from "vue";
import Router, { RouterOptions } from "vue-router";

import UIStore from "@/store/ui";

import About from "@/views/About.vue";
import Dashboard from "@/views/Dashboard.vue";
import Login from "@/views/Login.vue";
import Logout from "@/views/Logout.vue";

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
  ],
};

const router = new Router(options);

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!UIStore.isUserLoggedIn) {
      next({
        name: "login",
        params: { next: to.fullPath },
      });
    } else {
      UIStore.validateUserAuth()
        .then(next)
        .catch(() => {
          console.error("User was logged in, but auth was invalid");
          next({
            name: "login",
            params: { next: to.fullPath },
          });
        });
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (!UIStore.isUserLoggedIn) {
      next();
    } else {
      next({ name: "dashboard" });
    }
  } else {
    next();
  }
});

export default router;
