import React from "react";
import PopupLabelWithBalance from "../../../popup/balanceLabel";
import SignerSelect from "../../../signerSelect";
import { toPrecision } from "../../../../utils";
import useSetDefaultSigner from "../../../../utils/hooks/useSetDefaultSigner";

export default function Signer({
  api,
  extensionAccounts,
  signerAccount,
  setSignerAccount,
  balanceIsLoading,
  balance,
  node,
}) {
  useSetDefaultSigner(extensionAccounts, setSignerAccount);

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
        selectedAccount={signerAccount}
        setSelectedAccount={setSignerAccount}
        extensionAccounts={extensionAccounts}
      />
    </div>
  );
}
