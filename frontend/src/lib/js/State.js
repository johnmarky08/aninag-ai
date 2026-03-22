import { writable } from "svelte/store";

function getOrInitializeClaimsToday() {
  const today = new Date().toDateString();
  const stored = localStorage.getItem("claimsCheckedToday");

  if (!stored) {
    return { count: 0, date: today };
  }

  try {
    const parsed = JSON.parse(stored);
    // Reset if date changed
    if (parsed.date !== today) {
      return { count: 0, date: today };
    }
    return parsed;
  } catch {
    return { count: 0, date: today };
  }
}

function createClaimsStore() {
  const initial = getOrInitializeClaimsToday();
  const { subscribe, set, update } = writable(initial.count);

  return {
    subscribe,
    set,
    update,
    increment: () => {
      update((count) => {
        const newCount = count + 1;
        const today = new Date().toDateString();
        localStorage.setItem(
          "claimsCheckedToday",
          JSON.stringify({ count: newCount, date: today }),
        );
        return newCount;
      });
    },
    reset: () => {
      const today = new Date().toDateString();
      localStorage.setItem(
        "claimsCheckedToday",
        JSON.stringify({ count: 0, date: today }),
      );
      set(0);
    },
  };
}

const storedState = localStorage.getItem("onState")
  ? localStorage.getItem("onState") === "on"
  : false;
export const onState = writable(storedState);

const storedShow = localStorage.getItem("show")
  ? localStorage.getItem("show") === "on"
  : false;
export const show = writable(storedShow);

onState.subscribe((value) => {
  localStorage.setItem("onState", value ? "on" : "off");
});

show.subscribe((value) => {
  localStorage.setItem("show", value ? "on" : "off");
});

export const claimsCheckedToday = createClaimsStore();

// Confidence store for analysis results (0-100)
export const analysisConfidence = writable(100);
export const analysis = writable(null);
