import { formatNum } from "next-common/utils";

export const labelUnderlinePlugin = {
  id: "labelUnderline",
  afterDatasetsDraw(chart) {
    const hovered = chart.$hoveredLabel;
    if (!hovered) {
      return;
    }

    const { datasetIndex, dataIndex } = hovered;
    const dataset = chart.data?.datasets?.[0] || {};
    const names = dataset?.name || [];
    const values = dataset?.data || [];
    const labelText = buildBarLabelText(names, values, dataIndex);
    if (typeof labelText !== "string") {
      return;
    }

    const meta = chart.getDatasetMeta(datasetIndex);
    const element = meta?.data?.[dataIndex];
    if (!element) {
      return;
    }

    if (chart.options?.indexAxis !== "y") {
      return;
    }

    const ctx = chart.ctx;
    const baseX = element.base;
    const y = element.y;

    ctx.save();
    ctx.font = "500 12px Inter";
    const textWidth = ctx.measureText(labelText).width;

    const padding = 8;
    const startX = baseX - textWidth - padding;
    const endX = baseX - padding;
    const lineY = y + 4;

    const datalabelsColor = chart.options?.plugins?.datalabels?.color;
    ctx.strokeStyle = datalabelsColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX, lineY);
    ctx.lineTo(endX, lineY);
    ctx.stroke();
    ctx.restore();
  },
};

export function buildBarLabelText(names = [], values = [], index) {
  const name = names[index];
  const value = values[index];

  if (name === undefined || value === undefined) {
    return "";
  }

  return `${name} ${formatNum(value)}`;
}
