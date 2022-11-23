import React from "react";
import isNil from "lodash.isnil";
import { toPrecision } from "next-common/utils";
import PopupLabelWithBalance from "next-common/components/popup/balanceLabel";
import useSetSignerAccount from "next-common/utils/hooks/useSetSignerAccount";
import { useChainSettings } from "next-common/context/chain";
import PopupLabel from "../label";
// import ConnectedSigner from "../../connectedSigner";
import SignerSelect from "../../signerSelect";

export default function Signer({
  isBalanceLoading,
  balance,
  balanceName = "Balance",
  selectedAccount,
  setSelectedAccount,
  extensionAccounts,
  isLoading,
  symbol,
}) {
  const node = useChainSettings();
  useSetSignerAccount(extensionAccounts, setSelectedAccount);
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
      {/* <ConnectedSigner selectedAccount={selectedAccount} /> */}
      <SignerSelect
        extensionAccounts={extensionAccounts}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        disabled={isLoading}
      />
    </div>
  );
}
