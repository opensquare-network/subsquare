import PopupLabel from "next-common/components/popup/label";
import ChainIcon from "next-common/components/header/chainIcon";
import dynamic from "next/dynamic";
import { useState, useMemo, useCallback } from "react";
import { useChain } from "next-common/context/chain";
import Select from "next-common/components/select";
import Chains from "next-common/utils/consts/chains";
import { getRelayChain } from "next-common/utils/chain";

const ArrowLineLeft = dynamic(() =>
  import("@osn/icons/subsquare/ArrowLineLeft"),
);

const POLKADOT_PARACHAINS = Object.freeze([
  {
    name: "Asset Hub",
    value: Chains.polkadotAssetHub,
  },
  {
    name: "Collectives",
    value: Chains.collectives,
  },
  {
    name: "People",
    value: Chains.polkadotPeople,
  },
  {
    name: "Coretime",
    value: Chains.polkadotCoretime,
  },
]);

const KUSAMA_PARACHAINS = Object.freeze([
  {
    name: "Asset Hub",
    value: Chains.kusamaAssetHub,
  },
  {
    name: "People",
    value: Chains.kusamaPeople,
  },
  {
    name: "Coretime",
    value: Chains.kusamaCoretime,
  },
]);

const PASEO_PARACHAINS = Object.freeze([
  {
    name: "Asset Hub",
    value: Chains.paseoAssetHub,
  },
  {
    name: "People",
    value: Chains.paseoPeople,
  },
]);

const WESTEND_PARACHAINS = Object.freeze([
  {
    name: "Asset Hub",
    value: Chains.westendAssetHub,
  },
  {
    name: "People",
    value: Chains.westendPeople,
  },
]);

const PARACHAIN_MAP = Object.freeze({
  [Chains.polkadot]: POLKADOT_PARACHAINS,
  [Chains.kusama]: KUSAMA_PARACHAINS,
  [Chains.paseo]: PASEO_PARACHAINS,
  [Chains.westend]: WESTEND_PARACHAINS,
});

function ChainSelector({ title, value, options = [], onChange }) {
  return (
    <div className="flex flex-col grow basis-[calc(100%/2-33px)] shrink-0">
      <PopupLabel text={title} />
      <Select
        className="!text-textPrimary"
        value={value}
        options={options}
        onChange={onChange}
      />
    </div>
  );
}

function transformToChainOptions(chain) {
  const relayChain = getRelayChain(chain);
  const paraChains = PARACHAIN_MAP[relayChain] || [];

  return paraChains.map(({ value, name, id }) => ({
    icon: <ChainIcon chain={value} />,
    label: name,
    value,
    id,
  }));
}

function ChainSeparator() {
  return (
    <div className="p-[8px] rounded-[8px] border border-neutral400 bg-neutral100">
      <ArrowLineLeft
        width={24}
        height={24}
        className="[&_path]:fill-textPrimary rotate-180"
      />
    </div>
  );
}

export default function useCrossChainTeleport() {
  const currChain = useChain();

  const allChainOptions = useMemo(
    () => transformToChainOptions(currChain),
    [currChain],
  );

  const [sourceChain, setSourceChain] = useState(
    () => allChainOptions[0]?.value || "",
  );
  const [destinationChain, setDestinationChain] = useState(
    () => allChainOptions[1]?.value || "",
  );

  const handleSourceChainChange = useCallback(
    ({ value }) => setSourceChain(value),
    [],
  );

  const handleDestinationChainChange = useCallback(
    ({ value }) => setDestinationChain(value),
    [],
  );

  const component = (
    <div className="flex items-end gap-[12px]">
      <ChainSelector
        title="Source Chain"
        value={sourceChain}
        options={allChainOptions}
        onChange={handleSourceChainChange}
      />
      <ChainSeparator />
      <ChainSelector
        title="Destination Chain"
        value={destinationChain}
        options={allChainOptions}
        onChange={handleDestinationChainChange}
      />
    </div>
  );

  return {
    sourceChain,
    destinationChain,
    component,
  };
}
