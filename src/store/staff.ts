import Vue from "vue";
import {
  Action,
  Module,
  VuexModule,
  getModule,
  Mutation,
} from "vuex-module-decorators";

import { Md5 } from "ts-md5";
import {
  Doc,
  add,
  all,
  collection,
  remove,
  subcollection,
  update,
} from "typesaurus";

import store from "@/store";
import UiStore, { Org } from "@/store/ui";

import { StaffMember } from "@/types/staff";

export { StaffMember } from "@/types/staff";

export interface StaffState {
  staff: StaffMember[];
}

// Collection objects initialized outside of class because
// of issues overloading `constructor`s with VuexModule.
const orgCollection = collection<Org>("orgs");
const staffCollection = subcollection<StaffMember, Org>("staff", orgCollection);

@Module({ dynamic: true, store, name: "staff" })
class StaffModule extends VuexModule implements StaffState {
  public staff: StaffMember[] = [];

  @Mutation
  private setStaff(staff: StaffMember[]) {
    this.staff = staff;
  }

  @Mutation
  private setStaffMember(member: StaffMember) {
    for (let i = 0; i < this.staff.length; i++) {
      if (this.staff[i].id === member.id) {
        Vue.set(this.staff, i, member);
        return;
      }
    }

    this.staff.push(member);
  }

  @Mutation
  private removeStaffMember(member: StaffMember) {
    let idx = -1;
    for (let i = 0; i < this.staff.length; i++) {
      if (this.staff[i].id === member.id) {
        idx = i;
        break;
      }
    }

    if (idx >= 0) {
      this.staff.splice(idx, 1);
    }
  }

  @Action
  public async addMember(newMember: StaffMember): Promise<StaffMember> {
    const org = UiStore.currentOrg;
    if (!org) {
      return Promise.reject(
        "User must be associated with an org to create staff"
      );
    }

    const orgStaff = staffCollection(org.id);
    return add(orgStaff, newMember).then((staff: Doc<StaffMember>) => {
      const member = {
        ...staff.data,
        id: staff.ref.id,
        avatarUrl: `https://www.gravatar.com/avatar/${Md5.hashStr(
          staff.data.email || ""
        )}?r=pg&d=retro`,
      };

      this.setStaffMember(member);
      return member;
    });
  }

  @Action
  public async updateMember(member: StaffMember): Promise<StaffMember> {
    const org = UiStore.currentOrg;
    if (!org) {
      return Promise.reject(
        "User must be associated with an org to update staff"
      );
    }

    if (!member.id) {
      return Promise.reject("Cannot update a member without a valid ID");
    }

    const orgStaff = staffCollection(org.id);
    return update(orgStaff, member.id, member).then(() => {
      this.setStaffMember({
        ...member,
        avatarUrl: `https://www.gravatar.com/avatar/${Md5.hashStr(
          member.email || ""
        )}?r=pg&d=retro`,
      });
      return member;
    });
  }

  @Action
  public async removeMember(member: StaffMember): Promise<void> {
    const org = UiStore.currentOrg;
    if (!org) {
      return Promise.reject(
        "User must be associated with an org to update staff"
      );
    }

    if (!member.id) {
      return Promise.reject("Cannot delete a member without a valid ID");
    }

    const orgStaff = staffCollection(org.id);
    return remove(orgStaff, member.id).then(() => {
      this.removeStaffMember(member);
    });
  }

  @Action
  public async fetchStaff(): Promise<StaffMember[]> {
    const org = UiStore.currentOrg;
    if (!org) {
      return Promise.reject(
        "User must be associated with an org to fetch staff list"
      );
    }

    const orgStaff = staffCollection(org.id);
    return all(orgStaff)
      .then(r => r.map(d => ({ ...d.data, id: d.ref.id })))
      .then((staff: StaffMember[]) =>
        staff.map(s => ({
          ...s,
          avatarUrl: `https://www.gravatar.com/avatar/${Md5.hashStr(
            s.email || ""
          )}?r=pg&d=retro`,
        }))
      )
      .then((staff: StaffMember[]) => {
        this.setStaff(staff);
        return staff;
      });
  }
}

export default getModule(StaffModule);
