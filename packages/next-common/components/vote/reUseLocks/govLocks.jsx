import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import useQueryGovernanceLock from "next-common/hooks/referenda/useQueryGovernanceLock";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

const GovLocks = ({ reUseGovLocks }) => {
  const { symbol, decimals, voteSymbol } = useChainSettings();
  const address = useRealAddress();

  const { balance, isLoading } = useQueryGovernanceLock(address);

  if (isLoading || !balance) {
    return null;
  }

  const value = toPrecision(balance, decimals);

  return (
    <div
      className="bg-neutral200 py-1.5 px-4 rounded-lg text14Medium space-x-2 hover:bg-neutral300"
      role="button"
      onClick={() => reUseGovLocks(value)}
    >
      <span className="text-textTertiary">Reuse governance lock</span>
      <ValueDisplay
        className="text-textPrimary"
        value={value}
        symbol={voteSymbol || symbol}
      />
    </div>
  );
};

export default GovLocks;
