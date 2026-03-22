<script>
  import { onDestroy } from "svelte";
  import Layout from "./Components/Layout.svelte";
  import * as img from "../imageHandler.js";
  import { onState } from "../State.js";
  import { show } from "../State.js";
  import { claimsCheckedToday } from "../State.js";

  let showToggleTimeout;

  function handleRealtimeToggle() {
    const nextOnState = !$onState;
    $onState = nextOnState;

    clearTimeout(showToggleTimeout);
    showToggleTimeout = setTimeout(() => {
      // Keep the text panel visibility aligned with the final toggle state.
      $show = nextOnState;
    }, 300);
  }

  onDestroy(() => {
    clearTimeout(showToggleTimeout);
  });
</script>

<Layout>
  <div class="">
    <!-- container div -->
    <div
      class="space-y-5 {$onState
        ? 'h-[405px]'
        : 'h-[260px]'} transition-all duration-300 ease-in overflow-hidden"
    >
      <div
        class="flex gap-2 items-center border
         rounded-[10px] p-2
         {$onState
          ? ' bg-[#29A37A]/10 border-[#29A37A]'
          : 'bg-[#F3F4F6] border-[#F3F4F6]'} transition-all duration-300 ease-in"
      >
        <img
          src={$onState ? img.sheild : img.shellShield}
          alt={$onState ? "Active" : "Paused"}
        />
        <p class="text-md {$onState ? 'text-[#29A37A]' : 'text-[#6A7181]'}">
          {$onState ? "Active: Scanning Fee" : "Paused: Not Scanning"}
        </p>
      </div>

      <div class="flex font-medium justify-between items-center">
        <p>Real Time Detection</p>
        <button
          aria-label="Button"
          onclick={handleRealtimeToggle}
          class="flex rounded-full w-12 h-7 bg-[#29A37A] items-center justify-start px-0.5 transition-all duration-300 ease-in {$onState
            ? ' bg-[#29A37A] '
            : ' bg-gray-300 '} "
        >
          <div
            class="rounded-full w-6 h-6 bg-white
          {$onState ? ' translate-x-5 ' : ' translate-x-0 '}
           transition-all duration-300 ease-in
          "
          ></div>
        </button>
      </div>
      <div
        class=" bg-[#F3F4F6] p-3 rounded-[10px]
        {$onState
          ? 'bg-[#F3F4F6]'
          : 'bg-transparent'} transition-all duration-300 ease-in"
      >
        <div
          class="flex flex-col place-items-center {$onState
            ? 'opacity-100'
            : 'opacity-0'}
             {$show ? 'block' : 'hidden'} transition-all duration-300 ease-in"
        >
          <p class="text-3xl font-bold">{$claimsCheckedToday}</p>
          <p class="text-sm text-black/60">Claims Checked Today</p>
        </div>
        <p
          class="text-center text-lg text-black/60
        {$onState ? 'opacity-0' : 'opacity-100'}
         {$show ? 'hidden' : 'block'} transition-all duration-300 ease-in"
        >
          Turn on to protect your feed from misinformation.
        </p>
      </div>
      <div
        class="text-xs space-y-2 text-black/50 {$onState
          ? 'opacity-100'
          : 'opacity-0'} transition-all duration-300 ease-in"
      >
        <div class="flex gap-2 items-center">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <clip-path clip-path="url(#clip0_54_1580)">
              <path
                d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z"
                stroke="#6A7181"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6 8V6"
                stroke="#6A7181"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6 4H6.005"
                stroke="#6A7181"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </clip-path>
            <defs>
              <clipPath id="clip0_54_1580">
                <rect width="12" height="12" fill="white" />
              </clipPath>
            </defs>
          </svg>

          <p class="font-semibold">Extension Info</p>
        </div>
        <p>
          ANINAG AI scans your social media feed in real-time an flags
          potentially misleading posts.
        </p>
        <div class="flex gap-2 items-center">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_54_1580)">
              <path
                d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z"
                stroke="#6A7181"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6 8V6"
                stroke="#6A7181"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6 4H6.005"
                stroke="#6A7181"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_54_1580">
                <rect width="12" height="12" fill="white" />
              </clipPath>
            </defs>
          </svg>

          <p class="font-semibold">Developer Info</p>
        </div>
        <p>AREA 68 (++/--) — LSPU-SPCC · v1.0.0</p>
        <p>InterCICSkwela v2.0 - Batang Techno Hackathon Challenge</p>
      </div>
      <button
        class="group flex items-center rounded-[10px] border border-[#19454C] bg-[#19454C]
         text-white text-md font-medium gap-2 p-3 justify-center cursor-pointer w-full
         hover:bg-[#25616B] hover:border-[#25616B] active:bg-[#12343A] active:border-[#12343A]
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#29A37A]/50
         {$onState
          ? '-translate-y-0'
          : '-translate-y-[135px]'} transition-all duration-300 ease-in"
        onclick={() => alert("Coming Soon!")}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.625 1.875H2.5C2.15482 1.875 1.875 2.15482 1.875 2.5V6.875C1.875 7.22018 2.15482 7.5 2.5 7.5H5.625C5.97018 7.5 6.25 7.22018 6.25 6.875V2.5C6.25 2.15482 5.97018 1.875 5.625 1.875Z"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12.5 1.875H9.375C9.02982 1.875 8.75 2.15482 8.75 2.5V4.375C8.75 4.72018 9.02982 5 9.375 5H12.5C12.8452 5 13.125 4.72018 13.125 4.375V2.5C13.125 2.15482 12.8452 1.875 12.5 1.875Z"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12.5 7.5H9.375C9.02982 7.5 8.75 7.77982 8.75 8.125V12.5C8.75 12.8452 9.02982 13.125 9.375 13.125H12.5C12.8452 13.125 13.125 12.8452 13.125 12.5V8.125C13.125 7.77982 12.8452 7.5 12.5 7.5Z"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M5.625 10H2.5C2.15482 10 1.875 10.2798 1.875 10.625V12.5C1.875 12.8452 2.15482 13.125 2.5 13.125H5.625C5.97018 13.125 6.25 12.8452 6.25 12.5V10.625C6.25 10.2798 5.97018 10 5.625 10Z"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <p>Open Dashboard</p>

        <svg
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.125 1.625H11.375V4.875"
            stroke="currentColor"
            stroke-width="1.08333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M5.41675 7.58333L11.3751 1.625"
            stroke="currentColor"
            stroke-width="1.08333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9.75 7.04167V10.2917C9.75 10.579 9.63586 10.8545 9.4327 11.0577C9.22953 11.2609 8.95398 11.375 8.66667 11.375H2.70833C2.42102 11.375 2.14547 11.2609 1.9423 11.0577C1.73914 10.8545 1.625 10.579 1.625 10.2917V4.33333C1.625 4.04602 1.73914 3.77047 1.9423 3.5673C2.14547 3.36414 2.42102 3.25 2.70833 3.25H5.95833"
            stroke="currentColor"
            stroke-width="1.08333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</Layout>
