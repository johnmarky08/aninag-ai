<script>
  import { onMount, onDestroy } from "svelte";
  import * as img from "../imageHandler.js";
  import {
    showFullAnalysis,
    toggleFullAnalysis,
    verificationLevel,
    setupOutsideClick,
  } from "../Utilities.js";
  import { fly, slide } from "svelte/transition";
  import BezierEasing from "bezier-easing";
  import { posX, posY, minimize } from "../Utilities.js";
  import * as data from "../Datas.js";
  import { analysisConfidence } from "../State.js";

  const myEasing = BezierEasing(0.34, 1.4, 0.64, 1);

  let activeDropdown = null;
  let fullAnalysisEl;
  let cleanupOutsideClick;

  onMount(() => {
    cleanupOutsideClick = setupOutsideClick(
      () => fullAnalysisEl,
      () => {
        showFullAnalysis.set(false);
      },
      (event) => {
        const target = event.target instanceof Element ? event.target : null;
        return Boolean(target?.closest("[data-aninag-hover-ui='true']"));
      },
    );
  });

  onDestroy(() => {
    cleanupOutsideClick?.();
  });

  $: headerBgClass =
    $verificationLevel === "Verified"
      ? "bg-[#29A37A]"
      : $verificationLevel === "Flagged"
        ? "bg-[#F5DD0A]"
        : "bg-[#E21D48]";

  $: fullAnalysisBadgeBgClass =
    $verificationLevel === "Verified"
      ? "bg-[#29A37A]/20"
      : $verificationLevel === "Flagged"
        ? "bg-[#F5DD0A]/20"
        : "bg-[#E21D48]/20";

  $: verificationText =
    $verificationLevel === "Verified"
      ? "Verified by multiple official sources. Content aligns with DOH and WHO guidelines"
      : $verificationLevel === "Flagged"
        ? "Why it may be true: Ginger has documented anti-inflammatory properties and can soothe sore throats. Why it may not be true: No clinical evidence that ginger tea cures any virus. WHO warns against unverified remedies."
        : "Completely fabricated";

  $: contentBadgeTitle =
    $verificationLevel === "Verified"
      ? "Verified Content"
      : $verificationLevel === "Flagged"
        ? "Flagged Content"
        : "Warning Content";
</script>

