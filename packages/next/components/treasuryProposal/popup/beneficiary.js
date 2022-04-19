import { useEffect, useState } from "react";
import AddressCombo from "next-common/components/addressCombo";
import { encodeAddressToChain } from "next-common/services/address";
import PopupLabel from "next-common/components/popup/label";

export default function Beneficiary({ extensionAccounts, chain, setAddress }) {
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
        chain={chain}
        address={beneficiary}
        setAddress={setBeneficiary}
        accounts={accounts}
      />
    </div>
  );
}
