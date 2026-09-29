import { useEffect, useState } from "react";

export function useDemoClock() {
  const [clock, setClock] = useState({ now: null, startAt: null });

  useEffect(() => {
    const startAt = Date.now();
    setClock({ now: startAt, startAt });

    const timer = setInterval(() => {
      setClock((prev) => ({ ...prev, now: Date.now() }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return clock;
}

export function remainingMs(clock, durationMs) {
  if (clock?.now == null || durationMs == null) {
    return null;
  }

  return Math.max(0, durationMs - (clock.now - clock.startAt));
}

export function formatCountdown(ms) {
  if (ms == null) {
    return "--";
  }

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value) => String(value).padStart(2, "0");
  const time = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  return days > 0 ? `${days}d ${time}` : time;
}
