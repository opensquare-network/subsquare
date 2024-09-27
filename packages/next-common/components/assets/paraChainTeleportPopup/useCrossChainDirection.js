import Chains from "next-common/utils/consts/chains";
import PopupLabel from "next-common/components/popup/label";
import ChainIcon from "next-common/components/header/chainIcon";
import dynamic from "next/dynamic";
import { useState } from "react";
import { isAssetHubChain } from "next-common/utils/chain";
import { capitalize } from "lodash-es";
import { useChain } from "next-common/context/chain";
import Select from "next-common/components/select";
import collectives from "next-common/utils/consts/settings/collectives";

const SystemCrosschain = dynamic(() =>
  import("@osn/icons/subsquare/SystemCrosschain"),
);

export function Chain({ title, name, disabled, options = [], onChange }) {
  return (
    <div className="flex flex-col grow basis-[calc(100%/2-33px)] shrink-0">
      <PopupLabel text={title} />
      <Select
        value={name}
        disabled={disabled}
        options={options}
        onChange={onChange}
      />
    </div>
  );
}

export function getChainName(chain) {
  if (isAssetHubChain(chain)) {
    return "Asset Hub";
  }
  return capitalize(chain);
}

const relayChainMap = {
  [Chains.collectives]: Chains.polkadot,
  [Chains.polkadotAssetHub]: Chains.polkadot,
  [Chains.westendAssetHub]: Chains.westend,
  [Chains.kusamaAssetHub]: Chains.kusama,
};

export default function useCrossChainDirection() {
  const currChain = useChain();
  const initialSourceChain = relayChainMap[currChain];
  const [sourceChain, setSourceChain] = useState(initialSourceChain);
  const [destinationChain, setDestinationChain] = useState(currChain);

  const component = (
    <div className="flex items-end gap-[12px]">
      <Chain
        title="Source Chain"
        chain={sourceChain}
        disabled
        options={[
          {
            label: (
              <div className="flex items-center gap-x-2">
                <ChainIcon chain={currChain} />
                {getChainName(currChain)}
              </div>
            ),
            value: getChainName(currChain),
          },
        ]}
      />
      <div
        className="cursor-pointer p-[8px] rounded-[8px] border border-neutral400 bg-neutral100"
        onClick={() => {
          setSourceChain(destinationChain);
          setDestinationChain(sourceChain);
        }}
      >
        <SystemCrosschain
          width={24}
          height={24}
          className="[&_path]:fill-textPrimary"
        />
      </div>
      <Chain
        title="Destination Chain"
        chain={destinationChain}
        name={getChainName(destinationChain)}
        onChange={(item) => {
          setDestinationChain(item.value);
        }}
        options={[
          {
            label: (
              <div className="flex items-center gap-x-2">
                <ChainIcon chain={destinationChain} />
                {getChainName(destinationChain)}
              </div>
            ),
            value: getChainName(destinationChain),
          },
          {
            label: (
              <div className="flex items-center gap-x-2">
                <ChainIcon chain={collectives.value} />
                {getChainName(collectives.value)}
              </div>
            ),
            value: getChainName(collectives.value),
          },
        ]}
      />
    </div>
  );

  return {
    sourceChain,
    destinationChain,
    component,
  };
}
