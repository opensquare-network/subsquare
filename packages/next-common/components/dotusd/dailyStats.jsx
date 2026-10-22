import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Line } from "react-chartjs-2";
import "next-common/components/charts/globalConfig";
import hoverLinePlugin from "next-common/components/charts/plugins/hoverLine";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Loading from "next-common/components/loading";
import NoData from "next-common/components/noData";
import ValueDisplay from "next-common/components/valueDisplay";
import { useThemeSetting } from "next-common/context/theme";
import { toPrecision, toPrecisionNumber } from "next-common/utils";
import { abbreviateBigNumber } from "next-common/utils/viewfuncs";
import RecordsLink from "./recordsLink";
import useHolderStats from "./useHolderStats";
import useIssuanceStats from "./useIssuanceStats";

dayjs.extend(utc);

// dotUSD is an Asset Hub asset with six decimals.
const DOT_USD_DECIMALS = 6;
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
        // A long series would otherwise be covered by its own points.
        pointRadius: points.length > 31 ? 0 : 2,
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
        ticks: { color: textTertiary, maxRotation: 0, maxTicksLimit: 7 },
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

// One panel of the trend: the latest value, its description and the line of the metric.
function StatPanel({
  points,
  isLoading,
  colorKey,
  valueOf,
  value,
  label,
  action,
  formatTick,
  formatTooltip,
  ticksPrecision,
  ariaLabel,
  emptyText,
}) {
  const theme = useThemeSetting();

  return (
    <SecondaryCard>
      {isLoading ? (
        <div className="flex h-[320px] items-center justify-center">
          <Loading size={24} />
        </div>
      ) : !points.length ? (
        <NoData showIcon={false} text={emptyText} />
      ) : (
        <>
          <div className="mb-6">
            <div className="text20Bold text-textPrimary">{value}</div>
            <div className="flex items-center gap-x-2 text12Medium text-textTertiary">
              <span>{label}</span>
              {action}
            </div>
          </div>
          <div style={{ height: chartHeight }}>
            <Line
              data={buildChartData(points, theme[colorKey], valueOf)}
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
      )}
    </SecondaryCard>
  );
}

// The two metrics are read from their own apis, so they load and fail independently.
export default function DotUsdStats() {
  const holder = useHolderStats();
  const issuance = useIssuanceStats();
  const latestHolder = holder.items[holder.items.length - 1]?.holderCount;
  const latestIssuance =
    issuance.items[issuance.items.length - 1]?.totalIssuance;

  return (
    <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
      <StatPanel
        points={issuance.items}
        isLoading={issuance.isLoading}
        colorKey="green500"
        valueOf={({ totalIssuance }) =>
          toPrecisionNumber(totalIssuance, DOT_USD_DECIMALS)
        }
        value={
          latestIssuance === undefined ? (
            "—"
          ) : (
            <ValueDisplay
              value={toPrecision(latestIssuance, DOT_USD_DECIMALS, 2)}
              symbol="dotUSD"
            />
          )
        }
        label="Total issued dotUSD"
        formatTick={(value) => abbreviateBigNumber(value, 2)}
        formatTooltip={(value) => `${abbreviateBigNumber(value, 2)} dotUSD`}
        ariaLabel="dotUSD total issuance since launch"
        emptyText="No issuance data available."
      />

      <StatPanel
        points={holder.items}
        isLoading={holder.isLoading}
        colorKey="purple500"
        valueOf={({ holderCount }) => holderCount}
        value={latestHolder ?? "—"}
        label="Accounts holding the asset"
        action={<RecordsLink tab="holders" tooltip="View holders" />}
        formatTick={(value) => value}
        ticksPrecision={0}
        formatTooltip={(value) => `${value} accounts`}
        ariaLabel="dotUSD holders since launch"
        emptyText="No holder data available."
      />
    </div>
  );
}
