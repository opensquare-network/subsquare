import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { useTheme } from "styled-components";
import "next-common/components/charts/globalConfig";
import { Skeleton } from "next-common/components/skeleton";
import { cn } from "next-common/utils";
import useTimesliceDate from "../hooks/useTimesliceDate";
import { BITS_PER_CORE, POOL_WINDOWS } from "./utils";

const CHART_HEIGHT = 208;

function WindowSwitch({ days, onChange }) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-neutral200 p-1">
      {POOL_WINDOWS.map((window) => (
        <button
          key={window.value}
          type="button"
          className={cn(
            "rounded-md px-2 py-0.5 text12Medium",
            days === window.value
              ? "bg-neutral100 text-textPrimary shadow-100"
              : "text-textTertiary",
          )}
          onClick={() => onChange(window.value)}
        >
          {window.label}
        </button>
      ))}
    </div>
  );
}

export default function PoolSizeChart({
  days,
  onDaysChange,
  historyDays = [],
  step = 1,
  loading,
}) {
  const theme = useTheme();
  const toDate = useTimesliceDate();

  const data = useMemo(
    () => ({
      labels: historyDays.map((day) => {
        const date = toDate(day.startTimeslice);
        return date ? date.format("MM-DD") : `#${day.day}`;
      }),
      datasets: [
        {
          label: "Private pool",
          data: historyDays.map((day) => day.private),
          backgroundColor: theme.theme500,
          stack: "pool",
        },
        {
          label: "System pool",
          data: historyDays.map((day) => day.system),
          backgroundColor: theme.neutral400,
          stack: "pool",
        },
      ],
    }),
    [historyDays, theme.theme500, theme.neutral400, toDate],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 0 },
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            boxWidth: 8,
            boxHeight: 8,
            usePointStyle: true,
            color: theme.textTertiary,
            font: { size: 12 },
          },
        },
        tooltip: {
          callbacks: {
            label: (item) =>
              `${item.dataset.label}: ${item.raw.toLocaleString()} cores (${(
                item.raw * BITS_PER_CORE
              ).toLocaleString()} bits)`,
            footer: (items) =>
              `Total: ${items
                .reduce((sum, item) => sum + item.raw, 0)
                .toLocaleString()} cores`,
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          border: { display: false },
          grid: { display: false },
          ticks: { color: theme.textTertiary, font: { size: 11 } },
        },
        y: {
          stacked: true,
          border: { display: false },
          grid: { color: theme.neutral300 },
          ticks: { color: theme.textTertiary, font: { size: 11 } },
        },
      },
    }),
    [theme],
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text14Bold text-textPrimary">Instant pool size</span>
          <span className="text12Medium text-textTertiary">
            {step > 1 ? `sampled every ${step} timeslices` : "per timeslice"}
          </span>
        </div>
        <WindowSwitch days={days} onChange={onDaysChange} />
      </div>

      <div className="mt-4" style={{ height: CHART_HEIGHT }}>
        {loading ? (
          <Skeleton className="w-full rounded-lg h-full" />
        ) : (
          <Bar data={data} options={options} />
        )}
      </div>

      {!loading && !historyDays.length && (
        <div className="mt-2 text-center text12Medium text-textTertiary">
          No pool history in this window
        </div>
      )}
    </div>
  );
}
