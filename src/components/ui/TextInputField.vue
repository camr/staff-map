<template>
  <div class="text-input" :class="{ error }">
    <label
      class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
      :class="{ 'text-red-700': error }"
      :for="inputId"
    >
      {{ label }}
    </label>

    <input
      :id="inputId"
      :type="type"
      :autocomplete="autocomplete"
      :value="value"
      :required="required"
      :placeholder="placeholder"
      @input="$emit('input', $event.target.value)"
      @focus="showErrors = false"
      @blur="showErrors = true"
      class="
        appearance-none block w-full
        bg-gray-200 text-gray-700
        border border-solid border-gray-200
        rounded py-3 px-4
        leading-tight
        focus:outline-none focus:bg-white
        focus:border-gray-300
        "
      :class="{ 'border-red-300': error }"
    />

    <p class="text-red-500 text-xs italic">
      <span v-if="error">{{ errors[0] }}</span>
      <span v-else>&nbsp;</span>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";

type FormRule = (val: any) => boolean | string;
type FormRules = { [key: string]: FormRule[] };

@Component
export default class TextInputField extends Vue {
  @Prop({ default: null })
  public readonly id!: string | null;

  @Prop({ default: "Text" })
  public readonly label!: string;

  @Prop({ default: "text" })
  public readonly type!: string;

  @Prop({ default: "" })
  public readonly autocomplete!: string;

  @Prop({ default: "" })
  public readonly placeholder!: string;

  @Prop()
  public readonly value!: string;

  @Prop({ default: false })
  public readonly required!: boolean;

  @Prop({ default: Array })
  public readonly rules!: FormRule[];

  private showErrors: boolean = false;

  private get inputId() {
    return this.id || `input-${Math.floor(Math.random() * 10000)}`;
  }

  private get errors(): string[] {
    return this.rules
      .map(r => r(this.value))
      .filter((x): x is string => typeof x === "string");
  }

  private get error(): boolean {
    return this.showErrors && this.errors.length > 0;
  }
}
</script>

<style lang="postcss" scoped>
.text-input {
  &.error {
    .label {
      @apply text-red-500;
    }
  }
}
</style>
