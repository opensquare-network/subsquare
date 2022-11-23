import isNil from "lodash.isnil";
import { toPrecision } from "next-common/utils";
import PopupLabelWithBalance from "next-common/components/popup/balanceLabel";
import useSetDefaultSigner from "next-common/utils/hooks/useSetDefaultSigner";
import { useChainSettings } from "next-common/context/chain";
import PopupLabel from "../label";
import ConnectedSigner from "../../connectedSigner";

export default function Signer({
  isBalanceLoading,
  balance,
  balanceName = "Balance",
  selectedAccount,
  setSelectedAccount,
  isLoading,
  extensionAccounts,
  symbol,
}) {
  const node = useChainSettings();
  useSetDefaultSigner(extensionAccounts, setSelectedAccount);
  const noBalance = isNil(balance) && isNil(isBalanceLoading);

  return (
    <div>
      {noBalance ? (
        <PopupLabel text="Address" />
      ) : (
        <PopupLabelWithBalance
          text="Address"
          isLoading={isBalanceLoading}
          balanceName={balanceName}
          balance={toPrecision(balance ?? 0, node.decimals)}
          symbol={symbol || node.symbol}
        />
      )}
      <ConnectedSigner extensionAccounts={extensionAccounts} />
    </div>
  );
}
