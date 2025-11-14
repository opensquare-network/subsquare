import PopupLabel from "next-common/components/popup/label";
import ChainIcon from "next-common/components/header/chainIcon";
import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import { useChain } from "next-common/context/chain";
import Select from "next-common/components/select";
import Chains from "next-common/utils/consts/chains";
import { getRelayChain } from "next-common/utils/chain";

const ArrowLineLeft = dynamic(() =>
  import("@osn/icons/subsquare/ArrowLineLeft"),
);

const PolkadotParaChains = [
  {
    name: "Asset Hub",
    value: Chains.polkadotAssetHub,
    id: 1000,
  },
  {
    name: "Collectives",
    value: Chains.collectives,
    id: 1001,
  },
  {
    name: "People",
    value: Chains.polkadotPeople,
    id: 1004,
  },
  {
    name: "Coretime",
    value: Chains.polkadotCoretime,
    id: 1005,
  },
];

const KusamaParaChains = [
  {
    name: "Asset Hub",
    value: Chains.kusamaAssetHub,
    id: 1000,
  },
  {
    name: "People",
    value: Chains.kusamaPeople,
    id: 1004,
  },
  {
    name: "Coretime",
    value: Chains.kusamaCoretime,
    id: 1005,
  },
];

function getParaChains(chain) {
  if (chain === Chains.polkadot) {
    return PolkadotParaChains;
  } else if (chain === Chains.kusama) {
    return KusamaParaChains;
  }

  return [];
}

export function Chain({
  title,
  value,
  options = [],
  onChange,
  className = "",
}) {
  return (
    <div className="flex flex-col grow basis-[calc(100%/2-33px)] shrink-0">
      <PopupLabel text={title} />
      <Select
        className={className}
        value={value}
        options={options}
        onChange={onChange}
      />
    </div>
  );
}

function getAllChainsOptions(chain) {
  const relayChain = getRelayChain(chain);

  return getParaChains(relayChain).map(({ value, name, id }) => ({
    icon: <ChainIcon chain={value} />,
    label: name,
    value,
    id,
  }));
}

function getCurrentChainOptions(allChainOptions, selectedChain) {
  return allChainOptions.map((option) => {
    if (option.value === selectedChain) {
      return {
        ...option,
        disabled: true,
      };
    }

    return option;
  });
}

export default function useCrossChainTeleport() {
  const currChain = useChain();
  const relayChain = getRelayChain(currChain);
  const allChainOptions = getAllChainsOptions(relayChain);
  const [sourceChain, setSourceChain] = useState(allChainOptions[0].value);
  const [destinationChain, setDestinationChain] = useState(
    allChainOptions[1].value,
  );

  const sourceChainOptions = useMemo(() => {
    return getCurrentChainOptions(allChainOptions, destinationChain);
  }, [allChainOptions, destinationChain]);

  const destinationChainOptions = useMemo(() => {
    return getCurrentChainOptions(allChainOptions, sourceChain);
  }, [allChainOptions, sourceChain]);

  const component = (
    <div className="flex items-end gap-[12px]">
      <Chain
        title="Source Chain"
        value={sourceChain}
        className="!text-textPrimary"
        options={sourceChainOptions}
        onChange={({ value }) => {
          setSourceChain(value);
        }}
      />
      <div className="p-[8px] rounded-[8px] border border-neutral400 bg-neutral100">
        <ArrowLineLeft
          width={24}
          height={24}
          className="[&_path]:fill-textPrimary rotate-180"
        />
      </div>
      <Chain
        title="Destination Chain"
        value={destinationChain}
        className="!text-textPrimary"
        options={destinationChainOptions}
        onChange={({ value }) => {
          setDestinationChain(value);
        }}
      />
    </div>
  );

  return {
    sourceChain,
    destinationChain,
    component,
  };
}
