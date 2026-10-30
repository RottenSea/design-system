/**
 * Changing the theme, for ThemeToggle, SettingsMenu and anything else that switches it. A change
 * fades every colour on the page over --motion-entrance: setTheme marks <html> with
 * data-theme-fade for that long, and base.css gives every element the same colour transition
 * while the mark is there, in place of its own, so the whole page changes together. What a script
 * draws, such as a Mermaid diagram or the share poster, is not a CSS colour; it draws again and
 * fades the new drawing in with fadeIn. With reduced motion, in the OS or data-reduce-motion="true",
 * the theme changes at once.
 *
 *   import { setTheme } from "@rottensea/ds-personal-website/scripts/theme";
 *   setTheme("dark");
 */

const timers = new WeakMap<HTMLElement, number>();

/** The fade's duration in ms and easing, read from the tokens, or null with reduced motion. */
export function themeFade(root: HTMLElement = document.documentElement) {
  const view = root.ownerDocument.defaultView ?? window;
  if (root.dataset.reduceMotion === "true" || view.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  const style = view.getComputedStyle(root);
  return {
    duration: Number.parseFloat(style.getPropertyValue("--motion-entrance")) || 350,
    easing: style.getPropertyValue("--ease-move").trim() || "ease"
  };
}

/** Sets data-theme on root, the page's <html> unless another document's is given, with the fade. */
export function setTheme(theme: "light" | "dark", root: HTMLElement = document.documentElement) {
  if (root.dataset.theme === theme) return;
  const fade = themeFade(root);
  if (fade) {
    const view = root.ownerDocument.defaultView ?? window;
    // The mark goes on before the theme, so the first style change already has the fade's transition.
    root.dataset.themeFade = "";
    view.clearTimeout(timers.get(root));
    timers.set(
      root,
      view.setTimeout(() => {
        delete root.dataset.themeFade;
        timers.delete(root);
      }, fade.duration + 50)
    );
  }
  root.dataset.theme = theme;
}

/** Fades a new drawing in over the theme fade's time; resolves at once with reduced motion. */
export async function fadeIn(element: Element) {
  const fade = themeFade(element.ownerDocument.documentElement);
  if (!fade) return;
  await element
    .animate([{ opacity: 0 }, { opacity: 1 }], { duration: fade.duration, easing: fade.easing })
    .finished.catch(() => undefined);
}