{#if $showFullAnalysis}
  <div
    in:fly={{ x: 500, duration: 500, easing: myEasing }}
    out:fly={{ x: 500, duration: 500, easing: myEasing }}
    class="fixed top-0 right-0 z-[2147483647] w-[min(640px,100vw)] h-screen border-2 border-r-0 rounded-r-none rounded-l-[25px] border-white bg-white shadow overflow-y-scroll overflow-x-hidden scroll-smooth"
    id="FullAnalysis bg-[#F7F8FA]"
    bind:this={fullAnalysisEl}
  >
    <div
      id="Header"
      class="sticky top-0 z-30 flex justify-between p-3 items-center {headerBgClass}"
    >
      <div class="flex gap-2 items-center p-3">
        <img
          src={img.aninagLogo}
          alt="AninagLogo"
          class="h-7 w-7"
          on:error={(event) => {
            const target = event.currentTarget;
            if (target instanceof HTMLImageElement) {
              target.src = img.aninagLogoOff;
            }
          }}
        />
        <div class="text-lg font-semibold text-white">ANINAG Full Analysis</div>
      </div>
      <p class="">
        <span
          id="FullAnalysisContentBadge"
          class="bg-white/50 text-white font-semibold birder rounded-[20px] p-2"
          >{contentBadgeTitle}</span
        >
      </p>
    </div>
    <div id="here" class="space-y-5 py-10 px-12">
      <section class="space-y-2">
        <h2 class="text-lg font-semibold text-[#1F2329]">
          Confidence Breakdown
        </h2>
        <div class="rounded-2xl border border-[#E2E8F0] bg-white p-3">
          <div class="h-2 w-full rounded-full bg-[#DCE8E3]">
            <div
              style="width: {$analysisConfidence}%"
              class="h-2 rounded-full {$analysisConfidence >= 70
                ? 'bg-[#2FA47B]'
                : $analysisConfidence <= 69 && $analysisConfidence >= 40
                  ? 'bg-[#F5DD0A]'
                  : $analysisConfidence <= 39 && $analysisConfidence > 0
                    ? 'bg-[#E21D48]'
                    : 'bg-gray-300/50'} transition-all duration-500 ease-in-out"
            ></div>
          </div>
          <div id="VerificationText" class="mt-2 text-sm text-[#1F2329]">
            {#if $verificationLevel !== "Flagged"}
              <div class="flex items-center gap-2">
                <span
                  class="text-base font-semibold {$verificationLevel ===
                  'Verified'
                    ? 'text-[#29A37A]'
                    : 'text-[#E21D48]'}"
                >
                  {$verificationLevel === "Verified" ? "✓" : "✕"}
                </span>
                <p>{verificationText}</p>
              </div>
            {/if}

            {#if $verificationLevel === "Flagged"}
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div class="space-y-1">
                  <p
                    class="flex items-center gap-2 text-base font-semibold text-[#29A37A]"
                  >
                    <span>✓</span>
                    Why it may be true
                  </p>
                  <p class="pl-6 text-base leading-6 text-[#5C6576]">
                    Ginger has documented anti-inflammatory properties and can
                    soothe sore throats
                  </p>
                </div>

                <div class="space-y-1">
                  <p
                    class="flex items-center gap-2 text-base font-semibold text-[#E21D48]"
                  >
                    <span>✕</span>
                    Why it may not be true
                  </p>
                  <p class="pl-6 text-base leading-6 text-[#5C6576]">
                    No clinical evidence that ginger tea cures any virus. WHO
                    warns against unverified remedies.
                  </p>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </section>

      <section class="rounded-2xl border border-[#E2E8F0] bg-white p-3">
        <div class="flex items-start gap-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_54_1718)">
              <path
                d="M7.99998 14.6667C11.6819 14.6667 14.6666 11.6819 14.6666 8.00004C14.6666 4.31814 11.6819 1.33337 7.99998 1.33337C4.31808 1.33337 1.33331 4.31814 1.33331 8.00004C1.33331 11.6819 4.31808 14.6667 7.99998 14.6667Z"
                stroke="#3380CC"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8 4V8L10.6667 9.33333"
                stroke="#3380CC"
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_54_1718">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>

          <div>
            <h3 class="text-lg font-semibold text-[#1F2329]">
              Narrative Context
            </h3>
            <p class="mt-1 text-sm text-[#6A7181]">
              This narrative is current and officially backed by the Department
              of Health as of March 2026
            </p>
          </div>
        </div>
      </section>

      <section class="space-y-2.5">
        <h2 class="text-lg font-semibold text-[#1F2329]">Trusted Sources</h2>
        <div class="space-y-3 overflow-y-scroll scroll-smooth max-h-64">
          {#each data.trustedSources as { title, news, link, tag }, idx}
            <div
              class="rounded-2xl border border-[#E2E8F0] bg-white p-3 overflow-hidden transition-all duration-300 ease-in {activeDropdown ===
              idx
                ? 'max-h-64 overflow-y-scroll scroll-smooth'
                : 'max-h-[76px]'}"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0 flex-1 space-y-1.5">
                  <div class="min-w-0 flex flex-wrap items-center gap-2">
                    <h3
                      class="min-w-0 max-w-full truncate text-base font-semibold text-[#1F2329]"
                    >
                      {title}
                    </h3>
                    {#each tag as tags}
                      <span
                        class="inline-flex items-center gap-1 rounded-full border border-[#D8DEE8] bg-[#F6F8FB] px-2 py-0.5 text-[10px] text-[#5C6576]"
                      >
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 8 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_54_1746)">
                            <path
                              d="M4.19529 0.861959C4.0703 0.736926 3.90076 0.666664 3.72396 0.666626H1.33329C1.15648 0.666626 0.986912 0.736864 0.861888 0.861888C0.736864 0.986912 0.666626 1.15648 0.666626 1.33329V3.72396C0.666664 3.90076 0.736926 4.0703 0.861959 4.19529L3.76329 7.09663C3.9148 7.24717 4.11971 7.33167 4.33329 7.33167C4.54688 7.33167 4.75179 7.24717 4.90329 7.09663L7.09663 4.90329C7.24717 4.75179 7.33167 4.54688 7.33167 4.33329C7.33167 4.11971 7.24717 3.9148 7.09663 3.76329L4.19529 0.861959Z"
                              stroke="#6A7181"
                              stroke-width="0.666667"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M2.50004 2.66671C2.59209 2.66671 2.66671 2.59209 2.66671 2.50004C2.66671 2.40799 2.59209 2.33337 2.50004 2.33337C2.40799 2.33337 2.33337 2.40799 2.33337 2.50004C2.33337 2.59209 2.40799 2.66671 2.50004 2.66671Z"
                              fill="#6A7181"
                              stroke="#6A7181"
                              stroke-width="0.666667"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_54_1746">
                              <rect width="8" height="8" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>

                        {tags}
                      </span>
                    {/each}
                  </div>
                  {#if activeDropdown === idx}
                    <div
                      transition:slide={{ duration: 260 }}
                      class="space-y-1.5"
                    >
                      <p
                        class="min-w-0 text-sm leading-5 text-[#6A7181] whitespace-normal break-words"
                      >
                        {news}
                      </p>

                      <div class="pt-1">
                        <p class="text-xs font-semibold text-[#1F2329]">
                          Want to check more?
                        </p>

                        <div
                          class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1"
                        >
                          {#each link as source}
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              class="inline-flex items-center gap-1 text-xs text-[#2D86E5] underline underline-offset-2 transition-opacity hover:opacity-80"
                            >
                              {source.label}
                              <svg
                                class="h-3.5 w-3.5"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M14 5H19V10"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M10 14L19 5"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M19 14V19H5V5H10"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </a>
                          {/each}
                        </div>
                      </div>
                    </div>
                  {:else}
                    <p
                      transition:slide={{ duration: 220 }}
                      class="min-w-0 truncate max-w-[440px] whitespace-nowrap text-sm leading-5 text-[#6A7181]"
                    >
                      {news}
                    </p>
                  {/if}
                </div>
                <button
                  on:click={() =>
                    (activeDropdown = activeDropdown === idx ? null : idx)}
                  class="mt-1 shrink-0 self-start rounded-md p-1 text-[#6B7382] transition-colors hover:bg-[#EEF2F6]"
                  aria-label="Expand WHO source"
                >
                  <svg
                    class="h-4 w-4 transition-transform duration-300 {activeDropdown ===
                    idx
                      ? 'rotate-180'
                      : ''}"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          {/each}
        </div>
      </section>

      <section class="rounded-2xl border border-[#F3D8B0] bg-[#FEFCF8] p-3">
        <div class="flex items-start gap-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 9.33325C10.1333 8.66659 10.4667 8.19992 11 7.66659C11.6667 7.06659 12 6.19992 12 5.33325C12 4.27239 11.5786 3.25497 10.8284 2.50482C10.0783 1.75468 9.06087 1.33325 8 1.33325C6.93913 1.33325 5.92172 1.75468 5.17157 2.50482C4.42143 3.25497 4 4.27239 4 5.33325C4 5.99992 4.13333 6.79992 5 7.66659C5.46667 8.13325 5.86667 8.66659 6 9.33325"
              stroke="#F59F0A"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6 12H10"
              stroke="#F59F0A"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6.66669 14.6667H9.33335"
              stroke="#F59F0A"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <div>
            <h3 class="text-xs font-semibold text-[#1F2329]">Did you know?</h3>
            <p class="mt-1 text-xs text-[#6A7181]">
              Tip: Always verify the date of official announcements to ensure
              they are current
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
{/if}
