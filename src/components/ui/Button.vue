<template>
  <button
    class="
      border border-solid
      py-2 px-4
      font-bold
      text-sm text-white
      rounded
      outline-none
      uppercase
      tracking-wide
      select-none"
    type="button"
    :disabled="disabled"
    @click="click"
  >
    <slot v-if="debouncing" name="debounced">Went</slot>
    <slot v-else name="default">Go</slot>
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Button extends Vue {
  @Prop({ default: false })
  public readonly disabled!: boolean;

  @Prop({ default: 0 })
  public readonly debounce!: number;

  private lastClick = 0;
  private debouncing: boolean = false;

  private click(evt: MouseEvent) {
    const n = Date.now();
    if (n - this.lastClick >= this.debounce) {
      this.$emit("click", evt);
      this.lastClick = n;
    }

    if (this.debounce > 0 && !this.debouncing) {
      window.setTimeout(() => {
        this.debouncing = false;
      }, this.debounce - (n - this.lastClick));
    }
  }
}
</script>

<style lang="postcss" scoped>
button {
  @apply bg-pink-500 border-pink-700 text-gray-100 cursor-pointer;

  transition: all 250ms;
}

button:hover {
  @apply bg-pink-600 border-pink-800 text-gray-200;
}

button:focus {
  @apply outline-none;
}

button.secondary {
  @apply bg-blue-400 border-blue-500;
}

button.secondary:hover {
  @apply bg-blue-500 border-blue-600;
}

button.danger {
  @apply bg-transparent border-red-800 text-red-900;
}

button.danger:hover {
  @apply bg-red-300;
}

button:disabled {
  @apply bg-gray-300 border-gray-400 text-gray-700 cursor-default;
}
</style>
