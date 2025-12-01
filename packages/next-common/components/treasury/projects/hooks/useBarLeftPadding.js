import { useMemo } from "react";
import { PROJECT_CHART_TYPES } from "../statistics/projectChart";
import { buildBarLabelText } from "../statistics/labelUnderlinePlugin";

export default function useBarLeftPadding(type, data) {
  return useMemo(() => {
    if (type !== PROJECT_CHART_TYPES.BAR) {
      return undefined;
    }
    const labels = data?.labels || [];
    if (!labels.length) {
      return undefined;
    }

    if (typeof window === "undefined") {
      return undefined;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return undefined;
    }

    ctx.font =
      "500 12px Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

    let maxWidth = 0;
    const dataset = data?.datasets?.[0] || {};
    const names = dataset?.name || [];
    const values = dataset?.data || [];
    names.forEach((_, index) => {
      const width = ctx.measureText(
        buildBarLabelText(names, values, index),
      ).width;
      if (width > maxWidth) {
        maxWidth = width;
      }
    });

    return Math.ceil(maxWidth);
  }, [type, data]);
}
