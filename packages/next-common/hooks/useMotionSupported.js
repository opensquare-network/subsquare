import { useEffect, useState } from "react";

/**
 * Whether framer-motion animations can run in the current runtime.
 *
 * framer-motion (11.x) does `element instanceof SVGElement` without guarding the global,
 * so mounting any motion component throws "SVGElement is not defined" in JS realms that
 * have no DOM globals (sandboxed previews, jsdom-like shims, web workers...). Animations
 * can't work there anyway, so callers should fall back to plain elements when this is
 * false, and avoid running the library's animation logic.
 *
 * Always false during SSR and on the first client render, so the server HTML and the
 * hydration pass render the same thing (no hydration mismatch).
 */
export default function useMotionSupported() {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof SVGElement !== "undefined");
  }, []);

  return supported;
}
