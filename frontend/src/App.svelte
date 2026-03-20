<script>
  import * as util from "./lib/js/Utilities.js";
  import { posX, posY, minimize } from "./lib/js/Utilities.js";
  import Main from "./lib/js/Pages/MainPopUp.svelte";
</script>

<div
  class="aninag-panel-shell"
  role="dialog"
  tabindex="0"
  aria-label="ANINAG floating panel"
  style={`left: ${$posX}px; top: ${$posY}px;`}
  on:mousemove={util.drag}
  on:mouseup={util.stopDrag}
  on:mouseleave={util.stopDrag}
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
