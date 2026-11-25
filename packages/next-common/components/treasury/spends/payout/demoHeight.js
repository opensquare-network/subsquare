import { useEffect, useState } from "react";
import { DEMO_BLOCK_INTERVAL_MS, DEMO_HEIGHT } from "./demoData";

// Mock block production for the demo provider: one block per second.
export default function useDemoLatestHeight(enabled = false) {
  const [height, setHeight] = useState(DEMO_HEIGHT);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const timer = setInterval(
      () => setHeight((latest) => latest + 1),
      DEMO_BLOCK_INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, [enabled]);

  return height;
}
