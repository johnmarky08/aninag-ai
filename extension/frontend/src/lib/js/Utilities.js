import { writable, get } from "svelte/store";

// Draggable logic
export const posX = writable(20);
export const posY = writable(20);
export const dragging = writable(false);
export const offsetX = writable(0);
export const offsetY = writable(0);

export function startDrag(event) {
  dragging.update(() => true);
  offsetX.update(() => event.clientX - get(posX));
  offsetY.update(() => event.clientY - get(posY));
}

export function drag(event) {
  if (get(dragging)) {
    posX.update(() => event.clientX - get(offsetX));
    posY.update(() => event.clientY - get(offsetY));
  }
}

export function stopDrag() {
  dragging.update(() => false);
}

// Keyboard support for draggable header
export function handleKeydown(event) {
  if (event.key === "Enter" || event.key === " ") {
    startDrag(event);
  }
}

// Close panel
export const minimize = writable(true);
export function clickPanel() {
  minimize.update((m) => !m);
}
