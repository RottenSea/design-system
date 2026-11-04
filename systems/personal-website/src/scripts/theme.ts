/**
 * The page's one theme store. It alone writes data-theme on <html>, the choice in localStorage and
 * the fade; components call set() and subscribe() and never read localStorage or the OS.
 *
 * The fade writes the --theme-variables on <html> on each frame instead of using a CSS transition:
 * Chrome draws a visited link whose colour variable is transitioning in the colour around it
 * (crbug.com/569257985).
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
  subscribe(
    listener: (state: ThemeState, previous: ThemeState) => void
  ): () => void;
}

const dev = Boolean(
  (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV
);
let store: ThemeStore | undefined;
/** The fade in progress: the variables' values on its last frame, and how to end it now. */
let running: { values: Map<string, string>; finish: () => void } | undefined;
/** The inline color-scheme <html> had before a fade held it, while one is holding it. */
let heldScheme: string | undefined;
let timing: { duration: number; easing: string } | undefined;

/** The key is ThemeScript's data-theme-key, else the first call's key, else "ds-theme". */
export function themeStore(key?: string): ThemeStore {
  const root = document.documentElement;
  if (!store) store = createStore(root.dataset.themeKey || key || "ds-theme");
  else if (dev && key && key !== store.key) {
    console.warn(
      `The theme store keeps its choice under "${store.key}", not "${key}".`
    );
  }
  return store;
}

function createStore(key: string): ThemeStore {
  const root = document.documentElement;
  const system = matchMedia("(prefers-color-scheme: dark)");
  const listeners = new Set<
    (state: ThemeState, previous: ThemeState) => void
  >();

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
    root.dataset.theme === "light" || root.dataset.theme === "dark"
      ? root.dataset.theme
      : undefined;

  // ThemeScript has set the theme before the first paint; without it, set it now.
  let state: ThemeState = {
    preference: read(),
    theme: current() ?? resolve(read())
  };
  root.dataset.theme = state.theme;

  const change = (next: ThemeState) => {
    const previous = state;
    if (
      next.preference === previous.preference &&
      next.theme === previous.theme
    )
      return;
    state = next;
    if (current() !== next.theme) {
      fadeTheme(root, current() ?? previous.theme, () => {
        root.dataset.theme = next.theme;
      });
    }
    for (const listener of listeners) listener(state, previous);
  };

  system.addEventListener("change", () => {
    if (state.preference === "system")
      change({ preference: "system", theme: resolve("system") });
  });
  window.addEventListener("storage", (event) => {
    if (event.key !== key && event.key !== null) return;
    const preference = read();
    change({ preference, theme: resolve(preference) });
  });
  // data-theme written without the store still fades. Following the OS (Starlight) and a page
  // marked data-theme-pinned are expected; anything else warns in development.
  const observer = new MutationObserver(() => {
    const theme = current();
    if (!theme || theme === state.theme) return;
    const pinned = root.dataset.themePinned !== undefined;
    if (
      dev &&
      !pinned &&
      !(state.preference === "system" && theme === resolve("system"))
    ) {
      console.warn(
        "data-theme was changed outside the theme store; use themeStore().set()."
      );
    }
    const previous = state;
    state = { preference: state.preference, theme };
    // Undone for a moment so the fade can read the old values; nothing has been drawn yet.
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
 * A fade still running goes on from where it is. color-scheme keeps the old theme until the end:
 * scrollbars and form controls follow it and cannot fade.
 */
function fadeTheme(root: HTMLElement, from: Theme, apply: () => void) {
  const fade = themeFade(root);
  const before = getComputedStyle(root);
  const names = before
    .getPropertyValue("--theme-variables")
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name.startsWith("--"));
  const start = new Map(
    names.map((name) => [
      name,
      running?.values.get(name) ?? before.getPropertyValue(name).trim()
    ])
  );
  running?.finish();
  apply();
  if (!fade || document.hidden || names.length === 0) return;

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
  // Hidden frames get no animation frames; this ends the fade anyway.
  const timer = window.setTimeout(finish, fade.duration + 250);
  running = { values, finish };
}

/** The fade's duration in ms and easing, read once; null with reduced motion. */
export function themeFade(root: HTMLElement = document.documentElement) {
  if (!timing) {
    const style = getComputedStyle(root);
    timing = {
      duration:
        Number.parseFloat(style.getPropertyValue("--motion-entrance")) || 350,
      easing:
        style.getPropertyValue("--ease-move").trim() ||
        "cubic-bezier(0.4, 0, 0.2, 1)"
    };
  }
  if (
    root.dataset.reduceMotion === "true" ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return null;
  return timing;
}

/**
 * Custom property values in a settled theme (by default the nearest data-theme's), for a script
 * that draws for the new theme while the variables are still fading.
 */
export function themeValues<Name extends string>(
  element: Element,
  names: readonly Name[],
  theme?: Theme
): Record<Name, string> {
  const probe = document.createElement("span");
  probe.hidden = true;
  probe.dataset.theme =
    theme ??
    (element.closest<HTMLElement>("[data-theme]")?.dataset.theme === "dark"
      ? "dark"
      : "light");
  element.append(probe);
  const style = getComputedStyle(probe);
  const values = Object.fromEntries(
    names.map((name) => [name, style.getPropertyValue(name).trim()])
  );
  probe.remove();
  return values as Record<Name, string>;
}

/** Fades a new drawing in over the theme fade's time; resolves at once with reduced motion. */
export async function fadeIn(element: Element) {
  const fade = themeFade();
  if (!fade) return;
  await element
    .animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: fade.duration,
      easing: fade.easing
    })
    .finished.catch(() => undefined);
}
