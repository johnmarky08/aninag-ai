import { writable } from "svelte/store";

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
