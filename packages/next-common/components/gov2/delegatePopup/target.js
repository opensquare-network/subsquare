import React from "react";
import { useEffect, useState } from "react";
import AddressCombo from "../../addressCombo";
import { encodeAddressToChain } from "../../../services/address";
import PopupLabel from "../../popup/label";
import { useChain } from "../../../context/chain";

export default function Target({ extensionAccounts, setAddress }) {
  const chain = useChain();
  const accounts = extensionAccounts.map((acc) => ({
    address: acc.address,
    name: acc.meta.name,
  }));

  const [target, setTarget] = useState(
    accounts[0]?.address && encodeAddressToChain(accounts[0]?.address, chain)
  );

  console.log({ target, accounts });

  useEffect(() => {
    setAddress(target);
  }, [setAddress, target]);

  return (
    <div>
      <PopupLabel text={"Target"} />
      <AddressCombo
        address={target}
        setAddress={setTarget}
        accounts={accounts}
      />
    </div>
  );
}
