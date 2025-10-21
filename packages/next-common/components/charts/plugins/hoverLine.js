const hoverLinePlugin = {
  id: "hoverLine",
  afterDraw: (chart) => {
    const options = chart.config.options?.plugins?.hoverLine ?? {};

    if (!options) {
      return;
    }

    const { lineWidth, lineColor } = options ?? {};

    if (chart?.tooltip?._active?.length) {
      const { ctx } = chart;
      ctx.save();

      ctx.beginPath();
      ctx.moveTo(chart.tooltip._active[0].element.x, chart.chartArea.top);
      ctx.lineTo(chart.tooltip._active[0].element.x, chart.chartArea.bottom);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = lineColor;
      ctx.stroke();
      ctx.restore();
    }
  },
};
export default hoverLinePlugin;
