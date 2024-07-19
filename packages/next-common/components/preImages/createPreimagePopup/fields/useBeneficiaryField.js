import AddressComboField from "next-common/components/popup/fields/addressComboField";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import { useState } from "react";

export default function useBeneficiaryField() {
  const [beneficiary, setBeneficiary] = useState("");
  const extensionAccounts = useExtensionAccounts();

  return {
    value: beneficiary,
    component: (
      <AddressComboField
        title="Beneficiary"
        extensionAccounts={extensionAccounts}
        setAddress={setBeneficiary}
      />
    ),
  };
}
