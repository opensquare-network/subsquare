import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";
import useDemoLatestHeight from "next-common/components/treasury/spends/payout/demoHeight";
import { usePayoutQueueIsDemo } from "next-common/components/treasury/spends/payout/sourceContext";

// The demo provider serves canned chain data at its own height. Mixing it with
// the scanned height would flag every demo spend as expired.
export default function useSpendLatestHeight() {
  const isDemo = usePayoutQueueIsDemo();
  const demoHeight = useDemoLatestHeight(isDemo);
  const chainHeight = useAhmLatestHeight();

  return isDemo ? demoHeight : chainHeight;
}
