import AddressCombo from "next-common/components/addressCombo";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";

export default function AddressParam({ value, setValue }) {
  const extensionAccounts = useExtensionAccounts();
  const accounts = extensionAccounts.map((acc) => ({
    address: acc.address,
    name: acc.meta.name,
  }));
  return (
    <AddressCombo address={value} setAddress={setValue} accounts={accounts} />
  );
}
