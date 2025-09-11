import React, { useState } from "react";
import AddressComboField from "next-common/components/popup/fields/addressComboField";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";

export default function useAddressInput(title) {
  const extensionAccounts = useExtensionAccounts();
  const [address, setAddress] = useState();

  const component = (
    <AddressComboField
      extensionAccounts={extensionAccounts}
      title={title}
      setAddress={setAddress}
    />
  );

  return { address, component };
}
