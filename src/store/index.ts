import Vue from "vue";
import Vuex from "vuex";

import { StaffState } from "./staff";
import { UiState } from "./ui";

Vue.use(Vuex);

export interface RootState {
  staff: StaffState;
  ui: UiState;
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<RootState>({});
