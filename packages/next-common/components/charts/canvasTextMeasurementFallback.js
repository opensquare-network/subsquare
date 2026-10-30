/**
 * Chart.js calls `ctx.measureText(...).width` while computing the tick and label
 * sizes of a canvas. Some headless/embedded browsers (e.g. Lightpanda) expose a
 * 2D context stub without `measureText`, which makes chart rendering throw
 * "t.measureText is not a function" and takes the whole page down with it.
 *
 * Fill in a rough approximation when the browser cannot measure text itself.
 * Browsers with a real canvas are left untouched.
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

function addMeasureText(context) {
  if (!context || typeof context.measureText === "function") {
    return context;
  }

  try {
    context.measureText = function measureText(text) {
      return createTextMetrics(text, this && this.font);
    };
  } catch {
    // A non-extensible context can not be patched; leave it as is.
  }
  return context;
}

export function installCanvasTextMeasurementFallback() {
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
    if (
      contextPrototype &&
      typeof contextPrototype.measureText !== "function"
    ) {
      contextPrototype.measureText = function measureText(text) {
        return createTextMetrics(text, this && this.font);
      };
    }

    const originalGetContext = canvasPrototype.getContext;
    if (
      typeof originalGetContext !== "function" ||
      originalGetContext.__measureTextFallbackInstalled
    ) {
      return;
    }

    const getContext = function getContext(type, ...args) {
      const context = originalGetContext.call(this, type, ...args);
      return type === "2d" ? addMeasureText(context) : context;
    };
    getContext.__measureTextFallbackInstalled = true;
    canvasPrototype.getContext = getContext;
  } catch {
    // Patching is best effort; a browser that does not allow it simply keeps
    // its original behavior.
  }
}

if (typeof window !== "undefined") {
  installCanvasTextMeasurementFallback();
}

export default installCanvasTextMeasurementFallback;
