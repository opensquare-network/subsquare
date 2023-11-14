import AddressCombo from "next-common/components/addressCombo";
import {
  useExtensionAccounts,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import { useState } from "react";

export default function AddressParam() {
  const signerAccount = useSignerAccount();
  const [targetAddress, setTargetAddress] = useState(signerAccount?.address);
  const extensionAccounts = useExtensionAccounts();
  const accounts = extensionAccounts.map((acc) => ({
    address: acc.address,
    name: acc.meta.name,
  }));
  return (
    <AddressCombo
      address={targetAddress}
      setAddress={setTargetAddress}
      accounts={accounts}
    />
  );
}
