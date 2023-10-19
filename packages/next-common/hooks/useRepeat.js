import { useCallback, useEffect } from "react";

export default function useRepeat(callback, { delay = 0, isStop = false }) {
  const repeatCallback = useCallback(
    async (state) => {
      if (state.stop) {
        return;
      }
      await callback();
      return setTimeout(() => repeatCallback(state), delay);
    },
    [callback, delay],
  );

  useEffect(() => {
    if (isStop) return;
    const state = { stop: false };
    repeatCallback(state);
    return () => {
      state.stop = true;
    };
  }, [isStop, repeatCallback]);
}
