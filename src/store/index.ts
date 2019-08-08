import Vue from "vue";
import Vuex from "vuex";

import { UIState } from "./ui";

Vue.use(Vuex);

export interface RootState {
  ui: UIState;
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<RootState>({});
