import Vue from "vue";
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";

import store from "@/store";

export interface UiState {
  userToken: string | null;
  userName: string;
  userAvatarUrl: string;
}

@Module({ dynamic: true, store, name: "ui" })
class UiModule extends VuexModule implements UiState {
  public userToken: string | null = null;
  public userName: string = "";
  public userAvatarUrl: string = "";

  public get isUserLoggedIn() {
    return this.userToken !== null;
  }

  @Mutation
  public authSuccess({
    token,
    name,
    avatarUrl,
  }: {
    token: string;
    name: string;
    avatarUrl: string;
  }) {
    this.userToken = token;
    this.userName = name;
    this.userAvatarUrl = avatarUrl;
  }

  @Mutation
  public clearAuth() {
    this.userToken = null;
    this.userName = "";
    this.userAvatarUrl = "";
  }

  @Action
  public async storeAuthCredentials({
    token,
    user,
  }: {
    token: string;
    user: any;
  }) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    this.authSuccess({
      token,
      name: user.name,
      avatarUrl: user.avatarUrl,
    });

    return Promise.resolve();
  }

  @Action
  public async removeAuthCredentials() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    this.clearAuth();

    return Promise.resolve();
  }

  @Action
  public async validateUserAuth() {
    // Check to make sure the current authentication is
    // valid. Should only use client-side checks and remove
    // local auth information if errors exist.

    // TODO: Check JWT expiration time.
    if (this.userToken === null) {
      this.clearAuth();
      return Promise.reject(new Error("Auth token does not exist"));
    }

    return Promise.resolve();
  }
}

export default getModule(UiModule);
