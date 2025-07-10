import { useChain } from "next-common/context/chain";
import { fetchMultisigAddresses } from "next-common/services/multisig";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useAsync } from "react-use";
import ImportMultisigEmpty from "./empty";
import Loading from "../loading";
import { useState } from "react";
import MultisigSelect from "./multisigSelect";
import ImportSubmit from "./importSubmit";

const STEPS = {
  SELECT_MULTISIG: 1,
  SUBMIT_MULTISIG: 2,
};

export default function ImportMultisigContent({ closeAll }) {
  const [step, setStep] = useState(STEPS.SELECT_MULTISIG);
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

  if (step === STEPS.SELECT_MULTISIG) {
    return (
      <MultisigSelect
        list={value?.multisigAddresses?.map((item) => ({
          value: item.address,
          label: item.name,
          multisig: item,
        }))}
        selected={selectedMultisigAddress}
        setSelected={setSelectedMultisigAddress}
        onContinue={() => setStep(STEPS.SUBMIT_MULTISIG)}
      />
    );
  }

  if (step === STEPS.SUBMIT_MULTISIG) {
    return (
      <ImportSubmit
        onBack={() => setStep(STEPS.SELECT_MULTISIG)}
        onSuccessed={closeAll}
        selectedMultisig={value?.multisigAddresses.find(
          (item) => item.address === selectedMultisigAddress,
        )}
      />
    );
  }

  return null;
}
