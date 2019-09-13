<template>
  <li
    class="member p-2 bg-white hover:bg-gray-200 cursor-pointer"
    :class="{ isSelected }"
    @click.prevent.stop="select"
  >
    <div class="flex items-center justify-between">
      <div class="w-1/3 flex items-center">
        <img
          class="avatar rounded-full h-12 w-12 mr-4"
          :src="member.avatarUrl"
        />

        <div>
          <div class="font-bold">
            {{ member.firstName || "First" }} {{ member.lastName || "Last" }}
          </div>
          <div class="text-sm text-gray-600">
            {{ member.displayLocation || "Earth" }}
          </div>
        </div>
      </div>

      <transition name="fade">
        <div
          v-show="updatedTimerId >= 0"
          class="w-1/3 flex items-center justify-center"
        >
          <SVGIcon name="checkmark-outline" class="w-5 text-green-600 mr-2" />
          <span class="uppercase font-bold text-lg text-green-600">Saved!</span>
        </div>
      </transition>

      <div class="w-1/3 flex justify-end">
        <SVGIcon
          name="chevron-up"
          class="collapse text-gray-800"
          :class="isSelected ? 'rotate-180' : 'rotate-0'"
        />
      </div>
    </div>

    <div class="member-editor-wrapper" :class="{ show: isSelected }">
      <div class="member-editor w-full">
        <UpdateStaffEntryForm
          v-model="editableMember"
          @cancel="cancelUpdate"
          @update="updateMember"
          @remove="removeMember"
        />
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import StaffStore, { StaffMember } from "@/store/staff";

import SVGIcon from "@/components/ui/SVGIcon.vue";
import UpdateStaffEntryForm from "@/components/UpdateStaffEntryForm.vue";

@Component({
  components: { SVGIcon, UpdateStaffEntryForm },
  model: {
    prop: "selected",
    event: "select",
  },
})
export default class StaffListEntry extends Vue {
  @Prop()
  public readonly member!: StaffMember;

  @Prop({ default: null })
  public readonly selected!: StaffMember | null;

  private edited: boolean = false;
  private editableMember: StaffMember = new StaffMember();

  private updatedTimerId: number = -1;

  private lastClick: number = 0;

  private get isSelected() {
    return this.selected && this.member.id === this.selected.id;
  }

  private select() {
    const now = Date.now();
    if (now - this.lastClick < 300) {
      return;
    }
    this.lastClick = now;

    if (!this.selected || this.selected.id !== this.member.id) {
      if (!this.edited) {
        this.editableMember = new StaffMember(this.member);
        this.edited = true;
      }

      this.$emit("select", this.member);
    } else if (this.selected && this.selected.id === this.member.id) {
      this.$emit("select", null);
    }
  }

  private cancelUpdate() {
    this.editableMember = new StaffMember(this.member);
    this.$emit("select", null);
  }

  private updateMember() {
    StaffStore.updateMember(this.editableMember).then(() => {
      let timerId = -1;

      this.updatedTimerId = window.setTimeout(() => {
        if (this.updatedTimerId === timerId) {
          this.updatedTimerId = -1;
        }
      }, 5000);
      timerId = this.updatedTimerId;
    });
  }

  private removeMember() {
    StaffStore.removeMember(this.member);
  }
}
</script>

<style lang="postcss" scoped>
.member {
  overflow: hidden;
  transition: background-color 250ms, height 2s;

  &.isSelected {
    @apply bg-gray-200;
  }

  .collapse {
    transition: transform 250ms;
  }

  .member-editor-wrapper {
    display: flex;
    overflow: hidden;

    &:after {
      content: "";
      height: 0;
      transition: height 0.3s linear;
      max-height: 50px;
    }

    .member-editor {
      margin-bottom: -2000px;
      transition: margin-bottom 0.3s cubic-bezier(1, 0, 1, 1),
        visibility 0s 0.3s, max-height 0s 0.3s;
      visibility: hidden;
      max-height: 0;
    }

    &.show {
      &:after {
        height: 50px;
        transition: height 0.3s linear, max-height 0s 0.3s linear;
        max-height: 0px;
      }

      .member-editor {
        transition: margin-bottom 0.3s cubic-bezier(0, 0, 0, 1);
        margin-bottom: 0;
        max-height: 1000000px;
        visibility: visible;
      }
    }
  }
}

.fade-enter-to,
.fade-leave {
  opacity: 1;
  transition: opacity 500ms;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transition: opacity 500ms;
}
</style>
