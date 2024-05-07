import React from "react";
import AddressComboField from "next-common/components/popup/fields/addressComboField";
import { useExtensionAccounts } from "../context";

export default function Beneficiary(props) {
  const extensionAccounts = useExtensionAccounts();
  return (
    <AddressComboField
      {...props}
      extensionAccounts={extensionAccounts}
      title="Beneficiary"
    />
  );
}
