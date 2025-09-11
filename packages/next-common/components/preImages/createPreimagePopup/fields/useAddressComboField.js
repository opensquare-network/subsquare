import AddressComboField from "next-common/components/popup/fields/addressComboField";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import { useState } from "react";

export default function useAddressComboField({
  title = "Beneficiary",
  defaultAddress = "",
  readOnly,
} = {}) {
  const [address, setAddress] = useState(defaultAddress);
  const extensionAccounts = useExtensionAccounts();

  return {
    value: address,
    component: (
      <AddressComboField
        title={title}
        defaultAddress={address}
        extensionAccounts={extensionAccounts}
        setAddress={setAddress}
        placeholder="Please fill the address or select another one..."
        readOnly={readOnly}
      />
    ),
  };
}
