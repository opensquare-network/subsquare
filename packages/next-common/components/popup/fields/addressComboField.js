import React from "react";
import { useEffect, useState } from "react";
import AddressCombo from "../../addressCombo";
import PopupLabel from "../label";

export default function AddressComboField({
  defaultAddress = "",
  extensionAccounts,
  setAddress,
  title = "Address",
  placeholder,
  readOnly = false,
}) {
  const accounts = extensionAccounts.map((acc) => ({
    address: acc.address,
    name: acc.meta.name,
  }));

  const [targetAddress, setTargetAddress] = useState(defaultAddress);

  useEffect(() => {
    setAddress(targetAddress);
  }, [setAddress, targetAddress]);

  return (
    <div>
      <PopupLabel text={title} />
      <AddressCombo
        address={targetAddress}
        setAddress={setTargetAddress}
        accounts={accounts}
        readOnly={readOnly}
        placeholder={placeholder}
      />
    </div>
  );
}
