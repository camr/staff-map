import Vue from "vue";
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";

import store from "@/store";
import StaffStore from "@/store/staff";

export class Org {
  public id: string = "";
  public name: string = "";
  public managers: string[] = [];
}

export interface UiState {
  userName: string;
  userOrg: Org | null;
  userToken: string | null;
}

@Module({ dynamic: true, store, name: "ui" })
class UiModule extends VuexModule implements UiState {
  public userOrg: Org | null = null;
  public userName: string = "";
  public userToken: string | null = null;

  public get isUserLoggedIn(): boolean {
    return this.userToken !== null;
  }

  public get currentOrg(): Org | null {
    return this.userOrg;
  }

  @Mutation
  public setUserOrg(org: Org) {
    this.userOrg = org;
  }

  @Mutation
  public authSuccess({ token, name }: { token: string; name: string }) {
    this.userToken = token;
    this.userName = name;
  }

  @Mutation
  public clearAuth() {
    this.userToken = null;
    this.userName = "";
    this.userOrg = null;
  }

  @Action
  public async setCurrentOrg(org: Org) {
    this.setUserOrg(org);

    try {
      await StaffStore.fetchStaff();
    } catch (err) {
      console.error(err);
    }
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
