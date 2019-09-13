<template>
  <svg
    class="inline-block"
    :class="className"
    xmlns="http://www.w3.org/2000/svg"
    v-on="$listeners"
  >
    <title v-if="title">{{ title }}</title>
    <use :xlink:href="iconPath" xmlns:xlink="http://www.w3.org/1999/xlink" />
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class SVGIcon extends Vue {
  @Prop()
  public name!: string;

  @Prop({ default: null })
  public title!: string | null;

  get iconPath() {
    return `/img/zondicons.svg#${this.name}`;
  }

  get className() {
    return `svg-icon svg-icon--${this.name}`;
  }
}
</script>

<style>
.svg-icon {
  fill: currentColor;
  height: 24px;
  width: 24px;
}
</style>
