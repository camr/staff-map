import { Doc, add, all, collection } from "typesaurus";
import {
  Action,
  Module,
  VuexModule,
  getModule,
  Mutation,
} from "vuex-module-decorators";

import store from "@/store";

export class StaffMember {
  public firstName: string = "";
  public lastName: string = "";
}

export interface StaffState {
  staff: StaffMember[];
}

@Module({ dynamic: true, store, name: "staff" })
class StaffModule extends VuexModule implements StaffState {
  private staffCollection = collection<StaffMember>("staff");
  public staff: StaffMember[] = [];

  @Mutation
  private setStaff(staff: StaffMember[]) {
    this.staff = staff;
  }

  @Action
  public addMember(newMember: StaffMember) {
    return add(this.staffCollection, newMember);
  }

  @Action
  public async fetchStaff(): Promise<StaffMember[]> {
    return await all(this.staffCollection)
      .then(r => r.map(d => d.data))
      .then(staff => {
        this.setStaff(staff);
        return staff;
      });
  }
}

export default getModule(StaffModule);
