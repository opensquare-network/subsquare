import Chains from "next-common/utils/consts/chains";
import PopupLabel from "next-common/components/popup/label";
import ChainIcon from "next-common/components/header/chainIcon";
import { cn } from "next-common/utils";
import dynamic from "next/dynamic";
import { useState } from "react";
import {
  isAssetHubChain,
  isPolkadotAssetHubChain,
  isWestendAssetHubChain,
  isWestendChain,
  isPolkadotChain,
} from "next-common/utils/chain";
import { useChain } from "next-common/context/chain";

const SystemCrosschain = dynamic(() =>
  import("@osn/icons/subsquare/SystemCrosschain"),
);

export function Chain({ title, chain, name }) {
  return (
    <div className="flex flex-col grow basis-[calc(100%/2-33px)] shrink-0">
      <PopupLabel text={title} />
      <div
        className={cn(
          "flex border border-neutral400 bg-neutral200 rounded-[8px] overflow-hidden whitespace-nowrap",
          "items-center",
          "text14Medium text-textPrimary",
        )}
      >
        <ChainIcon className="w-[24px] h-[24px] m-[8px]" chain={chain} />
        <span>{name}</span>
      </div>
    </div>
  );
}

export function getChainName(chain) {
  if (isPolkadotChain(chain)) {
    return "Polkadot";
  }

  if (isWestendChain(chain)) {
    return "Westend";
  }

  if (isAssetHubChain(chain)) {
    return "Asset Hub";
  }

  throw new Error("Unsupported chain");
}

export function useInitialChain() {
  const chain = useChain();
  let initialSourceChain = null;
  let initialDestinationChain = null;

  if (isPolkadotAssetHubChain(chain)) {
    initialSourceChain = Chains.polkadot;
    initialDestinationChain = Chains.polkadotAssetHub;
  }

  if (isWestendAssetHubChain(chain)) {
    initialSourceChain = Chains.westend;
    initialDestinationChain = Chains.westendAssetHub;
  }

  return {
    initialSourceChain,
    initialDestinationChain,
  };
}

export default function useCrossChainDirection() {
  const { initialSourceChain, initialDestinationChain } = useInitialChain();

  const [sourceChain, setSourceChain] = useState(initialSourceChain);
  const [destinationChain, setDestinationChain] = useState(
    initialDestinationChain,
  );

  const component = (
    <div className="flex items-end gap-[12px]">
      <Chain
        title="Source Chain"
        chain={sourceChain}
        name={getChainName(sourceChain)}
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
      />
    </div>
  );

  return {
    sourceChain,
    destinationChain,
    component,
  };
}
