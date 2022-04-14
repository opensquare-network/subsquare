import SignerSelect from "next-common/components/signerSelect";
import { Label, LabelWrapper } from "./styled";

export default function Signer({
  api,
  extensionAccounts,
  chain,
  signerAccount,
  setSignerAccount,
}) {
  return (
    <div>
      <LabelWrapper>
        <Label>Address</Label>
      </LabelWrapper>
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
