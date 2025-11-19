import React from "react";
import { useEffect, useState } from "react";
import AddressCombo from "../../addressCombo";
import PopupLabel from "../label";

export default function AddressComboField({
  defaultAddress = "",
  extensionAccounts,
  setAddress,
  title = "Address",
  status,
  placeholder,
  readOnly = false,
  canEdit = true,
  comboClassName = "",
  size = "default",
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
      <PopupLabel text={title} status={status} />
      <AddressCombo
        address={targetAddress}
        setAddress={setTargetAddress}
        accounts={accounts}
        readOnly={readOnly}
        placeholder={placeholder}
        className={comboClassName}
        size={size}
        canEdit={canEdit}
      />
    </div>
  );
}
