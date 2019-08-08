import { Action, getModule, Module, VuexModule } from "vuex-module-decorators";

import store from "@/store";

export class StaffMember {
  public name: string = "";
}

export interface StaffState {
  staff: StaffMember[];
}

@Module({ dynamic: true, store, name: "staff" })
class StaffModule extends VuexModule implements StaffState {
  public staff: StaffMember[] = [];

  @Action
  public addMember(newMember: StaffMember) {
    this.staff.push(newMember);
  }
}

export default getModule(StaffModule);
