import { useEffect } from "react";

export default function useRepeat(callback, { delay = 0, isStop = false }) {
  useEffect(() => {
    if (isStop) return;

    let stopped = false;
    let timeoutId;

    const run = async () => {
      if (stopped) {
        return;
      }
      await callback();
      if (!stopped) {
        timeoutId = setTimeout(run, delay);
      }
    };

    run();

    return () => {
      stopped = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [callback, delay, isStop]);
}
