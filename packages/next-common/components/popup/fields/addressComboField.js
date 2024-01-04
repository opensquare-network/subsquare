import React from "react";
import { useEffect, useState } from "react";
import AddressCombo from "../../addressCombo";
import PopupLabel from "../label";
import { normalizeAddress } from "next-common/utils/address";

export default function AddressComboField({
  extensionAccounts,
  setAddress,
  title = "Address",
}) {
  const accounts = extensionAccounts.map((acc) => ({
    address: acc.address,
    name: acc.meta.name,
  }));

  const address = normalizeAddress(accounts?.[0]?.address);

  const [targetAddress, setTargetAddress] = useState(address);

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
      />
    </div>
  );
}
