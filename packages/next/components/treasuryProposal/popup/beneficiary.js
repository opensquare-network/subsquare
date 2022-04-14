import { useEffect, useState } from "react";
import AddressCombo from "next-common/components/addressCombo";
import { encodeAddressToChain } from "next-common/services/address";
import { Label, LabelWrapper } from "./styled";

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
      <LabelWrapper>
        <Label>Beneficiary</Label>
      </LabelWrapper>
      <AddressCombo
        chain={chain}
        address={beneficiary}
        setAddress={setBeneficiary}
        accounts={accounts}
      />
    </div>
  );
}
