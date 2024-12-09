import React from "react";
import AddressComboField from "next-common/components/popup/fields/addressComboField";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";

export default function DeveloperAddress(props) {
  const extensionAccounts = useExtensionAccounts();
  return (
    <AddressComboField
      {...props}
      extensionAccounts={extensionAccounts}
      title="Developer address"
    />
  );
}
