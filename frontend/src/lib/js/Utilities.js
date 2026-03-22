import { writable, get } from "svelte/store";

export const verificationLevel = writable("Unknown");

// Draggable logic
const PANEL_WIDTH = 400;
const PANEL_MARGIN = 0;

function getInitialPosX() {
  if (typeof window === "undefined") return 20;
  return Math.max(PANEL_MARGIN, window.innerWidth - PANEL_WIDTH - PANEL_MARGIN);
}

function getInitialPosY() {
  return 8;
}

export const posX = writable(getInitialPosX());
export const posY = writable(getInitialPosY());
export const dragging = writable(false);
export const offsetX = writable(0);
export const offsetY = writable(0);

let dragStartX = 0;
let dragStartY = 0;
let hasDragged = false;
let suppressNextClick = false;
const DRAG_THRESHOLD = 8;

function onWindowMouseMove(event) {
  if (!get(dragging)) return;

  const nextX = event.clientX - get(offsetX);
  const nextY = event.clientY - get(offsetY);

  posX.set(nextX);
  posY.set(nextY);

  if (
    !hasDragged &&
    (Math.abs(event.clientX - dragStartX) > DRAG_THRESHOLD ||
      Math.abs(event.clientY - dragStartY) > DRAG_THRESHOLD)
  ) {
    hasDragged = true;
  }
}

function onWindowMouseUp() {
  stopDrag();
}

export function startDrag(event) {
  if (!(event instanceof MouseEvent)) return;
  if (event.button !== 0) return;

  event.preventDefault();

  dragging.update(() => true);
  offsetX.set(event.clientX - get(posX));
  offsetY.set(event.clientY - get(posY));

  dragStartX = event.clientX;
  dragStartY = event.clientY;
  hasDragged = false;

  if (typeof window !== "undefined") {
    window.addEventListener("mousemove", onWindowMouseMove);
    window.addEventListener("mouseup", onWindowMouseUp, { once: true });
  }
}

export function drag(event) {
  onWindowMouseMove(event);
}

export function stopDrag() {
  const wasDragging = get(dragging);

  if (typeof window !== "undefined") {
    window.removeEventListener("mousemove", onWindowMouseMove);
    window.removeEventListener("mouseup", onWindowMouseUp);
  }

  if (wasDragging && hasDragged && get(minimize)) {
    suppressNextClick = true;
  }

  hasDragged = false;

  dragging.update(() => false);
}

export function consumeSuppressedClick() {
  if (!suppressNextClick) return false;
  suppressNextClick = false;
  return true;
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

export const showFullAnalysis = writable(false);
export function toggleFullAnalysis() {
  showFullAnalysis.update((s) => !s);
}
export function openFullAnalysis() {
  showFullAnalysis.set(true);
}

// Reusable outside-click helper.
// Usage: const cleanup = setupOutsideClick(() => element, () => { ...close logic... }, (event) => false);
export function setupOutsideClick(
  getElement,
  onOutsideClick,
  isAllowedOutsideClick,
) {
  function handleDocumentClick(event) {
    const element = getElement?.();
    if (!element) return;

    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    if (isAllowedOutsideClick?.(event)) {
      return;
    }

    if (!element.contains(target)) {
      onOutsideClick(event);
    }
  }

  // Defer registration so the click that opens the panel doesn't immediately close it.
  const registerTimeout = setTimeout(() => {
    document.addEventListener("click", handleDocumentClick);
  }, 0);

  return () => {
    clearTimeout(registerTimeout);
    document.removeEventListener("click", handleDocumentClick);
  };
}
