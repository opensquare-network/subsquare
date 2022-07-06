import React from "react";
import PopupLabel from "../../../popup/label";
import SignerSelect from "../../../signerSelect";

export default function Signer({
  api,
  extensionAccounts,
  chain,
  signerAccount,
  setSignerAccount,
}) {
  return (
    <div>
      <PopupLabel
        text={"Address"}
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
