import AddressComboField from "next-common/components/popup/fields/addressComboField";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import { useState } from "react";

export default function useAddressComboField({
  title = "Beneficiary",
  defaultAddress = "",
} = {}) {
  const [beneficiary, setBeneficiary] = useState(defaultAddress);
  const extensionAccounts = useExtensionAccounts();

  return {
    value: beneficiary,
    component: (
      <AddressComboField
        title={title}
        defaultAddress={beneficiary}
        extensionAccounts={extensionAccounts}
        setAddress={setBeneficiary}
        placeholder="Please fill the address or select another one..."
      />
    ),
  };
}
