<script>
  import * as img from "../../imageHandler.js";
  import { onState } from "../../State.js";
  import { minimize } from "../../Utilities.js";
</script>

<div
  class="flex p-5 {$onState ? 'bg-[#19454C]' : 'bg-[#6A7181]/80'} rounded-[15px]
  rounded-b-none text-white items-center gap-4 transition-all duration-300 ease-in"
>
  <div>
    <img
      src={$onState ? img.aninagLogo : img.aninagLogoOff}
      alt="AninagLogo"
      on:error={(event) => {
        const target = event.currentTarget;
        if (target instanceof HTMLImageElement) {
          target.src = img.aninagLogoOff;
        }
      }}
      class="transition-all duration-300 ease-in-out"
    />
  </div>
  <div>
    <div class="flex justify-between items-center">
      <p class="text-lg font-bold">ANINAG</p>
      <button on:click={() => ($minimize = !$minimize)} aria-label="Minimize">
        <svg
          class="cursor-pointer"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="6" y1="12" x2="18" y2="12" />
        </svg>
      </button>
    </div>
    <i>
      <p class="text-sm font-thin text-white/70">
        Real-Time Social Media Misinformation Detection
      </p>
    </i>
  </div>
</div>
