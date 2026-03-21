import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";
import { analyzePost } from "./lib/js/services/analyzeService.js";

export function mountApp(target, props = {}) {
  if (!target) return null;

  return mount(App, {
    target,
    props,
  });
}

export { analyzePost };
export default mountApp;
