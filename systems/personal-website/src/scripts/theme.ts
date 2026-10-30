/**
 * The theme as one store per page, the only thing that changes it. It holds the reader's choice
 * (light, dark or system) and the theme in use, and it alone writes data-theme on <html>, the
 * choice in localStorage, and the fade. It follows the OS while the choice is system, and other
 * tabs of the site as they change the choice. Components ask for a change with set() and hear of
 * one with subscribe(); none of them reads localStorage or the OS itself.
 *
 * A change fades every colour on the page over --motion-entrance: the store marks <html> with
 * data-theme-fade for that long, and base.css gives every element the same colour transition while
 * the mark is there, in place of its own. What a script draws, such as a Mermaid diagram or the
 * share poster, draws again for the new theme and fades in with fadeIn. With reduced motion, in
 * the OS or data-reduce-motion="true", the theme changes at once.
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
let fadeTimer: number | undefined;
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
      // The mark goes on before the theme, so the first style change already has the fade.
      markFade(root);
      root.dataset.theme = next.theme;
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
  // itself); anything else gets a warning in development.
  new MutationObserver(() => {
    const theme = current();
    if (!theme || theme === state.theme) return;
    if (dev && !(state.preference === "system" && theme === resolve("system"))) {
      console.warn("data-theme was changed outside the theme store; use themeStore().set().");
    }
    const previous = state;
    state = { preference: state.preference, theme };
    markFade(root);
    for (const listener of listeners) listener(state, previous);
  }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

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

/** Marks <html> with data-theme-fade for the fade's time, unless the reader asked for less motion. */
function markFade(root: HTMLElement) {
  const fade = themeFade(root);
  if (!fade) return;
  root.dataset.themeFade = "";
  clearTimeout(fadeTimer);
  fadeTimer = window.setTimeout(() => delete root.dataset.themeFade, fade.duration + 50);
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

/** Fades a new drawing in over the theme fade's time; resolves at once with reduced motion. */
export async function fadeIn(element: Element) {
  const fade = themeFade();
  if (!fade) return;
  await element
    .animate([{ opacity: 0 }, { opacity: 1 }], { duration: fade.duration, easing: fade.easing })
    .finished.catch(() => undefined);
}
