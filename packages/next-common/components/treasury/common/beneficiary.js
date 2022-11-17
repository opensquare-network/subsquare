import React from "react";
import { useEffect, useState } from "react";
import AddressCombo from "../../addressCombo";
import { encodeAddressToChain } from "../../../services/address";
import PopupLabel from "../../popup/label";
import { useChain } from "../../../context/chain";

export default function Beneficiary({ extensionAccounts, setAddress }) {
  const chain = useChain();
  const accounts = extensionAccounts.map((acc) => ({
    address: acc.address,
    name: acc.meta.name,
  }));

  const [beneficiary, setBeneficiary] = useState(
    accounts[0]?.address && encodeAddressToChain(accounts[0]?.address, chain)
  );

  useEffect(() => {
    setAddress(beneficiary);
  }, [setAddress, beneficiary]);

  return (
    <div>
      <PopupLabel text={"Beneficiary"} />
      <AddressCombo
        address={beneficiary}
        setAddress={setBeneficiary}
        accounts={accounts}
      />
    </div>
  );
}
