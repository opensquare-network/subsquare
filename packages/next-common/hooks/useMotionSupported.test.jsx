// @vitest-environment jsdom
import { describe, expect, it, afterEach } from "vitest";
import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import useMotionSupported from "./useMotionSupported";

function Probe() {
  const supported = useMotionSupported();
  return <span>{supported ? "supported" : "unsupported"}</span>;
}

async function render(element) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(element);
  });
  return container;
}

describe("useMotionSupported", () => {
  const originalSVGElement = globalThis.SVGElement;

  afterEach(() => {
    globalThis.SVGElement = originalSVGElement;
  });

  // In such a runtime mounting any motion component throws "SVGElement is not defined"
  // (framer-motion's isSVGElement does an unguarded `instanceof SVGElement`), which is
  // why callers have to fall back to plain elements.
  it("reports unsupported where the SVGElement global is missing", async () => {
    delete globalThis.SVGElement;

    expect(await render(<Probe />)).toHaveProperty(
      "textContent",
      "unsupported",
    );
  });

  it("reports supported in a normal DOM environment", async () => {
    expect(await render(<Probe />)).toHaveProperty("textContent", "supported");
  });
});
