/**
 * The theme as one store per page, the only thing that changes it. It holds the reader's choice
 * (light, dark or system) and the theme in use, and it alone writes data-theme on <html>, the
 * choice in localStorage, and the fade. It follows the OS while the choice is system, and other
 * tabs of the site as they change the choice. Components ask for a change with set() and hear of
 * one with subscribe(); none of them reads localStorage or the OS itself.
 *
 * A change fades every colour on the page over --motion-entrance. The store writes the theme's
 * variables, the ones --theme-variables lists, on <html> on each frame, a step further from the
 * old theme's values to the new one's, and every element reads them as they blend. It writes them
 * itself because Chrome will not draw a visited link from a variable that a CSS transition is
 * changing (crbug.com/569257985): the link and the text inside it showed the colour of the element
 * around the link until the transition ended. While the fade runs, <html> carries
 * data-theme-fade, and base.css holds every element's own transitions. What a script draws, such as a
 * Mermaid diagram or the share poster, draws again for the new theme with the colours themeValues
 * reads, and fades in with fadeIn. With reduced motion, in the OS or data-reduce-motion="true",
 * the theme changes at once.
 *
 * Something that writes data-theme itself is taken as a change too, so it still fades and the
 * subscribers still hear of it, with a warning in development. The fade can come too late if that
 * script reads styles straight after writing, so set() is the way.
 *
 *   import { themeStore } from "@rottensea/ds-personal-website/scripts/theme";
 *   const theme = themeStore();
 *   theme.set("dark");
 *   theme.subscribe((state, previous) => { if (state.theme !== previous.theme) redraw(); });
 *
 * The localStorage key is the one ThemeScript writes on <html> as data-theme-key, else the one
 * passed to the first themeStore() call, else "ds-theme".
 */

import { easing, mixFadeValue, parseFadeValue } from "./fade.ts";

export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";
export interface ThemeState {
  /** The reader's choice. */
  preference: ThemePreference;
  /** The theme in use: the choice, or the OS's for system. */
  theme: Theme;
}
export interface ThemeStore {
  readonly key: string;
  get(): ThemeState;
  /** Applies a choice and remembers it. */
  set(preference: ThemePreference): void;
  /** Calls the listener after each change; returns a function that stops it. */
  subscribe(listener: (state: ThemeState, previous: ThemeState) => void): () => void;
}

