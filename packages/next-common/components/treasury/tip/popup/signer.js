import React from "react";
import PopupLabelWithBalance from "../../../popup/balanceLabel";
import SignerSelect from "../../../signerSelect";
import { toPrecision } from "../../../../utils";

export default function Signer({
  api,
  extensionAccounts,
  chain,
  signerAccount,
  setSignerAccount,
  balanceIsLoading,
  balance,
  node,
}) {
  return (
    <div>
      <PopupLabelWithBalance
        text={"Address"}
        isLoading={balanceIsLoading}
        balanceName="Balance"
        balance={toPrecision(balance ?? 0, node.decimals)}
        symbol={node.symbol}
      />
      <SignerSelect
        api={api}
        chain={chain}
        selectedAccount={signerAccount}
        setSelectedAccount={setSignerAccount}
        extensionAccounts={extensionAccounts}
      />
    </div>
  );
}
