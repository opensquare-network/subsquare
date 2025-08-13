import { useChain } from "next-common/context/chain";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import ImportMultisigEmpty from "./empty";
import Loading from "../loading";
import { useState, useMemo } from "react";
import MultisigSelect from "./multisigSelect";
import ImportSubmit from "./importSubmit";
import { useMultisigAccounts } from "../multisigs/context/multisigAccountsContext";
import { noop } from "lodash-es";
import { normalizeAddress } from "next-common/utils/address";
import { sortAddresses } from "@polkadot/util-crypto";
import { useChainSettings } from "next-common/context/chain";
import useExplorerMultisigHistory from "next-common/hooks/multisig/useExplorerMultisigHistory";

const STEPS = {
  SELECT_MULTISIG: 1,
  SUBMIT_MULTISIG: 2,
};

export default function ImportMultisigContent({ onClose = noop }) {
  const [step, setStep] = useState(STEPS.SELECT_MULTISIG);
  const [selectedMultisigAddress, setSelectedMultisigAddress] = useState(null);
  const address = useRealAddress();
  const chain = useChain();
  const [page, setPage] = useState(1);
  const { loading, items, total } = useExplorerMultisigHistory(
    chain,
    address,
    page,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loading className="w-4 h-4" size={24} />
      </div>
    );
  }

  if (items?.length <= 0) {
    return <ImportMultisigEmpty />;
  }

  if (step === STEPS.SELECT_MULTISIG) {
    return (
      <MultisigSelectImpl
        multisigAddresses={items}
        selected={selectedMultisigAddress}
        setSelected={setSelectedMultisigAddress}
        onContinue={() => setStep(STEPS.SUBMIT_MULTISIG)}
        page={page}
        setPage={setPage}
        total={total}
      />
    );
  }

  if (step === STEPS.SUBMIT_MULTISIG) {
    return (
      <ImportSubmit
        onBack={() => setStep(STEPS.SELECT_MULTISIG)}
        onClose={onClose}
        selectedMultisig={items.find(
          (item) => item.address === selectedMultisigAddress,
        )}
      />
    );
  }

  return null;
}

function MultisigSelectImpl({
  multisigAddresses = [],
  total = 0,
  page = 1,
  setPage = noop,
  onContinue = noop,
  selected,
  setSelected = noop,
}) {
  const { multisigs = [] } = useMultisigAccounts();
  const { ss58Format } = useChainSettings();
  const importedMultisigAddresses = useMemo(() => {
    return multisigs.map((item) => normalizeAddress(item.multisigAddress));
  }, [multisigs]);

  const selectList = useMemo(() => {
    const sortedAddresses = sortAddresses(
      multisigAddresses?.map((item) => item.address) || [],
      ss58Format,
    );

    const sortedMultisigAddresses = sortedAddresses
      .map((address) =>
        multisigAddresses.find((item) => item.address === address),
      )
      .filter(Boolean);

    return (
      sortedMultisigAddresses
        .map((item) => ({
          value: item.address,
          label: item.name,
          multisig: item,
          disabled: importedMultisigAddresses.includes(item.address),
        }))
        // sort disabled items to the end
        .sort((a, b) => {
          if (a.disabled && !b.disabled) return 1;
          if (!a.disabled && b.disabled) return -1;
          return 0;
        })
    );
  }, [multisigAddresses, importedMultisigAddresses, ss58Format]);

  return (
    <MultisigSelect
      list={selectList}
      selected={selected}
      setSelected={setSelected}
      onContinue={onContinue}
      page={page}
      setPage={setPage}
      total={total}
    />
  );
}
