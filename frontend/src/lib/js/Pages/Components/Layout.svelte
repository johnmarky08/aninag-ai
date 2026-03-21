<script>
  import Header from "./Header.svelte";
  import * as img from "../../imageHandler.js";
  import { onState } from "../../State.js";
  import {
    clickPanel,
    consumeSuppressedClick,
    dragging,
    minimize,
    startDrag,
  } from "../../Utilities.js";
</script>

<div class="relative w-[24rem] max-w-[calc(100vw-24px)]">
  <div
    class="origin-top-left transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] {$minimize
      ? 'absolute top-0 left-0 w-full opacity-0 scale-95 -translate-x-8 pointer-events-none'
      : 'relative w-full opacity-100 scale-100 translate-x-0 pointer-events-auto'}"
  >
    <div class="shadow rounded-[15px]">
      <Header />
      <main
        class="py-5 px-6 z-[9999] border-2 bg-white rounded-[15px]
         rounded-t-none border-[#E5E7EB]"
      >
        <slot />
      </main>
    </div>
  </div>

  <button
    type="button"
    aria-label="Expand ANINAG panel"
    on:mousedown={startDrag}
    on:click={() => {
      if (consumeSuppressedClick()) return;
      clickPanel();
    }}
    class="group h-16 w-16 overflow-hidden rounded-full border border-white/70 bg-[#19454C] p-0 shadow-[0_12px_28px_rgba(15,23,42,0.32)] origin-top-left transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 select-none {$dragging
      ? 'cursor-grabbing'
      : 'cursor-grab'} {$minimize
      ? 'relative opacity-100 scale-100 translate-x-0 pointer-events-auto'
      : 'absolute top-0 left-0 opacity-0 scale-75 translate-x-8 pointer-events-none'}"
  >
    <span
      class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
    ></span>
    <img
      src={$onState ? img.aninagLogo : img.aninagLogoOff}
      alt="ANINAG"
      class="relative z-10 mx-auto h-10 w-10"
      on:error={(event) => {
        const target = event.currentTarget;
        if (target instanceof HTMLImageElement) {
          target.src = img.aninagLogoOff;
        }
      }}
    />
  </button>
</div>
