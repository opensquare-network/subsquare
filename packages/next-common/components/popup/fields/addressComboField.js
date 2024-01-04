import React from "react";
import { useEffect, useState } from "react";
import AddressCombo from "../../addressCombo";
import PopupLabel from "../label";
import { normalizeAddress } from "next-common/utils/address";
import ChainTypes from "next-common/utils/consts/chainTypes";
import { useChainSettings } from "next-common/context/chain";

export default function AddressComboField({
  extensionAccounts,
  setAddress,
  title = "Address",
}) {
  const { chainType } = useChainSettings();
  let filter = (item) => item.type !== "ethereum";
  if (chainType === ChainTypes.ETHEREUM) {
    filter = (item) => item.type === "ethereum";
  }
  const accounts = extensionAccounts.filter(filter).map((acc) => ({
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
