<script>
  import Counter from "./lib/Counter.svelte";

  // Draggable logic
  let posX = 20;
  let posY = 20;
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  function startDrag(event) {
    dragging = true;
    offsetX = event.clientX - posX;
    offsetY = event.clientY - posY;
  }

  function drag(event) {
    if (dragging) {
      posX = event.clientX - offsetX;
      posY = event.clientY - offsetY;
    }
  }

  function stopDrag() {
    dragging = false;
  }

  // Keyboard support for draggable header
  function handleKeydown(event) {
    if (event.key === "Enter" || event.key === " ") {
      startDrag(event);
    }
  }

  // Close panel
  let visible = true;
  function closePanel() {
    visible = false;
  }
</script>

{#if visible}
  <div
    role="dialog"
    tabindex="0"
    class="fixed z-[999999] w-80 bg-white border-2 border-indigo-600 rounded-lg shadow-lg"
    style="top:{posY}px; left:{posX}px"
    on:mousemove={drag}
    on:mouseup={stopDrag}
    on:mouseleave={stopDrag}
  >
    <!-- Header for dragging + close button -->
    <div
      role="button"
      tabindex="0"
      class="flex justify-between items-center bg-indigo-600 text-white font-bold px-3 py-2 rounded-t-lg cursor-grab select-none"
      on:mousedown={startDrag}
      on:keydown={handleKeydown}
    >
      <span>ANINAG AI (Test)</span>
      <!-- Close button -->
      <button
        tabindex="0"
        class="text-white font-bold ml-2 px-2 py-1 hover:bg-indigo-700 rounded transition"
        aria-label="Close Panel"
        on:click={closePanel}
      >
        ✕
      </button>
    </div>

    <!-- Body -->
    <div class="p-4 space-y-4">
      <pre class="text-gray-700">Hello! This is a floating panel for testing.
          ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢎⠱⠊⡱⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡠⠤⠒⠒⠒⠒⠤⢄⣑⠁⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⡤⠒⠝⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠲⢄⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⡴⠋⠀⠀⠀⠀⣀⠀⠀⠀⠀⠀⠀⢰⣢⠐⡄⠀⠉⠑⠒⠒⠒⣄
⠀⠀⠀⣀⠴⠋⠀⠀⠀⡎⠀⠘⠿⠀⠀⢠⣀⢄⡢⠉⣔⣲⢸⠀⠀⠀⠀⠀⠀⢘
⡠⠒⠉⠀⠀⠀⠀⠀⡰⢅⠫⠭⠝⠀⠀⠀⠀⠀⠀⢀⣀⣤⡋⠙⠢⢄⣀⣀⡠⠊
⢇⠀⠀⠀⠀⠀⢀⠜⠁⠀⠉⡕⠒⠒⠒⠒⠒⠛⠉⠹⡄⣀⠘⡄⠀⠀⠀⠀⠀⠀
⠀⠑⠂⠤⠔⠒⠁⠀⠀⡎⠱⡃⠀⠀⡄⠀⠄⠀⠀⠠⠟⠉⡷⠁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⠤⠤⠴⣄⡸⠤⣄⠴⠤⠴⠄⠼⠀⠀⠀⠀⠀⠀⠀⠀
      </pre>

      <!-- Counter component -->
      <Counter />

      <!-- Test Button -->
      <button
        role="dialog"
        tabindex="0"
        class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        on:click={() => alert("Button clicked!")}
      >
        Click Me
      </button>
    </div>
  </div>
{/if}
