import CountDown from "next-common/components/_CountDown";
import { cn } from "next-common/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInterval } from "react-use";
import { useSwapQuote } from "../context/quote";

const RATE_REFRESH_INTERVAL = 30_000;

export default function RateRefreshCountdown({
  hasRate,
  isRefreshing,
  refreshError,
  refreshVersion,
}) {
  const { quote } = useSwapQuote();
  const { refresh } = quote;
  const [remaining, setRemaining] = useState(RATE_REFRESH_INTERVAL);
  const autoRefreshRequestedRef = useRef(false);
  const lastRefreshVersionRef = useRef(refreshVersion);
  const remainingSeconds = Math.ceil(remaining / 1000);

  const refreshRate = useCallback(() => {
    if (isRefreshing) {
      return;
    }
    refresh();
  }, [isRefreshing, refresh]);

  useInterval(
    () => setRemaining((current) => Math.max(0, current - 1000)),
    hasRate && !isRefreshing && !refreshError ? 1000 : null,
  );

  useEffect(() => {
    if (refreshVersion !== lastRefreshVersionRef.current) {
      lastRefreshVersionRef.current = refreshVersion;
      autoRefreshRequestedRef.current = false;
      setRemaining(RATE_REFRESH_INTERVAL);
      return;
    }

    if (
      remaining === 0 &&
      hasRate &&
      !isRefreshing &&
      !refreshError &&
      !autoRefreshRequestedRef.current
    ) {
      autoRefreshRequestedRef.current = true;
      refreshRate();
    }
  }, [
    hasRate,
    isRefreshing,
    refreshError,
    refreshRate,
    refreshVersion,
    remaining,
  ]);

  useEffect(() => {
    if (refreshError) {
      autoRefreshRequestedRef.current = false;
    }
  }, [refreshError]);

  useEffect(() => {
    if (!hasRate) {
      setRemaining(RATE_REFRESH_INTERVAL);
    }
  }, [hasRate]);

  if (!hasRate) {
    return null;
  }

  const tooltipContent = isRefreshing
    ? "Refreshing current rate..."
    : refreshError
    ? "Unable to refresh the current rate. Click to retry."
    : `Rate refreshes automatically every 30 seconds. Next refresh in ${remainingSeconds}s. Click to refresh now.`;

  return (
    <button
      type="button"
      aria-label={tooltipContent}
      disabled={isRefreshing}
      className={cn(
        "inline-flex cursor-pointer items-center rounded-full",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme500",
        isRefreshing && "cursor-wait disabled:cursor-wait",
      )}
      onClick={refreshRate}
    >
      <span className={cn("inline-flex", isRefreshing && "animate-spin")}>
        <CountDown
          numerator={
            isRefreshing
              ? RATE_REFRESH_INTERVAL / 4
              : refreshError
              ? RATE_REFRESH_INTERVAL
              : remaining
          }
          denominator={RATE_REFRESH_INTERVAL}
          size={14}
          width={4}
          backgroundColor="var(--theme100)"
          foregroundColor="var(--theme500)"
          tooltipContent={tooltipContent}
        />
      </span>
    </button>
  );
}
