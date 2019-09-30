<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { VNode } from "vue";

@Component
export default class RenderNode extends Vue {
  @Prop()
  public node!: VNode;

  public render() {
    return this.node ? this.node : "";
  }
}
</script>