const dev = Boolean((import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV);
let store: ThemeStore | undefined;
/** The fade in progress: the variables' values on its last frame, and how to end it now. */
let running: { values: Map<string, string>; finish: () => void } | undefined;
/** The inline color-scheme <html> had before a fade held it, while one is holding it. */
let heldScheme: string | undefined;
let timing: { duration: number; easing: string } | undefined;

/** The page's theme store, made on the first call. */
export function themeStore(key?: string): ThemeStore {
  const root = document.documentElement;
  if (!store) store = createStore(root.dataset.themeKey || key || "ds-theme");
  else if (dev && key && key !== store.key) {
    console.warn(`The theme store keeps its choice under "${store.key}", not "${key}".`);
  }
  return store;
}

function createStore(key: string): ThemeStore {
  const root = document.documentElement;
  const system = matchMedia("(prefers-color-scheme: dark)");
  const listeners = new Set<(state: ThemeState, previous: ThemeState) => void>();

  const read = (): ThemePreference => {
    try {
      const saved = localStorage.getItem(key);
      return saved === "light" || saved === "dark" ? saved : "system";
    } catch {
      return "system";
    }
  };
  const write = (preference: ThemePreference) => {
    try {
      if (preference === "system") localStorage.removeItem(key);
      else localStorage.setItem(key, preference);
    } catch {
      // Private browsing can refuse storage; the choice still applies to this page.
    }
  };
  const resolve = (preference: ThemePreference): Theme =>
    preference === "system" ? (system.matches ? "dark" : "light") : preference;
  const current = (): Theme | undefined =>
    root.dataset.theme === "light" || root.dataset.theme === "dark" ? root.dataset.theme : undefined;
  // Read the fade's timing now: reading styles after data-theme has changed but before the mark
  // is on would apply the new colours at once.
  themeFade(root);

  // ThemeScript has set the theme before the first paint; without it, set it now, at once.
  let state: ThemeState = { preference: read(), theme: current() ?? resolve(read()) };
  root.dataset.theme = state.theme;

  const change = (next: ThemeState) => {
    const previous = state;
    if (next.preference === previous.preference && next.theme === previous.theme) return;
    state = next;
    if (current() !== next.theme) {
      fadeTheme(root, current() ?? previous.theme, () => {
        root.dataset.theme = next.theme;
      });
    }
    for (const listener of listeners) listener(state, previous);
  };

  system.addEventListener("change", () => {
    if (state.preference === "system") change({ preference: "system", theme: resolve("system") });
  });
  // Another tab, or a document in a frame, changed the choice.
  window.addEventListener("storage", (event) => {
    if (event.key !== key && event.key !== null) return;
    const preference = read();
    change({ preference, theme: resolve(preference) });
  });
  // Someone wrote data-theme without the store. Following the OS is expected (Starlight does it
  // itself), and so is a page that shows one part in another theme for a while and marks <html>
  // with data-theme-pinned (the docs site's examples); anything else gets a warning in development.
  const observer = new MutationObserver(() => {
    const theme = current();
    if (!theme || theme === state.theme) return;
    const pinned = root.dataset.themePinned !== undefined;
    if (dev && !pinned && !(state.preference === "system" && theme === resolve("system"))) {
      console.warn("data-theme was changed outside the theme store; use themeStore().set().");
    }
    const previous = state;
    state = { preference: state.preference, theme };
    // The fade reads the old theme's values before the change, so the change is undone for that
    // moment. Nothing has been drawn in the new theme yet: this runs before the next frame.
    root.dataset.theme = previous.theme;
    fadeTheme(root, previous.theme, () => {
      root.dataset.theme = theme;
    });
    observer.takeRecords();
    for (const listener of listeners) listener(state, previous);
  });
  observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  return {
    key,
    get: () => state,
    set(preference) {
      write(preference);
      change({ preference, theme: resolve(preference) });
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}

/**
 * Changes the theme with apply() and fades the theme's variables from their values before it to
 * their values after it, written on <html> on each frame. A fade still running goes on from where
 * it is. While it runs, <html> has data-theme-fade, and its color-scheme stays at the theme being
 * left: the scrollbars and form controls, which follow color-scheme and cannot fade, change at the
 * end. With reduced motion, or on a page nobody can see, the theme changes at once.
 */
function fadeTheme(root: HTMLElement, from: Theme, apply: () => void) {
  const fade = themeFade(root);
  const names = (getComputedStyle(root).getPropertyValue("--theme-variables") || "")
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name.startsWith("--"));
  const before = getComputedStyle(root);
  const start = new Map(names.map((name) => [name, running?.values.get(name) ?? before.getPropertyValue(name).trim()]));
  running?.finish();
  apply();
  if (!fade || document.hidden || names.length === 0) return;

  // The values the new theme settles on, read with nothing written over them.
  const after = getComputedStyle(root);
  const steps = names.map((name) => {
    const end = after.getPropertyValue(name).trim();
    const a = parseFadeValue(start.get(name) ?? "");
    const b = parseFadeValue(end);
    return { name, from: a, to: b, end };
  });
  const values = new Map(start);
  for (const [name, value] of start) root.style.setProperty(name, value);
  root.dataset.themeFade = "";
  if (heldScheme === undefined) heldScheme = root.style.colorScheme;
  root.style.colorScheme = from;

  const progress = easing(fade.easing);
  const began = performance.now();
  let frame = 0;
  const finish = () => {
    cancelAnimationFrame(frame);
    clearTimeout(timer);
    for (const name of names) root.style.removeProperty(name);
    delete root.dataset.themeFade;
    root.style.colorScheme = heldScheme ?? "";
    heldScheme = undefined;
    if (running?.finish === finish) running = undefined;
  };
  const step = (now: number) => {
    const time = (now - began) / fade.duration;
    if (time >= 1) return finish();
    const amount = progress(Math.max(0, time));
    for (const { name, from: a, to: b, end } of steps) {
      const value = (a && b && mixFadeValue(a, b, amount)) || end;
      values.set(name, value);
      root.style.setProperty(name, value);
    }
    frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);
  // A frame that never comes, in a hidden frame or a busy page, does not leave the page between
  // the two themes.
  const timer = window.setTimeout(finish, fade.duration + 250);
  running = { values, finish };
}

/**
 * The fade's duration in ms and easing, or null with reduced motion. They are read from the tokens
 * once and kept, so later calls never make the browser work out styles.
 */
export function themeFade(root: HTMLElement = document.documentElement) {
  if (!timing) {
    const style = getComputedStyle(root);
    timing = {
      duration: Number.parseFloat(style.getPropertyValue("--motion-entrance")) || 350,
      easing: style.getPropertyValue("--ease-move").trim() || "cubic-bezier(0.4, 0, 0.2, 1)"
    };
  }
  if (root.dataset.reduceMotion === "true" || matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  return timing;
}

/**
 * The values of custom properties on element once the theme has settled: in theme, else in the
 * theme of the nearest data-theme around element. While the theme fades, its colour variables are
 * partway between the two themes, so a script that draws for the new theme reads them here. A
 * hidden probe inside element, with its own data-theme, takes them from tokens.css as they end.
 */
export function themeValues<Name extends string>(
  element: Element,
  names: readonly Name[],
  theme?: Theme
): Record<Name, string> {
  const probe = document.createElement("span");
  probe.hidden = true;
  probe.dataset.theme = theme ?? (element.closest<HTMLElement>("[data-theme]")?.dataset.theme === "dark" ? "dark" : "light");
  element.append(probe);
  const style = getComputedStyle(probe);
  const values = Object.fromEntries(names.map((name) => [name, style.getPropertyValue(name).trim()]));
  probe.remove();
  return values as Record<Name, string>;
}

/** Fades a new drawing in over the theme fade's time; resolves at once with reduced motion. */
export async function fadeIn(element: Element) {
  const fade = themeFade();
  if (!fade) return;
  await element
    .animate([{ opacity: 0 }, { opacity: 1 }], { duration: fade.duration, easing: fade.easing })
    .finished.catch(() => undefined);
}
