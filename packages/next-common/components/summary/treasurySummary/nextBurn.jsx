import useTreasuryBurn from "next-common/utils/hooks/useTreasuryBurn";
import useApi from "next-common/utils/hooks/useApi";
import { abbreviateBigNumber, toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";

export default function TreasurySummaryNextBurn({ free = 0 }) {
  const api = useApi();
  const nextBurn = useTreasuryBurn(api, free || 0);
  const { symbol, decimals } = useChainSettings();

  return (
    <>
      <span>{abbreviateBigNumber(toPrecision(nextBurn, decimals))}</span>
      <span className="unit upper">{symbol}</span>
    </>
  );
}
