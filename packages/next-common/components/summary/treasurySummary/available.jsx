import { useChainSettings } from "next-common/context/chain";
import { abbreviateBigNumber, toPrecision } from "next-common/utils";

export default function TreasurySummaryAvailable({ free = 0 }) {
  const { decimals, symbol } = useChainSettings();

  return (
    <>
      <span>{abbreviateBigNumber(toPrecision(free || 0, decimals))}</span>
      <span className="unit upper">{symbol}</span>
    </>
  );
}
