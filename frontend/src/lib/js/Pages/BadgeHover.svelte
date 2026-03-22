<script>
  import { onDestroy } from "svelte";
  import * as img from "../imageHandler.js";
  import { openFullAnalysis } from "../Utilities.js";
  import { onState } from "../State.js";

  export let verificationLevel = "Unknown";
  export let analysisConfidence = 0;

  let showBadge = false;
  let showBadgeTimeout;
  let isXPlatform = false;

  // Detect if we're on X/Twitter
  if (typeof window !== "undefined") {
    isXPlatform =
      window.location.hostname.includes("twitter.com") ||
      window.location.hostname.includes("x.com");
  }

  $: {
    clearTimeout(showBadgeTimeout);

    showBadgeTimeout = setTimeout(() => {
      showBadge = $onState;
    }, 300);
  }

  onDestroy(() => {
    clearTimeout(showBadgeTimeout);
  });

  $: normalizedLevel = ["Verified", "Flagged", "Warning", "Unknown"].includes(
    verificationLevel,
  )
    ? verificationLevel
    : "Unknown";

  $: normalizedConfidence =
    typeof analysisConfidence === "number" && analysisConfidence >= 0
      ? Math.min(100, Math.round(analysisConfidence))
      : 0;

  $: badgeBgClass =
    normalizedLevel === "Verified"
      ? "bg-[#29A37A]"
      : normalizedLevel === "Flagged"
        ? "bg-[#F5DD0A]"
        : normalizedLevel === "Warning"
          ? "bg-[#E21D48]"
          : "bg-[#9CA3AF]";

  $: badgeTextColorClass =
    normalizedLevel === "Flagged" || normalizedLevel === "Unknown"
      ? "text-[#1F2329]"
      : "text-white";

  $: accentTextClass =
    normalizedLevel === "Verified"
      ? "text-[#29A37A]"
      : normalizedLevel === "Flagged"
        ? "text-[#F5DD0A]"
        : normalizedLevel === "Warning"
          ? "text-[#E21D48]"
          : "text-[#4B5563]";

  $: accentBorderClass =
    normalizedLevel === "Verified"
      ? "border-[#29A37A]"
      : normalizedLevel === "Flagged"
        ? "border-[#F5DD0A]"
        : normalizedLevel === "Warning"
          ? "border-[#E21D48]"
          : "border-[#9CA3AF]";

  $: contentBgClass =
    normalizedLevel === "Verified"
      ? "bg-[#EAF8F2]"
      : normalizedLevel === "Flagged"
        ? "bg-[#FFF7D6]"
        : normalizedLevel === "Warning"
          ? "bg-[#FDECEF]"
          : "bg-[#F3F4F6]";

  $: contentBorderClass =
    normalizedLevel === "Verified"
      ? "border-[#BEE9D7]"
      : normalizedLevel === "Flagged"
        ? "border-[#F1DA83]"
        : normalizedLevel === "Warning"
          ? "border-[#F5B7C5]"
          : "border-[#D1D5DB]";

  $: badgeText =
    normalizedLevel === "Verified"
      ? "Verified"
      : normalizedLevel === "Flagged"
        ? "Flagged"
        : normalizedLevel === "Warning"
          ? "Warning"
          : "Unknown";

  $: contentBadgeText =
    normalizedLevel === "Verified"
      ? "Matches official Department of Health statements and current public health advisories"
      : normalizedLevel === "Flagged"
        ? "Conflicts with standard medical consensus, but contains partial truths about ginger's soothing properties"
        : normalizedLevel === "Warning"
          ? "Debunked by COMELEC and major news networks. No official cancellation has been announced"
          : "Analyzing Post...";

  $: ctaHoverClass =
    normalizedLevel === "Verified"
      ? "hover:bg-[#29A37A] hover:text-white"
      : normalizedLevel === "Flagged"
        ? "hover:bg-[#F5DD0A] hover:text-[#1F2329]"
        : normalizedLevel === "Warning"
          ? "hover:bg-[#E21D48] hover:text-white"
          : "";

  $: canOpenFullAnalysis = normalizedLevel !== "Unknown";

  $: confidenceDisplay =
    normalizedLevel === "Unknown" ? "--" : `${normalizedConfidence}%`;

  $: badgeIcon =
    normalizedLevel === "Verified"
      ? img.whiteShield
      : normalizedLevel === "Unknown"
        ? img.shellShield
        : img.whiteShield;

  $: contentIcon =
    normalizedLevel === "Verified"
      ? img.sheild
      : normalizedLevel === "Flagged"
        ? img.warningYellow
        : normalizedLevel === "Warning"
          ? img.warningRed
          : img.shellShield;
</script>

{#if showBadge}
  <div data-aninag-hover-ui="true" class="relative z-[2147483647]">
    <div class="group relative flex">
      <span
        id="Badge"
        class="cursor-pointer flex gap-1 w-28 text-sm font-bold rounded-[30px] py-1 px-6 justify-center items-center {badgeBgClass} {badgeTextColorClass}"
      >
        <img src={badgeIcon} alt="" />
        {badgeText}
      </span>

      <div
        id="contentBg"
        class="z-[2147483647] cursor-default opacity-0 invisible group-hover:visible group-hover:opacity-100 rounded-[10px] border absolute p-5 shadow-[0_12px_30px_rgba(15,23,42,0.18)] space-y-5 -translate-x-52 translate-y-8 transition-all duration-300 ease-in w-[320px] backdrop-blur-[2px] {contentBgClass} {contentBorderClass}"
        style={isXPlatform
          ? "transform: translateX(calc(-208px - 5px)) translateY(32px);"
          : ""}
      >
        <div class="flex justify-between items-center">
          <div
            class="flex gap-2 items-center
         rounded-[10px] transition-all duration-300 ease-in"
          >
            <img src={contentIcon} alt="Active" />
            <p id="ContentBadge" class="text-md {accentTextClass}">
              {badgeText} Content
            </p>
          </div>
          <p class="text-[#3A4352] text-sm font-semibold">
            {confidenceDisplay} Confidence
          </p>
        </div>

        <p id="ContentBadgeText" class="max-w-xs text-[#1F2329] leading-6">
          {contentBadgeText}
        </p>
        <div>
          <button
            on:click|stopPropagation={() =>
              canOpenFullAnalysis && openFullAnalysis()}
            disabled={!canOpenFullAnalysis}
            class="p-2 flex w-40 border-2 rounded-[10px] items-center justify-center gap-2 transition-all duration-300 {accentBorderClass} {accentTextClass} {ctaHoverClass} {!canOpenFullAnalysis
              ? 'opacity-60 cursor-not-allowed pointer-events-none'
              : ''}"
          >
            <p id="SeeFullAnalysis" class="text-sm font-semibold">
              See Full Analysis
            </p>
            <svg
              class="h-3 w-3"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 1.5H10.5V4.5"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5 7L10.5 1.5"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9 6.5V9.5C9 9.76522 8.89464 10.0196 8.70711 10.2071C8.51957 10.3946 8.26522 10.5 8 10.5H2.5C2.23478 10.5 1.98043 10.3946 1.79289 10.2071C1.60536 10.0196 1.5 9.76522 1.5 9.5V4C1.5 3.73478 1.60536 3.48043 1.79289 3.29289C1.98043 3.10536 2.23478 3 2.5 3H5.5"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
