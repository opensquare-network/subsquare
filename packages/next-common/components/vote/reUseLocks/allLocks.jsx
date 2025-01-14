import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useUserAccountInfo } from "next-common/context/user/account";

const AllLocks = ({ reUseAllLocks }) => {
  const { symbol, decimals, voteSymbol } = useChainSettings();
  const { info, isLoading } = useUserAccountInfo();
  const lockedBalance = info?.data?.lockedBalance;

  if (!lockedBalance || isLoading) {
    return null;
  }

  const value = toPrecision(lockedBalance, decimals);

  return (
    <div
      className="bg-neutral200 py-1.5 px-4 rounded-lg text14Medium space-x-2 hover:bg-neutral300"
      role="button"
      onClick={() => reUseAllLocks(value)}
    >
      <span className="text-textTertiary">Reuse all locks</span>
      <ValueDisplay
        className="text-textPrimary"
        value={value}
        symbol={voteSymbol || symbol}
      />
    </div>
  );
};

export default AllLocks;
