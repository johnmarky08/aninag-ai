<script>
  export let embedded = false;
  export let postId = "";
  export let postText = "";

  import * as util from "./lib/js/Utilities.js";
  import { posX, posY, minimize } from "./lib/js/Utilities.js";
  import Main from "./lib/js/Pages/MainPopUp.svelte";
  import BadgeHover from "./lib/js/Pages/BadgeHover.svelte";
  import FullAnalysis from "./lib/js/Pages/FullAnalysis.svelte";
</script>

{#if embedded}
  <div class="flex justify-end w-full overflow-visible">
    <BadgeHover embedded={true} {postId} {postText} />
  </div>
{:else}
  <div
    class="aninag-panel-shell"
    role="dialog"
    tabindex="0"
    aria-label="ANINAG floating panel"
    style={`left: ${$posX}px; top: ${$posY}px;`}
    on:mousemove={util.drag}
    on:mouseup={util.stopDrag}
  >
    <div
      class="aninag-panel-drag-handle"
      role="button"
      aria-label="Drag ANINAG panel"
      tabindex="0"
      on:mousedown={util.startDrag}
      on:keydown={util.handleKeydown}
    >
      <!-- Drag handle + content wrapper -->
      <Main />
    </div>
  </div>
  <BadgeHover />
  <FullAnalysis />
{/if}
