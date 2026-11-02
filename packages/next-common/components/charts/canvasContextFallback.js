/**
 * Chart.js draws through a 2D canvas context. Some headless/embedded browsers
 * (e.g. Lightpanda) expose a context stub that misses parts of the API:
 *
 * - without `measureText`, chart.js throws while computing the tick and label
 *   sizes ("t.measureText is not a function");
 * - without `setLineDash`, it throws while drawing dashed lines such as the
 *   threshold curves ("t.setLineDash is not a function").
 *
 * Both errors escape the chart component and take the whole page down. Fill in
 * the missing pieces when the browser has no native implementation; browsers
 * with a real canvas are left untouched.
 */

const DEFAULT_FONT_SIZE = 12;
// Average glyph width as a fraction of the font size, close enough for the
// layout calculations chart.js does with these numbers.
const AVERAGE_CHAR_WIDTH_RATIO = 0.55;

function getFontSize(font) {
  const match = /(\d+(?:\.\d+)?)px/.exec(font || "");
  return match ? parseFloat(match[1]) : DEFAULT_FONT_SIZE;
}

function createTextMetrics(text, font) {
  const value = text === null || text === undefined ? "" : String(text);
  const fontSize = getFontSize(font);
  const width = value.length * fontSize * AVERAGE_CHAR_WIDTH_RATIO;

  return {
    width,
    actualBoundingBoxLeft: 0,
    actualBoundingBoxRight: width,
    actualBoundingBoxAscent: fontSize,
    actualBoundingBoxDescent: 0,
    fontBoundingBoxAscent: fontSize,
    fontBoundingBoxDescent: 0,
    alphabeticBaseline: 0,
    emHeightAscent: fontSize,
    emHeightDescent: 0,
    hangingBaseline: 0,
    ideographicBaseline: 0,
  };
}

function createGradient() {
  return {
    addColorStop() {},
  };
}

// Keyed by context method name. `this` is the context the method is invoked
// on, so a fallback can read the context state like the real implementation.
const CONTEXT_METHOD_FALLBACKS = {
  measureText(text) {
    return createTextMetrics(text, this && this.font);
  },
  // A dashed line is only a styling detail, and the browser could not paint
  // the dash anyway, so ignoring the dash keeps the rest of the chart intact.
  setLineDash() {},
  getLineDash() {
    return [];
  },
  // Used by the gradient chart plugin and some charts own drawing code.
  createLinearGradient() {
    return createGradient();
  },
  createRadialGradient() {
    return createGradient();
  },
};

function addMethodFallbacks(context) {
  if (!context) {
    return context;
  }

  Object.entries(CONTEXT_METHOD_FALLBACKS).forEach(([name, fallback]) => {
    if (typeof context[name] === "function") {
      return;
    }

    try {
      context[name] = fallback;
    } catch {
      // A non-extensible context can not be patched; leave it as is.
    }
  });
  return context;
}

export function installCanvasContextFallback() {
  if (typeof window === "undefined") {
    return;
  }

  const canvasPrototype =
    window.HTMLCanvasElement && window.HTMLCanvasElement.prototype;
  if (!canvasPrototype) {
    return;
  }

  try {
    const contextPrototype =
      window.CanvasRenderingContext2D &&
      window.CanvasRenderingContext2D.prototype;
    if (contextPrototype) {
      addMethodFallbacks(contextPrototype);
    }

    const originalGetContext = canvasPrototype.getContext;
    if (
      typeof originalGetContext !== "function" ||
      originalGetContext.__canvasFallbackInstalled
    ) {
      return;
    }

    const getContext = function getContext(type, ...args) {
      const context = originalGetContext.call(this, type, ...args);
      return type === "2d" ? addMethodFallbacks(context) : context;
    };
    getContext.__canvasFallbackInstalled = true;
    canvasPrototype.getContext = getContext;
  } catch {
    // Patching is best effort; a browser that does not allow it simply keeps
    // its original behavior.
  }
}

if (typeof window !== "undefined") {
  installCanvasContextFallback();
}

export default installCanvasContextFallback;
