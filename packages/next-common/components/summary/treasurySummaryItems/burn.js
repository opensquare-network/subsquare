import useTreasuryBurn from "next-common/utils/hooks/useTreasuryBurn";
import useApi from "next-common/utils/hooks/useApi";
import { abbreviateBigNumber, toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";

export default function TreasuryBurn({ free = 0 }) {
  const api = useApi();
  const nextBurn = useTreasuryBurn(api, free);
  const { symbol, decimals } = useChainSettings();

  return (
    <>
      <span>{abbreviateBigNumber(toPrecision(nextBurn, decimals))}</span>
      <span className="unit upper">{symbol}</span>
    </>
  );
}
