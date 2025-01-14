import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useUserAccountInfo } from "next-common/context/user/account";

const AllLocks = () => {
  const { symbol, decimals, voteSymbol } = useChainSettings();
  const { info, isLoading } = useUserAccountInfo();
  const lockedBalance = info?.data?.lockedBalance;

  if (!lockedBalance || isLoading) {
    return null;
  }

  return (
    <div
      className="bg-neutral200 py-1.5 px-4 rounded-lg text14Medium space-x-2 hover:bg-neutral300"
      role="button"
    >
      <span className="text-textTertiary">Reuse all locks</span>
      <ValueDisplay
        className="text-textPrimary"
        value={toPrecision(lockedBalance, decimals)}
        symbol={voteSymbol || symbol}
      />
    </div>
  );
};

export default AllLocks;
