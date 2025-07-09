import { useChain } from "next-common/context/chain";
import { fetchMultisigAddresses } from "next-common/services/multisig";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useAsync } from "react-use";
import ImportMultisigEmpty from "./empty";
import Loading from "../loading";
import MultisigRadioGroup from "./multisigRadioGroup";
import { useState } from "react";
import PrimaryButton from "next-common/lib/button/primary";

export default function ImportMultisigContent() {
  const [selectedMultisigAddress, setSelectedMultisigAddress] = useState(null);
  const address = useRealAddress();
  const chain = useChain();
  const { value, loading } = useAsync(async () => {
    const { result } = await fetchMultisigAddresses(chain, address);
    return result?.data?.multisigAddresses;
  }, [chain, address]);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loading className="w-4 h-4" size={24} />
      </div>
    );
  }

  if (value?.multisigAddresses?.length <= 0) {
    return <ImportMultisigEmpty />;
  }

  return (
    <>
      <MultisigRadioGroup
        options={value?.multisigAddresses?.map((item) => ({
          value: item.address,
          label: item.name,
          multisig: item,
        }))}
        selected={selectedMultisigAddress}
        setSelected={setSelectedMultisigAddress}
      />
      <div className="flex items-center justify-end">
        <PrimaryButton disabled={!selectedMultisigAddress}>
          Continue
        </PrimaryButton>
      </div>
    </>
  );
}

export function MultisigAddressItem({ multisigAddress }) {
  return <div>{multisigAddress.address}</div>;
}
