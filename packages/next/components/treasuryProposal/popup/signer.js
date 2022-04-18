import PopupLabel from "next-common/components/popup/label";
import SignerSelect from "next-common/components/signerSelect";

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
