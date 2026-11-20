import { afterEach, describe, expect, it, vi } from "vitest";

async function loadFallback() {
  vi.resetModules();
  return import("./canvasContextFallback");
}

function makeWindow({ contextPrototype } = {}) {
  const fakeWindow = {
    HTMLCanvasElement: {
      prototype: {
        getContext(type) {
          if (type !== "2d") {
            return null;
          }
          return Object.create(contextPrototype || {});
        },
      },
    },
  };

  if (contextPrototype) {
    fakeWindow.CanvasRenderingContext2D = function () {};
    fakeWindow.CanvasRenderingContext2D.prototype = contextPrototype;
  }

  return fakeWindow;
}

describe("canvasContextFallback", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fills in the context methods a headless browser stub misses", async () => {
    const contextPrototype = {};
    vi.stubGlobal("window", makeWindow({ contextPrototype }));

    await loadFallback();

    expect(typeof contextPrototype.measureText).toBe("function");
    expect(typeof contextPrototype.setLineDash).toBe("function");
    expect(contextPrototype.measureText("abcd").width).toBeGreaterThan(0);
    expect(() => contextPrototype.setLineDash([5, 3])).not.toThrow();
    expect(contextPrototype.getLineDash()).toEqual([]);
  });

  it("patches the context returned by getContext when there is no prototype", async () => {
    const fakeWindow = makeWindow();
    vi.stubGlobal("window", fakeWindow);

    await loadFallback();

    const context = fakeWindow.HTMLCanvasElement.prototype.getContext("2d");

    expect(typeof context.measureText).toBe("function");
    expect(typeof context.setLineDash).toBe("function");
    expect(() => context.setLineDash([5, 3])).not.toThrow();
  });

  it("leaves a browser with a real canvas untouched", async () => {
    const measureText = vi.fn(() => ({ width: 10 }));
    const setLineDash = vi.fn();
    const contextPrototype = { measureText, setLineDash };
    vi.stubGlobal("window", makeWindow({ contextPrototype }));

    await loadFallback();

    const context = Object.create(contextPrototype);

    expect(context.measureText).toBe(measureText);
    expect(context.setLineDash).toBe(setLineDash);
    context.setLineDash([5, 3]);
    expect(setLineDash).toHaveBeenCalledWith([5, 3]);
  });
});
