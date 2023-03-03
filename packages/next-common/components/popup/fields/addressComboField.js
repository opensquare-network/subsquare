import React from "react";
import { useEffect, useState } from "react";
import AddressCombo from "../../addressCombo";
import { encodeAddressToChain } from "../../../services/address";
import PopupLabel from "../label";
import { useChain } from "../../../context/chain";

export default function AddressComboField({
  extensionAccounts,
  setAddress,
  title = "Address",
}) {
  const chain = useChain();
  const accounts = extensionAccounts.map((acc) => ({
    address: acc.address,
    name: acc.meta.name,
  }));

  const [targetAddress, setTargetAddress] = useState(
    accounts[0]?.address && encodeAddressToChain(accounts[0]?.address, chain),
  );

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
