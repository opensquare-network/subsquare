import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";

const LockButton = ({ isLoading, balance, label, onClick }) => {
  const { symbol, decimals, voteSymbol } = useChainSettings();

  if (balance == 0 || isLoading) {
    return null;
  }

  const value = toPrecision(balance, decimals);

  return (
    <div
      className="bg-neutral200 py-1.5 px-4 rounded-lg text14Medium space-x-2 hover:bg-neutral300"
      role="button"
      onClick={() => onClick(value)}
    >
      <span className="text-textTertiary">{label}</span>
      <ValueDisplay
        className="text-textPrimary"
        value={value}
        symbol={voteSymbol || symbol}
      />
    </div>
  );
};

export default LockButton;
