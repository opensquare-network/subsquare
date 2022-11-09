import React from "react";
import PopupLabelWithBalance from "../../../popup/balanceLabel";
import SignerSelect from "../../../signerSelect";
import { toPrecision } from "../../../../utils";
import useSetDefaultSigner from "../../../../utils/hooks/useSetDefaultSigner";
import { useChainSettings } from "../../../../context/chain";
import useApi from "../../../../utils/hooks/useApi";

export default function Signer({
  extensionAccounts,
  signerAccount,
  setSignerAccount,
  balanceIsLoading,
  balance,
}) {
  const api = useApi();
  const { decimals, symbol } = useChainSettings();
  useSetDefaultSigner(extensionAccounts, setSignerAccount);

  return (
    <div>
      <PopupLabelWithBalance
        text={"Address"}
        isLoading={balanceIsLoading}
        balanceName="Balance"
        balance={toPrecision(balance ?? 0, decimals)}
        symbol={symbol}
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
