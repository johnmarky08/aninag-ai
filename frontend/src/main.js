import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";

export function mountApp(target, props = {}) {
  if (!target) return null;

  return mount(App, {
    target,
    props,
  });
}

export default mountApp;
