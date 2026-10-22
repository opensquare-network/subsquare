import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Line } from "react-chartjs-2";
import "next-common/components/charts/globalConfig";
import hoverLinePlugin from "next-common/components/charts/plugins/hoverLine";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Loading from "next-common/components/loading";
import NoData from "next-common/components/noData";
import { useThemeSetting } from "next-common/context/theme";

dayjs.extend(utc);

const chartHeight = 240;

function buildChartData(points, color, valueOf) {
  return {
    labels: points.map(({ date }) => dayjs.utc(date).format("MMM D")),
    datasets: [
      {
        data: points.map(valueOf),
        borderColor: color,
        backgroundColor: color,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 4,
        pointBackgroundColor: color,
        tension: 0.2,
      },
    ],
  };
}

function buildChartOptions(
  points,
  { textTertiary, neutral100, neutral300, neutral400, tooltipBg },
  { formatTick, formatTooltip, ticksPrecision },
) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: { mode: "index", intersect: false },
    scales: {
      x: {
        border: { display: false },
        grid: { display: false },
        ticks: { color: textTertiary, maxRotation: 0, autoSkip: false },
      },
      y: {
        border: { display: false },
        grid: { color: neutral300, drawTicks: false },
        ticks: {
          color: textTertiary,
          maxTicksLimit: 5,
          precision: ticksPrecision,
          callback: formatTick,
        },
      },
    },
    plugins: {
      legend: { display: false },
      hoverLine: { lineColor: neutral400, lineWidth: 1 },
      tooltip: {
        displayColors: false,
        backgroundColor: tooltipBg,
        titleColor: neutral100,
        bodyColor: neutral100,
        callbacks: {
          title: ([{ dataIndex }]) =>
            dayjs.utc(points[dataIndex].date).format("MMM D, YYYY"),
          label: ({ parsed }) => formatTooltip(parsed.y),
        },
      },
    },
  };
}

function ChartContent({
  points,
  colorKey,
  valueOf,
  renderValue,
  formatTick,
  formatTooltip,
  ticksPrecision,
  subtitle,
  ariaLabel,
}) {
  const theme = useThemeSetting();
  const color = theme[colorKey];
  const latest = points[points.length - 1];

  return (
    <>
      <div className="mb-6">
        <div className="text20Bold text-textPrimary">{renderValue(latest)}</div>
        <div className="text12Medium text-textTertiary">{subtitle}</div>
      </div>
      <div style={{ height: chartHeight }}>
        <Line
          data={buildChartData(points, color, valueOf)}
          options={buildChartOptions(points, theme, {
            formatTick,
            formatTooltip,
            ticksPrecision,
          })}
          plugins={[hoverLinePlugin]}
          role="img"
          aria-label={ariaLabel}
        />
      </div>
    </>
  );
}

/**
 * The card of one daily dotUSD metric: the latest value, its description and the line of the
 * snapshots of the last days. The points are the daily documents served by the backend.
 */
export default function DailyStatChart({
  points,
  isLoading,
  emptyText,
  ...rest
}) {
  if (isLoading) {
    return (
      <SecondaryCard>
        <div className="flex h-[336px] items-center justify-center">
          <Loading size={24} />
        </div>
      </SecondaryCard>
    );
  }

  if (!points.length) {
    return (
      <SecondaryCard>
        <NoData showIcon={false} text={emptyText} />
      </SecondaryCard>
    );
  }

  return (
    <SecondaryCard>
      <ChartContent points={points} {...rest} />
    </SecondaryCard>
  );
}
