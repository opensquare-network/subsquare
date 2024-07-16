import AddressComboField from "next-common/components/popup/fields/addressComboField";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useState } from "react";

export default function useBeneficiaryField() {
  const [beneficiary, setBeneficiary] = useState("");
  const extensionAccounts = useExtensionAccounts();
  const realAddress = useRealAddress();

  return {
    value: beneficiary,
    component: (
      <AddressComboField
        title="Beneficiary"
        extensionAccounts={extensionAccounts}
        defaultAddress={realAddress}
        setAddress={setBeneficiary}
      />
    ),
  };
}
